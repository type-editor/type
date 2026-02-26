
/**
 * Enum representing the type of deletion relative to a position.
 * Used internally to track what was deleted during mapping.
 */
export enum DeletionInfo {
    /** Content before the position was deleted */
    BEFORE = 1,
    /** Content after the position was deleted */
    AFTER = 2,
    /** Content both before and after the position was deleted */
    ACROSS = 4,
    /** The position itself is on the deleted side */
    SIDE = 8
}
