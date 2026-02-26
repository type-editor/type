import type {PmEditorView} from '@type-editor/editor-types';

/**
 * Records the origin of a selection change for tracking purposes.
 * @param view - The editor view
 * @param origin - The origin type (e.g., 'key', 'pointer', 'paste')
 */
export function setSelectionOrigin(view: PmEditorView, origin: string): void {
    view.input.lastSelectionOrigin = origin;
    view.input.lastSelectionTime = Date.now();
}
