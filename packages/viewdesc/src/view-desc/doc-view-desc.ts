import type {DecorationSource, PmDecoration, PmEditorView} from '@type-editor/editor-types';
import type {Node} from '@type-editor/model';

import {NodeViewDesc} from './NodeViewDesc';
import {ViewDescUpdater} from './ViewDescUpdater';


/**
 * Create a view desc for the top-level document node, to be exported
 * and used by the view class.
 *
 * @param doc - The document node
 * @param outerDeco - Outer decorations for the document
 * @param innerDeco - Inner decorations for the document
 * @param dom - The DOM element that will contain the document
 * @param view - The editor view
 * @returns A NodeViewDesc for the document
 */
export function docViewDesc(doc: Node,
                            outerDeco: ReadonlyArray<PmDecoration>,
                            innerDeco: DecorationSource,
                            dom: HTMLElement,
                            view:
                            PmEditorView): NodeViewDesc {
    NodeViewDesc.applyOuterDeco(dom, outerDeco, doc);
    const docView = new NodeViewDesc(undefined, doc, outerDeco, innerDeco, dom, dom, dom);
    if (docView.contentDOM) {
        ViewDescUpdater.updateChildren(docView, view, 0);
    }

    return docView;
}
