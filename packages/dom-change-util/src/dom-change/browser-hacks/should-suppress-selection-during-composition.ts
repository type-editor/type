import {browser} from '@type-editor/commons';
import type {PmEditorView, PmSelection, PmTransaction} from '@type-editor/editor-types';

import {CHROME_DELETE_TIME_THRESHOLD} from '../constants';
import type {DocumentChange} from '../types/dom-change/DocumentChange';

/**
 * Checks if selection should be suppressed due to Chrome composition issues.
 *
 * During IME composition and in certain edge cases, Chrome and IE have quirks
 * where they report incorrect selection positions. This function detects those
 * cases so that the selection update can be skipped.
 *
 * **Chrome composition issue:**
 * During composition, Chrome sometimes reports the selection in the wrong place.
 * The check detects this by looking for:
 * - Chrome browser during composition
 * - Empty (collapsed) selection
 * - Recent delete operation OR change is not zero-width
 * - Selection head is at the start of the change or at the mapped end
 *
 * **IE edge case:**
 * IE doesn't move the cursor forward when starting to type in an empty block
 * or between BR nodes. Detected by:
 * - IE browser
 * - Empty selection at the start of the change
 *
 * In both cases, the selection update is skipped to avoid placing the cursor
 * in the wrong position.
 *
 * @param view - The editor view containing composition state
 * @param selection - The selection to check (from parsed content)
 * @param change - The detected document change
 * @param chFrom - Change start position in the current document
 * @param chTo - Change end position in the current document (before mapping)
 * @param transaction - The transaction being built, used to map positions
 * @returns True if selection should be suppressed (not applied to transaction),
 *          false if selection should be set normally
 */
export function shouldSuppressSelectionDuringComposition(view: PmEditorView,
                                                         selection: PmSelection,
                                                         change: DocumentChange,
                                                         chFrom: number,
                                                         chTo: number,
                                                         transaction: PmTransaction): boolean {
    // Chrome composition issues
    const isChromeCompositionIssue = browser.chrome
        && view.composing
        && selection.empty
        && (change.start !== change.endB || view.input.lastChromeDelete < Date.now() - CHROME_DELETE_TIME_THRESHOLD)
        && (selection.head === chFrom || selection.head === transaction.mapping.map(chTo) - 1);

    // IE edge case
    const isIEEdgeCase = browser.ie && selection.empty && selection.head === chFrom;

    return isChromeCompositionIssue || isIEEdgeCase;
}
