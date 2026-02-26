import type {PmEditorState, PmSelection, PmTransaction} from '@type-editor/editor-types';
import {type PmNode, type ResolvedPos} from '@type-editor/model';
import {TextSelection,} from '@type-editor/state';

import type {TableRole} from '../schema';
import {TableMap} from '../tablemap/TableMap';
import {CellSelection} from './CellSelection';


/** The set of table roles that represent cell nodes. */
const CELL_ROLES: ReadonlySet<TableRole> = new Set(['cell', 'header_cell']);


/**
 * Normalizes table-related selections to ensure consistent behavior.
 *
 * This function handles several edge cases:
 * - Converts node selections on cells to CellSelection
 * - Converts node selections on rows to full row CellSelection
 * - Converts node selections on tables to select all cells (if not allowed)
 * - Normalizes selections at cell boundaries to collapsed selections
 * - Normalizes text selections spanning multiple cells to stay within the first cell
 *
 * @param state - The current editor state.
 * @param transaction - The optional transaction to apply the normalization to.
 * @param allowTableNodeSelection - Whether to allow node selection of the entire table.
 * @returns The transaction with the normalized selection, or `undefined` if no normalization was needed.
 */
export function normalizeSelection(state: PmEditorState,
                                   transaction: PmTransaction | undefined,
                                   allowTableNodeSelection: boolean): PmTransaction | undefined {
    const selection: PmSelection = (transaction || state).selection;
    const doc: PmNode = (transaction || state).doc;

    const normalize: PmSelection | undefined = computeNormalizedSelection(selection, doc, allowTableNodeSelection);

    // Apply the normalized selection if one was created
    if (normalize) {
        if (!transaction) {
            transaction = state.transaction;
        }
        if (transaction) {
            transaction.setSelection(normalize);
        }
    }

    return transaction;
}

/**
 * Computes the normalized selection for a given selection, if normalization is needed.
 *
 * @param selection - The current selection.
 * @param doc - The document node.
 * @param allowTableNodeSelection - Whether to allow node selection of the entire table.
 * @returns The normalized selection, or `undefined` if no normalization is needed.
 */
function computeNormalizedSelection(selection: PmSelection,
                                    doc: PmNode,
                                    allowTableNodeSelection: boolean): PmSelection | undefined {
    // Handle node selections on table-related elements
    if (selection.isNodeSelection()) {
        return normalizeNodeSelection(selection, doc, allowTableNodeSelection);
    }

    // Handle text selections
    if (selection.isTextSelection()) {
        return normalizeTextSelection(selection, doc);
    }

    return undefined;
}

/**
 * Normalizes a text selection that may be at a cell boundary or span multiple cells.
 *
 * @param selection - The text selection to normalize.
 * @param doc - The document node.
 * @returns The normalized selection, or `undefined` if no normalization is needed.
 */
function normalizeTextSelection(selection: PmSelection, doc: PmNode): PmSelection | undefined {
    if (isCellBoundarySelection(selection)) {
        // Normalize selections at cell boundaries to collapsed selection
        return TextSelection.create(doc, selection.from);
    }

    if (isTextSelectionAcrossCells(selection)) {
        // Normalize text selections spanning multiple cells to stay within first cell
        return TextSelection.create(doc, selection.$from.start(), selection.$from.end());
    }

    return undefined;
}

/**
 * Normalizes a node selection on table-related elements.
 *
 * @param selection - The node selection to normalize.
 * @param doc - The document node.
 * @param allowTableNodeSelection - Whether to allow node selection of the entire table.
 * @returns The normalized selection, or `undefined` if no normalization is needed.
 */
function normalizeNodeSelection(selection: PmSelection,
                                doc: PmNode,
                                allowTableNodeSelection: boolean): PmSelection | undefined {
    const node: PmNode = selection.node;
    if (!node) {
        return undefined;
    }

    const role = node.type.spec.tableRole as TableRole | undefined;

    if (!role) {
        return undefined;
    }

    if (CELL_ROLES.has(role)) {
        // Convert cell node selection to CellSelection
        return CellSelection.create(doc, selection.from);
    }

    if (role === 'row') {
        // Convert row node selection to full row CellSelection
        const $cell: ResolvedPos = doc.resolve(selection.from + 1);
        return CellSelection.rowSelection($cell, $cell);
    }

    if (role === 'table' && !allowTableNodeSelection) {
        // Convert table node selection to select all cells
        const map: TableMap = TableMap.get(node);
        const start: number = selection.from + 1;
        const lastCell: number = start + map.map[map.width * map.height - 1];
        return CellSelection.create(doc, start + 1, lastCell);
    }

    return undefined;
}

/**
 * Determines if a selection is at a cell boundary position.
 *
 * A cell boundary selection occurs when the selection spans exactly between
 * the end of one node and the start of another within a table structure.
 * This is used to normalize such selections to prevent unexpected behavior.
 *
 * @param selection - The selection to check, destructured to $from and $to positions.
 * @returns `true` if the selection is at a cell boundary, `false` otherwise.
 */
function isCellBoundarySelection({$from, $to}: PmSelection): boolean {
    // Quick check: selection must be small and non-empty (typical cell boundary pattern)
    if ($from.pos === $to.pos || $from.pos < $to.pos - 6) {
        return false;
    }

    let afterFrom: number = $from.pos;
    let beforeTo: number = $to.pos;
    let depth: number = $from.depth;

    // Walk up from $from to find the depth where we're at the end of a node
    // This identifies if we're at a cell boundary
    for (; depth >= 0; depth--, afterFrom++) {
        if ($from.after(depth + 1) < $from.end(depth)) {
            break;
        }
    }

    // Walk up from $to to find where we're at the start of a node
    for (let d: number = $to.depth; d >= 0; d--, beforeTo--) {
        if ($to.before(d + 1) > $to.start(d)) {
            break;
        }
    }

    // Check if both positions meet at the same point and are within a table row or table
    if (afterFrom !== beforeTo || depth < 0) {
        return false;
    }

    const nodeRole: unknown = $from.node(depth).type.spec.tableRole;
    return nodeRole === 'row' || nodeRole === 'table';
}

/**
 * Determines if a text selection spans across multiple table cells.
 *
 * This check is used to normalize selections that start in one cell and
 * end at the beginning of another cell, which can occur during certain
 * selection operations.
 *
 * @param selection - The selection to check, destructured to $from and $to positions.
 * @returns `true` if the selection spans multiple cells, `false` otherwise.
 */
function isTextSelectionAcrossCells({$from, $to}: PmSelection): boolean {
    const fromCell: PmNode | undefined = findContainingCell($from);
    const toCell: PmNode | undefined = findContainingCell($to);

    // Selection spans cells if they're in different cells and $to is at the start of its parent
    return fromCell !== toCell && $to.parentOffset === 0;
}

/**
 * Finds the closest containing cell node for a resolved position.
 *
 * @param $pos - The resolved position to search from.
 * @returns The cell node containing the position, or `undefined` if not in a cell.
 */
function findContainingCell($pos: ResolvedPos): PmNode | undefined {
    for (let i: number = $pos.depth; i > 0; i--) {
        const node: PmNode = $pos.node(i);
        const role = node.type.spec.tableRole as TableRole | undefined;
        if (role && CELL_ROLES.has(role)) {
            return node;
        }
    }
    return undefined;
}
