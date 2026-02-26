import type {PmEditorView} from '@type-editor/editor-types';

/**
 * Handles dragover and dragenter events. Prevents default to allow drops.
 */
export function dragOverEnterHandler(_view: PmEditorView, event: Event): boolean {
    event.preventDefault();
    return true;
}
