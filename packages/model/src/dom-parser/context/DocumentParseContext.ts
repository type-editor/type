import {hasOwnProperty, isFalse, isUndefinedOrNull,} from '@type-editor/commons';
import {ELEMENT_NODE, TEXT_NODE} from '@type-editor/commons';

import type {Fragment} from '../../elements/Fragment';
import {BLOCK_TAGS, IGNORE_TAGS, LIST_TAGS,} from '../../elements/html-tags';
import {Mark} from '../../elements/Mark';
import type {Node as PmNode} from '../../elements/Node';
import type {ResolvedPos} from '../../elements/ResolvedPos';
import type {MarkType} from '../../schema/MarkType';
import type {NodeType} from '../../schema/NodeType';
import type {Schema} from '../../schema/Schema';
import type {ContentMatch} from '../../types/content-parser/ContentMatch';
import type {DOMParseContext} from '../../types/dom-parser/DOMParseContext';
import type {NodeParseContext} from '../../types/dom-parser/NodeParseContext';
import type {ParseOptions} from '../../types/dom-parser/ParseOptions';
import type {StyleParseRule} from '../../types/dom-parser/StyleParseRule';
import type {TagParseRule} from '../../types/dom-parser/TagParseRule';
import type {Attrs} from '../../types/schema/Attrs';
import {DOMParser} from '../DOMParser';
import {ContextFlags} from './ContextFlags';
import {DocumentNodeParseContext} from './DocumentNodeParseContext';

/**
 * Document position comparison flags from Node.compareDocumentPosition().
 * These bitmask flags indicate the relative position of nodes in the document tree.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
 */
enum DocumentPosition {

    /** Flag indicating the node precedes the reference node (comes before in document order) */
    PRECEDING = 2,

    /** Flag indicating the node follows the reference node (comes after in document order) */
    FOLLOWING = 4
}

/**
 * Manages the state and operations for parsing DOM content into ProseMirror nodes.
 *
 * @remarks
 * ParseContext maintains a stack of NodeParseContext objects representing the hierarchy
 * of nodes being built during parsing. It handles DOM traversal, content matching,
 * mark application, and position tracking.
 */
export class DocumentParseContext implements DOMParseContext {

    /** Regex for matching and replacing multiple whitespace characters */
    private static readonly REGEX_WHITESPACE = /[ \t\r\n\f]+/g;

    /** Regex for finding the first non-whitespace character */
    private static readonly REGEX_WHITESPACE_AT_START = /[^ \t\r\n\f]/;

    /** Regex for matching whitespace at the end of a string */
    private static readonly REGEX_WHITESPACE_AT_END = /[ \t\r\n\f]$/;

    /** Regex for matching a single line break (Unix or Windows style) */
    private static readonly REGEX_LINEBREAK = /\r?\n|\r/;

    /** Regex for matching any line break character */
    private static readonly REGEX_LINEBREAK_ANY_TYPE = /[\r\n]/;

    /** Regex for matching and replacing all line breaks */
    private static readonly REGEX_LINEBREAKS = /\r?\n|\r/g;

    /** Regex for matching and replacing Windows-style carriage returns */
    private static readonly REGEX_LINEBREAKS_WIN_CARRIAGE_RETURN = /\r\n?/g;

    /** The DOM parser instance containing schema and parse rules */
    private readonly parser: DOMParser;

    /** Configuration options for the parsing operation */
    private readonly options: ParseOptions;

    /** Whether the context was created in an open state (allows open-ended parsing) */
    private readonly isOpen: boolean;

    /** Array of DOM positions to track during parsing, will be populated with document positions */
    private readonly find: Array<{ node: Node, offset: number, pos?: number; }> | undefined;

    /** Stack of node contexts representing the hierarchy of nodes being built */
    private readonly nodes: Array<NodeParseContext>;

    /** Index of the currently open node context in the nodes array */
    private open = 0;

    /** Whether we need to insert a block node before inline content */
    private needsBlock: boolean;

    /** Whether whitespace preservation is enabled for the current local context */
    private localPreserveWS = false;

    /**
     * Creates a new parse context for converting DOM to ProseMirror nodes.
     *
     * @param parser - The DOM parser instance with schema and parse rules
     * @param options - Configuration options for the parsing operation
     * @param isOpen - Whether the context should start in an open state
     *
     * @remarks
     * Initializes the node context stack with an appropriate top-level context
     * based on the provided options and whether parsing is open-ended.
     */
    constructor(parser: DOMParser, options: ParseOptions, isOpen: boolean) {
        this.parser = parser;
        this.options = options;
        this.isOpen = isOpen;

        const topNode: PmNode = options.topNode;
        const topOptions: number = this.whitespaceOptionsFor(null, options.preserveWhitespace, 0) | (isOpen ? ContextFlags.OPT_OPEN_LEFT : 0);
        const topContext: NodeParseContext = this.createTopContext(topNode, topOptions, parser, options, isOpen);

        this.nodes = new Array<NodeParseContext>(topContext);
        this.find = options.findPositions;
        this.needsBlock = false;
    }

    /**
     * Gets the currently active node context at the top of the stack.
     *
     * @returns The node context being currently built
     */
    get top(): NodeParseContext {
        return this.nodes[this.open];
    }

    /**
     * Calculates the current document position based on content added so far.
     *
     * @returns The position in the document being constructed
     *
     * @remarks
     * This method:
     * 1. Ensures all extra contexts are closed
     * 2. Sums the size of all content in open contexts
     * 3. Accounts for the opening positions of parent nodes
     */
    get currentPos(): number {
        this.closeExtra();
        let pos = 0;
        for (let i = this.open; i >= 0; i--) {
            const content: Array<PmNode> = this.nodes[i].content;
            for (let j = content.length - 1; j >= 0; j--) {
                pos += content[j].nodeSize;
            }
            if (i) {
                pos++; // Account for the opening token of parent nodes
            }
        }
        return pos;
    }

    /**
     * Parses and adds all child nodes from a DOM element to the current context.
     *
     * @param parent - The DOM node whose children should be parsed
     * @param marks - The marks to apply to the parsed content
     * @param startIndex - Optional starting index of child nodes to parse (inclusive, defaults to 0)
     * @param endIndex - Optional ending index of child nodes to parse (exclusive, defaults to all children)
     *
     * @remarks
     * If startIndex and endIndex are not provided, all children are parsed.
     * The method handles position tracking and synchronization after each node.
     */
    public addAll(parent: Node,
                  marks: ReadonlyArray<Mark>,
                  startIndex?: number,
                  endIndex?: number): void {
        let index = startIndex || 0;
        let dom: ChildNode = startIndex ? parent.childNodes[startIndex] : parent.firstChild;
        const end: ChildNode = isUndefinedOrNull(endIndex) ? null : parent.childNodes[endIndex];

        // eslint-disable-next-line eqeqeq
        while (dom != end) {
            this.findAtPoint(parent, index);
            this.addDOM(dom, marks);
            dom = dom.nextSibling;
            index++;
        }
        this.findAtPoint(parent, index);
    }

