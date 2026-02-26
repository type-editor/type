import type {PmSelection, PmTransaction} from '@type-editor/editor-types';
import type {ResolvedPos} from '@type-editor/model';

import {getCellsInColumn, getCellsInRow} from './get-cells';
import type {FindNodeResult} from './query';

/**
 * Represents a rectangular selection range within a table.
 *
 * This interface describes the anchor and head positions for a cell selection,
 * along with the indexes of all columns or rows included in the selection.
 */
export interface CellSelectionRange {
    /**
     * The resolved position of the selection anchor (where the selection started).
     */
    $anchor: ResolvedPos;

    /**
     * The resolved position of the selection head (where the selection ended).
     */
    $head: ResolvedPos;

    /**
     * An array of column or row indexes included in the selection.
     * For column selections, these are column indexes; for row selections, these are row indexes.
     */
    indexes: Array<number>;
}

/**
 * Configuration for selection range calculations.
 * Abstracts the differences between column and row selection operations.
 */
interface SelectionRangeConfig {
    /**
     * The attribute name used for spanning (colspan for columns, rowspan for rows).
     */
    spanAttr: 'colspan' | 'rowspan';

    /**
     * Function to retrieve cells at the given index.
     */
    getCellsAtIndex: (index: number, selection: PmSelection) => Array<FindNodeResult> | undefined;

    /**
     * Function to retrieve cells in the perpendicular direction.
     * For column selection, this gets cells in the first row.
     * For row selection, this gets cells in the first column.
     */
    getPerpendicularCells: (selection: PmSelection) => Array<FindNodeResult> | undefined;
}

/**
 * Cache for storing retrieved cells by index.
 * Used to avoid redundant calls to getCellsAtIndex during range expansion.
 */
type CellCache = Map<number, Array<FindNodeResult> | undefined>;

/**
 * Creates a cached version of the getCellsAtIndex function.
 * This prevents redundant table map lookups and cell retrievals.
 *
 * @param getCellsAtIndex - The original function to retrieve cells.
 * @param selection - The current editor selection.
 * @returns A function that caches results and a reference to the cache.
 */
function createCachedCellGetter(getCellsAtIndex: (index: number, selection: PmSelection) => Array<FindNodeResult> | undefined,
                                selection: PmSelection): {
    getCells: (index: number) => Array<FindNodeResult> | undefined;
    cache: CellCache;
} {
    const cache: CellCache = new Map();

    const getCells = (index: number): Array<FindNodeResult> | undefined => {
        if (cache.has(index)) {
            return cache.get(index);
        }
        const cells = getCellsAtIndex(index, selection);
        cache.set(index, cells);
        return cells;
    };

    return {getCells, cache};
}

/**
 * Expands the selection range to include all merged cells that overlap with the selection.
 *
 * This function implements a two-pass algorithm:
 * 1. First pass: Scan backwards from startIndex to find cells that span into the selection
 * 2. Second pass: Scan forwards to include any cells that extend beyond the current end
 *
 * @param startIndex - The starting column/row index.
 * @param endIndex - The ending column/row index.
 * @param spanAttr - The attribute name for spanning ('colspan' or 'rowspan').
 * @param getCells - Cached function to retrieve cells at the given index.
 * @returns A tuple of [expandedStartIndex, expandedEndIndex].
 */
function expandRangeForMergedCells(startIndex: number,
                                   endIndex: number,
                                   spanAttr: 'colspan' | 'rowspan',
                                   getCells: (index: number) => Array<FindNodeResult> | undefined): [number, number] {
    let expandedStart: number = startIndex;
    let expandedEnd: number = endIndex;

    // First pass: Look backwards to find the true start
    // Check if any cells before startIndex span into our selection
    for (let i = startIndex; i >= 0; i--) {
        const cells: Array<FindNodeResult> = getCells(i);
        if (!cells) {
            continue;
        }

        for (const cell of cells) {
            const span = cell.node.attrs[spanAttr] as number;
            const cellEndIndex: number = span + i - 1;

            // If this cell spans into or past our start, we need to include it
            if (cellEndIndex >= expandedStart) {
                expandedStart = i;
            }

            // Also check if it extends our end
            if (cellEndIndex > expandedEnd) {
                expandedEnd = cellEndIndex;
            }
        }
    }

    // Second pass: Look forwards to find any cells that extend beyond our current end
    for (let i = startIndex; i <= expandedEnd; i++) {
        const cells: Array<FindNodeResult> = getCells(i);
        if (!cells) {
            continue;
        }

        for (const cell of cells) {
            const span = cell.node.attrs[spanAttr] as number;
            if (span > 1) {
                const cellEndIndex: number = span + i - 1;
                if (cellEndIndex > expandedEnd) {
                    expandedEnd = cellEndIndex;
                }
            }
        }
    }

    return [expandedStart, expandedEnd];
}

