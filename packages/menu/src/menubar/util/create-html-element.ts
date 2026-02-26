// see: https://github.com/marijnh/crelt

import {hasOwnProperty, isUndefinedOrNull} from '@type-editor/commons';

export type Attributes = Record<string, string | number | boolean | null>;
export type ChildElement = string | Node | ReadonlyArray<ChildElement> | null | undefined;

export function createHtmlElement(tagOrElement: string | HTMLElement,
                                  attrs?: Attributes | null,
                                  ...children: Array<ChildElement>): HTMLElement {
    let htmlElement: HTMLElement;
    if (typeof tagOrElement === 'string') {
        htmlElement = document.createElement(tagOrElement);
    } else {
        htmlElement = tagOrElement;
    }

    // Set attributes and properties
    if (attrs && typeof attrs === 'object' && !('nodeType' in attrs) && !Array.isArray(attrs)) {
        for (const name in attrs) {
            if (hasOwnProperty(attrs, name)) {
                const value: string | number | boolean = attrs[name];

                if (typeof value === 'string') {
                    htmlElement.setAttribute(name, value);
                } else if (typeof value === 'number') {
                    htmlElement.setAttribute(name, value.toString());
                }  else if (value !== null && value !== undefined) {
                    (htmlElement as unknown as Record<string, unknown>)[name] = value;
                }
            }
        }
    }

    // Add children
    for (const child of children) {
        add(htmlElement, child);
    }

    return htmlElement;
}

function add(elt: HTMLElement, child: ChildElement): void {
    // Handle null/undefined first (most common edge case)
    if (isUndefinedOrNull(child )) {
        return;
    }

    // Handle strings (very common case)
    if (typeof child === 'string') {
        elt.appendChild(document.createTextNode(child));
        return;
    }

    // Handle arrays (need to recurse)
    if (Array.isArray(child)) {
        for (const item of child) {
            add(elt, item as ChildElement);
        }
        return;
    }

    // Handle Node objects (common case)
    if ('nodeType' in child && typeof child.nodeType === 'number') {
        elt.appendChild(child);
        return;
    }

    // This should never be reached with proper TypeScript usage
    throw new RangeError(`Unsupported child node: ${JSON.stringify(child)}`);
}
