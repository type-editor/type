import type {PmEditorState, PmTransaction} from '@type-editor/editor-types';
import type {PmNode} from '@type-editor/model';
import type {DispatchFunction} from '@type-editor/editor-types';

import {TableMap} from '../tablemap/TableMap';
import type {TableRect} from '../types/commands/TableRect';
import {isInTable} from '../utils/is-in-table';
import {removeRow} from './remove-row';
import {selectedRect} from './selected-rect';


/**
 * Command that removes the selected rows from a table.
 *
 * If the selection spans multiple rows, all selected rows will be removed.
 * The command will not execute if it would remove all rows in the table.
 *
 * @param state - The current editor state
 * @param dispatch - Optional dispatch function to execute the command
 * @returns True if the command is applicable, false otherwise
 */
export function deleteRow(state: PmEditorState, dispatch?: DispatchFunction): boolean {
    if (!isInTable(state)) {
        return false;
    }

    const rect: TableRect = selectedRect(state);
    // Don't allow deleting all rows
    if (rect.top === 0 && rect.bottom === rect.map.height) {
        return false;
    }

    if (dispatch) {
        const transaction: PmTransaction = state.transaction;

        for (let i = rect.bottom - 1; ; i--) {
            removeRow(transaction, rect, i);
            if (i === rect.top) {
                break;
            }

            const table: PmNode = rect.tableStart
                ? transaction.doc.nodeAt(rect.tableStart - 1)
                : transaction.doc;

            if (!table) {
                throw new RangeError('No table found');
            }

            rect.table = table;
            rect.map = TableMap.get(rect.table);
        }
        dispatch(transaction);
    }
    return true;
}
