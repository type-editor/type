import type {PmViewDesc} from '@type-editor/editor-types';

/**
 * Checks if a DOM node has a block-level ViewDesc associated with it.
 *
 * Traverses up the DOM tree to find a ViewDesc, then checks if it represents
 * a block node and if the original DOM node is either the main DOM or content DOM
 * of that ViewDesc.
 *
 * @param dom - The DOM node to check
 * @returns True if the node has a block ViewDesc, false otherwise
 *
 * @example
 * ```typescript
 * const paragraph = document.querySelector('p');
 * const isBlock = hasBlockDesc(paragraph);
 * ```
 */
export function hasBlockDesc(dom: Node): boolean {
    let desc: PmViewDesc | undefined;

    // Find the nearest ViewDesc by traversing up the tree
    for (let cur: Node | null = dom; cur; cur = cur.parentNode) {
        desc = cur.pmViewDesc;
        if (desc) {
            break;
        }
    }

    // Check if it's a block node and matches the DOM
    if (!desc?.node) {
        return false;
    }

    return desc.node.isBlock && (desc.dom === dom || desc.contentDOM === dom);
}
