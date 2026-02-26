/**
 * Position information used during DOM parsing for selection reconstruction.
 *
 * This interface tracks DOM node positions so that after parsing,
 * the selection can be reconstructed at the correct ProseMirror positions.
 *
 * @interface DOMPositionInfo
 */
export interface DOMPositionInfo {
    /**
     * The DOM node at this position.
     * Can be a text node or element node.
     */
    node: DOMNode;

    /**
     * The offset within the DOM node.
     * For text nodes, this is a character offset.
     * For element nodes, this is a child index.
     */
    offset: number;

    /**
     * The resolved ProseMirror position after parsing.
     * This is set by the parser and used for selection reconstruction.
     * Undefined until the parser processes this position.
     */
    pos?: number;
}
