import {browser} from '@type-editor/commons';
import type {PmEditorView} from '@type-editor/editor-types';
import {DOMParser, type PmNode, type ResolvedPos, Slice} from '@type-editor/model';

import {addContext} from './parse/add-context';
import {closeSlice} from './parse/close-slice';
import {createCodeBlockSlice} from './parse/create-code-block-slice';
import {createDOMFromPlainText} from './parse/create-dom-from-plain-text';
import {normalizeSiblings} from './parse/normalize-siblings';
import {readHTML} from './parse/read-html';
import {restoreReplacedSpaces} from './parse/restore-replaced-spaces';
import {unwrapSerializedDOM} from './parse/unwrap-serialized-dom';


const inlineParents = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;


/**
 * Read a slice from clipboard data (text and/or html).
 * Handles plaintext, html, and various ProseMirror-specific clipboard markers.
 *
 * @param view - The editor view
 * @param text - Plain text from the clipboard (may be empty)
 * @param html - HTML from the clipboard (may be null)
 * @param plainText - Whether the source explicitly requested plain text handling
 * @param $context - The resolved position representing current selection context
 * @returns A Slice to be inserted or null when nothing available
 */
export function parseFromClipboard(view: PmEditorView,
                                   text: string,
                                   html: string | null,
                                   plainText: boolean,
                                   $context: ResolvedPos): Slice | null {
    const inCode: boolean = $context.parent.type.spec.code;
    let dom: HTMLElement | undefined;
    let slice: Slice | undefined;

    if (!html && !text) {return null;}

    const asText: boolean = Boolean(text) && (plainText || inCode || !html);

    if (asText) {
        console.log('Parsing clipboard as plain text');
        // Allow plugin hooks to transform pasted text first
        view.someProp('transformPastedText', f => { text = f(text, inCode || plainText, view); });

        if (inCode) {
            // Paste into code block: keep it as plain text node
            slice = createCodeBlockSlice(view, text);
            view.someProp('transformPasted', f => { slice = f(slice, view, true); });
            return slice;
        }

        // Allow a custom plaintext-to-slice parser
        const parsed: Slice = view.someProp('clipboardTextParser', f => f(text, $context, plainText, view));
        if (parsed) {
            slice = parsed;
        } else {
            // Convert plain text into paragraph nodes with current marks
            dom = createDOMFromPlainText(view, text, $context);
        }
    } else {
        console.log('Parsing clipboard as HTML');
        // HTML path
        view.someProp('transformPastedHTML', f => { html = f(html, view); });
        if (html) {
            dom = readHTML(html);
            if (browser.webkit) {
                restoreReplacedSpaces(dom);
            }
        }
    }

    // Look for ProseMirror-specific slice metadata
    const contextNode: HTMLElement | null | undefined = dom?.querySelector('[data-pm-slice]');
    const sliceData: RegExpExecArray = contextNode && /^([0-9]+) ([0-9]+)(?: -([0-9]+))? (.*)/.exec(contextNode.getAttribute('data-pm-slice') || '') || null;

    // If wrappers were added when serializing, unwrap the DOM down to the inner element
    if (sliceData?.[3]) {
        dom = unwrapSerializedDOM(dom, Number(sliceData[3]));
    }

    if (!slice) {
        // Ensure we have a valid DOM element to parse
        if (!dom) {
            return null;
        }

        const parser: DOMParser = view.someProp('clipboardParser')
            || view.someProp('domParser')
            || DOMParser.fromSchema(view.state.schema);

        slice = parser.parseSlice(dom, {
            preserveWhitespace: Boolean(asText || sliceData),
            context: $context,
            ruleFromNode(domNode: Node): { ignore: boolean } | null {
                // Ignore trailing BRs in block parents (DOM Node, not ProseMirror Node)
                if (domNode instanceof Element
                    && domNode.nodeName === 'BR'
                    && !domNode.nextSibling
                    && domNode.parentNode instanceof Element
                    && !inlineParents.test(domNode.parentNode.nodeName)) {
                    return { ignore: true };
                }
                return null;
            }
        });
    }

    if (sliceData) {
        slice = addContext(closeSlice(slice, Number(sliceData[1]), Number(sliceData[2])), sliceData[4]);
    } else {
        // For HTML not created by ProseMirror, try to make top-level siblings coherent
        slice = Slice.maxOpen(normalizeSiblings(slice.content, $context), true);
        if (slice.openStart > 0 || slice.openEnd > 0) {
            let openStart = 0;
            let openEnd = 0;

            // Safely traverse to find non-isolating depth (openStart) from start
            let firstChild: PmNode = slice.content.firstChild;
            while (firstChild && openStart < slice.openStart && !firstChild.type.spec.isolating) {
                openStart++;
                firstChild = firstChild.firstChild;
            }

            // Safely traverse to find non-isolating depth (openEnd) from end
            let lastChild: PmNode = slice.content.lastChild;
            while (lastChild && openEnd < slice.openEnd && !lastChild.type.spec.isolating) {
                openEnd++;
                lastChild = lastChild.lastChild;
            }

            slice = closeSlice(slice, openStart, openEnd);
        }
    }

    view.someProp('transformPasted', f => { slice = f(slice, view, asText); });

    return slice;
}

