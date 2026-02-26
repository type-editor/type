import {isUndefinedOrNull} from '@type-editor/commons';
import {type Command, type DispatchFunction, type PmEditorState} from '@type-editor/editor-types';
import type {NodeRange, ResolvedPos} from '@type-editor/model';
import {canSplit, liftTarget} from '@type-editor/transform';

/**
 * Lifts an empty textblock out of its parent structure.
 *
 * This command handles the special case of empty textblocks, providing intelligent
 * behavior depending on the context:
 *
 * **Split Strategy**: If the empty block is nested and not at the end of its parent,
 * the command splits the parent structure instead of lifting. This is particularly
 * useful for:
 * - Breaking out of nested list items
 * - Creating a new block after a nested structure
 *
 * **Lift Strategy**: Otherwise, the command lifts the empty block out of its parent,
 * effectively removing one level of nesting.
 *
 * This command is commonly used to handle the Enter key in empty blocks, allowing
 * users to naturally escape from nested structures.
 *
 * The command only works when:
 * - The selection is a cursor (not a range)
 * - The cursor is in an empty textblock
 * - Either splitting or lifting is structurally valid
 *
 * @param state - The current editor state
 * @param dispatch - Optional dispatch function to execute the transaction
 * @returns `true` if the operation was performed, `false` otherwise
 *
 * @example
 * ```typescript
 * // Use in Enter key handling for empty blocks
 * const keymap = {
 *   'Enter': chainCommands(
 *     liftEmptyBlock,
 *     splitBlock
 *   )
 * };
 *
 * // Use for Backspace to lift empty blocks
 * const keymap = {
 *   'Backspace': chainCommands(
 *     deleteSelection,
 *     liftEmptyBlock,
 *     joinBackward
 *   )
 * };
 * ```
 */
export const liftEmptyBlock: Command = (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
    const {$cursor} = state.selection;

    // Only works with cursor selections in empty blocks
    if (!$cursor || $cursor.parent.content.size > 0) {
        return false;
    }

    // Strategy 1: Try to split if we're nested and not at the end
    if (canSplitEmptyBlock($cursor)) {
        const splitPosition: number = $cursor.before();
        if (canSplit(state.doc, splitPosition)) {
            if (dispatch) {
                dispatch(state.transaction.split(splitPosition).scrollIntoView());
            }
            return true;
        }
    }

    // Strategy 2: Try to lift the empty block
    const range: NodeRange = $cursor.blockRange();
    const liftTargetDepth: number = range && liftTarget(range);

    if (isUndefinedOrNull(liftTargetDepth)) {
        return false;
    }

    if (dispatch) {
        dispatch(state.transaction.lift(range, liftTargetDepth).scrollIntoView());
    }

    return true;
};

/**
 * Checks if the cursor is in an empty block that can be split.
 *
 * @param $cursor - The cursor position
 * @returns `true` if the block can be split, `false` otherwise
 */
function canSplitEmptyBlock($cursor: ResolvedPos): boolean {
    // Can split if we're nested (depth > 1) and not at the end of parent
    return $cursor.depth > 1 && $cursor.after() !== $cursor.end(-1);
}

