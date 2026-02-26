import type {Command, DispatchFunction, PmEditorState, PmEditorView} from '@type-editor/editor-types';

/**
 * Combines multiple command functions into a single command that executes them sequentially
 * until one succeeds.
 *
 * This function creates a command that tries each provided command in order. The first command
 * that returns `true` (indicating success) will stop the chain, and the chained command will
 * return `true`. If all commands return `false`, the chained command returns `false`.
 *
 * This is particularly useful for creating fallback behavior where you want to try multiple
 * strategies for handling a user action.
 *
 * @param commands - Variable number of command functions to chain together
 * @returns A new command that executes the provided commands in sequence
 *
 * @example
 * ```typescript
 * // Create a command that tries to delete selection, then join backward, then select backward
 * const myBackspaceCommand = chainCommands(
 *   deleteSelection,
 *   joinBackward,
 *   selectNodeBackward
 * );
 *
 * // Use in a keymap
 * const keymap = {
 *   'Backspace': chainCommands(deleteSelection, joinBackward)
 * };
 * ```
 */
export function chainCommands(...commands: ReadonlyArray<Command>): Command {
    return (state: PmEditorState, dispatch?: DispatchFunction, view?: PmEditorView): boolean => {

        for (const command of commands) {

            if (command(state, dispatch, view)) {
                return true;
            }
        }
        return false;
    };
}





