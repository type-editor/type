import type {Node} from '@type-editor/model';
import type {StepMap} from '@type-editor/transform';

import {Change} from './Change';
import {computeDiff} from './compute-diff';
import {DefaultEncoder} from './default-encoder';
import {Span} from './Span';
import type {ChangeSetConfig} from './types/ChangeSetConfig';
import type {TokenEncoder} from './types/TokenEncoder';


/**
 * Represents a range that spans both the old (A) and new (B) coordinate systems.
 */
interface TouchedRange {
    /** Start position in the old document (A coordinates). */
    fromA: number;
    /** End position in the old document (A coordinates). */
    toA: number;
    /** Start position in the new document (B coordinates). */
    fromB: number;
    /** End position in the new document (B coordinates). */
    toB: number;
}


/**
 * A change set tracks the changes to a document from a given point in the past.
 *
 * It condenses a number of step maps down to a flat sequence of replacements,
 * and simplifies replacements that partially undo themselves by comparing their content.
 *
 * The ChangeSet maintains two coordinate systems:
 * - **A coordinates**: Positions in the original (starting) document
 * - **B coordinates**: Positions in the current (modified) document
 *
 * @template Data - The type of metadata associated with changes (default: any).
 *
 * @example
 * ```typescript
 * // Create a changeset tracking from a document
 * const changeSet = ChangeSet.create(startDoc);
 *
 * // Add steps as they occur
 * const updated = changeSet.addSteps(newDoc, stepMaps, metadata);
 *
 * // Access the tracked changes
 * for (const change of updated.changes) {
 *   console.log(`Replaced ${change.fromA}-${change.toA} with content at ${change.fromB}-${change.toB}`);
 * }
 * ```
 */
export class ChangeSet<Data = any> {

    /**
     * Computes a diff between document fragments within a change range.
     * Exposed for testing purposes.
     *
     * @internal
     */
    public static computeDiff = computeDiff;
    /**
     * Maximum position value used as a sentinel for uninitialized range boundaries.
     * Using 2e8 (200 million) as a practical upper limit for document positions.
     */
    private static readonly MAX_POSITION = 2e8;
    /**
     * Minimum position value used as a sentinel for uninitialized range boundaries.
     */
    private static readonly MIN_POSITION = -2e8;
    private readonly _changes: ReadonlyArray<Change<Data>>;
    private readonly config: ChangeSetConfig<Data>;

    /**
     * Creates a new ChangeSet instance.
     *
     * @param config - The configuration object containing the starting document,
     *                 combine function, and token encoder.
     * @param changes - The array of changes tracked from the starting document.
     *                  These represent replaced regions in the document.
     */
    constructor(config: ChangeSetConfig<Data>, changes: ReadonlyArray<Change<Data>>) {
        this.config = config;
        this._changes = changes;
    }

    /**
     * The array of changes tracked from the starting document to the current state.
     *
     * Each change represents a replaced region, containing information about
     * what was deleted and what was inserted.
     */
    get changes(): ReadonlyArray<Change<Data>> {
        return this._changes;
    }

    /**
     * The starting document of the change set.
     *
     * This is the document that all changes are tracked relative to.
     * The A coordinates in all changes refer to positions in this document.
     */
    get startDoc(): Node {
        return this.config.doc;
    }

