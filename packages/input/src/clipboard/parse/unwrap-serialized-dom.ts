import {ELEMENT_NODE} from '@type-editor/commons';

/**
 * Unwrap serialized DOM by removing the specified number of wrapper layers.
 * This reverses the wrapping applied during serialization.
 *
 * @param dom - The DOM element to unwrap
 * @param wrapperCount - Number of wrapper layers to remove
 * @returns The unwrapped DOM element
 */
export function unwrapSerializedDOM(dom: HTMLElement | undefined,
                                    wrapperCount: number): HTMLElement | undefined {
    let wrappersToRemove: number = wrapperCount;

    while (wrappersToRemove > 0 && dom?.firstChild) {
        let child: ChildNode | null = dom.firstChild;
        while (child && child.nodeType !== ELEMENT_NODE) {
            child = child.nextSibling;
        }
        if (!child) {
            break;
        }
        dom = child as HTMLElement;
        wrappersToRemove--;
    }
    return dom;
}
