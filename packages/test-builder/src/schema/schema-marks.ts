import type { DOMOutputSpec, DOMOutputSpecArray, Mark, MarkSpec } from '@type-editor/model';

const emDOM: DOMOutputSpec = ['em', 0],
    strongDOM: DOMOutputSpec = ['strong', 0],
    underlineDOM: DOMOutputSpec = ['u', 0],
    strikethroughDOM: DOMOutputSpec = ['s', 0],
    subscriptDOM: DOMOutputSpec = ['sub', 0],
    superscriptDOM: DOMOutputSpec = ['sup', 0],
    highlightDOM: DOMOutputSpec = ['mark', 0],
    codeDOM: DOMOutputSpec = ['code', 0];


/**
 * [Specs](#model.MarkSpec) for the marks in the schema.
 */
export const marks = {

    /**
     * A link. Has `href` and `title` attributes. `title`
     * defaults to the empty string. Rendered and parsed as an `<a>`
     * element.
     */
    link: {
        attrs: {
            href: { validate: 'string' },
            title: { default: null, validate: 'string|null' },
            target: { default: null, validate: '_blank|null' },
            rel: { default: 'noopener noreferrer', validate: 'string|null' },
        },
        inclusive: false,
        parseDOM: [
            {
                tag: 'a[href]',
                getAttrs(dom: HTMLElement) {
                    return {
                        href: dom.getAttribute('href'),
                        title: dom.getAttribute('title'),
                        target: dom.getAttribute('target'),
                    };
                },
            },
        ],
        toDOM(mark: Mark) {
            const { href, title, target, rel } = mark.attrs;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            return ['a', { href, title, target, rel }, 0];
        },
    } as MarkSpec,

    /**
     * An inline file node as link (`<a>`). Supports `href`,
     * `name`, `lastModified`, `size`, and `type` attributes.
     */
    file: {
        inline: true,
        attrs: {
            href: { validate: 'string' },
            previewImage: { default: null, validate: 'string|null' },
            name: { default: null, validate: 'string|null' },
            lastModified: { default: null, validate: 'string|null' },
            size: { default: null, validate: 'string|number|null' },
            type: { default: true, validate: 'boolean' },
            id: { default: null, excludeFromMarkupComparison: true },
        },
        group: 'inline',
        draggable: true,
        parseDOM: [
            {
                tag: 'a[download]',
                getAttrs(htmlElement: HTMLElement) {
                    return {
                        href: htmlElement.getAttribute('href'),
                        previewImage: htmlElement.querySelector('img') ? htmlElement.querySelector('img').getAttribute('src') : null,
                        name: htmlElement.dataset.pmname,
                        lastModified: htmlElement.dataset.pmlastModified,
                        size: htmlElement.dataset.pmsize,
                        type: htmlElement.dataset.pmtype,
                        id: htmlElement.dataset.pmid,
                    };
                },
            },
        ],
        toDOM(mark: Mark): DOMOutputSpecArray {
            const { href, name, lastModified, size, type, id } = mark.attrs;

            return ['a', {
                href,
                ['data-pmname']: name,
                ['data-pmlastModified']: lastModified,
                ['data-pmsize']: size,
                ['data-pmtype']: type,
                ['data-pmid']: id,
                download: name,
            }, 0];

        },
    } as MarkSpec,

    /**
     * An emphasis mark. Rendered as an `<em>` element. Has parse rules
     * that also match `<i>` and `font-style: italic`.
     */
    em: {
        parseDOM: [
            {tag: 'i'},
            {tag: 'em'},
            {style: 'font-style=italic'},
            {style: 'font-style=normal', clearMark: (m) => m.type.name === 'em'},
        ],
        toDOM() {
            return emDOM;
        },
    } as MarkSpec,

    /**
     * A strong mark. Rendered as `<strong>`, parse rules also match
     * `<b>` and `font-weight: bold`.
     */
    strong: {
        parseDOM: [
            {tag: 'strong'},
            // This works around a Google Docs misbehavior where
            // pasted content will be inexplicably wrapped in `<b>`
            // tags with a font-weight normal.
            {
                tag: 'b',
                getAttrs: (node: HTMLElement) =>
                    node.style.fontWeight !== 'normal' && null,
            },
            {style: 'font-weight=400', clearMark: (m) => m.type.name === 'strong'},
            {
                style: 'font-weight',
                getAttrs: (value: string) =>
                    /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null,
            },
        ],
        toDOM() {
            return strongDOM;
        },
    } as MarkSpec,

    /**
     * A underline mark. Rendered as `<u>`. Has parse rules `text-decoration: underline`.
     */
    underline: {
        parseDOM: [
            {tag: 'u'},
            {style: 'text-decoration=underline'},
            {style: 'text-decoration=none', clearMark: (m) => m.type.name === 'u'},
        ],
        toDOM() {
            return underlineDOM;
        },
    } as MarkSpec,

    /**
     * An strikethrough mark. Rendered as an `<s>` element. Has parse rules
     * that also match `<del>`, `<strike>` and `text-decoration: line-through`.
     */
    strikethrough: {
        parseDOM: [
            {tag: 's'},
            {tag: 'del'},
            {tag: 'strike'},
            {style: 'text-decoration=line-through'},
            {style: 'text-decoration=none', clearMark: (m) => m.type.name === 's'},
        ],
        toDOM() {
            return strikethroughDOM;
        },
    } as MarkSpec,

    /**
     * A subscript mark. Rendered as an `<sub>` element.
     */
    subscript: {
        parseDOM: [
            {tag: 'sub'},
        ],
        toDOM() {
            return subscriptDOM;
        },
    } as MarkSpec,

    /**
     * A superscript mark. Rendered as an `<sup>` element.
     */
    superscript: {
        parseDOM: [
            {tag: 'sup'},
        ],
        toDOM() {
            return superscriptDOM;
        },
    } as MarkSpec,

    /**
     * A highlight mark. Rendered as a `<mark>` element.
     */
    highlight: {
        parseDOM: [
            {tag: 'mark'},
            {style: 'background-color=transparent', clearMark: (m) => m.type.name === 'mark'},
            {style: 'background-color=none', clearMark: (m) => m.type.name === 'mark'},
        ],
        toDOM() {
            return highlightDOM;
        },
    } as MarkSpec,

    /**
     * A code font mark. Rendered as a `<code>` element.
     */
    code: {
        code: true,
        parseDOM: [{tag: 'code'}],
        toDOM() {
            return codeDOM;
        },
    } as MarkSpec,
};
