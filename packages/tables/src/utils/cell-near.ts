import type {PmNode, ResolvedPos} from '@type-editor/model';

import {hasTableCellRole} from './helper/has-table-cell-role';


/**
 * Finds a cell near the given position by traversing adjacent nodes.
 *
 * This function first looks forward through nodeAfter and its first children,
 * then looks backward through nodeBefore and its last children. This is useful
 * when the position is at a table boundary rather than inside a cell.
 *
 * @param $pos - The resolved position to search from.
 * @returns The resolved position of the nearby cell, or undefined if none found.
 *
 * @example
 * ```typescript
 * const $cell = cellNear($pos);
 * if ($cell) {
 *     console.log('Found cell near position');
 * }
 * ```
 */
export function cellNear($pos: ResolvedPos): ResolvedPos | undefined {
    // Search forward through nodeAfter chain
    for (
        let after: PmNode = $pos.nodeAfter, pos = $pos.pos;
        after;
        after = after.firstChild, pos++
    ) {
        if (hasTableCellRole(after)) {
            return $pos.doc.resolve(pos);
        }
    }

    // Search backward through nodeBefore chain
    for (
        let before: PmNode = $pos.nodeBefore, pos = $pos.pos;
        before;
        before = before.lastChild, pos--
    ) {
        if (hasTableCellRole(before)) {
            return $pos.doc.resolve(pos - before.nodeSize);
        }
    }

    return undefined;
}