    /**
     * Creates a changeset with the given base document and configuration.
     *
     * The `combine` function is used to compare and combine metadata—it
     * should return null when metadata isn't compatible, and a combined
     * version for a merged range when it is.
     *
     * When given, a token encoder determines how document tokens are
     * serialized and compared when diffing the content produced by
     * changes. The default is to just compare nodes by name and text
     * by character, ignoring marks and attributes.
     *
     * @template Data - The type of metadata associated with changes.
     * @param doc - The starting document from which changes will be tracked.
     * @param combine - Function to combine metadata from adjacent spans.
     *                  Returns the combined data, or null if incompatible.
     *                  Defaults to strict equality comparison.
     * @param tokenEncoder - Encoder for tokenizing document content during diffs.
     *                       Defaults to {@link DefaultEncoder}.
     * @param changes To serialize a change set, you can store its document and
     * change array as JSON, and then pass the deserialized (via
     * [`Change.fromJSON`](#changes.Change^fromJSON)) set of changes.
     * @returns A new empty ChangeSet ready to track changes.
     *
     * @example
     * ```typescript
     * // Simple usage with default settings
     * const changeSet = ChangeSet.create(doc);
     *
     * // With custom metadata combining
     * const changeSet = ChangeSet.create<string>(doc, (a, b) => a === b ? a : null);
     * ```
     */
    public static create<Data = any>(doc: Node,
                                     combine: (dataA: Data, dataB: Data) => Data = (a, b) => a === b ? a : null as any,
                                     tokenEncoder: TokenEncoder<any> = DefaultEncoder,
                                     changes: ReadonlyArray<Change<Data>> = []): ChangeSet<Data> {
        return new ChangeSet({combine, doc, encoder: tokenEncoder}, changes);
    }

    /**
     * Computes a new changeset by adding the given step maps and
     * metadata (either as an array, per-map, or as a single value to be
     * associated with all maps) to the current set. Will not mutate the
     * old set.
     *
     * Note that due to simplification that happens after each add,
     * incrementally adding steps might create a different final set
     * than adding all those changes at once, since different document
     * tokens might be matched during simplification depending on the
     * boundaries of the current changed ranges.
     *
     * @param newDoc - The document after applying all the steps.
     * @param maps - The step maps representing the document transformations.
     * @param data - Metadata to associate with the changes. Can be a single value
     *               (applied to all maps) or an array (one per map).
     * @returns A new ChangeSet containing the merged changes.
     */
    public addSteps(newDoc: Node,
                    maps: ReadonlyArray<StepMap>,
                    data: Data | ReadonlyArray<Data>): ChangeSet<Data> {
        // This works by inspecting the position maps for the changes,
        // which indicate what parts of the document were replaced by new
        // content, and the size of that new content. It uses these to
        // build up Change objects.
        //
        // These change objects are put in sets and merged together using
        // Change.merge, giving us the changes created by the new steps.
        // Those changes can then be merged with the existing set of
        // changes.
        //
        // For each change that was touched by the new steps, we recompute
        // a diff to try to minimize the change by dropping matching
        // pieces of the old and new document from the change.

        const stepChanges: Array<Change<Data>> = this.buildChangesFromStepMaps(maps, data);

        if (stepChanges.length === 0) {
            return this;
        }

        const newChanges: ReadonlyArray<Change<Data>> = this.mergeAll(stepChanges, this.config.combine);
        const mergedChanges: ReadonlyArray<Change<Data>> = Change.merge(this._changes, newChanges, this.config.combine);
        const minimizedChanges: ReadonlyArray<Change<Data>> =
            this.minimizeChanges(
                mergedChanges,
                newChanges,
                newDoc
            );

        return new ChangeSet(this.config, minimizedChanges);
    }

    /**
     * Map the span's data values in the given set through a function
     * and construct a new set with the resulting data.
     *
     * This is useful for transforming the metadata associated with changes,
     * such as updating user references or converting between data formats.
     *
     * @param callbackFunc - A function that receives a span and returns the new data value.
     *                       If the returned data is the same as the original, the span is reused.
     * @returns A new ChangeSet with the transformed data values.
     *
     * @example
     * ```typescript
     * // Convert user IDs to usernames
     * const mapped = changeSet.map(span => userLookup[span.data.userId]);
     * ```
     */
    public map<NewData = Data>(callbackFunc: (range: Span<Data>) => NewData): ChangeSet<NewData> {
        const mapSpan = (span: Span<Data>): Span<NewData> => {
            const newData: NewData = callbackFunc(span);
            return newData === (span.data as unknown) ? (span as unknown as Span<NewData>) : new Span(span.length, newData);
        };

        // Create a new config with the same settings but typed for NewData
        const newConfig: ChangeSetConfig<NewData> = {
            doc: this.config.doc,
            combine: this.config.combine as unknown as (dataA: NewData, dataB: NewData) => NewData,
            encoder: this.config.encoder
        };

        return new ChangeSet<NewData>(newConfig, this._changes.map((ch: Change<Data>): Change<NewData> => {
            return new Change(
                ch.fromA,
                ch.toA,
                ch.fromB,
                ch.toB,
                ch.deleted.map(mapSpan),
                ch.inserted.map(mapSpan));
        }));
    }

