import {ELEMENT_NODE, TEXT_NODE} from '@type-editor/commons';

import {domIndex} from './dom-index';
import {hasBlockDesc} from './has-block-desc';
import {nodeSize} from './node-size';

/**
 * Finds the text node before a given position in the DOM tree.
 *
 * Traverses the DOM tree backward from the given position to find the nearest
 * preceding text node. Stops at non-editable elements and block boundaries.
 *
 * @param node - The starting DOM node
 * @param offset - The offset within the starting node
 * @returns The text node before the position, or null if none exists
 *
 * @example
 * ```typescript
 * const element = document.getElementById('myElement');
 * const textNode = textNodeBefore(element, 1);
 * ```
 */
export function textNodeBefore(node: Node, offset: number): Text | null {
    for (; ;) {
        // If we're in a text node with content before the offset
        if (node.nodeType === TEXT_NODE && offset) {
            return node as Text;
        }

        // If we're in an element node with children before the offset
        if (node.nodeType === ELEMENT_NODE && offset > 0) {
            if ((node as HTMLElement).contentEditable === 'false') {
                return null;
            }
            node = node.childNodes[offset - 1];
            offset = nodeSize(node);
        } else if (node.parentNode && !hasBlockDesc(node)) {
            // Move up to parent and continue searching
            offset = domIndex(node);
            node = node.parentNode;
        } else {
            return null;
        }
    }
}
