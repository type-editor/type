import type {PmEditorState, PmEditorView, PmTransaction} from '@type-editor/editor-types';
import type {Command, DispatchFunction} from '@type-editor/editor-types';
import { type ContentMatch, type NodeType, PmNode, type ResolvedPos } from '@type-editor/model';
import {Selection} from '@type-editor/state';

import {TableMap} from '../tablemap/TableMap';


/**
 * Command that handles ArrowDown when the cursor is in the last row of a table
 * and there is no selectable content after the table.
 *
 * In this case the browser would normally jump to the content *before* the table
 * (e.g. the heading above it). This command intercepts that situation and instead
 * inserts a new empty paragraph directly after the table, placing the cursor inside it.
 *
 * The command is a no-op (returns false) when:
 * - The cursor is not inside a table cell.
 * - The cursor is not in the last row of the table.
 * - There is already selectable content after the table.
 */
export const escapeTableDown: Command = (state: PmEditorState,
                                         dispatch: DispatchFunction,
                                         _view: PmEditorView): boolean => {
    const {$head} = state.selection;

    // Walk up to find the cell and its depth.
    let cellDepth = -1;
    for (let d = $head.depth; d > 0; d--) {
        const role = $head.node(d).type.spec.tableRole as string | undefined;
        if (role === 'cell' || role === 'header_cell') {
            cellDepth = d;
            break;
        }
    }
    if (cellDepth === -1) {
        return false;
    }

    // The table is one level above the row, which is one level above the cell.
    // cellDepth is the depth of the cell node itself.
    // $head.node(cellDepth - 1) = row, $head.node(cellDepth - 2) = table.
    const tableDepth: number = cellDepth - 2;
    if (tableDepth < 1) {
        return false;
    }

    const tableNode: PmNode = $head.node(tableDepth);
    const map: TableMap = TableMap.get(tableNode);
    const tableStart: number = $head.start(tableDepth);

    // Find the row index of the current cell.
    const cellStartInTable: number = $head.before(cellDepth) - tableStart;
    const cellIndex: number = map.map.indexOf(cellStartInTable);
    if (cellIndex === -1) {
        return false;
    }
    const rowIndex: number = Math.floor(cellIndex / map.width);

    // Only act when the cursor is in the last row.
    if (rowIndex < map.height - 1) {
        return false;
    }

    // Check whether there is any content after the table.
    // $head.after(tableDepth) is the position right after the table node.
    const afterTablePos: number = $head.after(tableDepth);

    // The parent of the table (usually the document).
    const tableParentDepth: number = tableDepth - 1;
    const tableParent: PmNode = $head.node(tableParentDepth);

    // If there is a node after the table in the parent, let the browser handle it.
    const tableIndexInParent: number = $head.index(tableParentDepth);
    if (tableIndexInParent < tableParent.childCount - 1) {
        // There is a sibling after the table – check if Selection.near finds it.
        const $after: ResolvedPos = state.doc.resolve(afterTablePos);
        const candidate: ReturnType<typeof Selection.near> = Selection.near($after, 1);
        if (candidate.from >= afterTablePos) {
            // Valid content exists after the table; let normal handling take over.
            return false;
        }
    }

    // The table is the last child of its parent (or nothing selectable after it).
    // Insert a new paragraph after the table and place the cursor inside.
    if (!dispatch) {
        return true;
    }

    // Find the appropriate block node type to insert.
    const afterTableIndex: number = tableIndexInParent + 1;
    const parentMatch: ContentMatch = tableParent.contentMatchAt(afterTableIndex);
    const insertType: NodeType | null = parentMatch.defaultType;

    if (!insertType) {
        return false;
    }

    const newNode: PmNode = insertType.createAndFill();
    if (!newNode) {
        return false;
    }

    const transaction: PmTransaction = state.transaction.insert(afterTablePos, newNode);
    const $insertedPos: ResolvedPos = transaction.doc.resolve(afterTablePos + 1);
    transaction.setSelection(Selection.near($insertedPos, 1)).scrollIntoView();
    dispatch(transaction);
    return true;
};
