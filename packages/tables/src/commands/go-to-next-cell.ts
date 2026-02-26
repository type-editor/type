import { isUndefinedOrNull } from '@type-editor/commons';
import type { PmEditorState } from '@type-editor/editor-types';
import { type Command, type DispatchFunction } from '@type-editor/editor-types';
import type { PmNode, ResolvedPos } from '@type-editor/model';
import { TextSelection } from '@type-editor/state';

import type { Direction } from '../types/input/Direction';
import { isInTable } from '../utils/is-in-table';
import { moveCellForward } from '../utils/move-cell-forward';
import { selectionCell } from '../utils/selection-cell';


/**
 * Creates a command for selecting the next or previous cell in a table.
 *
 * @param direction - Direction to move: 1 for next cell, -1 for previous cell
 * @returns A command that navigates to the adjacent cell
 */
export function goToNextCell(direction: Direction): Command {
    return function (state: PmEditorState, dispatch: DispatchFunction): boolean {
        if (!isInTable(state)) {
            return false;
        }

        const cell: number = findNextCell(selectionCell(state), direction);
        if (isUndefinedOrNull(cell)) {
            return false;
        }

        if (dispatch) {
            const $cell: ResolvedPos = state.doc.resolve(cell);
            dispatch(
                state.transaction
                    .setSelection(TextSelection.between($cell, moveCellForward($cell)))
                    .scrollIntoView()
            );
        }

        return true;
    };
}

/**
 * Finds the next or previous cell in the table from the given position.
 *
 * Handles navigation across row boundaries when moving forward or backward.
 *
 * @param $cell - The resolved position of the current cell
 * @param dir - Direction to move: positive for forward, negative for backward
 * @returns The position of the next cell, or null if at table boundary
 */
function findNextCell($cell: ResolvedPos, dir: Direction): number | null {
    if (dir < 0) {
        const before: PmNode = $cell.nodeBefore;
        if (before) {
            return $cell.pos - before.nodeSize;
        }

        for (
            let row = $cell.index(-1) - 1, rowEnd = $cell.before();
            row >= 0;
            row--
        ) {
            const rowNode: PmNode = $cell.node(-1).child(row);
            const lastChild: PmNode = rowNode.lastChild;
            if (lastChild) {
                return rowEnd - 1 - lastChild.nodeSize;
            }

            rowEnd -= rowNode.nodeSize;
        }
    } else {
        if ($cell.index() < $cell.parent.childCount - 1) {
            return $cell.pos + $cell.nodeAfter.nodeSize;
        }
        const table: PmNode = $cell.node(-1);
        for (
            let row = $cell.indexAfter(-1), rowStart = $cell.after();
            row < table.childCount;
            row++
        ) {
            const rowNode: PmNode = table.child(row);
            if (rowNode.childCount) {
                return rowStart + 1;
            }

            rowStart += rowNode.nodeSize;
        }
    }
    return null;
}
