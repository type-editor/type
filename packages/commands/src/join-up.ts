import { isUndefinedOrNull } from '@type-editor/commons';
import type { Command, DispatchFunction, PmEditorState, PmSelection, PmTransaction } from '@type-editor/editor-types';
import { type PmNode } from '@type-editor/model';
import { SelectionFactory } from '@type-editor/state';
import { canJoin, joinPoint } from '@type-editor/transform';


/**
 * Joins the selected block with the block above it.
 *
 * This command attempts to join the selected block (or the closest ancestor block)
 * with its previous sibling. The behavior differs based on the selection type:
 *
 * - **Node Selection**: Joins at the start of the selected node and maintains node selection
 * - **Text Selection**: Finds the nearest joinable point before the selection
 *
 * When a node selection is used and the join succeeds, the command will automatically
 * select the joined node to maintain the user's selection context.
 *
 * The command will fail if:
 * - A textblock node is selected (textblocks can't be joined this way)
 * - No valid join point exists before the selection
 * - The structure doesn't allow joining
 *
 * @param state - The current editor state
 * @param dispatch - Optional dispatch function to execute the transaction
 * @returns `true` if the join was performed, `false` otherwise
 *
 * @example
 * ```typescript
 * // Bind to a key for joining blocks upward
 * const keymap = {
 *   'Alt-ArrowUp': joinUp
 * };
 *
 * // Use in a menu item
 * const menuItem = {
 *   label: 'Join with block above',
 *   run: joinUp,
 *   enable: (state) => joinUp(state)
 * };
 * ```
 */
export const joinUp: Command = (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
    const selection: PmSelection = state.selection;
    const joinInfo = findJoinUpPosition(state, selection);

    if (!joinInfo) {
        return false;
    }

    if (dispatch) {
        const { point, isNodeSelection } = joinInfo;
        const transaction: PmTransaction = state.transaction.join(point);

        // If we had a node selection, maintain it after the join
        if (isNodeSelection) {
            const nodeBefore: PmNode = state.doc.resolve(point).nodeBefore;
            if (nodeBefore) {
                const newPosition: number = point - nodeBefore.nodeSize;
                transaction.setSelection(SelectionFactory.createNodeSelection(transaction.doc, newPosition));
            }
        }

        dispatch(transaction.scrollIntoView());
    }

    return true;
};


/**
 * Determines the position where an upward join should occur based on the selection.
 *
 * @param state - The current editor state
 * @param selection - The current selection
 * @returns Object containing the join position and whether it's a node selection, or null if not possible
 */
function findJoinUpPosition(state: PmEditorState,
                            selection: PmSelection): { point: number; isNodeSelection: boolean } | null {
    const isNodeSelection: boolean = selection.isNodeSelection();

    if (isNodeSelection) {
        // For node selections, can't join textblocks, and must be able to join at the start
        if (selection.node.isTextblock || !canJoin(state.doc, selection.from)) {
            return null;
        }
        return { point: selection.from, isNodeSelection: true };
    }

    // For text selections, find the nearest joinable point backward
    const point: number = joinPoint(state.doc, selection.from, -1);
    if (isUndefinedOrNull(point)) {
        return null;
    }

    return { point, isNodeSelection: false };
}
