import {Decoration, DecorationSet} from '@type-editor/decoration';
import type {DecorationSource, PmEditorState} from '@type-editor/editor-types';
import type {PmNode} from '@type-editor/model';

import {CellSelection} from './CellSelection';

/**
 * Creates decorations to visually highlight selected cells in the editor.
 *
 * This function is typically used as part of a ProseMirror plugin's decorations
 * to apply the 'selectedCell' CSS class to all cells within a CellSelection.
 *
 * @param state - The current editor state.
 * @returns A DecorationSource containing node decorations for selected cells,
 *          or `null` if the current selection is not a CellSelection.
 *
 * @example
 * ```typescript
 * // In a plugin's props.decorations:
 * decorations: (state) => drawCellSelection(state)
 * ```
 */
export function drawCellSelection(state: PmEditorState): DecorationSource | null {
    if (!(state.selection instanceof CellSelection)) {
        return null;
    }

    // Create decorations for each selected cell to apply the 'selectedCell' CSS class
    const cells: Array<Decoration> = [];
    state.selection.forEachCell((node: PmNode, pos: number): void => {
        cells.push(Decoration.node(pos, pos + node.nodeSize, {class: 'selectedCell'}));
    });

    return DecorationSet.create(state.doc, cells);
}
