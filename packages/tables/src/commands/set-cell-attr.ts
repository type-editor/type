import type {PmEditorState, PmTransaction} from '@type-editor/editor-types';
import type {PmNode, ResolvedPos} from '@type-editor/model';
import type {Command, DispatchFunction} from '@type-editor/editor-types';

import {CellSelection} from '../cellselection/CellSelection';
import {isInTable} from '../utils/is-in-table';
import {selectionCell} from '../utils/selection-cell';


/**
 * Creates a command that sets a specific attribute to a given value on the selected cell(s).
 *
 * The command is only available when the currently selected cell doesn't
 * already have that attribute set to the specified value.
 *
 * @param name - The attribute name to set
 * @param value - The value to set the attribute to
 * @returns A command that sets the attribute on selected cells
 */
export function setCellAttr(name: string, value: unknown): Command {
    return function (state: PmEditorState, dispatch: DispatchFunction): boolean {
        if (!isInTable(state)) {
            return false;
        }

        const $cell: ResolvedPos = selectionCell(state);
        if ($cell.nodeAfter.attrs[name] === value) {
            return false;
        }

        if (dispatch) {
            const transaction: PmTransaction = state.transaction;

            if (state.selection instanceof CellSelection) {
                state.selection.forEachCell((node: PmNode, pos: number): void => {
                    if (node.attrs[name] !== value)
                        {transaction.setNodeMarkup(pos, null, {
                            ...node.attrs,
                            [name]: value,
                        });}
                });
            } else {
                transaction.setNodeMarkup($cell.pos, null, {
                    ...$cell.nodeAfter.attrs,
                    [name]: value,
                });
            }

            dispatch(transaction);
        }
        return true;
    };
}
