
let _detachedDoc: Document | null = null;
export function detachedDoc(): Document {
    return _detachedDoc || (_detachedDoc = document.implementation.createHTMLDocument('title'));
}

/**
 * Trick from jQuery -- some elements must be wrapped in other
 * elements for innerHTML to work. I.e. if you do `div.innerHTML =
 * "<td>..</td>"` the table cells are ignored.
 */
export const wrapMap: Record<string, Array<string>> = {
    thead: ['table'],
    tbody: ['table'],
    tfoot: ['table'],
    caption: ['table'],
    colgroup: ['table'],
    col: ['table', 'colgroup'],
    tr: ['table', 'tbody'],
    td: ['table', 'tbody', 'tr'],
    th: ['table', 'tbody', 'tr']
};
