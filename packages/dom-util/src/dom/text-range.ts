
let reusedRange: Range | null = null;

/**
 * Creates or reuses a DOM Range for a text node.
 *
 * Note: This function always returns the same Range object for performance reasons.
 * DOM Range objects are expensive to create and can slow down subsequent DOM updates.
 * Call `clearReusedRange()` if you need to ensure the range is properly released.
 *
 * @param node - The text node to create a range for
 * @param from - The starting offset within the text node (defaults to 0)
 * @param to - The ending offset within the text node (defaults to node length)
 * @returns A DOM Range object spanning the specified text range
 *
 * @example
 * ```typescript
 * const textNode = document.createTextNode('Hello World');
 * const range = textRange(textNode, 0, 5); // Selects "Hello"
 * ```
 */
export function textRange(node: Text, from?: number, to?: number): Range {
    const range: Range = reusedRange || (reusedRange = document.createRange());
    const nodeLength: number = node.nodeValue?.length ?? 0;
    range.setEnd(node, to ?? nodeLength);
    range.setStart(node, from || 0);
    return range;
}

/**
 * Clears the reused Range object.
 *
 * This should be called when you need to ensure the cached Range is properly released,
 * particularly when switching contexts or cleaning up resources.
 *
 * @example
 * ```typescript
 * const range = textRange(textNode, 0, 5);
 * // ... use range ...
 * clearReusedRange(); // Clean up when done
 * ```
 */
export function clearReusedRange(): void {
    reusedRange = null;
}
