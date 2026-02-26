import {type Command, type DispatchFunction, type PmEditorState} from '@type-editor/editor-types';
import { SelectionFactory } from '@type-editor/state';

/**
 * Selects the entire document.
 *
 * This command creates an AllSelection that encompasses the entire document content.
 * It's typically bound to Ctrl-A/Cmd-A to provide standard "Select All" functionality.
 *
 * Unlike some commands, this one always returns `true` because it can always be
 * executed (there's always a document to select).
 *
 * @param state - The current editor state
 * @param dispatch - Optional dispatch function to execute the transaction
 * @returns Always returns `true`
 *
 * @example
 * ```typescript
 * // Bind to the standard Select All shortcut
 * const keymap = {
 *   'Mod-a': selectAll
 * };
 *
 * // Use programmatically
 * selectAll(view.state, view.dispatch);
 * ```
 */
export const selectAll: Command = (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
    if (dispatch) {
        dispatch(state.transaction.setSelection(SelectionFactory.createAllSelection(state.doc)));
    }
    return true;
};

