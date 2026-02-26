import {isUndefinedOrNull} from '@type-editor/commons';
import type {PmEditorView, PmTransaction} from '@type-editor/editor-types';
import type {ResolvedPos} from '@type-editor/model';

import {CellSelection} from '../cellselection/CellSelection';
import {tableEditingPluginKey} from '../table-editing-plugin-key';
import {cellAround} from '../utils/cell-around';
import {inSameTable} from '../utils/in-same-table';

/** The main mouse button (usually left click). */
const MAIN_MOUSE_BUTTON = 0;

/** Value used to signal the end of table editing mode. */
const END_TABLE_EDITING = -1;

/**
 * Handles mouse down events for table cell selection.
 *
 * This handler enables cell selection by dragging across table cells.
 * It supports:
 * - Shift+click to extend an existing cell selection
 * - Click and drag to create a new cell selection
 * - Ignores right-click and Ctrl/Cmd+click
 *
 * @param view - The editor view.
 * @param startEvent - The mouse down event that initiated the interaction.
 *
 * @example
 * ```typescript
 * // Use in a ProseMirror plugin
 * new Plugin({
 *   props: {
 *     handleDOMEvents: {
 *       mousedown: handleMouseDown
 *     }
 *   }
 * });
 * ```
 */
export function handleMouseDown(view: PmEditorView, startEvent: MouseEvent): void {
    if (!shouldHandleMouseDown(startEvent)) {
        return;
    }

    const startDOMCell: Node | null = domInCell(view, startEvent.target as Node);

    if (handleShiftClickSelection(view, startEvent, startDOMCell)) {
        return;
    }

    if (!startDOMCell) {
        // Not in a cell, let the default behavior happen.
        return;
    }

    // Set up mouse tracking for cell selection
    setupMouseTracking(view, startEvent, startDOMCell);
}

/**
 * Determines if the mouse down event should be handled for cell selection.
 *
 * @param event - The mouse event to check.
 * @returns `true` if the event should be handled, `false` otherwise.
 */
function shouldHandleMouseDown(event: MouseEvent): boolean {
    // Only handle left mouse button, and ignore Ctrl/Cmd+click (used for context-sensitive actions)
    return event.button === MAIN_MOUSE_BUTTON && !event.ctrlKey && !event.metaKey;
}

/**
 * Handles Shift+click to extend cell selection.
 *
 * @param view - The editor view.
 * @param startEvent - The mouse down event.
 * @param startDOMCell - The DOM cell element where the click occurred.
 * @returns `true` if shift-click was handled, `false` otherwise.
 */
function handleShiftClickSelection(view: PmEditorView,
                                   startEvent: MouseEvent,
                                   startDOMCell: Node | null): boolean {
    if (!startEvent.shiftKey) {
        return false;
    }

    // Extending an existing cell selection
    if (view.state.selection instanceof CellSelection) {
        dispatchCellSelection(view, view.state.selection.$anchorCell, startEvent);
        startEvent.preventDefault();
        return true;
    }

    // Creating a new cell selection from a different cell
    if (startDOMCell) {
        const $anchor: ResolvedPos | null = cellAround(view.state.selection.$anchor);
        const $cellUnderMouse: ResolvedPos | null = cellUnderMouse(view, startEvent);

        if ($anchor && $cellUnderMouse && $cellUnderMouse.pos !== $anchor.pos) {
            dispatchCellSelection(view, $anchor, startEvent);
            startEvent.preventDefault();
            return true;
        }
    }

    return false;
}

/**
 * Sets up mouse move and mouse up tracking for drag-based cell selection.
 *
 * @param view - The editor view.
 * @param startEvent - The initial mouse down event.
 * @param startDOMCell - The DOM cell element where the drag started.
 */