    /**
     * Compare two changesets and return the range in which they are
     * changed, if any. If the document changed between the maps, pass
     * the maps for the steps that changed it as second argument, and
     * make sure the method is called on the old set and passed the new
     * set. The returned positions will be in new document coordinates.
     *
     * @param changeSet - The changeset to compare against.
     * @param maps - Optional step maps representing document transformations between the two changesets.
     * @returns An object with `from` and `to` properties indicating the changed range,
     *          or `null` if the changesets are identical.
     *
     * @example
     * ```typescript
     * const range = oldChangeSet.changedRange(newChangeSet, stepMaps);
     * if (range) {
     *   console.log(`Content changed from position ${range.from} to ${range.to}`);
     * }
     * ```
     */
    public changedRange(changeSet: ChangeSet, maps?: ReadonlyArray<StepMap>): { from: number, to: number; } | null {
        if (changeSet === this) {
            return null;
        }

        const touched: TouchedRange | null = maps ? this.computeTouchedRange(maps) : null;
        const moved: number = touched ? (touched.toB - touched.fromB) - (touched.toA - touched.fromA) : 0;

        /** Maps a position from A coordinates to B coordinates, accounting for offset. */
        const mapPosition = (p: number): number => {
            return !touched || p <= touched.fromA ? p : p + moved;
        };

        let from: number = touched ? touched.fromB : ChangeSet.MAX_POSITION;
        let to: number = touched ? touched.toB : ChangeSet.MIN_POSITION;

        /** Expands the result range to include the given positions. */
        const expandRange = (start: number, end = start): void => {
            from = Math.min(start, from);
            to = Math.max(end, to);
        };

        const changesA: ReadonlyArray<Change<Data>> = this._changes;
        const changesB: ReadonlyArray<Change> = changeSet.changes;

        // Walk through both change arrays in parallel, continue until both are exhausted
        for (let iA = 0, iB = 0; iA < changesA.length || iB < changesB.length;) {
            const rangeA: Change<Data> | undefined = changesA[iA];
            const rangeB: Change | undefined = changesB[iB];

            if (rangeA && rangeB && this.sameRanges(rangeA, rangeB, mapPosition)) {
                // Ranges are identical - skip both
                iA++;
                iB++;
            } else if (rangeB && (!rangeA || mapPosition(rangeA.fromB) >= rangeB.fromB)) {
                // Range B comes first or A is exhausted
                expandRange(rangeB.fromB, rangeB.toB);
                iB++;
            } else if (rangeA) {
                // Range A comes first
                expandRange(mapPosition(rangeA.fromB), mapPosition(rangeA.toB));
                iA++;
            }
        }

        return from <= to ? {from, to} : null;
    }

    /**
     * Builds Change objects from step maps and their associated metadata.
     *
     * @param maps - The step maps to process.
     * @param data - The metadata to associate with changes.
     * @returns An array of Change objects representing the step transformations.
     */
    private buildChangesFromStepMaps(maps: ReadonlyArray<StepMap>,
                                     data: Data | ReadonlyArray<Data>): Array<Change<Data>> {
        const stepChanges: Array<Change<Data>> = [];
        const isDataArray = Array.isArray(data);

        for (let i = 0; i < maps.length; i++) {
            const stepData: Data = isDataArray ? data[i] : data;
            let offset = 0;

            maps[i].forEach((fromA: number, toA: number, fromB: number, toB: number): void => {
                const deletedSpans: ReadonlyArray<Span<Data>> = fromA === toA
                    ? Span.none
                    : [new Span(toA - fromA, stepData)];
                const insertedSpans: ReadonlyArray<Span<Data>> = fromB === toB
                    ? Span.none
                    : [new Span(toB - fromB, stepData)];

                stepChanges.push(new Change(
                    fromA + offset,
                    toA + offset,
                    fromB,
                    toB,
                    deletedSpans,
                    insertedSpans
                ));

                offset += (toB - fromB) - (toA - fromA);
            });
        }

        return stepChanges;
    }

