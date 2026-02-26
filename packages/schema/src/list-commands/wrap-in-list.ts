import type { Command, DispatchFunction, PmEditorState, PmTransaction } from '@type-editor/editor-types';
import { type Attrs, NodeRange, type NodeType, type PmNode, ResolvedPos } from '@type-editor/model';
import { findParent, type FindParentResult } from '@type-editor/util';

import { liftEntireList } from './lift-entire-list';
import { wrapRangeInList } from './wrap-range-in-list';


/**
 * Checks if a node is a list node (ordered_list or bullet_list).
 * This is determined by checking if the node's content expression
 * contains list_item children.
 */
function isListNode(node: PmNode): boolean {
    // A node is a list if its content spec matches list items
    // This works for both ordered_list and bullet_list
    return node.type.spec.content?.includes('list_item') ?? false;
}

/**
 * Finds any enclosing list node (ordered_list or bullet_list) around the selection.
 * Also handles the case where the entire document is selected (AllSelection) and
 * the document contains only list nodes as direct children.
 */
function findEnclosingList(state: PmEditorState): FindParentResult | null {
    const { $from, $to } = state.selection;

    // First, try to find a list in the ancestors (normal case)
    const ancestorList: FindParentResult | null = findParent(state.selection, isListNode);
    if (ancestorList) {
        return ancestorList;
    }

    // Handle "select all" case: when the selection spans the entire document
    // (or from the start of doc content to the end), and the $from is at doc level,
    // check if the document's children are all lists
    if ($from.depth === 0 && $from.pos === 0 && $to.pos === state.doc.content.size) {
        const doc: PmNode = state.doc;

        // Check if all direct children of doc are list nodes of the same type
        // and return the first one if so
        if (doc.childCount > 0) {
            let firstList: PmNode | null = null;
            let firstListPos = 0;
            let allSameListType = true;
            let currentPos = 0;

            for (let i = 0; i < doc.childCount; i++) {
                const child: PmNode = doc.child(i);
                if (isListNode(child)) {
                    if (firstList === null) {
                        firstList = child;
                        firstListPos = currentPos;
                    } else if (child.type !== firstList.type) {
                        allSameListType = false;
                    }
                } else {
                    // There's a non-list node, so we can't treat this as "all selected list"
                    allSameListType = false;
                    break;
                }
                currentPos += child.nodeSize;
            }

            // If all children are lists of the same type, return the first one
            if (firstList && allSameListType) {
                return {
                    position: ResolvedPos.resolve(doc, firstListPos),
                    node: firstList,
                };
            }
        }
    }

    return null;
}


/**
 * Returns a command function that wraps the selection in a list with
 * the given type and attributes. If already inside a list of the same type,
 * it will unwrap (lift) the content out of the list instead (toggle behavior).
 * If inside a list of a different type, it will convert the list to the
 * requested type.
 *
 * If `dispatch` is null, only return a value to indicate whether this is
 * possible, but don't actually perform the change.
 *
 * This command will attempt to wrap the currently selected block range
 * in a list of the specified type. The command returns `false` if the
 * selection cannot be wrapped (e.g., if there's no valid block range),
 * and `true` if the wrapping/unwrapping/conversion is possible or has been performed.
 *
 * @param listType - The node type to use for the list wrapper (e.g., bullet_list or ordered_list)
 * @param attrs - Optional attributes to apply to the list node. Defaults to null.
 * @param unwrapOnly - If true, only unwrap/lift the list if already in one, without wrapping or converting.
 *
 * @returns A command function that takes an editor state and optional dispatch function.
 *          Returns `true` if the wrap/unwrap/convert operation is possible/successful, `false` otherwise.
 *
 * @example
 * ```typescript
 * // Wrap selection in a bullet list (or unwrap if already in one)
 * const command = wrapInList(schema.nodes.bullet_list);
 * command(state, dispatch);
 *
 * // Wrap selection in an ordered list with custom attributes
 * const orderedCommand = wrapInList(schema.nodes.ordered_list, { start: 1 });
 * orderedCommand(state, dispatch);
 *
 * // Convert an existing bullet list to ordered list
 * // (when cursor is inside a bullet_list, calling wrapInList with ordered_list will convert it)
 * ```
 */
export function wrapInList(listType: NodeType,
                           attrs: Attrs | null = null,
                           unwrapOnly = false): Command {
    return (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
        const { $from, $to } = state.selection;

        // Find the closest enclosing list (of any type)
        const closestEnclosingList: FindParentResult | null = findEnclosingList(state);

        // Check if the closest enclosing list is of the same type we're trying to apply
        const isInSameTypeList: boolean = closestEnclosingList !== null &&
            closestEnclosingList.node.type === listType;

        if (isInSameTypeList && !dispatch) {
            // Menu button should appear active
            return true;
        }

        if (isInSameTypeList && closestEnclosingList) {
            // Toggle behavior: unwrap/lift the entire list
            return liftEntireList(state, dispatch, closestEnclosingList);
        }

        if(unwrapOnly) {
            // If we're only unwrapping and not in the same type list, do nothing
            return false;
        }

        // Check if we're inside a list of a different type - convert it directly
        if (closestEnclosingList) {
            // We're inside a list of a different type - convert it
            if (!dispatch) {
                return true;
            }

            const transaction: PmTransaction = state.transaction;
            const listPos: number = closestEnclosingList.position.pos;

            // Use setNodeMarkup to change the list type while preserving content
            transaction.setNodeMarkup(listPos, listType, attrs);
            dispatch(transaction.scrollIntoView());
            return true;
        }

        // Not inside any list - try to wrap in a new list
        const range: NodeRange | null = $from.blockRange($to);

        if (!range) {
            return false;
        }

        if (!dispatch) {
            // Check if wrapping is possible
            return wrapRangeInList(null, range, listType, attrs);
        }

        const transaction: PmTransaction = state.transaction;
        if (wrapRangeInList(transaction, range, listType, attrs)) {
            dispatch(transaction.scrollIntoView());
            return true;
        }

        return false;
    };
}
