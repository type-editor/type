import type { PmDecoration } from '@type-editor/editor-types';

/**
 * Base class for decoration sources that provides common functionality
 * for handling overlapping decorations and sorting.
 *
 * This abstract class serves as a foundation for DecorationSet and
 * DecorationGroup, providing shared utility methods for managing
 * decoration collections.
 */
export abstract class AbstractDecorationSource {

    /** Empty options object used as default to avoid repeated allocations */
    protected static readonly EMPTY_DECORATION_WIDGET_OPTIONS: Record<string, never> = {};

    /**
     * Scan a sorted array of decorations for partially overlapping spans,
     * and split those so that only fully overlapping spans are left (to
     * make subsequent rendering easier). Will return the input array if
     * no partially overlapping spans are found (the common case).
     *
     * @param spans - The array of decorations to process
     * @returns A new array with overlaps removed, or the original if no overlaps exist
     */
    protected removeOverlap(spans: ReadonlyArray<PmDecoration>): Array<PmDecoration> {
        let working: Array<PmDecoration> = spans as Array<PmDecoration>;

        for (let i = 0; i < working.length - 1; i++) {
            const span: PmDecoration = working[i];

            // Skip zero-length spans
            if (span.from === span.to) {
                continue;
            }

            for (let j = i + 1; j < working.length; j++) {
                const next: PmDecoration = working[j];

                if (next.from === span.from) {
                    // Same starting position
                    if (next.to !== span.to) {
                        // Ensure we're working with a mutable copy
                        if (working === spans) {
                            working = spans.slice();
                        }

                        // Split the larger span that partially overlaps
                        working[j] = next.copy(next.from, span.to);
                        this.insertAhead(working, j + 1, next.copy(span.to, next.to));
                    }
                } else if (next.from < span.to) {
                    // Partial overlap - split the current span
                    if (working === spans) {
                        working = spans.slice();
                    }

                    working[i] = span.copy(span.from, next.from);
                    this.insertAhead(working, j, span.copy(next.from, span.to));
                    break;
                } else {
                    // No more overlaps for this span
                    break;
                }
            }
        }

        return working;
    }

    /**
     * Insert a decoration into a sorted array at the correct position.
     *
     * @param array - The array to insert into
     * @param startIndex - The index to start searching from
     * @param deco - The decoration to insert
     */
    private insertAhead(array: Array<PmDecoration>, startIndex: number, deco: PmDecoration): void {
        let insertIndex: number = startIndex;
        const notEquals = (a: PmDecoration, b: PmDecoration): number => a.from - b.from || a.to - b.to;

        while (insertIndex < array.length && notEquals(deco, array[insertIndex]) > 0) {
            insertIndex++;
        }

        array.splice(insertIndex, 0, deco);
    }

    /**
     * Comparator function used to sort decorations by position.
     * Decorations with lower start positions come first, and within
     * a set with the same start position, those with smaller end
     * positions come first.
     *
     * @returns A comparator function for sorting decorations
     */
    protected static sortDecorations(spans: Array<PmDecoration>): Array<PmDecoration> {
        return spans.sort((a: PmDecoration, b: PmDecoration): number => {
            return a.from - b.from || a.to - b.to;
        });
    }
}
