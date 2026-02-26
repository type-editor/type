import {isUndefinedOrNull} from '@type-editor/commons';


/**
 * Stores metadata for a part of a change.
 *
 * A Span represents a contiguous range in a document with associated metadata.
 * Spans are immutable and can be sliced, joined, or cut to create new spans.
 *
 * @template Data - The type of metadata associated with this span.
 */
export class Span<Data = any> {

    /** An empty span array constant to avoid allocations. */
    public static readonly none: ReadonlyArray<Span> = [];

    private readonly _length: number;
    private readonly _data: Data;

    /**
     * Creates a new Span with the specified length and associated data.
     *
     * @param length - The length of this span (must be non-negative).
     * @param data - The metadata associated with this span.
     */
    constructor (length: number, data: Data) {
        this._length = length;
        this._data = data;
    }

    /** Returns the length of this span. */
    get length(): number {
        return this._length;
    }

    /** Returns the metadata associated with this span. */
    get data(): Data {
        return this._data;
    }

    /**
     * Creates a new span with a different length but the same data.
     * If the length matches, returns this span to avoid allocation.
     *
     * @param length - The length for the new span.
     * @returns A span with the specified length.
     */
    private cut(length: number): Span<Data> {
        return length === this.length ? this : new Span(length, this._data);
    }


    /**
     * Slices a range from an array of spans.
     *
     * This extracts a sub-range from a span array, potentially cutting spans
     * that partially overlap with the range boundaries.
     *
     * @template Data - The type of metadata in the spans.
     * @param spans - The array of spans to slice from.
     * @param from - The start position (inclusive).
     * @param to - The end position (exclusive).
     * @returns A new array containing the spans within the specified range.
     */
    public static slice<Data>(spans: ReadonlyArray<Span<Data>>,
                              from: number,
                              to: number): ReadonlyArray<Span<Data>> {
        // Empty range
        if (from === to) {
            return Span.none;
        }

        // Fast path: if starting from 0 and spans is empty or has known length
        // Only check for full range when from === 0 to avoid unnecessary iteration
        if (from === 0) {
            // Calculate length only when there's potential for a full-range optimization
            const totalLength = Span.len(spans);
            if (to >= totalLength) {
                return spans;
            }
        }

        const result: Array<Span<Data>> = [];
        let offset = 0;

        for (let i = 0; offset < to && i < spans.length; i++) {
            const span: Span<Data> = spans[i];
            const spanEnd: number = offset + span.length;

            // Calculate how much of this span overlaps with [from, to)
            const overlapStart: number = Math.max(from, offset);
            const overlapEnd: number = Math.min(to, spanEnd);
            const overlapLength: number = overlapEnd - overlapStart;

            if (overlapLength > 0) {
                result.push(span.cut(overlapLength));
            }

            offset = spanEnd;
        }

        return result;
    }


    /**
     * Joins two span arrays, potentially combining adjacent spans at the boundary.
     *
     * When the last span of the first array and the first span of the second array
     * meet, the combine function is called. If it returns a value, those spans are
     * merged into a single span with the combined data.
     *
     * @template Data - The type of metadata in the spans.
     * @param spanListA - The first array of spans.
     * @param spanListB - The second array of spans.
     * @param combine - Function to combine the data of adjacent spans. Returns
     *                  the combined data, or null/undefined if spans should not be merged.
     * @returns A new array containing the joined spans.
     */
    public static join<Data>(spanListA: ReadonlyArray<Span<Data>>,
                             spanListB: ReadonlyArray<Span<Data>>,
                             combine: (dataA: Data, dataB: Data) => Data): ReadonlyArray<Span<Data>> {
        // Fast paths for empty arrays
        if (spanListA.length === 0) {
            return spanListB;
        }

        if (spanListB.length === 0) {
            return spanListA;
        }

        // Try to combine the boundary spans
        const lastSpanA: Span<Data> = spanListA[spanListA.length - 1];
        const firstSpanB: Span<Data> = spanListB[0];
        const combinedData: Data = combine(lastSpanA.data, firstSpanB.data);

        // If spans cannot be combined, just concatenate
        if (isUndefinedOrNull(combinedData)) {
            return spanListA.concat(spanListB);
        }

        // Build result with merged boundary span
        const result: Array<Span<Data>> = spanListA.slice(0, spanListA.length - 1);
        const mergedSpan = new Span(lastSpanA.length + firstSpanB.length, combinedData);
        result.push(mergedSpan);

        // Add remaining spans from spanListB
        for (let i = 1; i < spanListB.length; i++) {
            result.push(spanListB[i]);
        }

        return result;
    }


    /**
     * Calculates the total length of an array of spans.
     *
     * @template Data - The type of metadata in the spans.
     * @param spans - The array of spans to measure.
     * @returns The sum of all span lengths.
     */
    private static len<Data>(spans: ReadonlyArray<Span<Data>>): number {
        let totalLength = 0;
        for (const span of spans) {
            totalLength += span.length;
        }
        return totalLength;
    }
}