/**
 * Filters out indexes that have no cells (due to spanning in perpendicular direction).
 *
 * In tables with merged cells, some column/row indexes may not have any cells
 * because all cells in that index are covered by spans from adjacent cells.
 *
 * @param startIndex - The starting index of the range.
 * @param endIndex - The ending index of the range.
 * @param getCells - Cached function to retrieve cells at a given index.
 * @returns An array of indexes that contain at least one cell.
 */
function filterValidIndexes(startIndex: number,
                            endIndex: number,
                            getCells: (index: number) => Array<FindNodeResult> | undefined): Array<number> {
    const indexes: Array<number> = [];

    for (let i = startIndex; i <= endIndex; i++) {
        const cells: Array<FindNodeResult> = getCells(i);
        if (cells && cells.length > 0) {
            indexes.push(i);
        }
    }

    return indexes;
}

/**
 * Finds the head cell for the selection by looking for a cell that appears
 * in both the end column/row and the first row/column.
 *
 * The head cell is used to define the opposite corner of the rectangular selection
 * from the anchor cell.
 *
 * @param startIndex - The starting index of the filtered range.
 * @param endIndex - The ending index of the filtered range.
 * @param getCells - Cached function to retrieve cells at a given index.
 * @param perpendicularCells - Cells in the perpendicular direction (first row/column).
 * @returns The head cell if found, undefined otherwise.
 */
function findHeadCell(startIndex: number,
                      endIndex: number,
                      getCells: (index: number) => Array<FindNodeResult> | undefined,
                      perpendicularCells: Array<FindNodeResult>): FindNodeResult | undefined {
    // Search from endIndex backwards to find a cell that intersects with perpendicular cells
    for (let i = endIndex; i >= startIndex; i--) {
        const cells: Array<FindNodeResult> = getCells(i);
        if (!cells || cells.length === 0) {
            continue;
        }

        const firstCellInLine: FindNodeResult = cells[0];

        // Check if this cell appears in the perpendicular first row/column
        for (let j = perpendicularCells.length - 1; j >= 0; j--) {
            if (perpendicularCells[j].pos === firstCellInLine.pos) {
                return firstCellInLine;
            }
        }
    }

    return undefined;
}

/**
 * Generic implementation for calculating a selection range in a table.
 *
 * This function handles the common logic for both column and row selection:
 * 1. Expands the range to include all merged cells
 * 2. Filters out empty indexes (covered by spans)
 * 3. Determines anchor and head positions for the selection
 *
 * @param transaction - The ProseMirror transaction containing the current document state.
 * @param startIndex - The starting column/row index.
 * @param endIndex - The ending column/row index.
 * @param config - Configuration object specifying column or row behavior.
 * @returns The cell selection range, or undefined if the selection cannot be determined.
 */
function getSelectionRangeInternal(transaction: PmTransaction,
                                   startIndex: number,
                                   endIndex: number,
                                   config: SelectionRangeConfig): CellSelectionRange | undefined {
    const selection: PmSelection = transaction.selection;

    // Normalize indices: ensure startIndex <= endIndex
    const normalizedStart: number = Math.min(startIndex, endIndex);
    const normalizedEnd: number = Math.max(startIndex, endIndex);

    // Create cached cell getter to avoid redundant lookups
    const {getCells} = createCachedCellGetter(config.getCellsAtIndex, selection);

    // Expand the range to account for merged cells
    const [expandedStart, expandedEnd] = expandRangeForMergedCells(
        normalizedStart,
        normalizedEnd,
        config.spanAttr,
        getCells
    );

    // Filter out indexes that don't contain any cells
    const indexes: Array<number> = filterValidIndexes(
        expandedStart,
        expandedEnd,
        getCells
    );

    if (indexes.length === 0) {
        return undefined;
    }

    const finalStartIndex: number = indexes[0];
    const finalEndIndex: number = indexes[indexes.length - 1];

    // Get anchor cell (last cell in the first selected column/row)
    // This will use the cache, so no additional lookup is needed
    const firstSelectedCells: Array<FindNodeResult> = getCells(finalStartIndex);
    if (!firstSelectedCells || firstSelectedCells.length === 0) {
        return undefined;
    }

    const $anchor: ResolvedPos = transaction.doc.resolve(
        firstSelectedCells[firstSelectedCells.length - 1].pos
    );

    // Get perpendicular cells (first row for column selection, first column for row selection)
    const perpendicularCells: Array<FindNodeResult> = config.getPerpendicularCells(selection);
    if (!perpendicularCells) {
        return undefined;
    }

    // Find the head cell
    const headCell: FindNodeResult = findHeadCell(finalStartIndex, finalEndIndex, getCells, perpendicularCells);
    if (!headCell) {
        return undefined;
    }

    const $head: ResolvedPos = transaction.doc.resolve(headCell.pos);

    return {
        $anchor,
        $head,
        indexes
    };
}

