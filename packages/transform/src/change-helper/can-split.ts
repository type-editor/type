import {type Attrs, Fragment, type NodeType, type PmNode, type ResolvedPos} from '@type-editor/model';

/**
 * Check whether splitting at the given position is allowed.
 *
 * @param doc The document to check.
 * @param pos The position to split at.
 * @param depth The depth of the split (how many levels to split).
 * @param typesAfter Optional array of node types to use after the split.
 * @returns True if the split is valid, false otherwise.
 */
export function canSplit(doc: PmNode,
                         pos: number,
                         depth = 1,
                         typesAfter?: Array<null | { type: NodeType, attrs?: Attrs | null; }>): boolean {
    const $pos: ResolvedPos = doc.resolve(pos);
    const baseDepth: number = $pos.depth - depth;

    // Validate basic split requirements
    if (!isValidSplitBase($pos, baseDepth, typesAfter)) {
        return false;
    }

    // Check each intermediate depth level
    if (!areIntermediateLevelsValid($pos, baseDepth, depth, typesAfter)) {
        return false;
    }

    // Validate the base level can accept the split
    return canBaseAcceptSplit($pos, baseDepth, typesAfter);
}


/**
 * Check if the basic requirements for splitting are met.
 * Validates that the split position, parent node, and content are all compatible.
 *
 * @param $pos The resolved position to split at.
 * @param baseDepth The base depth for the split.
 * @param typesAfter Optional array of node types to use after the split.
 * @returns True if basic split requirements are met, false otherwise.
 */
function isValidSplitBase($pos: ResolvedPos,
                          baseDepth: number,
                          typesAfter?: Array<null | { type: NodeType, attrs?: Attrs | null; }>): boolean {
    const parent: PmNode = $pos.parent;
    const parentIndex: number = $pos.index();
    const innerType = (typesAfter?.[typesAfter.length - 1]) || parent;

    // Base depth must be non-negative
    if (baseDepth < 0) {
        return false;
    }

    // Parent must not be isolating
    if (parent.type.spec.isolating) {
        return false;
    }

    // Parent must allow replacing content after split point
    if (!parent.canReplace(parentIndex, parent.childCount)) {
        return false;
    }

    // Content after split must be valid for the inner type
    const contentAfterSplit: Fragment = parent.content.cutByIndex(parentIndex, parent.childCount);
    return innerType.type.validContent(contentAfterSplit);
}

/**
 * Validate all intermediate depth levels between current and base depth.
 * Ensures each level can be split through without violating content constraints.
 *
 * @param $pos The resolved position to split at.
 * @param baseDepth The base depth for the split.
 * @param splitDepth The total depth of the split.
 * @param typesAfter Optional array of node types to use after the split.
 * @returns True if all intermediate levels are valid, false otherwise.
 */
function areIntermediateLevelsValid($pos: ResolvedPos,
                                    baseDepth: number,
                                    splitDepth: number,
                                    typesAfter?: Array<null | { type: NodeType, attrs?: Attrs | null; }>): boolean {
    for (let depth = $pos.depth - 1, typeIndex = splitDepth - 2; depth > baseDepth; depth--, typeIndex--) {
        if (!isIntermediateLevelValid($pos, depth, typeIndex, typesAfter)) {
            return false;
        }
    }
    return true;
}

/**
 * Check if a single intermediate level is valid for splitting.
 * Validates that the node at this depth can be split and content will remain valid.
 *
 * @param $pos The resolved position to split at.
 * @param depth The depth level to check.
 * @param typeIndex The index into the typesAfter array for this level.
 * @param typesAfter Optional array of node types to use after the split.
 * @returns True if this level is valid for splitting, false otherwise.
 */
function isIntermediateLevelValid($pos: ResolvedPos,
                                  depth: number,
                                  typeIndex: number,
                                  typesAfter?: Array<null | { type: NodeType, attrs?: Attrs | null; }>): boolean {
    const node: PmNode = $pos.node(depth);
    const index: number = $pos.index(depth);

    // Isolating nodes cannot be split through
    if (node.type.spec.isolating) {
        return false;
    }

    // Build the content that would remain after the split
    let remainingContent: Fragment = node.content.cutByIndex(index, node.childCount);
    const overrideChild = typesAfter?.[typeIndex + 1];

    if (overrideChild) {
        remainingContent = remainingContent.replaceChild(
            0,
            overrideChild.type.create(overrideChild.attrs)
        );
    }

    // Node must allow replacing content after index
    if (!node.canReplace(index + 1, node.childCount)) {
        return false;
    }

    // The node type after split must accept the remaining content
    const afterType = (typesAfter?.[typeIndex]) || node;
    return afterType.type.validContent(remainingContent);
}

/**
 * Check if the base level can accept the split.
 * Validates that the node at the base depth can have the new node type inserted.
 *
 * @param $pos The resolved position to split at.
 * @param baseDepth The base depth for the split.
 * @param typesAfter Optional array of node types to use after the split.
 * @returns True if the base can accept the split, false otherwise.
 */
function canBaseAcceptSplit($pos: ResolvedPos,
                            baseDepth: number,
                            typesAfter?: Array<null | { type: NodeType, attrs?: Attrs | null; }>): boolean {
    const index: number = $pos.indexAfter(baseDepth);
    const baseType = typesAfter?.[0];
    const nodeType: NodeType = baseType ? baseType.type : $pos.node(baseDepth + 1).type;

    return $pos.node(baseDepth).canReplaceWith(index, index, nodeType);
}
