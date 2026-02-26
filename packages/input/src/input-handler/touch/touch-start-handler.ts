import type {PmEditorView} from '@type-editor/editor-types';

import {forceDOMFlush} from '../util/force-dom-flush';
import {setSelectionOrigin} from '../util/set-selection-origin';

/**
 * Handles touchstart events, flushing DOM changes and tracking touch timing.
 */
export function touchStartHandler(view: PmEditorView, _event: TouchEvent): boolean {
    view.input.lastTouch = Date.now();
    forceDOMFlush(view);
    setSelectionOrigin(view, 'pointer');
    return false;
}
