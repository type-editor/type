import type {DOMOutputSpec, NodeSpec} from '@type-editor-compat/model';

const olDOM: DOMOutputSpec = ['ol', 0];
const ulDOM: DOMOutputSpec = ['ul', 0];
const liDOM: DOMOutputSpec = ['li', 0];


/**
 * An ordered list [node spec](#model.NodeSpec). Has a single
 * attribute, `order`, which determines the number at which the list
 * starts counting, and defaults to 1. Represented as an `<ol>`
 * element.
 */
export const orderedList = {
    attrs: {order: {default: 1, validate: 'number'}},
    parseDOM: [
        {
            tag: 'ol',
            getAttrs(dom: HTMLElement) {
                return {
                    order: dom.hasAttribute('start') ? +dom.getAttribute('start') : 1,
                };
            },
        },
    ],
    toDOM(node) {
        return node.attrs.order === 1
            ? olDOM
            : ['ol', {start: node.attrs.order}, 0];
    },
} as NodeSpec;

/**
 * A bullet list node spec, represented in the DOM as `<ul>`.
 */
export const bulletList: NodeSpec = {
    parseDOM: [{tag: 'ul'}],
    toDOM() {
        return ulDOM;
    },
};

/**
 * A list item (`<li>`) spec.
 */
export const listItem: NodeSpec = {
    parseDOM: [{tag: 'li'}],
    toDOM() {
        return liDOM;
    },
    defining: true,
};
