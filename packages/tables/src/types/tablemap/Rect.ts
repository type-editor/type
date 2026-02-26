/**
 * Represents a rectangular region in the table grid.
 * Used to define cell boundaries and selection areas.
 */
export interface Rect {
    /** Left column index (inclusive, 0-based) */
    left: number;
    /** Top row index (inclusive, 0-based) */
    top: number;
    /** Right column index (exclusive) */
    right: number;
    /** Bottom row index (exclusive) */
    bottom: number;
}
