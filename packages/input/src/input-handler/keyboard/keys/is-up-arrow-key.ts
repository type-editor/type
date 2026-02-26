import {browser} from '@type-editor/commons';
import type {PmInputState} from '@type-editor/editor-types';

import {KEY_ARROW_UP} from '../../key-codes';


/**
 * Checks if the key event represents an up arrow action.
 * @param key - The key value from the keyboard event
 * @param inputState - The input state that contains the modifier keys
 * @returns True if this is an up arrow action
 */
export function isUpArrowKey(key: string, inputState: PmInputState): boolean {
    // Ctrl + p = KEY_ARROW_UP (Mac)
    return key === KEY_ARROW_UP || (browser.mac && key === 'p' && inputState.ctlKey);
}
