
/**
 * An object representing a mapped position with additional information about the mapping.
 *
 * This interface provides detailed feedback about what happened to a position during mapping,
 * including whether content was deleted and recovery information for mirrored transformations.
 * It is returned by the `mapResult()` method of objects implementing the `Mappable` interface.
 *
 * @example
 * ```typescript
 * const stepMap = new StepMap([2, 4, 0]); // Delete 4 characters at position 2
 * const result = stepMap.mapResult(4, 1);
 * console.log(result.pos);            // Mapped position (2)
 * console.log(result.deleted);        // true - position was deleted
 * console.log(result.deletedAcross);  // true - deleted content spans across position
 * ```
 */
export interface MapResult {
    /**
     * The mapped position after the transformation.
     *
     * This is the new position in the transformed document that corresponds to
     * the original position. If the position was deleted, this will be the position
     * where the deletion occurred.
     */
    readonly pos: number;

    /**
     * Bitwise flags indicating deletion information.
     *
     * This is a bitwise combination of `DeletionInfo` flags (BEFORE, AFTER, ACROSS, SIDE)
     * that provide detailed information about how deletion affected this position.
     * Use the boolean properties (`deleted`, `deletedBefore`, etc.) for easier access.
     */
    readonly delInfo: number;

    /**
     * Recovery value for mapping through mirrored transformations, or `null`.
     *
     * When a position is deleted and a mirror relationship exists between steps,
     * this value can be used to recover the position by mapping through the mirrored
     * step. This is essential for collaborative editing and undo/redo functionality.
     * If no recovery is possible or needed, this will be `null`.
     *
     * @see Mapping.setMirror for establishing mirror relationships
     */
    readonly recover: number | null;

    /**
     * Indicates whether the position was deleted during mapping.
     *
     * A position is considered deleted when it falls within a range that was completely
     * replaced or removed by the transformation. The specific meaning depends on the
     * `assoc` parameter:
     * - When content on both sides is deleted, this is always `true`
     * - When content on only one side is deleted, this is `true` only if `assoc` points
     *   toward the deleted content
     *
     * @example
     * ```typescript
     * const deleteMap = new StepMap([5, 10, 0]); // Delete 10 chars at position 5
     * deleteMap.mapResult(10, 1).deleted;  // true - position was in deleted range
     * deleteMap.mapResult(5, -1).deleted;  // false - assoc points away from deletion
     * ```
     */
    readonly deleted: boolean;

    /**
     * Indicates whether content was deleted immediately before this position.
     *
     * This is `true` when a deletion occurred at or before the mapped position,
     * affecting content that preceded it. Useful for understanding the context
     * of how the position was affected by transformations.
     *
     * @example
     * ```typescript
     * const deleteMap = new StepMap([0, 5, 0]); // Delete 5 chars at position 0
     * deleteMap.mapResult(5, 1).deletedBefore;  // true - deletion before position
     * ```
     */
    readonly deletedBefore: boolean;

    /**
     * Indicates whether content was deleted immediately after this position.
     *
     * This is `true` when a deletion occurred at or after the mapped position,
     * affecting content that followed it. Useful for understanding the context
     * of how the position was affected by transformations.
     *
     * @example
     * ```typescript
     * const deleteMap = new StepMap([5, 10, 0]); // Delete 10 chars at position 5
     * deleteMap.mapResult(5, -1).deletedAfter;  // true - deletion after position
     * ```
     */
    readonly deletedAfter: boolean;

    /**
     * Indicates whether the position was in the middle of deleted content.
     *
     * This is `true` when the position fell within a range that had content deleted
     * on both sides of it (or the position itself was deleted). This indicates that
     * the position was surrounded by a deletion, not just adjacent to one.
     *
     * @example
     * ```typescript
     * const deleteMap = new StepMap([0, 20, 0]); // Delete 20 chars at position 0
     * deleteMap.mapResult(10, 1).deletedAcross;  // true - position in deleted range
     * ```
     */
    readonly deletedAcross: boolean;
}
