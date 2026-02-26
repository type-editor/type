import type {Command, DispatchFunction, PmEditorState, PmEditorView} from '@type-editor/editor-types';
import type {PmNode, ResolvedPos} from '@type-editor/model';
import {Selection, SelectionFactory,} from '@type-editor/state';

import {findCutBefore} from './util/helpers';

/**
 * Selects the node before the cursor when at the start of a textblock.
 *
 * This command provides fallback behavior for the Backspace key when structural
 * deletion isn't possible. When the cursor is at the start of a textblock and
 * normal backward joining fails, this command selects the node before the textblock
 * (if it's selectable), allowing the user to delete it with a subsequent keypress.
 *
 * This is particularly useful for:
 * - Selecting and deleting block nodes (images, horizontal rules, etc.)
 * - Handling cases where the schema prevents normal joining
 * - Providing consistent behavior for navigating/selecting backward
 *
 * The command only works when:
 * - The selection is empty (just a cursor)
 * - The cursor is at the start of a textblock (or not in a textblock)
 * - There's a selectable node before the cursor
 *
 * @param state - The current editor state
 * @param dispatch - Optional dispatch function to execute the transaction
 * @param view - Optional editor view for accurate cursor position detection
 * @returns `true` if a node was selected, `false` otherwise
 *
 * @example
 * ```typescript
 * // Use as fallback in Backspace handling
 * const keymap = {
 *   'Backspace': chainCommands(
 *     deleteSelection,
 *     joinBackward,
 *     selectNodeBackward
 *   )
 * };
 * ```
 */
export const selectNodeBackward: Command = (state: PmEditorState,
                                            dispatch?: DispatchFunction,
                                            view?: PmEditorView): boolean => {
    const {$head, empty} = state.selection;

    // Only works with empty selections
    if (!empty) {
        return false;
    }

    // Check if we're at the start of a textblock
    if (!isAtTextblockStart($head, view, state)) {
        return false;
    }

    // Find the cut position and node before
    const $cut: ResolvedPos | null = $head.parent.isTextblock ? findCutBefore($head) : $head;
    const node: PmNode = $cut?.nodeBefore;

    // Check if the node is selectable
    if (!node || !Selection.isNodeSelectable(node)) {
        return false;
    }

    if (dispatch && $cut) {
        const selectionPos: number = $cut.pos - node.nodeSize;
        dispatch(
            state.transaction
                .setSelection(SelectionFactory.createNodeSelection(state.doc, selectionPos))
                .scrollIntoView()
        );
    }

    return true;
};


/**
 * Checks if the cursor is truly at the start of a textblock.
 *
 * @param $head - The head position of the selection
 * @param view - Optional editor view for bidirectional text detection
 * @param state - The current editor state
 * @returns `true` if at the start of the textblock, `false` otherwise
 */
function isAtTextblockStart($head: ResolvedPos,
                            view: PmEditorView | undefined,
                            state: PmEditorState): boolean {
    if (!$head.parent.isTextblock) {
        return true; // Not in a textblock, so textblock start check doesn't apply
    }

    // Use view for accurate bidirectional text detection if available
    if (view) {
        return view.endOfTextblock('backward', state);
    }

    // Fallback to simple position check
    return $head.parentOffset === 0;
}
