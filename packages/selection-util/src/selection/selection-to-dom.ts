import {browser, ELEMENT_NODE,} from '@type-editor/commons';
import {domIndex, isEquivalentPosition} from '@type-editor/dom-util';
import type {DOMSelectionRange, PmEditorView, PmSelection, PmSelectionState,} from '@type-editor/editor-types';

import {hasSelection} from './has-selection';
import {syncNodeSelection} from './sync-node-selection';

/**
 * Delay in milliseconds for removing the hide selection class.
 */
const HIDE_SELECTION_DELAY_MS = 20;

/**
 * Extended HTMLElement interface for tracking temporary draggable state.
 */
interface HTMLElementWithDraggableState extends HTMLElement {
    wasDraggable?: boolean;
}

/**
 * Extended HTMLElement interface for IE11 disabled property workaround.
 */
interface HTMLElementWithDisabled extends HTMLElement {
    disabled?: boolean;
}


/**
 * Synchronizes the ProseMirror selection to the DOM.
 *
 * This function updates the browser's selection to match the current ProseMirror
 * selection state. It handles various edge cases including:
 * - Node selections
 * - Delayed drag selections in Chrome
 * - Broken selection behavior in Safari/older Chrome
 * - Cursor wrappers for special cases
 * - Selection visibility
 *
 * @param view - The editor view to synchronize
 * @param force - Whether to force the selection update even if not needed
 */
export function selectionToDOM(view: PmEditorView, force = false): void {
    const selection: PmSelection = view.state.selection;
    syncNodeSelection(view, selection);

    if (!editorOwnsSelection(view)) {
        return;
    }

    // Handle delayed drag selection for Chrome (but not Safari where it causes issues)
    if (shouldDelaySelectionSync(view, force)) {
        view.input.mouseDown.delayedSelectionSync = true;
        view.domObserver.setCurSelection();
        return;
    }

    view.domObserver.disconnectSelection();

    if (view.cursorWrapper) {
        selectCursorWrapper(view);
    } else {
        applySelectionToDOM(view, selection, force);
    }

    view.domObserver.setCurSelection();
    view.domObserver.connectSelection();
}


/**
 * Determines whether the editor currently owns the DOM selection.
 *
 * For editable editors, this checks if the editor has focus.
 * For non-editable editors, this checks if the selection is within the editor
 * and the active element contains the editor DOM.
 *
 * @param view - The editor view to check
 * @returns True if the editor owns the current selection
 */
function editorOwnsSelection(view: PmEditorView): boolean {
    if (view.editable) {
        return view.hasFocus();
    }

    return hasSelection(view) && (document.activeElement?.contains(view.dom) ?? false);
}

/**
 * Determines if selection sync should be delayed (Chrome-specific behavior).
 *
 * @param view - The editor view
 * @param force - Whether forcing the selection update
 * @returns True if selection sync should be delayed
 */
function shouldDelaySelectionSync(view: PmEditorView, force: boolean): boolean {
    if (!browser.chrome || force || !view.input.mouseDown?.allowDefault) {
        return false;
    }

    const selectionRange: DOMSelectionRange = view.domSelectionRange();
    const selectionState: PmSelectionState = view.domObserver.currentSelection;

    return selectionRange.anchorNode
        && selectionState.anchorNode
        && isEquivalentPosition(
            selectionRange.anchorNode,
            selectionRange.anchorOffset,
            selectionState.anchorNode,
            selectionState.anchorOffset
        );
}

/**
 * Applies the ProseMirror selection to the DOM, handling browser quirks.
 *
 * @param view - The editor view
 * @param sel - The ProseMirror selection to apply
 * @param force - Whether to force the selection update
 */
function applySelectionToDOM(view: PmEditorView, sel: PmSelection, force: boolean): void {
    const {anchor, head} = sel;

    // Handle broken selection behavior in Safari/older Chrome
    const editableElements = needsTemporaryEditable(sel)
        ? makeTemporarilyEditable(view, sel)
        : null;

    view.docView.setSelection(anchor, head, view, force);

    if (editableElements) {
        restoreEditableState(editableElements);
    }

    updateSelectionVisibility(view, sel);
}

