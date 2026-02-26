/**
 * Represents the state of an active column resize drag operation.
 */
export interface Dragging {
    /**
     * The X coordinate where the drag operation started.
     */
    startX: number;
    /**
     * The width of the column when the drag operation started.
     */
    startWidth: number;
}
