import {domIndex} from './dom-index';
import {nodeSize} from './node-size';

/**
 * Checks if a position is at the start or end edge of a parent node.
 *
 * Traverses up the DOM tree from the given position to determine if it represents
 * the very beginning or end of the parent node's content.
 *
 * @param node - The starting DOM node
 * @param offset - The offset within the starting node
 * @param parent - The parent node to check against
 * @returns True if the position is at the edge of the parent, false otherwise
 *
 * @example
 * ```typescript
 * const textNode = document.createTextNode('Hello');
 * const parent = textNode.parentNode;
 * const isEdge = isOnEdge(textNode, 0, parent); // True if at start
 * ```
 */
export function isOnEdge(node: Node, offset: number, parent: Node): boolean {
    let atStart = offset === 0;
    let atEnd = offset === nodeSize(node);

    while (atStart || atEnd) {
        if (node === parent) {
            return true;
        }

        const index: number = domIndex(node);
        node = node.parentNode;

        if (!node) {
            return false;
        }

        atStart = atStart && index === 0;
        atEnd = atEnd && index === nodeSize(node);
    }

    return false;
}
