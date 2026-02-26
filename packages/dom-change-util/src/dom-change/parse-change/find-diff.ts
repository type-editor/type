import {isUndefinedOrNull} from '@type-editor/commons';
import {type DiffPosition, type Fragment} from '@type-editor/model';

import type {DocumentChange} from '../types/dom-change/DocumentChange';


/**
 * Finds the difference between two fragments and returns the positions of the change.
 *
 * This is the core diff algorithm for detecting what changed between the old document
 * and the parsed DOM content. It uses ProseMirror's built-in diff methods and then
 * applies sophisticated adjustments to handle edge cases.
 *
 * **Algorithm Steps:**
 *
 * 1. **Find diff start:** Use Fragment.findDiffStart to find where content diverges
 * 2. **Find diff end:** Use Fragment.findDiffEnd to find where content converges again
 * 3. **Adjust for preferred position:** When the user's cursor is known, bias the
 *    diff boundaries toward that position for more intuitive change detection
 * 4. **Handle surrogate pairs:** Unicode characters outside BMP use surrogate pairs;
 *    ensure we don't split them when adjusting boundaries
 *
 * **Preferred Position Handling:**
 *
 * When preferredPos is between the diff boundaries, the algorithm tries to move
 * the boundaries to include the cursor position. This ensures changes appear to
 * happen at the cursor rather than at arbitrary matching text positions.
 *
 * For example, if typing "a" in "bat" where cursor is after "b", prefer detecting
 * the change as "b|at" → "ba|at" rather than "ba|t" → "ba|at".
 *
 * **Surrogate Pair Handling:**
 *
 * UTF-16 surrogate pairs (used for emoji and other non-BMP characters) must not
 * be split. When adjusting boundaries, if we land in the middle of a surrogate
 * pair, adjust by one position to keep the pair intact.
 *
 * @param oldFragment - The original fragment from the current document
 * @param newFragment - The new fragment from the parsed DOM
 * @param pos - The base position offset in the document where these fragments start
 * @param preferredPos - The preferred cursor position to anchor the diff around
 * @param preferredSide - Whether to prefer anchoring to 'start' or 'end' of changes.
 *                        'end' is preferred after backspace, 'start' for insertions.
 * @returns A DocumentChange object with start, endA (old end), and endB (new end) positions,
 *          or null if the fragments are identical
 *
 * @see {@link DocumentChange} for return type structure
 * @remarks Includes special handling for Unicode surrogate pairs (e.g., emoji)
 * @see getPreferredDiffPosition for how preferred position is determined
 */
export function findDiff(oldFragment: Fragment,
                         newFragment: Fragment,
                         pos: number,
                         preferredPos: number,
                         preferredSide: 'start' | 'end'): DocumentChange | null {
    let start: number | null = oldFragment.findDiffStart(newFragment, pos);

    if (isUndefinedOrNull(start)) {
        return null;
    }

    const diffEnd: DiffPosition = oldFragment.findDiffEnd(newFragment, pos + oldFragment.size, pos + newFragment.size);

    // Adjust preferred position when anchoring to end
    if (preferredSide === 'end') {
        const adjust: number = Math.max(0, start - Math.min(diffEnd.selfPos, diffEnd.otherPos));
        preferredPos -= diffEnd.selfPos + adjust - start;
    }

    // Handle case where old fragment is smaller than new (insertion)
    if (diffEnd.selfPos < start && oldFragment.size < newFragment.size) {
        const move: number = preferredPos <= start && preferredPos >= diffEnd.selfPos ? start - preferredPos : 0;
        start -= move;

        // Adjust for surrogate pairs
        if (start && start < newFragment.size && isSurrogatePair(newFragment.textBetween(start - 1, start + 1))) {
            start += move ? 1 : -1;
        }

        diffEnd.otherPos = start + (diffEnd.otherPos - diffEnd.selfPos);
        diffEnd.selfPos = start;
    }
    // Handle case where new fragment is smaller than old (deletion)
    else if (diffEnd.otherPos < start) {
        const move: number = preferredPos <= start && preferredPos >= diffEnd.otherPos ? start - preferredPos : 0;
        start -= move;

        // Adjust for surrogate pairs
        if (start && start < oldFragment.size && isSurrogatePair(oldFragment.textBetween(start - 1, start + 1))) {
            start += move ? 1 : -1;
        }

        diffEnd.selfPos = start + (diffEnd.selfPos - diffEnd.otherPos);
        diffEnd.otherPos = start;
    }

    return { start, endA: diffEnd.selfPos, endB: diffEnd.otherPos };
}


/**
 * Checks if a string represents a UTF-16 surrogate pair.
 *
 * UTF-16 encodes Unicode characters outside the Basic Multilingual Plane (BMP)
 * using surrogate pairs - two 16-bit code units that together represent a single
 * character. Examples include most emoji, some Chinese characters, and various
 * symbols.
 *
 * **Surrogate Pair Structure:**
 * - High surrogate: 0xD800-0xDBFF (first code unit)
 * - Low surrogate: 0xDC00-0xDFFF (second code unit)
 *
 * This function checks if a 2-character string is a valid surrogate pair by
 * verifying that the first character is a low surrogate and the second is a
 * high surrogate. This is important for change detection because we must never
 * split a surrogate pair when adjusting diff boundaries.
 *
 * **Note:** The order check (low followed by high) matches the specific case
 * this code needs to handle when looking at text around a boundary position.
 *
 * @param str - The string to check. Must be exactly 2 characters for a surrogate pair.
 *              Typically obtained from textBetween(pos-1, pos+1).
 * @returns True if the string is a valid UTF-16 surrogate pair (low followed by high),
 *          false otherwise (including if length !== 2)
 *
 * @example
 * ```typescript
 * isSurrogatePair('😀')  // true - emoji are surrogate pairs
 * isSurrogatePair('ab')  // false - regular ASCII characters
 * isSurrogatePair('a')   // false - wrong length
 * ```
 *
 * @see https://en.wikipedia.org/wiki/UTF-16#Code_points_from_U+010000_to_U+10FFFF
 */
function isSurrogatePair(str: string): boolean {
    if (str.length !== 2) {
        return false;
    }

    const firstChar: number = str.charCodeAt(0);
    const secondChar: number = str.charCodeAt(1);

    // Low surrogate (0xDC00-0xDFFF) followed by high surrogate (0xD800-0xDBFF)
    return firstChar >= 0xDC00
        && firstChar <= 0xDFFF
        && secondChar >= 0xD800
        && secondChar <= 0xDBFF;
}
