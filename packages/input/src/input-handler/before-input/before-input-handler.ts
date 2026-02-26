import {browser} from '@type-editor/commons';
import type {PmEditorView} from '@type-editor/editor-types';

import {BACKSPACE_KEY_CODE} from '../key-codes';
import {keyEvent} from '../util/key-event';

// Delay before retrying backspace on Android (ms)
const ANDROID_BACKSPACE_RETRY_DELAY = 50;

/**
 * Handles beforeinput events. Currently only used for a Chrome Android
 * workaround where backspace sometimes fails after uneditable nodes.
 */
export function beforeInputHandler(view: PmEditorView, event: InputEvent): boolean  {

    // We should probably do more with beforeinput events, but support
    // is so spotty that I'm still waiting to see where they are going.

    // Very specific hack to deal with backspace sometimes failing on
    // Chrome Android when after an uneditable node.
    if (browser.chrome && browser.android && event.inputType === 'deleteContentBackward') {
        view.domObserver.flushSoon();
        const { domChangeCount } = view.input;

        setTimeout(() => {
            // If the DOM change counter increased, the event had an effect - nothing to fix
            if (view.input.domChangeCount !== domChangeCount) {
                return false;
            }

            // The backspace didn't work - this bug tends to close the virtual keyboard,
            // so blur and refocus to reopen it
            view.dom.blur();
            view.focus();

            // Try to handle backspace through the normal key handler
            if (view.someProp('handleKeyDown', callbackFunc => callbackFunc(view, keyEvent(BACKSPACE_KEY_CODE, 'Backspace')))) {
                return true;
            }

            // If no command handled it, do a simple character deletion
            const { $cursor } = view.state.selection;
            if ($cursor && $cursor.pos > 0) {
                view.dispatch(view.state.transaction.delete($cursor.pos - 1, $cursor.pos).scrollIntoView());
            }
        }, ANDROID_BACKSPACE_RETRY_DELAY);
    }
    return false;
}
