import type { DOMOutputSpecArray, NodeSpec, PmNode } from '@type-editor/model';


/**
 * [Specs](#model.NodeSpec) for the nodes defined in this schema.
 */
export const inlineElements: Record<string, NodeSpec> = {

    /**
     * A text node.
     */
    text: {
        group: 'inline',
    } as NodeSpec,

    /**
     * An inline image (`<img>`) node. Supports `src`,
     * `alt`, and `title` attributes. The latter two default to the empty
     * string.
     */
    image: {
        inline: true,
        attrs: {
            src: { validate: 'string' },
            alt: { default: null, validate: 'string|null' },
            title: { default: null, validate: 'string|null' },
            size: { default: null, validate: 'string|number|null' },
            textaround: { default: true, validate: 'string|boolean' },
            caption: { default: null, validate: 'string|null' },
            width: { default: null, validate: 'string|null' },
            height: { default: null, validate: 'string|null' },
            cssClass: { default: null, validate: 'string|null' },
            id: { default: null, excludeFromMarkupComparison: true },
        },
        group: 'inline',
        draggable: true,
        marks: '',
        parseDOM: [
            {
                tag: 'img[src]',
                getAttrs(htmlElement: HTMLElement) {
                    return {
                        src: htmlElement.getAttribute('src'),
                        title: htmlElement.getAttribute('title'),
                        alt: htmlElement.getAttribute('alt'),
                        width: htmlElement.getAttribute('width'),
                        height: htmlElement.getAttribute('height'),
                        cssClass: htmlElement.dataset.cssClass,
                        size: htmlElement.dataset.pmsize,
                        textaround: htmlElement.dataset.pmtextaround,
                        caption: htmlElement.dataset.pmcaption,
                        id: htmlElement.dataset.pmid,
                    };
                },
            },
        ],
        toDOM(node: PmNode): DOMOutputSpecArray {
            const { src, alt, title, caption, size, id, textaround, width, height, cssClass } = node.attrs;

            if (caption) {
                const outerCssClass = size && textaround ? `img${size}Float` : size ? `img${size}` : null;

                return ['div', {class: outerCssClass}, ['img', {
                    src,
                    alt,
                    title,
                    width,
                    height,
                    class: cssClass,
                    ['data-pmsize']: size,
                    ['data-pmid']: id,
                    ['data-pmtextaround']: textaround,
                    ['data-pmcaption']: caption
                }], ['figcaption', caption]];
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const cssClassList = size && textaround ? `${cssClass ?? ''} img${size}Float` : size ? `${cssClass ?? ''} img${size}` : (cssClass ?? null);

            return ['img', {
                src,
                alt,
                title,
                width,
                height,
                class: cssClassList,
                ['data-pmsize']: size,
                ['data-pmid']: id,
                ['data-pmtextaround']: textaround,
                ['data-pmcaption']: caption,
            }];

        },
    } as NodeSpec,

    /**
     * A hard line break, represented in the DOM as `<br>`.
     */
    hard_break: {
        attrs: {
            id: { default: null, excludeFromMarkupComparison: true },
        },
        inline: true,
        group: 'inline',
        selectable: false,
        parseDOM: [
            {
                tag: 'br',
                getAttrs: (htmlElement: HTMLElement): { id: string } => {
                    return {
                        id: htmlElement.dataset.pmid,
                    };
                },
            },
        ],
        toDOM(node: PmNode): DOMOutputSpecArray {
            return ['br', {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                ['data-pmid']: node.attrs.id,
            }];
        },
    } as NodeSpec,

    /**
     * An image caption (`<figcaption>`).
     */
    // figcaption: {
    //     attrs: {
    //         id: { default: null },
    //     },
    //     content: 'inline*',
    //     marks: 'strong em',
    //     inline: true,
    //     group: 'inline',
    //     draggable: false,
    //     parseDOM: [
    //         {
    //             tag: 'figcaption',
    //             getAttrs: (htmlElement: HTMLElement): { id: string } => {
    //                 return {
    //                     id: htmlElement.dataset.pmid,
    //                 };
    //             },
    //         },
    //     ],
    //     toDOM(node: PmNode): DOMOutputSpecArray {
    //         return ['figcaption', {
    //             // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //             ['data-pmid']: node.attrs.id,
    //         }, 0];
    //     },
    // } as NodeSpec,
};
