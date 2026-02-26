import {type Attrs, type ContentMatch, type NodeRange, type NodeType,type PmNode} from '@type-editor/model';

/**
 * Try to find a valid way to wrap the content in the given range in a
 * node of the given type. May introduce extra nodes around and inside
 * the wrapper node, if necessary. Returns null if no valid wrapping
 * could be found.
 *
 * @param range The range of content to wrap.
 * @param nodeType The type of node to wrap the content in.
 * @param attrs Attributes for the wrapper node.
 * @param innerRange Optional alternative range whose content should fit in the wrapping.
 * @returns An array of wrapper node descriptors, or null if no valid wrapping exists.
 */
export function findWrapping(range: NodeRange,
                             nodeType: NodeType,
                             attrs: Attrs | null = null,
                             innerRange = range): Array<{ type: NodeType, attrs: Attrs | null; }> | null {
    // Find wrapping nodes needed outside the target range
    const outerWrapping: ReadonlyArray<NodeType> | null = findWrappingOutside(range, nodeType);
    if (!outerWrapping) {
        return null;
    }

    // Find wrapping nodes needed inside to accommodate the content
    const innerWrapping: ReadonlyArray<NodeType> | null = findWrappingInside(innerRange, nodeType);
    if (!innerWrapping) {
        return null;
    }

    // Combine outer wrapping + main node + inner wrapping
    return [
        ...outerWrapping.map(createNodeDescriptor),
        {type: nodeType, attrs},
        ...innerWrapping.map(createNodeDescriptor)
    ];
}

/**
 * Create a node descriptor with null attributes.
 * Used when building wrapper node specifications.
 *
 * @param type The node type for the descriptor.
 * @returns A node descriptor object with the type and null attributes.
 */
function createNodeDescriptor(type: NodeType): { type: NodeType; attrs: null } {
    return {type, attrs: null};
}

/**
 * Find the wrapping nodes needed outside the range to accommodate the wrapper type.
 * This determines what parent nodes are needed to make the wrapper valid in its context.
 *
 * @param range The range to wrap.
 * @param type The wrapper node type.
 * @returns Array of wrapper types, or null if no valid wrapping exists.
 */
function findWrappingOutside(range: NodeRange, type: NodeType): ReadonlyArray<NodeType> | null {
    const {parent, startIndex, endIndex} = range;

    // Find what wrapping is needed to place the type in the parent
    const wrappingTypes: ReadonlyArray<NodeType> = parent.contentMatchAt(startIndex).findWrapping(type);
    if (!wrappingTypes) {
        return null;
    }

    // Determine the outermost wrapper (or the type itself if no wrappers needed)
    const outermostType: NodeType = wrappingTypes.length ? wrappingTypes[0] : type;

    // Verify the parent can actually be replaced with this wrapping
    return parent.canReplaceWith(startIndex, endIndex, outermostType) ? wrappingTypes : null;
}

/**
 * Find the wrapping nodes needed inside the wrapper to accommodate the range's content.
 * This ensures the content can fit inside the wrapper type.
 *
 * @param range The range whose content needs to fit.
 * @param type The wrapper node type.
 * @returns Array of inner wrapper types, or null if content can't fit.
 */
function findWrappingInside(range: NodeRange, type: NodeType): ReadonlyArray<NodeType> | null {
    const {parent, startIndex, endIndex} = range;
    const firstChild: PmNode = parent.child(startIndex);

    // Find what wrapping is needed to place the first child in the wrapper type
    const innerWrapping: ReadonlyArray<NodeType> = type.contentMatch.findWrapping(firstChild.type);
    if (!innerWrapping) {
        return null;
    }

    // Determine the innermost type that will hold the content
    const innermostType: NodeType = innerWrapping.length ? innerWrapping[innerWrapping.length - 1] : type;

    // Verify all children in the range can match in the innermost type
    let contentMatch: ContentMatch | null = innermostType.contentMatch;
    for (let i = startIndex; contentMatch && i < endIndex; i++) {
        contentMatch = contentMatch.matchType(parent.child(i).type);
    }

    // The match must be valid when all content is added
    if (!contentMatch?.validEnd) {
        return null;
    }

    return innerWrapping;
}
