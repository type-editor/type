import type {PmEditorView} from '@type-editor/editor-types';

import {endComposition} from '../../util/end-composition';


/**
 * Schedules the end of composition handling after a delay. Clears any
 * previously scheduled timeout first.
 * @param view - The editor view
 * @param delay - Delay in milliseconds before ending composition (-1 to disable)
 */
export function scheduleComposeEnd(view: PmEditorView, delay: number): void {
    clearTimeout(view.input.composingTimeout);
    if (delay > -1) {
        view.input.composingTimeout = window.setTimeout(() => {
            endComposition(view);
        }, delay);
    }
}
