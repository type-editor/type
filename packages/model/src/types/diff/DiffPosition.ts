
/**
 * Represents a pair of positions in two different fragments.
 *
 * This interface is used by diff functions to return corresponding positions
 * in two fragments being compared, typically indicating where differences occur.
 */
export interface DiffPosition {
    /**
     * The position in the first (self) fragment.
     */
    selfPos: number;

    /**
     * Backwards compatibility
     *
     * @deprecated Use `selfPos` instead.
     */
    a: number;

    /**
     * The position in the second (other) fragment.
     */
    otherPos: number

    /**
     * Backwards compatibility
     *
     * @deprecated Use `otherPos` instead.
     */
    b: number;
}
