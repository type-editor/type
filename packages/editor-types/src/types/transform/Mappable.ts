import type {MapResult} from './MapResult';

/**
 * Interface for objects that can map positions through document changes.
 *
 * Objects implementing this interface provide position mapping functionality,
 * which is essential for tracking how positions in a document correspond to
 * positions after transformations (insertions, deletions, replacements).
 *
 * The `assoc` parameter determines position behavior at boundaries:
 * - When `assoc` is -1 (left), the position is associated with the content before it
 * - When `assoc` is 1 (right), the position is associated with the content after it
 * - This matters when content is inserted exactly at the position
 *
 * @example
 * ```typescript
 * const stepMap = new StepMap([0, 0, 5]); // Insert 5 characters at position 0
 * const newPos = stepMap.map(0, 1); // Returns 5 (position moves after insertion)
 * const stayPos = stepMap.map(0, -1); // Returns 0 (position stays before insertion)
 * ```
 */
export interface Mappable {

    /**
     * Map a position through this object, returning the transformed position.
     *
     * This is the primary method for tracking how a position changes through a
     * document transformation. The `assoc` parameter controls behavior when content
     * is inserted exactly at the position being mapped.
     *
     * @param pos - The position to map through the transformation. Must be a valid
     *              position in the pre-transformation document.
     * @param assoc - Association side that determines position behavior at boundaries.
     *                - `-1` (left): Position is associated with content before it.
     *                  When content is inserted at this position, the mapped position
     *                  stays before the insertion.
     *                - `1` (right): Position is associated with content after it.
     *                  When content is inserted at this position, the mapped position
     *                  moves after the insertion.
     *                - Default: `1`
     * @returns The mapped position in the post-transformation document.
     *
     * @example
     * ```typescript
     * const insertMap = new StepMap([10, 0, 5]); // Insert 5 chars at position 10
     * insertMap.map(10, 1);   // Returns 15 (moves after insertion)
     * insertMap.map(10, -1);  // Returns 10 (stays before insertion)
     * insertMap.map(15, 1);   // Returns 20 (shifted by insertion)
     * ```
     */
    map: (pos: number, assoc?: number) => number;


    /**
     * Map a position and return detailed information about the mapping result.
     *
     * Unlike the simple `map()` method, this returns a comprehensive result object
     * that includes the mapped position plus information about whether content was
     * deleted, and recovery values for handling mirrored transformations.
     *
     * The `deleted` field indicates whether the position was completely enclosed in
     * a replaced or deleted range. When content on only one side is deleted, the
     * position is only considered deleted when `assoc` points toward the deleted content.
     *
     * @param pos - The position to map through the transformation. Must be a valid
     *              position in the pre-transformation document.
     * @param assoc - Association side that determines deletion behavior at boundaries.
     *                - `-1` (left): Position is associated with content before it.
     *                  Position is deleted only if content to the left was deleted.
     *                - `1` (right): Position is associated with content after it.
     *                  Position is deleted only if content to the right was deleted.
     *                - Default: `1`
     * @returns An IMapResult object containing:
     *          - `pos`: The mapped position
     *          - `deleted`: Whether the position was deleted
     *          - `deletedBefore`, `deletedAfter`, `deletedAcross`: Deletion context flags
     *          - `delInfo`: Raw bitwise deletion flags
     *          - `recover`: Recovery value for mirrored steps (null if not applicable)
     *
     * @example
     * ```typescript
     * const deleteMap = new StepMap([5, 10, 0]); // Delete 10 chars at position 5
     *
     * // Position in deleted range
     * const result1 = deleteMap.mapResult(8, 1);
     * console.log(result1.pos);            // 5 (maps to deletion start)
     * console.log(result1.deleted);        // true
     * console.log(result1.deletedAcross);  // true
     *
     * // Position at deletion boundary
     * const result2 = deleteMap.mapResult(5, -1);
     * console.log(result2.pos);            // 5
     * console.log(result2.deleted);        // false (assoc points away)
     * console.log(result2.deletedAfter);   // true
     * ```
     */
    mapResult: (pos: number, assoc?: number) => MapResult;
}
