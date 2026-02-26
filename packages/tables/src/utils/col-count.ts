import type {ResolvedPos} from '@type-editor/model';

import {TableMap} from '../tablemap/TableMap';


/**
 * Gets the column index of the cell at the given position.
 *
 * For cells that span multiple columns, this returns the index of the
 * leftmost column the cell occupies.
 *
 * @param $pos - A resolved position pointing at or within a cell.
 * @returns The zero-based column index of the cell.
 *
 * @example
 * ```typescript
 * const column = colCount($cellPos);
 * console.log(`Cell is in column ${column}`);
 * ```
 */
export function colCount($pos: ResolvedPos): number {
    return TableMap.get($pos.node(-1)).colCount($pos.pos - $pos.start(-1));
}
