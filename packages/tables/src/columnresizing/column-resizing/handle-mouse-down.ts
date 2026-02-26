import type {PmEditorView, PmTransaction} from '@type-editor/editor-types';
import type {Attrs, PmNode, ResolvedPos} from '@type-editor/model';

import {TableMap} from '../../tablemap/TableMap';
import {updateColumnsOnResize} from '../../tableview/update-columns-on-resize';
import type {CellAttrs} from '../../types/CellAttrs';
import type {Dragging} from '../../types/columnresizing/Dragging';
import {columnResizingPluginKey} from '../column-resizing-plugin-key';
import {NO_ACTIVE_HANDLE} from '../no-active-handle';
import type {ResizeState} from '../ResizeState';
import {getRightmostColumn} from './util/get-rightmost-column';


/**
 * Handles mouse down events to initiate column resizing when clicking on an
 * active resize handle.
 *
 * Sets up event listeners for mouse movement and mouse up to handle the
 * drag operation. During dragging, the column width is visually updated.
 * When dragging completes, the final width is applied to the document.
 *
 * @param view - The editor view.
 * @param event - The mouse event.
 * @param cellMinWidth - The minimum width a column can be resized to.
 * @param defaultCellMinWidth - The default minimum width for cells without explicit width.
 * @returns `true` if the event was handled (a resize drag was started), `false` otherwise.
 */
export function handleMouseDown(view: PmEditorView,
                                event: MouseEvent,
                                cellMinWidth: number,
                                defaultCellMinWidth: number): boolean {
    if (!view.editable) {
        return false;
    }

    const win: Window = view.dom.ownerDocument.defaultView ?? window;

    const pluginState: ResizeState = columnResizingPluginKey.getState(view.state);
    if (!pluginState || pluginState.activeHandle === NO_ACTIVE_HANDLE || pluginState.dragging) {
        return false;
    }

    // Get the current cell and its width to initialize dragging
    const cell: PmNode = view.state.doc.nodeAt(pluginState.activeHandle);
    if (!cell) {
        return false;
    }
    const width: number = currentColWidth(view, pluginState.activeHandle, cell.attrs);
    view.dispatch(
        view.state.transaction.setMeta(columnResizingPluginKey, {
            setDragging: {startX: event.clientX, startWidth: width},
        }),
    );

    /**
     * Handler for when dragging completes (mouse up event).
     */
    const finish = (event: MouseEvent): void => {
        win.removeEventListener('mouseup', finish);
        win.removeEventListener('mousemove', move);
        const pluginState: ResizeState = columnResizingPluginKey.getState(view.state);

        if (pluginState?.dragging) {
            // Apply the final column width to the document
            updateColumnWidth(
                view,
                pluginState.activeHandle,
                draggedWidth(pluginState.dragging, event, cellMinWidth),
            );

            view.dispatch(
                view.state.transaction.setMeta(columnResizingPluginKey, {setDragging: null}),
            );
        }
    };

    /**
     * Handler for mouse movement during dragging.
     */
    const move = (event: MouseEvent): void => {
        // Check if primary mouse button is still pressed (buttons bitmask: 1 = primary)
        if (!(event.buttons & 1)) {
            finish(event);
            return;
        }

        const pluginState: ResizeState = columnResizingPluginKey.getState(view.state);
        if (!pluginState) {
            return;
        }

        if (pluginState.dragging) {
            const dragged = draggedWidth(pluginState.dragging, event, cellMinWidth);

            // Update the visual display without modifying the document
            displayColumnWidth(
                view,
                pluginState.activeHandle,
                dragged,
                defaultCellMinWidth,
            );
        }
    };

    // Initialize the display with the current width
    displayColumnWidth(
        view,
        pluginState.activeHandle,
        width,
        defaultCellMinWidth,
    );

    win.addEventListener('mouseup', finish);
    win.addEventListener('mousemove', move);
    event.preventDefault();
    return true;
}


/**
 * Calculates the current width of a column at the given cell position.
 *
 * If the cell has an explicit colwidth attribute, the last value in the array
 * is returned (representing the rightmost column the cell spans).
 * Otherwise, the width is calculated from the DOM element's offsetWidth,
 * accounting for any colspan and subtracting any explicit widths.
 *
 * @param view - The editor view.
 * @param cellPos - The document position of the cell.
 * @param attrs - The cell's attributes containing colspan and colwidth.
 * @returns The width of the column in pixels.
 */
