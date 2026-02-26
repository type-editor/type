import {TEXT_NODE} from '@type-editor/commons';

/**
 * Gets the size of a DOM node.
 *
 * For text nodes (nodeType 3), returns the length of the text content.
 * For element nodes, returns the number of child nodes.
 *
 * @param node - The DOM node to measure
 * @returns The size of the node (text length or child count)
 *
 * @example
 * ```typescript
 * const textNode = document.createTextNode('Hello');
 * const size = nodeSize(textNode); // Returns 5
 *
 * const element = document.createElement('div');
 * element.appendChild(document.createElement('span'));
 * const elemSize = nodeSize(element); // Returns 1
 * ```
 */
export function nodeSize(node: Node): number {
    return node.nodeType === TEXT_NODE ? (node.nodeValue?.length ?? 0) : node.childNodes.length;
}
