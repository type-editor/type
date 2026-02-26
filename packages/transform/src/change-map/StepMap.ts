import type {MapResult, PmStepMap} from '@type-editor/editor-types';

import {DeletionInfo} from './DeletionInfo';
import {PmMapResult} from './PmMapResult';

/**
 * A map describing the deletions and insertions made by a step, which
 * can be used to find the correspondence between positions in the
 * pre-step version of a document and the same position in the
 * post-step version.
 * <br/>
 * This class uses recovery values.
 * Recovery values encode a range index and an offset. They are
 * represented as numbers, because tons of them will be created when
 * mapping, for example, a large number of decorations. The number's
 * lower 16 bits provide the index, the remaining bits the offset.
 *
 * Note: We intentionally don't use bit shift operators to en- and
 * decode these, since those clip to 32 bits, which we might in rare
 * cases want to overflow. A 64-bit float can represent 48-bit
 * integers precisely.
 */
export class StepMap implements PmStepMap {

    /**
     * A StepMap that contains no changed ranges.
     */
    public static empty = new StepMap([]);

    /** Bitmask for the lower 16 bits, used to extract the range index from a recovery value. */
    private static readonly LOWER16: number = 0xffff;

    /** Multiplication factor (2^16) for encoding offset in recovery values. */
    private static readonly FACTOR16: number = Math.pow(2, 16);

    /** Array of numbers where each group of three represents [start, oldSize, newSize] of a modified chunk. */
    private readonly ranges: ReadonlyArray<number>;

    /** Whether this map is inverted (maps from post-step to pre-step positions). */
    private readonly inverted: boolean;

    /**
     * Create a position map. The modifications to the document are
     * represented as an array of numbers, in which each group of three
     * represents a modified chunk as `[start, oldSize, newSize]`.
     *
     * @param ranges - Array of numbers representing modified chunks as [start, oldSize, newSize] triplets.
     *                 The array length must be a multiple of 3.
     * @param inverted - Whether this is an inverted map (default: false).
     * @throws {RangeError} If the ranges array length is not a multiple of 3.
     */
    constructor(ranges: ReadonlyArray<number>, inverted = false) {
        // Validate that ranges array has correct format
        if (ranges.length % 3 !== 0) {
            throw new RangeError(
                `Invalid ranges array: length must be multiple of 3, got ${ranges.length}`
            );
        }

        this.ranges = ranges;
        this.inverted = inverted;

        if (!ranges.length && StepMap.empty) {
            return StepMap.empty;
        }
    }

    /**
     * Create a map that moves all positions by offset `n` (which may be
     * negative). This can be useful when applying steps meant for a
     * sub-document to a larger document, or vice-versa.
     *
     * @param offset - The number of positions to offset (can be negative).
     * @returns A StepMap that offsets all positions by the given amount.
     */
    public static offset(offset: number): StepMap {
        return offset === 0 ? StepMap.empty : new StepMap(offset < 0 ? [0, -offset, 0] : [0, 0, offset]);
    }

