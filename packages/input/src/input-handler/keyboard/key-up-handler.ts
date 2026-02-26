import type {PmEditorView} from '@type-editor/editor-types';

import {KEY_SHIFT} from '../key-codes';

/**
 * Handles keyup events, primarily to track Shift key state.
 */
export function keyUpHandler(view: PmEditorView, event: KeyboardEvent): boolean {
    if (event.key === KEY_SHIFT) {
        view.input.shiftKey = false;
    }
    return false;
}
