import type {NodeType, PmNode, Slice} from '@type-editor/model';
import {Transform} from '@type-editor/transform';


/**
 * Fits a slice into a node of the given type.
 *
 * Creates an empty node of the specified type and replaces its content
 * with the slice content. This is useful for normalizing partial cell
 * selections into complete cells.
 *
 * @param nodeType - The node type to create and fill.
 * @param slice - The slice containing the content to fit.
 * @returns A new node containing the fitted slice content.
 */
export function fitSlice(nodeType: NodeType, slice: Slice): PmNode {
    const node: PmNode = nodeType.createAndFill();
    const transform: Transform = new Transform(node).replace(0, node.content.size, slice);
    return transform.doc;
}
