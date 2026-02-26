import {isUndefinedOrNull} from '@type-editor/commons';
import type {
    DecorationSource,
    NodeView,
    PmDecoration,
    PmEditorView,
    ViewMutationRecord
} from '@type-editor/editor-types';
import type {Attrs, Node} from '@type-editor/model';

import type {CoreNodeViewSpec, CoreNodeViewUserOptions, NodeViewDOMSpec} from './CoreNodeViewOptions';

/**
 * Framework-agnostic base class for custom ProseMirror node views.
 *
 * Subclasses (e.g. `ReactNodeView`, `VueNodeView`, `SvelteNodeView`) extend
 * this class and hook into their respective rendering pipelines.
 *
 * @typeParam ComponentType - The UI component type used by the concrete
 *   framework adapter (e.g. a React `ComponentType`, a Vue `DefineComponent`,
 *   or a Svelte component constructor).
 */
export class CoreNodeView<ComponentType> implements NodeView {

    /** Callback supplied by ProseMirror that returns the node's current document position. */
    protected readonly getPosFunc: () => number | undefined;

    /** The ProseMirror editor view this node view belongs to. */
    protected readonly view: PmEditorView;

    /** User-supplied configuration for the node view. */
    protected readonly options: CoreNodeViewUserOptions<ComponentType>;

    /** The ProseMirror document node rendered by this view. */
    protected node: Node;

    /** Decorations applied directly to this node. */
    protected decorations: ReadonlyArray<PmDecoration>;

    /** Decorations applied to this node's content. */
    protected innerDecorations: DecorationSource;

    /** Whether this node is currently selected. */
    protected selected = false;

    private readonly _dom: HTMLElement;
    private readonly _contentDOM: HTMLElement | null;

    /**
     * @param nodeViewSpec - The specification object containing the node, view,
     *   position callback, decorations, and user options.
     */
    constructor(nodeViewSpec: CoreNodeViewSpec<ComponentType>) {
        const {node, view, getPos, decorations, innerDecorations, options} = nodeViewSpec;
        this.node = node;
        this.view = view;
        this.getPosFunc = getPos;
        this.decorations = decorations;
        this.innerDecorations = innerDecorations;
        this.options = options;

        this._dom = this.createElement(options.as) ?? document.createElement('div');
        if (node.isLeaf) {
            this._contentDOM = null;
        } else if (options.contentAs === 'self') {
            this._contentDOM = this._dom;
        } else {
            this._contentDOM = this.createElement(options.contentAs);
        }
        this._dom.setAttribute('data-node-view-root', 'true');
        if (this._contentDOM && this._contentDOM !== this._dom) {
            this._contentDOM.setAttribute('data-node-view-content', 'true');
            this._contentDOM.style.whiteSpace = 'inherit';
        }

        this.setSelection = options.setSelection;
        this.stopEvent = options.stopEvent;
    }

    /**
     * Optional override that controls how the editor selection is drawn inside
     * this node view.
     *
     * @param anchor - The anchor position of the selection.
     * @param head - The head position of the selection.
     * @param root - The root document or shadow root.
     */
    public readonly setSelection?: (anchor: number, head: number, root: Document | ShadowRoot) => void;

    /**
     * Optional override that determines whether a given DOM event should be
     * stopped (not handled by ProseMirror).
     *
     * @param event - The DOM event to evaluate.
     * @returns `true` to prevent ProseMirror from handling the event.
     */
    public readonly stopEvent?: (event: Event) => boolean;

    /** The outer DOM element that ProseMirror treats as this node's representation. */
    get dom(): HTMLElement {
        return this._dom;
    }

    /** The DOM element where ProseMirror places the node's editable content, or `null` for leaf nodes. */
    get contentDOM(): HTMLElement {
        return this._contentDOM;
    }

    /** The user-supplied UI component rendered by this node view. */
    get component(): ComponentType {
        return this.options.component;
    }

    /** Called by ProseMirror when this node becomes selected. */
    public selectNode(): void {
        this.selected = true;
        this.options.selectNode?.();
    }

    /** Called by ProseMirror when this node is deselected. */
    public deselectNode(): void {
        this.selected = false;
        this.options.deselectNode?.();
    }

