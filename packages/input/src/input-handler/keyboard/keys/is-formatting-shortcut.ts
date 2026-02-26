import {browser} from '@type-editor/commons';
import type {PmInputState} from '@type-editor/editor-types';


/**
 * Checks if the key combination is a formatting shortcut (Bold, Italic, Undo, Redo).
 * @param key - The key value from the keyboard event
 * @param inputState - The input state that contains the modifier keys
 * @returns True if this is a formatting shortcut
 */
export function isFormattingShortcut(key: string, inputState: PmInputState): boolean {
    const isMetaOrCtlKey = browser.mac ? inputState.metaKey: inputState.ctlKey;
    // Ctrl + i (italic)
    // Ctrl + b (bold)
    // Ctrl + y (redo)
    // Ctrl + z (undo)
    return isMetaOrCtlKey && ['b', 'i', 'y', 'z'].includes(key.toLowerCase());
}