/**
 * Returns a range of rectangular selection spanning all merged cells around a
 * column at the specified index.
 *
 * This function calculates the complete selection range needed to select entire
 * columns, taking into account cells that span multiple columns. When a cell
 * spans across the selection boundary, the selection is automatically expanded
 * to include all columns covered by that cell.
 *
 * Original implementation from Atlassian (Apache License 2.0)
 * @see https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/5f91cb871e8248bc3bae5ddc30bb9fd9200fadbb/editor/editor-tables/src/utils/get-selection-range-in-column.ts
 *
 * @param transaction - The ProseMirror transaction containing the current document state
 *                      and selection information.
 * @param startColIndex - The zero-based index of the first column to include in the selection.
 *                        Must be a non-negative integer.
 * @param endColIndex - The zero-based index of the last column to include in the selection.
 *                      Defaults to `startColIndex` for single-column selection.
 *                      Must be greater than or equal to `startColIndex`.
 * @returns A {@link CellSelectionRange} object containing the anchor and head positions
 *          for the selection, along with all column indexes included. Returns `undefined`
 *          if the selection cannot be determined (e.g., invalid indexes or no table found).
 *
 * @example
 * ```typescript
 * // Select a single column
 * const range = getSelectionRangeInColumn(tr, 2);
 *
 * // Select multiple columns
 * const multiRange = getSelectionRangeInColumn(tr, 1, 3);
 *
 * if (range) {
 *     const cellSelection = CellSelection.create(tr.doc, range.$anchor.pos, range.$head.pos);
 *     tr.setSelection(cellSelection);
 * }
 * ```
 */
export function getSelectionRangeInColumn(transaction: PmTransaction,
                                          startColIndex: number,
                                          endColIndex: number = startColIndex): CellSelectionRange | undefined {
    const config: SelectionRangeConfig = {
        spanAttr: 'colspan',
        getCellsAtIndex: getCellsInColumn,
        getPerpendicularCells: (selection: PmSelection): Array<FindNodeResult> => getCellsInRow(0, selection)
    };

    return getSelectionRangeInternal(transaction, startColIndex, endColIndex, config);
}

/**
 * Returns a range of rectangular selection spanning all merged cells around a
 * row at the specified index.
 *
 * This function calculates the complete selection range needed to select entire
 * rows, taking into account cells that span multiple rows. When a cell spans
 * across the selection boundary, the selection is automatically expanded to
 * include all rows covered by that cell.
 *
 * Original implementation from Atlassian (Apache License 2.0)
 * @see https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/5f91cb871e8248bc3bae5ddc30bb9fd9200fadbb/editor/editor-tables/src/utils/get-selection-range-in-row.ts
 *
 * @param transaction - The ProseMirror transaction containing the current document state
 *                      and selection information.
 * @param startRowIndex - The zero-based index of the first row to include in the selection.
 *                        Must be a non-negative integer.
 * @param endRowIndex - The zero-based index of the last row to include in the selection.
 *                      Defaults to `startRowIndex` for single-row selection.
 *                      Must be greater than or equal to `startRowIndex`.
 * @returns A {@link CellSelectionRange} object containing the anchor and head positions
 *          for the selection, along with all row indexes included. Returns `undefined`
 *          if the selection cannot be determined (e.g., invalid indexes or no table found).
 *
 * @example
 * ```typescript
 * // Select a single row
 * const range = getSelectionRangeInRow(tr, 0);
 *
 * // Select multiple rows
 * const multiRange = getSelectionRangeInRow(tr, 1, 4);
 *
 * if (range) {
 *     const cellSelection = CellSelection.create(tr.doc, range.$anchor.pos, range.$head.pos);
 *     tr.setSelection(cellSelection);
 * }
 * ```
 */
export function getSelectionRangeInRow(transaction: PmTransaction,
                                       startRowIndex: number,
                                       endRowIndex: number = startRowIndex): CellSelectionRange | undefined {
    const config: SelectionRangeConfig = {
        spanAttr: 'rowspan',
        getCellsAtIndex: getCellsInRow,
        getPerpendicularCells: (selection: PmSelection): Array<FindNodeResult> => getCellsInColumn(0, selection)
    };

    return getSelectionRangeInternal(transaction, startRowIndex, endRowIndex, config);
}
