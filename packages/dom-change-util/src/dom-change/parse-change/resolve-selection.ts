import type {PmEditorView} from '@type-editor/editor-types';
import type {PmSelection} from '@type-editor/editor-types';
import type {Node} from '@type-editor/model';
import {selectionBetween} from '@type-editor/selection-util';

/**
 * Resolves a selection from parsed anchor/head positions.
 *
 * This function converts numeric positions from the parsed document into a proper
 * ProseMirror Selection object. It performs validation and uses the selectionBetween
 * helper to create the appropriate selection type (TextSelection, NodeSelection, etc.).
 *
 * The function returns null if the positions are invalid (outside document bounds).
 * This can happen if the selection was in a part of the document that wasn't parsed
 * or if parsing failed to find the positions.
 *
 * @param view - The editor view, used for creating the selection via selectionBetween
 * @param doc - The document to resolve positions in (typically the transaction's document)
 * @param parsedSel - Parsed selection with anchor and head positions (numeric offsets)
 * @returns A resolved Selection object, or null if the positions are out of bounds
 *
 * @see {@link selectionBetween} for selection creation logic
 */
export function resolveSelection(view: PmEditorView,
                                 doc: Node,
                                 parsedSel: { anchor: number, head: number; }): PmSelection | null {
    if (Math.max(parsedSel.anchor, parsedSel.head) > doc.content.size) {
        return null;
    }
    return selectionBetween(view, doc.resolve(parsedSel.anchor), doc.resolve(parsedSel.head));
}
