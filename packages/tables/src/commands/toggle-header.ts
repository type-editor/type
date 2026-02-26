import type {PmEditorState, PmTransaction} from '@type-editor/editor-types';
import type {NodeType, PmNode} from '@type-editor/model';
import type {Command, DispatchFunction} from '@type-editor/editor-types';

import {tableNodeTypes} from '../schema';
import type {TableRect} from '../types/commands/TableRect';
import type {ToggleHeaderOptions} from '../types/commands/ToggleHeaderOptions';
import type {ToggleHeaderType} from '../types/commands/ToggleHeaderType';
import {isInTable} from '../utils/is-in-table';
import {selectedRect} from './selected-rect';


/**
 * Represents a rectangular region within a table.
 */
interface CellsRect {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

/**
 * Record of table-related node types from the schema.
 */
type TableNodeTypes = Record<'table' | 'row' | 'cell' | 'header_cell', NodeType>;


/**
 * Toggles between row/column header and normal cells.
 *
 * The behavior depends on the `type` parameter:
 * - `'row'`: Toggles the first row between header and regular cells
 * - `'column'`: Toggles the first column between header and regular cells
 * - `'cell'`: Toggles the currently selected cells
 *
 * When `useSelectedRowColumn` is true and type is 'row' or 'column',
 * the command toggles the selected row/column instead of the first one.
 *
 * @param type - The type of header to toggle: 'column', 'row', or 'cell'
 * @param options - Optional configuration object
 * @returns A ProseMirror command that toggles headers
 *
 * @example
 * // Toggle first row as header
 * toggleHeader('row')
 *
 * @example
 * // Toggle selected column as header
 * toggleHeader('column', { useSelectedRowColumn: true })
 */
export function toggleHeader(type: ToggleHeaderType,
                             options: ToggleHeaderOptions = {}): Command {
    return function (state: PmEditorState, dispatch: DispatchFunction): boolean {
        if (!isInTable(state)) {
            return false;
        }

        if (dispatch) {
            const types: TableNodeTypes = tableNodeTypes(state.schema);
            const rect: TableRect = selectedRect(state);
            const transaction: PmTransaction = state.transaction;

            if (options.useSelectedRowColumn && (type === 'row' || type === 'column')) {
                // Toggle the selected row or column
                const cellsRect: CellsRect = createSelectedRowColumnRect(type, rect);
                toggleCellsInRect(cellsRect, rect, transaction, types);
            } else if (type === 'cell') {
                // Toggle the currently selected cells
                toggleCellsInRect(rect, rect, transaction, types);
            } else {
                // Toggle the first row or column
                // Skip the intersection cell if the perpendicular header is enabled
                const perpendicularType: 'row' | 'column' = type === 'column' ? 'row' : 'column';
                const skipIntersection: boolean = isHeaderEnabledByType(perpendicularType, rect, types);
                const cellsRect: CellsRect = createFirstRowColumnRect(type, rect, skipIntersection);
                toggleCellsInRect(cellsRect, rect, transaction, types);
            }

            dispatch(transaction);
        }
        return true;
    };
}


/**
 * Toggles cell types in the specified rectangular region.
 *
 * If any cell in the region is a header cell, all cells are converted to regular cells.
 * Otherwise, all cells are converted to header cells.
 *
 * @param cellsRect - The rectangular region containing cells to toggle
 * @param rect - The table rectangle containing map, table, and tableStart position
 * @param transaction - The ProseMirror transaction to apply changes to
 * @param types - Record of node types from the schema
 */
function toggleCellsInRect(cellsRect: CellsRect,
                           rect: TableRect,
                           transaction: PmTransaction,
                           types: TableNodeTypes): void {
    const cellPositions: Array<number> = rect.map.cellsInRect(cellsRect);

    const hasHeaderCells: boolean = cellPositions.some((pos: number): boolean => {
        const cell: PmNode = rect.table.nodeAt(pos);
        return cell?.type === types.header_cell;
    });

    const newType: NodeType = hasHeaderCells ? types.cell : types.header_cell;

    // Process cells in reverse order to avoid position shifting issues
    // when setNodeMarkup modifies the document
    for (let i = cellPositions.length - 1; i >= 0; i--) {
        const cellPos: number = cellPositions[i] + rect.tableStart;
        const cell: PmNode = transaction.doc.nodeAt(cellPos);

        if (cell) {
            transaction.setNodeMarkup(cellPos, newType, cell.attrs);
        }
    }
}

/**
 * Creates a CellsRect for the selected row or column.
 *
 * @param type - Whether to create rect for 'row' or 'column'
 * @param rect - The table rectangle containing selection information
 * @returns A CellsRect covering the entire selected row or column
 */
function createSelectedRowColumnRect(type: 'row' | 'column', rect: TableRect): CellsRect {
    if (type === 'column') {
        return {
            left: rect.left,
            top: 0,
            right: rect.right,
            bottom: rect.map.height,
        };
    }
    return {
        left: 0,
        top: rect.top,
        right: rect.map.width,
        bottom: rect.bottom,
    };
}

/**
 * Creates a CellsRect for the first row or column, optionally skipping
 * the intersection cell if the perpendicular header is enabled.
 *
 * @param type - Whether to create rect for 'row' or 'column'
 * @param rect - The table rectangle containing map dimensions
 * @param skipIntersection - If true, starts at index 1 to skip the corner cell
 * @returns A CellsRect covering the first row or column
 */
function createFirstRowColumnRect(type: 'row' | 'column',
                                  rect: TableRect,
                                  skipIntersection: boolean): CellsRect {
    const startOffset: number = skipIntersection ? 1 : 0;

    if (type === 'column') {
        return {
            left: 0,
            top: startOffset,
            right: 1,
            bottom: rect.map.height,
        };
    }
    return {
        left: startOffset,
        top: 0,
        right: rect.map.width,
        bottom: 1,
    };
}

/**
 * Checks if the first row or column of a table contains only header cells.
 *
 * This is used to determine whether a header row/column is currently enabled,
 * which affects whether the corner cell should be skipped when toggling
 * the perpendicular header.
 *
 * @param type - Whether to check the first 'row' or first 'column'
 * @param rect - The table rectangle containing map and table node
 * @param types - Record of node types from the schema
 * @returns True if all cells in the first row/column are header cells
 */
function isHeaderEnabledByType(type: 'row' | 'column',
                               rect: TableRect,
                               types: TableNodeTypes): boolean {
    const cellsRect: CellsRect = {
        left: 0,
        top: 0,
        right: type === 'row' ? rect.map.width : 1,
        bottom: type === 'column' ? rect.map.height : 1,
    };

    const cellPositions: Array<number> = rect.map.cellsInRect(cellsRect);

    for (const pos of cellPositions) {
        const cell: PmNode = rect.table.nodeAt(pos);
        if (cell?.type !== types.header_cell) {
            return false;
        }
    }

    return true;
}
