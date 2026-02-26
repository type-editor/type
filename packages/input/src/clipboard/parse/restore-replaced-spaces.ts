import {browser} from '@type-editor/commons';

/**
 * WebKit sometimes replaces spaces with NBSPs inside a wrapper span when
 * copying. This restores normal spaces for those placeholder spans.
 *
 * @param dom - The DOM element to process
 */
export function restoreReplacedSpaces(dom: HTMLElement): void {
    const selector = browser.chrome ? 'span:not([class]):not([style])' : 'span.Apple-converted-space';
    const nodes: NodeListOf<Element> = dom.querySelectorAll(selector);
    for (const node of Array.from(nodes)) {
        if (node.childNodes.length === 1 && node.textContent === '\u00a0' && node.parentNode) {
            node.parentNode.replaceChild(dom.ownerDocument.createTextNode(' '), node);
        }
    }
}
