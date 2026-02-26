import type {PmEditorView} from '@type-editor/editor-types';

import type {DocumentChange} from '../types/dom-change/DocumentChange';

/**
 * Checks if the change needs adjustment to handle typing over selection edge cases.
 *
 * When typing over a selection, there's an edge case: if the typed character
 * matches the character at the start or end of the selection, the diff algorithm
 * might detect a change that's smaller than the actual selection. This is because
 * the diff sees matching characters and doesn't include them in the change range.
 *
 * For example, typing "t" over the selection "test" might be detected as just
 * replacing "est" because the first "t" matches.
 *
 * This function detects when such adjustment is needed by checking:
 * - There's an active range selection (from < to)
 * - The change is zero-width (start === endB), indicating a replacement
 * - The selection is a text selection
 *
 * @param view - The editor view containing the current selection state
 * @param change - The detected document change with start, endA, and endB positions
 * @returns True if the change needs adjustment to match the full selection range,
 *          false if the change is correctly sized
 *
 * @see shouldAdjustChangeStartToSelection for start adjustment logic
 * @see shouldAdjustChangeEndToSelection for end adjustment logic
 */
export function needsSelectionOverwriteAdjustment(view: PmEditorView, change: DocumentChange): boolean {
    return view.state.selection.from < view.state.selection.to
        && change.start === change.endB
        && view.state.selection.isTextSelection();
}
