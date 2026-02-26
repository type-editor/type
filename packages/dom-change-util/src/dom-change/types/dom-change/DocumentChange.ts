
/**
 * Represents a change detected in the document by comparing old and new content.
 *
 * This interface describes the positions where content has changed, with
 * separate end positions for the old document (endA) and new document (endB).
 *
 * @interface DocumentChange
 * @example
 * ```typescript
 * // User types "x" at position 5
 * const change: DocumentChange = {
 *   start: 5,    // Change starts at position 5
 *   endA: 5,     // Old document ends at 5 (nothing was there)
 *   endB: 6      // New document ends at 6 (one char added)
 * };
 * ```
 */
export interface DocumentChange {
    /**
     * Start position of the change in the document.
     * This is where the changed region begins.
     */
    start: number;

    /**
     * End position in the old (previous) document.
     * If endA > start, content was deleted.
     */
    endA: number;

    /**
     * End position in the new (current) document.
     * If endB > start, content was inserted.
     */
    endB: number;
}
