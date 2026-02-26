import type {ResolvedPos} from '@type-editor/model';


/**
 * Checks if two cell positions are within the same table.
 *
 * Two cells are considered to be in the same table if they have the same
 * depth and the first cell's position is within the bounds of the second
 * cell's parent table.
 *
 * @param $cellA - The resolved position of the first cell.
 * @param $cellB - The resolved position of the second cell.
 * @returns True if both cells are in the same table, false otherwise.
 *
 * @example
 * ```typescript
 * if (inSameTable($anchorCell, $headCell)) {
 *     // Create a cell selection spanning these cells
 * }
 * ```
 */
export function inSameTable($cellA: ResolvedPos, $cellB: ResolvedPos): boolean {
    return (
        $cellA.depth === $cellB.depth &&
        $cellA.pos >= $cellB.start(-1) &&
        $cellA.pos <= $cellB.end(-1)
    );
}
