import {browser} from '@type-editor/commons';
import type {ResolvedPos} from '@type-editor/model';

import type {DocumentChange} from '../types/dom-change/DocumentChange';
import type {ParseBetweenResult} from '../types/dom-change/ParseBetweenResult';


/**
 * Checks if the Android virtual keyboard enter-and-pick-suggestion quirk is happening.
 *
 * Android's virtual keyboard has a feature where after pressing Enter, it can suggest
 * words or corrections. During this process, Android sometimes:
 * 1. Fires a DOM mutation that creates the new paragraph
 * 2. THEN moves the selection to the new paragraph
 *
 * However, ProseMirror cleans up the DOM selection during step 1, causing Android
 * to give up on step 2, leaving the cursor in the wrong place (issue #1059).
 *
 * This function detects that specific sequence by checking:
 * - Running on Android
 * - Change is not inline (block-level change)
 * - Start and end are in different blocks ($from.start() !== $to.start())
 * - End position is at the very start of its parent ($to.parentOffset === 0)
 * - Both positions are at the same depth
 * - Selection exists and is collapsed (anchor === head)
 * - Selection is at the end of the change (head === change.endA)
 *
 * When detected, the code drops the new paragraph from the change and dispatches
 * a simulated Enter key event instead.
 *
 * @param $from - Start position in parsed document (resolved position)
 * @param $to - End position in parsed document (resolved position)
 * @param inlineChange - Whether the change is within inline content
 * @param parse - Parsed document information including selection state
 * @param change - The detected document change
 * @returns True if this matches the Android enter-suggestion quirk pattern,
 *          false otherwise
 *
 * @see https://github.com/ProseMirror/prosemirror/issues/1059
 */
export function isAndroidEnterSuggestionQuirk($from: ResolvedPos,
                                              $to: ResolvedPos,
                                              inlineChange: boolean,
                                              parse: ParseBetweenResult,
                                              change: DocumentChange
): boolean {
    return browser.android
        && !inlineChange
        && $from.start() !== $to.start()
        && $to.parentOffset === 0
        && $from.depth === $to.depth
        && parse.sel !== null
        && parse.sel.anchor === parse.sel.head
        && parse.sel.head === change.endA;
}