function currentColWidth(view: PmEditorView,
                         cellPos: number,
                         {colspan, colwidth}: Attrs): number {
    const colwidthArray: Array<number> = Array.isArray(colwidth) ? colwidth as Array<number> : null;
    const width: number = colwidthArray?.[colwidthArray.length - 1];
    if (width) {
        return width;
    }

    // No explicit width set, calculate from DOM
    const dom: { node: Node; offset: number } = view.domAtPos(cellPos);
    const node = dom.node.childNodes[dom.offset] as HTMLElement;
    let domWidth: number = node.offsetWidth;
    let parts: number = colspan as number;

    // If cell has colspan, subtract any explicit widths and average the rest
    if (colwidthArray) {
        for (let i = 0; i < colspan; i++) {
            if (colwidthArray[i]) {
                domWidth -= colwidthArray[i];
                parts--;
            }
        }
    }

    // Prevent division by zero if all columns have explicit widths
    return parts > 0 ? domWidth / parts : domWidth;
}

/**
 * Updates the column width in the document by modifying the colwidth attribute
 * of all cells in the specified column.
 *
 * @param view - The editor view.
 * @param cell - The document position of a cell in the column to resize.
 * @param width - The new width to set for the column.
 */
function updateColumnWidth(view: PmEditorView,
                           cell: number,
                           width: number): void {
    const $cell: ResolvedPos = view.state.doc.resolve(cell);
    const table: PmNode = $cell.node(-1);
    const map: TableMap = TableMap.get(table);
    const start: number = $cell.start(-1);
    const col: number = getRightmostColumn(map, start, $cell);
    const transaction: PmTransaction = view.state.transaction;

    // Update the width attribute for all cells in this column
    for (let row = 0; row < map.height; row++) {
        const mapIndex: number = row * map.width + col;
        // Rowspanning cell that has already been handled
        if (row && map.map[mapIndex] === map.map[mapIndex - map.width]) {
            continue;
        }

        const pos: number = map.map[mapIndex];
        const cellNode: PmNode = table.nodeAt(pos);
        if (!cellNode) {
            continue;
        }
        const attrs = cellNode.attrs as CellAttrs;
        // For cells with colspan, determine which width index to update
        const index: number = attrs.colspan === 1 ? 0 : col - map.colCount(pos);
        if (attrs.colwidth?.[index] === width) {
            continue;
        }

        // Create or update the colwidth array
        const colwidth: Array<number> = attrs.colwidth
            ? attrs.colwidth.slice()
            : zeroes(attrs.colspan);

        colwidth[index] = width;
        transaction.setNodeMarkup(start + pos, null, {...attrs, colwidth: colwidth});
    }

    if (transaction.docChanged) {
        view.dispatch(transaction);
    }
}

/**
 * Creates an array of zeros with the specified length.
 * Used to initialize the colwidth array for cells without explicit column widths.
 *
 * @param n - The length of the array to create.
 * @returns An array of `n` zeros.
 */
function zeroes(n: number): Array<0> {
    return Array(n).fill(0) as Array<0>;
}

/**
 * Updates the visual display of a column width during dragging without modifying the document.
 * This provides real-time visual feedback as the user drags the resize handle.
 *
 * @param view - The editor view.
 * @param cell - The document position of a cell in the column being resized.
 * @param width - The width to display.
 * @param defaultCellMinWidth - The default minimum width for cells without explicit width.
 */
function displayColumnWidth(view: PmEditorView,
                            cell: number,
                            width: number,
                            defaultCellMinWidth: number): void {
    const $cell: ResolvedPos = view.state.doc.resolve(cell);
    const table: PmNode = $cell.node(-1);
    const map: TableMap = TableMap.get(table);
    const start: number = $cell.start(-1);
    const col: number = getRightmostColumn(map, start, $cell);

    // Find the table DOM element
    let dom: Node | null = view.domAtPos($cell.start(-1)).node;
    while (dom && dom.nodeName !== 'TABLE') {
        dom = dom.parentNode;
    }

    if (!dom) {
        return;
    }

    // Update the visual display (doesn't change the document)
    updateColumnsOnResize(
        table,
        dom.firstChild as HTMLTableColElement,
        dom as HTMLTableElement,
        defaultCellMinWidth,
        col,
        width,
    );
}

/**
 * Calculates the new column width based on mouse movement during a drag operation.
 *
 * @param dragging - The current drag state containing the start position and initial width.
 * @param event - The current mouse event.
 * @param resizeMinWidth - The minimum allowed column width.
 * @returns The new column width, constrained to be at least `resizeMinWidth`.
 */
function draggedWidth(dragging: Dragging,
                      event: MouseEvent,
                      resizeMinWidth: number): number {
    // Calculate the new width based on mouse movement, ensuring it stays above minimum
    const offset: number = event.clientX - dragging.startX;
    return Math.max(resizeMinWidth, dragging.startWidth + offset);
}
