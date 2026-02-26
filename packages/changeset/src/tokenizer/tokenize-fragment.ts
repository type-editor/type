import type {Fragment, Node} from '@type-editor/model';

import type {TokenEncoder} from '../types/TokenEncoder';
import {tokenizeBlockNode} from './tokenize-block-node';
import {tokenizeTextNode} from './tokenize-textNode';


/**
 * Convert the given range of a fragment to tokens for diff comparison.
 * Recursively processes the fragment tree, encoding text characters and node boundaries.
 *
 * @param fragment - The fragment to tokenize.
 * @param encoder - The encoder to use for converting nodes and characters to tokens.
 * @param start - The start offset within the fragment.
 * @param end - The end offset within the fragment.
 * @param target - The array to append tokens to.
 * @returns The target array with all tokens appended.
 */
export function tokenizeFragment<T>(fragment: Fragment,
                                    encoder: TokenEncoder<T>,
                                    start: number,
                                    end: number,
                                    target: Array<T>): Array<T> {
    let currentOffset = 0;

    for (let i = 0; i < fragment.childCount; i++) {
        const child: Node = fragment.child(i);
        const childEndOffset: number = currentOffset + child.nodeSize;
        const rangeStart: number = Math.max(currentOffset, start);
        const rangeEnd: number = Math.min(childEndOffset, end);

        if (rangeStart < rangeEnd) {
            if (child.isText) {
                tokenizeTextNode(child, encoder, rangeStart, rangeEnd, currentOffset, target);
            } else if (child.isLeaf) {
                target.push(encoder.encodeNodeStart(child));
            } else {
                tokenizeBlockNode(child, encoder, rangeStart, rangeEnd, currentOffset, childEndOffset, target);
            }
        }

        currentOffset = childEndOffset;
    }

    return target;
}
