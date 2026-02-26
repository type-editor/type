import type {PmTransaction} from '@type-editor/editor-types';
import type {PmNode, ResolvedPos} from '@type-editor/model';

import {CellSelection} from '../cellselection/CellSelection';
import {TableMap} from '../tablemap/TableMap';
import {convertArrayOfRowsToTableNode, convertTableNodeToArrayOfRows} from './convert';
import {moveRowInArrayOfRows} from './move-row-in-array-of-rows';
import {type FindNodeResult, findTable} from './query';
import {type CellSelectionRange, getSelectionRangeInRow} from './selection-range';

/**
 * Parameters for moving a row within a table.
 */
export interface MoveRowParams {
    /**
     * The transaction to apply the row move operation to.
     */
    transaction: PmTransaction;

    /**
     * The zero-based index of the row to move.
     */
    originIndex: number;

    /**
     * The zero-based index of the target position where the row should be moved to.
     */
    targetIndex: number;

    /**
     * Whether to select the moved row after the operation completes.
     */
    select: boolean;

    /**
     * A document position within the table. Used to locate the table node.
     */
    pos: number;
}

/**
 * Moves a table row from one position to another within the same table.
 *
 * This function handles complex scenarios including:
 * - Moving rows that are part of merged cells (rowspan)
 * - Preserving cell content and attributes during the move
 * - Optionally selecting the moved row after the operation
 *
 * The function will fail (return `false`) if:
 * - The position is not within a table
 * - Either the origin or target row cannot be resolved
 * - The target row is part of the same merged cell group as the origin row
 *
 * @param params - The parameters for the row move operation.
 * @param params.transaction - The transaction to apply the row move operation to.
 * @param params.originIndex - The zero-based index of the row to move.
 * @param params.targetIndex - The zero-based index of the target position.
 * @param params.select - Whether to select the moved row after the operation.
 * @param params.pos - A document position within the table.
 * @returns `true` if the row was successfully moved, `false` otherwise.
 *
 * @example
 * ```typescript
 * // Move row at index 2 to position 0 (top of table)
 * const success = moveRow({
 *   tr: state.transaction,
 *   originIndex: 2,
 *   targetIndex: 0,
 *   select: true,
 *   pos: tablePos
 * });
 * ```
 */
export function moveRow(params: MoveRowParams): boolean {
    const {transaction, originIndex, targetIndex, select, pos} = params;

    const table: FindNodeResult = findTableAtPosition(transaction, pos);
    if (!table) {
        return false;
    }

    const rowRanges: RowRanges = getRowRanges(transaction, originIndex, targetIndex);
    if (!rowRanges) {
        return false;
    }

    const {originRowIndexes, targetRowIndexes} = rowRanges;

    if (isOriginOverlappingTarget(originRowIndexes, targetIndex)) {
        return false;
    }

    const newTable: PmNode = createTableWithMovedRow(table.node, originRowIndexes, targetRowIndexes);
    transaction.replaceWith(table.pos, table.pos + table.node.nodeSize, newTable);

    if (select) {
        selectMovedRow(transaction, newTable, table.start, targetIndex);
    }

    return true;
}

/**
 * Finds the table node at the given document position.
 *
 * @param transaction - The transaction containing the document.
 * @param pos - The document position to resolve.
 * @returns The table node result if found, `null` otherwise.
 */
function findTableAtPosition(transaction: PmTransaction, pos: number): FindNodeResult | null {
    const $pos: ResolvedPos = transaction.doc.resolve(pos);
    return findTable($pos);
}

/**
 * Result of resolving row ranges for both origin and target rows.
 */
interface RowRanges {
    /**
     * Array of row indexes that make up the origin row (including merged cell spans).
     */
    originRowIndexes: Array<number>;

    /**
     * Array of row indexes that make up the target row (including merged cell spans).
     */
    targetRowIndexes: Array<number>;
}

/**
 * Resolves the complete row ranges for both origin and target positions.
 *
 * This handles merged cells by returning all row indexes that are part of the
 * cell's rowspan.
 *
 * @param transaction - The transaction containing the current selection.
 * @param originIndex - The origin row index.
 * @param targetIndex - The target row index.
 * @returns The row ranges if both could be resolved, `null` otherwise.
 */
function getRowRanges(transaction: PmTransaction,
                      originIndex: number,
                      targetIndex: number): RowRanges | null {
    // Handle invalid indices gracefully - negative indices or out-of-bounds
    // will cause getSelectionRangeInRow to throw or return undefined
    try {
        const originRange: CellSelectionRange | undefined = getSelectionRangeInRow(transaction, originIndex);
        const targetRange: CellSelectionRange | undefined = getSelectionRangeInRow(transaction, targetIndex);

        if (!originRange?.indexes || !targetRange?.indexes) {
            return null;
        }

        return {
            originRowIndexes: originRange.indexes,
            targetRowIndexes: targetRange.indexes,
        };
    } catch {
        // Invalid indices (negative, out of bounds, etc.) cause errors in getSelectionRangeInRow
        return null;
    }
}

/**
 * Checks if the origin row range overlaps with the target position.
 *
 * This prevents moving a row to a position within its own merged cell group.
 *
 * @param originRowIndexes - The indexes of the origin row range.
 * @param targetIndex - The target row index.
 * @returns `true` if the target is within the origin range, `false` otherwise.
 */
function isOriginOverlappingTarget(originRowIndexes: Array<number>, targetIndex: number): boolean {
    return originRowIndexes.includes(targetIndex);
}

/**
 * Creates a new table node with the specified row moved to a new position.
 *
 * @param tableNode - The original table node.
 * @param originRowIndexes - The indexes of the rows to move.
 * @param targetRowIndexes - The indexes of the target position.
 * @returns A new table node with the row moved.
 */
function createTableWithMovedRow(tableNode: PmNode,
                                 originRowIndexes: Array<number>,
                                 targetRowIndexes: Array<number>): PmNode {
    const immutableRows: ReadonlyArray<ReadonlyArray<PmNode | null>> = convertTableNodeToArrayOfRows(tableNode);
    // Create a mutable copy since moveRowInArrayOfRows mutates the array
    const rows: Array<Array<PmNode>> = immutableRows.map((row: Array<PmNode>): Array<PmNode> => [...row]);
    const reorderedRows: Array<Array<PmNode>> = moveRowInArrayOfRows(rows, originRowIndexes, targetRowIndexes, 0);
    return convertArrayOfRowsToTableNode(tableNode, reorderedRows);
}

/**
 * Selects the moved row in the table.
 *
 * @param transaction - The transaction to set the selection on.
 * @param table - The new table node after the move operation.
 * @param tableStart - The start position of the table in the document.
 * @param rowIndex - The index of the row to select.
 */
function selectMovedRow(transaction: PmTransaction,
                        table: PmNode,
                        tableStart: number,
                        rowIndex: number): void {
    const map: TableMap = TableMap.get(table);

    const firstCellPos: number = map.positionAt(rowIndex, 0, table);
    const lastCellPos: number = map.positionAt(rowIndex, map.width - 1, table);

    const $firstCell: ResolvedPos = transaction.doc.resolve(tableStart + firstCellPos);
    const $lastCell: ResolvedPos = transaction.doc.resolve(tableStart + lastCellPos);

    transaction.setSelection(CellSelection.rowSelection($lastCell, $firstCell));
}
