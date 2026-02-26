import type {ResolvedPos} from '@type-editor/model';


/**
 * Moves a position forward past the current cell.
 *
 * This function assumes the position points at a cell (see {@link pointsAtCell})
 * and returns a new resolved position after that cell.
 *
 * @param $pos - The resolved position pointing at a cell.
 * @returns A new resolved position after the cell.
 *
 * @example
 * ```typescript
 * let $cellPos = getFirstCellPos(table);
 * while (pointsAtCell($cellPos)) {
 *     processCell($cellPos.nodeAfter);
 *     $cellPos = moveCellForward($cellPos);
 * }
 * ```
 */
export function moveCellForward($pos: ResolvedPos): ResolvedPos {
    return $pos.node(0).resolve($pos.pos + $pos.nodeAfter.nodeSize);
}
