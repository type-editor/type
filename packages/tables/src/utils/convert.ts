import type {PmNode} from '@type-editor/model';

import {TableMap} from '../tablemap/TableMap';

/**
 * A matrix representation of table cells, where each element is either a Node
 * (for the top-left cell of a merged region) or null (for continuation cells
 * that are part of a merged cell spanning from above or left).
 */
export type TableCellMatrix = ReadonlyArray<ReadonlyArray<PmNode | null>>;

/**
 * Transforms a table node into a matrix of rows and columns, respecting merged cells.
 *
 * For cells spanning multiple rows or columns, only the top-left cell of the merged
 * region contains the actual Node; all other positions in the span are represented
 * as `null`.
 *
 * @example
 * Given this table structure:
 * ```
 * ┌──────┬──────┬─────────────┐
 * │  A1  │  B1  │     C1      │
 * ├──────┼──────┴──────┬──────┤
 * │  A2  │     B2      │      │
 * ├──────┼─────────────┤  D1  │
 * │  A3  │  B3  │  C3  │      │
 * └──────┴──────┴──────┴──────┘
 * ```
 *
 * The result will be:
 * ```javascript
 * [
 *   [A1, B1, C1, null],   // C1 spans 2 columns, so position 3 is null
 *   [A2, B2, null, D1],   // B2 spans 2 columns, D1 starts here but spans 2 rows
 *   [A3, B3, C3, null],   // D1 continues from above, so position 3 is null
 * ]
 * ```
 *
 * @param tableNode - The table node to convert into a matrix representation
 * @returns A 2D array where each row contains nodes or null values for merged cell continuations
 */
export function convertTableNodeToArrayOfRows(tableNode: PmNode): TableCellMatrix {
    const map: TableMap = TableMap.get(tableNode);
    const {height: rowCount, width: colCount} = map;

    return Array.from({length: rowCount}, (_, rowIndex) =>
        buildRowCells(tableNode, map, rowIndex, colCount),
    );
}

/**
 * Builds an array of cells for a single row in the table matrix.
 *
 * @param tableNode - The table node containing the cells
 * @param map - The table map providing cell position information
 * @param rowIndex - The zero-based index of the current row
 * @param colCount - The total number of columns in the table
 * @returns An array of nodes or null values for the row
 */
function buildRowCells(tableNode: PmNode,
                       map: TableMap,
                       rowIndex: number,
                       colCount: number): Array<PmNode | null> {
    return Array.from({length: colCount}, (_, colIndex) =>
        getCellAtPosition(tableNode, map, rowIndex, colIndex, colCount),
    );
}

/**
 * Determines the cell content at a specific position in the table matrix.
 *
 * Returns `null` if the position is part of a merged cell that originates
 * from the left or above (i.e., this is a continuation of a colspan or rowspan).
 *
 * @param tableNode - The table node containing the cells
 * @param map - The table map providing cell position information
 * @param rowIndex - The zero-based row index
 * @param colIndex - The zero-based column index
 * @param colCount - The total number of columns in the table
 * @returns The cell node if this is the origin of a cell, or null for merged cell continuations
 */
function getCellAtPosition(tableNode: PmNode,
                           map: TableMap,
                           rowIndex: number,
                           colIndex: number,
                           colCount: number,): PmNode | null {
    const cellIndex: number = rowIndex * colCount + colIndex;
    const cellPos: number = map.map[cellIndex];

    if (isContinuationFromAbove(map, cellIndex, cellPos, colCount)) {
        return null;
    }

    if (isContinuationFromLeft(map, cellIndex, cellPos, colCount)) {
        return null;
    }

    return tableNode.nodeAt(cellPos);
}

/**
 * Checks if the current cell position is a continuation of a cell that spans
 * from the row above (part of a rowspan).
 *
 * @param map - The table map providing cell position information
 * @param cellIndex - The flat index of the current cell in the map
 * @param cellPos - The position value of the current cell
 * @param colCount - The total number of columns in the table
 * @returns True if this cell continues from the cell above
 */
function isContinuationFromAbove(map: TableMap,
                                 cellIndex: number,
                                 cellPos: number,
                                 colCount: number): boolean {
    const topCellIndex: number = cellIndex - colCount;
    if (topCellIndex < 0) {
        return false;
    }
    return map.map[topCellIndex] === cellPos;
}

/**
 * Checks if the current cell position is a continuation of a cell that spans
 * from the left (part of a colspan).
 *
 * @param map - The table map providing cell position information
 * @param cellIndex - The flat index of the current cell in the map
 * @param cellPos - The position value of the current cell
 * @param colCount - The total number of columns in the table
 * @returns True if this cell continues from the cell to the left
 */
function isContinuationFromLeft(map: TableMap,
                                cellIndex: number,
                                cellPos: number,
                                colCount: number): boolean {
    // Check if we're at the start of a row (colIndex === 0)
    // In the flat array, cellIndex % colCount gives us the column index
    if (cellIndex % colCount === 0) {
        return false;
    }
    const leftCellIndex = cellIndex - 1;
    return map.map[leftCellIndex] === cellPos;
}

