import type {Command, DispatchFunction, PmEditorState, PmEditorView} from '@type-editor/editor-types';
import type {PmNode, ResolvedPos} from '@type-editor/model';
import {Selection, SelectionFactory} from '@type-editor/state';

import {findCutAfter} from './util/helpers';

/**
 * Selects the node after the cursor when at the end of a textblock.
 *
 * This command provides fallback behavior for the Delete/Forward-Delete key when
 * structural deletion isn't possible. When the cursor is at the end of a textblock
 * and normal forward joining fails, this command selects the node after the textblock
 * (if it's selectable), allowing the user to delete it with a subsequent keypress.
 *
 * This is particularly useful for:
 * - Selecting and deleting block nodes (images, horizontal rules, etc.)
 * - Handling cases where the schema prevents normal joining
 * - Providing consistent behavior for navigating/selecting forward
 *
 * The command only works when:
 * - The selection is empty (just a cursor)
 * - The cursor is at the end of a textblock (or not in a textblock)
 * - There's a selectable node after the cursor
 *
 * @param state - The current editor state
 * @param dispatch - Optional dispatch function to execute the transaction
 * @param view - Optional editor view for accurate cursor position detection
 * @returns `true` if a node was selected, `false` otherwise
 *
 * @example
 * ```typescript
 * // Use as fallback in Delete key handling
 * const keymap = {
 *   'Delete': chainCommands(
 *     deleteSelection,
 *     joinForward,
 *     selectNodeForward
 *   )
 * };
 * ```
 */
export const selectNodeForward: Command = (state: PmEditorState,
                                           dispatch?: DispatchFunction,
                                           view?: PmEditorView): boolean => {
    const {$head, empty} = state.selection;

    // Only works with empty selections
    if (!empty) {
        return false;
    }

    // Check if we're at the end of a textblock
    if (!isAtTextblockEnd($head, view, state)) {
        return false;
    }

    // Find the cut position and node after
    const $cut: ResolvedPos | null = $head.parent.isTextblock ? findCutAfter($head) : $head;
    const node: PmNode = $cut?.nodeAfter;

    // Check if the node is selectable
    if (!node || !Selection.isNodeSelectable(node)) {
        return false;
    }

    if (dispatch && $cut) {
        dispatch(
            state.transaction
                .setSelection(SelectionFactory.createNodeSelection(state.doc, $cut.pos))
                .scrollIntoView()
        );
    }

    return true;
};


/**
 * Checks if the cursor is truly at the end of a textblock.
 *
 * @param $head - The head position of the selection
 * @param view - Optional editor view for bidirectional text detection
 * @param state - The current editor state
 * @returns `true` if at the end of the textblock, `false` otherwise
 */
function isAtTextblockEnd($head: ResolvedPos,
                          view: PmEditorView | undefined,
                          state: PmEditorState): boolean {
    if (!$head.parent.isTextblock) {
        return true; // Not in a textblock, so textblock end check doesn't apply
    }

    // Use view for accurate bidirectional text detection if available
    if (view) {
        return view.endOfTextblock('forward', state);
    }

    // Fallback to simple position check
    return $head.parentOffset >= $head.parent.content.size;
}
