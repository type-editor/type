import type {Command} from '@type-editor/editor-types';

import {findCommand} from './util/find-command';


/**
 * Find the previous instance of the search query and move the
 * selection to it.
 */
export const findPrev: Command = findCommand(true, -1);
