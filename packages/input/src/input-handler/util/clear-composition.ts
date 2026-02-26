import type {PmEditorView} from '@type-editor/editor-types';

/**
 * Clears composition state and marks affected DOM nodes as dirty so they
 * will be re-rendered.
 * @param view - The editor view
 */
export function clearComposition(view: PmEditorView): void {
    if (view.composing) {
        view.input.composing = false;
        view.input.compositionEndedAt = timestampFromCustomEvent();
    }

    while (view.input.compositionNodes.length > 0) {
        view.input.compositionNodes.pop().markParentsDirty();
    }
}

/**
 * Creates a custom event to get a current timestamp value.
 * @returns Current timestamp
 */
function timestampFromCustomEvent(): number {
    const event = new Event('event', { bubbles: true, cancelable: true });
    return event.timeStamp;
}
