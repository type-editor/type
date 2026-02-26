import type {Command} from '@type-editor/editor-types';

import {findCommand} from './util/find-command';


/**
 * Find the next instance of the search query and move the selection
 * to it. Don't wrap around at the end of document or search range.
 */
export const findNextNoWrap: Command = findCommand(false, 1);
