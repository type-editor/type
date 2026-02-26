/**
 * Get a single non-zero rectangle from an element or range.
 * Prefers the first or last rectangle based on bias, falling back to
 * any non-zero rectangle, or the bounding rect if all are zero-sized.
 *
 * @param target - The HTML element or range to get a rectangle from
 * @param bias - Direction bias: negative for first rect, positive for last
 * @returns A single DOMRect representing the target's position
 */
export function singleRect(target: HTMLElement | Range, bias: number): DOMRect {
    const rects: DOMRectList = target.getClientRects();
    if (rects.length) {
        const first: DOMRect = rects[bias < 0 ? 0 : rects.length - 1];
        if (nonZero(first)) {
            return first;
        }
    }

    return Array.from(rects).find(nonZero) || target.getBoundingClientRect();
}

/**
 * Check if a rectangle has non-zero dimensions.
 *
 * @param rect - The rectangle to check
 * @returns True if the rectangle has width or height
 */
function nonZero(rect: DOMRect): boolean {
    return rect.top < rect.bottom || rect.left < rect.right;
}
