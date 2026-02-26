import type {ResolvedPos} from '@type-editor/model';

/**
 * Checks if the given position points directly at a cell.
 *
 * A position "points at" a cell when its parent is a table row
 * and there is a node immediately after the position.
 *
 * @param $pos - The resolved position to check.
 * @returns True if the position points at a cell, false otherwise.
 *
 * @example
 * ```typescript
 * if (pointsAtCell($pos)) {
 *     const cell = $pos.nodeAfter;
 *     // Process the cell...
 * }
 * ```
 */
export function pointsAtCell($pos: ResolvedPos): boolean {
    return $pos.parent.type.spec.tableRole === 'row' && !!$pos.nodeAfter;
}
