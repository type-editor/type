import {isEquivalentPosition} from '@type-editor/dom-util';
import type {DOMSelectionRange, PmEditorView} from '@type-editor/editor-types';


/**
 * Checks if the DOM selection's anchor is at the expected position.
 *
 * This compares the ProseMirror selection's anchor position with the actual
 * DOM selection's anchor position to verify they are equivalent. This is useful
 * for detecting if the DOM selection has drifted from the expected state.
 *
 * @param view - The editor view to check
 * @returns True if the DOM anchor matches the ProseMirror selection anchor
 */
export function anchorInRightPlace(view: PmEditorView): boolean {
    const anchorDOM = view.docView.domFromPos(view.state.selection.anchor, 0);
    const selectionRange: DOMSelectionRange = view.domSelectionRange();
    return isEquivalentPosition(
        anchorDOM.node,
        anchorDOM.offset,
        selectionRange.anchorNode,
        selectionRange.anchorOffset
    );
}
