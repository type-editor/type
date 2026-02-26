import type {PmEditorState, PmEditorView, PmSelection} from '@type-editor/editor-types';
import type {Command, DispatchFunction} from '@type-editor/editor-types';
import type {ResolvedPos} from '@type-editor/model';
import {Selection} from '@type-editor/state';

import {CellSelection} from '../cellselection/CellSelection';
import type {Axis} from '../types/input/Axis';
import type {Direction} from '../types/input/Direction';
import {nextCell} from '../utils/next-cell';
import {atEndOfCell} from './util/at-end-of-cell';
import {maybeSetSelection} from './util/maybe-set-selection';


/**
 * Creates a command for arrow key navigation within tables.
 *
 * When the cursor is within a cell selection, this moves the selection near the head cell.
 * When at the edge of a cell, it navigates to the adjacent cell.
 *
 * @param axis - The axis of movement ('horiz' for left/right, 'vert' for up/down).
 * @param dir - The direction of movement (-1 for left/up, 1 for right/down).
 * @returns A ProseMirror command that handles arrow key navigation.
 *
 * @example
 * ```typescript
 * // Create a command for moving right
 * const moveRight = arrow('horiz', 1);
 * ```
 */
export function arrow(axis: Axis, dir: Direction): Command {
    return (state: PmEditorState, dispatch: DispatchFunction, view: PmEditorView): boolean => {
        if (!view) {
            return false;
        }

        const selection: PmSelection = state.selection;
        if (selection instanceof CellSelection) {
            return maybeSetSelection(
                state,
                dispatch,
                Selection.near(selection.$headCell, dir),
            );
        }

        // For vertical movement, only handle empty selections
        if (axis !== 'horiz' && !selection.empty) {
            return false;
        }

        const cellPos: number | null = atEndOfCell(view, axis, dir);
        if (cellPos === null) {
            return false;
        }

        return axis === 'horiz'
            ? handleHorizontalArrow(state, dispatch, selection, dir)
            : handleVerticalArrow(state, dispatch, cellPos, dir);
    };
}

/**
 * Handles horizontal arrow key navigation between cells.
 *
 * @param state - The current editor state.
 * @param dispatch - The dispatch function to apply the transaction.
 * @param selection - The current selection.
 * @param dir - The direction of movement (-1 for left, 1 for right).
 * @returns `true` if the selection was changed.
 */
function handleHorizontalArrow(state: PmEditorState,
                               dispatch: DispatchFunction,
                               selection: PmSelection,
                               dir: Direction): boolean {
    return maybeSetSelection(
        state,
        dispatch,
        Selection.near(state.doc.resolve(selection.head + dir), dir),
    );
}

/**
 * Handles vertical arrow key navigation between cells.
 *
 * @param state - The current editor state.
 * @param dispatch - The dispatch function to apply the transaction.
 * @param cellPos - The position of the current cell.
 * @param dir - The direction of movement (-1 for up, 1 for down).
 * @returns `true` if the selection was changed.
 */
function handleVerticalArrow(state: PmEditorState,
                             dispatch: DispatchFunction,
                             cellPos: number,
                             dir: Direction): boolean {
    const $cell: ResolvedPos = state.doc.resolve(cellPos);
    const $nextCell: ResolvedPos | null = nextCell($cell, 'vert', dir);

    let newSelection: PmSelection;

    if ($nextCell) {
        // Move to the next cell in the same column
        newSelection = Selection.near($nextCell, 1);
    } else if (dir < 0) {
        // At the top of the table, move before the table
        newSelection = Selection.near(state.doc.resolve($cell.before(-1)), -1);
    } else {
        // At the bottom of the table, move after the table
        newSelection = Selection.near(state.doc.resolve($cell.after(-1)), 1);
    }

    return maybeSetSelection(state, dispatch, newSelection);
}
