import type {Command} from '@type-editor/editor-types';

import {buildCommand} from './util/build-command';


/**
 * A command function that undoes the last change without scrolling the
 * selection into view.
 *
 * This is useful when you want to undo changes programmatically without
 * disrupting the user's current viewport position.
 *
 * @returns {Command} A command that can be executed against an editor state
 */
export const undoNoScroll: Command = buildCommand(false, false);
