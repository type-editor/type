import type {PmSelection} from '@type-editor/editor-types';
import type {PmNode} from '@type-editor/model';

import {TableMap} from '../tablemap/TableMap';
import {type Rect} from '../types/tablemap/Rect';
import type {FindNodeResult} from './query';
import {findTable} from './query';

/**
 * Retrieves cell positions from a rectangular region within a table and maps them
 * to detailed cell information including position, start, node, and depth.
 *
 * @param table - The table node result containing the table information.
 * @param map - The table map for efficient cell lookup.
 * @param rect - The rectangular region defining which cells to retrieve.
 * @returns An array of cell information objects.
 */
function getCellsInRect(table: FindNodeResult, map: TableMap, rect: Rect): Array<FindNodeResult> {
    const cellPositions: Array<number> = map.cellsInRect(rect);
    const result: Array<FindNodeResult> = [];

    for (const nodePos of cellPositions) {
        const node: PmNode | null = table.node.nodeAt(nodePos);
        if (node === null) {
            continue;
        }
        const pos: number = nodePos + table.start;

        result.push({
            pos,
            start: pos + 1,
            node,
            depth: table.depth + 2
        });
    }

    return result;
}

/**
 * Returns an array of cells in a column at the specified column index.
 *
 * This function locates the table containing the current selection and retrieves
 * all cells that belong to the specified column. The returned cells include
 * their positions and node references for further manipulation.
 *
 * @param columnIndex - The zero-based index of the column to retrieve cells from.
 *                      Must be within the valid range [0, tableWidth - 1].
 * @param selection - The current editor selection, used to locate the table context.
 * @returns An array of cell information objects if the column exists, or undefined
 *          if no table is found or the column index is out of bounds.
 *
 * @example
 * ```typescript
 * const cells = getCellsInColumn(0, editorState.selection);
 * if (cells) {
 *     cells.forEach(cell => console.log(cell.node.textContent));
 * }
 * ```
 */
export function getCellsInColumn(columnIndex: number, selection: PmSelection): Array<FindNodeResult> | undefined {
    const table: FindNodeResult = findTable(selection.$from);
    if (!table) {
        return undefined;
    }

    const map: TableMap = TableMap.get(table.node);

    if (columnIndex < 0 || columnIndex >= map.width) {
        return undefined;
    }

    return getCellsInRect(table, map, {
        left: columnIndex,
        right: columnIndex + 1,
        top: 0,
        bottom: map.height,
    });
}

/**
 * Returns an array of cells in a row at the specified row index.
 *
 * This function locates the table containing the current selection and retrieves
 * all cells that belong to the specified row. The returned cells include
 * their positions and node references for further manipulation.
 *
 * @param rowIndex - The zero-based index of the row to retrieve cells from.
 *                   Must be within the valid range [0, tableHeight - 1].
 * @param selection - The current editor selection, used to locate the table context.
 * @returns An array of cell information objects if the row exists, or undefined
 *          if no table is found or the row index is out of bounds.
 *
 * @example
 * ```typescript
 * const cells = getCellsInRow(0, editorState.selection);
 * if (cells) {
 *     cells.forEach(cell => console.log(cell.node.textContent));
 * }
 * ```
 */
export function getCellsInRow(rowIndex: number, selection: PmSelection): Array<FindNodeResult> | undefined {
    const table: FindNodeResult = findTable(selection.$from);
    if (!table) {
        return undefined;
    }

    const map: TableMap = TableMap.get(table.node);

    if (rowIndex < 0 || rowIndex >= map.height) {
        return undefined;
    }

    return getCellsInRect(table, map, {
        left: 0,
        right: map.width,
        top: rowIndex,
        bottom: rowIndex + 1,
    });
}
