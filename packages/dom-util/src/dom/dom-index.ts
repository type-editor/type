/**
 * Gets the index of a DOM node within its parent's child list.
 *
 * @param node - The DOM node to find the index of
 * @returns The zero-based index of the node among its siblings
 *
 * @example
 * ```typescript
 * const element = document.getElementById('myElement');
 * const index = domIndex(element); // Returns position among siblings
 * ```
 */
export function domIndex(node: Node): number {
    let index = 0;
    let currentNode: Node = node;

    while (currentNode.previousSibling) {
        currentNode = currentNode.previousSibling;
        index++;
    }

    return index;
}
