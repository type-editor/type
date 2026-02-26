import type {NodeType, PmNode} from '@type-editor/model';

import {tableNodeTypes} from '../schema';
import type {TableMap} from '../tablemap/TableMap';


/**
 * Checks if all cells in a given row are header cells.
 *
 * @param map - The table map to check
 * @param table - The table node
 * @param row - The row index to check
 * @returns True if all cells in the row are header cells
 */
export function rowIsHeader(map: TableMap, table: PmNode, row: number): boolean {
    const headerCell: NodeType = tableNodeTypes(table.type.schema).header_cell;
    for (let col = 0; col < map.width; col++) {
        if (table.nodeAt(map.map[col + row * map.width])?.type !== headerCell) {
            return false;
        }
    }

    return true;
}
