import {Span} from './Span';
import type { ChangeJSON } from './types/ChangeJSON';


/**
 * Result of merging overlapping changes.
 *
 * @template Data - The type of metadata in the changes.
 */
interface MergeResult<Data> {
    /** The merged change, or null if no actual change occurred. */
    change: Change<Data> | null;
    /** The next change from the X changeset to process. */
    nextX: Change<Data> | null;
    /** The next change from the Y changeset to process. */
    nextY: Change<Data> | null;
    /** The updated index in the X changeset. */
    indexX: number;
    /** The updated index in the Y changeset. */
    indexY: number;
}

/**
 * Represents a change between two document versions with metadata.
 *
 * A Change tracks a replaced range in the document, including both what was
 * deleted from the old version and what was inserted in the new version.
 * It uses two coordinate systems:
 * - A coordinates: positions in the old document
 * - B coordinates: positions in the new document
 *
 * @template Data - The type of metadata associated with the changed content.
 */
export class Change<Data = any> {

    private readonly _fromA: number;
    private readonly _toA: number;
    private readonly _fromB: number;
    private readonly _toB: number;
    private readonly _deleted: ReadonlyArray<Span<Data>>;
    private readonly _inserted: ReadonlyArray<Span<Data>>;

    /**
     * Creates a new Change representing a document modification.
     *
     * @param fromA - The start position of the range in the old document (A coordinates).
     * @param toA - The end position of the range in the old document (A coordinates).
     * @param fromB - The start position of the range in the new document (B coordinates).
     * @param toB - The end position of the range in the new document (B coordinates).
     * @param deleted - Metadata spans for the deleted content. The total length of these
     *                  spans must equal `toA - fromA`.
     * @param inserted - Metadata spans for the inserted content. The total length of these
     *                   spans must equal `toB - fromB`.
     */
    constructor(fromA: number,
                toA: number,
                fromB: number,
                toB: number,
                deleted: ReadonlyArray<Span<Data>>,
                inserted: ReadonlyArray<Span<Data>>) {
        this._fromA = fromA;
        this._toA = toA;
        this._fromB = fromB;
        this._toB = toB;
        this._deleted = deleted;
        this._inserted = inserted;
    }

    /** The start position in the old document (A coordinates). */
    get fromA(): number {
        return this._fromA;
    }

    /** The end position in the old document (A coordinates). */
    get toA(): number {
        return this._toA;
    }

    /** The start position in the new document (B coordinates). */
    get fromB(): number {
        return this._fromB;
    }

    /** The end position in the new document (B coordinates). */
    get toB(): number {
        return this._toB;
    }

    /** The spans of deleted content with associated metadata. */
    get deleted(): ReadonlyArray<Span<Data>> {
        return this._deleted;
    }

    /** The spans of inserted content with associated metadata. */
    get inserted(): ReadonlyArray<Span<Data>> {
        return this._inserted;
    }

    /** The length of the deleted range in the old document. */
    get lenA(): number {
        return this._toA - this._fromA;
    }

    /** The length of the inserted range in the new document. */
    get lenB(): number {
        return this._toB - this._fromB;
    }

    /**
     * Merges two changesets into a single changeset.
     *
     * This combines two sequential changesets where the end document of the first
     * changeset is the start document of the second. The result is a single changeset
     * spanning from the start of the first to the end of the second.
     *
     * The merge operates by synchronizing over a "middle" coordinate system:
     * - For the first changeset (x): the B coordinates represent the middle document
     * - For the second changeset (y): the A coordinates represent the middle document
     *
     * @template Data - The type of metadata in the changes.
     * @param x - The first changeset.
     * @param y - The second changeset applied after x.
     * @param combine - Function to combine metadata when spans need to be merged.
     * @returns A single changeset representing both transformations.
     */
    public static merge<Data>(x: ReadonlyArray<Change<Data>>,
                              y: ReadonlyArray<Change<Data>>,
                              combine: (dataA: Data, dataB: Data) => Data): ReadonlyArray<Change<Data>> {
        // Fast paths for empty changesets
        if (x.length === 0) {
            return y;
        }
        if (y.length === 0) {
            return x;
        }

        const result: Array<Change<Data>> = [];

        // Iterate over both sets in parallel, using the middle coordinate
        // system (B in x, A in y) to synchronize.
        let currentX: Change<Data> | null = x[0];
        let currentY: Change<Data> | null = y[0];
        let indexX = 0;
        let indexY = 0;

        // Track cumulative offsets incrementally to avoid O(n²) recalculation
        let cumulativeXOffset = 0;
        let cumulativeYOffset = 0;

        while (currentX || currentY) {
            if (!currentX && !currentY) {
                break;
            }
            // currentX entirely before currentY in the middle coordinate system
            else if (currentX && (!currentY || currentX.toB < currentY._fromA)) {
                result.push(this.adjustChangeForYOffset(currentX, cumulativeYOffset));
                cumulativeXOffset += currentX.lenB - currentX.lenA;
                currentX = ++indexX < x.length ? x[indexX] : null;
            }
            // currentY entirely before currentX in the middle coordinate system
            else if (currentY && (!currentX || currentY.toA < currentX.fromB)) {
                result.push(this.adjustChangeForXOffset(currentY, cumulativeXOffset));
                cumulativeYOffset += currentY.lenB - currentY.lenA;
                currentY = ++indexY < y.length ? y[indexY] : null;
            }
            // Changes overlap - need to merge them
            else {
                const mergeResult: MergeResult<Data> = this.mergeOverlappingChanges(
                    x, y, currentX, currentY, indexX, indexY,
                    cumulativeXOffset, cumulativeYOffset, combine
                );

                if (mergeResult.change) {
                    result.push(mergeResult.change);
                }

                // Update cumulative offsets for all processed changes
                for (let i = indexX; i < mergeResult.indexX; i++) {
                    cumulativeXOffset += x[i].lenB - x[i].lenA;
                }
                for (let i = indexY; i < mergeResult.indexY; i++) {
                    cumulativeYOffset += y[i].lenB - y[i].lenA;
                }

                currentX = mergeResult.nextX;
                currentY = mergeResult.nextY;
                indexX = mergeResult.indexX;
                indexY = mergeResult.indexY;
            }
        }

        return result;
    }

