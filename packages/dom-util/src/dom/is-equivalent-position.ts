import {ELEMENT_NODE} from '@type-editor/commons';

import {domIndex} from './dom-index';
import {hasBlockDesc} from './has-block-desc';
import {nodeSize} from './node-size';

// Direction constants for DOM traversal
const DIRECTION_BACKWARD = -1;
const DIRECTION_FORWARD = 1;

/**
 * Regex matching atomic DOM elements that cannot have their content edited.
 * These elements are treated as indivisible units in the editor.
 */
const ATOMIC_ELEMENTS = /^(img|br|input|textarea|hr)$/i;


/**
 * Checks if two DOM positions are equivalent.
 *
 * Scans forward and backward through DOM positions to determine if two positions
 * refer to the same location in the document. This is useful for handling cases
 * like a position after a text node vs. at the end of that text node.
 *
 * @param node - The starting DOM node
 * @param off - The offset within the starting node
 * @param targetNode - The target DOM node to compare against
 * @param targetOff - The offset within the target node
 * @returns True if the positions are equivalent, false otherwise
 *
 * @example
 * ```typescript
 * const textNode = document.createTextNode('Hello');
 * const parent = textNode.parentNode;
 * // Position after text node vs. at end of text node
 * const equivalent = isEquivalentPosition(parent, 1, textNode, 5);
 * ```
 */
export function isEquivalentPosition(node: Node,
                                     off: number,
                                     targetNode: Node,
                                     targetOff: number): boolean {
    // Fast path: if same node and offset, positions are equivalent
    if (node === targetNode && off === targetOff) {
        return true;
    }

    // Check if targetNode exists
    if (!targetNode) {
        return false;
    }

    // Scan in both directions to find equivalent positions
    return scanFor(node, off, targetNode, targetOff, DIRECTION_BACKWARD)
        || scanFor(node, off, targetNode, targetOff, DIRECTION_FORWARD);
}

/**
 * Scans through the DOM tree in a given direction looking for the target position.
 *
 * This helper function traverses the DOM tree either forward or backward from a
 * starting position, checking if it reaches the target position. It handles special
 * cases like atomic elements, non-editable content, and block boundaries.
 *
 * @param node - The starting DOM node
 * @param offset - The offset within the starting node
 * @param targetNode - The target DOM node to find
 * @param targetOffset - The offset within the target node
 * @param direction - The direction to scan: -1 for backward, 1 for forward
 * @returns True if the target position is found, false otherwise
 */
function scanFor(node: Node,
                 offset: number,
                 targetNode: Node,
                 targetOffset: number,
                 direction: number): boolean {
    const isBackward = direction < 0;

    for (; ;) {
        // Check if we've reached the target position
        if (node === targetNode && offset === targetOffset) {
            return true;
        }

        // Check if we're at an edge of the current node
        const atEdge: boolean = offset === (isBackward ? 0 : nodeSize(node));
        if (atEdge) {
            const parent: ParentNode = node.parentNode;

            // Stop if we've reached a boundary that prevents traversal
            if (parent?.nodeType !== ELEMENT_NODE
                || hasBlockDesc(node)
                || ATOMIC_ELEMENTS.test(node.nodeName)
                || (node as HTMLElement).contentEditable === 'false') {
                return false;
            }

            offset = domIndex(node) + (isBackward ? 0 : 1);
            node = parent;
        } else if (node.nodeType === ELEMENT_NODE) {
            const childIndex: number = offset + (isBackward ? -1 : 0);
            const child: ChildNode | undefined = node.childNodes[childIndex];

            // Check if child exists (guards against out of bounds access)
            if (!child) {
                return false;
            }

            if (child.nodeType === ELEMENT_NODE && (child as HTMLElement).contentEditable === 'false') {
                // Skip elements that should be ignored for selection
                if (child.pmViewDesc?.ignoreForSelection) {
                    offset += direction;
                } else {
                    return false;
                }
            } else {
                node = child;
                offset = isBackward ? nodeSize(node) : 0;
            }
        } else {
            return false;
        }
    }
}
