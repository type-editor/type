import {browser} from '@type-editor/commons';
import type {PmEditorView} from '@type-editor/editor-types';

import {KEY_INSERT} from '../key-codes';
import {brokenClipboardAPI} from '../util/broken-clipboard-api';
import {getText} from '../util/get-text';
import {capturePaste} from './util/capture-paste';
import {doPaste} from './util/do-paste';

/**
 * Handles paste events. During composition (except on Android), defers to
 * browser's native handling. Otherwise, extracts clipboard data and processes it.
 */
export function pasteHandler(view: PmEditorView, event: ClipboardEvent): boolean {
    // Handling paste from JavaScript during composition is very poorly
    // handled by browsers, so as a dodgy but preferable kludge, we just
    // let the browser do its native thing there, except on Android,
    // where the editor is almost always composing.
    if (view.composing && !browser.android) {
        return false;
    }

    const data: DataTransfer = brokenClipboardAPI ? null : event.clipboardData;
    const plain: boolean = view.input.shiftKey && view.input.lastKey !== KEY_INSERT;

    if (data && doPaste(view, getText(data), data.getData('text/html'), plain, event)) {
        event.preventDefault();
        return true;
    }
    else {
        capturePaste(view, event);
    }
    return false;
}
