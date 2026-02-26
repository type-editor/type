import type {TransformDocument} from '@type-editor/editor-types';
import {type Attrs, Fragment, type Mark, type NodeType, type PmNode, Slice} from '@type-editor/model';

import {ReplaceAroundStep} from '../change-steps/ReplaceAroundStep';

/**
 * Change the type, attributes, and/or marks of the node at a given position.
 * When `type` isn't given, the existing node type is preserved.
 *
 * @param transform The transform to apply the change to.
 * @param pos The position of the node to change.
 * @param type The new node type (or null/undefined to keep existing type).
 * @param attrs The new attributes.
 * @param marks The new marks (or undefined to keep existing marks).
 */
export function setNodeMarkup(transform: TransformDocument,
                              pos: number,
                              type: NodeType | undefined | null,
                              attrs: Attrs | null,
                              marks: ReadonlyArray<Mark> | undefined): void {
    const node: PmNode = transform.doc.nodeAt(pos);
    if (!node) {
        throw new RangeError('No node at given position');
    }

    // Use existing type if no new type specified
    const nodeType: NodeType = type || node.type;
    const nodeMarks: ReadonlyArray<Mark> = marks || node.marks;

    // Create the new node with updated properties
    const newNode: PmNode = nodeType.create(attrs, null, nodeMarks);

    // For leaf nodes, use simple replacement
    if (node.isLeaf) {
        transform.replaceWith(pos, pos + node.nodeSize, newNode);
        return;
    }

    // For non-leaf nodes, validate content compatibility
    if (!nodeType.validContent(node.content)) {
        throw new RangeError(`Invalid content for node type ${nodeType.name}`);
    }

    // Replace the node while preserving its content
    transform.step(new ReplaceAroundStep(
        pos,
        pos + node.nodeSize,
        pos + 1,
        pos + node.nodeSize - 1,
        new Slice(Fragment.from(newNode), 0, 0),
        1,
        true
    ));
}
