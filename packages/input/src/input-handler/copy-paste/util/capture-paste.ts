import type {PmEditorView} from '@type-editor/editor-types';

import {KEY_INSERT} from '../../key-codes';
import {doPaste} from './do-paste';

// Delay for clipboard capture fallback (ms)
const CAPTURE_PASTE_DELAY = 50;


/**
 * Fallback paste mechanism for browsers with broken clipboard APIs.
 * Creates a temporary off-screen element, focuses it to receive the paste,
 * then processes the pasted content.
 * @param view - The editor view
 * @param event - The paste event
 */
export function capturePaste(view: PmEditorView, event: ClipboardEvent): void {
    if (!view.dom.parentNode) {
        return;
    }

    // Use plaintext mode if Shift is held or we're in a code block
    const plainText: boolean = view.input.shiftKey || view.state.selection.$from.parent.type.spec.code;
    const target: HTMLTextAreaElement | HTMLDivElement = view.dom.parentNode.appendChild(document.createElement(plainText ? 'textarea' : 'div'));

    if (!plainText) {
        target.contentEditable = 'true';
    }

    // Position the target element off-screen so it's not visible during paste
    target.style.cssText = 'position: fixed; left: -10000px; top: 10px';
    target.focus();

    // After giving the browser time to paste into the target element,
    // extract the content and process it
    const plain: boolean = view.input.shiftKey && view.input.lastKey !== KEY_INSERT;
    setTimeout(() => {
        view.focus();
        if (target.parentNode) {
            target.parentNode.removeChild(target);
        }

        // Extract text/HTML from the target element based on its type
        if (plainText) {
            doPaste(view, (target as HTMLTextAreaElement).value, null, plain, event);
        } else {
            doPaste(view, target.textContent, target.innerHTML, plain, event);
        }
    }, CAPTURE_PASTE_DELAY);
}
