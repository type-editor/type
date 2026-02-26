import {isUndefinedOrNull} from '@type-editor/commons';
import type {PmEditorState, PmSelection, PmTransaction} from '@type-editor/editor-types';
import type {Attrs, NodeType, PmNode} from '@type-editor/model';
import type {Command, DispatchFunction} from '@type-editor/editor-types';

import {CellSelection} from '../cellselection/CellSelection';
import type {GetCellTypeOptions} from '../types/commands/GetCellTypeOptions';
import type {TableRect} from '../types/commands/TableRect';
import {cellAround} from '../utils/cell-around';
import {cellWrapping} from '../utils/cell-wrapping';
import {selectedRect} from './selected-rect';


/**
 * Splits a selected cell into smaller cells with custom cell type determination.
 *
 * This function allows specifying the cell type (th or td) for each new cell
 * via a callback function.
 *
 * @param getCellType - A function that returns the NodeType for each new cell
 * @returns A command that performs the split operation
 */
export function splitCellWithType(getCellType: (options: GetCellTypeOptions) => NodeType): Command {
    return (state: PmEditorState, dispatch: DispatchFunction): boolean => {
        const sel: PmSelection = state.selection;
        let cellNode: PmNode | null | undefined;
        let cellPos: number | undefined;

        if (!(sel instanceof CellSelection)) {
            cellNode = cellWrapping(sel.$from);
            if (!cellNode) {
                return false;
            }

            cellPos = cellAround(sel.$from)?.pos;
        } else {
            if (sel.$anchorCell.pos !== sel.$headCell.pos) {
                return false;
            }

            cellNode = sel.$anchorCell.nodeAfter;
            cellPos = sel.$anchorCell.pos;
        }

        if (isUndefinedOrNull(cellNode) || isUndefinedOrNull(cellPos)) {
            return false;
        }

        if (cellNode.attrs.colspan === 1 && cellNode.attrs.rowspan === 1) {
            return false;
        }

        if (dispatch) {
            let baseAttrs: Attrs = cellNode.attrs;
            const attrs: Array<Attrs> = [];
            const colwidth: number = baseAttrs.colwidth as number;

            if (baseAttrs.rowspan > 1) {
                baseAttrs = {...baseAttrs, rowspan: 1};
            }

            if (baseAttrs.colspan > 1) {
                baseAttrs = {...baseAttrs, colspan: 1};
            }

            const rect: TableRect = selectedRect(state);
            const transaction: PmTransaction = state.transaction;

            for (let i = 0; i < rect.right - rect.left; i++) {
                attrs.push(
                    colwidth
                        ? {
                            ...baseAttrs,
                            colwidth: colwidth?.[i] ? [colwidth[i]] : null,
                        }
                        : baseAttrs,
                );
            }

            let lastCell: number;
            for (let row = rect.top; row < rect.bottom; row++) {
                let pos: number = rect.map.positionAt(row, rect.left, rect.table);
                if (row === rect.top) {
                    pos += cellNode.nodeSize;
                }

                for (let col = rect.left, i = 0; col < rect.right; col++, i++) {
                    if (col === rect.left && row === rect.top) {
                        continue;
                    }

                    transaction.insert(
                        (lastCell = transaction.mapping.map(pos + rect.tableStart, 1)),
                        getCellType({node: cellNode, row, col}).createAndFill(attrs[i]),
                    );
                }
            }

            transaction.setNodeMarkup(
                cellPos,
                getCellType({node: cellNode, row: rect.top, col: rect.left}),
                attrs[0],
            );

            if (sel instanceof CellSelection) {
                transaction.setSelection(
                    new CellSelection(
                        transaction.doc.resolve(sel.$anchorCell.pos),
                        lastCell ? transaction.doc.resolve(lastCell) : undefined,
                    ),
                );
            }

            dispatch(transaction);
        }
        return true;
    };
}
