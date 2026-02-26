import type {PmEditorView} from '@type-editor/editor-types';
import type {Slice} from '@type-editor/model';

// Delay before cleaning up drag state (ms)
const DRAG_END_CLEANUP_DELAY = 50;

/**
 * Handles dragend events. Clears the dragging state after a short delay
 * to ensure drop events are processed first.
 */
export function dragEndHandler(view: PmEditorView): boolean {
    const dragging: { slice: Slice; move: boolean } = view.dragging;
    window.setTimeout(() => {
        if (view.dragging === dragging) {
            view.dragging = null;
        }
    }, DRAG_END_CLEANUP_DELAY);
    return false;
}
