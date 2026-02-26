import {Fragment, type NodeRange,type PmNode} from '@type-editor/model';

/**
 * Try to find a target depth to which the content in the given range
 * can be lifted. Will not go across isolating parent nodes.
 *
 * @param range The range of content to potentially lift.
 * @returns The target depth, or null if lifting is not possible.
 */
export function liftTarget(range: NodeRange): number | null {
    const parent: PmNode = range.parent;
    const content: Fragment = parent.content.cutByIndex(range.startIndex, range.endIndex);

    let hasContentBefore = false;
    let hasContentAfter = false;

    // Search upward from the range depth to find a valid lift target
    for (let depth = range.depth; depth >= 0; depth--) {
        const node: PmNode = range.$from.node(depth);
        const startIndex: number = range.$from.index(depth) + (hasContentBefore ? 1 : 0);
        const endIndex: number = range.$to.indexAfter(depth) - (hasContentAfter ? 1 : 0);

        // Check if we can lift to this depth
        if (depth < range.depth && node.canReplace(startIndex, endIndex, content)) {
            return depth;
        }

        // Stop if we hit an isolating node or can't cut at this depth
        if (depth === 0 || node.type.spec.isolating || !canCut(node, startIndex, endIndex)) {
            break;
        }

        // Track if we need to include additional content
        if (startIndex > 0) {
            hasContentBefore = true;
        }

        if (endIndex < node.childCount) {
            hasContentAfter = true;
        }
    }

    return null;
}

/**
 * Check if content can be cut from a node at the given boundaries.
 * A cut is valid if we're at the start/end, or if the node allows replacing
 * content at those positions.
 *
 * @param node The node to check.
 * @param startIndex The start index of the cut.
 * @param endIndex The end index of the cut.
 * @returns True if the cut is valid.
 */
function canCut(node: PmNode, startIndex: number, endIndex: number): boolean {
    const canCutAtStart = startIndex === 0 || node.canReplace(startIndex, node.childCount);
    const canCutAtEnd = endIndex === node.childCount || node.canReplace(0, endIndex);

    return canCutAtStart && canCutAtEnd;
}
