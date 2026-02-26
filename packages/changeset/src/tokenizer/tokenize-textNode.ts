import type {Node} from '@type-editor/model';

import type {TokenEncoder} from '../types/TokenEncoder';


/**
 * Tokenize a text node by encoding each character within the specified range.
 *
 * @param textNode - The text node to tokenize.
 * @param encoder - The encoder to use for converting characters to tokens.
 * @param rangeStart - The start position in the document.
 * @param rangeEnd - The end position in the document.
 * @param nodeOffset - The offset of this node in the document.
 * @param target - The array to append tokens to.
 */
export function tokenizeTextNode<T>(textNode: Node,
                                    encoder: TokenEncoder<T>,
                                    rangeStart: number,
                                    rangeEnd: number,
                                    nodeOffset: number,
                                    target: Array<T>): void {
    const text = textNode.text;
    if (!text) {
        return;
    }

    for (let j = rangeStart; j < rangeEnd; j++) {
        const charCode: number = text.charCodeAt(j - nodeOffset);
        target.push(encoder.encodeCharacter(charCode, textNode.marks));
    }
}
