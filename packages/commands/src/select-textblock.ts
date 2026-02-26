import { isUndefinedOrNull } from '@type-editor/commons';
import type { Command, DispatchFunction, PmEditorState, PmSelection } from '@type-editor/editor-types';
import type { ResolvedPos } from '@type-editor/model';
import { SelectionFactory, type TextSelection } from '@type-editor/state';


/**
 * Moves the cursor to the start of the current textblock.
 *
 * This command finds the containing textblock (navigating up from inline nodes if necessary)
 * and positions the cursor at its start. This is useful for:
 *
 * - Implementing "Home" key behavior at the block level
 * - Quickly navigating to the beginning of paragraphs or headings
 * - Providing text selection starting points
 *
 * The command will fail if the cursor is not within a textblock.
 *
 * @example
 * ```typescript
 * // Bind to Home key for block-level navigation
 * const keymap = {
 *   'Home': selectTextblockStart,
 *   'Mod-Home': selectTextblockStart
 * };
 *
 * // Use with Shift for selection
 * const keymap = {
 *   'Shift-Home': (state, dispatch) => {
 *     const anchor = state.selection.anchor;
 *     if (selectTextblockStart(state, (tr) => {
 *       tr.setSelection(TextSelection.create(tr.doc, anchor, tr.selection.head));
 *       if (dispatch) dispatch(tr);
 *     })) return true;
 *     return false;
 *   }
 * };
 * ```
 */
export const selectTextblockStart: Command = selectTextblockSide(-1);


/**
 * Moves the cursor to the end of the current textblock.
 *
 * This command finds the containing textblock (navigating up from inline nodes if necessary)
 * and positions the cursor at its end. This is useful for:
 *
 * - Implementing "End" key behavior at the block level
 * - Quickly navigating to the end of paragraphs or headings
 * - Providing text selection ending points
 *
 * The command will fail if the cursor is not within a textblock.
 *
 * @example
 * ```typescript
 * // Bind to End key for block-level navigation
 * const keymap = {
 *   'End': selectTextblockEnd,
 *   'Mod-End': selectTextblockEnd
 * };
 *
 * // Create menu items for navigation
 * const menuItem = {
 *   label: 'Jump to end of block',
 *   run: selectTextblockEnd
 * };
 * ```
 */
export const selectTextblockEnd: Command = selectTextblockSide(1);


/**
 * Finds the containing textblock at the given position.
 *
 * @param $pos - The resolved position to start from
 * @returns The depth of the textblock, or null if none found
 */
function findTextblockDepth($pos: ResolvedPos): number | null {
    let depth: number = $pos.depth;

    // Traverse up until we find a non-inline node
    while ($pos.node(depth).isInline) {
        if (depth === 0) {
            return null;
        }
        depth--;
    }

    // Check if the found node is a textblock
    if (!$pos.node(depth).isTextblock) {
        return null;
    }

    return depth;
}

/**
 * Creates a command that moves the cursor to the start or end of the current textblock.
 *
 * @param side - Direction to move: negative for start, positive for end
 * @returns A command that performs the cursor movement
 */
function selectTextblockSide(side: number): Command {
    return (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
        const selection: PmSelection = state.selection;
        const $pos: ResolvedPos = side < 0 ? selection.$from : selection.$to;

        // Find the containing textblock
        const textblockDepth: number = findTextblockDepth($pos);
        if (isUndefinedOrNull(textblockDepth)) {
            return false;
        }

        if (dispatch) {
            const targetPosition: number = side < 0 ? $pos.start(textblockDepth) : $pos.end(textblockDepth);
            const textSelection: TextSelection = SelectionFactory.createTextSelection(state.doc, targetPosition);
            dispatch(state.transaction.setSelection(textSelection));
        }

        return true;
    };
}

