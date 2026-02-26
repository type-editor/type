import type {PmEditorView} from '@type-editor/editor-types';
import type {PmNode, ResolvedPos} from '@type-editor/model';

import {CellSelection} from '../cellselection/CellSelection';
import {cellAround} from '../utils/cell-around';


/**
 * Handles triple-click events to select an entire table cell.
 *
 * When the user triple-clicks inside a table cell, this selects the entire cell
 * by creating a {@link CellSelection} for that cell.
 *
 * @param view - The editor view.
 * @param pos - The document position where the triple-click occurred.
 * @returns `true` if a cell was selected, `false` if the position is not in a cell.
 *
 * @example
 * ```typescript
 * // Use in a ProseMirror plugin
 * new Plugin({
 *   props: {
 *     handleTripleClick: handleTripleClick
 *   }
 * });
 * ```
 */
export function handleTripleClick(view: PmEditorView, pos: number): boolean {
    const doc: PmNode = view.state.doc;
    const $cell: ResolvedPos | null = cellAround(doc.resolve(pos));
    if (!$cell) {
        return false;
    }

    view.dispatch(view.state.transaction.setSelection(new CellSelection($cell)));
    return true;
}