    /**
     * Deserializes a Change from its JSON representation.
     *
     * @template Data - The type of metadata in the change.
     * @param json - The JSON object representing the change.
     * @returns A new Change instance reconstructed from the JSON data.
     */
    public static fromJSON<Data>(json: ChangeJSON<Data>): Change<Data> {
        return new Change(
            json.fromA,
            json.toA,
            json.fromB,
            json.toB,
            json.deleted.map((deleted: { length: number; data: Data }): Span<Data> => new Span(deleted.length, deleted.data)),
            json.inserted.map((inserted: { length: number; data: Data }): Span<Data> => new Span(inserted.length, inserted.data))
        );
    }

    /**
     * Adjusts a change from the X changeset by applying a Y offset.
     *
     * @param change - The change to adjust.
     * @param offset - The offset to apply to B coordinates.
     * @returns A new change with adjusted coordinates, or the original if offset is 0.
     */
    private static adjustChangeForYOffset<Data>(change: Change<Data>,
                                                offset: number): Change<Data> {
        if (offset === 0) {
            return change;
        }

        return new Change(
            change.fromA,
            change.toA,
            change.fromB + offset,
            change.toB + offset,
            change.deleted,
            change.inserted
        );
    }

    /**
     * Adjusts a change from the Y changeset by applying an X offset.
     *
     * @param change - The change to adjust.
     * @param offset - The offset to apply to A coordinates.
     * @returns A new change with adjusted coordinates, or the original if offset is 0.
     */
    private static adjustChangeForXOffset<Data>(change: Change<Data>,
                                                offset: number): Change<Data> {
        if (offset === 0) {
            return change;
        }

        return new Change(
            change.fromA - offset,
            change.toA - offset,
            change.fromB,
            change.toB,
            change.deleted,
            change.inserted
        );
    }

