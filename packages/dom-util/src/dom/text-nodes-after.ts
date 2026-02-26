import {ELEMENT_NODE, TEXT_NODE} from '@type-editor/commons';

import {domIndex} from './dom-index';
import {hasBlockDesc} from './has-block-desc';

/**
 * Finds the text node after a given position in the DOM tree.
 *
 * Traverses the DOM tree forward from the given position to find the nearest
 * following text node. Stops at non-editable elements and block boundaries.
 *
 * @param node - The starting DOM node
 * @param offset - The offset within the starting node
 * @returns The text node after the position, or null if none exists
 *
 * @example
 * ```typescript
 * const element = document.getElementById('myElement');
 * const textNode = textNodeAfter(element, 0);
 * ```
 */
export function textNodeAfter(node: Node, offset: number): Text | null {
    for (; ;) {
        // If we're in a text node with content after the offset
        if (node.nodeType === TEXT_NODE && offset < (node.nodeValue?.length ?? 0)) {
            return node as Text;
        }

        // If we're in an element node with children after the offset
        if (node.nodeType === ELEMENT_NODE && offset < node.childNodes.length) {
            if ((node as HTMLElement).contentEditable === 'false') {
                return null;
            }
            node = node.childNodes[offset];
            offset = 0;
        } else if (node.parentNode && !hasBlockDesc(node)) {
            // Move up to parent and continue searching
            offset = domIndex(node) + 1;
            node = node.parentNode;
        } else {
            return null;
        }
    }
}
