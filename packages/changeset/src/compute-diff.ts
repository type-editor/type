import type {Fragment} from '@type-editor/model';

import type {Change} from './Change';
import {DefaultEncoder} from './default-encoder';
import {runMyersDiff} from './myers-diff/run-myers-diff';
import {tokenizeFragment} from './tokenizer/tokenize-fragment';
import type {TokenEncoder} from './types/TokenEncoder';
import type {TrimmedRange} from './types/TrimmedRange';


/**
 * Compute the difference between two fragments using Myers' diff algorithm.
 *
 * This implementation optimizes by first scanning from both ends to eliminate
 * unchanged content, then applies the Myers algorithm to the remaining content.
 * For performance reasons, the diff computation is limited by MAX_DIFF_SIZE.
 *
 * @param fragA - The first fragment to compare.
 * @param fragB - The second fragment to compare.
 * @param range - The change range to analyze.
 * @param encoder - The encoder to use for tokenization (defaults to DefaultEncoder).
 * @returns An array of Change objects representing the differences.
 */
export function computeDiff<T>(fragA: Fragment,
                               fragB: Fragment,
                               range: Change,
                               encoder: TokenEncoder<T> = DefaultEncoder as TokenEncoder<T>): Array<Change> {
    const tokensA: Array<T> = tokenizeFragment(fragA, encoder, range.fromA, range.toA, []);
    const tokensB: Array<T> = tokenizeFragment(fragB, encoder, range.fromB, range.toB, []);

    // Create a bound comparison function to avoid unbound method issues
    const compareTokens = (a: T, b: T): boolean => encoder.compareTokens(a, b);

    const trimmedRange: TrimmedRange = trimEqualTokens(tokensA, tokensB, compareTokens);

    if (trimmedRange.start === tokensA.length && trimmedRange.start === tokensB.length) {
        return [];
    }

    // If the result is simple or too large to compute efficiently, return the entire range
    if (isSimpleDiff(trimmedRange)) {
        return [range.slice(trimmedRange.start, trimmedRange.endA, trimmedRange.start, trimmedRange.endB)];
    }

    // Apply Myers' diff algorithm to find the optimal diff
    const changes: Array<Change> = runMyersDiff(
        tokensA,
        tokensB,
        trimmedRange,
        compareTokens,
        range
    );

    return changes ?? [range.slice(trimmedRange.start, trimmedRange.endA, trimmedRange.start, trimmedRange.endB)];
}


/**
 * Trim equal tokens from both the start and end of the sequences.
 * This optimization reduces the amount of work needed by the diff algorithm.
 *
 * @param tokensA - The first token sequence.
 * @param tokensB - The second token sequence.
 * @param compareTokens - The function to compare tokens for equality.
 * @returns An object containing the trimmed start and end positions.
 */
function trimEqualTokens<T>(tokensA: Array<T>,
                            tokensB: Array<T>,
                            compareTokens: (a: T, b: T) => boolean): TrimmedRange {
    let start = 0;
    let endA = tokensA.length;
    let endB = tokensB.length;

    // Scan from the start
    while (start < tokensA.length && start < tokensB.length && compareTokens(tokensA[start], tokensB[start])) {
        start++;
    }

    // Scan from the end
    while (endA > start && endB > start && compareTokens(tokensA[endA - 1], tokensB[endB - 1])) {
        endA--;
        endB--;
    }

    return {start, endA, endB};
}

/**
 * Check if the diff is simple enough to return without running the full algorithm.
 * A diff is considered simple if one or both sequences are empty after trimming,
 * or if the remaining sequences have only one token each.
 *
 * @param range - The trimmed range to check.
 * @returns True if the diff is simple, false otherwise.
 */
function isSimpleDiff(range: TrimmedRange): boolean {
    return range.endA === range.start
        || range.endB === range.start
        || (range.endA === range.endB && range.endA === range.start + 1);
}
