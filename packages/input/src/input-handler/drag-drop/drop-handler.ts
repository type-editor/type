import type { PmDragging, PmEditorView, PmTransaction } from '@type-editor/editor-types';
import { type Node, type ResolvedPos, Slice } from '@type-editor/model';
import { selectionBetween } from '@type-editor/selection-util';
import { Selection, SelectionFactory } from '@type-editor/state';
import { dropPoint } from '@type-editor/transform';

import { parseFromClipboard } from '../../clipboard/parse-from-clipboard';
import { brokenClipboardAPI } from '../util/broken-clipboard-api';
import { getText } from '../util/get-text';
import { dragMoves } from './util/drag-moves';

/**
 * Handles drop events. Delegates to handleDrop and ensures dragging
 * state is cleared even if handling fails.
 */
export function dropHandler(view: PmEditorView, event: Event): boolean {
    try {
        handleDrop(view, event as DragEvent, view.dragging);
    } finally {
        view.dragging = null;
    }
    return false;
}

/**
 * Processes a drop event, inserting the dropped content at the drop position.
 * Handles both internal drags (with existing slice) and external drops
 * (parsing from clipboard data). For move operations, deletes the source content.
 * @param view - The editor view
 * @param event - The drag event
 * @param dragging - The current dragging state (if internal drag)
 * @returns True if the drop was handled
 */
function handleDrop(view: PmEditorView, event: DragEvent, dragging: PmDragging | null): boolean {
    if (!event.dataTransfer) {
        return false;
    }

    const eventPos: { pos: number; inside: number } | null = view.posAtCoords({left: event.clientX, top: event.clientY});
    if (!eventPos) {
        return false;
    }

    const $mouse: ResolvedPos = view.state.doc.resolve(eventPos.pos);
    let slice: Slice = dragging?.slice;

    if (slice) {
        view.someProp('transformPasted', callbackFunc => { slice = callbackFunc(slice, view, false); });
    } else {
        slice = parseFromClipboard(view, getText(event.dataTransfer), brokenClipboardAPI ? null : event.dataTransfer.getData('text/html'), false, $mouse);
    }

    const callbackData = new Map<string, any>();
    const move: boolean = dragging && dragMoves(view, event);
    if (view.someProp('handleDrop', callbackFunc => callbackFunc(view, event, slice || Slice.empty, move, callbackData))) {
        event.preventDefault();
        return true;
    }

    if (!slice) {
        return false;
    }

    event.preventDefault();
    let insertPos: number = slice ? dropPoint(view.state.doc, $mouse.pos, slice) : $mouse.pos;
    insertPos ??= $mouse.pos;

    const transaction: PmTransaction = view.state.transaction;

    // For move operations, delete the source content first (before mapping the insert position)
    if (move) {
        const { nodeSelection } = dragging;
        if (nodeSelection) {
            // For node selections, use the selection's replace method
            nodeSelection.replace(transaction);
        } else {
            // For text selections, delete the selected content
            transaction.deleteSelection();
        }
    }

    // Map the insert position through any deletions that occurred
    const pos: number = transaction.mapping.map(insertPos);
    const isNode: boolean = slice.openStart === 0 && slice.openEnd === 0 && slice.content.childCount === 1;
    const beforeInsert: Node = transaction.doc;

    // Insert the dropped content
    if (isNode) {
        transaction.replaceRangeWith(pos, pos, slice.content.firstChild);
    } else {
        transaction.replaceRange(pos, pos, slice);
    }

    // If nothing changed, we're done
    if (transaction.doc.eq(beforeInsert)) {
        return true;
    }

    // Set selection on the inserted content
    const $pos: ResolvedPos = transaction.doc.resolve(pos);
    if (isNode
        && Selection.isNodeSelectable(slice.content.firstChild)
        && $pos.nodeAfter?.sameMarkup(slice.content.firstChild)) {

        // For single node drops, select the dropped node
        transaction.setSelection(SelectionFactory.createNodeSelection($pos));
    } else {
        // For multi-node or inline drops, select the range of inserted content
        let end: number = transaction.mapping.map(insertPos);
        transaction.mapping.maps[transaction.mapping.maps.length - 1].forEach((_from, _to, _newFrom, newTo) => {
            return end = newTo;
        });
        transaction.setSelection(selectionBetween(view, $pos, transaction.doc.resolve(end)));
    }

    view.someProp('handleDropFinished', callbackFunc => callbackFunc(view, event, slice || Slice.empty, move, pos, transaction, callbackData));

    view.focus();
    view.dispatch(transaction.setMeta('uiEvent', 'drop'));
    return true;
}
