import type {PmEditorView} from '@type-editor/editor-types';
import {selectionToDOM} from '@type-editor/selection-util';

// Delay before syncing selection after focus (ms)
const FOCUS_SELECTION_DELAY = 20;

/**
 * Handles focus events. Updates focus state, adds focused CSS class,
 * and ensures selection is properly synced to DOM after a short delay.
 */
export function focusHandler(view: PmEditorView): boolean {
    view.input.lastFocus = Date.now();
    if (!view.focused) {
        view.domObserver.stop();
        view.dom.classList.add('ProseMirror-focused');
        view.domObserver.start();
        view.focused = true;

        // After a short delay, check if the DOM selection matches our tracked selection.
        // This delay gives the browser time to set up its own selection state after focus.
        setTimeout(() => {
            if (view.docView
                && view.hasFocus()
                && !view.domObserver.currentSelection.eq(view.domSelectionRange())) {
                selectionToDOM(view);
            }
        }, FOCUS_SELECTION_DELAY);
    }
    return false;
}
