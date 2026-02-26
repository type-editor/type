import {browser} from '@type-editor/commons';
import type {PmInputState} from '@type-editor/editor-types';

import {KEY_DELETE} from '../../key-codes';

/**
 * Checks if the key event represents a delete action.
 * @param key - The key value from the keyboard event
 * @param event - The full keyboard event
 * @param inputState - The input state that contains the modifier keys
 * @returns True if this is a delete action
 */
export function isDeleteKey(key: string, event: KeyboardEvent, inputState: PmInputState): boolean {
    // Ctrl + d = KEY_DELETE (Mac)
    return (key === KEY_DELETE && !event.shiftKey) || (browser.mac && key === 'd' && inputState.ctlKey);
}
