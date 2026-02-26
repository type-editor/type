import type {PmEditorState, PmSelection} from '@type-editor/editor-types';
import type {PmNode, ResolvedPos} from '@type-editor/model';

import {CellSelection} from '../cellselection/CellSelection';
import {TableMap} from '../tablemap/TableMap';
import type {TableRect} from '../types/commands/TableRect';
import {type Rect} from '../types/tablemap/Rect';
import {selectionCell} from '../utils/selection-cell';


/**
 * Gets the selected rectangular region in a table.
 *
 * This helper function determines the selection bounds and adds table map,
 * table node, and table start offset to the result for convenience.
 *
 * @param state - The current editor state
 * @returns A TableRect containing the selection bounds and table context
 * @throws Error if not within a table (use isInTable() first)
 */
export function selectedRect(state: PmEditorState): TableRect {
    const selection: PmSelection = state.selection;
    const $pos: ResolvedPos = selectionCell(state);
    const table: PmNode = $pos.node(-1);
    const tableStart: number = $pos.start(-1);
    const map: TableMap = TableMap.get(table);

    const rect: Rect =
        selection instanceof CellSelection
            ? map.rectBetween(
                selection.$anchorCell.pos - tableStart,
                selection.$headCell.pos - tableStart,
            )
            : map.findCell($pos.pos - tableStart);

    return {...rect, tableStart, map, table};
}
