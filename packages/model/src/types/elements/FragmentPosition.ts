

/**
 * Represents a position within a fragment using child index and offset.
 *
 * This interface provides an alternative way to specify positions within a fragment,
 * using the index of a child node and an offset within that child, rather than
 * an absolute position. This is particularly useful for operations that need to
 * identify both which child node contains a position and where within that node
 * the position lies.
 *
 * @example
 * ```typescript
 * // For a fragment with children of sizes [5, 3, 7]
 * // Position 8 would be:
 * const diffIndex: DiffIndex = {
 *   index: 2,    // Third child (0-indexed)
 *   offset: 5    // Starts at position 5 (5 + 3)
 * };
 * ```
 */
export interface FragmentPosition {
    /**
     * The index of the child node within the fragment.
     * This is a zero-based index into the fragment's children array.
     */
    index: number,

    /**
     * The offset within the child node at the specified index.
     * This represents the absolute position where the child node starts
     * within the fragment.
     */
    offset: number
}
