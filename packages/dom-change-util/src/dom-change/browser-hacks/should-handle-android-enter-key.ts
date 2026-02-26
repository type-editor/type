import {browser, ENTER_KEY_CODE, KEY_ENTER} from '@type-editor/commons';
import type {PmEditorView} from '@type-editor/editor-types';

import {keyEvent} from '../util/key-event';

/**
 * Time threshold (in milliseconds) for detecting Android Chrome Enter key events.
 * Used to work around Android Chrome's quirky Enter key handling.
 */
const ANDROID_ENTER_TIME_THRESHOLD = 100;

/**
 * Checks if an Android Chrome Enter key event should be handled.
 *
 * Android Chrome has timing-related quirks with Enter key handling. This function
 * checks if the conditions match an Android Chrome Enter key press that should
 * be handled through the key handler rather than as a DOM change.
 *
 * The check verifies:
 * - Running on Chrome for Android
 * - Last key pressed was Enter (key code 13)
 * - The Enter key was pressed recently (within threshold)
 * - A handleKeyDown plugin accepts the Enter key event
 *
 * @param view - The editor view containing input state and plugin handlers
 * @returns True if the Enter key handler was invoked and handled the event,
 *          false if the event should be processed as a DOM change
 */
export function shouldHandleAndroidEnterKey(view: PmEditorView): boolean {
    return !!(browser.chrome
        && browser.android
        && view.input.lastKey === KEY_ENTER
        && Date.now() - ANDROID_ENTER_TIME_THRESHOLD < view.input.lastKeyCodeTime
        && view.someProp('handleKeyDown', callbackFunc => callbackFunc(view, keyEvent(ENTER_KEY_CODE, 'Enter'))));
}
