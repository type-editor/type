import type {PmEditorView} from '@type-editor/editor-types';

import type {StoredScrollPos} from '../types/dom-coords/StoredScrollPos';
import {scrollStack} from './util/scroll-stack';


const SCROLL_PROBE_STEP = 5;
const SCROLL_PROBE_THRESHOLD = 20;


/**
 * Store the scroll position of the editor's parent nodes, along with
 * the top position of an element near the top of the editor, which
 * will be used to make sure the visible viewport remains stable even
 * when the size of the content above changes.
 *
 * @param view - The editor view to store scroll position for
 * @returns Object containing reference element info and scroll stack
 */
export function storeScrollPos(view: PmEditorView): StoredScrollPos {
    const rect: DOMRect = view.dom.getBoundingClientRect();
    const { refDOM, refTop } = findReferenceElement(view, rect);

    return {
        refDOM,
        refTop,
        stack: scrollStack(view.dom)
    };
}

/**
 * Find a reference element near the top of the editor viewport.
 * This element will be used to maintain scroll position stability.
 *
 * @param view - The editor view
 * @param rect - The bounding rectangle of the editor
 * @returns Object containing the reference element and its top position, or undefined
 */
function findReferenceElement(view: PmEditorView,
                              rect: DOMRect): { refDOM: HTMLElement; refTop: number } | { refDOM: undefined; refTop: undefined } {
    const startY: number = Math.max(0, rect.top);
    const centerX: number = (rect.left + rect.right) / 2;

    // Probe vertically in steps to find a stable element near the top of the viewport
    // This element will be used as a reference point for maintaining scroll stability
    for (let y = startY + 1; y < Math.min(innerHeight, rect.bottom); y += SCROLL_PROBE_STEP) {
        const element: Element = view.root.elementFromPoint(centerX, y);

        // Skip if no element found or if it's outside the editor
        if (!element || element === view.dom || !view.dom.contains(element)) {
            continue;
        }

        const elementRect: DOMRect = (element as HTMLElement).getBoundingClientRect();
        // Use this element if it's close enough to the top edge
        if (elementRect.top >= startY - SCROLL_PROBE_THRESHOLD) {
            return {
                refDOM: element as HTMLElement,
                refTop: elementRect.top
            };
        }
    }

    return { refDOM: undefined, refTop: undefined };
}
