import type {PmEditorState} from '@type-editor/editor-types';
import type {ResolvedPos} from '@type-editor/model';
import type {NodeSelection} from '@type-editor/state';

import type {CellSelection} from '../cellselection/CellSelection';
import {cellAround} from './cell-around';
import {cellNear} from './cell-near';
import {hasTableCellRole} from './helper/has-table-cell-role';


/**
 * Gets the resolved position of the "main" cell in the current selection.
 *
 * For cell selections, returns the position of the cell that is furthest
 * in document order (comparing anchor and head). For node selections of a cell,
 * returns the anchor position. For other selections, finds the nearest cell.
 *
 * @param state - The current editor state.
 * @returns The resolved position pointing to the selected cell.
 * @throws RangeError if no cell can be found around the selection.
 *
 * @example
 * ```typescript
 * try {
 *     const $cell = selectionCell(state);
 *     console.log('Selected cell at position:', $cell.pos);
 * } catch (e) {
 *     console.log('Not in a table cell');
 * }
 * ```
 */
export function selectionCell(state: PmEditorState): ResolvedPos {
    const sel = state.selection as CellSelection | NodeSelection;

    // Handle cell selection (multiple cells selected)
    if ('$anchorCell' in sel && sel.$anchorCell) {
        return sel.$anchorCell.pos > sel.$headCell.pos
            ? sel.$anchorCell
            : sel.$headCell;
    }

    // Handle node selection of a cell
    if ('node' in sel && sel.node && hasTableCellRole(sel.node)) {
        return sel.$anchor;
    }

    // For other selections, find the nearest cell
    const $cell: ResolvedPos = cellAround(sel.$head) || cellNear(sel.$head);
    if ($cell) {
        return $cell;
    }

    throw new RangeError(`No cell found around position ${sel.head}`);
}
