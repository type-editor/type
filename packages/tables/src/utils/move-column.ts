import type {PmTransaction} from '@type-editor/editor-types';
import type {PmNode, ResolvedPos} from '@type-editor/model';

import {CellSelection} from '../cellselection/CellSelection';
import {TableMap} from '../tablemap/TableMap';
import {convertArrayOfRowsToTableNode, convertTableNodeToArrayOfRows, type TableCellMatrix} from './convert';
import {moveRowInArrayOfRows} from './move-row-in-array-of-rows';
import {type FindNodeResult, findTable} from './query';
import {type CellSelectionRange, getSelectionRangeInColumn} from './selection-range';
import {transpose} from './transpose';

/**
 * Parameters for moving a column within a table.
 */
export interface MoveColumnParams {
    /**
     * The transaction to apply the column move operation to.
     */
    tr: PmTransaction;

    /**
     * The zero-based index of the column to move.
     */
    originIndex: number;

    /**
     * The zero-based index of the target position where the column should be moved to.
     */
    targetIndex: number;

    /**
     * Whether to select the moved column after the operation completes.
     */
    select: boolean;

    /**
     * A position within the table. Used to locate the table node in the document.
     */
    pos: number;
}

/**
 * Moves a column from the origin index to the target index within a table.
 *
 * This function handles column movement by:
 * 1. Finding the table at the given position
 * 2. Determining the full range of columns to move (accounting for merged cells)
 * 3. Performing the move operation by transposing the table, moving rows, and transposing back
 * 4. Optionally selecting the moved column
 *
 * @param moveColParams - The parameters for the column move operation.
 * @param moveColParams.tr - The transaction to apply changes to.
 * @param moveColParams.originIndex - The zero-based index of the column to move.
 * @param moveColParams.targetIndex - The zero-based index of the target position.
 * @param moveColParams.select - Whether to select the moved column after the operation.
 * @param moveColParams.pos - A position within the table to locate it in the document.
 * @returns `true` if the column was successfully moved, `false` otherwise.
 */
export function moveColumn(moveColParams: MoveColumnParams): boolean {
    const {tr, originIndex, targetIndex, select, pos} = moveColParams;

    const table: FindNodeResult = findTableAtPosition(tr, pos);
    if (!table) {
        return false;
    }

    const columnRanges = getColumnRanges(tr, originIndex, targetIndex);
    if (!columnRanges) {
        return false;
    }

    const {originIndexes, targetIndexes} = columnRanges;

    // Prevent moving a column onto itself (when origin overlaps with target)
    if (originIndexes.includes(targetIndex)) {
        return false;
    }

    const newTable: PmNode = moveTableColumn(table.node, originIndexes, targetIndexes);
    tr.replaceWith(table.pos, table.pos + table.node.nodeSize, newTable);

    if (select) {
        selectMovedColumn(tr, newTable, table.start, targetIndex);
    }

    return true;
}

/**
 * Finds the table node at the given position in the document.
 *
 * @param tr - The transaction containing the document.
 * @param pos - A position within the table.
 * @returns The table node result, or `null` if no table is found.
 */
function findTableAtPosition(tr: PmTransaction, pos: number): FindNodeResult | null {
    const $pos: ResolvedPos = tr.doc.resolve(pos);
    return findTable($pos);
}

/**
 * Retrieves the column index ranges for both origin and target columns,
 * accounting for merged cells (colspan).
 *
 * @param transaction - The transaction containing the current selection.
 * @param originIndex - The origin column index.
 * @param targetIndex - The target column index.
 * @returns An object with `originIndexes` and `targetIndexes`, or `null` if ranges cannot be determined.
 */
function getColumnRanges(transaction: PmTransaction,
                         originIndex: number,
                         targetIndex: number): { originIndexes: Array<number>; targetIndexes: Array<number> } | null {
    const originRange: CellSelectionRange = getSelectionRangeInColumn(transaction, originIndex);
    const targetRange: CellSelectionRange = getSelectionRangeInColumn(transaction, targetIndex);

    if (!originRange?.indexes || !targetRange?.indexes) {
        return null;
    }

    return {
        originIndexes: originRange.indexes,
        targetIndexes: targetRange.indexes,
    };
}

/**
 * Selects the entire column at the specified index after a move operation.
 *
 * @param transaction - The transaction to apply the selection to.
 * @param table - The table node containing the column.
 * @param tableStart - The start position of the table in the document.
 * @param columnIndex - The zero-based index of the column to select.
 */
function selectMovedColumn(transaction: PmTransaction,
                           table: PmNode,
                           tableStart: number,
                           columnIndex: number): void {
    const map: TableMap = TableMap.get(table);

    const firstCellPos: number = map.positionAt(0, columnIndex, table);
    const lastCellPos: number = map.positionAt(map.height - 1, columnIndex, table);

    const $firstCell: ResolvedPos = transaction.doc.resolve(tableStart + firstCellPos);
    const $lastCell: ResolvedPos = transaction.doc.resolve(tableStart + lastCellPos);

    transaction.setSelection(CellSelection.colSelection($lastCell, $firstCell));
}

/**
 * Moves columns within a table node by converting to a row-based matrix,
 * transposing to treat columns as rows, performing the move, and transposing back.
 *
 * This approach leverages the existing row-moving logic by:
 * 1. Converting the table to a 2D array of rows
 * 2. Transposing so columns become rows
 * 3. Applying the row move operation
 * 4. Transposing back to restore the original orientation
 * 5. Rebuilding the table node from the modified array
 *
 * @param table - The table node to modify.
 * @param originIndexes - Array of column indexes to move (supports merged cells).
 * @param targetIndexes - Array of target column indexes.
 * @returns A new table node with the columns moved.
 */
function moveTableColumn(table: PmNode,
                         originIndexes: Array<number>,
                         targetIndexes: Array<number>): PmNode {
    // Convert table to 2D array of rows
    const tableAsRows: TableCellMatrix = convertTableNodeToArrayOfRows(table);

    // Transpose so columns become rows (transpose returns new mutable arrays)
    const transposed: Array<Array<PmNode>> = transpose(tableAsRows);

    // Move the "rows" (which are actually columns due to transpose)
    const movedColumns: Array<Array<PmNode>> = moveRowInArrayOfRows(transposed, originIndexes, targetIndexes, 0);

    // Transpose back to restore row/column orientation
    const restoredRows: Array<Array<PmNode>> = transpose(movedColumns);

    return convertArrayOfRowsToTableNode(table, restoredRows);
}
