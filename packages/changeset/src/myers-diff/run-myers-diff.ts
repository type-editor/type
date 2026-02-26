import type {Change} from '../Change';
import type {TrimmedRange} from '../types/TrimmedRange';


/**
 * State for accumulating changes during traceback.
 */
interface ChangeAccumulator {
    fromA: number;
    toA: number;
    fromB: number;
    toB: number;
}

/**
 * The code below will refuse to compute a diff with more than 5000
 * insertions or deletions, which takes about 300ms to reach on my
 * machine. This is a safeguard against runaway computations.
 */
const MAX_DIFF_SIZE = 5000;


/**
 * Run Myers' diff algorithm to find the optimal sequence of changes.
 *
 * Myers' algorithm uses dynamic programming to find the shortest edit script
 * between two sequences. It explores diagonals in the edit graph, maintaining
 * a frontier of the furthest reaching paths.
 *
 * See: https://neil.fraser.name/writing/diff/myers.pdf
 * See: https://blog.jcoglan.com/2017/02/12/the-myers-diff-algorithm-part-1/
 *
 * @param tokensA - The first token sequence.
 * @param tokensB - The second token sequence.
 * @param range - The trimmed range to process.
 * @param compareTokens - The function to compare tokens for equality.
 * @param changeRange - The original change range for creating result changes.
 * @returns An array of changes, or null if the algorithm exceeded MAX_DIFF_SIZE.
 */
export function runMyersDiff<T>(tokensA: Array<T>,
                                tokensB: Array<T>,
                                range: TrimmedRange,
                                compareTokens: (a: T, b: T) => boolean,
                                changeRange: Change): Array<Change> | null {
    const lengthA: number = range.endA - range.start;
    const lengthB: number = range.endB - range.start;
    const maxOperations: number = Math.min(MAX_DIFF_SIZE, lengthA + lengthB);
    const offset: number = maxOperations + 1;
    const history: Array<Array<number>> = [];
    const frontier: Array<number> = initializeFrontier(offset * 2);

    for (let editDistance = 0; editDistance <= maxOperations; editDistance++) {
        for (let diagonal = -editDistance; diagonal <= editDistance; diagonal += 2) {
            const found: boolean = exploreDiagonal(
                tokensA,
                tokensB,
                frontier,
                diagonal,
                offset,
                range,
                lengthA,
                lengthB,
                compareTokens
            );

            if (found) {
                return tracebackChanges(
                    history,
                    frontier,
                    diagonal,
                    offset,
                    editDistance,
                    range,
                    changeRange
                );
            }
        }

        // Save frontier state every other iteration (for odd/even diagonal alternation)
        if (editDistance % 2 === 0) {
            history.push(frontier.slice());
        }
    }

    // Algorithm exceeded maximum complexity
    return null;
}

/**
 * Initialize the frontier array with -1 values.
 *
 * @param size - The size of the frontier array.
 * @returns The initialized frontier array.
 */
function initializeFrontier(size: number): Array<number> {
    return new Array<number>(size).fill(-1);
}

/**
 * Explore a diagonal in the edit graph, extending as far as possible with matching tokens.
 *
 * @param tokensA - The first token sequence.
 * @param tokensB - The second token sequence.
 * @param frontier - The current frontier array.
 * @param diagonal - The diagonal to explore.
 * @param offset - The offset for indexing the frontier.
 * @param range - The trimmed range.
 * @param lengthA - The length of sequence A.
 * @param lengthB - The length of sequence B.
 * @param compareTokens - The function to compare tokens.
 * @returns True if a complete path was found, false otherwise.
 */
function exploreDiagonal<T>(tokensA: Array<T>,
                            tokensB: Array<T>,
                            frontier: Array<number>,
                            diagonal: number,
                            offset: number,
                            range: TrimmedRange,
                            lengthA: number,
                            lengthB: number,
                            compareTokens: (a: T, b: T) => boolean): boolean {
    const nextValue: number = frontier[diagonal + 1 + offset];
    const prevValue: number = frontier[diagonal - 1 + offset];

    // Choose the path that goes furthest
    let x: number = nextValue < prevValue ? prevValue : nextValue + 1;
    let y: number = x + diagonal;

    // Pre-compute start offset to avoid repeated addition in the loop
    const startOffset: number = range.start;

    // Extend along the diagonal as far as possible with matching tokens
    while (x < lengthA && y < lengthB && compareTokens(tokensA[startOffset + x], tokensB[startOffset + y])) {
        x++;
        y++;
    }

    frontier[diagonal + offset] = x;

    // Check if we've reached the end of both sequences
    return x >= lengthA && y >= lengthB;
}

