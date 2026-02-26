import type {Command} from '@type-editor/editor-types';

import {replaceCommand} from './util/replace-command';


/**
 * Replace the currently selected instance of the search query, and
 * move to the next one. Or select the next match, if none is already
 * selected.
 */
export const replaceNext: Command = replaceCommand(true, true);
