import type {ResolvedPos} from '@type-editor/model';

import type {TableMap} from '../../../tablemap/TableMap';


/**
 * Calculates the rightmost column index for a cell, accounting for colspan.
 *
 * @param map - The table map for the table containing the cell.
 * @param tableStart - The document position where the table starts.
 * @param $cell - The resolved position of the cell.
 * @returns The zero-based index of the rightmost column spanned by the cell.
 */
export function getRightmostColumn(map: TableMap, tableStart: number, $cell: ResolvedPos): number {
    const colspan: number = ($cell.nodeAfter?.attrs.colspan as number) ?? 1;
    return map.colCount($cell.pos - tableStart) + colspan - 1;
}
