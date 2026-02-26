import type {PmNode, ResolvedPos} from '@type-editor/model';

import {TableMap} from '../tablemap/TableMap';


/**
 * Finds the next cell in a given direction along an axis.
 *
 * Navigates from the current cell position to find an adjacent cell,
 * properly handling cells that span multiple rows or columns.
 *
 * @param $pos - A resolved position pointing at or within a cell.
 * @param axis - The axis to move along: 'horiz' for left/right, 'vert' for up/down.
 * @param dir - The direction to move: positive for right/down, negative for left/up.
 * @returns The resolved position of the next cell, or null if at the table boundary.
 *
 * @example
 * ```typescript
 * const nextRight = nextCell($cellPos, 'horiz', 1);
 * const nextUp = nextCell($cellPos, 'vert', -1);
 * ```
 */
export function nextCell($pos: ResolvedPos,
                         axis: 'horiz' | 'vert',
                         dir: number): ResolvedPos | null {
    const table: PmNode = $pos.node(-1);
    const map: TableMap = TableMap.get(table);
    const tableStart: number = $pos.start(-1);

    const movedPos: number = map.nextCell($pos.pos - tableStart, axis, dir);
    return movedPos === null ? null : $pos.node(0).resolve(tableStart + movedPos);
}
