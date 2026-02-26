import type {Fragment, NodeType, PmNode, ResolvedPos, Slice} from '@type-editor/model';

/**
 * Finds a position at or around the given position where the given
 * slice can be inserted. Will look at parent nodes' nearest boundary
 * and try there, even if the original position wasn't directly at the
 * start or end of that node. Returns null when no position was found.
 *
 * @param doc The document to search in.
 * @param pos The position to search around.
 * @param slice The slice to be inserted.
 */
export function dropPoint(doc: PmNode, pos: number, slice: Slice): number | null {
    const $pos: ResolvedPos = doc.resolve(pos);

    // Empty slices can be inserted anywhere
    if (!slice.content.size) {
        return pos;
    }

    // Extract the innermost content from the slice
    const innerContent: Fragment = extractInnerContent(slice);

    // Try two passes: first without wrapping, then with wrapping (if applicable)
    const shouldTryWrapping: boolean = slice.openStart === 0 && slice.size > 0;
    const totalPasses = shouldTryWrapping ? 2 : 1;

    for (let pass = 1; pass <= totalPasses; pass++) {
        const insertPosition: number = findInsertPosition($pos, innerContent, pass === 1);
        if (insertPosition !== null) {
            return insertPosition;
        }
    }

    return null;
}

/**
 * Extract the innermost content from a slice by unwrapping open start levels.
 * Navigates down through the slice structure to get the actual content to match.
 *
 * @param slice The slice to extract content from.
 * @returns The innermost fragment content.
 */
function extractInnerContent(slice: Slice): Fragment {
    let content: Fragment = slice.content;
    for (let i = 0; i < slice.openStart; i++) {
        if (!content.firstChild) {
            break;
        }
        content = content.firstChild.content;
    }
    return content;
}

/**
 * Find a valid insertion position by searching up the node hierarchy.
 * Tries each depth level to find where the content can be inserted.
 *
 * @param $pos The resolved position to search from.
 * @param content The content fragment to insert.
 * @param directInsert Whether to try direct insertion (true) or with wrapping (false).
 * @returns A valid insertion position, or null if none found.
 */
function findInsertPosition($pos: ResolvedPos,
                            content: Fragment,
                            directInsert: boolean): number | null {
    // Try each depth level from current position up to root
    for (let depth = $pos.depth; depth >= 0; depth--) {
        const positionBias: number = calculatePositionBias($pos, depth);
        const insertionIndex: number = $pos.index(depth) + (positionBias > 0 ? 1 : 0);
        const parentNode: PmNode = $pos.node(depth);

        const canInsert: boolean = directInsert
            ? canInsertDirectly(parentNode, insertionIndex, content)
            : canInsertWithWrapping(parentNode, insertionIndex, content);

        if (canInsert) {
            return resolveInsertPosition($pos, depth, positionBias);
        }
    }

    return null;
}

/**
 * Calculate the position bias (before, at, or after) based on where
 * the position falls within its parent node.
 * Determines whether to insert before, at, or after the current position.
 *
 * @param $pos The resolved position to calculate bias for.
 * @param depth The depth level to check.
 * @returns -1 (before), 0 (at), or 1 (after).
 */
function calculatePositionBias($pos: ResolvedPos, depth: number): number {
    // At the deepest level, no bias
    if (depth === $pos.depth) {
        return 0;
    }

    // Determine if position is closer to start or end of the parent
    const nodeStart: number = $pos.start(depth + 1);
    const nodeEnd: number = $pos.end(depth + 1);
    const midpoint: number = (nodeStart + nodeEnd) / 2;

    return $pos.pos <= midpoint ? -1 : 1;
}

/**
 * Check if content can be inserted directly at the given position.
 * Tests whether the parent node can replace content at the index with the given fragment.
 *
 * @param parent The parent node to insert into.
 * @param index The index at which to insert.
 * @param content The content fragment to insert.
 * @returns True if direct insertion is possible, false otherwise.
 */
function canInsertDirectly(parent: PmNode, index: number, content: Fragment): boolean {
    return parent.canReplace(index, index, content);
}

/**
 * Check if content can be inserted with wrapping at the given position.
 * Tests whether the content can be wrapped in intermediate nodes to make it fit.
 *
 * @param parent The parent node to insert into.
 * @param index The index at which to insert.
 * @param content The content fragment to insert.
 * @returns True if insertion with wrapping is possible, false otherwise.
 */
function canInsertWithWrapping(parent: PmNode, index: number, content: Fragment): boolean {
    if (!content.firstChild) {
        return false;
    }
    const wrapping: ReadonlyArray<NodeType> = parent.contentMatchAt(index).findWrapping(content.firstChild.type);
    return wrapping !== null && parent.canReplaceWith(index, index, wrapping[0]);
}

/**
 * Resolve the final insertion position based on depth and bias.
 * Converts the depth and bias into an actual document position.
 *
 * @param $pos The resolved position.
 * @param depth The depth level for insertion.
 * @param bias The position bias (-1 for before, 0 for at, 1 for after).
 * @returns The resolved document position.
 */
function resolveInsertPosition($pos: ResolvedPos, depth: number, bias: number): number {
    if (bias === 0) {
        return $pos.pos;
    }

    if (bias < 0) {
        return $pos.before(depth + 1);
    }

    return $pos.after(depth + 1);
}
