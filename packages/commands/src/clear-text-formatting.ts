import type { DispatchFunction, PmEditorState, PmTransaction } from '@type-editor/editor-types';


/**
 * Removes common text formatting marks from the current selection.
 *
 * This command removes the following mark types if they exist in the schema:
 * - `strong` (bold)
 * - `em` (italic)
 * - `underline`
 * - `link`
 *
 * @param state - The current editor state.
 * @param dispatch - The dispatch function to apply the transaction. If provided and
 *                   marks were removed, the transaction will be dispatched.
 * @returns `true` if any marks were found in the schema and potentially removed,
 *          `false` otherwise.
 */
export function clearTextFormatting(state: PmEditorState, dispatch: DispatchFunction): boolean {
    const markTypesToRemove = ['strong', 'em', 'underline', 'link'];

    let count = 0;
    const transaction: PmTransaction = state.transaction;
    const { from, to } = transaction.selection;

    markTypesToRemove.forEach((markName: string): void => {
        if (state.schema.marks[markName]) {
            transaction.removeMark(from, to, state.schema.marks[markName]);
            count++;
        }
    });

    if (count && dispatch) {
        dispatch(transaction);
    }

    return count > 0;
}
