/**
 * Query utilities for table cell and table node lookups.
 *
 * This module provides helper functions for finding and resolving table-related
 * positions within the editor document. It includes utilities for:
 * - Finding cells by position
 * - Finding table nodes containing a position
 * - Finding cell ranges for selections
 *
 * @module utils/query
 */

import {isUndefinedOrNull} from '@type-editor/commons';
import type {PmSelection} from '@type-editor/editor-types';
import type {PmNode, ResolvedPos} from '@type-editor/model';

import {CellSelection} from '../cellselection/CellSelection';
import {cellAround} from './cell-around';
import {cellNear} from './cell-near';
import {inSameTable} from './in-same-table';

/**
 * Result of finding a parent node that matches a predicate.
 *
 * This interface provides comprehensive information about a found node,
 * including its position in the document and its depth in the node tree.
 */
export interface FindNodeResult {
    /**
     * The closest parent node that satisfies the predicate.
     */
    node: PmNode;

    /**
     * The position directly before the node.
     * For the root node (depth 0), this is always 0.
     */
    pos: number;

    /**
     * The position at the start of the node's content.
     * This is the position immediately after the opening of the node.
     */
    start: number;

    /**
     * The depth of the node in the document tree.
     * The root document has depth 0, and each nested level increases by 1.
     */
    depth: number;
}

/**
 * Type guard to check if a value is a {@link CellSelection} instance.
 *
 * This function safely determines whether an unknown value is a cell selection,
 * enabling type-safe access to cell selection properties and methods.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a `CellSelection` instance, `false` otherwise.
 *
 * @example
 * ```typescript
 * if (isCellSelection(editor.state.selection)) {
 *     const anchorCell = editor.state.selection.$anchorCell;
 *     const headCell = editor.state.selection.$headCell;
 * }
 * ```
 */
export function isCellSelection(value: unknown): value is CellSelection {
    return value instanceof CellSelection;
}

/**
 * Checks if a node has the 'table' role in its spec.
 *
 * @param node - The node to check.
 * @returns `true` if the node is a table node, `false` otherwise.
 */
function isTableNode(node: PmNode): boolean {
    return node.type.spec.tableRole === 'table';
}

/**
 * Finds the closest table node containing the given position.
 *
 * This function traverses up the document tree from the resolved position
 * to find the nearest ancestor node with a `tableRole` of `'table'` in its spec.
 *
 * @param $pos - The resolved position to search from.
 * @returns The {@link FindNodeResult} containing the table node and its position info,
 *          or `null` if the position is not inside a table.
 *
 * @example
 * ```typescript
 * const tableResult = findTable(state.selection.$from);
 * if (tableResult) {
 *     console.log('Table found at position:', tableResult.pos);
 *     console.log('Table has', tableResult.node.childCount, 'rows');
 * }
 * ```
 */
export function findTable($pos: ResolvedPos): FindNodeResult | null {
    return findParentNode(isTableNode, $pos);
}

/**
 * Finds the anchor and head cell positions for a table cell selection.
 *
 * This function attempts to determine the cell range for a selection using the following strategy:
 * 1. If no hit points are provided and the selection is already a {@link CellSelection},
 *    returns the existing anchor and head cells.
 * 2. Otherwise, uses the provided hit points (or falls back to the selection's anchor/head)
 *    to find the corresponding cells.
 * 3. Validates that both cells are in the same table before returning.
 *
 * @param selection - The current editor selection.
 * @param anchorHit - Optional position to use as the anchor hit point.
 *                    Falls back to `headHit` or `selection.anchor` if not provided.
 * @param headHit - Optional position to use as the head hit point.
 *                  Falls back to `anchorHit` or `selection.head` if not provided.
 * @returns A tuple of `[anchorCell, headCell]` resolved positions if both cells are found
 *          in the same table, or `null` if no valid cell range can be determined.
 *
 * @example
 * ```typescript
 * // Get cell range from existing cell selection
 * const range = findCellRange(state.selection);
 *
 * // Get cell range using specific hit points
 * const range = findCellRange(state.selection, mouseDownPos, mouseMovePos);
 *
 * if (range) {
 *     const [$anchorCell, $headCell] = range;
 *     // Create a new cell selection...
 * }
 * ```
 */
export function findCellRange(selection: PmSelection,
                              anchorHit?: number,
                              headHit?: number): [ResolvedPos, ResolvedPos] | null {
    // Fast path: return existing cell selection range if no hit points provided
    const hasNoHitPoints: boolean = isUndefinedOrNull(anchorHit) && isUndefinedOrNull(headHit);
    if (hasNoHitPoints && isCellSelection(selection)) {
        return [selection.$anchorCell, selection.$headCell];
    }

    // Determine positions to search from, with cascading fallbacks
    const anchorPos: number = anchorHit ?? headHit ?? selection.anchor;
    const headPos: number = headHit ?? anchorHit ?? selection.head;

    const doc: PmNode = selection.$head.doc;

    // Find cells at the calculated positions
    const $anchorCell: ResolvedPos = findCellPos(doc, anchorPos);
    const $headCell: ResolvedPos = findCellPos(doc, headPos);

    // Validate both cells exist and are in the same table
    if ($anchorCell && $headCell && inSameTable($anchorCell, $headCell)) {
        return [$anchorCell, $headCell];
    }

    return null;
}

/**
 * Finds the resolved position of a table cell at or near the given document position.
 *
 * This function first attempts to find a cell that directly contains the position
 * using {@link cellAround}. If no containing cell is found, it searches for a
 * nearby cell using {@link cellNear}.
 *
 * @param doc - The document node to search within.
 * @param pos - The document position to search from.
 * @returns The resolved position pointing to the cell, or `undefined` if no cell
 *          is found at or near the position.
 *
 * @example
 * ```typescript
 * const $cell = findCellPos(state.doc, clickPosition);
 * if ($cell) {
 *     console.log('Found cell at position:', $cell.pos);
 *     console.log('Cell node:', $cell.nodeAfter);
 * }
 * ```
 */
export function findCellPos(doc: PmNode, pos: number): ResolvedPos | undefined {
    const $pos: ResolvedPos = doc.resolve(pos);
    return cellAround($pos) ?? cellNear($pos);
}

/**
 * Finds the closest parent node that satisfies the given predicate function,
 * starting from the provided resolved position and traversing up the document tree.
 *
 * This function iterates from the current depth up to the root node (depth 0),
 * testing each node against the predicate. It returns the first matching node
 * along with its positional information.
 *
 * @param predicate - A function that tests whether a node matches the search criteria.
 *                    Returns `true` if the node matches, `false` otherwise.
 * @param $pos - The resolved position to start searching from.
 * @returns A {@link FindNodeResult} containing the matching node and its position info,
 *          or `null` if no matching node is found in the ancestor chain.
 *
 * @example
 * ```typescript
 * // Find the nearest list node
 * const isListNode = (node: Node) => node.type.name === 'bullet_list';
 * const listResult = findParentNode(isListNode, state.selection.$from);
 *
 * if (listResult) {
 *     console.log('Found list at depth:', listResult.depth);
 *     console.log('List starts at position:', listResult.start);
 * }
 * ```
 */
function findParentNode(predicate: (node: PmNode) => boolean,
                        $pos: ResolvedPos): FindNodeResult | null {
    for (let depth = $pos.depth; depth >= 0; depth -= 1) {
        const node: PmNode = $pos.node(depth);

        if (predicate(node)) {
            const pos: number = depth === 0 ? 0 : $pos.before(depth);
            const start: number = $pos.start(depth);

            return {
                node,
                pos,
                start,
                depth
            };
        }
    }

    return null;
}
