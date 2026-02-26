import type { Command, DispatchFunction, PmEditorState, PmEditorView, PmTransaction } from '@type-editor/editor-types';
import { type PmNode, type ResolvedPos, Slice } from '@type-editor/model';
import { SelectionFactory } from '@type-editor/state';
import { ReplaceStep, replaceStep } from '@type-editor/transform';

import { atBlockEnd, findCutAfter } from './util/helpers';


/**
 * Joins the current textblock with the textblock after it.
 *
 * This is a more focused version of `joinForward` that specifically handles joining
 * textblocks. It only works when the cursor is at the end of a textblock and attempts
 * to join it with the textblock after it, even if they're nested in different structures.
 *
 * The command navigates down through nested structures to find the actual textblocks
 * to join, making it work correctly with complex document structures like nested lists
 * or blockquotes.
 *
 * This command will fail if:
 * - The cursor is not at the end of a textblock
 * - There's no textblock after the current one
 * - The blocks are separated by isolating nodes
 * - The join operation is not structurally valid
 *
 * @param state - The current editor state
 * @param dispatch - Optional dispatch function to execute the transaction
 * @param view - Optional editor view for accurate cursor position detection
 * @returns `true` if the join was performed, `false` otherwise
 *
 * @example
 * ```typescript
 * // Use as an alternative to joinForward for stricter textblock joining
 * const keymap = {
 *   'Shift-Delete': joinTextblockForward
 * };
 * ```
 */
export const joinTextblockForward: Command = (state: PmEditorState,
                                              dispatch?: DispatchFunction,
                                              view?: PmEditorView): boolean => {
    const $cursor: ResolvedPos = atBlockEnd(state, view);
    if (!$cursor) {
        return false;
    }

    const $cut: ResolvedPos = findCutAfter($cursor);
    return $cut ? joinTextblocksAround(state, $cut, dispatch) : false;
};


/**
 * Finds the innermost textblock before a cut position by traversing down to the last child.
 *
 * @param node - The starting node
 * @param startPos - The starting position
 * @returns Object with the textblock node and its position, or null if not found or isolated
 */
function findTextblockBefore(node: PmNode, startPos: number): { node: PmNode; pos: number } | null {
    let currentNode: PmNode = node;
    let currentPos: number = startPos;

    while (!currentNode.isTextblock) {
        if (currentNode.type.spec.isolating) {
            return null;
        }

        const child: PmNode = currentNode.lastChild;
        if (!child) {
            return null;
        }

        currentNode = child;
        currentPos--;
    }

    return { node: currentNode, pos: currentPos };
}

/**
 * Finds the innermost textblock after a cut position by traversing down to the first child.
 *
 * @param node - The starting node
 * @param startPos - The starting position
 * @returns Object with the textblock node and its position, or null if not found or isolated
 */
function findTextblockAfter(node: PmNode, startPos: number): { node: PmNode; pos: number } | null {
    let currentNode: PmNode = node;
    let currentPos: number = startPos;

    while (!currentNode.isTextblock) {
        if (currentNode.type.spec.isolating) {
            return null;
        }

        const child: PmNode = currentNode.firstChild;
        if (!child) {
            return null;
        }

        currentNode = child;
        currentPos++;
    }

    return { node: currentNode, pos: currentPos };
}

/**
 * Attempts to join two textblocks around a cut position.
 *
 * This function navigates down the node hierarchy to find the innermost textblocks
 * on either side of the cut position and attempts to join them. It handles nested
 * structures by traversing to the deepest textblock level.
 *
 * @param state - The current editor state
 * @param $cut - The resolved position where the join should occur
 * @param dispatch - Optional dispatch function to execute the transaction
 * @returns `true` if the join was successful, `false` otherwise
 */
function joinTextblocksAround(state: PmEditorState,
                              $cut: ResolvedPos,
                              dispatch?: DispatchFunction): boolean {
    const beforeNode = $cut.nodeBefore;
    if (!beforeNode) {
        return false;
    }

    // Find the textblock before the cut position
    const beforeInfo: { node: PmNode; pos: number } = findTextblockBefore(beforeNode, $cut.pos - 1);
    if (!beforeInfo) {
        return false;
    }

    const afterNode: PmNode = $cut.nodeAfter;
    if (!afterNode) {
        return false;
    }

    // Find the textblock after the cut position
    const afterInfo: { node: PmNode; pos: number } = findTextblockAfter(afterNode, $cut.pos + 1);
    if (!afterInfo) {
        return false;
    }

    // Attempt to create a replace step that joins the blocks
    const { pos: beforePos } = beforeInfo;
    const { pos: afterPos } = afterInfo;
    const step = replaceStep(state.doc, beforePos, afterPos, Slice.empty) as ReplaceStep | null;

    // Validate the step
    if (step?.from !== beforePos) {
        return false;
    }

    // Ensure the step actually removes content
    if (step instanceof ReplaceStep && step.slice.size >= afterPos - beforePos) {
        return false;
    }

    if (dispatch) {
        const transaction: PmTransaction = state.transaction.step(step);
        transaction.setSelection(SelectionFactory.createTextSelection(transaction.doc, beforePos));
        dispatch(transaction.scrollIntoView());
    }

    return true;
}
