import type { Command, DispatchFunction, PmEditorState, PmEditorView, PmTransaction } from '@type-editor/editor-types';
import { type PmNode, type ResolvedPos, Slice } from '@type-editor/model';
import { Selection, SelectionFactory } from '@type-editor/state';
import { ReplaceStep, replaceStep } from '@type-editor/transform';

import { atBlockEnd, deleteBarrier, findCutAfter, textblockAt } from './util/helpers';


/**
 * Joins or merges the current block with the one after it when the cursor is at the end
 * of a textblock.
 *
 * This command implements comprehensive forward-joining behavior with multiple fallback strategies:
 *
 * 1. **Delete Barrier**: Try to remove structural barriers between blocks and join them
 * 2. **Delete Empty Block**: If the current block is empty, delete it and select the content after
 * 3. **Delete Atomic Node**: If the node after is atomic, delete it
 *
 * The command uses the view (if provided) for accurate bidirectional text detection
 * to determine if the cursor is truly at the end of the block.
 *
 * This is the forward counterpart to `joinBackward` and is typically used as part of
 * the delete/forward-delete key behavior.
 *
 * @param state - The current editor state
 * @param dispatch - Optional dispatch function to execute the transaction
 * @param view - Optional editor view for accurate cursor position detection
 * @returns `true` if any operation was performed, `false` otherwise
 *
 * @example
 * ```typescript
 * // Use as part of delete key behavior
 * const keymap = {
 *   'Delete': chainCommands(deleteSelection, joinForward, selectNodeForward)
 * };
 * ```
 */
export const joinForward: Command = (state: PmEditorState,
                                     dispatch?: DispatchFunction,
                                     view?: PmEditorView): boolean => {
    // Check if we're at the end of a block
    const $cursor: ResolvedPos = atBlockEnd(state, view);
    if (!$cursor) {
        return false;
    }

    const $cut: ResolvedPos = findCutAfter($cursor);

    // If there is no node after this, there's nothing to do
    if (!$cut) {
        return false;
    }

    const after: PmNode = $cut.nodeAfter;
    if (!after) {
        return false;
    }

    // Strategy 1: Try the standard joining algorithm (handles complex structures)
    if (deleteBarrier(state, $cut, dispatch, 1)) {
        return true;
    }

    // Strategy 2: Delete empty block and position cursor appropriately
    if (deleteEmptyBlockForward(state, $cursor, $cut, after, dispatch)) {
        return true;
    }

    // Strategy 3: Delete atomic nodes
    if (deleteAtomicNodeForward(state, $cursor, $cut, after, dispatch)) {
        return true;
    }

    return false;
};


/**
 * Attempts to delete an empty block and select the appropriate content after it.
 *
 * @param state - The current editor state
 * @param $cursor - The cursor position in the empty block
 * @param $cut - The cut position after the block
 * @param after - The node after the cut position
 * @param dispatch - Optional dispatch function
 * @returns `true` if successful, `false` otherwise
 */
function deleteEmptyBlockForward(state: PmEditorState,
                                 $cursor: ResolvedPos,
                                 $cut: ResolvedPos,
                                 after: PmNode,
                                 dispatch?: DispatchFunction): boolean {
    // Only applies if current block is empty and the block after is selectable or starts with text
    if ($cursor.parent.content.size !== 0) {
        return false;
    }

    if (!textblockAt(after, 'start') && !Selection.isNodeSelectable(after)) {
        return false;
    }

    const delStep = replaceStep(
        state.doc,
        $cursor.before(),
        $cursor.after(),
        Slice.empty
    ) as ReplaceStep;

    // Check if this is a valid deletion (removes content)
    if (!delStep || delStep.slice.size >= delStep.to - delStep.from) {
        return false;
    }

    if (dispatch) {
        const transaction: PmTransaction = state.transaction.step(delStep);

        // Position cursor appropriately after deletion
        const mappedPos: number = transaction.mapping.map($cut.pos);
        if (textblockAt(after, 'start')) {
            // Move cursor to the start of the text block after
            transaction.setSelection(Selection.findFrom(transaction.doc.resolve(mappedPos), 1));
        } else {
            // Select the node after
            transaction.setSelection(SelectionFactory.createNodeSelection(transaction.doc, mappedPos));
        }

        dispatch(transaction.scrollIntoView());
    }

    return true;
}

/**
 * Attempts to delete an atomic node after the cursor.
 *
 * @param state - The current editor state
 * @param $cursor - The cursor position
 * @param $cut - The cut position after the cursor
 * @param after - The node after the cut position
 * @param dispatch - Optional dispatch function
 * @returns `true` if the atom was deleted, `false` otherwise
 */
function deleteAtomicNodeForward(state: PmEditorState,
                                 $cursor: ResolvedPos,
                                 $cut: ResolvedPos,
                                 after: PmNode,
                                 dispatch?: DispatchFunction): boolean {
    // Only delete atomic nodes at the appropriate depth
    if (!after.isAtom || $cut.depth !== $cursor.depth - 1) {
        return false;
    }

    if (dispatch) {
        const deleteFrom: number = $cut.pos;
        const deleteTo: number = $cut.pos + after.nodeSize;
        dispatch(state.transaction.delete(deleteFrom, deleteTo).scrollIntoView());
    }

    return true;
}
