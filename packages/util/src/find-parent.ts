import type { PmSelection } from '@type-editor/editor-types';
import { type NodeType, type PmNode, ResolvedPos } from '@type-editor/model';

import type { FindCallbackFunction } from './types/FindCallbackFunction';
import type { FindParentResult } from './types/FindParentResult';

/**
 * Finds the nearest ancestor node in the document tree that satisfies the given predicate.
 *
 * The search starts from the common parent of the selection and traverses upward
 * through the document hierarchy until a matching node is found or the root is reached.
 *
 * @param selection - The current editor selection to search from.
 * @param predicate - A callback function that tests each ancestor node.
 *                    Should return `true` when the desired node is found.
 * @returns The matching parent node with its resolved position, or `null` if no match is found.
 *
 * @example
 * ```typescript
 * // Find the nearest list item ancestor
 * const listItem = findParent(selection, node => node.type.name === 'list_item');
 * ```
 */
export function findParent(selection: PmSelection,
                           predicate: FindCallbackFunction): FindParentResult | null {
    const { $from } = selection;

    // First, check if the common parent satisfies the predicate
    const commonParent = findCommonParent(selection);
    if (commonParent && predicate(commonParent.node)) {
        return commonParent;
    }

    // Traverse up from $from to find a matching ancestor
    for (let depth = $from.depth; depth > 0; depth--) {
        const node = $from.node(depth);

        if (predicate(node)) {
            const position = ResolvedPos.resolve($from.doc, $from.before(depth));
            return { position, node };
        }
    }

    return null;
}

/**
 * Finds the nearest ancestor node of a specific type.
 *
 * This is a convenience wrapper around {@link findParent} that matches nodes by their type.
 *
 * @param selection - The current editor selection to search from.
 * @param nodeType - The node type to search for.
 * @returns The matching parent node with its resolved position, or `null` if no match is found.
 *
 * @example
 * ```typescript
 * // Find the nearest paragraph ancestor
 * const paragraph = findParentByType(selection, schema.nodes.paragraph);
 * ```
 */
export function findParentByType(selection: PmSelection,
                                 nodeType: NodeType): FindParentResult | null {
    return findParent(selection, (node: PmNode) => node.type === nodeType);
}

/**
 * Finds the deepest common ancestor node that contains both ends of the selection.
 *
 * For a collapsed selection or when both ends share the same parent,
 * returns that immediate parent. For selections spanning multiple nodes,
 * traverses upward to find the first ancestor that contains both endpoints.
 *
 * @param selection - The current editor selection.
 * @returns The common parent node with its resolved position, or `null` if none exists
 *          (should only occur for invalid selections).
 *
 * @example
 * ```typescript
 * // Get the container of the current selection
 * const container = findCommonParent(selection);
 * if (container) {
 *   console.log('Selection is within:', container.node.type.name);
 * }
 * ```
 */
export function findCommonParent(selection: PmSelection): FindParentResult | null {
    const { $from, $to } = selection;

    // Fast path: both ends share the same immediate parent
    if ($from.sameParent($to)) {
        const position = $from.depth > 0
            ? ResolvedPos.resolve($from.doc, $from.before())
            : ResolvedPos.resolve($from.doc, 0);

        return { position, node: $from.parent };
    }

    // Find the deepest common ancestor by comparing nodes at each depth
    const minDepth = Math.min($from.depth, $to.depth);

    for (let depth = minDepth; depth >= 0; depth--) {
        const fromNode: PmNode = $from.node(depth);
        const toNode: PmNode = $to.node(depth);

        if (fromNode === toNode) {
            const position: ResolvedPos = depth > 0
                ? ResolvedPos.resolve($from.doc, $from.before(depth))
                : ResolvedPos.resolve($from.doc, 0);

            return { position, node: fromNode };
        }
    }

    return null;
}
