import type { DOMOutputSpecArray, NodeSpec, PmNode } from '@type-editor/model';


/**
 * [Specs](#model.NodeSpec) for the nodes defined in this schema.
 */
export const blockElements: Record<string, NodeSpec> = {
    /**
     * NodeSpec The top level document node.
     */
    doc: {
        topNode: true,
        content: 'block+',
        attrs: {
            id: { default: null, excludeFromMarkupComparison: true },
            version: { default: null, excludeFromMarkupComparison: true },
            preVersion: { default: null, excludeFromMarkupComparison: true },
        },
        parseDOM: [
            {
                tag: 'main[data-pmroot]',
                getAttrs: (htmlElement: HTMLElement): { id: string, version: string, preVersion: string } => {
                    return {
                        id: htmlElement.dataset.pmid,
                        version: htmlElement.dataset.pmversion,
                        preVersion: htmlElement.dataset.pmversion,
                    };
                },
            },
        ],
        toDOM(node: PmNode): DOMOutputSpecArray {
            return ['main', {
                ['data-pmroot']: 'true',
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                ['data-pmversion']: node.attrs.version ?? null,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                ['data-pmprevision']: node.attrs.preVersion ?? null,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                ['data-pmid']: node.attrs.id,
            }, 0];
        },
    } as NodeSpec,

    /**
     * A plain paragraph textblock. Represented in the DOM
     * as a `<p>` element.
     */
    paragraph: {
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
        content: 'inline*',
        group: 'block',
        parseDOM: [
            {
                tag: 'p',
                getAttrs: (htmlElement: HTMLElement): { align: string, id: string } => {
                    return {
                        align: htmlElement.style.textAlign || null,
                        id: htmlElement.dataset.pmid,
                    };
                },
            },
        ],
        toDOM(node: PmNode) {
            return ['p', {
                style: node.attrs.align ? `text-align:${node.attrs.align};` : null,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                ['data-pmid']: node.attrs.id,
            }, 0];
        },
    } as NodeSpec,

    /**
     * A blockquote (`<blockquote>`) wrapping one or more blocks.
     */
    blockquote: {
        attrs: {
            id: { default: null, excludeFromMarkupComparison: true },
        },
        content: 'block+',
        group: 'block',
        defining: true,
        parseDOM: [
            {
                tag: 'blockquote',
                getAttrs: (htmlElement: HTMLElement): { id: string } => {
                    return {
                        id: htmlElement.dataset.pmid,
                    };
                },
            },
        ],
        toDOM(node: PmNode): DOMOutputSpecArray {
            return ['blockquote', {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                ['data-pmid']: node.attrs.id,
            }, 0];
        },
    } as NodeSpec,

    /**
     * A horizontal rule (`<hr>`).
     */
    horizontal_rule: {
        attrs: {
            id: { default: null, excludeFromMarkupComparison: true },
        },
        group: 'block',
        parseDOM: [
            {
                tag: 'hr',
                getAttrs: (htmlElement: HTMLElement): { id: string } => {
                    return {
                        id: htmlElement.dataset.pmid,
                    };
                },
            },
        ],
        toDOM(node: PmNode): DOMOutputSpecArray {
            return ['hr', {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                ['data-pmid']: node.attrs.id,
            }, 0];
        },
    } as NodeSpec,

    /**
     * A heading textblock, with a `level` attribute that
     * should hold the number 1 to 6. Parsed and serialized as `<h1>` to
     * `<h6>` elements.
     */
    heading: {
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
            level: { default: 1, validate: 'number' },
        },
        // content: 'text*|image',
        content: 'inline*',
        marks: 'link',
        group: 'block',
        defining: true,
        parseDOM: [
            {
                tag: 'h1',
                getAttrs: (htmlElement: HTMLElement): { level: number, align: string, id: string } => {
                    return {
                        level: 1,
                        align: htmlElement.style.textAlign || null,
                        id: htmlElement.dataset.pmid,
                    };
                },
            },
            {
                tag: 'h2',
                getAttrs: (htmlElement: HTMLElement): { level: number, align: string, id: string } => {
                    return {
                        level: 2,
                        align: htmlElement.style.textAlign || null,
                        id: htmlElement.dataset.pmid,
                    };
                },
            },
            {
                tag: 'h3',
                getAttrs: (htmlElement: HTMLElement): { level: number, align: string, id: string } => {
                    return {
                        level: 3,
                        align: htmlElement.style.textAlign || null,
                        id: htmlElement.dataset.pmid,
                    };
                },
            },
            {
                tag: 'h4',
                getAttrs: (htmlElement: HTMLElement): { level: number, align: string, id: string } => {
                    return {
                        level: 4,
                        align: htmlElement.style.textAlign || null,
                        id: htmlElement.dataset.pmid,
                    };
                },
            },
            {
                tag: 'h5',
                getAttrs: (htmlElement: HTMLElement): { level: number, align: string, id: string } => {
                    return {
                        level: 5,
                        align: htmlElement.style.textAlign || null,
                        id: htmlElement.dataset.pmid,
                    };
                },
            },
            {
                tag: 'h6',
                getAttrs: (htmlElement: HTMLElement): { level: number, align: string, id: string } => {
                    return {
                        level: 6,
                        align: htmlElement.style.textAlign || null,
                        id: htmlElement.dataset.pmid,
                    };
                },
            },
        ],
        toDOM(node: PmNode) {
            return [`h${node.attrs.level}`, {
                style: node.attrs.align ? `text-align:${node.attrs.align};` : null,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                ['data-pmid']: node.attrs.id,
            }, 0];
        },
    } as NodeSpec,

    /**
     * A code listing. Disallows marks or non-text inline
     * nodes by default. Represented as a `<pre>` element with a
     * `<code>` element inside of it.
     *
     */
    code_block: {
        attrs: {
            id: { default: null, excludeFromMarkupComparison: true },
        },
        content: 'text*',
        marks: 'code',
        group: 'block',
        code: true,
        defining: true,
        parseDOM: [
            {
                tag: 'pre',
                preserveWhitespace: 'full',
                getAttrs: (htmlElement: HTMLElement): { id: string } => {
                    return {
                        id: htmlElement.dataset.pmid,
                    };
                },
            },
        ],
        toDOM(node: PmNode) {
            return ['pre', {

                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                ['data-pmid']: node.attrs.id,

            }, 0];
        },
    } as NodeSpec,

    /**
     * A figure that can replace a paragraph but contains an image and a figcaption. Represented in the DOM
     * as a `<figure>` element.
     */
    figure: {
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
        content: 'inline*',
        group: 'block',
        parseDOM: [
            {
                tag: 'figure',
                getAttrs: (htmlElement: HTMLElement): { align: string, id: string } => {
                    return {
                        align: htmlElement.style.textAlign || null,
                        id: htmlElement.dataset.pmid,
                    };
                },
            },
        ],
        toDOM(node: PmNode) {
            return ['figure', {
                style: node.attrs.align ? `text-align:${node.attrs.align};` : null,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                ['data-pmid']: node.attrs.id,
            }, 0];
        },
    } as NodeSpec,
};
