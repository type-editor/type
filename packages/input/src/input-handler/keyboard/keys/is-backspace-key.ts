import {browser} from '@type-editor/commons';
import type {PmInputState} from '@type-editor/editor-types';

import {KEY_BACKSPACE} from '../../key-codes';


/**
 * Checks if the key event represents a backspace action.
 * @param key - The key value from the keyboard event
 * @param _event - The full keyboard event
 * @param inputState - The input state that contains the modifier keys
 * @returns True if this is a backspace action
 */
export function isBackspaceKey(key: string, _event: KeyboardEvent, inputState: PmInputState): boolean {
    // Ctrl + h = KEY_BACKSPACE (Mac)
    return key === KEY_BACKSPACE || (browser.mac && key === 'h' && inputState.ctlKey);
}
