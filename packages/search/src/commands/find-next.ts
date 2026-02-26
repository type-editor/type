import type {Command} from '@type-editor/editor-types';

import {findCommand} from './util/find-command';

/**
 * Find the next instance of the search query after the current
 * selection and move the selection to it.
 */
export const findNext: Command = findCommand(true, 1);
