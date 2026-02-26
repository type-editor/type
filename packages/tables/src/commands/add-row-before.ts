import type {PmEditorState} from '@type-editor/editor-types';
import type {DispatchFunction} from '@type-editor/editor-types';

import type {TableRect} from '../types/commands/TableRect';
import {isInTable} from '../utils/is-in-table';
import {addRow} from './add-row';
import {selectedRect} from './selected-rect';


/**
 * Command to add a table row before the selection.
 *
 * @param state - The current editor state
 * @param dispatch - Optional dispatch function to execute the command
 * @returns True if the command is applicable, false otherwise
 */
export function addRowBefore(state: PmEditorState, dispatch?: DispatchFunction): boolean {
    if (!isInTable(state)) {
        return false;
    }

    if (dispatch) {
        const rect: TableRect = selectedRect(state);
        dispatch(addRow(state.transaction, rect, rect.top));
    }
    return true;
}