    /**
     * Completes the parsing process and returns the final result.
     *
     * @returns The parsed content as either a complete Node or a Fragment
     *
     * @remarks
     * This method:
     * 1. Resets the open level to the root context
     * 2. Closes all open node contexts
     * 3. Performs final validation and content filling according to schema requirements
     * 4. Returns the completed top-level node or fragment
     */
    public finish(): PmNode | Fragment {
        this.open = 0;
        this.closeExtra(this.isOpen);
        return this.nodes[0].finish(isFalse(this.isOpen || this.options.topOpen));
    }

    /**
     * Determines whether the given context string matches this context.
     *
     * @param context - A context string to match against
     * @returns True if the context matches, false otherwise
     *
     * @remarks
     * Context strings specify ancestor node requirements using slash-separated paths:
     * - "doc/blockquote/paragraph" matches a paragraph in a blockquote in a doc
     * - Empty path segments ("//") act as wildcards matching any depth
     * - Pipe characters ("|") separate alternative contexts (OR logic)
     * - Names can match node types or node groups
     *
     * Examples:
     * - "paragraph" matches if we're directly in a paragraph
     * - "blockquote/" matches a blockquote with any content
     * - "doc//paragraph" matches a paragraph anywhere inside doc
     * - "list|blockquote" matches either list or blockquote contexts
     */
    public matchesContext(context: string): boolean {
        // Handle OR alternatives (pipe-separated)
        if (context.includes('|')) {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            return context.split(/\s*\|\s*/).some(this.matchesContext, this);
        }

        const parts: Array<string> = context.split('/');
        const contextOption: ResolvedPos | undefined = this.options.context;
        const useRoot: boolean = !this.isOpen && (!contextOption || contextOption.parent.type === this.nodes[0].type);
        const minDepth: number = this.calculateMinDepth(contextOption, useRoot);

        return this.matchContextParts(parts, parts.length - 1, this.open, minDepth, contextOption, useRoot);
    }

    /**
     * Creates the initial top-level node context based on parsing options.
     *
     * @param topNode - The node to use as the top container, if specified
     * @param topOptions - The parsing options bitfield for the top context
     * @param parser - The DOM parser instance
     * @param options - The parsing options
     * @param isOpen - Whether parsing is open-ended
     * @returns A new NodeParseContext for the top level
     */
    private createTopContext(topNode: PmNode | undefined,
                             topOptions: number,
                             parser: DOMParser,
                             options: ParseOptions,
                             isOpen: boolean): NodeParseContext {
        if (topNode) {
            return new DocumentNodeParseContext(
                topNode.type,
                topNode.attrs,
                Mark.none,
                true,
                options.topMatch || topNode.type.contentMatch,
                topOptions
            );
        } else if (isOpen) {
            return new DocumentNodeParseContext(null, null, Mark.none, true, null, topOptions);
        } else {
            return new DocumentNodeParseContext(parser.schema.topNodeType, null, Mark.none, true, null, topOptions);
        }
    }

    /**
     * Calculates the minimum depth for context matching.
     *
     * @param contextOption - The context position from options
     * @param useRoot - Whether to include the root node
     * @returns The minimum depth to search
     */
    private calculateMinDepth(contextOption: ResolvedPos | undefined, useRoot: boolean): number {
        const contextDepth = contextOption ? contextOption.depth + 1 : 0;
        const rootOffset = useRoot ? 0 : 1;
        return -contextDepth + rootOffset;
    }

    /**
     * Recursively matches context path parts against the node hierarchy.
     *
     * @param parts - Array of path segments from the context string
     * @param partIndex - Current index in parts array (counting backwards)
     * @param depth - Current depth in the node stack
     * @param minDepth - Minimum depth boundary
     * @param contextOption - Additional context from options
     * @param useRoot - Whether root node is included
     * @returns True if the context matches at this level
     */
    private matchContextParts(parts: ReadonlyArray<string>,
                              partIndex: number,
                              depth: number,
                              minDepth: number,
                              contextOption: ResolvedPos | undefined,
                              useRoot: boolean): boolean {
        for (let i = partIndex; i >= 0; i--) {
            const part: string = parts[i];

            if (part === '') {
                // Empty segment acts as wildcard
                if (this.isEdgeWildcard(i, parts.length)) {
                    continue; // Skip leading/trailing empty segments
                }

                // Try matching at all possible depths
                return this.matchWildcardAtAnyDepth(parts, i, depth, minDepth, contextOption, useRoot);
            }

            // Get node type at current depth
            const nodeType: NodeType = this.getNodeTypeAtDepth(depth, minDepth, contextOption, useRoot);

            if (!this.nodeMatchesPart(nodeType, part)) {
                return false;
            }

            depth--;
        }

        return true;
    }

    /**
     * Checks if an empty path segment is at the edge (beginning or end).
     *
     * @param index - The segment index
     * @param length - Total number of segments
     * @returns True if this is a leading or trailing empty segment
     */
    private isEdgeWildcard(index: number, length: number): boolean {
        return index === length - 1 || index === 0;
    }

