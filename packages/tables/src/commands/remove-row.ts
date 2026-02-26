import type {PmTransaction} from '@type-editor/editor-types';
import type {PmNode} from '@type-editor/model';

import type {CellAttrs} from '../types/CellAttrs';
import type {TableRect} from '../types/commands/TableRect';


/**
 * Removes a row at the specified position from a table.
 *
 * This function handles:
 * - Reducing rowspan for cells that span across the removed row
 * - Deleting cells that only occupy the removed row
 * - Moving cells that start in the removed row but continue below
 * - Properly updating position mappings during the operation
 *
 * @param transaction - The transaction to apply changes to
 * @param tableRect - The table rectangle containing map, table, and tableStart
 * @param row - The row index to remove
 */
export function removeRow(transaction: PmTransaction,
                          {map, table, tableStart}: TableRect,
                          row: number): void {
    let rowPos = 0;
    for (let i = 0; i < row; i++) {
        rowPos += table.child(i).nodeSize;
    }

    const nextRow: number = rowPos + table.child(row).nodeSize;

    const mapFrom: number = transaction.mapping.maps.length;
    transaction.delete(rowPos + tableStart, nextRow + tableStart);

    const seen = new Set<number>();

    for (let col = 0, index = row * map.width; col < map.width; col++, index++) {
        const pos: number = map.map[index];

        // Skip cells that are checked already
        if (seen.has(pos)) {
            continue;
        }
        seen.add(pos);

        // If this cell starts in the row above, simply reduce its rowspan
        if (row > 0 && pos === map.map[index - map.width]) {
            const attrs = table.nodeAt(pos).attrs as CellAttrs;

            transaction.setNodeMarkup(transaction.mapping.slice(mapFrom).map(pos + tableStart), null, {
                ...attrs,
                rowspan: attrs.rowspan - 1,
            });

            col += attrs.colspan - 1;
        }
        // Else, if it continues in the row below, it has to be moved down
        else if (row < map.height && pos === map.map[index + map.width]) {
            const cell: PmNode = table.nodeAt(pos);
            const attrs = cell.attrs as CellAttrs;

            const copy: PmNode = cell.type.create(
                {...attrs, rowspan: cell.attrs.rowspan - 1},
                cell.content,
            );

            const newPos: number = map.positionAt(row + 1, col, table);
            transaction.insert(transaction.mapping.slice(mapFrom).map(tableStart + newPos), copy);
            col += attrs.colspan - 1;
        }
    }
}
