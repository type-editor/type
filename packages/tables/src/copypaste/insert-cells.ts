import {isUndefinedOrNull} from '@type-editor/commons';
import type {PmEditorState, PmTransaction} from '@type-editor/editor-types';
import type {DispatchFunction} from '@type-editor/editor-types';
import {Fragment, type NodeType, type PmNode, type Schema, Slice} from '@type-editor/model';

import {CellSelection} from '../cellselection/CellSelection';
import {tableNodeTypes} from '../schema';
import {TableMap} from '../tablemap/TableMap';
import type {CellAttrs} from '../types/CellAttrs';
import type {Area} from '../types/copypaste/Area';
import {type Rect} from '../types/tablemap/Rect';
import {removeColSpan} from '../utils/remove-col-span';


/**
 * Inserts a rectangular area of cells into a table at a specified position.
 *
 * This function handles the complete process of pasting cells into a table:
 * 1. Grows the table if necessary to accommodate the pasted cells
 * 2. Splits any cells that span across the insertion boundaries
 * 3. Replaces the cells in the target area with the pasted cells
 * 4. Sets the selection to cover the newly inserted cells
 *
 * The cells parameter should be obtained from {@link pastedCells}, which normalizes
 * clipboard content into a rectangular area.
 *
 * @param state - The current editor state.
 * @param dispatch - The dispatch function to apply the transaction.
 * @param tableStart - The document position where the table content starts (after the table node opening).
 * @param rect - The target rectangle within the table, defining where to insert cells (only `top` and `left` are used).
 * @param cells - The rectangular area of cells to insert (as returned by {@link pastedCells}).
 * @throws {Error} If no table is found at the specified position.
 *
 * @example
 * ```typescript
 * const cells = pastedCells(clipboardSlice);
 * if (cells) {
 *   insertCells(state, dispatch, tableStart, {left: 0, top: 0, right: 0, bottom: 0}, cells);
 * }
 * ```
 */
export function insertCells(state: PmEditorState,
                            dispatch: DispatchFunction,
                            tableStart: number,
                            rect: Rect,
                            cells: Area): void {
    let table: PmNode = tableStart ? state.doc.nodeAt(tableStart - 1) : state.doc;
    if (!table) {
        throw new Error('No table found');
    }

    let map: TableMap = TableMap.get(table);
    const {top, left} = rect;
    const right: number = left + cells.width;
    const bottom: number = top + cells.height;
    const transaction: PmTransaction = state.transaction;
    let mapFrom = 0;

    const recomp = (): void => {
        table = tableStart ? transaction.doc.nodeAt(tableStart - 1) : transaction.doc;
        if (!table) {
            throw new Error('No table found');
        }
        map = TableMap.get(table);
        mapFrom = transaction.mapping.maps.length;
    };

    // Prepare the table to be large enough and not have any cells
    // crossing the boundaries of the rectangle that we want to
    // insert into. If anything about it changes, recompute the table
    // map so that subsequent operations can see the current shape.
    if (growTable(transaction, map, table, tableStart, right, bottom, mapFrom)) {
        recomp();
    }

    if (isolateHorizontal(transaction, map, table, tableStart, left, right, top, mapFrom)) {
        recomp();
    }

    if (isolateHorizontal(transaction, map, table, tableStart, left, right, bottom, mapFrom)) {
        recomp();
    }

    if (isolateVertical(transaction, map, table, tableStart, top, bottom, left, mapFrom)) {
        recomp();
    }

    if (isolateVertical(transaction, map, table, tableStart, top, bottom, right, mapFrom)) {
        recomp();
    }

    for (let row = top; row < bottom; row++) {
        const from: number = map.positionAt(row, left, table);
        const to: number = map.positionAt(row, right, table);

        transaction.replace(
            transaction.mapping.slice(mapFrom).map(from + tableStart),
            transaction.mapping.slice(mapFrom).map(to + tableStart),
            new Slice(cells.rows[row - top], 0, 0),
        );
    }

    recomp();

    transaction.setSelection(
        new CellSelection(
            transaction.doc.resolve(tableStart + map.positionAt(top, left, table)),
            transaction.doc.resolve(tableStart + map.positionAt(bottom - 1, right - 1, table)),
        ),
    );

    dispatch(transaction);
}


/**
 * Ensures a table has at least the specified width and height.
 *
 * This function extends the table by adding empty cells to each row (for width)
 * and/or adding new rows (for height). When adding cells, it preserves the
 * header cell type if the last cell in the row is a header cell.
 *
 * @param transaction - The transaction to apply changes to.
 * @param map - The current table map describing the table structure.
 * @param table - The table node to potentially grow.
 * @param start - The document position where the table content starts.
 * @param width - The minimum required width (number of columns).
 * @param height - The minimum required height (number of rows).
 * @param mapFrom - The mapping offset for position calculations.
 * @returns `true` if any cells were added to the table, `false` otherwise.
 */
