/**
 * Conditionally adds or removes a CSS class from an element.
 *
 * @param dom - The HTML element to modify
 * @param cls - The CSS class name to add or remove
 * @param on - If true, adds the class; if false, removes it
 *
 */
export function setClass(dom: HTMLElement, cls: string, on: boolean): void {
    if (on) {
        dom.classList.add(cls);
    } else {
        dom.classList.remove(cls);
    }
}
