import {browser} from '@type-editor/commons';
import type {PmEditorView, PmSelection} from '@type-editor/editor-types';
import {selectionFromDOM} from '@type-editor/selection-util';

import {clearComposition} from './clear-composition';


/**
 * Ends the current composition, flushing any pending DOM changes and
 * updating the editor state as necessary.
 * @param view - The editor view
 * @param restarting - Whether composition is being restarted (for mark handling)
 * @returns True if the editor state was updated
 */
export function endComposition(view: PmEditorView, restarting = false): boolean {
    // On Android, avoid interfering with pending flush operations
    if (browser.android && view.domObserver.flushingSoon >= 0) {
        return;
    }

    view.domObserver.forceFlush();
    clearComposition(view);

    // Only update if we're restarting composition or the view is dirty
    if (restarting || view.docView?.dirty) {
        const domSelection: PmSelection = selectionFromDOM(view);
        const currentStateSelection: PmSelection = view.state.selection;

        // If DOM selection differs from state, sync it
        if (domSelection && !domSelection.eq(currentStateSelection)) {
            view.dispatch(view.state.transaction.setSelection(domSelection));
        }
            // If we have a mark cursor or are restarting in a non-inline context,
        // delete any composed content (it will be re-composed with proper marks)
        else if ((view.markCursor || restarting)
            && !currentStateSelection.$from.node(currentStateSelection.$from.sharedDepth(currentStateSelection.to)).inlineContent) {

            view.dispatch(view.state.transaction.deleteSelection());
        }
        // Otherwise just re-render with current state
        else {
            view.updateState(view.state);
        }

        return true;
    }

    return false;
}
