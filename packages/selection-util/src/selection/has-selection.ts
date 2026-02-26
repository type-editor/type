import {TEXT_NODE} from '@type-editor/commons';
import type {DOMSelectionRange, PmEditorView} from '@type-editor/editor-types';


/**
 * Checks if the editor contains a valid DOM selection.
 *
 * This function verifies that:
 * 1. An anchor node exists in the selection
 * 2. The anchor node is within the editor DOM
 * 3. For non-editable views, the focus node is also within the editor DOM
 *
 * Text nodes (nodeType === 3) are checked via their parent element.
 * This is wrapped in a try-catch because Firefox throws 'permission denied'
 * errors when accessing properties of nodes in generated CSS elements.
 *
 * @param view - The editor view to check
 * @returns True if a valid selection exists within the editor
 */
export function hasSelection(view: PmEditorView): boolean {
    const selectionRange: DOMSelectionRange = view.domSelectionRange();
    if (!selectionRange.anchorNode || !selectionRange.focusNode) {
        return false;
    }

    try {
        const anchorElement: Node = selectionRange.anchorNode.nodeType === TEXT_NODE
            ? selectionRange.anchorNode.parentNode
            : selectionRange.anchorNode;

        const focusElement: Node = selectionRange.focusNode.nodeType === TEXT_NODE
            ? selectionRange.focusNode.parentNode
            : selectionRange.focusNode;

        return view.dom.contains(anchorElement)
            && (view.editable || view.dom.contains(focusElement));
    } catch (_) {
        // Firefox may throw 'permission denied' errors for generated CSS elements
        return false;
    }
}
