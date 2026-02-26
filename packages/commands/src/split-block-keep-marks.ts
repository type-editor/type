import type {Command, DispatchFunction, PmEditorState, PmTransaction} from '@type-editor/editor-types';
import type {Mark} from '@type-editor/model';

import {splitBlock} from './split-block';

/**
 * Splits a block while preserving active marks.
 *
 * This command works exactly like `splitBlock`, but it preserves the active marks
 * at the cursor position when creating the new block. This is essential for maintaining
 * formatting context when splitting blocks during typing.
 *
 * **Mark Preservation Logic**:
 * - Uses stored marks if they exist (e.g., after toggling a mark without typing)
 * - Otherwise, uses the marks at the cursor position (if not at the start of the parent)
 * - Ensures these marks are applied to the new block
 *
 * This behavior is typically desired for Enter key handling in rich text editors,
 * where users expect formatting to continue into the next paragraph.
 *
 * @param state - The current editor state
 * @param dispatch - Optional dispatch function to execute the transaction
 * @returns `true` if the split was performed, `false` otherwise
 *
 * @example
 * ```typescript
 * // Use for Enter key to maintain formatting
 * const keymap = {
 *   'Enter': chainCommands(
 *     newlineInCode,
 *     exitCode,
 *     liftEmptyBlock,
 *     splitBlockKeepMarks
 *   )
 * };
 *
 * // Compare behaviors:
 * // splitBlock: **bold text**|  → Press Enter → **bold text**\n|
 * // splitBlockKeepMarks: **bold text**|  → Press Enter → **bold text**\n**|**
 * ```
 */
export const splitBlockKeepMarks: Command = (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
    return splitBlock(state, dispatch && ((transaction: PmTransaction): void => {
        // Determine which marks to preserve
        const marks: ReadonlyArray<Mark> =
            state.storedMarks ||
            (state.selection.$to.parentOffset && state.selection.$from.marks());

        // Apply the marks to the new block if any exist
        if (marks) {
            transaction.ensureMarks(marks);
        }

        dispatch(transaction);
    }));
};

