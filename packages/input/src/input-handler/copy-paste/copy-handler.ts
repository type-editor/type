import type {PmEditorView} from '@type-editor/editor-types';
import type {PmSelection} from '@type-editor/editor-types';
import type {Slice} from '@type-editor/model';

import {serializeForClipboard} from '../../clipboard/serialize-for-clipboard';
import {brokenClipboardAPI} from '../util/broken-clipboard-api';

// Delay for clipboard capture fallback (ms)
const CAPTURE_PASTE_DELAY = 50;

/**
 * Handles copy and cut events. Serializes the selected content and puts
 * it on the clipboard. For cut events, also deletes the selection.
 */
export function copyHandler(view: PmEditorView, event: ClipboardEvent): boolean {
    const selection: PmSelection = view.state.selection;
    const cut: boolean = event.type === 'cut';
    if (selection.empty) {
        return;
    }

    // IE and Edge's clipboard interface is completely broken
    const data: DataTransfer = brokenClipboardAPI ? null : event.clipboardData;
    const slice: Slice = selection.content();
    const { dom, text } = serializeForClipboard(view, slice);

    if (data) {
        event.preventDefault();
        data.clearData();
        data.setData('text/html', dom.innerHTML);
        data.setData('text/plain', text);
    } else {
        captureCopy(view, dom);
    }

    if (cut) {
        view.dispatch(view.state.transaction.deleteSelection().scrollIntoView().setMeta('uiEvent', 'cut'));
    }
}

/**
 * Fallback copy mechanism for browsers with broken clipboard APIs.
 * Creates a temporary off-screen element, selects its contents, and
 * lets the browser's native copy handle it.
 * @param view - The editor view
 * @param dom - The DOM element containing the content to copy
 */
function captureCopy(view: PmEditorView, dom: HTMLElement): void {
    // The extra wrapper is somehow necessary on IE/Edge to prevent the
    // content from being mangled when it is put onto the clipboard
    if (!view.dom.parentNode) {
        return;
    }

    // Create an off-screen element positioned far to the left
    const divWrapper: HTMLDivElement = view.dom.parentNode.appendChild(document.createElement('div'));
    divWrapper.appendChild(dom);
    divWrapper.style.cssText = 'position: fixed; left: -10000px; top: 10px';

    // Select the content in the off-screen element
    const selection: DOMSelection = getSelection();
    const range: Range = document.createRange();
    range.selectNodeContents(dom);

    // Blur the editor first to prevent IE from firing a selectionchange event
    // that would interfere with the editor's selection state
    view.dom.blur();
    selection.removeAllRanges();
    selection.addRange(range);

    // After the native copy operation has a chance to complete, clean up
    // and restore focus to the editor
    setTimeout(() => {
        if (divWrapper.parentNode) {
            divWrapper.parentNode.removeChild(divWrapper);
        }
        view.focus();
    }, CAPTURE_PASTE_DELAY);
}
