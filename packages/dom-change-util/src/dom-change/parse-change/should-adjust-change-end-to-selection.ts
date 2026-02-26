import type {PmSelection} from '@type-editor/editor-types';

import type {DocumentChange} from '../types/dom-change/DocumentChange';


/**
 * Checks if change end should be adjusted to selection end.
 *
 * Similar to start adjustment, when typing at the end of a selection, if the
 * typed character matches the character at the selection end, the diff algorithm
 * might place the change end before that matching character. This function
 * detects that case.
 *
 * The adjustment is needed when:
 * - The detected change ends before the selection end
 * - But is very close (within 2 positions) to the selection end
 * - And the selection end is within the parsed range
 *
 * When this condition is met, both endA and endB of the change are adjusted
 * to match the selection boundary.
 *
 * @param change - The detected document change
 * @param selection - Current editor selection state
 * @param parseTo - End position of the parsed range in the document.
 *                  Used to verify selection is within parsed content.
 * @returns True if the change end should be adjusted to match selection.to,
 *          false if no adjustment is needed
 */
export function shouldAdjustChangeEndToSelection(change: DocumentChange,
                                                 selection: PmSelection,
                                                 parseTo: number): boolean {
    return change.endA < selection.to
        && change.endA >= selection.to - 2
        && selection.to <= parseTo;
}
