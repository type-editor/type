import {browser} from '@type-editor/commons';
import type {PmInputState} from '@type-editor/editor-types';

import {KEY_ARROW_DOWN} from '../../key-codes';


/**
 * Checks if the key event represents a down arrow action.
 * @param key - The key value from the keyboard event
 * @param inputState - The input state that contains the modifier keys
 * @returns True if this is a down arrow action
 */
export function isDownArrowKey(key: string, inputState: PmInputState): boolean {
    // Ctrl + n = KEY_ARROW_DOWN (Mac)
    return key === KEY_ARROW_DOWN || (browser.mac && key === 'n' && inputState.ctlKey);
}
