import type {PmEditorView} from '@type-editor/editor-types';

import {setSelectionOrigin} from '../util/set-selection-origin';

/**
 * Handles touchmove events, tracking touch timing for gesture detection.
 */
export function touchMoveHandler(view: PmEditorView, _event: TouchEvent): boolean {
    view.input.lastTouch = Date.now();
    setSelectionOrigin(view, 'pointer');
    return false;
}
