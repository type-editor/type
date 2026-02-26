import {browser} from '@type-editor/commons';
import type {PmInputState} from '@type-editor/editor-types';

import {KEY_ARROW_LEFT} from '../../key-codes';

/**
 * Checks if the key event represents a left arrow action.
 * @param key - The key value from the keyboard event
 * @param inputState - The input state that contains the modifier keys
 * @returns True if this is a left arrow action
 */
export function isLeftArrowKey(key: string, inputState: PmInputState): boolean {
    // Ctrl + b = KEY_ARROW_LEFT (Mac)
    return key === KEY_ARROW_LEFT || (browser.mac && key === 'b' && inputState.ctlKey);
}
