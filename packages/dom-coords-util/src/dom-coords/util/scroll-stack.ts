import {parentNode} from '@type-editor/dom-util';

import type {ScrollPos} from '../../types/dom-coords/ScrollPos';


/**
 * Build a stack of scroll positions for all ancestors of the given DOM node.
 *
 * @param dom - The starting DOM node
 * @returns Array of scroll positions for each ancestor
 */
export function scrollStack(dom: Node): Array<ScrollPos> {
    const stack: Array<ScrollPos> = [];
    const doc: Document = dom.ownerDocument;

    for (let cur: Node | null = dom; cur; cur = parentNode(cur)) {
        stack.push({
            dom: cur as HTMLElement,
            top: (cur as HTMLElement).scrollTop || 0,
            left: (cur as HTMLElement).scrollLeft || 0
        });

        // Fixed: should check if cur === doc, not dom === doc
        if (cur === doc || cur === doc.documentElement) {
            break;
        }
    }

    return stack;
}
