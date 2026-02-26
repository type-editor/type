import type { Command, DispatchFunction, PmEditorState, PmEditorView, PmTransaction } from '@type-editor/editor-types';
import { Fragment, type NodeType, type PmNode, type ResolvedPos, Slice } from '@type-editor/model';
import { TextSelection } from '@type-editor/state';

/**
 * Creates a command that sets an attribute on nodes within the current selection.
 *
 * This command has two modes of operation:
 *
 * 1. **Parent mode** (when `applyToParent` is specified): Finds the outermost ancestor node
 *    matching one of the specified node types and sets the attribute on it. This is useful
 *    for setting attributes on block-level containers like paragraphs or headings.
 *
 * 2. **Selection mode** (default): Traverses all nodes within the selection range and
 *    updates the attribute on any non-text node that supports it.
 *
 * The command preserves the current selection after applying changes and uses structural
 * sharing to minimize memory allocations when transforming the document.
 *
 * @param attributeName - The name of the attribute to set.
 * @param attribute - The value to set for the attribute.
 * @param applyToParent - Optional list of node types. If provided, the attribute will be
 *                        applied to the outermost ancestor matching one of these types
 *                        instead of nodes within the selection.
 * @returns A command function that sets the attribute when executed. Returns `true` if
 *          the attribute was changed, `false` if no change was needed.
 */
export function setAttribute(attributeName: string, attribute: string, ...applyToParent: Array<NodeType>): Command {

    return (state: PmEditorState, dispatch?: DispatchFunction, _view?: PmEditorView): boolean => {
        const { from, to } = state.selection;

        // If applyToParent is specified, try to find the outermost parent of that type
        if (applyToParent && applyToParent.length > 0) {
            const $pos: ResolvedPos = state.doc.resolve(from);
            let outermostParentDepth: number | null = null;

            // Traverse from root (depth 0) to current position to find the outermost matching parent
            for (let depth = 0; depth <= $pos.depth; depth++) {
                const node: PmNode = $pos.node(depth);
                if (applyToParent.includes(node.type) && node.type.spec.attrs?.[attributeName]) {
                    outermostParentDepth = depth;
                    break; // We want the outermost (first found from root)
                }
            }

            if (outermostParentDepth !== null) {
                const parentNode = $pos.node(outermostParentDepth);

                // Check if the attribute value is different
                if (parentNode.attrs[attributeName] === attribute) {
                    return false; // No change needed
                }

                if (!dispatch) {
                    return true;
                }

                const transaction: PmTransaction = state.transaction;
                const parentPos = $pos.before(outermostParentDepth);

                // Set the attribute on the outermost parent node, preserving its marks
                transaction.setNodeMarkup(parentPos, undefined, {
                    ...parentNode.attrs,
                    [attributeName]: attribute
                }, parentNode.marks);

                dispatch(transaction);
                return true;
            }
            // If no matching parent found, fall through to the default implementation
        }

        // Check if any nodes need updating
        let hasMatchingNodes = false;

        state.doc.nodesBetween(from, to, (node: PmNode): boolean | undefined => {
            if (!node.isText && node.type.spec.attrs?.[attributeName]) {
                if (node.attrs[attributeName] !== attribute) {
                    hasMatchingNodes = true;
                    return false; // Stop searching, we found at least one
                }
            }
            return true;
        });

        if (!hasMatchingNodes) {
            return false;
        }

        if (!dispatch) {
            return true;
        }


        const transaction: PmTransaction = state.transaction;

        // Transform the document's content, updating attributes on nodes that overlap with the selection
        const transformedContent = transformFragment(
            state.doc.content,
            attributeName,
            attribute,
            from,
            to
        );

        if (transformedContent === state.doc.content) {
            return false;
        }

        // Replace the entire document content
        transaction.replace(0, state.doc.content.size, new Slice(transformedContent, 0, 0));

        // Restore selection
        const newFrom = Math.min(from, transaction.doc.content.size);
        const newTo = Math.min(to, transaction.doc.content.size);

        try {
            transaction.setSelection(TextSelection.create(transaction.doc, newFrom, newTo));
        } catch (_e) {
            // If the selection is invalid, just keep the default selection
        }

        dispatch(transaction);
        return true;
    };
}

/**
 * Transform a fragment, updating attributes on matching nodes within the given range.
 * Returns the same fragment if no changes were made (for structural sharing).
 *
 * @param fragment The fragment to transform
 * @param attributeName The attribute name to set
 * @param attribute The attribute value to set
 * @param rangeFrom Start of the selection range (in document coordinates relative to fragment start)
 * @param rangeTo End of the selection range (in document coordinates relative to fragment start)
 */
function transformFragment(fragment: Fragment,
                           attributeName: string,
                           attribute: string,
                           rangeFrom: number,
                           rangeTo: number): Fragment {
    let changed = false;
    const newChildren: Array<PmNode> = [];
    let pos = 0;

    for (let i = 0; i < fragment.childCount; i++) {
        const child = fragment.child(i);
        const childEnd = pos + child.nodeSize;

        // Check if this child overlaps with our range
        if (childEnd > rangeFrom && pos < rangeTo) {
            // Calculate the range relative to child's content for recursion
            // pos + 1 is where the child's content starts
            const contentStart = pos + 1;
            const childRangeFrom = Math.max(0, rangeFrom - contentStart);
            const childRangeTo = Math.max(0, Math.min(child.content.size, rangeTo - contentStart));

            const transformedChild = transformNode(
                child,
                attributeName,
                attribute,
                childRangeFrom,
                childRangeTo
            );

            if (transformedChild !== child) {
                changed = true;
            }
            newChildren.push(transformedChild);
        } else {
            newChildren.push(child);
        }

        pos = childEnd;
    }

    return changed ? Fragment.from(newChildren) : fragment;
}

/**
 * Transform a single node, updating its attribute if it supports the attribute.
 * Recursively transforms children if the range extends into them.
 * Returns the same node if no changes were made (for structural sharing).
 *
 * Note: This function is only called for nodes that overlap with the selection range,
 * so if the node supports the attribute and needs updating, it should be updated.
 */
function transformNode(node: PmNode,
                       attributeName: string,
                       attribute: string,
                       rangeFrom: number,
                       rangeTo: number): PmNode {
    // Check if this node type supports the attribute and needs updating
    // The node itself is already known to overlap with the selection (checked in transformFragment)
    const shouldUpdateAttr = !node.isText &&
        node.type.spec.attrs?.[attributeName] &&
        node.attrs[attributeName] !== attribute;

    // Transform children if the node has content and the range extends into it
    let newContent = node.content;
    if (node.content.size > 0 && rangeTo > 0) {
        newContent = transformFragment(
            node.content,
            attributeName,
            attribute,
            rangeFrom,
            rangeTo
        );
    }

    // If nothing changed, return the original node (structural sharing)
    if (!shouldUpdateAttr && newContent === node.content) {
        return node;
    }

    // Create new node with updated attribute and/or content
    if (shouldUpdateAttr) {
        const newAttrs = { ...node.attrs, [attributeName]: attribute };
        return node.type.create(newAttrs, newContent, node.marks);
    } else {
        return node.copy(newContent);
    }
}
