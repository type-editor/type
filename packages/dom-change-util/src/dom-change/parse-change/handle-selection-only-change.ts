import type {PmEditorView, PmTransaction} from '@type-editor/editor-types';
import {selectionFromDOM} from '@type-editor/selection-util';

import {shouldHandleAndroidEnterKey} from '../browser-hacks/should-handle-android-enter-key';
import {SELECTION_TIME_THRESHOLD} from '../constants';


/**
 * Handles selection-only changes (when no content has changed).
 *
 * This function is called when a DOM change event indicates a selection change
 * but no content modification. It reads the current DOM selection, creates a
 * transaction to update the editor selection, and dispatches it.
 *
 * The function also:
 * - Determines the selection origin (pointer, key, or null) based on timing
 * - Handles Android Chrome Enter key edge cases
 * - Adds appropriate metadata to the transaction (pointer, scrollIntoView, composition)
 *
 * If the new selection is identical to the current selection, no action is taken.
 *
 * @param view - The editor view containing the DOM and current state
 * @param compositionID - The current composition ID if in composition mode (0 if not composing).
 *                        This is used to track IME composition events.
 *
 * @see {@link selectionFromDOM} for how selection is read from DOM
 * @see {@link shouldHandleAndroidEnterKey} for Android Enter key handling
 */
export function handleSelectionOnlyChange(view: PmEditorView, compositionID: number): void {
    const origin: string = view.input.lastSelectionTime > Date.now() - SELECTION_TIME_THRESHOLD
        ? view.input.lastSelectionOrigin
        : null;
    const newSelection = selectionFromDOM(view, origin);

    if (!newSelection || view.state.selection.eq(newSelection)) {
        return;
    }

    // Android Chrome Enter key handling
    if (shouldHandleAndroidEnterKey(view)) {
        return;
    }

    const transaction: PmTransaction = view.state.transaction.setSelection(newSelection);

    if (origin === 'pointer') {
        transaction.setMeta('pointer', true);
    } else if (origin === 'key') {
        transaction.scrollIntoView();
    }

    if (compositionID) {
        transaction.setMeta('composition', compositionID);
    }

    view.dispatch(transaction);
}
