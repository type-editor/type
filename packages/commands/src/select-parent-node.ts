import type { Command, DispatchFunction, PmEditorState } from '@type-editor/editor-types';
import {SelectionFactory} from '@type-editor/state';

/**
 * Selects the parent node that wraps the current selection.
 *
 * This command expands the selection to encompass the parent node containing
 * the current selection. It's useful for:
 *
 * - Progressively expanding selection to outer nodes
 * - Selecting block nodes for operations like deletion or replacement
 * - Navigating up the document structure
 * - Providing "expand selection" functionality
 *
 * The command finds the deepest node that fully contains the current selection
 * and creates a node selection for it. It will not select the document root node,
 * as that would be the entire document (use `selectAll` for that instead).
 *
 * The command will fail if:
 * - The selection is already at the document level (depth 0)
 * - There's no valid parent node to select
 *
 * @param state - The current editor state
 * @param dispatch - Optional dispatch function to execute the transaction
 * @returns `true` if a parent node was selected, `false` otherwise
 *
 * @example
 * ```typescript
 * // Bind to Escape key for expanding selection
 * const keymap = {
 *   'Escape': selectParentNode
 * };
 *
 * // Use to create "expand selection" functionality
 * const menuItem = {
 *   label: 'Select parent',
 *   run: selectParentNode,
 *   enable: (state) => selectParentNode(state)
 * };
 *
 * // Repeatedly call to expand selection outward
 * let state = view.state;
 * while (selectParentNode(state)) {
 *   state = state.apply(state.transaction);
 * }
 * ```
 */
export const selectParentNode: Command = (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
    const {$from, to} = state.selection;
    const sharedDepth: number = $from.sharedDepth(to);

    // Can't select parent if we're at the document level
    if (sharedDepth === 0) {
        return false;
    }

    const parentPosition: number = $from.before(sharedDepth);

    if (dispatch) {
        dispatch(state.transaction.setSelection(SelectionFactory.createNodeSelection(state.doc, parentPosition)));
    }

    return true;
};

