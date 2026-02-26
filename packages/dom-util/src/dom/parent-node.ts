import {DOCUMENT_FRAGMENT_NODE} from '@type-editor/commons';

/**
 * Gets the parent node of a DOM node, accounting for Shadow DOM and slot assignments.
 *
 * This function handles special cases:
 * - If the node is slotted, returns the assigned slot
 * - If the parent is a DocumentFragment (nodeType 11), returns the shadow root host
 * - Otherwise returns the regular parent node
 *
 * @param node - The DOM node whose parent to retrieve
 * @returns The parent node, or null if none exists
 *
 * @example
 * ```typescript
 * const element = document.getElementById('myElement');
 * const parent = parentNode(element);
 * ```
 */
export function parentNode(node: Node): Node | null {
    const parent: ParentNode = (node as HTMLSlotElement).assignedSlot || node.parentNode;
    return parent?.nodeType === DOCUMENT_FRAGMENT_NODE ? (parent as ShadowRoot).host : parent;

}
