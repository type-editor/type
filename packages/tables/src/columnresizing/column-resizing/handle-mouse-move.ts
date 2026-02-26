import type {PmEditorView} from '@type-editor/editor-types';
import type {PmNode, ResolvedPos} from '@type-editor/model';

import {TableMap} from '../../tablemap/TableMap';
import {cellAround} from '../../utils/cell-around';
import {columnResizingPluginKey} from '../column-resizing-plugin-key';
import {NO_ACTIVE_HANDLE} from '../no-active-handle';
import type {ResizeState} from '../ResizeState';
import {getRightmostColumn} from './util/get-rightmost-column';
import {updateHandle} from './util/update-handle';

/**
 * Handles mouse movement events to detect when the cursor is near a column edge
 * and should activate the resize handle.
 *
 * @param view - The editor view.
 * @param event - The mouse event.
 * @param handleWidth - The width of the resize handle zone in pixels.
 * @param lastColumnResizable - Whether the last column can be resized.
 */
export function handleMouseMove(view: PmEditorView,
                                event: MouseEvent,
                                handleWidth: number,
                                lastColumnResizable: boolean): void {
    if (!view.editable) {
        return;
    }

    const pluginState: ResizeState = columnResizingPluginKey.getState(view.state);
    if (!pluginState) {
        return;
    }

    // Only update handle when not actively dragging
    if (!pluginState.dragging) {
        const target: HTMLElement = domCellAround(event.target as HTMLElement);
        let cell: number = NO_ACTIVE_HANDLE;
        if (target) {
            const {left, right} = target.getBoundingClientRect();
            // Check if mouse is near left edge (within handleWidth pixels)
            if (event.clientX - left <= handleWidth) {
                cell = edgeCell(view, event, 'left', handleWidth);
            }
            // Check if mouse is near right edge (within handleWidth pixels)
            else if (right - event.clientX <= handleWidth) {
                cell = edgeCell(view, event, 'right', handleWidth);
            }
        }

        if (cell !== pluginState.activeHandle) {
            // Prevent resizing the last column if lastColumnResizable is false
            if (!lastColumnResizable && cell !== NO_ACTIVE_HANDLE) {
                const $cell: ResolvedPos = view.state.doc.resolve(cell);
                const table: PmNode = $cell.node(-1);
                const map: TableMap = TableMap.get(table);
                const tableStart: number = $cell.start(-1);
                const col: number = getRightmostColumn(map, tableStart, $cell);

                // Don't activate handle if this is the last column
                if (col === map.width - 1) {
                    return;
                }
            }

            updateHandle(view, cell);
        }
    }
}

/**
 * Finds the cell position at the edge of a column based on mouse position.
 *
 * For the right edge, returns the cell position directly.
 * For the left edge, returns the position of the cell to the left (since that's the
 * column whose right edge is being dragged).
 *
 * @param view - The editor view.
 * @param event - The mouse event.
 * @param side - Which edge of the cell the mouse is near ('left' or 'right').
 * @param handleWidth - The width of the resize handle zone in pixels.
 * @returns The document position of the cell, or {@link NO_ACTIVE_HANDLE} if not found.
 */
function edgeCell(view: PmEditorView,
                  event: MouseEvent,
                  side: 'left' | 'right',
                  handleWidth: number): number {
    // posAtCoords returns inconsistent positions when cursor is moving
    // across a collapsed table border. Use an offset to adjust the
    // target viewport coordinates away from the table border.
    const offset: number = side === 'right' ? -handleWidth : handleWidth;
    const found: { pos: number; inside: number } = view.posAtCoords({
        left: event.clientX + offset,
        top: event.clientY,
    });

    if (!found) {
        return NO_ACTIVE_HANDLE;
    }

    const {pos} = found;
    const $cell: ResolvedPos = cellAround(view.state.doc.resolve(pos));
    if (!$cell) {
        return NO_ACTIVE_HANDLE;
    }

    // For right edge, return the cell position directly
    if (side === 'right') {
        return $cell.pos;
    }

    // For left edge, find the cell to the left in the table map
    const map: TableMap = TableMap.get($cell.node(-1));
    const start: number = $cell.start(-1);
    const index: number = map.map.indexOf($cell.pos - start);

    // If we're at the leftmost column, return NO_ACTIVE_HANDLE
    return index % map.width === 0 ? NO_ACTIVE_HANDLE : start + map.map[index - 1];
}

/**
 * Traverses up the DOM tree from the given target to find the nearest
 * table cell element (TD or TH).
 *
 * @param target - The starting DOM element.
 * @returns The nearest TD or TH element, or `null` if none is found before reaching
 *          the ProseMirror root.
 */
function domCellAround(target: HTMLElement | null): HTMLElement | null {
    // Walk up the DOM tree to find a TD or TH element
    while (target && target.nodeName !== 'TD' && target.nodeName !== 'TH') {
        // Stop if we reach the ProseMirror root
        target = target.classList?.contains('ProseMirror')
            ? null
            : (target.parentNode as HTMLElement);
    }

    return target;
}
