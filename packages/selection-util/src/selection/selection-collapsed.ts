import {isEquivalentPosition} from '@type-editor/dom-util';
import type {DOMSelectionRange} from '@type-editor/editor-types';

/**
 * Checks if a DOM selection is collapsed (has no range).
 *
 * Work around Chrome issue https://bugs.chromium.org/p/chromium/issues/detail?id=447523
 * (isCollapsed inappropriately returns true in shadow DOM)
 *
 * This function uses `isEquivalentPosition` to properly detect collapsed selections
 * by comparing the focus and anchor positions, which works correctly in Shadow DOM.
 *
 * @param domSel - The DOM selection range to check
 * @returns True if the selection is collapsed, false otherwise
 *
 * @example
 * ```typescript
 * const selection = window.getSelection();
 * const isCollapsed = selectionCollapsed(selection);
 * ```
 */
export function selectionCollapsed(domSel: DOMSelectionRange): boolean {
    if (!domSel.focusNode || !domSel.anchorNode) {
        return false;
    }

    return isEquivalentPosition(
        domSel.focusNode,
        domSel.focusOffset,
        domSel.anchorNode,
        domSel.anchorOffset
    );
}
