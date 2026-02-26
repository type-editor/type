import type {PmEditorView, PmSelection} from '@type-editor/editor-types';
import {Fragment, type PmNode, type ResolvedPos, type Slice} from '@type-editor/model';

import {CellSelection} from '../cellselection/CellSelection';
import {clipCells} from '../copypaste/clip-cells';
import {fitSlice} from '../copypaste/fit-slice';
import {insertCells} from '../copypaste/insert-cells';
import {pastedCells} from '../copypaste/pasted-cells';
import {tableNodeTypes} from '../schema';
import {TableMap} from '../tablemap/TableMap';
import type {Area} from '../types/copypaste/Area';
import {type Rect} from '../types/tablemap/Rect';
import {isInTable} from '../utils/is-in-table';
import {selectionCell} from '../utils/selection-cell';


/**
 * Handles paste events within table cells.
 *
 * This function handles two scenarios:
 * 1. When pasting into a cell selection, it clips the pasted content to fit
 *    the selected area and inserts cells appropriately.
 * 2. When pasting table-like content into a single cell, it expands the
 *    table if necessary to accommodate the pasted cells.
 *
 * @param view - The editor view.
 * @param _ - The clipboard event (unused, but required by the handler signature).
 * @param slice - The pasted content as a ProseMirror slice.
 * @returns `true` if the paste was handled, `false` to let default handling continue.
 *
 * @example
 * ```typescript
 * // Use in a ProseMirror plugin
 * new Plugin({
 *   props: {
 *     handlePaste: handlePaste
 *   }
 * });
 * ```
 */
export function handlePaste(view: PmEditorView,
                            _: ClipboardEvent,
                            slice: Slice): boolean {
    if (!isInTable(view.state)) {
        return false;
    }

    const cells: Area | null = pastedCells(slice);
    const selection: PmSelection = view.state.selection;

    if (selection instanceof CellSelection) {
        return handlePasteIntoCellSelection(view, slice, cells, selection);
    }

    if (cells) {
        return handlePasteTableContentIntoCell(view, cells);
    }

    return false;
}

/**
 * Handles pasting content into an active cell selection.
 *
 * Clips the pasted content to fit the selected area and inserts cells appropriately.
 *
 * @param view - The editor view.
 * @param slice - The pasted content as a ProseMirror slice.
 * @param cells - Parsed table cells from the paste content, or null.
 * @param selection - The current cell selection.
 * @returns `true` after handling the paste.
 */
function handlePasteIntoCellSelection(view: PmEditorView,
                                      slice: Slice,
                                      cells: Area | null,
                                      selection: CellSelection): boolean {
    const pastedCells: Area = cells ?? createSingleCellArea(view, slice);

    const table: PmNode = selection.$anchorCell.node(-1);
    const start: number = selection.$anchorCell.start(-1);
    const rect: Rect = TableMap.get(table).rectBetween(
        selection.$anchorCell.pos - start,
        selection.$headCell.pos - start
    );

    const clippedCells: Area = clipCells(
        pastedCells,
        rect.right - rect.left,
        rect.bottom - rect.top
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method -- view.dispatch is designed to be passed as a callback
    insertCells(view.state, view.dispatch, start, rect, clippedCells);
    return true;
}

/**
 * Creates a single-cell Area structure for non-table paste content.
 *
 * @param view - The editor view.
 * @param slice - The pasted content as a ProseMirror slice.
 * @returns An Area with a single cell containing the pasted content.
 */
function createSingleCellArea(view: PmEditorView, slice: Slice): Area {
    return {
        width: 1,
        height: 1,
        rows: [
            Fragment.from(
                fitSlice(tableNodeTypes(view.state.schema).cell, slice),
            ),
        ],
    };
}

/**
 * Handles pasting table-structured content into a single cell.
 *
 * Expands the table if necessary to accommodate the pasted cells.
 *
 * @param view - The editor view.
 * @param cells - The parsed table cells from the paste content.
 * @returns `true` after handling the paste.
 */
function handlePasteTableContentIntoCell(view: PmEditorView, cells: Area): boolean {
    const $cell: ResolvedPos = selectionCell(view.state);
    const start: number = $cell.start(-1);
    const cellRect: Rect = TableMap.get($cell.node(-1)).findCell($cell.pos - start);

    // eslint-disable-next-line @typescript-eslint/unbound-method -- view.dispatch is designed to be passed as a callback
    insertCells(view.state, view.dispatch, start, cellRect, cells);
    return true;
}
