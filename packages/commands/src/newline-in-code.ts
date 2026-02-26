import {type Command, type DispatchFunction, type PmEditorState} from '@type-editor/editor-types';

/**
 * Inserts a newline character when inside a code block.
 *
 * This command allows inserting literal newline characters ("\n") within code blocks,
 * as opposed to the default Enter key behavior which typically creates new block nodes.
 * This is essential for maintaining proper code formatting where newlines are part of
 * the content rather than structural elements.
 *
 * The command only works when:
 * - The selection is within a node marked as code (via `NodeSpec.code`)
 * - The selection head and anchor are in the same parent (not spanning blocks)
 *
 * This is typically bound to the Enter key for code blocks, allowing users to
 * naturally add new lines within their code.
 *
 * @param state - The current editor state
 * @param dispatch - Optional dispatch function to execute the transaction
 * @returns `true` if a newline was inserted, `false` otherwise
 *
 * @example
 * ```typescript
 * // Use in a keymap to handle Enter in code blocks
 * const keymap = {
 *   'Enter': chainCommands(
 *     newlineInCode,
 *     exitCode,
 *     splitBlock
 *   )
 * };
 *
 * // Bind Shift-Enter to always insert newlines in code
 * const keymap = {
 *   'Shift-Enter': newlineInCode
 * };
 * ```
 */
export const newlineInCode: Command = (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
    const {$head, $anchor} = state.selection;

    // Only works inside code blocks with non-spanning selection
    if (!$head.parent.type.spec.code || !$head.sameParent($anchor)) {
        return false;
    }

    if (dispatch) {
        dispatch(state.transaction.insertText('\n').scrollIntoView());
    }

    return true;
};