    /**
     * Recover a position that was deleted by this step map, using a recovery value
     * obtained from a previous mapping. Returns the pre-deletion position
     * corresponding to the given recovery value.
     *
     * @param value - The recovery value from a MapResult.
     * @returns The recovered position in the document.
     * @throws {RangeError} If the recovery value references an invalid range index.
     */
    public recover(value: number): number {
        let diff = 0;
        const index: number = this.recoverIndex(value);

        // Validate that the recovery index is within bounds
        if (index * 3 >= this.ranges.length) {
            throw new RangeError(
                `Invalid recovery value: index ${index} out of bounds ` +
                `(map has ${this.ranges.length / 3} ranges)`
            );
        }

        if (!this.inverted) {
            for (let i = 0; i < index; i++) {
                diff += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1];
            }
        }
        return this.ranges[index * 3] + diff + this.recoverOffset(value);
    }

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
    public mapResult(pos: number, assoc = 1): MapResult {
        return this._map(pos, assoc, false) as MapResult;
    }

    /**
     * Map a position through this step map.
     *
     * @param pos - The position to map.
     * @param assoc - Determines which side the position is associated with.
     *                Use -1 for the left side, 1 for the right side (default: 1).
     * @returns The mapped position.
     */
    public map(pos: number, assoc = 1): number {
        return this._map(pos, assoc, true) as number;
    }

    /**
     * Test whether the given position touches the range with the
     * given recover value.
     *
     * @param pos - The position to test.
     * @param recover - The recovery value identifying the range.
     * @returns True if the position touches the range, false otherwise.
     */
    public touches(pos: number, recover: number): boolean {
        let diff = 0;
        const index: number = this.recoverIndex(recover);
        const oldIndex: number = this.inverted ? 2 : 1;
        const newIndex: number = this.inverted ? 1 : 2;

        for (let i = 0; i < this.ranges.length; i += 3) {
            const start: number = this.ranges[i] - (this.inverted ? diff : 0);
            if (start > pos) {
                break;
            }

            const oldSize: number = this.ranges[i + oldIndex];
            const end: number = start + oldSize;
            if (pos <= end && i === index * 3) {
                return true;
            }
            diff += this.ranges[i + newIndex] - oldSize;
        }
        return false;
    }

    /**
     * Calls the given function on each of the changed ranges included in
     * this map.
     *
     * @param callbackFunc - Function called for each range with (oldStart, oldEnd, newStart, newEnd).
     */
    public forEach(callbackFunc: (oldStart: number,
                                  oldEnd: number,
                                  newStart: number,
                                  newEnd: number) => void): void {
        const oldIndex = this.inverted ? 2 : 1;
        const newIndex = this.inverted ? 1 : 2;

        for (let i = 0, diff = 0; i < this.ranges.length; i += 3) {
            const start: number = this.ranges[i];
            const oldStart: number = start - (this.inverted ? diff : 0);
            const newStart: number = start + (this.inverted ? 0 : diff);
            const oldSize: number = this.ranges[i + oldIndex];
            const newSize: number = this.ranges[i + newIndex];
            callbackFunc(oldStart, oldStart + oldSize, newStart, newStart + newSize);
            diff += newSize - oldSize;
        }
    }

    /**
     * Create an inverted version of this map. The result can be used to
     * map positions in the post-step document to the pre-step document.
     *
     * @returns An inverted StepMap.
     */
    public invert(): StepMap {
        return new StepMap(this.ranges, !this.inverted);
    }

    /**
     * Returns a string representation of this step map.
     * Inverted maps are prefixed with a minus sign.
     *
     * @returns A JSON string representation of the ranges, optionally prefixed with '-'.
     */
    public toString(): string {
        return (this.inverted ? '-' : '') + JSON.stringify(this.ranges);
    }

    /**
     * Internal mapping implementation that can return either a simple position
     * or a full MapResult with deletion information.
     *
     * @param pos - The position to map.
     * @param assoc - The association side (-1 for left, 1 for right).
     * @param simple - If true, returns just the mapped position; if false, returns a MapResult.
     * @returns Either a number (if simple=true) or a MapResult (if simple=false).
     */
    private _map(pos: number, assoc: number, simple: boolean): number | MapResult {
        let diff = 0;
        const oldIndex = this.inverted ? 2 : 1;
        const newIndex = this.inverted ? 1 : 2;

        for (let i = 0; i < this.ranges.length; i += 3) {
            const start: number = this.ranges[i] - (this.inverted ? diff : 0);
            if (start > pos) {
                break;
            }

            const oldSize: number = this.ranges[i + oldIndex];
            const newSize: number = this.ranges[i + newIndex];
            const end: number = start + oldSize;

            if (pos <= end) {
                let mappingDirection: number;
                if (!oldSize) {
                    mappingDirection = assoc;
                } else if (pos === start) {
                    mappingDirection = -1;
                } else if (pos === end) {
                    mappingDirection = 1;
                } else {
                    mappingDirection = assoc;
                }
                const result: number = start + diff + (mappingDirection < 0 ? 0 : newSize);
                if (simple) {
                    return result;
                }

                let recover: number | null;
                const compareValue = assoc < 0 ? start : end;
                if (pos === compareValue) {
                    recover = null;
                } else {
                    recover = this.makeRecover(i / 3, pos - start);
                }


                let deletionInfo: DeletionInfo;
                if (pos === start) {
                    deletionInfo = DeletionInfo.AFTER;
                } else if (pos === end) {
                    deletionInfo = DeletionInfo.BEFORE;
                } else {
                    deletionInfo = DeletionInfo.ACROSS;
                }

                if (assoc < 0 ? pos !== start : pos !== end) {
                    deletionInfo |= DeletionInfo.SIDE;
                }
                return new PmMapResult(result, deletionInfo, recover);
            }
            diff += newSize - oldSize;
        }
        return simple ? pos + diff : new PmMapResult(pos + diff, 0, null);
    }

    /**
     * Encodes a recovery value from a range index and offset within that range.
     * The recovery value stores the index in the lower 16 bits and the offset
     * in the higher bits.
     *
     * @param index - The index of the range (will be stored in lower 16 bits).
     * @param offset - The offset within the range (will be multiplied by 2^16).
     * @returns The encoded recovery value.
     */
    private makeRecover(index: number, offset: number): number {
        return index + offset * StepMap.FACTOR16;
    }

    /**
     * Extracts the range index from a recovery value.
     *
     * @param value - The recovery value.
     * @returns The range index (lower 16 bits of the value).
     */
    private recoverIndex(value: number): number {
        return value & StepMap.LOWER16;
    }

    /**
     * Extracts the offset from a recovery value.
     *
     * @param value - The recovery value.
     * @returns The offset within the range.
     */
    private recoverOffset(value: number): number {
        return (value - (value & StepMap.LOWER16)) / StepMap.FACTOR16;
    }
}