    /**
     * Merges overlapping changes from both changesets.
     *
     * When changes from X and Y overlap in the middle coordinate system, they need
     * to be merged. The rules are:
     * - Deletions from X and insertions from Y are kept
     * - Areas covered by X but not Y are insertions from X
     * - Areas covered by Y but not X are deletions from Y
     *
     * @param x - The first changeset array.
     * @param y - The second changeset array.
     * @param currentX - Current change from X.
     * @param currentY - Current change from Y.
     * @param indexX - Current index in X.
     * @param indexY - Current index in Y.
     * @param xOffset - Pre-calculated cumulative offset from previous X changes.
     * @param yOffset - Pre-calculated cumulative offset from previous Y changes.
     * @param combine - Function to combine metadata.
     * @returns The merge result containing the merged change and updated state.
     */
    private static mergeOverlappingChanges<Data>(x: ReadonlyArray<Change<Data>>,
                                                 y: ReadonlyArray<Change<Data>>,
                                                 currentX: Change<Data> | null,
                                                 currentY: Change<Data> | null,
                                                 indexX: number,
                                                 indexY: number,
                                                 xOffset: number,
                                                 yOffset: number,
                                                 combine: (dataA: Data, dataB: Data) => Data): MergeResult<Data> {
        // At this point, we're guaranteed that at least one of currentX or currentY
        // is not null and they overlap. We assert this for type safety.
        if (!currentX || !currentY) {
            throw new Error('mergeOverlappingChanges called with null change');
        }

        // Start position in the middle coordinate system
        let position: number = Math.min(currentX.fromB, currentY.fromA);

        // Calculate the merged change's boundaries using pre-calculated offsets
        const fromA: number = Math.min(currentX.fromA, currentY.fromA - xOffset);
        let toA: number = fromA;
        const fromB: number = Math.min(currentY.fromB, currentX.fromB + yOffset);
        let toB: number = fromB;

        let deleted: ReadonlyArray<Span> = Span.none;
        let inserted: ReadonlyArray<Span> = Span.none;

        // Track whether we've entered each change to avoid double-processing
        let enteredX = false;
        let enteredY = false;

        // Mutable references to current changes
        let workingX: Change<Data> | null = currentX;
        let workingY: Change<Data> | null = currentY;

        // Process all overlapping changes
        while (true) {
            const nextPositionX: number = this.getNextBoundary(workingX, position, 'fromB', 'toB');
            const nextPositionY: number = this.getNextBoundary(workingY, position, 'fromA', 'toA');
            const nextPosition: number = Math.min(nextPositionX, nextPositionY);

            const inX: boolean = workingX && position >= workingX.fromB;
            const inY: boolean = workingY && position >= workingY.fromA;

            if (!inX && !inY) {
                break;
            }


            // Process X change at entry point
            if (inX && position === workingX?.fromB && !enteredX) {
                deleted = Span.join(deleted, workingX.deleted, combine);
                toA += workingX.lenA;
                enteredX = true;
            }

            // Process X insertions where Y doesn't cover
            if (inX && !inY && workingX) {
                const slicedInserted: ReadonlyArray<Span<Data>> = Span.slice(
                    workingX.inserted,
                    position - workingX.fromB,
                    nextPosition - workingX.fromB
                );

                inserted = Span.join(inserted, slicedInserted, combine);
                toB += nextPosition - position;
            }

            // Process Y change at entry point
            if (inY && position === workingY?.fromA && !enteredY) {
                inserted = Span.join(inserted, workingY.inserted, combine);
                toB += workingY.lenB;
                enteredY = true;
            }

            // Process Y deletions where X doesn't cover
            if (inY && !inX && workingY) {
                const slicedDeleted: ReadonlyArray<Span<Data>> = Span.slice(
                    workingY.deleted,
                    position - workingY.fromA,
                    nextPosition - workingY.fromA
                );

                deleted = Span.join(deleted, slicedDeleted, combine);
                toA += nextPosition - position;
            }

            // Advance X if we've finished this change
            if (inX && nextPosition === workingX?.toB) {
                indexX++;
                workingX = indexX < x.length ? x[indexX] : null;
                enteredX = false;
            }

            // Advance Y if we've finished this change
            if (inY && nextPosition === workingY?.toA) {
                indexY++;
                workingY = indexY < y.length ? y[indexY] : null;
                enteredY = false;
            }

            position = nextPosition;
        }

        // Only create a change if there's actual content
        const change: Change = (fromA < toA || fromB < toB)
            ? new Change(fromA, toA, fromB, toB, deleted, inserted)
            : null;

        return {change, nextX: workingX, nextY: workingY, indexX, indexY};
    }

    /**
     * Determines the next boundary position for a change.
     *
     * @param change - The change to examine.
     * @param currentPosition - The current position.
     * @param fromKey - The property name for the start position.
     * @param toKey - The property name for the end position.
     * @returns The next boundary position (or a large number if no change).
     */
    private static getNextBoundary<Data>(change: Change<Data> | null,
                                         currentPosition: number,
                                         fromKey: 'fromA' | 'fromB',
                                         toKey: 'toA' | 'toB'): number {
        if (!change) {
            return Number.MAX_SAFE_INTEGER;
        }

        return currentPosition >= change[fromKey] ? change[toKey] : change[fromKey];
    }

    /**
     * Creates a sub-change by slicing ranges from both coordinate systems.
     *
     * This extracts a portion of this change, specified by ranges in both
     * the A and B coordinate systems. If the slice covers the entire change,
     * returns this instance to avoid allocation.
     *
     * @param startA - The start position in A coordinates (relative to this change).
     * @param endA - The end position in A coordinates (relative to this change).
     * @param startB - The start position in B coordinates (relative to this change).
     * @param endB - The end position in B coordinates (relative to this change).
     * @returns A new Change representing the specified slice, or this if unchanged.
     */
    public slice(startA: number,
                 endA: number,
                 startB: number,
                 endB: number): Change<Data> {
        // If slicing the entire range, return this to avoid allocation
        const coversFullRangeA: boolean = startA === 0 && endA === this.lenA;
        const coversFullRangeB: boolean = startB === 0 && endB === this.lenB;

        if (coversFullRangeA && coversFullRangeB) {
            return this;
        }

        return new Change(
            this._fromA + startA,
            this._fromA + endA,
            this._fromB + startB,
            this._fromB + endB,
            Span.slice(this._deleted, startA, endA),
            Span.slice(this._inserted, startB, endB));
    }

    /**
     * Serializes this Change to a JSON-compatible representation.
     *
     * Since the Change class structure matches the ChangeJSON interface,
     * this method returns the instance itself.
     *
     * @returns A JSON representation of this change.
     */
    public toJSON(): ChangeJSON<Data> {
        return this;
    }
}