    /**
     * Minimizes changes by computing diffs to remove redundant content.
     *
     * For each change that overlaps with newly added changes, we compute
     * a diff between the old and new document content to potentially
     * split the change into smaller, more precise changes.
     *
     * @param changes - The merged changes to minimize.
     * @param newChanges - The newly added changes (used to determine which changes to minimize).
     * @param newDoc - The new document for diff computation.
     * @returns The minimized array of changes.
     */
    private minimizeChanges(changes: ReadonlyArray<Change<Data>>,
                            newChanges: ReadonlyArray<Change<Data>>,
                            newDoc: Node): ReadonlyArray<Change<Data>> {
        let result: Array<Change<Data>> | ReadonlyArray<Change<Data>> = changes;

        for (let i = 0; i < result.length; i++) {
            const change: Change<Data> = result[i];

            if (!this.shouldMinimizeChange(change, newChanges)) {
                continue;
            }

            const diff: ReadonlyArray<Change<Data>> = computeDiff(
                this.config.doc.content,
                newDoc.content,
                change,
                this.config.encoder
            );

            // Fast path: If the content is completely different, keep the original change
            if (this.isCompletelyDifferent(diff, change)) {
                continue;
            }

            // Lazily copy the array when we need to modify it
            if (result === changes) {
                result = changes.slice();
            }

            this.applyDiffToChanges(result as Array<Change<Data>>, i, diff);
            i += diff.length - 1;
        }

        return result;
    }

    /**
     * Determines if a change should be minimized via diff computation.
     *
     * Changes are minimized only if they have both deleted and inserted content,
     * and they overlap with at least one of the newly added changes.
     *
     * @param change - The change to check.
     * @param newChanges - The newly added changes.
     * @returns True if the change should be minimized.
     */
    private shouldMinimizeChange(change: Change<Data>,
                                 newChanges: ReadonlyArray<Change<Data>>): boolean {
        // Skip pure insertions or pure deletions
        if (change.fromA === change.toA || change.fromB === change.toB) {
            return false;
        }

        // Only minimize changes that overlap with newly added changes
        return newChanges.some(newChange =>
            newChange.toB > change.fromB && newChange.fromB < change.toB
        );
    }

    /**
     * Checks if a diff result indicates the content is completely different.
     *
     * @param diff - The diff result.
     * @param originalChange - The original change being diffed.
     * @returns True if the diff covers the entire range (no matches found).
     */
    private isCompletelyDifferent(diff: ReadonlyArray<Change<Data>>,
                                  originalChange: Change<Data>): boolean {
        return diff.length === 1
            && diff[0].fromB === 0
            && diff[0].toB === originalChange.toB - originalChange.fromB;
    }

    /**
     * Applies a diff result to the changes array, replacing or splicing as needed.
     *
     * @param changes - The mutable changes array.
     * @param index - The index of the change being replaced.
     * @param diff - The diff result to apply.
     */
    private applyDiffToChanges(changes: Array<Change<Data>>,
                               index: number,
                               diff: ReadonlyArray<Change<Data>>): void {
        if (diff.length === 1) {
            changes[index] = diff[0];
        } else {
            changes.splice(index, 1, ...diff);
        }
    }