/**
 * Checks if temporary editable workaround is needed for the selection.
 *
 * @param sel - The selection to check
 * @returns True if temporary editable workaround is needed
 */
function needsTemporaryEditable(sel: PmSelection): boolean {
    return brokenSelectBetweenUneditable && !sel.isTextSelection();
}

/**
 * Temporarily makes elements editable to work around browser selection bugs.
 *
 * @param view - The editor view
 * @param sel - The selection
 * @returns Object containing elements that were made editable, or null
 */
function makeTemporarilyEditable(view: PmEditorView, sel: PmSelection): { from?: HTMLElement; to?: HTMLElement } | null {
    const elements: { from?: HTMLElement; to?: HTMLElement } = {};

    if (!sel.$from.parent.inlineContent) {
        elements.from = temporarilyEditableNear(view, sel.from);
    }

    if (!sel.empty && !sel.$to.parent.inlineContent) {
        elements.to = temporarilyEditableNear(view, sel.to);
    }

    return Object.keys(elements).length > 0 ? elements : null;
}

/**
 * Restores the editable state of elements that were temporarily made editable.
 *
 * @param elements - Object containing elements to restore
 */
function restoreEditableState(elements: { from?: HTMLElement; to?: HTMLElement }): void {
    if (elements.from) {
        resetEditable(elements.from);
    }
    if (elements.to) {
        resetEditable(elements.to);
    }
}

/**
 * Updates the DOM classes to reflect selection visibility.
 *
 * @param view - The editor view
 * @param sel - The selection
 */
function updateSelectionVisibility(view: PmEditorView, sel: PmSelection): void {
    if (sel.visible) {
        view.dom.classList.remove('ProseMirror-hideselection');
    } else {
        view.dom.classList.add('ProseMirror-hideselection');
        if ('onselectionchange' in document) {
            removeClassOnSelectionChange(view);
        }
    }
}

/**
 * Browser quirk detection: Webkit-based browsers (Safari and Chrome < 63) don't allow
 * selections to start/end between non-editable block nodes. This flag enables a
 * workaround where we temporarily make elements editable during selection.
 */
const brokenSelectBetweenUneditable = browser.safari || (browser.chrome && browser.chrome_version < 63);

/**
 * Finds and temporarily makes an element near the given position editable.
 *
 * This is a workaround for Safari and older Chrome versions that don't allow
 * selections between non-editable block nodes. We briefly make an element
 * editable, set the selection, then restore its original state.
 *
 * @param view - The editor view
 * @param pos - The document position near which to find an element
 * @returns The element that was made editable, or undefined if none
 */
function temporarilyEditableNear(view: PmEditorView, pos: number): HTMLElement | undefined {
    const {node, offset} = view.docView.domFromPos(pos, 0);
    const after: ChildNode = offset < node.childNodes.length ? node.childNodes[offset] : null;
    const before: ChildNode = offset > 0 ? node.childNodes[offset - 1] : null;

    // Helper to check if a node is an HTMLElement with contentEditable property
    const isNonEditableElement = (domNode: ChildNode | null): domNode is HTMLElement => {
        return domNode !== null
            && domNode.nodeType === ELEMENT_NODE
            && (domNode as HTMLElement).contentEditable === 'false';
    };

    // Safari-specific: handle elements after the position first
    if (browser.safari && isNonEditableElement(after)) {
        return setEditable(after);
    }

    // Handle case where both neighbors are non-editable
    const afterIsNonEditable: boolean = !after || isNonEditableElement(after);
    const beforeIsNonEditable: boolean = !before || isNonEditableElement(before);

    if (afterIsNonEditable && beforeIsNonEditable) {
        if (isNonEditableElement(after)) {
            return setEditable(after);
        } else if (isNonEditableElement(before)) {
            return setEditable(before);
        }
    }

    return undefined;
}

