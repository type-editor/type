import {isUndefinedOrNull} from '@type-editor/commons';
import type {PmEditorState, PmSelection, PmTransaction} from '@type-editor/editor-types';
import type {DispatchFunction} from '@type-editor/editor-types';
import {Fragment, type PmNode} from '@type-editor/model';

import {CellSelection} from '../cellselection/CellSelection';
import {TableMap} from '../tablemap/TableMap';
import type {CellAttrs} from '../types/CellAttrs';
import type {TableRect} from '../types/commands/TableRect';
import {type Rect} from '../types/tablemap/Rect';
import {addColSpan} from '../utils/add-col-span';
import {selectedRect} from './selected-rect';


/**
 * Merges the selected cells into a single cell.
 *
 * This command is only available when:
 * - Multiple cells are selected via CellSelection
 * - The selected cells' outline forms a proper rectangle
 * - No cells partially overlap the selection boundary
 *
 * The merged cell will contain the combined content of all merged cells.
 *
 * @param state - The current editor state
 * @param dispatch - Optional dispatch function to execute the command
 * @returns True if the command is applicable, false otherwise
 */
export function mergeCells(state: PmEditorState, dispatch?: DispatchFunction): boolean {
    const sel: PmSelection = state.selection;
    if (!(sel instanceof CellSelection) || sel.$anchorCell.pos === sel.$headCell.pos) {
        return false;
    }

    const rect: TableRect = selectedRect(state);
    const {map} = rect;

    if (cellsOverlapRectangle(map, rect)) {
        return false;
    }

    if (dispatch) {
        const transaction: PmTransaction = state.transaction;
        const seen = new Set<number>();
        let content: Fragment = Fragment.empty;
        let mergedPos: number | undefined = undefined;
        let mergedCell: PmNode | undefined;

        for (let row = rect.top; row < rect.bottom; row++) {
            for (let col = rect.left; col < rect.right; col++) {
                const cellPos: number = map.map[row * map.width + col];
                const cell: PmNode = rect.table.nodeAt(cellPos);
                if (seen.has(cellPos) || !cell) {
                    continue;
                }

                seen.add(cellPos);
                if (isUndefinedOrNull(mergedPos)) {
                    mergedPos = cellPos;
                    mergedCell = cell;
                } else {
                    if (!isEmpty(cell)) {
                        content = content.append(cell.content);
                    }

                    const mapped: number = transaction.mapping.map(cellPos + rect.tableStart);
                    transaction.delete(mapped, mapped + cell.nodeSize);
                }
            }
        }

        if (isUndefinedOrNull(mergedPos) || isUndefinedOrNull(mergedCell)) {
            return true;
        }

        transaction.setNodeMarkup(mergedPos + rect.tableStart, null, {
            ...addColSpan(
                mergedCell.attrs as CellAttrs,
                (mergedCell.attrs.colspan as number),
                rect.right - rect.left - mergedCell.attrs.colspan,
            ),
            rowspan: rect.bottom - rect.top,
        });

        if (content.size > 0) {
            const end: number = mergedPos + 1 + mergedCell.content.size;
            const start: number = isEmpty(mergedCell) ? mergedPos + 1 : end;
            transaction.replaceWith(start + rect.tableStart, end + rect.tableStart, content);
        }

        transaction.setSelection(
            new CellSelection(transaction.doc.resolve(mergedPos + rect.tableStart))
        );

        dispatch(transaction);
    }
    return true;
}

/**
 * Checks if a cell is empty (contains only an empty textblock).
 *
 * @param cell - The cell node to check
 * @returns True if the cell is empty
 */
function isEmpty(cell: PmNode): boolean {
    const cellContent: Fragment = cell.content;

    return cellContent.childCount === 1
        && cellContent.child(0).isTextblock
        && cellContent.child(0).childCount === 0;
}

/**
 * Checks if any cells overlap the boundary of a rectangle.
 *
 * This is used to determine if cells can be merged - cells can only be
 * merged if their selection forms a proper rectangle without any cells
 * spanning across the rectangle boundary.
 *
 * @param tableMap - The table map containing width, height, and position map
 * @param rect - The rectangle to check
 * @returns True if any cells overlap the rectangle boundary
 */
function cellsOverlapRectangle({width, height, map}: TableMap, rect: Rect): boolean {
    // Check left and right edges of the rectangle for horizontal overlaps
    const initialLeftEdgeIndex: number = rect.top * width + rect.left;
    const initialRightEdgeIndex: number = initialLeftEdgeIndex + (rect.right - rect.left - 1);

    let leftEdgeIndex: number = initialLeftEdgeIndex;
    let rightEdgeIndex: number = initialRightEdgeIndex;

    for (let row = rect.top; row < rect.bottom; row++) {
        // Check if a cell spans across the left edge
        const hasLeftOverlap: boolean = rect.left > 0 && map[leftEdgeIndex] === map[leftEdgeIndex - 1];
        // Check if a cell spans across the right edge
        const hasRightOverlap: boolean = rect.right < width && map[rightEdgeIndex] === map[rightEdgeIndex + 1];

        if (hasLeftOverlap || hasRightOverlap) {
            return true;
        }

        leftEdgeIndex += width;
        rightEdgeIndex += width;
    }

    // Check top and bottom edges of the rectangle for vertical overlaps
    let topEdgeIndex: number = rect.top * width + rect.left;
    let bottomEdgeIndex: number = (rect.bottom - 1) * width + rect.left;

    for (let col = rect.left; col < rect.right; col++) {
        // Check if a cell spans across the top edge
        const hasTopOverlap: boolean = rect.top > 0 && map[topEdgeIndex] === map[topEdgeIndex - width];
        // Check if a cell spans across the bottom edge
        const hasBottomOverlap: boolean = rect.bottom < height && map[bottomEdgeIndex] === map[bottomEdgeIndex + width];

        if (hasTopOverlap || hasBottomOverlap) {
            return true;
        }

        topEdgeIndex++;
        bottomEdgeIndex++;
    }
    return false;
}
