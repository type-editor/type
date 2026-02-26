import {isFalse} from '@type-editor/commons';
import {Mark, type Node, type TextNode} from '@type-editor/model';

import type {MarkdownSerializerOptions} from '../types/MarkdownSerializerOptions';
import type {MarkSerializerFunc, MarkSerializerSpec} from '../types/MarkSerializerSpec';
import type {NodeSerializerFunc} from '../types/NodeSerializerFunc';

/**
 * This is an object used to track state and expose
 * methods related to markdown serialization. Instances are passed to
 * node and mark serialization methods (see `toMarkdown`).
 */
export class MarkdownSerializerState {

    private static readonly BLANK_MARK: MarkSerializerSpec = {open: '', close: '', mixable: true};
    private static readonly ESCAPE_REGEX = /[`*\\~[\]_]/g;
    private static readonly WORD_CHAR_REGEX = /\w/;
    private static readonly START_OF_LINE_PLUS_OR_MINUS_REGEX = /^(\+ |[-*>])/;
    private static readonly START_OF_LINE_HASH_REGEX = /^(\s*)(#{1,6})(\s|$)/;
    private static readonly START_OF_LINE_NUMBER_REGEX = /^(\s*\d+)\.\s/;

    private delim = '';
    private atBlockStart = false;
    private inTightList = false;
    private readonly nodes: Record<string, NodeSerializerFunc>;
    private readonly marks: Record<string, MarkSerializerSpec>;
    private readonly options: MarkdownSerializerOptions;

    private _out = '';
    private _closed: Node | null = null;
    private _inAutolink: boolean | undefined = undefined;

    /**
     * Create a new serializer state for tracking the markdown serialization process.
     *
     * @param nodes - A record mapping node type names to their serializer functions
     * @param marks - A record mapping mark type names to their serializer specifications
     * @param options - Configuration options for the serializer behavior
     */
    constructor(
        nodes: Record<string, NodeSerializerFunc>,
        marks: Record<string, MarkSerializerSpec>,
        options: MarkdownSerializerOptions) {
        this.nodes = nodes;
        this.marks = marks;
        this.options = options;

        // Set default values for undefined options
        if (typeof this.options.tightLists === 'undefined') {
            this.options.tightLists = false;
        }

        if (typeof this.options.hardBreakNodeName === 'undefined') {
            this.options.hardBreakNodeName = 'hard_break';
        }
    }

    get out(): string {
        return this._out;
    }

    set out(out: string) {
        this._out = out;
    }

    get closed(): Node | null {
        return this._closed;
    }

    get inAutolink(): boolean | undefined {
        return this._inAutolink;
    }

    set inAutolink(inAutolink: boolean | undefined) {
        this._inAutolink = inAutolink;
    }

    /**
     * Flush a closed block, adding blank lines as needed.
     *
     * @param size - The number of blank lines to add (default: 2)
     */
    public flushClose(size = 2): void {
        if (this._closed) {
            if (!this.atBlank()) {
                this._out += '\n';
            }

            if (size > 1) {
                let delimMin: string = this.delim;
                const trim: RegExpExecArray | null = /\s+$/.exec(delimMin);
                if (trim) {
                    delimMin = delimMin.slice(0, delimMin.length - trim[0].length);
                }

                for (let i = 1; i < size; i++) {
                    this._out += delimMin + '\n';
                }
            }
            this._closed = null;
        }
    }

    /**
     * Render a block, prefixing each line with `delim`, and the first
     * line in `firstDelim`. `node` should be the node that is closed at
     * the end of the block, and `callbackFunc` is a function that renders the
     * content of the block.
     *
     * @param delim - The delimiter to prefix to each line
     * @param firstDelim - The delimiter for the first line (uses `delim` if null)
     * @param node - The node being wrapped
     * @param callbackFunc - A function that renders the block content
     */
    public wrapBlock(delim: string,
                     firstDelim: string | null,
                     node: Node,
                     callbackFunc: () => void): void {
        const old: string = this.delim;
        this.write(firstDelim ?? delim);
        this.delim += delim;
        callbackFunc();
        this.delim = old;
        this.closeBlock(node);
    }

    /**
     * Check if the output is currently at a blank position (empty or ends with newline).
     *
     * @returns True if the output is empty or ends with a newline
     */
    public atBlank(): boolean {
        return /(^|\n)$/.test(this._out);
    }

    /**
     * Ensure the current content ends with a newline.
     */
    public ensureNewLine(): void {
        if (!this.atBlank()) {
            this._out += '\n';
        }
    }

    /**
     * Prepare the state for writing output (closing closed paragraphs,
     * adding delimiters, and so on), and then optionally add content
     * (unescaped) to the output.
     *
     * @param content - Optional content to add to the output (unescaped)
     */
    public write(content?: string): void {
        this.flushClose();
        if (this.delim && this.atBlank()) {
            this._out += this.delim;
        }

        if (content) {
            this._out += content;
        }
    }

    /**
     * Close the block for the given node.
     *
     * @param node - The node whose block is being closed
     */
    public closeBlock(node: Node): void {
        this._closed = node;
    }

    /**
     * Add the given text to the document. When escape is not `false`,
     * it will be escaped.
     *
     * @param text - The text content to add
     * @param escape - Whether to escape special Markdown characters (default: true)
     */
    public text(text: string, escape = true): void {
        const lines: Array<string> = text.split('\n');

        for (let i = 0; i < lines.length; i++) {
            this.write();

            // Escape exclamation marks before links
            if (!escape && lines[i].startsWith('[') && /(^|[^\\])!$/.test(this._out)) {
                this._out = this._out.slice(0, this._out.length - 1) + '\\!';
            }

            this._out += escape ? this.esc(lines[i], this.atBlockStart) : lines[i];
            if (i !== lines.length - 1) {
                this._out += '\n';
            }
        }
    }

    /**
     * Render the contents of `parent` as block nodes.
     *
     * @param parent - The parent node whose children will be rendered
     */
    public renderContent(parent: Node): void {
        parent.forEach((node: Node, _: number, i: number): void => {
            this.render(node, parent, i);
        });
    }

    /**
     * Render the contents of `parent` as inline content.
     *
     * @param parent - The parent node whose inline content will be rendered
     * @param fromBlockStart - Whether rendering starts from the beginning of a block
     */
    public renderInline(parent: Node, fromBlockStart = true): void {
        this.atBlockStart = fromBlockStart;
        const active: Array<Mark> = [];
        let trailing = '';

        const progress = (node: Node | null, _offset: number, index: number): void => {
            let marks: ReadonlyArray<Mark> = node ? node.marks : [];

            // Remove marks from `hard_break` that are the last node inside
            // that mark to prevent parser edge cases with new lines just
            // before closing marks.
            if (node?.type.name === this.options.hardBreakNodeName) {
                marks = marks.filter((mark: Mark): boolean => {
                    if (index + 1 === parent.childCount) {
                        return false;
                    }
                    const next: Node = parent.child(index + 1);
                    return mark.isInSet(next.marks) && (!next.isText || /\S/.test(next.text));
                });
            }

            // Carry over trailing whitespace from previous node
            let leading: string = trailing;
            trailing = '';

            // If whitespace has to be expelled from the node, adjust
            // leading and trailing accordingly.
            // This is necessary for marks like emphasis that don't allow leading/trailing spaces
            // inside the mark syntax (CommonMark spec requirement)
            if (node
                && node.isText
                && marks.some((mark: Mark): boolean => {
                    const info: MarkSerializerSpec = this.getMark(mark.type.name);
                    return info && info.expelEnclosingWhitespace && !mark.isInSet(active);
                })) {
                // Extract leading whitespaces
                // For example, with input "  hello world":
                // lead = "  " (two spaces)
                // rest = "hello world"
                const [_, lead, rest] = /^(\s*)(.*)$/m.exec(node.text);
                if (lead) {
                    leading += lead;
                    node = rest ? (node as TextNode).withText(rest) : null;
                    if (!node) {
                        marks = active;
                    }
                }
            }

            if (node
                && node.isText
                && marks.some((mark: Mark): boolean => {
                    const info: MarkSerializerSpec = this.getMark(mark.type.name);
                    return info
                        && info.expelEnclosingWhitespace
                        && (index === parent.childCount - 1 || !this.markContinuesAfter(parent, index, mark));
                })) {
                // Extract trailing whitespaces
                // For example, with input "hello world  ":
                // trail = "  " (two spaces)
                // rest = "hello world"
                const [_, rest, trail] = /^(.*?)(\s*)$/m.exec(node.text);
                if (trail) {
                    trailing = trail;
                    node = rest ? (node as TextNode).withText(rest) : null;
                    if (!node) {
                        marks = active;
                    }
                }
            }

            // Get the innermost mark and check if it disables escaping (e.g., code marks)
            const inner: Mark | null = marks.length ? marks[marks.length - 1] : null;
            const noEsc: boolean = inner && isFalse(this.getMark(inner.type.name).escape);
            // Don't include non-escaping marks in the normal mark processing
            const len: number = marks.length - (noEsc ? 1 : 0);


            // Try to reorder 'mixable' marks, such as em and strong, which
            // in Markdown may be opened and closed in different order, so
            // that order of the marks for the token matches the order in
            // active. This allows us to write **a *b*** instead of closing
            // and reopening marks unnecessarily.
            outer: for (let i = 0; i < len; i++) {
                const mark: Mark = marks[i];
                // Stop if we hit a non-mixable mark (like code)
                if (!this.getMark(mark.type.name).mixable) {
                    break;
                }

                // Look for this mark in the active set
                for (let j = 0; j < active.length; j++) {
                    const other: Mark = active[j];
                    if (!this.getMark(other.type.name).mixable) {
                        break;
                    }

                    // If we find a match, reorder the marks array to match active order
                    if (mark.eq(other)) {
                        if (i > j) {
                            marks = marks.slice(0, j).concat(mark).concat(marks.slice(j, i)).concat(marks.slice(i + 1, len));
                        } else if (j > i) {
                            marks = marks.slice(0, i).concat(marks.slice(i + 1, j)).concat(mark).concat(marks.slice(j, len));
                        }
                        continue outer;
                    }
                }
            }

            // Find the prefix of the mark set that didn't change
            // This allows us to keep marks open across multiple nodes
            let keep = 0;
            while (keep < Math.min(active.length, len) && marks[keep].eq(active[keep])) {
                ++keep;
            }

            // Close the marks that need to be closed (pop from the end)
            while (keep < active.length) {
                this.text(this.markString(active.pop(), false, parent, index), false);
            }

            // Output any previously expelled trailing whitespace outside the marks
            if (leading) {
                this.text(leading);
            }

            // Open the marks that need to be opened (push to the end)
            if (node) {
                while (active.length < len) {
                    const add: Mark = marks[active.length];
                    active.push(add);
                    this.text(this.markString(add, true, parent, index), false);
                    this.atBlockStart = false;
                }

                // Render the node. Special case code marks, since their content
                // may not be escaped. Handle code marks separately to avoid escaping
                // their content.
                if (noEsc && node.isText) {
                    const markString: string = this.markString(inner, true, parent, index);
                    const nexMarkString: string = this.markString(inner, false, parent, index + 1);
                    this.text(markString + node.text + nexMarkString, false);
                } else {
                    this.render(node, parent, index);
                }
                this.atBlockStart = false;
            }

            // After the first non-empty text node is rendered, the end of output
            // is no longer at block start.
            //
            // FIXME: If a non-text node writes something to the output for this
            // block, the end of output is also no longer at block start. But how
            // can we detect that?
            if (node?.isText && node.nodeSize > 0) {
                this.atBlockStart = false;
            }
        };

        parent.forEach(progress);
        progress(null, 0, parent.childCount);
        this.atBlockStart = false;
    }

    /**
     * Render a node's content as a list. `delim` should be the extra
     * indentation added to all lines except the first in an item,
     * `firstDelim` is a function going from an item index to a
     * delimiter for the first line of the item.
     *
     * @param node - The list node to render
     * @param delim - The delimiter/indentation for continuation lines
     * @param firstDelim - A function that returns the delimiter for the first line of each item
     */
    public renderList(node: Node,
                      delim: string,
                      firstDelim: (index: number) => string): void {
        if (this._closed?.type === node.type) {
            this.flushClose(3);
        } else if (this.inTightList) {
            this.flushClose(1);
        }

        const isTight: boolean = typeof node.attrs.tight !== 'undefined' ? !!node.attrs.tight : this.options.tightLists;
        const prevTight: boolean = this.inTightList;
        this.inTightList = isTight;

        node.forEach((child: Node, _: number, i: number): void => {
            if (i && isTight) {
                this.flushClose(1);
            }
            this.wrapBlock(delim, firstDelim(i), node, () => {
                this.render(child, node, i);
            });
        });

        this.inTightList = prevTight;
    }

    /**
     * Escape the given string so that it can safely appear in Markdown
     * content. If `startOfLine` is true, also escape characters that
     * have special meaning only at the start of the line.
     *
     * @param str - The string to escape
     * @param startOfLine - Whether to also escape start-of-line special characters
     * @returns The escaped string
     */
    public esc(str: string, startOfLine = false): string {
        const replacerFunc = (match: string, i: number): string => {
            return (
                match === '_'
                && i > 0
                && i + 1 < str.length
                && MarkdownSerializerState.WORD_CHAR_REGEX.test(str[i - 1])
                && MarkdownSerializerState.WORD_CHAR_REGEX.test(str[i + 1])
                    ? match
                    : '\\' + match);
        };
        str = str.replace(MarkdownSerializerState.ESCAPE_REGEX, replacerFunc);

        if (startOfLine) {
            str = str
                .replace(MarkdownSerializerState.START_OF_LINE_PLUS_OR_MINUS_REGEX, '\\$&')
                .replace(MarkdownSerializerState.START_OF_LINE_HASH_REGEX, '$1\\$2$3')
                .replace(MarkdownSerializerState.START_OF_LINE_NUMBER_REGEX, '$1\\. ');
        }

        if (this.options.escapeExtraCharacters) {
            str = str.replace(this.options.escapeExtraCharacters, '\\$&');
        }
        return str;
    }

    /**
     * Wrap a string with appropriate quote characters.
     * Chooses double quotes, single quotes, or parentheses based on the content.
     *
     * @param str - The string to quote
     * @returns The quoted string
     */
    public quote(str: string): string {
        const wrap = !str.includes('"')
            ? '""'
            : !str.includes('\'')
                ? '\'\''
                : '()';

        return wrap[0] + str + wrap[1];
    }

    /**
     * Repeat the given string `n` times.
     *
     * @param str - The string to repeat
     * @param n - The number of times to repeat the string
     * @returns The repeated string
     */
    public repeat(str: string, n: number): string {
        return str.repeat(n);
    }

    /**
     * Get the markdown string for a given opening or closing mark.
     *
     * @param mark - The mark to get the string for
     * @param open - Whether to get the opening (true) or closing (false) string
     * @param parent - The parent node containing the marked content
     * @param index - The index of the marked content within its parent
     * @returns The markdown string for the mark
     */
    public markString(mark: Mark,
                      open: boolean,
                      parent: Node,
                      index: number): string {
        const info: MarkSerializerSpec = this.getMark(mark.type.name);
        const value: string | MarkSerializerFunc = open ? info.open : info.close;
        return typeof value === 'string' ? value : value(this, mark, parent, index);
    }

    /**
     * Get leading and trailing whitespace from a string. Values of
     * leading or trailing property of the return object will be undefined
     * if there is no match.
     *
     * @param text - The text to extract whitespace from
     * @returns An object containing the leading and trailing whitespace (if any)
     */
    public getEnclosingWhitespace(text: string): { leading?: string, trailing?: string } {
        return {
            leading: ((/^(\s+)/.exec(text)) || [undefined])[0],
            trailing: ((/(\s+)$/.exec(text)) || [undefined])[0]
        };
    }

    /**
     * Check if a mark effectively continues after the node at the given index.
     * This accounts for hard breaks that will have their marks stripped when they
     * are at the end of a marked section.
     *
     * @param parent - The parent node
     * @param index - The index of the current node
     * @param mark - The mark to check
     * @returns True if the mark continues on the next node after accounting for hard break mark stripping
     */
    private markContinuesAfter(parent: Node, index: number, mark: Mark): boolean {
        const next: Node = parent.child(index + 1);

        // If the mark is not on the next node, it doesn't continue
        if (!mark.isInSet(next.marks)) {
            return false;
        }

        // If the next node is a hard break, check if its marks would be stripped
        if (next.type.name === this.options.hardBreakNodeName) {
            // Hard break marks are stripped if it's the last child
            if (index + 2 === parent.childCount) {
                return false;
            }
            // Or if the mark doesn't continue past the hard break to a non-whitespace text
            const afterHardBreak: Node = parent.child(index + 2);
            return mark.isInSet(afterHardBreak.marks) && (!afterHardBreak.isText || /\S/.test(afterHardBreak.text));
        }

        return true;
    }

    /**
     * Get the serializer specification for a mark type.
     *
     * @param name - The name of the mark type
     * @returns The mark serializer specification
     * @throws Error if strict mode is enabled and the mark type is not supported
     */
    private getMark(name: string): MarkSerializerSpec {
        const info: MarkSerializerSpec = this.marks[name];
        if (!info) {
            if (this.options.strict) {
                throw new Error(`Mark type '${name}' not supported by Markdown renderer`);
            }
            return MarkdownSerializerState.BLANK_MARK;
        }
        return info;
    }

    /**
     * Render the given node as a block.
     *
     * @param node - The node to render
     * @param parent - The parent node containing this node
     * @param index - The index of this node within its parent
     */
    private render(node: Node, parent: Node, index: number): void {
        if (this.nodes[node.type.name]) {
            this.nodes[node.type.name](this, node, parent, index);
        } else {
            if (this.options.strict) {
                throw new Error(`Token type '${node.type.name}' not supported by Markdown renderer`);
            } else if (!node.type.isLeaf) {
                if (node.type.inlineContent) {
                    this.renderInline(node);
                } else {
                    this.renderContent(node);
                }

                if (node.isBlock) {
                    this.closeBlock(node);
                }
            }
        }
    }
}