/**
 * Temporarily makes an element editable by setting contentEditable to "true".
 * Also handles Safari's draggable attribute quirk.
 *
 * @param element - The element to make editable
 * @returns The element that was modified
 */
function setEditable(element: HTMLElement): HTMLElement {
    element.contentEditable = 'true';

    // Safari quirk: preserve draggable state
    if (browser.safari && element.draggable) {
        element.draggable = false;
        (element as HTMLElementWithDraggableState).wasDraggable = true;
    }

    return element;
}

/**
 * Restores an element's contentEditable state to "false" after temporarily
 * making it editable. Also restores the draggable attribute if needed.
 *
 * @param element - The element to restore
 */
function resetEditable(element: HTMLElement): void {
    element.contentEditable = 'false';

    // Restore draggable state if it was preserved
    const elementWithState = element as HTMLElementWithDraggableState;
    if (elementWithState.wasDraggable) {
        element.draggable = true;
        elementWithState.wasDraggable = undefined;
    }
}

/**
 * Sets up a listener to remove the hide selection class when the selection changes.
 *
 * This function monitors for selection changes and removes the 'ProseMirror-hideselection'
 * class when the selection moves away from its original position. This ensures that
 * the selection becomes visible again when the user changes it.
 *
 * @param view - The editor view
 */
function removeClassOnSelectionChange(view: PmEditorView): void {
    const doc: Document = view.dom.ownerDocument;

    // Remove any existing listener
    doc.removeEventListener('selectionchange', view.input.hideSelectionGuard);

    // Capture the current selection position
    const selectionRange: DOMSelectionRange = view.domSelectionRange();
    const originalAnchorNode: Node = selectionRange.anchorNode;
    const originalAnchorOffset: number = selectionRange.anchorOffset;

    // Set up new listener
    view.input.hideSelectionGuard = (): void => {
        const currentSelection: DOMSelectionRange = view.domSelectionRange();

        // Check if selection has moved
        if (currentSelection.anchorNode !== originalAnchorNode
            || currentSelection.anchorOffset !== originalAnchorOffset) {

            doc.removeEventListener('selectionchange', view.input.hideSelectionGuard);

            // Delay to ensure proper timing with browser selection updates
            setTimeout((): void => {
                if (!editorOwnsSelection(view) || view.state.selection.visible) {
                    view.dom.classList.remove('ProseMirror-hideselection');
                }
            }, HIDE_SELECTION_DELAY_MS);
        }
    };

    doc.addEventListener('selectionchange', view.input.hideSelectionGuard);
}

/**
 * Handles selection for cursor wrapper elements.
 *
 * Cursor wrappers are used to display cursors in positions where the browser
 * wouldn't normally show one (e.g., before an uneditable node). This function
 * properly positions the DOM selection for such wrapper elements.
 *
 * @param view - The editor view containing the cursor wrapper
 */
function selectCursorWrapper(view: PmEditorView): void {
    const domSel: Selection | null = view.domSelection();
    if (!domSel) {
        return;
    }

    const node = view.cursorWrapper.dom;
    const isImageNode = node.nodeName === 'IMG';

    // Position the selection differently for image vs non-image nodes
    if (isImageNode) {
        // For images, collapse after the node
        if (node.parentNode) {
            domSel.collapse(node.parentNode, domIndex(node) + 1);
        } else {
            // Fallback if parent is null
            domSel.collapse(node, 0);
        }
    } else {
        // For other nodes, collapse at the start
        domSel.collapse(node, 0);
    }

    // IE11 workaround: Prevents control selection (resize handles) on invisible cursor wrappers
    // by toggling the disabled property. This forces IE11 to treat the wrapper properly.
    // TODO: Remove when IE11 support is dropped.
    if (browser.ie && browser.ie_version <= 11 && !isImageNode && !view.state.selection.visible) {
        const elementWithDisabled = node as unknown as HTMLElementWithDisabled;
        elementWithDisabled.disabled = true;
        elementWithDisabled.disabled = false;
    }
}
