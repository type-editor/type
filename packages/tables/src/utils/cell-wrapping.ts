import type {PmNode, ResolvedPos} from '@type-editor/model';

import type {TableRole} from '../schema';


/**
 * Finds the cell node that wraps the given position.
 *
 * Unlike {@link cellAround}, this function returns the actual cell node
 * rather than a resolved position. It checks the current depth and all
 * ancestor nodes to find a cell.
 *
 * @param $pos - The resolved position to search from.
 * @returns The cell node wrapping the position, or null if not inside a cell.
 *
 * @example
 * ```typescript
 * const cellNode = cellWrapping(state.selection.$head);
 * if (cellNode) {
 *     console.log('Cell colspan:', cellNode.attrs.colspan);
 * }
 * ```
 */
export function cellWrapping($pos: ResolvedPos): null | PmNode {
    for (let depth = $pos.depth; depth > 0; depth--) {
        const nodeAtDepth: PmNode = $pos.node(depth);
        const role = nodeAtDepth.type.spec.tableRole as TableRole;

        if (role === 'cell' || role === 'header_cell') {
            return nodeAtDepth;
        }
    }

    return null;
}
