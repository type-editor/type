import { isUndefinedOrNull } from '@type-editor/commons';
import type { Command, DispatchFunction, PmEditorState, PmEditorView, PmTransaction } from '@type-editor/editor-types';
import { type NodeRange, type PmNode, type ResolvedPos, Slice } from '@type-editor/model';
import { Selection, SelectionFactory } from '@type-editor/state';
import { liftTarget, ReplaceStep, replaceStep, type Step } from '@type-editor/transform';

import { atBlockStart, deleteBarrier, findCutBefore, textblockAt } from './util/helpers';

/**
 * Joins or merges the current block with the one before it when the cursor is at the start
 * of a textblock.
 *
 * This command implements comprehensive backward-joining behavior with multiple fallback strategies:
 *
 * 1. **Direct Join**: If there's a compatible block directly before, join them
 * 2. **Delete Barrier**: Try to remove structural barriers between blocks
 * 3. **Delete Empty Block**: If the current block is empty, delete it and select the content before
 * 4. **Delete Atomic Node**: If the node before is atomic, delete it
 * 5. **Lift Block**: If no other strategy works, try to lift the block out of its parent
 *
 * The command uses the view (if provided) for accurate bidirectional text detection
 * to determine if the cursor is truly at the start of the block.
 *
 * @param state - The current editor state
 * @param dispatch - Optional dispatch function to execute the transaction
 * @param view - Optional editor view for accurate cursor position detection
 * @returns `true` if any operation was performed, `false` otherwise
 *
 * @example
 * ```typescript
 * // Use as part of backspace behavior
 * const keymap = {
 *   'Backspace': chainCommands(deleteSelection, joinBackward, selectNodeBackward)
 * };
 * ```
 */
export const joinBackward: Command = (state: PmEditorState,
                                      dispatch?: DispatchFunction,
                                      view?: PmEditorView): boolean => {
    // Check if we're at the start of a block
    const $cursor: ResolvedPos = atBlockStart(state, view);
    if (!$cursor) {
        return false;
    }

    const $cut: ResolvedPos = findCutBefore($cursor);

    // Strategy 1: If there is no node before, try to lift the current block
    if (!$cut) {
        return tryLiftBlock(state, $cursor, dispatch);
    }

    const before: PmNode = $cut.nodeBefore;
    if (!before) {
        return false;
    }

    // Strategy 2: Try the standard joining algorithm (handles complex structures)
    if (deleteBarrier(state, $cut, dispatch, -1)) {
        return true;
    }

    // Strategy 3: Delete empty block and position cursor appropriately
    if (deleteEmptyBlock(state, $cursor, $cut, before, dispatch)) {
        return true;
    }

    // Strategy 4: Delete atomic nodes
    return deleteAtomicNode(state, $cursor, $cut, before, dispatch);

};


/**
 * Attempts to lift the current block if there's no joinable block before it.
 *
 * @param state - The current editor state
 * @param $cursor - The cursor position at the start of a block
 * @param dispatch - Optional dispatch function
 * @returns `true` if the block was lifted, `false` otherwise
 */
function tryLiftBlock(state: PmEditorState,
                      $cursor: ResolvedPos,
                      dispatch?: DispatchFunction): boolean {
    const range: NodeRange = $cursor.blockRange();
    const target: number = range && liftTarget(range);

    if (isUndefinedOrNull(target)) {
        return false;
    }

    if (dispatch) {
        dispatch(state.transaction.lift(range, target).scrollIntoView());
    }

    return true;
}

/**
 * Attempts to delete an empty block and select the appropriate content before it.
 *
 * @param state - The current editor state
 * @param $cursor - The cursor position in the empty block
 * @param $cut - The cut position before the block
 * @param before - The node before the cut position
 * @param dispatch - Optional dispatch function
 * @returns `true` if successful, `false` otherwise
 */
function deleteEmptyBlock(state: PmEditorState,
                          $cursor: ResolvedPos,
                          $cut: ResolvedPos,
                          before: PmNode,
                          dispatch?: DispatchFunction): boolean {
    // Only applies if current block is empty and the block before is selectable or ends with text
    if ($cursor.parent.content.size !== 0) {
        return false;
    }

    if (!textblockAt(before, 'end') && !Selection.isNodeSelectable(before)) {
        return false;
    }

    // Try to delete at increasing depths until we find a valid deletion
    for (let depth = $cursor.depth; ; depth--) {
        const deleteFrom: number = $cursor.before(depth);
        const deleteTo: number = $cursor.after(depth);
        const delStep: Step = replaceStep(state.doc, deleteFrom, deleteTo, Slice.empty);

        // Check if this is a valid deletion (removes content)
        if (delStep && (delStep as ReplaceStep).slice.size < (delStep as ReplaceStep).to - (delStep as ReplaceStep).from) {
            if (dispatch) {
                const transaction: PmTransaction = state.transaction.step(delStep);

                // Position cursor appropriately after deletion
                if (textblockAt(before, 'end')) {
                    // Move cursor to the end of the text block before
                    const mappedPos: number = transaction.mapping.map($cut.pos, -1);
                    transaction.setSelection(Selection.findFrom(transaction.doc.resolve(mappedPos), -1));
                } else {
                    // Select the node before
                    transaction.setSelection(
                        SelectionFactory.createNodeSelection(transaction.doc, $cut.pos - before.nodeSize)
                    );
                }

                dispatch(transaction.scrollIntoView());
            }
            return true;
        }

        // Stop if we've reached the top or parent has multiple children
        if (depth === 1 || $cursor.node(depth - 1).childCount > 1) {
            break;
        }
    }

    return false;
}

/**
 * Attempts to delete an atomic node before the cursor.
 *
 * @param state - The current editor state
 * @param $cursor - The cursor position
 * @param $cut - The cut position before the cursor
 * @param before - The node before the cut position
 * @param dispatch - Optional dispatch function
 * @returns `true` if the atom was deleted, `false` otherwise
 */
function deleteAtomicNode(state: PmEditorState,
                          $cursor: ResolvedPos,
                          $cut: ResolvedPos,
                          before: PmNode,
                          dispatch?: DispatchFunction): boolean {
    // Only delete atomic nodes at the appropriate depth
    if (!before.isAtom || $cut.depth !== $cursor.depth - 1) {
        return false;
    }

    if (dispatch) {
        const deleteFrom: number = $cut.pos - before.nodeSize;
        const deleteTo: number = $cut.pos;
        dispatch(state.transaction.delete(deleteFrom, deleteTo).scrollIntoView());
    }

    return true;
}
