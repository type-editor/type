import type {Mappable} from './Mappable';
import type {MapResult} from './MapResult';


export interface PmStepMap extends Mappable {

    /**
     * Recover a position that was deleted by this step map, using a recovery value
     * obtained from a previous mapping. Returns the pre-deletion position
     * corresponding to the given recovery value.
     *
     * @param value - The recovery value from a MapResult.
     * @returns The recovered position in the document.
     * @throws {RangeError} If the recovery value references an invalid range index.
     */
    recover(value: number): number;

    /**
     * Map a position through this step map, returning a MapResult object
     * with additional information about the mapping, including whether
     * content was deleted and recovery information.
     *
     * @param pos - The position to map.
     * @param assoc - Determines which side the position is associated with.
     *                Use -1 for the left side, 1 for the right side (default: 1).
     * @returns A MapResult containing the mapped position and deletion info.
     */
    mapResult(pos: number, assoc?: number): MapResult;

    /**
     * Map a position through this step map.
     *
     * @param pos - The position to map.
     * @param assoc - Determines which side the position is associated with.
     *                Use -1 for the left side, 1 for the right side (default: 1).
     * @returns The mapped position.
     */
    map(pos: number, assoc?: number): number;

    /**
     * Test whether the given position touches the range with the
     * given recover value.
     *
     * @param pos - The position to test.
     * @param recover - The recovery value identifying the range.
     * @returns True if the position touches the range, false otherwise.
     */
    touches(pos: number, recover: number): boolean;

    /**
     * Calls the given function on each of the changed ranges included in
     * this map.
     *
     * @param callbackFunc - Function called for each range with (oldStart, oldEnd, newStart, newEnd).
     */
    forEach(callbackFunc: (oldStart: number, oldEnd: number, newStart: number, newEnd: number) => void): void;

    /**
     * Create an inverted version of this map. The result can be used to
     * map positions in the post-step document to the pre-step document.
     *
     * @returns An inverted StepMap.
     */
    invert(): PmStepMap;

    /**
     * Returns a string representation of this step map.
     * Inverted maps are prefixed with a minus sign.
     *
     * @returns A JSON string representation of the ranges, optionally prefixed with '-'.
     */
    toString(): string;
}
