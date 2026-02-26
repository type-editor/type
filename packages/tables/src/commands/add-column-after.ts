import type {PmEditorState} from '@type-editor/editor-types';
import type {DispatchFunction} from '@type-editor/editor-types';

import type {TableRect} from '../types/commands/TableRect';
import {isInTable} from '../utils/is-in-table';
import {addColumn} from './add-column';
import {selectedRect} from './selected-rect';


/**
 * Command to add a column after the column with the selection.
 *
 * @param state - The current editor state
 * @param dispatch - Optional dispatch function to execute the command
 * @returns True if the command is applicable, false otherwise
 */
export function addColumnAfter(state: PmEditorState, dispatch?: DispatchFunction): boolean {
    if (!isInTable(state)) {
        return false;
    }

    if (dispatch) {
        const rect: TableRect = selectedRect(state);
        dispatch(addColumn(state.transaction, rect, rect.right));
    }

    return true;
}
