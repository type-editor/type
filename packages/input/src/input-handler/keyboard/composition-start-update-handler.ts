import {browser, ELEMENT_NODE, isFalse, TEXT_NODE} from '@type-editor/commons';
import type {DOMSelectionRange, PmEditorView} from '@type-editor/editor-types';
import type {Mark, ResolvedPos} from '@type-editor/model';

import {COMPOSITION_TIMEOUT_ANDROID} from '../compositon-constants';
import {endComposition} from '../util/end-composition';
import {scheduleComposeEnd} from './util/schedule-compose-end';


// Drop active composition after specified timeout on Android (5 seconds), disabled elsewhere
const timeoutComposition = browser.android ? COMPOSITION_TIMEOUT_ANDROID : -1;

/**
 * Handles compositionstart and compositionupdate events from IME input.
 * Sets up the editor state for composition, handling mark wrapping for
 * non-inclusive marks and Firefox-specific cursor positioning issues.
 */
export function compositionStartUpdateHandler(view: PmEditorView): boolean {
    if (!view.composing) {
        view.domObserver.flush();
        const { state } = view;
        const $pos: ResolvedPos = state.selection.$to;

        // Check if we need to wrap the cursor position with mark wrapper nodes.
        // This is necessary when the cursor is at a position with non-inclusive marks
        // (marks that don't extend to newly typed text) because the DOM and ProseMirror
        // representations might differ.
        const hasNonInclusiveMarks: ReadonlyArray<Mark> | boolean =
            state.selection.isTextSelection()
            && (state.storedMarks
                || (!$pos.textOffset
                    && $pos.parentOffset
                    && $pos.nodeBefore.marks.some((mark: Mark): boolean => isFalse(mark.type.spec.inclusive))
                    || browser.chrome && browser.windows && selectionBeforeUneditable(view)));

        if (hasNonInclusiveMarks) {
            // Create a temporary mark cursor to ensure the DOM structure matches
            // what ProseMirror expects during composition
            view.markCursor = view.state.storedMarks || $pos.marks();
            endComposition(view, true);
            view.markCursor = null;
        } else {
            endComposition(view, !state.selection.empty);

            // In Firefox, if the cursor is after but outside a marked node,
            // the inserted text won't inherit the marks. So this moves it
            // inside if necessary.
            if (browser.gecko
                && state.selection.empty
                && $pos.parentOffset
                && !$pos.textOffset
                && $pos.nodeBefore.marks.length) {

                const selectionRange: DOMSelectionRange = view.domSelectionRange();
                adjustFirefoxCursorForMarks(view, selectionRange);
            }
        }
        view.input.composing = true;
    }
    scheduleComposeEnd(view, timeoutComposition);
    return false;
}

/**
 * Checks if the current selection is immediately before an uneditable element.
 * This is used to detect cases in Chrome on Windows where composition behavior
 * needs special handling when the cursor is positioned right before a
 * contentEditable="false" element.
 *
 * @param view - The editor view containing the selection
 * @returns `true` if the selection focus is in an element node and the next
 *          sibling at the focus offset is an uneditable element, `false` otherwise
 */
function selectionBeforeUneditable(view: PmEditorView): boolean {
    const {focusNode, focusOffset} = view.domSelectionRange();
    if (focusNode?.nodeType !== ELEMENT_NODE || focusOffset >= focusNode.childNodes.length) {
        return false;
    }

    const next: HTMLElement = focusNode.childNodes[focusOffset] as HTMLElement;
    return next.nodeType === ELEMENT_NODE && next.contentEditable === 'false';
}

/**
 * Adjusts cursor position in Firefox to ensure composed text inherits marks.
 * Firefox has a quirk where text composed after a marked node doesn't inherit
 * the marks unless the cursor is moved inside the text node.
 * @param view - The editor view
 * @param selectionRange - The current DOM selection range
 */
function adjustFirefoxCursorForMarks(view: PmEditorView, selectionRange: DOMSelectionRange): void {

    // Walk backwards through the DOM tree to find the nearest text node
    let node: Node = selectionRange.focusNode;
    for (let offset = selectionRange.focusOffset; offset !== 0;) {
        if(node?.nodeType === ELEMENT_NODE) {
            break;
        }

        const before: ChildNode = offset < 0 ? node.lastChild : node.childNodes[offset - 1];
        if (!before) {
            break;
        }

        if (before.nodeType === TEXT_NODE) {
            // Found a text node - move the cursor to the end of it
            // so composed text will inherit its marks
            const selection: DOMSelection = view.domSelection();
            if (selection) {
                selection.collapse(before, before.nodeValue.length);
            }
            break;
        } else {
            // Continue traversing into the previous element
            node = before;
            offset = -1;
        }
    }
}
