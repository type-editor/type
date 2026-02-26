import type {Fragment} from '../elements/Fragment';
import type {Node as PmNode} from '../elements/Node';
import type {DiffPosition} from '../types/diff/DiffPosition';

/**
 * Utilities for finding differences between fragments.
 *
 * These functions are used to efficiently detect where two document fragments
 * diverge, which is essential for operations like change tracking, diffing,
 * and collaborative editing.
 */

/**
 * Find the last position at which two fragments differ.
 *
 * This function performs a deep comparison of two fragments, starting from the
 * end and moving backward until it finds the last difference. It's the complement
 * to `findDiffStart` and is used together with it to determine the exact range
 * of changes between two document states.
 *
 * The function compares nodes in reverse order, checking:
 * - Reference equality (same node object)
 * - Markup equality (same type and attributes)
 * - Text content character-by-character from the end for text nodes
 * - Child content recursively for container nodes
 *
 * Like `findDiffStart`, this function is optimized to skip identical subtrees
 * by checking reference equality first. For text nodes, it performs reverse
 * character-by-character comparison to find the exact position where the text
 * diverges from the end.
 *
 * @param a - The first fragment to compare.
 * @param b - The second fragment to compare.
 * @param posA - The ending position in fragment `a`. This should typically be
 *               the size of fragment `a` minus 1 for top-level comparisons.
 *               The function counts backwards from this position.
 * @param posB - The ending position in fragment `b`. This should typically be
 *               the size of fragment `b` minus 1 for top-level comparisons.
 *               The function counts backwards from this position.
 * @returns A `DiffPosition` object containing the positions where the fragments
 *          last differ (`selfPos` in fragment `a` and `otherPos` in fragment `b`),
 *          or `null` if the fragments are identical. The positions indicate the
 *          end boundary of the differing region.
 *
 * @example
 * ```typescript
 * const diffEnd = findDiffEnd(
 *   oldFragment,
 *   newFragment,
 *   oldFragment.size,
 *   newFragment.size
 * );
 * if (diffEnd !== null) {
 *   console.log(`Last difference at positions ${diffEnd.selfPos} and ${diffEnd.otherPos}`);
 * } else {
 *   console.log('Fragments are identical');
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Finding the exact range of changes
 * const start = findDiffStart(oldFragment, newFragment, 0);
 * const end = findDiffEnd(
 *   oldFragment,
 *   newFragment,
 *   oldFragment.size,
 *   newFragment.size
 * );
 * if (start !== null && end !== null) {
 *   console.log(`Changes span from ${start} to ${end.selfPos} in old fragment`);
 *   console.log(`Changes span from ${start} to ${end.otherPos} in new fragment`);
 * }
 * ```
 */
export function findDiffEnd(a: Fragment, b: Fragment, posA: number, posB: number): DiffPosition | null {
    for (let iA = a.childCount, iB = b.childCount; ;) {
        if (iA === 0 || iB === 0) {
            return iA === iB ? null : {selfPos: posA, otherPos: posB, a: posA, b: posB};
        }

        const childA: PmNode = a.child(--iA);
        const childB: PmNode = b.child(--iB);
        const size: number = childA.nodeSize;
        if (childA === childB) {
            posA -= size;
            posB -= size;
            continue;
        }

        if (!childA.sameMarkup(childB)) {
            return {selfPos: posA, otherPos: posB, a: posA, b: posB};
        }

        if (childA.isText && childA.text !== childB.text) {
            const textA = childA.text;
            const textB = childB.text;
            if (textA && textB) {
                const minSize: number = Math.min(textA.length, textB.length);

                let same = 0;
                while (same < minSize && textA[textA.length - same - 1] === textB[textB.length - same - 1]) {
                    same++;
                    posA--;
                    posB--;
                }
            }
            return {selfPos: posA, otherPos: posB, a: posA, b: posB};
        }

        if (childA.content.size || childB.content.size) {
            const inner: DiffPosition = findDiffEnd(childA.content, childB.content, posA - 1, posB - 1);
            if (inner !== null) {
                return inner;
            }
        }
        posA -= size;
        posB -= size;
    }
}
