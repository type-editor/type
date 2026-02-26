import type {Command, DispatchFunction, PmEditorState} from '@type-editor/editor-types';

/**
 * Deletes the current selection if one exists.
 *
 * This command removes all content within the current selection range. If the selection
 * is empty (just a cursor position), the command returns `false` and does nothing.
 * After deletion, the view is scrolled to keep the cursor visible.
 *
 * This is typically used as the first command in a chain for delete operations, allowing
 * more specific deletion behaviors to take over when there's no selection.
 *
 * @param state - The current editor state
 * @param dispatch - Optional dispatch function to execute the transaction
 * @returns `true` if there was a selection to delete, `false` if the selection was empty
 *
 * @example
 * ```typescript
 * // Use as part of a delete key handler
 * const keymap = {
 *   'Backspace': chainCommands(deleteSelection, joinBackward),
 *   'Delete': chainCommands(deleteSelection, joinForward)
 * };
 * ```
 */
export const deleteSelection: Command = (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
    if (state.selection.empty) {
        return false;
    }

    if (dispatch) {
        dispatch(state.transaction.deleteSelection().scrollIntoView());
    }

    return true;
};

