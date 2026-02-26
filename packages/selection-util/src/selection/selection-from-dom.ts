import {isOnEdge} from '@type-editor/dom-util';
import type {DOMSelectionRange, PmEditorView, PmNodeViewDesc, PmSelection, PmViewDesc} from '@type-editor/editor-types';
import type {Node, ResolvedPos} from '@type-editor/model';
import {SelectionFactory} from '@type-editor/state';
import {Selection} from '@type-editor/state';
import {ViewDescUtil} from '@type-editor/viewdesc';

import {selectionBetween} from './selection-between';
import {selectionCollapsed} from './selection-collapsed';


/**
 * Converts a DOM selection to a ProseMirror Selection.
 *
 * This function reads the current browser selection and translates it into
 * a ProseMirror selection that can be used with the editor state. It handles
 * various edge cases including collapsed selections, node selections, and
 * multi-range selections.
 *
 * @param view - The editor view containing the DOM and document state
 * @param origin - Optional string indicating the origin of the selection (e.g., 'pointer')
 * @returns A ProseMirror Selection object, or null if the selection is invalid or no focus node exists
 */
export function selectionFromDOM(view: PmEditorView, origin: string | null = null): PmSelection | null {
    const selectionRange: DOMSelectionRange = view.domSelectionRange();
    const doc: Node = view.state.doc;

    if (!selectionRange.focusNode) {
        return null;
    }

    const head: number = view.docView.posFromDOM(selectionRange.focusNode, selectionRange.focusOffset, 1);
    if (head < 0) {
        return null;
    }

    const nearestDesc: PmViewDesc = ViewDescUtil.nearestViewDesc(view.docView, selectionRange.focusNode);
    const inWidget: boolean = nearestDesc?.size === 0;
    const $head: ResolvedPos = doc.resolve(head);

    let selection: PmSelection | undefined;

    if (selectionCollapsed(selectionRange)) {
        selection = handleCollapsedSelection(selectionRange, nearestDesc, head, $head, doc);
    }

    const anchor: number = selection
        ? head
        : calculateAnchorPosition(view, selectionRange, head);

    if (anchor < 0) {
        return null;
    }

    const $anchor: ResolvedPos = doc.resolve(anchor);

    if (!selection) {
        const bias: number = shouldUseBiasForward(origin, view, $head, inWidget) ? 1 : -1;
        selection = selectionBetween(view, $anchor, $head, bias);
    }

    return selection;
}


/**
 * Handles the creation of a selection when the DOM selection is collapsed (caret position).
 *
 * @param selectionRange - The current DOM selection range
 * @param nearestDesc - The nearest view descriptor to the focus node
 * @param head - The head position in the document
 * @param $head - The resolved head position
 * @param doc - The ProseMirror document
 * @returns A Selection if a node selection should be created, otherwise undefined
 */
function handleCollapsedSelection(selectionRange: DOMSelectionRange,
                                  nearestDesc: PmViewDesc | undefined,
                                  head: number,
                                  $head: ResolvedPos,
                                  doc: Node): PmSelection | undefined {
    // Early return if no descriptor found
    if (!nearestDesc) {
        return undefined;
    }

    let desc: PmViewDesc | undefined = nearestDesc;

    // Find the nearest descriptor with a node
    while (desc && !desc.node) {
        desc = desc.parent;
    }

    if (!desc) {
        return undefined;
    }

    // Check if we should create a node selection for an atom node
    if (shouldCreateNodeSelection((desc as PmNodeViewDesc).node, desc, selectionRange)) {
        const pos: number = desc.posBefore;
        const $pos: ResolvedPos = head === pos ? $head : doc.resolve(pos);
        return SelectionFactory.createNodeSelection($pos);
    }

    return undefined;
}

/**
 * Determines if a node selection should be created for the given node.
 *
 * @param node - The ProseMirror node to check
 * @param desc - The view descriptor for the node
 * @param selectionRange - The current DOM selection range
 * @returns True if a node selection should be created
 */
function shouldCreateNodeSelection(node: Node,
                                   desc: PmViewDesc,
                                   selectionRange: DOMSelectionRange): boolean {
    return node.isAtom
        && Selection.isNodeSelectable(node)
        && desc.parent !== null
        && !(node.isInline && isOnEdge(selectionRange.focusNode, selectionRange.focusOffset, desc.dom));
}

/**
 * Calculates the anchor position for a non-collapsed selection.
 * Handles both multi-range selections and single-range selections.
 *
 * @param view - The editor view
 * @param selectionRange - The current DOM selection range
 * @param head - The head position
 * @returns The anchor position, or -1 if invalid
 */
function calculateAnchorPosition(view: PmEditorView,
                                 selectionRange: DOMSelectionRange,
                                 head: number): number {
    // Handle multi-range selections
    if (selectionRange instanceof view.dom.ownerDocument.defaultView.Selection
        && selectionRange.rangeCount > 1) {
        return handleMultiRangeSelection(view, selectionRange, head);
    }

    // Handle single-range selection
    return view.docView.posFromDOM(selectionRange.anchorNode, selectionRange.anchorOffset, 1);
}

/**
 * Handles multi-range selections by finding the minimum and maximum positions
 * across all ranges.
 *
 * @param view - The editor view
 * @param domSelection - The DOM selection with multiple ranges
 * @param initialHead - The initial head position
 * @returns The calculated anchor position, or -1 if invalid
 */
function handleMultiRangeSelection(view: PmEditorView,
                                   domSelection: DOMSelection,
                                   initialHead: number): number {
    let min: number = initialHead;
    let max: number = initialHead;

    for (let i = 0; i < domSelection.rangeCount; i++) {
        const range: Range = domSelection.getRangeAt(i);
        const startPos: number = view.docView.posFromDOM(range.startContainer, range.startOffset, 1);
        const endPos: number = view.docView.posFromDOM(range.endContainer, range.endOffset, -1);

        min = Math.min(min, startPos);
        max = Math.max(max, endPos);
    }

    // Check if any position is invalid
    if (min < 0 || max < 0) {
        return -1;
    }

    // Determine which end should be the anchor based on current selection
    // If the current anchor is at the max position, keep it there (swap direction)
    return max === view.state.selection.anchor ? max : min;
}

/**
 * Determines the bias direction for creating a text selection.
 *
 * @param origin - The origin of the selection event
 * @param view - The editor view
 * @param $head - The resolved head position
 * @param inWidget - Whether the selection is in a widget
 * @returns True if forward bias should be used
 */
function shouldUseBiasForward(origin: string | null,
                              view: PmEditorView,
                              $head: ResolvedPos,
                              inWidget: boolean): boolean {
    return origin === 'pointer' || (view.state.selection.head < $head.pos && !inWidget);
}
