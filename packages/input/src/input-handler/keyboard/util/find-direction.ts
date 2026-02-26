import {browser} from '@type-editor/commons';
import type {PmEditorView} from '@type-editor/editor-types';
import type {ResolvedPos} from '@type-editor/model';


/**
 * Determines the text direction (LTR or RTL) at a specific position in the document.
 *
 * Uses coordinate-based detection on browsers other than Chrome/Windows to handle
 * bidirectional text correctly. Falls back to CSS direction property.
 *
 * @param view - The EditorView instance
 * @param pos - The document position to check
 * @returns 'ltr' for left-to-right, 'rtl' for right-to-left
 */
export function findDirection(view: PmEditorView, pos: number): 'rtl' | 'ltr' {
    const $pos: ResolvedPos = view.state.doc.resolve(pos);

    // Use coordinate-based detection for bidirectional text (except Chrome/Windows)
    if (!(browser.chrome || browser.windows) && $pos.parent.inlineContent) {
        const coords = view.coordsAtPos(pos);
        const SIGNIFICANT_MOVEMENT = 1; // pixels

        // Check direction by comparing with previous character position
        if (pos > $pos.start()) {
            const before = view.coordsAtPos(pos - 1);
            const mid: number = (before.top + before.bottom) / 2;

            if (mid > coords.top &&
                mid < coords.bottom &&
                Math.abs(before.left - coords.left) > SIGNIFICANT_MOVEMENT) {
                return before.left < coords.left ? 'ltr' : 'rtl';
            }
        }

        // Check direction by comparing with next character position
        if (pos < $pos.end()) {
            const after = view.coordsAtPos(pos + 1);
            const mid: number = (after.top + after.bottom) / 2;

            if (mid > coords.top &&
                mid < coords.bottom &&
                Math.abs(after.left - coords.left) > SIGNIFICANT_MOVEMENT) {
                return after.left > coords.left ? 'ltr' : 'rtl';
            }
        }
    }

    // Fall back to CSS direction
    const computed: string = getComputedStyle(view.dom).direction;
    return computed === 'rtl' ? 'rtl' : 'ltr';
}
