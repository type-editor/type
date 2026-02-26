import type {PmEditorView, PmTransaction} from '@type-editor/editor-types';
import { Fragment, type PmNode } from '@type-editor/model';
import {Slice} from '@type-editor/model';

import {parseFromClipboard} from '../../../clipboard/parse-from-clipboard';


/**
 * Processes pasted content, parsing it and inserting it into the editor.
 * Delegates to handlePaste prop if available, otherwise inserts the content.
 * @param view - The editor view
 * @param text - Plain text from clipboard
 * @param html - HTML content from clipboard (if available)
 * @param preferPlain - Whether to prefer plain text over HTML
 * @param event - The paste event
 * @returns True if the paste was handled
 */
export function doPaste(view: PmEditorView,
                        text: string,
                        html: string | null,
                        preferPlain: boolean,
                        event: ClipboardEvent): boolean {
    const slice: Slice = parseFromClipboard(view, text, html, preferPlain, view.state.selection.$from);
    if (view.someProp('handlePaste', callbackFunc => callbackFunc(view, event, slice || Slice.empty))) {
        return true;
    }

    if (!slice) {
        return false;
    }

    const singleNode: PmNode = sliceSingleNode(slice);

    if(singleNode) {
        const {id: _id, ...restAttrs} = singleNode.attrs;
        const singleNodeWithoutId: PmNode = singleNode.type.spec.attrs.id ? singleNode.type.create({...restAttrs, id: null}, singleNode.content, singleNode.marks) : singleNode;
        const transaction: PmTransaction = view.state.transaction.replaceSelectionWith(singleNodeWithoutId, preferPlain);
        view.dispatch(transaction.scrollIntoView().setMeta('paste', true).setMeta('uiEvent', 'paste'));
        return true;
    } else {
        const sliceWithoutIds: Slice = removeIdsFromSlice(slice);
        const transaction: PmTransaction = view.state.transaction.replaceSelection(sliceWithoutIds);
        view.dispatch(transaction.scrollIntoView().setMeta('paste', true).setMeta('uiEvent', 'paste'));
        return true;
    }
}

function removeIdsFromSlice(slice: Slice): Slice {
    const content: Array<PmNode> = slice.content.content.map((node: PmNode): PmNode => {
        if (node.type.spec.attrs.id && node.attrs?.id) {
            const {id: _id, ...restAttrs} = node.attrs;
            return node.type.create({...restAttrs, id: null}, node.content, node.marks);
        }
        return node;
    });
    return new Slice(Fragment.from(content), slice.openStart, slice.openEnd);
}

/**
 * Extracts a single node from a slice if the slice contains exactly one
 * top-level node with no open boundaries.
 * @param slice - The slice to check
 * @returns The single node, or null if the slice doesn't contain exactly one node
 */
function sliceSingleNode(slice: Slice): PmNode {
    return slice.openStart === 0
    && slice.openEnd === 0
    && slice.content.childCount === 1 ? slice.content.firstChild : null;
}
