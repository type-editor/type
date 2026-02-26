import type {PmSelection} from '@type-editor/editor-types';

import type {DocumentChange} from '../types/dom-change/DocumentChange';


/**
 * Checks if change start should be adjusted to selection start.
 *
 * When typing at the start of a selection, if the typed character matches the
 * character at the selection start, the diff algorithm might place the change
 * start after that matching character. This function detects that case.
 *
 * The adjustment is needed when:
 * - The detected change starts after the selection start
 * - But is very close (within 2 positions) to the selection start
 * - And the selection start is within the parsed range
 *
 * The threshold of 2 positions handles multi-byte characters and ensures
 * we don't over-adjust.
 *
 * @param change - The detected document change
 * @param selection - Current editor selection state
 * @param parseFrom - Start position of the parsed range in the document.
 *                    Used to verify selection is within parsed content.
 * @returns True if the change start should be adjusted to match selection.from,
 *          false if no adjustment is needed
 */
export function shouldAdjustChangeStartToSelection(change: DocumentChange,
                                                   selection: PmSelection,
                                                   parseFrom: number): boolean {
    return change.start > selection.from
        && change.start <= selection.from + 2
        && selection.from >= parseFrom;
}
