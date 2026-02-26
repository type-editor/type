import type {PmEditorState, PmTransaction} from '@type-editor/editor-types';
import type {PmNode} from '@type-editor/model';
import type {DispatchFunction} from '@type-editor/editor-types';

import {TableMap} from '../tablemap/TableMap';
import type {TableRect} from '../types/commands/TableRect';
import {isInTable} from '../utils/is-in-table';
import {removeColumn} from './remove-column';
import {selectedRect} from './selected-rect';


/**
 * Command that removes the selected columns from a table.
 *
 * If the selection spans multiple columns, all selected columns will be removed.
 * The command will not execute if it would remove all columns in the table.
 *
 * @param state - The current editor state
 * @param dispatch - Optional dispatch function to execute the command
 * @returns True if the command is applicable, false otherwise
 */
export function deleteColumn(state: PmEditorState, dispatch?: DispatchFunction): boolean {
    if (!isInTable(state)) {
        return false;
    }

    const rect: TableRect = selectedRect(state);
    // Don't allow deleting all columns
    if (rect.left === 0 && rect.right === rect.map.width) {
        return false;
    }

    if (dispatch) {
        const transaction: PmTransaction = state.transaction;

        for (let i = rect.right - 1; ; i--) {
            removeColumn(transaction, rect, i);

            if (i === rect.left) {
                break;
            }

            const table: PmNode = rect.tableStart
                ? transaction.doc.nodeAt(rect.tableStart - 1)
                : transaction.doc;

            if (!table) {
                throw new RangeError('No table found');
            }

            rect.table = table;
            rect.map = TableMap.get(table);
        }
        dispatch(transaction);
    }
    return true;
}
