import {browser} from '@type-editor/commons';
import type {PmEditorView, PmSelection} from '@type-editor/editor-types';

import {inOrNearComposition} from './util/in-or-near-composition';

/**
 * Handles keypress events for character input. Delegates to handleKeyPress
 * prop or handleTextInput prop, falling back to default text insertion.
 * Skips handling during composition or for modifier key combinations.
 */
export function keyPressHandler(view: PmEditorView, event: KeyboardEvent): boolean {
    // Skip during composition, no character code, or when modifier keys are pressed
    // (Ctrl without Alt, or Cmd on Mac) since those indicate commands rather than text input
    if (inOrNearComposition(view, event)
        || !event.charCode
        || event.ctrlKey && !event.altKey
        || browser.mac && event.metaKey) {
        return false;
    }

    // Allow custom keypress handlers to take precedence
    if (view.someProp('handleKeyPress', callbackFunc => callbackFunc(view, event))) {
        event.preventDefault();
        return true;
    }

    const selection: PmSelection = view.state.selection;
    // For non-text selections or selections spanning multiple parents,
    // provide a custom text input hook
    if (!(selection.isTextSelection()) || !selection.$from.sameParent(selection.$to)) {
        const text: string = String.fromCharCode(event.charCode);
        const defaultTransaction = () => view.state.transaction.insertText(text).scrollIntoView();

        // Delegate to handleTextInput hook, falling back to default insertion
        if (!/[\r\n]/.test(text) && !view.someProp('handleTextInput', callbackFunc => callbackFunc(view, selection.$from.pos, selection.$to.pos, text, defaultTransaction))) {
            view.dispatch(defaultTransaction());
        }
        event.preventDefault();
        return true;
    }
    return false;
}
