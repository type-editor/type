import type {Fragment} from '../elements/Fragment';
import type {Node as PmNode} from '../elements/Node';

/**
 * Utilities for finding differences between fragments.
 *
 * These functions are used to efficiently detect where two document fragments
 * diverge, which is essential for operations like change tracking, diffing,
 * and collaborative editing.
 */

/**
 * Find the first position at which two fragments differ.
 *
 * This function performs a deep comparison of two fragments, starting from the
 * beginning and moving forward until it finds the first difference. It compares
 * nodes recursively, checking:
 * - Reference equality (same node object)
 * - Markup equality (same type and attributes)
 * - Text content character-by-character for text nodes
 * - Child content recursively for container nodes
 *
 * The comparison is optimized to skip identical subtrees by checking reference
 * equality first. For text nodes, it performs character-by-character comparison
 * to find the exact position where the text diverges.
 *
 * @param a - The first fragment to compare.
 * @param b - The second fragment to compare.
 * @param pos - The starting position offset in the document. This is used to
 *              calculate absolute positions in the document tree. Should typically
 *              start at 0 for top-level comparisons.
 * @returns The position where the fragments first differ, or `null` if the
 *          fragments are identical. The position is relative to the start of
 *          fragment `a` and accounts for the initial `pos` offset.
 *
 * @example
 * ```typescript
 * const diff = findDiffStart(oldFragment, newFragment, 0);
 * if (diff !== null) {
 *   console.log(`Fragments differ at position ${diff}`);
 * } else {
 *   console.log('Fragments are identical');
 * }
 * ```
 */
export function findDiffStart(a: Fragment, b: Fragment, pos: number): number | null {
    for (let i = 0; ; i++) {
        if (i === a.childCount || i === b.childCount) {
            return a.childCount === b.childCount ? null : pos;
        }

        const childA: PmNode = a.child(i);
        const childB: PmNode = b.child(i);
        if (childA === childB) {
            pos += childA.nodeSize;
            continue;
        }

        if (!childA.sameMarkup(childB)) {
            return pos;
        }

        if (childA.isText && childA.text !== childB.text) {
            const textA = childA.text;
            const textB = childB.text;
            if (textA && textB) {
                for (let j = 0; j < textA.length && j < textB.length && textA[j] === textB[j]; j++) {
                    pos++;
                }
            }
            return pos;
        }

        if (childA.content.size || childB.content.size) {
            const inner: number = findDiffStart(childA.content, childB.content, pos + 1);
            if (inner !== null) {
                return inner;
            }
        }
        pos += childA.nodeSize;
    }
}
