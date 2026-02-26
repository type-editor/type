import type {PmEditorView} from '@type-editor/editor-types';

import {forceDOMFlush} from '../util/force-dom-flush';

/**
 * Handles contextmenu events, ensuring DOM is flushed before showing menu.
 */
export function contextMenuHandler(view: PmEditorView): boolean {
    forceDOMFlush(view);
    return false;
}
