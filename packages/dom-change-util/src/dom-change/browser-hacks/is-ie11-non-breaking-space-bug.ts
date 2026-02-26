import {browser} from '@type-editor/commons';

import type {DocumentChange} from '../types/dom-change/DocumentChange';
import type {ParseBetweenResult} from '../types/dom-change/ParseBetweenResult';

/**
 * Checks if this is the IE11 non-breaking space bug.
 *
 * IE11 has a quirk where typing a space before another space causes it to insert
 * a non-breaking space (U+00A0) _ahead_ of the cursor instead of a regular space
 * at the cursor position. This can cause the change detection to be off by one
 * character.
 *
 * The bug is detected by checking:
 * - Browser is IE11 or earlier
 * - Change is exactly one character (endB - start === 1)
 * - Change is a replacement (endA === start)
 * - Change is not at the very start of the parsed range
 * - The character before and after the change position is space + nbsp
 *
 * When detected, the change positions are adjusted backwards by one to account
 * for the nbsp being inserted in the wrong place.
 *
 * @param change - The detected document change
 * @param parse - Parsed document information containing the document content
 *                for checking the surrounding characters
 * @returns True if this matches the IE11 nbsp bug pattern and adjustment is needed,
 *          false otherwise
 */
export function isIE11NonBreakingSpaceBug(change: DocumentChange, parse: ParseBetweenResult): boolean {
    return browser.ie
        && browser.ie_version <= 11
        && change.endB === change.start + 1
        && change.endA === change.start
        && change.start > parse.from
        && parse.doc.textBetween(change.start - parse.from - 1, change.start - parse.from + 1) === ' \u00a0';
}
