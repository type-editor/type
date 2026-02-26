import type {StoredScrollPos} from '../types/dom-coords/StoredScrollPos';
import {restoreScrollStack} from './util/restore-scroll-stack';


/**
 * Reset the scroll position of the editor's parent nodes to what
 * it was before, when storeScrollPos was called. This maintains viewport
 * stability when content above the viewport changes.
 *
 * @param params - Object containing scroll position data
 * @param params.refDOM - Reference element used to track viewport position
 * @param params.refTop - Original top position of the reference element
 * @param params.stack - Stack of ancestor scroll positions to restore
 */
export function resetScrollPos({ refDOM, refTop, stack }: StoredScrollPos): void {
    // Fixed: Check if refDOM exists and is still in document before accessing it
    let newRefTop = 0;
    if (refDOM?.isConnected) {
        newRefTop = refDOM.getBoundingClientRect().top;
    }
    restoreScrollStack(stack, refDOM && refTop !== undefined && newRefTop !== refTop ? newRefTop - refTop : 0);
}
