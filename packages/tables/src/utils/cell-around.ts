import type {PmNode, ResolvedPos} from '@type-editor/model';

/**
 * Finds the resolved position of the cell containing the given position.
 *
 * This function walks up the document tree from the given position to find
 * the nearest cell boundary. It returns a resolved position pointing to the
 * start of the cell node.
 *
 * @param $pos - The resolved position to search from.
 * @returns The resolved position of the containing cell, or null if the
 *          position is not inside a table cell.
 *
 * @example
 * ```typescript
 * const $cell = cellAround(state.selection.$head);
 * if ($cell) {
 *     console.log('Cursor is in cell at position:', $cell.pos);
 * }
 * ```
 */
export function cellAround($pos: ResolvedPos): ResolvedPos | null {
    for (let depth = $pos.depth - 1; depth > 0; depth--) {
        const nodeAtDepth: PmNode = $pos.node(depth);
        if (nodeAtDepth.type.spec.tableRole === 'row') {
            return $pos.node(0).resolve($pos.before(depth + 1));
        }
    }

    return null;
}
