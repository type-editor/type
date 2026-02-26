import type {Command} from '@type-editor/editor-types';

import {buildCommand} from './util/build-command';

/**
 * A command function that undoes the last change, if any.
 *
 * This command will undo the most recent change in the editor's history and
 * automatically scroll the selection into view after the undo operation.
 *
 * @returns {Command} A command that can be executed against an editor state
 *
 * @example
 * ```typescript
 * // In a keymap
 * keymap({
 *   'Mod-z': undo
 * })
 * ```
 */
export const undo: Command = buildCommand(false, true);
