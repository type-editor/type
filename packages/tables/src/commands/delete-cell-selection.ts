import type {PmEditorState, PmSelection, PmTransaction} from '@type-editor/editor-types';
import {type Fragment, type PmNode, Slice} from '@type-editor/model';
import type {DispatchFunction} from '@type-editor/editor-types';

import {CellSelection} from '../cellselection/CellSelection';
import {tableNodeTypes} from '../schema';


/**
 * Deletes the content of selected cells while preserving the cell structure.
 *
 * Only applies when there is a CellSelection. Replaces each cell's content
 * with the default empty content for a cell.
 *
 * @param state - The current editor state
 * @param dispatch - Optional dispatch function to execute the command
 * @returns True if the selection is a CellSelection, false otherwise
 */
export function deleteCellSelection(state: PmEditorState, dispatch?: DispatchFunction): boolean {
    const sel: PmSelection = state.selection;
    if (!(sel instanceof CellSelection)) {
        return false;
    }

    if (dispatch) {
        const transaction: PmTransaction = state.transaction;
        const baseContent: Fragment = tableNodeTypes(state.schema).cell.createAndFill().content;
        sel.forEachCell((cell: PmNode, pos: number): void => {
            if (!cell.content.eq(baseContent)) {
                transaction.replace(
                    transaction.mapping.map(pos + 1),
                    transaction.mapping.map(pos + cell.nodeSize - 1),
                    new Slice(baseContent, 0, 0)
                );
            }
        });

        if (transaction.docChanged) {
            dispatch(transaction);
        }
    }
    return true;
}
