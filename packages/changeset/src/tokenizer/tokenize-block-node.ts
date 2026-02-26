import type {Node} from '@type-editor/model';

import type {TokenEncoder} from '../types/TokenEncoder';
import {tokenizeFragment} from './tokenize-fragment';


/**
 * Tokenize a block (non-leaf) node by encoding its boundaries and recursively
 * tokenizing its content.
 *
 * @param blockNode - The block node to tokenize.
 * @param encoder - The encoder to use for converting nodes to tokens.
 * @param rangeStart - The start position in the document.
 * @param rangeEnd - The end position in the document.
 * @param nodeOffset - The offset of this node in the document.
 * @param nodeEndOffset - The end offset of this node in the document.
 * @param target - The array to append tokens to.
 */
export function tokenizeBlockNode<T>(blockNode: Node,
                                     encoder: TokenEncoder<T>,
                                     rangeStart: number,
                                     rangeEnd: number,
                                     nodeOffset: number,
                                     nodeEndOffset: number,
                                     target: Array<T>): void {
    // Add start token if we're at the beginning of the node
    if (rangeStart === nodeOffset) {
        target.push(encoder.encodeNodeStart(blockNode));
    }

    // Recursively tokenize the node's content
    const contentStart = Math.max(nodeOffset + 1, rangeStart) - nodeOffset - 1;
    const contentEnd = Math.min(nodeEndOffset - 1, rangeEnd) - nodeOffset - 1;

    tokenizeFragment(
        blockNode.content,
        encoder,
        contentStart,
        contentEnd,
        target
    );

    // Add end token if we're at the end of the node
    if (rangeEnd === nodeEndOffset) {
        target.push(encoder.encodeNodeEnd(blockNode));
    }
}
