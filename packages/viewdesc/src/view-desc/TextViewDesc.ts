import type {DecorationSource, PmDecoration, PmEditorView, ViewMutationRecord} from '@type-editor/editor-types';
import type {PmNode} from '@type-editor/model';

import {NodeViewDesc} from './NodeViewDesc';
import type {ViewDesc} from './ViewDesc';
import {ViewDescType} from './ViewDescType';
import {ViewDirtyState} from './ViewDirtyState';


/**
 * View description for text nodes. Text nodes are leaf nodes that contain
 * only text content and no children. They can be wrapped by mark decorations
 * but don't have their own content DOM.
 */
export class TextViewDesc extends NodeViewDesc {

    private readonly _domAtom = false;

    /**
     * Creates a new TextViewDesc.
     *
     * @param parent - The parent view description
     * @param node - The text node
     * @param outerDeco - Outer decorations (typically marks)
     * @param innerDeco - Inner decorations (unused for text nodes)
     * @param dom - The outer DOM node (may include mark wrappers)
     * @param nodeDOM - The actual text DOM node
     */
    constructor(parent: ViewDesc | undefined,
                node: PmNode,
                outerDeco: ReadonlyArray<PmDecoration>,
                innerDeco: DecorationSource,
                dom: Node,
                nodeDOM: Node) {
        super(parent, node, outerDeco, innerDeco, dom, null, nodeDOM);
    }

    get domAtom(): boolean {
        return this._domAtom;
    }

    /**
     * Returns a parse rule that skips any decoration wrappers around the text node.
     *
     * @returns Parse rule with skip set to the first non-decoration parent
     */
    parseRule(): { skip: boolean | ParentNode } {
        let skip: ParentNode = this._nodeDOM.parentNode;
        while (
            skip
            && skip !== this._dom
            && !skip.pmIsDeco) {

            skip = skip.parentNode;
        }
        return {skip: skip || true};
    }

    /**
     * Updates this text node with new content and decorations.
     *
     * @param node - The new text node
     * @param outerDeco - New outer decorations
     * @param _innerDeco - Inner decorations (unused for text)
     * @param view - The editor view
     * @returns True if update succeeded, false if node needs recreation
     */
    public update(node: PmNode,
                  outerDeco: ReadonlyArray<PmDecoration>,
                  _innerDeco: DecorationSource,
                  view: PmEditorView): boolean {
        if (this._dirty === ViewDirtyState.NODE_DIRTY
            || (this._dirty !== ViewDirtyState.NOT_DIRTY && !this.inParent())
            || !node.sameMarkup(this.node)) {
            return false;
        }

        this.updateOuterDeco(outerDeco);

        if ((this._dirty !== ViewDirtyState.NOT_DIRTY || node.text !== this.node.text)
            && node.text !== this._nodeDOM.nodeValue) {
            this._nodeDOM.nodeValue = node.text;

            if (view.trackWrites === this._nodeDOM) {
                view.clearTrackWrites();
            }
        }
        this._node = node;
        this._dirty = ViewDirtyState.NOT_DIRTY;

        return true;
    }

    /**
     * Checks if this text node is still in its parent's content DOM.
     *
     * @returns True if the text node is properly attached
     */
    public inParent(): boolean {
        for (let node: Node | null = this._nodeDOM; node; node = node.parentNode) {
            if (node === this._parent.contentDOM) {
                return true;
            }
        }
        return false;
    }

    /**
     * Converts a document position to a DOM position within the text node.
     *
     * @param pos - The position offset within this text node
     * @returns The text DOM node and offset
     */
    domFromPos(pos: number): { node: Node; offset: number } {
        return {node: this._nodeDOM, offset: pos};
    }

    /**
     * Converts a DOM position to a document position within the text node.
     *
     * @param dom - The DOM node
     * @param offset - The offset within the DOM node
     * @param bias - Direction bias (unused for text nodes)
     * @returns The document position
     */
    localPosFromDOM(dom: Node, offset: number, bias: number): number {
        if (dom === this._nodeDOM) {
            return this.posAtStart + Math.min(offset, this.node.text.length);
        }
        return super.localPosFromDOM(dom, offset, bias);
    }

    /**
     * Text nodes only care about character data and selection changes.
     *
     * @param mutation - The mutation to check
     * @returns True if mutation should be ignored
     */
    ignoreMutation(mutation: ViewMutationRecord): boolean {
        return mutation.type !== 'characterData' && mutation.type !== 'selection';
    }

    /**
     * Creates a sliced copy of this text node.
     *
     * @param from - Start position of the slice
     * @param to - End position of the slice
     * @returns A new TextViewDesc with sliced content
     */
    public slice(from: number, to: number): TextViewDesc {
        const node: PmNode = this.node.cut(from, to);
        const dom: Text = document.createTextNode(node.text);
        return new TextViewDesc(this._parent, node, this._outerDeco, this._innerDeco, dom, dom);
    }

    /**
     * Marks a range as dirty. If the entire text or boundaries are affected,
     * marks for full node recreation.
     *
     * @param from - Start position
     * @param to - End position
     */
    markDirty(from: number, to: number): void {
        super.markDirty(from, to);
        if (this._dom !== this._nodeDOM
            && (from === 0 || to === this._nodeDOM.nodeValue.length)) {
            this._dirty = ViewDirtyState.NODE_DIRTY;
        }
    }

    isText(text: string): boolean {
        return this.node.text === text;
    }

    getType(): ViewDescType {
        return ViewDescType.TEXT;
    }
}
