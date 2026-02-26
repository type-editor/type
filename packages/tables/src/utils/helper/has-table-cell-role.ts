import type {PmNode} from '@type-editor/model';

import type {TableRole} from '../../schema';


/**
 * Checks if a node has a table cell role (regular cell or header cell).
 *
 * @param node - The node to check.
 * @returns True if the node is a cell or header cell, false otherwise.
 */
export function hasTableCellRole(node: PmNode): boolean {
    const role = node.type.spec.tableRole as TableRole;
    return role === 'cell' || role === 'header_cell';
}
