import {detachedDoc, wrapMap} from '../util';


const firstTagRegex = /<([a-z][^>\s]+)/i;
const metaRegex = /^(\s*<meta [^>]*>)*/;

/**
 * Parse an HTML string into a detached DIV, applying necessary wrappers
 * for certain elements so innerHTML works across browsers.
 *
 * @param html - The HTML string to parse
 * @returns A div element containing the parsed HTML
 */
export function readHTML(html: string): HTMLDivElement {
    const metas: RegExpExecArray = metaRegex.exec(html);
    if (metas) {
        html = html.slice(metas[0].length);
    }

    let divElement: HTMLDivElement = detachedDoc().createElement('div');
    const firstTagMatch: RegExpExecArray = firstTagRegex.exec(html);

    let wrappers: Array<string> | undefined;
    if (firstTagMatch) {
        const tag: string = firstTagMatch[1].toLowerCase();
        wrappers = wrapMap[tag];
    }

    if (wrappers) {
        html = wrappers
                .map(n => '<' + n + '>')
                .join('')
            + html
            + wrappers.map(n => '</' + n + '>')
                .reverse()
                .join('');
    }

    divElement.innerHTML = maybeWrapTrusted(html);
    if (wrappers) {
        for (const item of wrappers) {
            divElement = divElement.querySelector(item) || divElement;
        }
    }
    return divElement;
}

/**
 * Wrap HTML strings using Trusted Types policy when available, to avoid
 * CSP restrictions blocking innerHTML on detached documents.
 *
 * @param html - The HTML string to wrap
 * @returns The wrapped HTML or original string if Trusted Types not available
 */
let _policy: TrustedTypesPolicy | null = null;
function maybeWrapTrusted(html: string): string {
    const trustedTypes: TrustedTypes = window.trustedTypes;
    if (!trustedTypes) {
        return html;
    }

    _policy ??= trustedTypes.defaultPolicy
        ?? trustedTypes.createPolicy('ProseMirrorClipboard', { createHTML: (s: string) => s });

    return _policy.createHTML(html);
}