function setupMouseTracking(view: PmEditorView,
                            startEvent: MouseEvent,
                            startDOMCell: Node): void {
    /**
     * Stops listening to mouse motion events and ends table editing mode.
     */
    const stopTracking = (): void => {
        view.root.removeEventListener('mouseup', stopTracking);
        view.root.removeEventListener('dragstart', stopTracking);
        view.root.removeEventListener('mousemove', handleMouseMove);

        if (!isUndefinedOrNull(tableEditingPluginKey.getState(view.state))) {
            view.dispatch(view.state.transaction.setMeta(tableEditingPluginKey, END_TABLE_EDITING));
        }
    };

    /**
     * Handles mouse movement during drag selection.
     */
    const handleMouseMove = (event: MouseEvent): void => {
        const anchor: number | undefined = tableEditingPluginKey.getState(view.state);
        let $anchor: ResolvedPos | null = null;

        if (!isUndefinedOrNull(anchor)) {
            // Continuing an existing cross-cell selection
            $anchor = view.state.doc.resolve(anchor);
        } else if (domInCell(view, event.target as Node) !== startDOMCell) {
            // Moving out of the initial cell -- start a new cell selection
            $anchor = cellUnderMouse(view, startEvent);
            if (!$anchor) {
                stopTracking();
                return;
            }
        }

        if ($anchor) {
            dispatchCellSelection(view, $anchor, event);
        }
    };

    view.root.addEventListener('mouseup', stopTracking);
    view.root.addEventListener('dragstart', stopTracking);
    view.root.addEventListener('mousemove', handleMouseMove);
}

/**
 * Creates and dispatches a cell selection between an anchor cell and the cell under the mouse.
 *
 * @param view - The editor view.
 * @param $anchor - The anchor cell position.
 * @param event - The mouse event to determine the head cell.
 */
function dispatchCellSelection(view: PmEditorView,
                               $anchor: ResolvedPos,
                               event: MouseEvent): void {
    let $head: ResolvedPos | null = cellUnderMouse(view, event);
    const isStartingNewSelection: boolean = isUndefinedOrNull(tableEditingPluginKey.getState(view.state));

    if (!$head || !inSameTable($anchor, $head)) {
        if (isStartingNewSelection) {
            $head = $anchor;
        } else {
            return;
        }
    }

    const selection = new CellSelection($anchor, $head);
    if (isStartingNewSelection || !view.state.selection.eq(selection)) {
        const transaction: PmTransaction = view.state.transaction.setSelection(selection);
        if (isStartingNewSelection) {
            transaction.setMeta(tableEditingPluginKey, $anchor.pos);
        }
        view.dispatch(transaction);
    }
}

/**
 * Gets the resolved position of the table cell under the mouse cursor.
 *
 * This function determines the document position at the mouse coordinates
 * and finds the enclosing cell. It prefers the `inside` position for better
 * accuracy with merged cells (rowspan/colspan), but falls back to the regular
 * `pos` if needed.
 *
 * @param view - The editor view.
 * @param event - The mouse event containing the cursor coordinates.
 * @returns The resolved position of the cell, or `null` if not over a cell.
 */
function cellUnderMouse(view: PmEditorView, event: MouseEvent): ResolvedPos | null {
    const mousePos = view.posAtCoords({
        left: event.clientX,
        top: event.clientY,
    });

    if (!mousePos) {
        return null;
    }

    /**
     * Prefer `inside` position for better accuracy with merged cells (rowspan/colspan),
     * but fall back to `pos` if `inside` doesn't resolve to a valid cell
     */
    const {inside, pos} = mousePos;

    return (
        (inside >= 0 && cellAround(view.state.doc.resolve(inside))) ||
        cellAround(view.state.doc.resolve(pos))
    );
}

/**
 * Finds the closest table cell DOM element containing the given node.
 *
 * Walks up the DOM tree from the given node until a TD or TH element is found,
 * stopping at the editor's root DOM element.
 *
 * @param view - The editor view.
 * @param dom - The DOM node to start searching from.
 * @returns The enclosing TD or TH element, or `null` if not inside a table cell.
 */
function domInCell(view: PmEditorView, dom: Node | null): Node | null {
    for (; dom && dom !== view.dom; dom = dom.parentNode) {
        if (dom.nodeName === 'TD' || dom.nodeName === 'TH') {
            return dom;
        }
    }
    return null;
}