    /**
     * Attempts to match a wildcard segment at various depths.
     *
     * @param parts - Array of path segments
     * @param partIndex - Current part index
     * @param depth - Current depth
     * @param minDepth - Minimum depth boundary
     * @param contextOption - Additional context
     * @param useRoot - Whether root is included
     * @returns True if match found at any depth
     */
    private matchWildcardAtAnyDepth(parts: ReadonlyArray<string>,
                                    partIndex: number,
                                    depth: number,
                                    minDepth: number,
                                    contextOption: ResolvedPos | undefined,
                                    useRoot: boolean): boolean {
        for (let d = depth; d >= minDepth; d--) {
            if (this.matchContextParts(parts, partIndex - 1, d, minDepth, contextOption, useRoot)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Gets the node type at a specific depth in the context hierarchy.
     *
     * @param depth - The depth to query
     * @param minDepth - Minimum depth boundary
     * @param contextOption - Additional context from options
     * @param useRoot - Whether root node is included
     * @returns The node type at that depth, or null if none
     */
    private getNodeTypeAtDepth(depth: number,
                               minDepth: number,
                               contextOption: ResolvedPos | undefined,
                               useRoot: boolean): NodeType | null {
        if (depth > 0 || (depth === 0 && useRoot)) {
            return this.nodes[depth].type;
        } else if (contextOption && depth >= minDepth) {
            return contextOption.node(depth - minDepth).type;
        }
        return null;
    }

    /**
     * Checks if a node type matches a context path part.
     *
     * @param nodeType - The node type to check
     * @param part - The path part (node name or group name)
     * @returns True if the node matches
     */
    private nodeMatchesPart(nodeType: NodeType | null, part: string): boolean {
        if (!nodeType) {
            return false;
        }
        return nodeType.name === part || nodeType.isInGroup(part);
    }


    /**
     * Processes a DOM node and adds it to the current context.
     *
     * @param dom - The DOM node to process
     * @param marks - The marks to apply to content generated from this node
     *
     * @remarks
     * This method dispatches to the appropriate handler based on node type:
     * - Text nodes (nodeType 3) are processed as text content
     * - Element nodes (nodeType 1) are processed according to parse rules
     * - Other node types are ignored
     */
    private addDOM(dom: Node, marks: ReadonlyArray<Mark>): void {
        if (dom.nodeType === TEXT_NODE) {
            this.addTextNode(dom as Text, marks);
        } else if (dom.nodeType === ELEMENT_NODE) {
            this.addElement(dom as HTMLElement, marks);
        }
    }

    /**
     * Processes a DOM text node and adds it to the current context.
     *
     * @param dom - The DOM text node to process
     * @param marks - The marks to apply to the generated text
     *
     * @remarks
     * This method handles whitespace normalization, line break replacement,
     * and position tracking according to the current whitespace preservation settings.
     */
    private addTextNode(dom: Text, marks: ReadonlyArray<Mark>): void {
        let value: string = dom.nodeValue;
        const top: NodeParseContext = this.top;
        const preserveWS: string | boolean = this.getPreserveWhitespaceMode(top);
        const {schema} = this.parser;

        if (preserveWS === 'full' || top.inlineContext(dom) || DocumentParseContext.REGEX_WHITESPACE_AT_START.test(value)) {
            value = this.normalizeTextContent(value, preserveWS, top, dom, schema, marks);

            if (value) {
                const isWhitespaceOnly = !/\S/.test(value);
                this.insertNode(schema.text(value), marks, isWhitespaceOnly);
            }
            this.findInText(dom);
        } else {
            this.findInside(dom);
        }
    }

    /**
     * Determines the whitespace preservation mode for the current context.
     *
     * @param top - The current node context
     * @returns The whitespace mode: 'full', true, or false
     */
    private getPreserveWhitespaceMode(top: NodeParseContext): string | boolean {
        if (top.options & ContextFlags.OPT_PRESERVE_WS_FULL) {
            return 'full';
        }
        return this.localPreserveWS || (top.options & ContextFlags.OPT_PRESERVE_WS) > 0;
    }

    /**
     * Normalizes text content according to whitespace preservation rules.
     *
     * @param value - The text content to normalize
     * @param preserveWS - The whitespace preservation mode
     * @param top - The current node context
     * @param dom - The DOM text node
     * @param schema - The editor schema
     * @param marks - The marks to apply
     * @returns The normalized text content
     */
    private normalizeTextContent(value: string,
                                 preserveWS: string | boolean,
                                 top: NodeParseContext,
                                 dom: Text,
                                 schema: Schema,
                                 marks: ReadonlyArray<Mark>): string {
        if (!preserveWS) {
            return this.collapseWhitespace(value, top, dom);
        } else if (preserveWS === 'full') {
            return value.replace(DocumentParseContext.REGEX_LINEBREAKS_WIN_CARRIAGE_RETURN, '\n');
        } else if (this.shouldReplaceLinebreaks(value, schema)) {
            this.insertTextWithLinebreaks(value, schema, marks);
            return '';
        } else {
            return value.replace(DocumentParseContext.REGEX_LINEBREAKS, ' ');
        }
    }

    /**
     * Collapses whitespace in text content according to HTML rules.
     *
     * @param value - The text content
     * @param top - The current node context
     * @param dom - The DOM text node
     * @returns The text with collapsed whitespace
     */
    private collapseWhitespace(value: string, top: NodeParseContext, dom: Text): string {
        value = value.replace(DocumentParseContext.REGEX_WHITESPACE, ' ');

        // Strip leading whitespace if appropriate
        if (/^[ \t\r\n\f]/.test(value) && this.open === this.nodes.length - 1) {
            const nodeBefore: PmNode = top.content[top.content.length - 1];
            const domNodeBefore: ChildNode = dom.previousSibling;

            if (this.shouldStripLeadingWhitespace(nodeBefore, domNodeBefore)) {
                value = value.slice(1);
            }
        }

        return value;
    }

    /**
     * Determines if leading whitespace should be stripped from text.
     *
     * @param nodeBefore - The node before this text in the content
     * @param domNodeBefore - The previous sibling in the DOM
     * @returns True if leading whitespace should be removed
     */
    private shouldStripLeadingWhitespace(nodeBefore: PmNode | undefined, domNodeBefore: ChildNode | null): boolean {
        return !nodeBefore
            || domNodeBefore?.nodeName === 'BR'
            || (nodeBefore.isText && DocumentParseContext.REGEX_WHITESPACE_AT_END.test(nodeBefore.text));
    }

    /**
     * Checks if linebreaks in text should be replaced with linebreak nodes.
     *
     * @param value - The text content
     * @param schema - The editor schema
     * @returns True if linebreaks should be replaced
     */
    private shouldReplaceLinebreaks(value: string, schema: Schema): boolean {
        return Boolean(schema.linebreakReplacement)
            && DocumentParseContext.REGEX_LINEBREAK_ANY_TYPE.test(value)
            && this.top.findWrapping(schema.linebreakReplacement.create()) !== null;
    }

    /**
     * Inserts text with line breaks replaced by linebreak nodes.
     *
     * @param value - The text content with line breaks
     * @param schema - The editor schema
     * @param marks - The marks to apply
     */
    private insertTextWithLinebreaks(value: string, schema: Schema, marks: ReadonlyArray<Mark>): void {
        const lines: Array<string> = value.split(DocumentParseContext.REGEX_LINEBREAK);
        for (let i = 0; i < lines.length; i++) {
            if (i > 0) {
                this.insertNode(schema.linebreakReplacement.create(), marks, true);
            }
            if (lines[i]) {
                const isWhitespaceOnly = !/\S/.test(lines[i]);
                this.insertNode(schema.text(lines[i]), marks, isWhitespaceOnly);
            }
        }
    }

    /**
     * Processes a DOM element and adds it to the current context according to parse rules.
     *
     * @param dom - The HTML element to process
     * @param marks - The marks to apply to content from this element
     * @param matchAfter - Optional rule to continue matching after (for non-consuming rules)
     *
     * @remarks
     * This method:
     * 1. Checks if whitespace preservation should be enabled for this element
     * 2. Normalizes list structures if needed
     * 3. Finds the appropriate parse rule for the element
     * 4. Applies the rule to generate ProseMirror content
     */
    private addElement(dom: HTMLElement, marks: ReadonlyArray<Mark>, matchAfter?: TagParseRule): void {
        const shouldPreserveWS = this.shouldPreserveWhitespace(dom);
        if (shouldPreserveWS) {
            this.localPreserveWS = true;
        }

        const elementName: string = dom.nodeName.toLowerCase();

        if (this.shouldNormalizeList(elementName)) {
            this.normalizeList(dom);
        }

        const {rule, ruleID} = this.findParseRule(dom, matchAfter);
        this.applyWithRule(rule, dom, marks, elementName, this.top, ruleID, this.localPreserveWS);
    }

    /**
     * Checks if whitespace should be preserved for an element.
     *
     * @param dom - The HTML element to check
     * @returns True if whitespace should be preserved
     */
    private shouldPreserveWhitespace(dom: HTMLElement): boolean {
        return dom.tagName === 'PRE' || dom.style?.whiteSpace?.includes('pre');
    }

    /**
     * Checks if a list element should be normalized.
     *
     * @param elementName - The lowercase element name
     * @returns True if the element should be normalized
     */
    private shouldNormalizeList(elementName: string): boolean {
        return hasOwnProperty(LIST_TAGS, elementName) && this.parser.normalizeLists;
    }

    /**
     * Finds the appropriate parse rule for a DOM element.
     *
     * @param dom - The DOM element to find a rule for
     * @param matchAfter - Optional rule to continue matching after
     * @returns An object containing the rule and its ID (if from parser)
     */
    private findParseRule(dom: HTMLElement, matchAfter?: TagParseRule): {
        rule: Omit<TagParseRule, 'tag'>,
        ruleID: TagParseRule | undefined
    } {
        const ruleFromNode: Omit<TagParseRule, 'tag'> = this.options.ruleFromNode?.(dom);

        if (ruleFromNode) {
            return {rule: ruleFromNode, ruleID: undefined};
        }

        const ruleID: TagParseRule = this.parser.matchTag(dom, this, matchAfter);
        return {rule: ruleID, ruleID};
    }

    /**
     * Applies a parse rule to process a DOM element.
     *
     * @param rule - The parse rule to apply, or undefined/null
     * @param dom - The HTML element being processed
     * @param marks - Current marks to apply
     * @param name - The lowercase element name
     * @param top - The current node context
     * @param ruleID - The full rule with tag, if from parser
     * @param outerWS - The outer whitespace preservation state
     *
     * @remarks
     * This method handles three cases:
     * 1. Ignored elements: tracked for positions but content is skipped
     * 2. Skipped/transparent elements: content is parsed without the element wrapper
     * 3. Normal elements: parsed according to the rule's specifications
     */
    private applyWithRule(rule: Omit<TagParseRule, 'tag'>,
                          dom: HTMLElement,
                          marks: ReadonlyArray<Mark>,
                          name: string,
                          top: NodeParseContext,
                          ruleID: TagParseRule | undefined,
                          outerWS: boolean): void {
        const shouldIgnore: boolean = rule ? rule.ignore : hasOwnProperty(IGNORE_TAGS, name);

        if (shouldIgnore) {
            this.handleIgnoredElement(dom, marks);
        } else if (!rule || rule.skip || rule.closeParent) {
            this.handleTransparentElement(rule, dom, marks, name, top, outerWS);
        } else {
            this.handleNormalElement(rule, dom, marks, ruleID);
        }

        this.localPreserveWS = outerWS;
    }

    /**
     * Handles an element that should be ignored during parsing.
     *
     * @param dom - The DOM element to ignore
     * @param marks - Current marks (for fallback handling)
     */
    private handleIgnoredElement(dom: HTMLElement, marks: ReadonlyArray<Mark>): void {
        this.findInside(dom);
        this.ignoreFallback(dom, marks);
    }

    /**
     * Handles an element that should be treated transparently (skip or closeParent).
     *
     * @param rule - The parse rule (may be null/undefined)
     * @param dom - The HTML element
     * @param marks - Current marks
     * @param name - The lowercase element name
     * @param top - Current node context
     * @param outerWS - Outer whitespace state
     */
    private handleTransparentElement(rule: Omit<TagParseRule, 'tag'> | undefined,
                                     dom: HTMLElement,
                                     marks: ReadonlyArray<Mark>,
                                     name: string,
                                     top: NodeParseContext,
                                     outerWS: boolean): void {
        let targetElement: HTMLElement = dom;

        if (rule?.closeParent) {
            this.open = Math.max(0, this.open - 1);
        } else if (rule && typeof rule.skip === 'object' && rule.skip !== null && 'nodeType' in rule.skip) {
            targetElement = rule.skip as HTMLElement;
        }

        const {shouldSync, updatedTop} = this.handleBlockContext(name, top);
        const oldNeedsBlock: boolean = this.needsBlock;

        if (!targetElement.firstChild) {
            this.leafFallback(targetElement, marks);
            this.localPreserveWS = outerWS;
            return;
        }

        const innerMarks: ReadonlyArray<Mark> = rule?.skip ? marks : this.readStyles(targetElement, marks);
        if (innerMarks) {
            this.addAll(targetElement, innerMarks);
        }

        if (shouldSync) {
            this.sync(updatedTop);
        }

        this.needsBlock = oldNeedsBlock;
    }

    /**
     * Handles block element context adjustments.
     *
     * @param name - The element name
     * @param top - Current node context
     * @returns Object with sync flag and potentially updated top context
     */
    private handleBlockContext(name: string, top: NodeParseContext): { shouldSync: boolean, updatedTop: NodeParseContext } {
        let shouldSync = false;
        let updatedTop: NodeParseContext = top;

        if (hasOwnProperty(BLOCK_TAGS, name)) {
            if (top.content.length && top.content[0].isInline && this.open) {
                this.open--;
                updatedTop = this.top;
            }
            shouldSync = true;
            if (!updatedTop.type) {
                this.needsBlock = true;
            }
        }

        return {shouldSync, updatedTop};
    }

    /**
     * Handles a normal element with a specific parse rule.
     *
     * @param rule - The parse rule to apply
     * @param dom - The HTML element
     * @param marks - Current marks
     * @param ruleID - The full rule with tag
     */
    private handleNormalElement(rule: Omit<TagParseRule, 'tag'>,
                                dom: HTMLElement,
                                marks: ReadonlyArray<Mark>,
                                ruleID: TagParseRule | undefined): void {
        const innerMarks: ReadonlyArray<Mark> = this.readStyles(dom, marks);
        if (innerMarks) {
            this.addElementByRule(dom, rule as TagParseRule, innerMarks, !rule.consuming ? ruleID : undefined);
        }
    }

    /**
     * Handles leaf DOM nodes (elements with no children) when no specific rule applies.
     *
     * @param dom - The leaf DOM node
     * @param marks - The marks to apply to generated content
     *
     * @remarks
     * Currently handles BR elements by converting them to newline characters
     * when in inline content contexts.
     */
    private leafFallback(dom: Node, marks: ReadonlyArray<Mark>): void {
        if (dom.nodeName === 'BR' && this.top.type?.inlineContent) {
            this.addTextNode(dom.ownerDocument.createTextNode('\n'), marks);
        }
    }

    /**
     * Handles ignored DOM nodes to ensure proper context is maintained.
     *
     * @param dom - The ignored DOM node
     * @param marks - The marks to apply if content needs to be generated
     *
     * @remarks
     * For BR elements in non-inline contexts, this creates a temporary inline context
     * by finding a place for a text node, ensuring the parser state remains valid.
     */
    private ignoreFallback(dom: Node, marks: ReadonlyArray<Mark>): void {
        // Ignored BR nodes should at least create an inline context
        if (dom.nodeName === 'BR' && (!this.top.type?.inlineContent)) {
            this.findPlace(this.parser.schema.text('-'), marks, true);
        }
    }

    /**
     * Processes CSS styles on a DOM element and updates marks accordingly.
     *
     * @param dom - The HTML element with styles to process
     * @param marks - The current array of marks
     * @returns Updated marks array, or null if any style rule has `ignore` set
     *
     * @remarks
     * This method:
     * 1. Iterates through style properties defined in the parser's matched styles
     * 2. Applies style parse rules to generate or remove marks
     * 3. Handles both consuming and non-consuming rules
     * 4. Returns null if any rule indicates the element should be ignored
     *
     * Note: We query specific style properties rather than iterating style.item
     * because CSS properties are normalized (e.g., text-decoration becomes multiple properties).
     */
    private readStyles(dom: HTMLElement, marks: ReadonlyArray<Mark>): ReadonlyArray<Mark> | null {
        const styles: CSSStyleDeclaration = dom.style;

        if (!styles?.length) {
            return marks;
        }

        let updatedMarks: ReadonlyArray<Mark> = marks;

        for (const styleName of this.parser.matchedStyles) {
            const styleValue: string = styles.getPropertyValue(styleName);

            if (styleValue) {
                const result: ReadonlyArray<Mark> = this.applyStyleRules(styleName, styleValue, updatedMarks);
                if (isUndefinedOrNull(result)) {
                    return null; // Element should be ignored
                }
                updatedMarks = result;
            }
        }

        return updatedMarks;
    }

    /**
     * Applies all matching style rules for a specific CSS property.
     *
     * @param styleName - The CSS property name
     * @param styleValue - The CSS property value
     * @param marks - The current marks array
     * @returns Updated marks array, or null if any rule indicates ignore
     */
    private applyStyleRules(styleName: string,
                            styleValue: string,
                            marks: ReadonlyArray<Mark>): ReadonlyArray<Mark> | null {
        let updatedMarks: ReadonlyArray<Mark> = marks;
        let after: StyleParseRule | undefined = undefined;

        while (true) {
            const rule: StyleParseRule = this.parser.matchStyle(styleName, styleValue, this, after);
            if (!rule) {
                break;
            }

            if (rule.ignore) {
                return null;
            }

            updatedMarks = this.applyStyleRule(rule, updatedMarks);

            if (isFalse(rule.consuming)) {
                after = rule;
            } else {
                break;
            }
        }

        return updatedMarks;
    }

    /**
     * Applies a single style rule to update the marks array.
     *
     * @param rule - The style parse rule to apply
     * @param marks - The current marks array
     * @returns Updated marks array
     */
    private applyStyleRule(rule: StyleParseRule, marks: ReadonlyArray<Mark>): ReadonlyArray<Mark> {
        if (rule.clearMark) {
            return marks.filter((mark: Mark): boolean => !rule.clearMark(mark));
        } else {
            const newMark: Mark = this.parser.schema.marks[rule.mark].create(rule.attrs);
            return marks.concat(newMark);
        }
    }

    /**
     * Processes a DOM element according to a specific parse rule.
     *
     * @param dom - The HTML element to process
     * @param rule - The parse rule defining how to handle this element
     * @param marks - The current marks to apply
     * @param continueAfter - Optional rule to continue matching after (for non-consuming rules)
     *
     * @remarks
     * This method handles three types of rules:
     * 1. Node rules: Create a ProseMirror node (either leaf or with content)
     * 2. Mark rules: Add a mark to be applied to content
     * 3. Content rules: Use getContent to generate nodes directly
     *
     * For non-leaf nodes, the method opens a new context, processes content,
     * and then closes the context.
     */
    private addElementByRule(dom: HTMLElement,
                             rule: TagParseRule,
                             marks: ReadonlyArray<Mark>,
                             continueAfter?: TagParseRule): void {
        let shouldSync = false;
        let nodeType: NodeType | undefined;
        let updatedMarks: ReadonlyArray<Mark>;

        // Handle node or mark rule
        if (rule.node) {
            const result = this.handleNodeRule(rule, marks, dom);
            nodeType = result.nodeType;
            shouldSync = result.shouldSync;
            updatedMarks = result.marks;
        } else {
            updatedMarks = this.handleMarkRule(rule, marks);
        }

        // Process element content
        const startIn: NodeParseContext = this.top;
        this.processElementContent(dom, rule, updatedMarks, continueAfter, nodeType);

        // Close context if needed
        if (shouldSync && this.sync(startIn)) {
            this.open--;
        }
    }

    /**
     * Handles a parse rule that creates a node.
     *
     * @param rule - The parse rule
     * @param marks - Current marks
     * @param dom - The DOM element
     * @returns Object with nodeType, shouldSync flag, and updated marks
     */
    private handleNodeRule(rule: TagParseRule,
                           marks: ReadonlyArray<Mark>,
                           dom: HTMLElement): { nodeType: NodeType, shouldSync: boolean, marks: ReadonlyArray<Mark> } {
        const nodeType: NodeType = this.parser.schema.nodes[rule.node];
        let shouldSync = false;
        let updatedMarks: ReadonlyArray<Mark>;

        if (!nodeType.isLeaf) {
            const inner: ReadonlyArray<Mark> = this.enter(nodeType, rule.attrs || null, marks, rule.preserveWhitespace);
            if (inner) {
                shouldSync = true;
                updatedMarks = inner;
            } else {
                updatedMarks = marks;
            }
        } else {
            updatedMarks = marks;
            const node: PmNode = nodeType.create(rule.attrs);
            const isBR = dom.nodeName === 'BR';
            if (!this.insertNode(node, marks, isBR)) {
                this.leafFallback(dom, marks);
            }
        }

        return {nodeType, shouldSync, marks: updatedMarks};
    }

    /**
     * Handles a parse rule that creates a mark.
     *
     * @param rule - The parse rule
     * @param marks - Current marks
     * @returns Updated marks array with the new mark added
     */
    private handleMarkRule(rule: TagParseRule, marks: ReadonlyArray<Mark>): ReadonlyArray<Mark> {
        const markType: MarkType = this.parser.schema.marks[rule.mark];
        return marks.concat(markType.create(rule.attrs));
    }

    /**
     * Processes the content of an element according to the rule specifications.
     *
     * @param dom - The HTML element
     * @param rule - The parse rule
     * @param marks - Current marks
     * @param continueAfter - Optional rule to continue matching
     * @param nodeType - The node type if this is a node rule
     */
    private processElementContent(dom: HTMLElement,
                                  rule: TagParseRule,
                                  marks: ReadonlyArray<Mark>,
                                  continueAfter: TagParseRule | undefined,
                                  nodeType: NodeType | undefined): void {
        if (nodeType?.isLeaf) {
            this.findInside(dom);
        } else if (continueAfter) {
            this.addElement(dom, marks, continueAfter);
        } else if (rule.getContent) {
            this.processGetContent(dom, rule, marks);
        } else {
            this.processRegularContent(dom, rule, marks);
        }
    }

    /**
     * Processes content using the rule's getContent function.
     *
     * @param dom - The HTML element
     * @param rule - The parse rule with getContent
     * @param marks - Current marks
     */
    private processGetContent(dom: HTMLElement, rule: TagParseRule, marks: ReadonlyArray<Mark>): void {
        this.findInside(dom);
        rule.getContent(dom, this.parser.schema).forEach((node: PmNode) => {
            this.insertNode(node, marks, false);
        });
    }

    /**
     * Processes regular element content by parsing child nodes.
     *
     * @param dom - The HTML element
     * @param rule - The parse rule
     * @param marks - Current marks
     */
    private processRegularContent(dom: HTMLElement, rule: TagParseRule, marks: ReadonlyArray<Mark>): void {
        const contentDOM: HTMLElement = this.getContentElement(dom, rule);

        this.findAround(dom, contentDOM, true);
        this.addAll(contentDOM, marks);
        this.findAround(dom, contentDOM, false);
    }

    /**
     * Gets the element that contains the content to be parsed.
     *
     * @param dom - The original HTML element
     * @param rule - The parse rule that may specify a content element
     * @returns The element containing the content to parse
     */
    private getContentElement(dom: HTMLElement, rule: TagParseRule): HTMLElement {
        if (typeof rule.contentElement === 'string') {
            return dom.querySelector(rule.contentElement);
        } else if (typeof rule.contentElement === 'function') {
            return rule.contentElement(dom);
        } else if (rule.contentElement) {
            return rule.contentElement;
        }
        return dom;
    }

    /**
     * Finds a valid position to insert a node in the current context.
     *
     * @param node - The node to find a place for
     * @param marks - The marks to apply to the node
     * @param cautious - Whether to stop at solid node boundaries
     * @returns Updated marks if a place was found, or null if impossible
     *
     * @remarks
     * This method searches up the context stack to find a position where the node
     * can be inserted. It may add wrapper nodes to make the insertion valid.
     * The search uses a penalty system to prefer shallower insertions and avoid
     * crossing solid node boundaries when in cautious mode.
     */
    private findPlace(node: PmNode, marks: ReadonlyArray<Mark>, cautious: boolean): ReadonlyArray<Mark> | null {
        let bestRoute: ReadonlyArray<NodeType> | undefined;
        let syncContext: NodeParseContext | undefined;
        let penalty = 0;

        for (let depth = this.open; depth >= 0; depth--) {
            const NodeParseContext: NodeParseContext = this.nodes[depth];
            const wrapping: ReadonlyArray<NodeType> | null = NodeParseContext.findWrapping(node);

            if (wrapping && (!bestRoute || wrapping.length + penalty < bestRoute.length)) {
                bestRoute = wrapping;
                syncContext = NodeParseContext;
                if (!wrapping.length) {
                    break; // Perfect fit found
                }
            }

            if (NodeParseContext.solid) {
                if (cautious) {
                    break; // Don't cross solid boundaries in cautious mode
                }
                penalty += 2; // Penalize crossing solid boundaries
            }
        }

        if (!bestRoute) {
            return null;
        }

        this.sync(syncContext);

        // Add wrapper nodes
        let updatedMarks: ReadonlyArray<Mark> = marks;
        for (const wrapperType of bestRoute) {
            updatedMarks = this.enterInner(wrapperType, null, updatedMarks, false);
        }

        return updatedMarks;
    }

    /**
     * Attempts to insert a node into the current context.
     *
     * @param node - The node to insert
     * @param marks - The marks to apply to the node
     * @param cautious - Whether to be cautious about crossing boundaries
     * @returns True if insertion succeeded, false otherwise
     *
     * @remarks
     * This method:
     * 1. Ensures a block context exists if needed for inline content
     * 2. Finds a valid place to insert the node
     * 3. Filters marks to only those allowed by the context
     * 4. Adds the node to the current context's content
     */
    private insertNode(node: PmNode, marks: ReadonlyArray<Mark>, cautious: boolean): boolean {
        // Ensure block context for inline content if needed
        if (node.isInline && this.needsBlock && !this.top.type) {
            const block: NodeType = this.textblockFromContext();
            if (block) {
                marks = this.enterInner(block, null, marks);
            }
        }

        const innerMarks: ReadonlyArray<Mark> = this.findPlace(node, marks, cautious);
        if (!innerMarks) {
            return false;
        }

        this.closeExtra();
        const top: NodeParseContext = this.top;

        // Update content match
        if (top.match) {
            top.match = top.match.matchType(node.type);
        }

        // Filter marks to only those allowed in this context
        const allowedMarks: ReadonlyArray<Mark> = this.filterAllowedMarks(innerMarks.concat(node.marks), top, node.type);
        top.content.push(node.mark(allowedMarks));

        return true;
    }

    /**
     * Filters marks to only those allowed by the context.
     *
     * @param marks - All marks to consider
     * @param top - The current node context
     * @param nodeType - The type of node the marks will be applied to
     * @returns Array of allowed marks
     */
    private filterAllowedMarks(marks: ReadonlyArray<Mark>, top: NodeParseContext, nodeType: NodeType): ReadonlyArray<Mark> {
        let allowedMarks: ReadonlyArray<Mark> = Mark.none;

        for (const mark of marks) {
            const isAllowed: boolean = top.type
                ? top.type.allowsMarkType(mark.type)
                : this.markMayApply(mark.type, nodeType);

            if (isAllowed) {
                allowedMarks = mark.addToSet(allowedMarks);
            }
        }

        return allowedMarks;
    }

    /**
     * Attempts to start a new node context of the given type.
     *
     * @param type - The node type to enter
     * @param attrs - Attributes for the node
     * @param marks - Current marks
     * @param preserveWS - Whitespace preservation mode for this node
     * @returns Updated marks if successful, or null if impossible
     *
     * @remarks
     * This method finds a valid place to insert a node of the given type,
     * then opens a new context for building that node's content.
     */
    private enter(type: NodeType,
                  attrs: Attrs | null,
                  marks: ReadonlyArray<Mark>,
                  preserveWS?: boolean | 'full'): ReadonlyArray<Mark> | null {
        let innerMarks: ReadonlyArray<Mark> = this.findPlace(type.create(attrs), marks, false);
        if (innerMarks) {
            innerMarks = this.enterInner(type, attrs, marks, true, preserveWS);
        }
        return innerMarks;
    }

    /**
     * Opens a new node context on the stack.
     *
     * @param type - The node type
     * @param attrs - Node attributes
     * @param marks - Current marks
     * @param solid - Whether this context is solid (shouldn't be exited when finding places)
     * @param preserveWS - Whitespace preservation mode
     * @returns Marks that weren't absorbed into the new context
     *
     * @remarks
     * This method:
     * 1. Closes any extra open contexts
     * 2. Updates the parent's content match
     * 3. Separates marks into those that apply to the new node vs. its content
     * 4. Creates and pushes a new NodeParseContext onto the stack
     */
    private enterInner(type: NodeType,
                       attrs: Attrs | null,
                       marks: ReadonlyArray<Mark>,
                       solid = false,
                       preserveWS?: boolean | 'full'): ReadonlyArray<Mark> {
        this.closeExtra();
        const top: NodeParseContext = this.top;
        top.match = top.match?.matchType(type);

        let options: number = this.whitespaceOptionsFor(type, preserveWS, top.options);

        // Propagate OPT_OPEN_LEFT if the parent is open and has no content yet
        if ((top.options & ContextFlags.OPT_OPEN_LEFT) && top.content.length === 0) {
            options |= ContextFlags.OPT_OPEN_LEFT;
        }

        // Separate marks into those applied to the node vs. those that continue
        let applyMarks: ReadonlyArray<Mark> = Mark.none;
        const remainingMarks = marks.filter((mark: Mark): boolean => {
            const allowed: boolean = top.type
                ? top.type.allowsMarkType(mark.type)
                : this.markMayApply(mark.type, type);

            if (allowed) {
                applyMarks = mark.addToSet(applyMarks);
                return false; // Remove from remaining marks
            }
            return true; // Keep in remaining marks
        });

        this.nodes.push(new DocumentNodeParseContext(type, attrs, applyMarks, solid, null, options));
        this.open++;

        return remainingMarks;
    }

    /**
     * Closes all node contexts above the currently open level.
     *
     * @param openEnd - Whether to leave nodes open-ended (without filling required trailing content)
     *
     * @remarks
     * This method finishes any contexts that have been opened above the current
     * open level and adds their finished nodes to their parent's content.
     * It's typically called before manipulating the context stack.
     */
    private closeExtra(openEnd = false): void {
        let i = this.nodes.length - 1;
        if (i > this.open) {
            for (; i > this.open; i--) {
                this.nodes[i - 1].content.push(this.nodes[i].finish(openEnd) as PmNode);
            }
            this.nodes.length = this.open + 1;
        }
    }

    /**
     * Synchronizes the open context to a specific node context.
     *
     * @param to - The target node context to sync to
     * @returns True if the context was found and synced, false otherwise
     *
     * @remarks
     * This method searches for the target context in the stack and sets
     * the open level to that context. If localPreserveWS is enabled,
     * it propagates that setting to all contexts traversed.
     */
    private sync(to: NodeParseContext): boolean {
        for (let i = this.open; i >= 0; i--) {
            if (this.nodes[i] === to) {
                this.open = i;
                return true;
            } else if (this.localPreserveWS) {
                this.nodes[i].options |= ContextFlags.OPT_PRESERVE_WS;
            }
        }
        return false;
    }

    /**
     * Updates position tracking for a specific point in the DOM.
     *
     * @param parent - The parent DOM node
     * @param offset - The child offset within the parent
     *
     * @remarks
     * If position tracking is enabled and a tracked position matches
     * this parent/offset pair, records the current document position.
     */
    private findAtPoint(parent: Node, offset: number): void {
        if (this.find) {
            for (const item of this.find) {
                if (item.node === parent && item.offset === offset) {
                    item.pos = this.currentPos;
                }
            }
        }
    }

    /**
     * Updates position tracking for DOM nodes inside a container.
     *
     * @param parent - The container DOM node
     *
     * @remarks
     * For any tracked positions contained within this element node,
     * records the current document position.
     */
    private findInside(parent: Node): void {
        if (this.find) {
            for (const item of this.find) {
                if (isUndefinedOrNull(item.pos) && parent.nodeType === ELEMENT_NODE && parent.contains(item.node)) {
                    item.pos = this.currentPos;
                }
            }
        }
    }

    /**
     * Updates position tracking for DOM nodes around a content element.
     *
     * @param parent - The parent DOM element
     * @param content - The content DOM element (may be same as parent)
     * @param before - Whether to track positions before (true) or after (false) the content
     *
     * @remarks
     * For tracked positions within the parent but positioned before or after
     * the content element (based on the before parameter), records the current position.
     * Uses compareDocumentPosition to determine relative positions.
     */
    private findAround(parent: Node, content: Node, before: boolean): void {
        if (parent !== content && this.find) {
            for (const item of this.find) {
                if (isUndefinedOrNull(item.pos) && parent.nodeType === ELEMENT_NODE && parent.contains(item.node)) {
                    const pos: number = content.compareDocumentPosition(item.node);
                    const relevantFlag = before ? DocumentPosition.PRECEDING : DocumentPosition.FOLLOWING;
                    // Using bitwise AND to check document position flags (DOM API standard)
                    if ((pos & relevantFlag) !== 0) {
                        item.pos = this.currentPos;
                    }
                }
            }
        }
    }

    /**
     * Updates position tracking within a text node.
     *
     * @param textNode - The text node being processed
     *
     * @remarks
     * For tracked positions within this text node, calculates the exact
     * document position based on the text node's length and the tracked offset.
     */
    private findInText(textNode: Text): void {
        if (this.find) {
            for (const item of this.find) {
                if (item.node === textNode) {
                    item.pos = this.currentPos - (textNode.nodeValue.length - item.offset);
                }
            }
        }
    }

    /**
     * Finds an appropriate text block node type from the context or schema.
     *
     * @returns A text block node type, or undefined if none found
     *
     * @remarks
     * This method is used when inline content needs to be wrapped in a block.
     * It searches in two phases:
     * 1. Checks the context stack for the default type expected at each level
     * 2. Falls back to finding any text block type in the schema with default attributes
     */
    private textblockFromContext(): NodeType | undefined {
        const $context: ResolvedPos = this.options.context;

        // Try to find a text block from the context
        if ($context) {
            for (let d = $context.depth; d >= 0; d--) {
                const defaultNodeType: NodeType = $context.node(d).contentMatchAt($context.indexAfter(d)).defaultType;
                if (defaultNodeType?.isTextblock && defaultNodeType?.defaultAttrs) {
                    return defaultNodeType;
                }
            }
        }

        // Fall back to any text block type in the schema
        // Performance: Use Object.values() instead of for...in for better performance
        for (const type of Object.values(this.parser.schema.nodes)) {
            if (type.isTextblock && type.defaultAttrs) {
                return type;
            }
        }

        return undefined;
    }

    /**
     * Calculates whitespace handling options for a node context.
     *
     * @param type - The node type (may be null for fragments)
     * @param preserveWhitespace - Explicit whitespace preservation setting
     * @param base - Base options to inherit from parent context
     * @returns Bitfield of whitespace options
     *
     * @remarks
     * The precedence for determining whitespace handling is:
     * 1. Explicit preserveWhitespace parameter (if provided)
     * 2. Node type's whitespace property (if 'pre')
     * 3. Parent context's options (excluding OPT_OPEN_LEFT)
     */
    private whitespaceOptionsFor(type: NodeType | null,
                                 preserveWhitespace: boolean | 'full' | undefined,
                                 base: number): number {
        if (!isUndefinedOrNull(preserveWhitespace)) {
            if (preserveWhitespace === 'full') {
                return ContextFlags.OPT_PRESERVE_WS | ContextFlags.OPT_PRESERVE_WS_FULL;
            } else if (preserveWhitespace) {
                return ContextFlags.OPT_PRESERVE_WS;
            } else {
                return 0;
            }
        }

        if (type?.whitespace === 'pre') {
            return ContextFlags.OPT_PRESERVE_WS | ContextFlags.OPT_PRESERVE_WS_FULL;
        }

        return base & ~ContextFlags.OPT_OPEN_LEFT;
    }

    /**
     * Normalizes malformed list structures in the DOM.
     *
     * @param dom - The list element (ul/ol) to normalize
     *
     * @remarks
     * This is a workaround for some tools that produce directly nested list nodes
     * (e.g., `<ul><li>Item</li><ul><li>Nested</li></ul></ul>`) which browsers allow
     * but should be structured as `<ul><li>Item<ul><li>Nested</li></ul></li></ul>`.
     *
     * The method moves nested list elements into the preceding list item where they belong.
     */
    private normalizeList(dom: Node): void {
        let prevItem: ChildNode | null = null;

        // Fix: Save next sibling before any DOM mutations to avoid loop iteration bugs
        for (let child: ChildNode = dom.firstChild; child;) {
            const nextChild: ChildNode = child.nextSibling;
            const name: string = child.nodeType === ELEMENT_NODE ? child.nodeName.toLowerCase() : null;

            if (name && hasOwnProperty(LIST_TAGS, name) && prevItem) {
                // Move nested list into previous list item
                prevItem.appendChild(child);
                // Don't update prevItem - the moved list isn't a valid prevItem
            } else if (name === 'li') {
                prevItem = child;
            } else if (name) {
                prevItem = null;
            }

            child = nextChild;
        }
    }

    /**
     * Checks if a mark type can be applied to a node type based on schema structure.
     *
     * @param markType - The mark type to check
     * @param nodeType - The node type to check against
     * @returns True if the mark can reasonably be applied to the node type
     *
     * @remarks
     * This method is used during fragment parsing when there's no explicit parent context.
     * It performs a graph traversal of the schema's content expressions to determine if
     * there exists any parent node type that:
     * 1. Allows the given mark type
     * 2. Can contain the given node type in its content
     *
     * This helps ensure marks are only applied where they make sense in the schema.
     */
    private markMayApply(markType: MarkType, nodeType: NodeType): boolean {
        const nodes: Readonly<Record<string, NodeType>> = nodeType.schema.nodes;

        // Performance: Use Object.values() instead of for...in for better performance
        for (const parent of Object.values(nodes)) {
            if (!parent.allowsMarkType(markType)) {
                continue;
            }

            // Perform depth-first search through content match graph
            // Performance: Use Set instead of Array for O(1) membership testing
            const seen = new Set<ContentMatch>();

            const scan = (match: ContentMatch): boolean => {
                seen.add(match);

                for (let i = 0; i < match.edgeCount; i++) {
                    const {type, next} = match.edge(i);

                    if (type === nodeType) {
                        return true; // Found a path to our node type
                    }

                    if (!seen.has(next) && scan(next)) {
                        return true;
                    }
                }

                return false;
            };

            if (scan(parent.contentMatch)) {
                return true;
            }
        }

        return false;
    }

}
