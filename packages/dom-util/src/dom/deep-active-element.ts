/**
 * Gets the deeply nested active element, traversing through Shadow DOM boundaries.
 *
 * This function recursively descends into shadow roots to find the actual
 * focused element, even when it's nested within multiple levels of Shadow DOM.
 *
 * @param doc - The document to get the active element from
 * @returns The deeply nested active element, or null if no element is focused
 *
 * @example
 * ```typescript
 * const focusedElement = deepActiveElement(document);
 * if (focusedElement) {
 *     console.log('Actually focused element:', focusedElement);
 * }
 * ```
 */
export function deepActiveElement(doc: Document): Element | null {
    let activeElement: Element | null = doc.activeElement;
    while (activeElement?.shadowRoot) {
        activeElement = activeElement.shadowRoot.activeElement;
    }
    return activeElement;
}
