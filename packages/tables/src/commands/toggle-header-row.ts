import type {Command} from '@type-editor/editor-types';

import {toggleHeader} from './toggle-header';


/**
 * Toggles whether the selected row contains header cells.
 */
export const toggleHeaderRow: Command = toggleHeader('row', {
    useSelectedRowColumn: true,
});
