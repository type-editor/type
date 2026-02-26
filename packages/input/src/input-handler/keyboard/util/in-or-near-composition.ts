import {browser} from '@type-editor/commons';
import type {PmEditorView} from '@type-editor/editor-types';

import {COMPOSITION_ENDED_INITIAL, COMPOSITION_SAFEGUARD_DELAY} from '../../compositon-constants';


/**
 * Determines if the editor is currently in or near a composition event.
 * This is critical for handling IME (Input Method Editor) input correctly,
 * particularly on Safari with Japanese IMEs where Enter confirms composition.
 * @param view - The editor view
 * @param event - The current event
 * @returns True if composition is active or recently ended
 */
export function inOrNearComposition(view: PmEditorView, event: Event): boolean {
    if (view.composing) {
        return true;
    }

    // See https://www.stum.de/2016/06/24/handling-ime-events-in-javascript/.
    // On Japanese input method editors (IMEs), the Enter key is used to confirm character
    // selection. On Safari, when Enter is pressed, compositionend and keydown events are
    // emitted. The keydown event triggers newline insertion, which we don't want.
    // This method returns true if the keydown event should be ignored.
    // We only ignore it once, as pressing Enter a second time *should* insert a newline.
    // Furthermore, the keydown event timestamp must be close to the compositionEndedAt timestamp.
    // This guards against the case where compositionend is triggered without the keyboard
    // (e.g. character confirmation may be done with the mouse), and keydown is triggered
    // afterwards- we wouldn't want to ignore the keydown event in this case.
    if (browser.safari && Math.abs(event.timeStamp - view.input.compositionEndedAt) < COMPOSITION_SAFEGUARD_DELAY) {
        view.input.compositionEndedAt = COMPOSITION_ENDED_INITIAL;
        return true;
    }

    return false;
}
