import type {NodeType, PmNode} from '@type-editor/model';

import {tableNodeTypes} from '../schema';
import type {TableMap} from '../tablemap/TableMap';


/**
 * Checks if an entire column consists only of header cells.
 *
 * This function iterates through all rows of the table and checks if
 * every cell in the specified column is a header cell.
 *
 * @param map - The TableMap for the table being checked.
 * @param table - The table node to check.
 * @param col - The zero-based column index to check.
 * @returns True if all cells in the column are header cells, false otherwise.
 *
 * @example
 * ```typescript
 * const map = TableMap.get(tableNode);
 * if (columnIsHeader(map, tableNode, 0)) {
 *     console.log('First column is a header column');
 * }
 * ```
 */
export function columnIsHeader(map: TableMap,
                               table: PmNode,
                               col: number): boolean {
    const headerCell: NodeType = tableNodeTypes(table.type.schema).header_cell;
    let lastCellPos = -1;

    for (let row = 0; row < map.height; row++) {
        const cellPos = map.map[col + row * map.width];

        // Skip if we already checked this cell (happens with rowspan > 1)
        if (cellPos === lastCellPos) {
            continue;
        }
        lastCellPos = cellPos;

        const cell: PmNode = table.nodeAt(cellPos);

        if (cell?.type !== headerCell) {
            return false;
        }
    }

    return true;
}
