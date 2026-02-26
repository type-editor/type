import {ELEMENT_NODE} from '@type-editor/commons';
import type {PmEditorView} from '@type-editor/editor-types';
import type {Node} from '@type-editor/model';
import {type Attrs, DOMSerializer, type Slice} from '@type-editor/model';

import type {SerializationContext} from '../types/clipboard/SerializationContext';
import type {SerializedClipboard} from '../types/clipboard/SerializedClipboard';
import {applyRequiredWrappers} from './serialize/apply-required-wrappers';
import {detachedDoc} from './util';


/**
 * Serialize a slice for placing on the clipboard.
 * Produces a DOM fragmen, t, a plain-text representation, and the (possibly
 * normalized) slice used.
 *
 * @param view - The editor view performing the serialization
 * @param slice - The slice to serialize
 * @returns An object with dom (a wrapper div containing HTML), text and slice
 */
export function serializeForClipboard(view: PmEditorView, slice: Slice): SerializedClipboard {
    // Allow plugins to transform the copied slice
    view.someProp('transformCopied', transform => {
        slice = transform(slice, view);
    });

    const context: SerializationContext = [];
    let { content, openStart, openEnd } = slice;

    // If the slice is deeply wrapped in single-child nodes, unroll that
    // wrapping into a compact context array so it can be re-applied on paste.
    while (openStart > 1 && openEnd > 1 && content.childCount === 1 && content.firstChild.childCount === 1) {
        openStart--;
        openEnd--;
        const node: Node = content.firstChild;
        const nodeAttributes: Attrs = node.attrs !== node.type.defaultAttrs ? node.attrs : null;
        context.push(node.type.name, nodeAttributes);
        content = node.content;
    }

    const serializer: DOMSerializer = view.someProp('clipboardSerializer') || DOMSerializer.fromSchema(view.state.schema);
    const doc: Document = detachedDoc();
    const wrap: HTMLDivElement = doc.createElement('div');
    wrap.appendChild(serializer.serializeFragment(content, { document: doc }));

    // Apply necessary wrapper elements for certain tags (like <td>) so innerHTML works correctly
    const wrappersApplied: number = applyRequiredWrappers(wrap, doc);
    const firstChild: ChildNode = wrap.firstChild;

    if (firstChild?.nodeType === ELEMENT_NODE) {
        const wrappersInfo: string = wrappersApplied > 0 ? ` -${wrappersApplied}` : '';
        const sliceData = `${openStart} ${openEnd}${wrappersInfo} ${JSON.stringify(context)}`;
        (firstChild as HTMLElement).setAttribute('data-pm-slice', sliceData);
    }

    const text: string = view.someProp('clipboardTextSerializer', serializerFn => serializerFn(slice, view))
        || slice.content.textBetween(0, slice.content.size, '\n\n');

    return { dom: wrap, text, slice };
}
