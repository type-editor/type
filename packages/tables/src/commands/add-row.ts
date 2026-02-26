import {isUndefinedOrNull} from '@type-editor/commons';
import type {PmTransaction} from '@type-editor/editor-types';
import type {Attrs, NodeType, PmNode} from '@type-editor/model';

import {tableNodeTypes} from '../schema';
import type {TableRect} from '../types/commands/TableRect';
import {rowIsHeader} from './row-is-header';


/**
 * Adds a row at the given position in a table.
 *
 * This function handles:
 * - Extending cells that span across the insertion point via rowspan
 * - Creating new cells with the appropriate type (header or regular)
 * - Maintaining table structure integrity
 *
 * @param transaction - The transaction to apply changes to
 * @param tableRect - The table rectangle containing map, tableStart, and table
 * @param row - The row index where the new row should be inserted
 * @returns The modified transaction
 */
export function addRow(transaction: PmTransaction,
                       {map, tableStart, table}: TableRect,
                       row: number): PmTransaction {
    let rowPos: number = tableStart;
    for (let i = 0; i < row; i++) {
        rowPos += table.child(i).nodeSize;
    }

    const cells: Array<PmNode> = [];
    let refRow: number | null = row > 0 ? -1 : 0;
    if (rowIsHeader(map, table, row + refRow)) {
        refRow = row === 0 || row === map.height ? null : 0;
    }

    for (let col = 0, index = map.width * row; col < map.width; col++, index++) {
        // Covered by a rowspan cell
        if (
            row > 0 &&
            row < map.height &&
            map.map[index] === map.map[index - map.width]
        ) {
            const pos: number = map.map[index];
            const attrs: Attrs = table.nodeAt(pos).attrs;

            transaction.setNodeMarkup(tableStart + pos, null, {
                ...attrs,
                rowspan: (attrs.rowspan as number) + 1
            });

            col += attrs.colspan - 1;
        } else {
            const refCell: PmNode = isUndefinedOrNull(refRow)
                ? null
                : table.nodeAt(map.map[index + refRow * map.width]);
            const type: NodeType = refCell?.type ?? tableNodeTypes(table.type.schema).cell;

            const node: PmNode = type.createAndFill();
            if (node) {
                cells.push(node);
            }
        }
    }
    transaction.insert(rowPos, tableNodeTypes(table.type.schema).row.create(null, cells));
    return transaction;
}