/**
 * Trace back through the history to build the set of changes.
 *
 * @param history - The history of frontier states.
 * @param frontier - The final frontier state.
 * @param diagonal - The final diagonal position.
 * @param offset - The offset for indexing.
 * @param editDistance - The final edit distance.
 * @param range - The trimmed range.
 * @param changeRange - The original change range.
 * @returns An array of changes in forward order.
 */
function tracebackChanges(history: Array<Array<number>>,
                          frontier: Array<number>,
                          diagonal: number,
                          offset: number,
                          editDistance: number,
                          range: TrimmedRange,
                          changeRange: Change): Array<Change> {
    const changes: Array<Change> = [];
    const minSpan: number = computeMinUnchangedThreshold(range.endA - range.start, range.endB - range.start);

    // Accumulator for building changes, initialized to "no change pending"
    const accumulator: ChangeAccumulator = {
        fromA: -1,
        toA: -1,
        fromB: -1,
        toB: -1
    };

    let currentDiagonal: number = diagonal;
    let currentFrontier: Array<number> = frontier;

    for (let i = editDistance - 1; i >= 0; i--) {
        const nextValue: number = currentFrontier[currentDiagonal + 1 + offset];
        const prevValue: number = currentFrontier[currentDiagonal - 1 + offset];

        let x: number;
        let y: number;

        if (nextValue < prevValue) {
            // Deletion
            currentDiagonal--;
            x = prevValue + range.start;
            y = x + currentDiagonal;
            addChange(accumulator, changes, changeRange, minSpan, x, x, y, y + 1);
        } else {
            // Insertion
            currentDiagonal++;
            x = nextValue + range.start;
            y = x + currentDiagonal;
            addChange(accumulator, changes, changeRange, minSpan, x, x + 1, y, y);
        }

        currentFrontier = history[i >> 1];
    }

    // Flush any pending change
    if (accumulator.fromA > -1) {
        changes.push(changeRange.slice(accumulator.fromA, accumulator.toA, accumulator.fromB, accumulator.toB));
    }

    return changes.reverse();
}

/**
 * Compute the minimum length of an unchanged range (not at the start/end of the compared content).
 *
 * The algorithm scales the threshold based on the size of the input, which prevents
 * the diff from becoming fragmented with coincidentally matching characters when
 * comparing larger texts. For small diffs, the threshold is 2; for larger ones,
 * it scales up to a maximum of 15.
 *
 * @param sizeA - The size of the first sequence.
 * @param sizeB - The size of the second sequence.
 * @returns The minimum length for an unchanged range (between 2 and 15).
 */
function computeMinUnchangedThreshold(sizeA: number, sizeB: number): number {
    const maxSize = Math.max(sizeA, sizeB);
    const scaledThreshold = Math.floor(maxSize / 10);
    return Math.min(15, Math.max(2, scaledThreshold));
}

/**
 * Add a change to the accumulator, merging with the previous change if they're close enough.
 *
 * @param accumulator - The change accumulator state.
 * @param changes - The array of changes being built.
 * @param changeRange - The original change range.
 * @param minSpan - The minimum span between changes to keep them separate.
 * @param fromA - The start position in sequence A.
 * @param toA - The end position in sequence A.
 * @param fromB - The start position in sequence B.
 * @param toB - The end position in sequence B.
 */
function addChange(accumulator: ChangeAccumulator,
                   changes: Array<Change>,
                   changeRange: Change,
                   minSpan: number,
                   fromA: number,
                   toA: number,
                   fromB: number,
                   toB: number): void {
    if (accumulator.fromA > -1 && accumulator.fromA < toA + minSpan) {
        // Merge with the existing accumulated change
        accumulator.fromA = fromA;
        accumulator.fromB = fromB;
    } else {
        // Flush the previous change and start a new one
        if (accumulator.fromA > -1) {
            changes.push(changeRange.slice(accumulator.fromA, accumulator.toA, accumulator.fromB, accumulator.toB));
        }
        accumulator.fromA = fromA;
        accumulator.toA = toA;
        accumulator.fromB = fromB;
        accumulator.toB = toB;
    }
}
