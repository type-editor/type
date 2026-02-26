import type {Command} from '@type-editor/editor-types';

import {replaceCommand} from './util/replace-command';


/**
 * Replace the currently selected instance of the search query, if
 * any. Don't move to the next match.
 */
export const replaceCurrent: Command = replaceCommand(false, false);
