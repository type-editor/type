import type {PmEditorView, PmSelection} from '@type-editor/editor-types';
import type {ResolvedPos} from '@type-editor/model';
import {Selection} from '@type-editor/state';


/**
 * Creates a selection between two resolved positions.
 *
 * This function first checks if any plugins provide a custom 'createSelectionBetween'
 * method. If not, it falls back to creating a standard text selection. This allows
 * plugins to implement custom selection types (e.g., table cell selections).
 *
 * @param view - The editor view
 * @param $anchor - The resolved anchor position
 * @param $head - The resolved head position
 * @param bias - Optional bias for the selection direction (1 for forward, -1 for backward)
 * @returns The created selection
 */
export function selectionBetween(view: PmEditorView,
                                 $anchor: ResolvedPos,
                                 $head: ResolvedPos,
                                 bias?: number): PmSelection {
    return view.someProp('createSelectionBetween', f => f(view, $anchor, $head))
        || Selection.textSelectionBetween($anchor, $head, bias);
}
