import type {Command} from '@type-editor/editor-types';

import {buildCommand} from './util/build-command';

/**
 * A command function that redoes the last undone change without scrolling
 * the selection into view.
 *
 * This is useful when you want to redo changes programmatically without
 * disrupting the user's current viewport position.
 *
 * @returns {Command} A command that can be executed against an editor state
 */
export const redoNoScroll: Command = buildCommand(true, false);
