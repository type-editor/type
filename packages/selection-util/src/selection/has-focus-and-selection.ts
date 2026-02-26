import type {PmEditorView} from '@type-editor/editor-types';

import {hasSelection} from './has-selection';


/**
 * Checks if the editor both has focus and contains a selection.
 *
 * For editable views, this requires the view to have focus.
 * For all views, this checks if a valid selection exists within the editor.
 *
 * @param view - The editor view to check
 * @returns True if the view has focus (when editable) and contains a selection
 */
export function hasFocusAndSelection(view: PmEditorView): boolean {
    if (view.editable && !view.hasFocus()) {
        return false;
    }
    return hasSelection(view);
}
