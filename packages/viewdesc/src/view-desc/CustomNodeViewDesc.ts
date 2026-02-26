import type {
    DecorationSource,
    NodeView,
    PmDecoration,
    PmEditorView,
    ViewMutationRecord
} from '@type-editor/editor-types';
import type {PmNode} from '@type-editor/model';

import {NodeViewDesc} from './NodeViewDesc';
import type {ViewDesc} from './ViewDesc';
import {ViewDescType} from './ViewDescType';


/**
 * A separate subclass is used for customized node views, so that the
 * extra checks only have to be made for nodes that are actually
 * customized.
 *
 * Custom node views allow developers to override default rendering and
 * behavior for specific node types. This class delegates to the custom
 * spec methods (update, selectNode, setSelection, etc.) when available.
 */
export class CustomNodeViewDesc extends NodeViewDesc {

    private readonly _spec: NodeView;

    /**
     * Creates a new CustomNodeViewDesc.
     *
     * @param parent - The parent view description
     * @param node - The ProseMirror node
     * @param outerDeco - Outer decorations
     * @param innerDeco - Inner decorations
     * @param dom - The outer DOM node
     * @param contentDOM - The content DOM node (if any)
     * @param nodeDOM - The node's main DOM element
     * @param spec - The custom node view specification
     */
    constructor(parent: ViewDesc | undefined,
                node: PmNode,
                outerDeco: ReadonlyArray<PmDecoration>,
                innerDeco: DecorationSource,
                dom: Node,
                contentDOM: HTMLElement | null,
                nodeDOM: Node,
                spec: NodeView) {
        super(parent, node, outerDeco, innerDeco, dom, contentDOM, nodeDOM);
        this._spec = spec;
    }

    get spec(): NodeView {
        return this._spec;
    }

    /**
     * Delegates to custom selectNode if defined, otherwise uses default behavior.
     */
    selectNode(): void {
        if (this._spec.selectNode) {
            this._spec.selectNode();
        } else {
            super.selectNode();
        }
    }

    /**
     * Delegates to custom deselectNode if defined, otherwise uses default behavior.
     */
    deselectNode(): void {
        if (this._spec.deselectNode) {
            this._spec.deselectNode();
        } else {
            super.deselectNode();
        }
    }

    /**
     * Delegates to custom setSelection if defined, otherwise uses default behavior.
     *
     * @param anchor - Anchor position relative to node start
     * @param head - Head position relative to node start
     * @param view - The editor view
     * @param force - Whether to force selection update
     */
    setSelection(anchor: number,
                 head: number,
                 view: PmEditorView,
                 force: boolean): void {
        if (this._spec.setSelection) {
            this._spec.setSelection(anchor, head, view.root);
        } else {
            super.setSelection(anchor, head, view, force);
        }
    }

    /**
     * Calls custom destroy handler if defined, then performs default cleanup.
     */
    destroy(): void {
        if (this._spec.destroy) {
            this._spec.destroy();
        }
        super.destroy();
    }

    /**
     * Delegates event handling to custom stopEvent if defined.
     *
     * @param event - The DOM event
     * @returns True if event should be stopped
     */
    stopEvent(event: Event): boolean {
        return this._spec.stopEvent ? this._spec.stopEvent(event) : false;
    }

    /**
     * Delegates mutation handling to custom ignoreMutation if defined.
     *
     * @param mutation - The mutation to check
     * @returns True if mutation should be ignored
     */
    ignoreMutation(mutation: ViewMutationRecord): boolean {
        return this._spec.ignoreMutation ? this._spec.ignoreMutation(mutation) : super.ignoreMutation(mutation);
    }

    getType(): ViewDescType {
        return ViewDescType.CUSTOM;
    }
}