    /**
     * Merges an array of changes using a divide-and-conquer approach.
     *
     * This recursively splits the array in half and merges the halves together,
     * providing O(n log n) complexity instead of O(n²) for sequential merging.
     *
     * @param ranges - The array of changes to merge.
     * @param combine - Function to combine metadata when spans are merged.
     * @param start - The start index of the range to process (default: 0).
     * @param end - The end index of the range to process (default: ranges.length).
     * @returns A merged array of changes.
     */
    private mergeAll<Data>(ranges: ReadonlyArray<Change<Data>>,
                           combine: (dA: Data, dB: Data) => Data,
                           start = 0,
                           end = ranges.length): ReadonlyArray<Change<Data>> {
        if (end === start + 1) {
            return [ranges[start]];
        }

        const mid: number = (start + end) >> 1;
        return Change.merge(
            this.mergeAll(ranges, combine, start, mid),
            this.mergeAll(ranges, combine, mid, end), combine);
    }

    /**
     * Computes the range touched by a sequence of step maps in both A and B coordinates.
     *
     * This determines the bounding box of all changes in both the old and new
     * coordinate systems.
     *
     * @param maps - The step maps to analyze.
     * @returns A TouchedRange with boundaries in both coordinate systems, or null if no changes.
     */
    private computeTouchedRange(maps: ReadonlyArray<StepMap>): TouchedRange | null {
        const rangeB: { from: number; to: number } | null = this.computeEndRange(maps);
        if (!rangeB) {
            return null;
        }

        // Compute the range in A coordinates by inverting and reversing the maps
        const invertedMaps: ReadonlyArray<StepMap> = maps
            .map((stepMap: StepMap): StepMap => stepMap.invert())
            .reverse();
        const rangeA: { from: number; to: number } | null = this.computeEndRange(invertedMaps);

        if (!rangeA) {
            return null;
        }

        return {
            fromA: rangeA.from,
            toA: rangeA.to,
            fromB: rangeB.from,
            toB: rangeB.to
        };
    }

    /**
     * Computes the cumulative range affected by a sequence of step maps.
     *
     * Maps each position through all subsequent maps to find the final
     * range boundaries.
     *
     * @param maps - The step maps to analyze.
     * @returns The range boundaries, or null if no positions were affected.
     */
    private computeEndRange(maps: ReadonlyArray<StepMap>): { from: number; to: number } | null {
        let from = ChangeSet.MAX_POSITION;
        let to = ChangeSet.MIN_POSITION;

        for (const map of maps) {
            // If we already have a range, map it through this step
            if (from !== ChangeSet.MAX_POSITION) {
                from = map.map(from, -1);
                to = map.map(to, 1);
            }

            // Expand the range to include any changes in this step
            map.forEach((_oldStart: number, _oldEnd: number, newStart: number, newEnd: number): void => {
                from = Math.min(from, newStart);
                to = Math.max(to, newEnd);
            });
        }

        return from === ChangeSet.MAX_POSITION ? null : {from, to};
    }

    /**
     * Compares two changes for equality after applying a position mapping.
     *
     * @param a - The first change.
     * @param b - The second change.
     * @param mapPosition - Function to map positions from A coordinates.
     * @returns True if the changes represent the same range and content.
     */
    private sameRanges<Data>(a: Change<Data>,
                             b: Change<Data>,
                             mapPosition: (pos: number) => number): boolean {
        return mapPosition(a.fromB) === b.fromB
            && mapPosition(a.toB) === b.toB
            && this.sameSpans(a.deleted, b.deleted)
            && this.sameSpans(a.inserted, b.inserted);
    }

    /**
     * Compares two span arrays for deep equality.
     *
     * @param a - The first span array.
     * @param b - The second span array.
     * @returns True if the arrays contain equivalent spans.
     */
    private sameSpans<Data>(a: ReadonlyArray<Span<Data>>,
                            b: ReadonlyArray<Span<Data>>): boolean {
        if (a.length !== b.length) {
            return false;
        }

        for (let i = 0; i < a.length; i++) {
            if (a[i].length !== b[i].length || a[i].data !== b[i].data) {
                return false;
            }
        }

        return true;
    }
}
