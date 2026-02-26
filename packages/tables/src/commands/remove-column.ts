import type {PmTransaction} from '@type-editor/editor-types';
import type {PmNode} from '@type-editor/model';

import type {CellAttrs} from '../types/CellAttrs';
import type {TableRect} from '../types/commands/TableRect';
import {removeColSpan} from '../utils/remove-col-span';


/**
 * Removes a column at the specified position from a table.
 *
 * This function handles:
 * - Reducing colspan for cells that span across the removed column
 * - Deleting cells that only occupy the removed column
 * - Properly updating position mappings during the operation
 *
 * @param transaction - The transaction to apply changes to
 * @param tableRect - The table rectangle containing map, table, and tableStart
 * @param col - The column index to remove
 */
export function removeColumn(transaction: PmTransaction,
                             {map, table, tableStart}: TableRect,
                             col: number): void {
    const mapStart: number = transaction.mapping.maps.length;

    for (let row = 0; row < map.height;) {
        const index: number = row * map.width + col;
        const pos: number = map.map[index];
        const cell: PmNode = table.nodeAt(pos);
        const attrs = cell.attrs as CellAttrs;

        const isPartOfColSpan: boolean =
            (col > 0 && map.map[index - 1] === pos) ||
            (col < map.width - 1 && map.map[index + 1] === pos);

        if (isPartOfColSpan) {
            // Reduce colspan for spanning cells
            transaction.setNodeMarkup(
                transaction.mapping.slice(mapStart).map(tableStart + pos),
                null,
                removeColSpan(attrs, col - map.colCount(pos)),
            );
        } else {
            // Delete the entire cell
            const start: number = transaction.mapping.slice(mapStart).map(tableStart + pos);
            transaction.delete(start, start + cell.nodeSize);
        }

        row += attrs.rowspan;
    }
}
