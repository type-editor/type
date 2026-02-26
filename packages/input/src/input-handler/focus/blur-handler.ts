import type {PmEditorView} from '@type-editor/editor-types';

/**
 * Handles blur events. Updates focus state, removes focused CSS class,
 * and clears selection tracking if focus moved to an element within the editor.
 */
export function blurHandler(view: PmEditorView, event: FocusEvent): boolean {
    if (view.focused) {
        view.domObserver.stop();
        view.dom.classList.remove('ProseMirror-focused');
        view.domObserver.start();
        if (event.relatedTarget && view.dom.contains(event.relatedTarget as HTMLElement)) {
            view.domObserver.currentSelection.clear();
        }
        view.focused = false;
    }
    return false;
}