    /**
     * Called by ProseMirror when the node or its decorations change.
     *
     * If a user-supplied `update` callback is provided it takes precedence;
     * otherwise {@link shouldUpdate} is used.  When the update is accepted the
     * internal state is synchronised and `onUpdate` is invoked.
     *
     * @param node - The new document node.
     * @param decorations - The new set of decorations applied to this node.
     * @param innerDecorations - The new decoration source for child content.
     * @returns `true` if this view can handle the update, `false` to recreate it.
     */
    public update(node: Node, decorations: ReadonlyArray<PmDecoration>, innerDecorations: DecorationSource): boolean {
        const result: boolean = this.options.update?.(node, decorations, innerDecorations) ?? this.shouldUpdate(node);

        this.node = node;
        this.decorations = decorations;
        this.innerDecorations = innerDecorations;

        if (result) {
            this.options.onUpdate?.();
        }

        return result;
    }

    /**
     * Called by ProseMirror to decide whether a DOM mutation should be ignored.
     *
     * A user-supplied `ignoreMutation` callback is consulted first.  If it does
     * not return a boolean, {@link shouldIgnoreMutation} provides a sensible
     * default.
     *
     * @param mutation - The observed DOM mutation.
     * @returns `true` if the mutation should be ignored by ProseMirror.
     */
    public ignoreMutation(mutation: ViewMutationRecord): boolean {
        if (!this._dom || !this._contentDOM) {
            return true;
        }

        let result: boolean | undefined;

        const userIgnoreMutation = this.options.ignoreMutation;

        if (userIgnoreMutation) {
            result = userIgnoreMutation(mutation);
        }

        if (typeof result !== 'boolean') {
            result = this.shouldIgnoreMutation(mutation);
        }

        return result;
    }

    /** Removes the node view's DOM elements and invokes the user-supplied `destroy` callback. */
    public destroy(): void {
        this.options.destroy?.();
        this._dom.remove();
        if (this._contentDOM && this._contentDOM !== this._dom) {
            this._contentDOM.remove();
        }
    }

    /**
     * Returns the current document position of this node, or `undefined` if
     * the node is no longer part of the document.
     */
    protected getPos(): number | undefined {
        return this.getPosFunc();
    }

    /**
     * Returns `true` if this node view instance can handle an update to the
     * given node.  The default implementation accepts the update when the node
     * type has not changed.
     *
     * @param node - The new document node to evaluate.
     * @returns `true` to reuse this view, `false` to create a new one.
     */
    protected shouldUpdate(node: Node): boolean {
        return node.type === this.node.type;
    }

    /**
     * Default implementation for deciding whether a DOM mutation should be
     * ignored.  Mutations that target the `contentDOM` attributes or fall
     * outside `contentDOM` are ignored; mutations inside `contentDOM` (except
     * selection changes) are forwarded to ProseMirror.
     *
     * @param mutation - The observed DOM mutation.
     * @returns `true` if the mutation should be ignored.
     */
    protected shouldIgnoreMutation(mutation: ViewMutationRecord): boolean {
        if (!this._dom || !this._contentDOM) {
            return true;
        }

        if (this.node.isLeaf || this.node.isAtom) {
            return true;
        }

        if (mutation.type === 'selection') {
            return false;
        }

        if (this._contentDOM === mutation.target && mutation.type === 'attributes') {
            return true;
        }

        if (this._contentDOM.contains(mutation.target)) {
            return false;
        }

        return true;
    }

    /**
     * Dispatches a transaction that updates this node's attributes.
     *
     * @param attr - A partial set of attributes to merge with the existing ones.
     */
    protected setAttrs(attr: Attrs): void {
        const pos: number = this.getPos();

        if (typeof pos !== 'number') {
            return;
        }

        this.view.dispatch(
            this.view.state.tr.setNodeMarkup(pos, undefined, {
                ...this.node.attrs,
                ...attr,
            }),
        );
    }

    /**
     * Creates an HTML element from a {@link NodeViewDOMSpec}.
     *
     * - `undefined` / `null` → creates a `<span>` (inline) or `<div>` (block).
     * - An `HTMLElement` instance → used as-is.
     * - A function → called with the current node; must return an element.
     * - A string → used as the tag name for `document.createElement`.
     *
     * @param nodeViewSpec - The specification describing how to create the element.
     * @returns The created (or supplied) HTML element, or `null` when the spec is nullish.
     */
    private createElement(nodeViewSpec?: NodeViewDOMSpec): HTMLElement | null {
        const {node} = this;

        if (isUndefinedOrNull(nodeViewSpec)) {
            return document.createElement(node.isInline ? 'span' : 'div');
        }

        if (nodeViewSpec instanceof HTMLElement) {
            return nodeViewSpec;
        }

        if (typeof nodeViewSpec === 'function') {
            return nodeViewSpec(node);
        }

        return document.createElement(nodeViewSpec);
    }
}