function growTable(transaction: PmTransaction,
                   map: TableMap,
                   table: PmNode,
                   start: number,
                   width: number,
                   height: number,
                   mapFrom: number): boolean {
    const schema: Schema = transaction.doc.type.schema;
    const types: Record<'table' | 'row' | 'cell' | 'header_cell', NodeType> = tableNodeTypes(schema);
    let empty: PmNode;
    let emptyHead: PmNode;

    if (width > map.width) {
        for (let row = 0, rowEnd = 0; row < map.height; row++) {
            const rowNode: PmNode = table.child(row);
            const cells: Array<PmNode> = [];
            let add: PmNode;
            rowEnd += rowNode.nodeSize;

            if (isUndefinedOrNull(rowNode.lastChild) || rowNode.lastChild.type === types.cell) {
                add = empty || (empty = types.cell.createAndFill());
            } else {
                add = emptyHead || (emptyHead = types.header_cell.createAndFill());
            }

            for (let i = map.width; i < width; i++) {
                cells.push(add);
            }

            transaction.insert(transaction.mapping.slice(mapFrom).map(rowEnd - 1 + start), cells);
        }
    }

    if (height > map.height) {
        const cells: Array<PmNode> = [];
        const lastRowMapIndex = (map.height - 1) * map.width;
        for (
            let i = 0;
            i < Math.max(map.width, width);
            i++
        ) {
            const header: boolean =
                i >= map.width
                    ? false
                    : table.nodeAt(map.map[lastRowMapIndex + i]).type === types.header_cell;

            cells.push(
                header
                    ? emptyHead || (emptyHead = types.header_cell.createAndFill())
                    : empty || (empty = types.cell.createAndFill()),
            );
        }

        const emptyRow: PmNode = types.row.create(null, Fragment.from(cells));
        const rows: Array<PmNode> = [];
        for (let i = map.height; i < height; i++) {
            rows.push(emptyRow);
        }

        transaction.insert(transaction.mapping.slice(mapFrom).map(start + table.nodeSize - 2), rows);
    }
    return !!(empty || emptyHead);
}

/**
 * Ensures a horizontal line doesn't cross any rowspan cells.
 *
 * This function checks if the horizontal line from (left, top) to (right, top)
 * crosses any cells with rowspan > 1. If it does, those cells are split at the
 * boundary to create separate cells above and below the line.
 *
 * @param transaction - The transaction to apply changes to.
 * @param map - The current table map.
 * @param table - The table node.
 * @param start - The document position where the table content starts.
 * @param left - The left column boundary.
 * @param right - The right column boundary.
 * @param top - The row at which to check for crossing cells.
 * @param mapFrom - The mapping offset for position calculations.
 * @returns `true` if any cells were split, `false` otherwise.
 */
function isolateHorizontal(transaction: PmTransaction,
                           map: TableMap,
                           table: PmNode,
                           start: number,
                           left: number,
                           right: number,
                           top: number,
                           mapFrom: number): boolean {
    if (top === 0 || top === map.height) {
        return false;
    }

    let found = false;
    for (let col = left; col < right; col++) {
        const index: number = top * map.width + col;
        const pos: number = map.map[index];

        if (map.map[index - map.width] === pos) {
            found = true;
            const cell: PmNode = table.nodeAt(pos);
            const {top: cellTop, left: cellLeft} = map.findCell(pos);

            transaction.setNodeMarkup(transaction.mapping.slice(mapFrom).map(pos + start), null, {
                ...cell.attrs,
                rowspan: top - cellTop,
            });

            transaction.insert(
                transaction.mapping.slice(mapFrom).map(map.positionAt(top, cellLeft, table)),
                cell.type.createAndFill({
                    ...cell.attrs,
                    rowspan: cellTop + (cell.attrs.rowspan as number) - top
                }),
            );
            col += cell.attrs.colspan - 1;
        }
    }
    return found;
}

/**
 * Ensures a vertical line doesn't cross any colspan cells.
 *
 * This function checks if the vertical line from (left, top) to (left, bottom)
 * crosses any cells with colspan > 1. If it does, those cells are split at the
 * boundary to create separate cells to the left and right of the line.
 *
 * @param transaction - The transaction to apply changes to.
 * @param map - The current table map.
 * @param table - The table node.
 * @param start - The document position where the table content starts.
 * @param top - The top row boundary.
 * @param bottom - The bottom row boundary.
 * @param left - The column at which to check for crossing cells.
 * @param mapFrom - The mapping offset for position calculations.
 * @returns `true` if any cells were split, `false` otherwise.
 */
function isolateVertical(transaction: PmTransaction,
                         map: TableMap,
                         table: PmNode,
                         start: number,
                         top: number,
                         bottom: number,
                         left: number,
                         mapFrom: number): boolean {
    if (left === 0 || left === map.width) {
        return false;
    }

    let found = false;
    for (let row = top; row < bottom; row++) {
        const index: number = row * map.width + left;
        const pos: number = map.map[index];

        if (map.map[index - 1] === pos) {
            found = true;
            const cell: PmNode = table.nodeAt(pos);
            const cellLeft: number = map.colCount(pos);
            const updatePos: number = transaction.mapping.slice(mapFrom).map(pos + start);

            transaction.setNodeMarkup(
                updatePos,
                null,
                removeColSpan(
                    cell.attrs as CellAttrs,
                    left - cellLeft,
                    cell.attrs.colspan - (left - cellLeft),
                ),
            );

            transaction.insert(
                updatePos + cell.nodeSize,
                cell.type.createAndFill(
                    removeColSpan(cell.attrs as CellAttrs, 0, left - cellLeft),
                ),
            );

            row += cell.attrs.rowspan - 1;
        }
    }
    return found;
}
