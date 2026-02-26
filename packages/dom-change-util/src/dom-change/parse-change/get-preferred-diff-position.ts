import {KEY_BACKSPACE} from '@type-editor/commons';
import type {PmEditorView} from '@type-editor/editor-types';

import {CHROME_DELETE_TIME_THRESHOLD} from '../constants';


/**
 * Determines the preferred position and side for diff calculation.
 *
 * The diff algorithm needs to know where the user's cursor was to make better
 * decisions about how to align changes. This function determines the preferred
 * position based on recent keypress activity:
 *
 * - **After Backspace:** Prefers anchoring to the end (selection.to) since
 *   backspace deletes backwards from the cursor position
 * - **Otherwise:** Prefers anchoring to the start (selection.from) which is
 *   the default for insertions and other changes
 *
 * The preferred side ('start' or 'end') affects how ambiguous changes are
 * resolved in the diff algorithm.
 *
 * @param view - The editor view containing input state and current selection
 * @returns Object containing:
 *          - preferredPos: The document position to anchor the diff from
 *          - preferredSide: Whether to prefer 'start' or 'end' alignment
 *
 * @see findDiff for how these values are used
 */
export function getPreferredDiffPosition(view: PmEditorView): { preferredPos: number; preferredSide: 'start' | 'end' } {
    const isRecentBackspace = view.input.lastKey === KEY_BACKSPACE
        && Date.now() - CHROME_DELETE_TIME_THRESHOLD < view.input.lastKeyCodeTime;

    if (isRecentBackspace) {
        return {
            preferredPos: view.state.selection.to,
            preferredSide: 'end'
        };
    }

    return {
        preferredPos: view.state.selection.from,
        preferredSide: 'start'
    };
}
