import {Mark, type Node} from '@type-editor/model';

import type {MarkdownSerializerState} from '../MarkdownSerializerState';

// Pre-compiled regex patterns for performance - avoid recreating on each call
const backtickRegex = /`+/g;


export const markdownSchemaMarks = {

    em: {open: '*', close: '*', mixable: true, expelEnclosingWhitespace: true},

    strong: {open: '**', close: '**', mixable: true, expelEnclosingWhitespace: true},

    link: {
        open(state: MarkdownSerializerState, mark: Mark, parent: Node, index: number): string {
            // Check if this is a plain URL that can use autolink syntax (<url>)
            state.inAutolink = isPlainURL(mark, parent, index);
            return state.inAutolink ? '<' : '[';
        },
        close(state: MarkdownSerializerState, mark: Mark, _parent: Node, _index: number): string {
            const {inAutolink} = state;
            state.inAutolink = undefined;
            // Autolinks use simple <url> syntax, regular links use [text](url "title")
            return inAutolink
                ? '>'
                : `](${(mark.attrs.href as string).replace(/[()"]/g, '\\$&')}${mark.attrs.title
                    ? ` "${(mark.attrs.title as string).replace(/"/g, '\\"')}"`
                    : ''})`;
        },
        mixable: true
    },

    code: {
        open(_state: MarkdownSerializerState, _mark: Mark, parent: Node, index: number): string {
            // Calculate opening backticks (side = -1) based on content
            return backticksFor(parent.child(index), -1);
        },
        close(_state: MarkdownSerializerState, _mark: Mark, parent: Node, index: number): string {
            // Calculate closing backticks (side = 1) based on content
            return backticksFor(parent.child(index - 1), 1);
        },
        escape: false  // Code content should not be escaped
    }
};

/**
 * Generate the appropriate number of backticks for code marks.
 * Ensures that the backtick fence is longer than any backtick sequence within the code.
 *
 * @param node - The text node containing the code
 * @param side - Whether this is the opening (-1) or closing (1) delimiter
 * @returns The backtick string with appropriate spacing
 */
function backticksFor(node: Node, side: number): string {
    let maxBacktickLength = 0;

    if (node.isText) {
        // Reset regex state since we're using a global regex
        backtickRegex.lastIndex = 0;
        // Find the longest sequence of backticks in the text
        let matches: RegExpExecArray | null = backtickRegex.exec(node.text);
        while (matches) {
            maxBacktickLength = Math.max(maxBacktickLength, matches[0].length);
            matches = backtickRegex.exec(node.text);
        }
    }

    // If the code contains backticks, we need to use more backticks to wrap it
    // and add spaces to separate the delimiter from the content
    // For opening (side < 0): add trailing space, e.g., "`` `text"
    // For closing (side > 0): add leading space, e.g., "text` ``"
    let result = maxBacktickLength > 0 && side > 0 ? ' `' : '`';
    result += '`'.repeat(maxBacktickLength);
    if (maxBacktickLength > 0 && side < 0) {
        result += ' ';
    }
    return result;
}

/**
 * Determine if a link mark represents a plain URL that can be rendered as an autolink.
 * A plain URL has no title, the text content matches the href exactly, and it's the
 * last or only mark at this position.
 *
 * @param link - The link mark to check
 * @param parent - The parent node containing the link
 * @param index - The index of the content within the parent
 * @returns True if this should be rendered as an autolink (e.g., <https://example.com>)
 */
function isPlainURL(link: Mark, parent: Node, index: number): boolean {
    // Links with titles or non-URL-like hrefs cannot be autolinks
    if (link.attrs.title || !/^\w+:/.test(link.attrs.href as string)) {
        return false;
    }

    const content: Node = parent.child(index);
    // Content must be text, match the href exactly, and have this link as the last mark
    if (!content.isText
        || content.text !== link.attrs.href
        || content.marks[content.marks.length - 1] !== link) {
        return false;
    }

    // The link must not continue to the next node
    return index === parent.childCount - 1 || !link.isInSet(parent.child(index + 1).marks);
}
