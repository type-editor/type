import type {ResolvedPos} from '@type-editor/model';

import {TableMap} from '../tablemap/TableMap';
import type {Rect} from '../types/tablemap/Rect';


/**
 * Finds the rectangular bounds of the cell at the given position.
 *
 * Uses the table map to determine the cell's position in the table grid,
 * accounting for any rowspan or colspan that may affect its bounds.
 *
 * @param $pos - A resolved position pointing at or within a cell.
 * @returns A rectangle describing the cell's bounds in the table grid.
 *
 * @example
 * ```typescript
 * const rect = findCell($cellPos);
 * console.log(`Cell spans from column ${rect.left} to ${rect.right}`);
 * ```
 */
export function findCell($pos: ResolvedPos): Rect {
    return TableMap.get($pos.node(-1)).findCell($pos.pos - $pos.start(-1));
}
