import type {TransformDocument} from '@type-editor/editor-types';
import {Fragment, type PmNode, Slice} from '@type-editor/model';

import {insertPoint} from '../change-helper/insert-point';

/**
 * Replace a range with a single node.
 *
 * @param transform - The transform to apply to
 * @param from - Start position
 * @param to - End position
 * @param node - The node to insert
 */
export function replaceRangeWith(transform: TransformDocument,
                                 from: number,
                                 to: number,
                                 node: PmNode): void {
    if (!node.isInline
        && from === to
        && transform.doc.resolve(from).parent.content.size) {
        const point: number | null = insertPoint(transform.doc, from, node.type);
        if (point !== null) {from = to = point;}
    }
    transform.replaceRange(from, to, new Slice(Fragment.from(node), 0, 0));
}
