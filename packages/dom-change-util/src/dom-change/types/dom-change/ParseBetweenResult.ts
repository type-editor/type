import type {Node} from '@type-editor/model';

/**
 * Represents the result of parsing a DOM range into a ProseMirror document.
 *
 * This interface encapsulates all information extracted from parsing a DOM
 * range, including the parsed document content and reconstructed selection state.
 *
 * @interface ParseBetweenResult
 * @example
 * ```typescript
 * const result = parseBetween(view, 0, 10);
 * console.log(result.doc); // Parsed ProseMirror node
 * console.log(result.sel); // { anchor: 5, head: 5 } or null
 * ```
 */
export interface ParseBetweenResult {
    /**
     * The parsed document node containing the content from the DOM range.
     * This is a ProseMirror Node that represents the parsed content.
     */
    doc: Node;

    /**
     * The reconstructed selection information with anchor and head positions.
     * Null if the selection could not be determined or is outside the parsed range.
     */
    sel: { anchor: number; head: number } | null;

    /**
     * Start position in the document where parsing began.
     * This is the absolute position in the full document.
     */
    from: number;

    /**
     * End position in the document where parsing ended.
     * This is the absolute position in the full document.
     */
    to: number;
}
