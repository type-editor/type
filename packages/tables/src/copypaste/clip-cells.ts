import {Fragment, type PmNode} from '@type-editor/model';

import type {CellAttrs} from '../types/CellAttrs';
import type {Area} from '../types/copypaste/Area';
import {removeColSpan} from '../utils/remove-col-span';


/**
 * Clips or extends (repeats) a set of cells to cover the given dimensions.
 *
 * This function adjusts the cell area to match the target width and height:
 * - If the area is smaller, cells are repeated to fill the space
 * - If the area is larger, cells are clipped
 * - Cells with rowspan/colspan that extend beyond boundaries are trimmed
 *
 * @param area - The original area containing width, height, and rows.
 * @param newWidth - The target width (number of columns).
 * @param newHeight - The target height (number of rows).
 * @returns A new {@link Area} with the adjusted dimensions.
 *
 * @example
 * ```typescript
 * // Clip a 3x3 area to 2x2
 * const clipped = clipCells(originalArea, 2, 2);
 *
 * // Extend a 2x2 area to 4x4 by repeating
 * const extended = clipCells(originalArea, 4, 4);
 * ```
 */
export function clipCells({width, height, rows}: Area,
                          newWidth: number,
                          newHeight: number): Area {
    if (width !== newWidth) {
        const result: { rows: Array<Fragment> } = adjustColumnsWidth(rows, newWidth);
        rows = result.rows;
        width = newWidth;
    }

    if (height !== newHeight) {
        const result: { rows: Array<Fragment> } = adjustRowsHeight(rows, height, newHeight);
        rows = result.rows;
        height = newHeight;
    }

    return {width, height, rows};
}

/**
 * Adjusts rows to match a new column width by repeating or clipping cells.
 *
 * @param rows - The original row fragments.
 * @param newWidth - The target width.
 * @returns Object containing the adjusted rows.
 */
function adjustColumnsWidth(rows: Array<Fragment>, newWidth: number): { rows: Array<Fragment> } {
    // Track how many columns have been added by cells with rowspan > 1
    const addedByRowspan: Array<number> = [];
    const newRows: Array<Fragment> = [];

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const sourceRow: Fragment = rows[rowIndex];
        const cellsForRow: Array<PmNode> = [];

        // Start from the column position already filled by rowspan cells
        let currentCol: number = addedByRowspan[rowIndex] || 0;
        let cellIndex = 0;

        while (currentCol < newWidth) {
            // Wrap around to repeat cells if needed
            let cell: PmNode = sourceRow.child(cellIndex % sourceRow.childCount);
            const colspan: number = cell.attrs.colspan as number;
            const rowspan: number = cell.attrs.rowspan as number;

            // Clip colspan if it extends beyond the target width
            if (currentCol + colspan > newWidth) {
                const excessCols = currentCol + colspan - newWidth;
                cell = cell.type.createChecked(
                    removeColSpan(cell.attrs as CellAttrs, colspan, excessCols),
                    cell.content,
                );
            }

            cellsForRow.push(cell);
            currentCol += cell.attrs.colspan as number;

            // Account for this cell's rowspan in subsequent rows
            for (let r = 1; r < rowspan; r++) {
                const targetRow = rowIndex + r;
                addedByRowspan[targetRow] = (addedByRowspan[targetRow] || 0) + (cell.attrs.colspan as number);
            }

            cellIndex++;
        }

        newRows.push(Fragment.from(cellsForRow));
    }

    return {rows: newRows};
}

/**
 * Adjusts rows to match a new height by repeating or clipping rows.
 *
 * @param rows - The original row fragments.
 * @param originalHeight - The current height of the area.
 * @param newHeight - The target height.
 * @returns Object containing the adjusted rows.
 */
function adjustRowsHeight(rows: Array<Fragment>,
                          originalHeight: number,
                          newHeight: number): { rows: Array<Fragment> } {
    const newRows: Array<Fragment> = [];

    for (let rowIndex = 0; rowIndex < newHeight; rowIndex++) {
        // Wrap around to repeat rows if needed
        const sourceRow: Fragment = rows[rowIndex % originalHeight];
        const cellsForRow: Array<PmNode> = [];

        for (let cellIndex = 0; cellIndex < sourceRow.childCount; cellIndex++) {
            let cell: PmNode = sourceRow.child(cellIndex);
            const rowspan: number = cell.attrs.rowspan as number;

            // Clip rowspan if it extends beyond the target height
            if (rowIndex + rowspan > newHeight) {
                cell = cell.type.create(
                    {
                        ...cell.attrs,
                        rowspan: Math.max(1, newHeight - rowIndex),
                    },
                    cell.content,
                );
            }

            cellsForRow.push(cell);
        }

        newRows.push(Fragment.from(cellsForRow));
    }

    return {rows: newRows};
}
