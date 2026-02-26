import type {PmEditorState, PmTransaction} from '@type-editor/editor-types';
import type {NodeType, PmNode} from '@type-editor/model';

import {fixTablesPluginKey} from '../fix-tables-plugin-key';
import {tableNodeTypes, type TableRole} from '../schema';
import {TableMap} from '../tablemap/TableMap';
import type {CellAttrs} from '../types/CellAttrs';
import {type Problem} from '../types/tablemap/Problem';
import {removeColSpan} from '../utils/remove-col-span';


/**
 * Fix the given table, if necessary. Will append to the transaction
 * it was given, if non-null, or create a new one if necessary.
 *
 * @param state - The current editor state
 * @param table - The table node to fix
 * @param tablePos - The position of the table in the document
 * @param transaction - An optional existing transaction to append fixes to
 * @returns The transaction with fixes applied, or undefined if no fixes were needed
 */
export function fixTable(state: PmEditorState,
                         table: PmNode,
                         tablePos: number,
                         transaction: PmTransaction | undefined): PmTransaction | undefined {
    const map: TableMap = TableMap.get(table);
    if (!map.problems) {
        return transaction;
    }

    if (!transaction) {
        transaction = state.transaction;
    }

    // Track how many cells must be added to each row (adjusted when fixing collisions)
    const cellsToAddPerRow: Array<number> = new Array<number>(map.height).fill(0);

    // Process each problem and apply the appropriate fix
    for (const problem of map.problems) {
        fixProblem(problem, table, tablePos, transaction, cellsToAddPerRow);
    }

    // Insert missing cells into rows that need them
    addMissingCells(state, table, tablePos, map.height, cellsToAddPerRow, transaction);

    return transaction.setMeta(fixTablesPluginKey, {fixTables: true});
}

/**
 * Applies the appropriate fix for a single table problem.
 *
 * @param problem - The problem to fix
 * @param table - The table node containing the problem
 * @param tablePos - The position of the table in the document
 * @param transaction - The transaction to apply fixes to
 * @param cellsToAddPerRow - Array tracking how many cells need to be added to each row
 */
function fixProblem(problem: Problem,
                    table: PmNode,
                    tablePos: number,
                    transaction: PmTransaction,
                    cellsToAddPerRow: Array<number>): void {
    switch (problem.type) {
        case 'collision':
            fixCollision(problem, table, tablePos, transaction, cellsToAddPerRow);
            break;

        case 'missing':
            cellsToAddPerRow[problem.row] += problem.n;
            break;

        case 'overlong_rowspan':
            fixOverlongRowspan(problem, table, tablePos, transaction);
            break;

        case 'colwidth mismatch':
            fixColwidthMismatch(problem, table, tablePos, transaction);
            break;

        case 'zero_sized':
            deleteZeroSizedTable(table, tablePos, transaction);
            break;
    }
}

/**
 * Fixes a cell collision by reducing the colspan of the overlapping cell.
 *
 * A collision occurs when a cell's colspan causes it to overlap with another cell.
 * This fix reduces the colspan and tracks that cells need to be added to affected rows.
 *
 * @param problem - The collision problem containing position and overlap count
 * @param table - The table node containing the collision
 * @param tablePos - The position of the table in the document
 * @param transaction - The transaction to apply the fix to
 * @param cellsToAddPerRow - Array to update with cells that need to be added
 */
function fixCollision(problem: Extract<Problem, { type: 'collision' }>,
                      table: PmNode,
                      tablePos: number,
                      transaction: PmTransaction,
                      cellsToAddPerRow: Array<number>): void {
    const cell: PmNode = table.nodeAt(problem.pos);
    if (!cell) {
        return;
    }

    const attrs = cell.attrs as CellAttrs;

    // Track that we need to add cells to each row this cell spans
    for (let rowOffset = 0; rowOffset < attrs.rowspan; rowOffset++) {
        cellsToAddPerRow[problem.row + rowOffset] += problem.n;
    }

    // Reduce the colspan to eliminate the overlap
    const newAttrs: CellAttrs = removeColSpan(attrs, attrs.colspan - problem.n, problem.n);
    const mappedPos: number = transaction.mapping.map(tablePos + 1 + problem.pos);
    transaction.setNodeMarkup(mappedPos, null, newAttrs);
}

/**
 * Fixes a rowspan that extends beyond the table boundaries.
 *
 * @param problem - The problem containing the cell position and excess rowspan count
 * @param table - The table node containing the problem
 * @param tablePos - The position of the table in the document
 * @param transaction - The transaction to apply the fix to
 */
function fixOverlongRowspan(problem: Extract<Problem, { type: 'overlong_rowspan' }>,
                            table: PmNode,
                            tablePos: number,
                            transaction: PmTransaction): void {
    const cell: PmNode = table.nodeAt(problem.pos);
    if (!cell) {
        return;
    }

    const newAttrs = {
        ...cell.attrs,
        rowspan: cell.attrs.rowspan - problem.n,
    };
    const mappedPos: number = transaction.mapping.map(tablePos + 1 + problem.pos);
    transaction.setNodeMarkup(mappedPos, null, newAttrs);
}

/**
 * Fixes a column width mismatch by updating the cell's colwidth attribute.
 *
 * This ensures all cells in the same column have consistent width values.
 *
 * @param problem - The problem containing the cell position and correct colwidth
 * @param table - The table node containing the problem
 * @param tablePos - The position of the table in the document
 * @param transaction - The transaction to apply the fix to
 */