/**
 * Converts a matrix of table cells back into a table node.
 *
 * This function reconstructs a table node from a 2D array representation,
 * typically used after modifying the table structure or cell contents.
 * The matrix should follow the same format produced by {@link convertTableNodeToArrayOfRows},
 * where `null` values represent continuation cells of merged regions.
 *
 * @example
 * ```typescript
 * const originalTable = table(tr(td('A1'), td('B1')), tr(td('A2'), td('B2')));
 * const matrix = convertTableNodeToArrayOfRows(originalTable);
 *
 * // Modify a cell in the matrix
 * matrix[0][0] = createNewCell('Modified A1');
 *
 * // Convert back to a table node
 * const newTable = convertArrayOfRowsToTableNode(originalTable, matrix);
 * ```
 *
 * @param tableNode - The original table node used as a template for structure and attributes.
 *                    Row and cell types are preserved from this node.
 * @param cellMatrix - A 2D array of cells where each element is either:
 *                     - A Node representing a cell (original or modified)
 *                     - `null` for merged cell continuations (colspan/rowspan extensions)
 * @returns A new table node with the updated cell contents while preserving the original structure
 */
export function convertArrayOfRowsToTableNode(tableNode: PmNode,
                                              cellMatrix: ReadonlyArray<ReadonlyArray<PmNode | null>>): PmNode {
    const map: TableMap = TableMap.get(tableNode);
    const {height: rowCount, width: colCount} = map;

    const newRows: Array<PmNode> = Array.from({length: rowCount}, (_, rowIndex) =>
        buildTableRow(tableNode, map, cellMatrix, rowIndex, colCount),
    );

    return tableNode.type.createChecked(
        tableNode.attrs,
        newRows,
        tableNode.marks,
    );
}

/**
 * Builds a single table row from the cell matrix.
 *
 * @param tableNode - The original table node containing the source rows
 * @param map - The table map providing cell position information
 * @param cellMatrix - The 2D array of cells to build from
 * @param rowIndex - The zero-based index of the row to build
 * @param colCount - The total number of columns in the table
 * @returns A new row node with cells from the matrix
 */
function buildTableRow(tableNode: PmNode,
                       map: TableMap,
                       cellMatrix: ReadonlyArray<ReadonlyArray<PmNode | null>>,
                       rowIndex: number,
                       colCount: number): PmNode {
    const originalRow: PmNode = tableNode.child(rowIndex);
    const cells: Array<PmNode> = collectRowCells(tableNode, map, cellMatrix, rowIndex, colCount);

    return originalRow.type.createChecked(
        originalRow.attrs,
        cells,
        originalRow.marks,
    );
}

/**
 * Collects all non-null cells for a specific row, creating new cell nodes
 * based on the original cell structure and the new cell content from the matrix.
 *
 * @param tableNode - The original table node containing the source cells
 * @param map - The table map providing cell position information
 * @param cellMatrix - The 2D array of cells to collect from
 * @param rowIndex - The zero-based index of the row
 * @param colCount - The total number of columns in the table
 * @returns An array of cell nodes for the row
 */
function collectRowCells(tableNode: PmNode,
                         map: TableMap,
                         cellMatrix: ReadonlyArray<ReadonlyArray<PmNode | null>>,
                         rowIndex: number,
                         colCount: number): Array<PmNode> {
    const cells: Array<PmNode> = [];

    for (let colIndex = 0; colIndex < colCount; colIndex++) {
        const cell: PmNode = buildCellFromMatrix(tableNode, map, cellMatrix, rowIndex, colIndex);
        if (cell !== null) {
            cells.push(cell);
        }
    }

    return cells;
}

/**
 * Creates a new cell node from the matrix value at the specified position.
 * Returns null if the matrix position is null (continuation cell) or if
 * the corresponding original cell cannot be found.
 *
 * @param tableNode - The original table node containing the source cells
 * @param map - The table map providing cell position information
 * @param cellMatrix - The 2D array of cells
 * @param rowIndex - The zero-based row index
 * @param colIndex - The zero-based column index
 * @returns A new cell node, or null if this position should be skipped
 */
function buildCellFromMatrix(tableNode: PmNode,
                             map: TableMap,
                             cellMatrix: ReadonlyArray<ReadonlyArray<PmNode | null>>,
                             rowIndex: number,
                             colIndex: number): PmNode | null {
    const matrixCell: PmNode = cellMatrix[rowIndex][colIndex];
    if (matrixCell === null) {
        return null;
    }

    const cellPos: number = map.map[rowIndex * map.width + colIndex];
    const originalCell: PmNode = tableNode.nodeAt(cellPos);
    if (originalCell === null) {
        return null;
    }

    return originalCell.type.createChecked(
        matrixCell.attrs,
        matrixCell.content,
        matrixCell.marks,
    );
}
