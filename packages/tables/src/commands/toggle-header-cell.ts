import type {Command} from '@type-editor/editor-types';

import {toggleHeader} from './toggle-header';


/**
 * Toggles whether the selected cells are header cells.
 */
export const toggleHeaderCell: Command = toggleHeader('cell');
