import {isUndefinedOrNull} from '@type-editor/commons';
import type {PmTransaction} from '@type-editor/editor-types';
import type {NodeType, PmNode} from '@type-editor/model';

import {tableNodeTypes} from '../schema';
import type {CellAttrs} from '../types/CellAttrs';
import type {TableRect} from '../types/commands/TableRect';
import {addColSpan} from '../utils/add-col-span';
import {columnIsHeader} from '../utils/column-is-header';


/**
 * Adds a column at the given position in a table.
 *
 * This function handles:
 * - Extending cells that span across the insertion point
 * - Creating new cells with the appropriate type (header or regular)
 * - Maintaining table structure integrity
 *
 * @param transaction - The transaction to apply changes to
 * @param tableRect - The table rectangle containing map, tableStart, and table
 * @param col - The column index where the new column should be inserted
 * @returns The modified transaction
 */
export function addColumn(transaction: PmTransaction,
                          {map, tableStart, table}: TableRect,
                          col: number): PmTransaction {
    // Determine the reference column for cell type inference
    let refColumn: number | null = col > 0 ? -1 : 0;
    if (columnIsHeader(map, table, col + refColumn)) {
        refColumn = col === 0 || col === map.width ? null : 0;
    }

    for (let row = 0; row < map.height; row++) {
        const index = row * map.width + col;
        const isInsideColSpan = col > 0 && col < map.width && map.map[index - 1] === map.map[index];

        if (isInsideColSpan) {
            // Extend the colspan of the spanning cell
            const cellPos: number = map.map[index];
            const cell: PmNode = table.nodeAt(cellPos);
            const colOffset: number = col - map.colCount(cellPos);

            transaction.setNodeMarkup(
                transaction.mapping.map(tableStart + cellPos),
                null,
                addColSpan(cell.attrs as CellAttrs, colOffset)
            );

            // Skip rows covered by this cell's rowspan
            row += cell.attrs.rowspan - 1;
        } else {
            // Insert a new cell
            const refCell: PmNode = isUndefinedOrNull(refColumn)
                ? null
                : table.nodeAt(map.map[index + refColumn]);
            const cellType: NodeType = refCell?.type ?? tableNodeTypes(table.type.schema).cell;

            const insertPos: number = map.positionAt(row, col, table);
            transaction.insert(
                transaction.mapping.map(tableStart + insertPos),
                cellType.createAndFill()
            );
        }
    }
    return transaction;
}
