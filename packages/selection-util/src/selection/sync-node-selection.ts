import type {PmEditorView, PmNodeViewDesc, PmSelection, PmViewDesc} from '@type-editor/editor-types';


/**
 * Synchronizes node selection state between ProseMirror and the DOM.
 *
 * When a node is selected (as opposed to text selection), this function ensures
 * that the appropriate view descriptor is marked as selected, and any previously
 * selected node is deselected. This allows node views to apply custom styling
 * or behavior when selected.
 *
 * @param view - The editor view
 * @param sel - The current ProseMirror selection
 */
export function syncNodeSelection(view: PmEditorView, sel: PmSelection): void {
    if (sel.isNodeSelection()) {
        const desc: PmViewDesc = view.docView.descAt(sel.from);
        if (desc !== view.lastSelectedViewDesc) {
            clearNodeSelection(view);
            if (desc) {
                (desc as PmNodeViewDesc).selectNode();
            }
            view.lastSelectedViewDesc = desc;
        }
    } else {
        clearNodeSelection(view);
    }
}

/**
 * Clears the DOM state of any previously selected node.
 *
 * This function removes the selection state from the last selected view descriptor,
 * allowing it to return to its normal (unselected) appearance and behavior.
 *
 * @param view - The editor view
 */
function clearNodeSelection(view: PmEditorView): void {
    if (view.lastSelectedViewDesc) {
        if (view.lastSelectedViewDesc.parent) {
            (view.lastSelectedViewDesc as PmNodeViewDesc).deselectNode();
        }
        view.lastSelectedViewDesc = undefined;
    }
}
