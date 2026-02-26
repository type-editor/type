import {isUndefinedOrNull} from '@type-editor/commons';
import type {Command, DispatchFunction, PmEditorState, PmSelection} from '@type-editor/editor-types';
import {canJoin, joinPoint} from '@type-editor/transform';


/**
 * Joins the selected block with the block below it.
 *
 * This command attempts to join the selected block (or the closest ancestor block)
 * with its next sibling. The behavior differs based on the selection type:
 *
 * - **Node Selection**: Joins at the end of the selected node if possible
 * - **Text Selection**: Finds the nearest joinable point after the selection
 *
 * The command will fail if:
 * - A textblock node is selected (textblocks can't be joined this way)
 * - No valid join point exists after the selection
 * - The structure doesn't allow joining
 *
 * @param state - The current editor state
 * @param dispatch - Optional dispatch function to execute the transaction
 * @returns `true` if the join was performed, `false` otherwise
 *
 * @example
 * ```typescript
 * // Bind to a key for joining blocks downward
 * const keymap = {
 *   'Alt-ArrowDown': joinDown
 * };
 *
 * // Use in a menu item
 * const menuItem = {
 *   label: 'Join with block below',
 *   run: joinDown
 * };
 * ```
 */
export const joinDown: Command = (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
    const selection: PmSelection = state.selection;
    const joinPosition: number = findJoinDownPosition(state, selection);

    if (isUndefinedOrNull(joinPosition)) {
        return false;
    }

    if (dispatch) {
        dispatch(state.transaction.join(joinPosition).scrollIntoView());
    }

    return true;
};


/**
 * Determines the position where a downward join should occur based on the selection.
 *
 * @param state - The current editor state
 * @param selection - The current selection
 * @returns The position where the join should occur, or null if not possible
 */
function findJoinDownPosition(state: PmEditorState, selection: PmSelection): number | null {
    if (selection.isNodeSelection()) {
        // For node selections, can't join textblocks, and must be able to join at the end
        if (selection.node.isTextblock || !canJoin(state.doc, selection.to)) {
            return null;
        }
        return selection.to;
    }

    // For text selections, find the nearest joinable point forward
    const point: number = joinPoint(state.doc, selection.to, 1);
    return isUndefinedOrNull(point) ? null : point;
}
