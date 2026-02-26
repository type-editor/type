import {isUndefinedOrNull} from '@type-editor/commons';
import {Decoration, DecorationSet} from '@type-editor/decoration';
import type {PmDecoration, PmEditorState} from '@type-editor/editor-types';
import type {PmNode, ResolvedPos} from '@type-editor/model';

import {TableMap} from '../../tablemap/TableMap';
import {columnResizingPluginKey} from '../column-resizing-plugin-key';
import {getRightmostColumn} from './util/get-rightmost-column';


/**
 * Creates decorations for the column resize handle at the specified cell position.
 * This includes a widget decoration for the resize handle itself and optionally
 * a node decoration with a dragging class when actively resizing.
 *
 * @param state - The current editor state.
 * @param cell - The document position of the cell where the resize handle should appear.
 * @returns A DecorationSet containing the resize handle decorations.
 */
export function handleDecorations(state: PmEditorState,
                                  cell: number): DecorationSet {
    if (isUndefinedOrNull(cell)) {
        return DecorationSet.empty;
    }

    const decorations: Array<PmDecoration> = [];
    const $cell: ResolvedPos = state.doc.resolve(cell);

    const table: PmNode = $cell.node(-1);
    if (!table) {
        return DecorationSet.empty;
    }

    const map: TableMap = TableMap.get(table);
    const start: number = $cell.start(-1);
    const col: number = getRightmostColumn(map, start, $cell);

    // Add resize handle decorations for each cell in this column
    for (let row = 0; row < map.height; row++) {
        const index: number = col + row * map.width;
        // For positions that have either a different cell or the end
        // of the table to their right, and either the top of the table or
        // a different cell above them, add a decoration
        if (
            (col === map.width - 1 || map.map[index] !== map.map[index + 1])
            && (row === 0 || map.map[index] !== map.map[index - map.width])
        ) {
            const cellPos: number = map.map[index];
            const cellNode: PmNode = table.nodeAt(cellPos);
            if (!cellNode) {
                continue;
            }
            const pos: number = start + cellPos + cellNode.nodeSize - 1;
            const dom: HTMLDivElement = document.createElement('div');
            dom.className = 'column-resize-handle';

            // Add dragging class to the cell being resized
            if (columnResizingPluginKey.getState(state)?.dragging) {
                decorations.push(
                    Decoration.node(
                        start + cellPos,
                        start + cellPos + cellNode.nodeSize,
                        {
                            class: 'column-resize-dragging',
                        },
                    ),
                );
            }

            // Add the resize handle widget decoration
            decorations.push(Decoration.widget(pos, dom));
        }
    }

    return DecorationSet.create(state.doc, decorations);
}
