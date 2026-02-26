import type {PmEditorView} from '@type-editor/editor-types';
import type {PmNode} from '@type-editor/model';

import type {Axis} from '../../types/input/Axis';


/**
 * Checks whether the cursor is at the edge of a cell in the specified direction.
 *
 * This is used to determine if arrow key navigation should move to an adjacent cell
 * rather than staying within the current cell.
 *
 * @param view - The editor view.
 * @param axis - The axis of movement ('horiz' for horizontal, 'vert' for vertical).
 * @param dir - The direction of movement (-1 for left/up, 1 for right/down).
 * @returns The position of the cell if at its edge, or `null` if not at an edge.
 */
export function atEndOfCell(view: PmEditorView, axis: Axis, dir: number): null | number {
    if (!view.state.selection.isTextSelection()) {
        return null;
    }

    const {$head} = view.state.selection;
    for (let d = $head.depth - 1; d >= 0; d--) {
        const parent: PmNode = $head.node(d);
        const index: number = dir < 0 ? $head.index(d) : $head.indexAfter(d);

        if (index !== (dir < 0 ? 0 : parent.childCount)) {
            return null;
        }

        if (
            parent.type.spec.tableRole === 'cell' ||
            parent.type.spec.tableRole === 'header_cell'
        ) {
            const cellPos: number = $head.before(d);
            const dirStr: 'up' | 'down' | 'left' | 'right' =
                axis === 'vert'
                    ? (dir > 0 ? 'down' : 'up')
                    : dir > 0 ? 'right' : 'left';

            return view.endOfTextblock(dirStr) ? cellPos : null;
        }
    }
    return null;
}
