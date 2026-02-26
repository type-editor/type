import type {Command} from '@type-editor/editor-types';

import {buildCommand} from './util/build-command';


/**
 * A command function that redoes the last undone change, if any.
 *
 * This command will redo the most recently undone change in the editor's history
 * and automatically scroll the selection into view after the redo operation.
 *
 * @returns {Command} A command that can be executed against an editor state
 *
 * @example
 * ```typescript
 * // In a keymap
 * keymap({
 *   'Mod-Shift-z': redo
 * })
 * ```
 */
export const redo: Command = buildCommand(true, true);
