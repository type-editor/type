import {ELEMENT_NODE} from '@type-editor/commons';

import {wrapMap} from '../util';


/**
 * Apply required wrapper elements to ensure certain HTML tags can be properly
 * inserted via innerHTML (e.g., wrapping <td> with <table><tbody><tr>).
 *
 * @param wrap - The wrapper div element to potentially wrap
 * @param doc - The document to create new elements
 * @returns The number of wrapper layers applied
 */
export function applyRequiredWrappers(wrap: HTMLDivElement, doc: Document): number {
    let firstChild: ChildNode | null = wrap.firstChild;
    let wrappersApplied = 0;

    while (firstChild?.nodeType === ELEMENT_NODE) {
        const nodeName: string = (firstChild as Element).nodeName.toLowerCase();
        const requiredWrap: Array<string> = wrapMap[nodeName];
        if (!requiredWrap) {
            break;
        }

        // Apply wrappers from innermost to outermost
        for (let i = requiredWrap.length - 1; i >= 0; i--) {
            const wrapper: HTMLElement = doc.createElement(requiredWrap[i]);
            while (wrap.firstChild) {
                wrapper.appendChild(wrap.firstChild);
            }
            wrap.appendChild(wrapper);
            wrappersApplied++;
        }
        firstChild = wrap.firstChild;
    }

    return wrappersApplied;
}
