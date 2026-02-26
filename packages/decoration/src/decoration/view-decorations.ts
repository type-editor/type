import type {DecorationSource, PmEditorView} from '@type-editor/editor-types';

import {DecorationGroup} from './DecorationGroup';
import {DecorationSet} from './DecorationSet';


/**
 * Get the decorations associated with the current props of a view.
 * This function collects decorations from all plugin decorations props
 * and the cursor wrapper if present.
 *
 * This is called internally by the view to collect all decorations that
 * should be rendered. It aggregates decorations from:
 * - All plugins that provide a `decorations` prop
 * - The cursor wrapper (for gap cursor, etc.)
 *
 * @param view - The editor view to get decorations for
 * @returns A decoration source (DecorationSet or DecorationGroup) containing all active decorations
 */
export function viewDecorations(view: PmEditorView): DecorationSource {
    const found: Array<DecorationSource> = [];

    // Collect decorations from all plugins that provide them
    view.someProp('decorations', callbackFunc => {
        const result: DecorationSource = callbackFunc(view.state);
        if (result && result !== DecorationSet.empty) {
            found.push(result);
        }
    });

    // Add cursor wrapper decoration if present
    if (view.cursorWrapper) {
        found.push(DecorationSet.create(view.state.doc, [view.cursorWrapper.deco]));
    }

    return DecorationGroup.from(found);
}
