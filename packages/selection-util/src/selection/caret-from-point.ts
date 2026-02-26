import {nodeSize} from '@type-editor/dom-util';

type DocumentWithCaretPosition = Document & {
    caretPositionFromPoint?: (x: number, y: number) => CaretPosition | null;
};


/**
 * Gets the caret position from a point in the document.
 *
 * This function tries browser-specific methods to determine the DOM position
 * (node and offset) at the given screen coordinates. It handles both Firefox's
 * `caretPositionFromPoint` and Chrome/Safari's `caretRangeFromPoint`.
 *
 * The offset is clipped to the node size to handle edge cases where browsers
 * might return invalid offsets (e.g., text offsets into <input> nodes).
 *
 * @param doc - The document to query
 * @param x - The X coordinate in viewport space
 * @param y - The Y coordinate in viewport space
 * @returns An object containing the node and offset at the point, or undefined if not found
 *
 * @example
 * ```typescript
 * const position = caretFromPoint(document, event.clientX, event.clientY);
 * if (position) {
 *     console.log('Caret is at:', position.node, position.offset);
 * }
 * ```
 */
export function caretFromPoint(doc: Document,
                               x: number,
                               y: number): { node: Node, offset: number; } | undefined {
    const docWithCaret = doc as DocumentWithCaretPosition;

    // Try Firefox's caretPositionFromPoint
    if (docWithCaret.caretPositionFromPoint) {
        try {
            // Firefox throws for this call in hard-to-predict circumstances (#994)
            const pos: CaretPosition | null = docWithCaret.caretPositionFromPoint(x, y);
            if (pos) {
                // Clip the offset, because browsers may return a text offset
                // into <input> nodes, which can't be treated as a regular DOM offset
                return {
                    node: pos.offsetNode,
                    offset: Math.min(nodeSize(pos.offsetNode), pos.offset)
                };
            }
        } catch (_) {
            // Silently ignore Firefox errors
        }
    }

    // Try Chrome/Safari's caretRangeFromPoint
    // Note: caretRangeFromPoint is deprecated but still widely supported
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    if (doc.caretRangeFromPoint) {
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        const range: Range = doc.caretRangeFromPoint(x, y);
        if (range) {
            return {
                node: range.startContainer,
                offset: Math.min(nodeSize(range.startContainer), range.startOffset)
            };
        }
    }
}
