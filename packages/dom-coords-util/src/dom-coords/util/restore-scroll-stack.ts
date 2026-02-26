import type {ScrollPos} from '../../types/dom-coords/ScrollPos';


/**
 * Restore scroll positions from a stack, with an optional vertical adjustment.
 * Only updates scroll positions that have changed to avoid unnecessary reflows.
 *
 * @param stack - Array of scroll positions to restore
 * @param deltaTop - Vertical adjustment to apply to scroll positions
 */
export function restoreScrollStack(stack: Array<ScrollPos>, deltaTop: number): void {
    for (const item of stack) {
        const { dom, top, left } = item;
        if (dom.scrollTop !== top + deltaTop) {
            dom.scrollTop = top + deltaTop;
        }
        if (dom.scrollLeft !== left) {
            dom.scrollLeft = left;
        }
    }
}
