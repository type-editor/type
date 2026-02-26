import {type NodeType, type PmNode, type ResolvedPos} from '@type-editor/model';


/**
 * Try to find a point where a node of the given type can be inserted
 * near `pos`, by searching up the node hierarchy when `pos` itself
 * isn't a valid place but is at the start or end of a node. Return
 * null if no position was found.
 *
 * @param doc The document to search in.
 * @param pos The position to start searching from.
 * @param nodeType The type of node to insert.
 * @returns A valid insertion position, or null if none found.
 */
export function insertPoint(doc: PmNode, pos: number, nodeType: NodeType): number | null {
    const $pos: ResolvedPos = doc.resolve(pos);

    // Try current position first
    if ($pos.parent.canReplaceWith($pos.index(), $pos.index(), nodeType)) {
        return pos;
    }

    // Try at start of parent
    if ($pos.parentOffset === 0) {
        return searchUpwardForInsertPoint($pos, nodeType, 'start');
    }

    // Try at end of parent
    if ($pos.parentOffset === $pos.parent.content.size) {
        return searchUpwardForInsertPoint($pos, nodeType, 'end');
    }

    return null;
}

/**
 * Search up the node hierarchy for a valid insertion point.
 * Tries each ancestor level to find where the node type can be inserted.
 *
 * @param $pos The resolved position to search from.
 * @param nodeType The type of node to insert.
 * @param boundary Whether searching at 'start' or 'end' boundary.
 * @returns A valid insertion position, or null if none found.
 */
function searchUpwardForInsertPoint(
    $pos: ResolvedPos,
    nodeType: NodeType,
    boundary: 'start' | 'end'
): number | null {
    for (let depth = $pos.depth - 1; depth >= 0; depth--) {
        const index: number = boundary === 'start' ? $pos.index(depth) : $pos.indexAfter(depth);
        const parentNode: PmNode = $pos.node(depth);

        // Check if we can insert at this depth
        if (parentNode.canReplaceWith(index, index, nodeType)) {
            return boundary === 'start' ? $pos.before(depth + 1) : $pos.after(depth + 1);
        }

        // Stop searching if not at boundary
        const isAtBoundary: boolean = boundary === 'start'
            ? index === 0
            : index === parentNode.childCount;

        if (!isAtBoundary) {
            return null;
        }
    }

    return null;
}
