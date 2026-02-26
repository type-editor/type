import type {PmEditorState, PmSelection} from '@type-editor/editor-types';
import type {DispatchFunction} from '@type-editor/editor-types';


/**
 * Conditionally sets a new selection if it differs from the current one.
 *
 * @param state - The current editor state.
 * @param dispatch - Optional dispatch function to apply the transaction.
 * @param selection - The new selection to set.
 * @returns `true` if the selection was changed (or would be changed), `false` otherwise.
 */
export function maybeSetSelection(state: PmEditorState,
                                  dispatch: undefined | DispatchFunction,
                                  selection: PmSelection): boolean {
    if (selection.eq(state.selection)) {
        return false;
    }
    if (dispatch) {
        dispatch(state.transaction.setSelection(selection).scrollIntoView());
    }
    return true;
}
