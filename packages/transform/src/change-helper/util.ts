import type {ContentMatch, NodeType,PmNode} from '@type-editor/model';

/**
 * Check if two nodes can be joined together.
 * Nodes are joinable if both exist, the first is not a leaf,
 * and the second's content can be appended to the first.
 *
 * @param beforeNode The node before the join point.
 * @param afterNode The node after the join point.
 * @returns True if the nodes can be joined.
 */
export function joinable(beforeNode: PmNode | null, afterNode: PmNode | null): boolean {
    if (!beforeNode || !afterNode) {
        return false;
    }

    if (beforeNode.isLeaf) {
        return false;
    }

    return canAppendWithSubstitutedLinebreaks(beforeNode, afterNode);
}

/**
 * Check if content from source node can be appended to target node,
 * treating linebreak replacement nodes as text nodes.
 *
 * @param targetNode The node to append content to.
 * @param sourceNode The node whose content should be appended.
 * @returns True if the content can be appended.
 */
function canAppendWithSubstitutedLinebreaks(targetNode: PmNode, sourceNode: PmNode): boolean {
    // Empty source nodes can always append if types are compatible
    if (!sourceNode.content.size) {
        return targetNode.type.compatibleContent(sourceNode.type);
    }

    const {linebreakReplacement} = targetNode.type.schema;
    let contentMatch: ContentMatch | null = targetNode.contentMatchAt(targetNode.childCount);

    // Check each child in the source node
    for (let i = 0; i < sourceNode.childCount; i++) {
        const child: PmNode = sourceNode.child(i);

        // Treat linebreak nodes as text nodes for matching
        const childType: NodeType = child.type === linebreakReplacement
            ? targetNode.type.schema.nodes.text
            : child.type;

        contentMatch = contentMatch?.matchType(childType);
        if (!contentMatch) {
            return false;
        }

        // Check if marks are allowed
        if (!targetNode.type.allowsMarks(child.marks)) {
            return false;
        }
    }

    return contentMatch.validEnd;
}
