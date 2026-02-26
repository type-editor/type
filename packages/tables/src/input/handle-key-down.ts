import { chainCommands } from '@type-editor/commands';
import { isUndefinedOrNull } from '@type-editor/commons';
import type { Command, DispatchFunction, PmEditorState, PmEditorView, PmSelection } from '@type-editor/editor-types';
import { keydownHandler } from '@type-editor/keymap';
import type { ResolvedPos } from '@type-editor/model';

import { CellSelection } from '../cellselection/CellSelection';
import { deleteCellSelection } from '../commands/delete-cell-selection';
import type { Axis } from '../types/input/Axis';
import type { Direction } from '../types/input/Direction';
import { nextCell } from '../utils/next-cell';
import { arrow } from './arrow';
import { escapeTableDown } from './escape-table-down';
import { atEndOfCell } from './util/at-end-of-cell';
import { maybeSetSelection } from './util/maybe-set-selection';


/**
 * Keydown handler for table-related keyboard shortcuts.
 *
 * Handles the following key bindings:
 * - Arrow keys: Navigate between cells.
 * - Shift+Arrow keys: Extend cell selection.
 * - Backspace/Delete: Delete selected cells' content.
 *
 * @example
 * ```typescript
 * // Use in a ProseMirror plugin
 * new Plugin({
 *   props: {
 *     handleKeyDown: handleKeyDown
 *   }
 * });
 * ```
 */
export const handleKeyDown = keydownHandler({

    ArrowLeft: arrow('horiz', -1),
    ArrowRight: chainCommands(escapeTableDown, arrow('horiz', 1)),
    ArrowUp: arrow('vert', -1),
    ArrowDown: chainCommands(escapeTableDown, arrow('vert', 1)),

    'Shift-ArrowLeft': shiftArrow('horiz', -1),
    'Shift-ArrowRight': shiftArrow('horiz', 1),
    'Shift-ArrowUp': shiftArrow('vert', -1),
    'Shift-ArrowDown': shiftArrow('vert', 1),

    Backspace: deleteCellSelection,
    'Mod-Backspace': deleteCellSelection,
    Delete: deleteCellSelection,
    'Mod-Delete': deleteCellSelection

});

/**
 * Creates a command for Shift+Arrow key selection extension within tables.
 *
 * When used, this extends the current cell selection in the specified direction.
 * If not in a cell selection, it starts one from the current cell position.
 *
 * @param axis - The axis of movement ('horiz' for left/right, 'vert' for up/down).
 * @param dir - The direction of movement (-1 for left/up, 1 for right/down).
 * @returns A ProseMirror command that handles Shift+Arrow key selection.
 *
 * @example
 * ```typescript
 * // Create a command for extending selection down
 * const extendDown = shiftArrow('vert', 1);
 * ```
 */
function shiftArrow(axis: Axis, dir: Direction): Command {
    return (state: PmEditorState, dispatch: DispatchFunction, view: PmEditorView): boolean => {
        if (!view) {
            return false;
        }

        const selection: PmSelection = state.selection;
        let cellSel: CellSelection;

        if (selection instanceof CellSelection) {
            cellSel = selection;
        } else {
            const end: number | null = atEndOfCell(view, axis, dir);
            if (isUndefinedOrNull(end)) {
                return false;
            }
            cellSel = new CellSelection(state.doc.resolve(end));
        }

        const $head: ResolvedPos = nextCell(cellSel.$headCell, axis, dir);
        if (!$head) {
            return false;
        }

        return maybeSetSelection(
            state,
            dispatch,
            new CellSelection(cellSel.$anchorCell, $head),
        );
    };
}
