import type { PmEditorState } from '@type-editor/editor-types';
import type { Attrs, NodeType, PmNode } from '@type-editor/model';

/**
 * Checks if a node of a specific type is active at the current selection.
 *
 * For node selections, checks if the selected node matches the type and attributes.
 * For text selections, checks if the parent node of the cursor position matches
 * the type and attributes (only when the selection end is within the parent).
 *
 * @param state - The current editor state
 * @param nodeType - The node type to check for
 * @param attrs - Optional attributes that the node must match
 * @param defaultTrueIfAttributeNotSet - If true, returns true when attribute on node is not set
 * @param checkParents - Check given parent node types instead
 * @returns True if a matching node is active, false otherwise
 */
export function isNodeActive(state: PmEditorState,
                             nodeType?: NodeType,
                             attrs?: Attrs,
                             defaultTrueIfAttributeNotSet = false,
                             ...checkParents: Array<NodeType>): boolean {
    const { $from, to, node } = state.selection;

    // Cases A & B: checkParents is set and attrs is set
    if (checkParents && checkParents.length > 0 && attrs) {
        const matchedParents: Array<PmNode> = [];

        // Collect all parent nodes matching the given types
        // Use $from directly since it's already a ResolvedPos
        for (let depth = 0; depth <= $from.depth; depth++) {
            const parentNode: PmNode = $from.node(depth);
            if (checkParents.includes(parentNode.type)) {
                matchedParents.push(parentNode);
            }
        }

        // If no matching parent nodes found, check the current node or $from.parent
        if (matchedParents.length === 0) {
            const nodeToCheck = node || $from.parent;
            if (nodeToCheck) {
                // If node has the attr key(s), check if attrs match
                if (hasAnyAttrKey(nodeToCheck.attrs, attrs)) {
                    return hasAttrs(nodeToCheck.attrs, attrs);
                }
            }
            // Node doesn't have the attr key(s), return defaultTrueIfAttributeNotSet
            return defaultTrueIfAttributeNotSet;
        }

        // Check if any matched parent has all the attrs
        // Also track if any has the attribute key to avoid a second iteration
        let anyHasAttrKey = false;
        for (const parentNode of matchedParents) {
            const parentHasAttrKey = hasAnyAttrKey(parentNode.attrs, attrs);
            if (parentHasAttrKey) {
                anyHasAttrKey = true;
                if (hasAttrs(parentNode.attrs, attrs)) {
                    return true;
                }
            }
        }

        // If none of the matched nodes has the attribute key(s), return defaultTrueIfAttributeNotSet
        if (!anyHasAttrKey) {
            return defaultTrueIfAttributeNotSet;
        }

        return false;
    }

    // Case C: checkParents is not set (null or empty), attrs is set, defaultTrueIfAttributeNotSet is true
    if ((!checkParents || checkParents.length === 0) && attrs && defaultTrueIfAttributeNotSet) {
        const nodeToCheck = node || $from.parent;
        if (nodeToCheck) {
            if (!hasAnyAttrKey(nodeToCheck.attrs, attrs)) {
                return defaultTrueIfAttributeNotSet;
            }
            // Fall through to existing check below
        }
    }

    // Case D: Only state and nodeType and optional attrs given - existing check
    if (node) {
        nodeType = nodeType || node.type;

        return node.hasMarkup(nodeType, attrs)
            || node.type === nodeType && hasAttrs(node.attrs, attrs);
    }

    const parent = $from.parent;
    if (!parent) {
        return false;
    }

    nodeType = nodeType || parent.type;

    return to <= $from.end()
        && (parent.hasMarkup(nodeType, attrs)
            || parent.type === nodeType && hasAttrs(parent.attrs, attrs));


}

function hasAttrs(nodeAttrs: Attrs, attrs?: Attrs): boolean {
    if (!attrs) {
        return false;
    }

    for (const attrKey of Object.keys(attrs)) {
        if (String(nodeAttrs[attrKey]) !== String(attrs[attrKey])) {
            return false;
        }
    }
    return true;
}

/**
 * Checks if the node has any of the attribute keys from attrs defined with a meaningful value
 * (not undefined, null, or empty string)
 */
function hasAnyAttrKey(nodeAttrs: Attrs, attrs: Attrs): boolean {
    for (const attrKey of Object.keys(attrs)) {
        const value: unknown = nodeAttrs[attrKey];
        if (value !== undefined && value !== null && value !== '') {
            return true;
        }
    }
    return false;
}
