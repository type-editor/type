import type { NodeSpec, PmNode } from '@type-editor/model';


/**
 * An ordered list [node spec](#model.NodeSpec). Has a single
 * attribute, `order`, which determines the number at which the list
 * starts counting, and defaults to 1. Represented as an `<ol>`
 * element.
 */
export const orderedList = {
    attrs: {
        order: { default: 1, validate: 'number' },
        id: { default: null, excludeFromMarkupComparison: true },
        align: {
            default: null,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            validate: (value: any): void => {
                if (
                    !(
                        !value ||
                        value === 'left' ||
                        value === 'right' ||
                        value === 'justify' ||
                        value === 'center'
                    )
                ) {
                    throw new Error('Unsupported value for text-align');
                }
            },
        },
    },
    parseDOM: [
        {
            tag: 'ol',
            getAttrs: (htmlElement: HTMLElement): { order: number,align: string, id: string } => {
                return {
                    align: htmlElement.style.textAlign || null,
                    id: htmlElement.dataset.pmid,
                    order: htmlElement.hasAttribute('start') ? +htmlElement.getAttribute('start') : 1,
                };
            },
        },
    ],
    toDOM(node) {
        return node.attrs.order === 1
            ? ['ol', {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                ['data-pmid']: node.attrs.id,
            }, 0]
            : ['ol', {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                start: node.attrs.order,
                style: node.attrs.align ? `text-align:${node.attrs.align};` : null,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                ['data-pmid']: node.attrs.id,
            },
                0];
    },
} as NodeSpec;

/**
 * A bullet list node spec, represented in the DOM as `<ul>`.
 */
export const bulletList: NodeSpec = {
    attrs: {
        id: { default: null, excludeFromMarkupComparison: true },
        align: {
            default: null,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            validate: (value: any): void => {
                if (
                    !(
                        !value ||
                        value === 'left' ||
                        value === 'right' ||
                        value === 'justify' ||
                        value === 'center'
                    )
                ) {
                    throw new Error('Unsupported value for text-align');
                }
            },
        },
    },
    parseDOM: [
        {
            tag: 'ul',
            getAttrs: (htmlElement: HTMLElement): { align: string, id: string } => {
                return {
                    align: htmlElement.style.textAlign || null,
                    id: htmlElement.dataset.pmid,
                };
            },
        },
    ],
    toDOM(node: PmNode) {
        return ['ul', {
            style: node.attrs.align ? `text-align:${node.attrs.align};` : null,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            ['data-pmid']: node.attrs.id,

        }, 0];
    },
};

/**
 * A list item (`<li>`) spec.
 */
export const listItem: NodeSpec = {
    attrs: {
        id: { default: null, excludeFromMarkupComparison: true },
    },
    parseDOM: [
        {
            tag: 'li',
            getAttrs: (htmlElement: HTMLElement): { id: string } => {
                return {
                    id: htmlElement.dataset.pmid,
                };
            },
        },
    ],
    toDOM(node: PmNode) {
        return ['li', {

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            ['data-pmid']: node.attrs.id,

        }, 0];
    },
    defining: true,
};
