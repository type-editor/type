import {Change} from '../Change';
import {Span} from '../Span';


/**
 * Creates a merged change that spans from fromB to toB, filling gaps between changes.
 *
 * This function takes a sequence of changes and creates a single change that covers
 * a broader range, filling any gaps between the original changes. The gaps are filled
 * with spans using the data from adjacent changes.
 *
 * @param changes - The array of changes to merge.
 * @param fromB - The start position in the new document.
 * @param toB - The end position in the new document.
 * @returns A new Change covering the expanded range.
 */
export function fillChange(changes: ReadonlyArray<Change>, fromB: number, toB: number): Change {
    // Calculate the corresponding positions in the old document
    const fromA: number = changes[0].fromA - (changes[0].fromB - fromB);
    const lastChange: Change = changes[changes.length - 1];
    const toA: number = lastChange.toA + (toB - lastChange.toB);

    // Initialize span arrays
    let deletedSpans: ReadonlyArray<Span> = Span.none;
    let insertedSpans: ReadonlyArray<Span> = Span.none;

    // Get initial data for filling gaps (prefer actual changes over empty ones)
    const initialSpans = changes[0].deleted.length ? changes[0].deleted :
        changes[0].inserted.length ? changes[0].inserted : null;
    let deletedData = initialSpans?.[0]?.data;
    let insertedData = (changes[0].inserted.length
        ? changes[0].inserted
        : changes[0].deleted.length ? changes[0].deleted : null)?.[0]?.data;

    let positionA = fromA;
    let positionB = fromB;

    for (let i = 0; i <= changes.length; i++) {
        const currentChange: Change | null = i === changes.length ? null : changes[i];
        const endA: number = currentChange ? currentChange.fromA : toA;
        const endB: number = currentChange ? currentChange.fromB : toB;

        // Fill gap in old document if there is one
        if (endA > positionA) {
            deletedSpans = Span.join(
                deletedSpans,
                [new Span(endA - positionA, deletedData)],
                combineSpanData
            );
        }

        // Fill gap in new document if there is one
        if (endB > positionB) {
            insertedSpans = Span.join(
                insertedSpans,
                [new Span(endB - positionB, insertedData)],
                combineSpanData
            );
        }

        // If we've processed all changes, we're done
        if (!currentChange) {
            break;
        }

        // Add the actual change spans
        deletedSpans = Span.join(deletedSpans, currentChange.deleted, combineSpanData);
        insertedSpans = Span.join(insertedSpans, currentChange.inserted, combineSpanData);

        // Update data for the next gap fill
        if (deletedSpans.length > 0) {
            deletedData = deletedSpans[deletedSpans.length - 1].data;
        }
        if (insertedSpans.length > 0) {
            insertedData = insertedSpans[insertedSpans.length - 1].data;
        }

        // Move positions forward
        positionA = currentChange.toA;
        positionB = currentChange.toB;
    }

    return new Change(fromA, toA, fromB, toB, deletedSpans, insertedSpans);
}

/**
 * Combines two span data values by returning the value if they're equal, or null otherwise.
 *
 * This function is used as a callback for Span.join operations to determine if adjacent
 * spans with the same data can be merged.
 *
 * @template T - The type of data being compared.
 * @param a - The first data value.
 * @param b - The second data value.
 * @returns The data value if both are equal, null otherwise.
 */
function combineSpanData<T>(a: T, b: T): T | null {
    return a === b ? a : null;
}