function fixColwidthMismatch(problem: Extract<Problem, { type: 'colwidth mismatch' }>,
                             table: PmNode,
                             tablePos: number,
                             transaction: PmTransaction): void {
    const cell: PmNode = table.nodeAt(problem.pos);
    if (!cell) {
        return;
    }

    const newAttrs = {
        ...cell.attrs,
        colwidth: problem.colwidth,
    };
    const mappedPos: number = transaction.mapping.map(tablePos + 1 + problem.pos);
    transaction.setNodeMarkup(mappedPos, null, newAttrs);
}

/**
 * Deletes a zero-sized table (a table with no actual content).
 *
 * @param table - The zero-sized table node to delete
 * @param tablePos - The position of the table in the document
 * @param transaction - The transaction to apply the deletion to
 */
function deleteZeroSizedTable(table: PmNode,
                              tablePos: number,
                              transaction: PmTransaction): void {
    const mappedPos: number = transaction.mapping.map(tablePos);
    transaction.delete(mappedPos, mappedPos + table.nodeSize);
}

/**
 * Adds missing cells to rows that need them.
 *
 * Uses a heuristic to determine whether to add cells at the start or end
 * of each row based on the pattern of missing cells in the table.
 *
 * @param state - The editor state
 * @param table - The table node to add cells to
 * @param tablePos - The position of the table in the document
 * @param rowCount - The total number of rows in the table
 * @param cellsToAddPerRow - Array indicating how many cells each row needs
 * @param transaction - The transaction to apply insertions to
 */
function addMissingCells(state: PmEditorState,
                         table: PmNode,
                         tablePos: number,
                         rowCount: number,
                         cellsToAddPerRow: Array<number>,
                         transaction: PmTransaction): void {
    const {firstRowWithMissing, lastRowWithMissing} = findMissingCellRange(cellsToAddPerRow);

    let currentPos: number = tablePos + 1; // Position after table opening tag

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        const row: PmNode = table.child(rowIndex);
        const rowEndPos: number = currentPos + row.nodeSize;
        const cellsToAdd: number = cellsToAddPerRow[rowIndex];

        if (cellsToAdd > 0) {
            const cells: Array<PmNode> = createEmptyCells(state, row, cellsToAdd);

            // Choose insertion position: start of row (after opening tag) or end (before closing tag)
            const insertAtStart: boolean = shouldInsertAtRowStart(rowIndex, firstRowWithMissing, lastRowWithMissing);
            const insertPos: number = insertAtStart ? currentPos + 1 : rowEndPos - 1;

            transaction.insert(transaction.mapping.map(insertPos), cells);
        }

        currentPos = rowEndPos;
    }
}

/**
 * Calculates the range of rows that need cells added (first and last row with missing cells).
 *
 * @param cellsToAddPerRow - Array indicating how many cells each row needs
 * @returns Object with firstRowWithMissing and lastRowWithMissing indices, or undefined
 *          values if no rows need cells
 */
function findMissingCellRange(cellsToAddPerRow: Array<number>): {
    firstRowWithMissing: number | undefined;
    lastRowWithMissing: number | undefined;
} {
    let firstRowWithMissing: number | undefined = undefined;
    let lastRowWithMissing: number | undefined;

    for (let rowIndex = 0; rowIndex < cellsToAddPerRow.length; rowIndex++) {
        if (cellsToAddPerRow[rowIndex] > 0) {
            firstRowWithMissing ??= rowIndex;
            lastRowWithMissing = rowIndex;
        }
    }

    return {firstRowWithMissing, lastRowWithMissing};
}

/**
 * Determines whether new cells should be inserted at the start of a row.
 *
 * Uses a heuristic: if it looks like a "bite" was taken out of the table
 * (i.e., the previous row was the first with missing cells and the current
 * row is the last), cells are added at the start. Otherwise, they're added
 * at the end.
 *
 * @param rowIndex - The current row index
 * @param firstRowWithMissing - The first row that has missing cells
 * @param lastRowWithMissing - The last row that has missing cells
 * @returns True if cells should be inserted at the start of the row
 */
function shouldInsertAtRowStart(rowIndex: number,
                                firstRowWithMissing: number | undefined,
                                lastRowWithMissing: number | undefined): boolean {
    return (rowIndex === 0 || firstRowWithMissing === rowIndex - 1) &&
        lastRowWithMissing === rowIndex;
}

/**
 * Creates empty cells to fill missing positions in a row.
 *
 * @param state - The editor state (needed for schema access)
 * @param row - The row node to determine the appropriate cell type
 * @param count - The number of cells to create
 * @returns An array of newly created cell nodes
 */
function createEmptyCells(state: PmEditorState,
                          row: PmNode,
                          count: number): Array<PmNode> {
    // Determine cell type from existing row content (cell vs header_cell)
    const role: TableRole = row.firstChild?.type.spec.tableRole as TableRole ?? 'cell';
    const cellType: NodeType = tableNodeTypes(state.schema)[role];

    const cells: Array<PmNode> = [];
    for (let i = 0; i < count; i++) {
        const cell: PmNode = cellType.createAndFill();
        if (cell) {
            cells.push(cell);
        }
    }
    return cells;
}
