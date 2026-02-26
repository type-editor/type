import type {Command} from '@type-editor/editor-types';

import {toggleHeader} from './toggle-header';


/**
 * Toggles whether the selected column contains header cells.
 */
export const toggleHeaderColumn: Command = toggleHeader('column', {
    useSelectedRowColumn: true,
});
