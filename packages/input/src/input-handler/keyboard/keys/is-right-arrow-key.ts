import {browser} from '@type-editor/commons';
import type {PmInputState} from '@type-editor/editor-types';

import {KEY_ARROW_RIGHT} from '../../key-codes';


/**
 * Checks if the key event represents a right arrow action.
 * @param key - The key value from the keyboard event
 * @param inputState - The input state that contains the modifier keys
 * @returns True if this is a right arrow action
 */
export function isRightArrowKey(key: string, inputState: PmInputState): boolean {
    // Ctrl + f = KEY_ARROW_RIGHT (Mac)
    return key === KEY_ARROW_RIGHT || (browser.mac && key === 'f' && inputState.ctlKey);
}
