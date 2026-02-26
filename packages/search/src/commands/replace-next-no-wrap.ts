import type {Command} from '@type-editor/editor-types';

import {replaceCommand} from './util/replace-command';


/**
 * Replace the next instance of the search query. Don't wrap around
 * at the end of the document.
 */
export const replaceNextNoWrap: Command = replaceCommand(false, true);
