import {textNodeAfter, textNodeBefore} from '@type-editor/dom-util';
import type {DOMSelectionRange, PmViewDesc} from '@type-editor/editor-types';

import {EditorView} from '../EditorView';

/**
 * Finds the text node where composition is occurring. Looks at text nodes
 * before and after the cursor, using heuristics to determine which one
 * is being composed in.
 * @param view - The editor view
 * @returns The text node being composed in, or null if none found
 */
export function findCompositionNode(view: EditorView): Text {
    const selectionRange: DOMSelectionRange = view.domSelectionRange();
    if (!selectionRange.focusNode) {
        return null;
    }

    const textBefore: Text = textNodeBefore(selectionRange.focusNode, selectionRange.focusOffset);
    const textAfter: Text = textNodeAfter(selectionRange.focusNode, selectionRange.focusOffset);

    // When cursor is between two text nodes, use heuristics to determine which one
    // is actually being composed in (this matters for IME input)
    if (textBefore && textAfter && textBefore !== textAfter) {
        const descAfter: PmViewDesc = textAfter.pmViewDesc;
        const lastChanged: Text = view.domObserver.lastChangedTextNode;

        // If we recently observed changes to one of these nodes, that's the composition target
        if (textBefore === lastChanged || textAfter === lastChanged) {
            return lastChanged;
        }

        // If the node after doesn't match its view descriptor, it's probably being composed in
        if (!descAfter?.isText(textAfter.nodeValue)) {
            return textAfter;
        } else if (view.input.compositionNode === textAfter) {
            // If we were already composing in textAfter and textBefore is still synced,
            // continue with textAfter
            const descBefore: PmViewDesc = textBefore.pmViewDesc;
            if (descBefore?.isText(textBefore.nodeValue)) {
                return textAfter;
            }
        }
    }

    return textBefore || textAfter;
}
