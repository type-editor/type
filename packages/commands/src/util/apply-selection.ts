import type {PmEditorView, PmSelection} from '@type-editor/editor-types';


/**
 * Applies a new selection to the editor view.
 *
 * @param view - The EditorView instance
 * @param selection - The selection to apply
 * @returns Always returns true to indicate the event was handled
 */
export function applySelection(view: PmEditorView, selection: PmSelection): boolean {
    view.dispatch(view.state.transaction.setSelection(selection).scrollIntoView());
    return true;
}
