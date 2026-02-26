import type {TransformDocument} from '@type-editor/editor-types';
import {type Attrs, Fragment, type NodeType, type ResolvedPos, Slice} from '@type-editor/model';

import {ReplaceStep} from '../change-steps/ReplaceStep';

/**
 * Split the node at the given position at the specified depth.
 * Creates a gap in the document by duplicating ancestor nodes.
 *
 * @param transform The transform to apply the split to.
 * @param pos The position to split at.
 * @param depth How many levels deep to split (default: 1).
 * @param typesAfter Optional array of node types to use for nodes after the split.
 */
export function split(transform: TransformDocument,
                      pos: number,
                      depth = 1,
                      typesAfter?: Array<null | { type: NodeType, attrs?: Attrs | null; }>): void {
    const $pos: ResolvedPos = transform.doc.resolve(pos);
    let before: Fragment = Fragment.empty;
    let after: Fragment = Fragment.empty;

    const currentDepth: number = $pos.depth;
    const targetDepth: number = currentDepth - depth;
    let typesAfterIndex: number = depth - 1;

    // Build fragments for before and after the split
    for (let depthLevel = currentDepth; depthLevel > targetDepth; depthLevel--, typesAfterIndex--) {
        before = Fragment.from($pos.node(depthLevel).copy(before));

        const typeAfter = typesAfter?.[typesAfterIndex];
        after = Fragment.from(
            typeAfter
                ? typeAfter.type.create(typeAfter.attrs, after)
                : $pos.node(depthLevel).copy(after)
        );
    }

    // Insert the split structure
    const splitSlice: Slice = new Slice(before.append(after), depth, depth);
    transform.step(new ReplaceStep(pos, pos, splitSlice, true));
}
