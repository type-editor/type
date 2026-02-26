import type {DecorationSource, PmDecoration, PmEditorView, ViewMutationRecord} from '@type-editor/editor-types';
import type {Node} from '@type-editor/model';

/**
 * Describes how to create the DOM element for a node view.
 *
 * - A `string` is used as a tag name for `document.createElement`.
 * - An `HTMLElement` is used as-is.
 * - A function receives the current node and must return an element.
 */
export type NodeViewDOMSpec = string | HTMLElement | ((node: Node) => HTMLElement)

/**
 * Extends the DOM spec with the special `'self'` sentinel value which makes
 * the node view's `contentDOM` the same element as `dom`.  ProseMirror will
 * then place the editable content directly inside the root element, eliminating
 * one level of nesting in the serialised HTML.
 *
 * Note: the type is intentionally a `string` alias – TypeScript would otherwise
 * collapse `NodeViewDOMSpec | 'self'` because `NodeViewDOMSpec` already
 * includes `string`.  At runtime the constructor checks `options.contentAs ===
 * 'self'` before calling `createElement`.
 */
export type NodeViewContentDOMSpec = NodeViewDOMSpec

/**
 * User-facing configuration for a core node view.
 *
 * @typeParam Component - The UI component type used by the concrete framework adapter.
 */
export interface CoreNodeViewUserOptions<Component> {
    // DOM
    /** Specification for the outer DOM element. Defaults to `<span>` (inline) or `<div>` (block). */
    as?: NodeViewDOMSpec
    /**
     * Set to `'self'` to make `contentDOM === dom` (no separate content
     * wrapper element).  Any other value is forwarded to the normal element
     * factory.
     */
    contentAs?: NodeViewContentDOMSpec | 'self'

    // Component
    /** The framework component to render inside this node view. */
    component: Component

    // Overrides
    /**
     * Custom update handler.  Return `true` to accept the update, `false` to
     * request a fresh node view.
     *
     * @param node - The new document node.
     * @param decorations - Updated node decorations.
     * @param innerDecorations - Updated content decorations.
     */
    update?: (node: Node, decorations: ReadonlyArray<PmDecoration>, innerDecorations: DecorationSource) => boolean
    /**
     * Custom handler for deciding whether to ignore a DOM mutation.
     *
     * @param mutation - The observed DOM mutation record.
     */
    ignoreMutation?: (mutation: ViewMutationRecord) => boolean
    /** Called when the node becomes selected. */
    selectNode?: () => void
    /** Called when the node is deselected. */
    deselectNode?: () => void
    /**
     * Custom selection drawing handler.
     *
     * @param anchor - The anchor position.
     * @param head - The head position.
     * @param root - The document or shadow root.
     */
    setSelection?: (anchor: number, head: number, root: Document | ShadowRoot) => void
    /**
     * Determines whether a DOM event should be stopped from reaching ProseMirror.
     *
     * @param event - The DOM event.
     */
    stopEvent?: (event: Event) => boolean
    /** Called when the node view is destroyed. */
    destroy?: () => void

    // Additional
    /** Called after a successful update (when `update` returns `true`). */
    onUpdate?: () => void
}

/**
 * Internal specification object passed to the {@link CoreNodeView} constructor.
 *
 * @typeParam Component - The UI component type used by the concrete framework adapter.
 */
export interface CoreNodeViewSpec<Component> {
    /** The ProseMirror document node. */
    node: Node
    /** The ProseMirror editor view. */
    view: PmEditorView
    /** Callback returning the node's current document position. */
    getPos: () => number | undefined
    /** Decorations applied to the node. */
    decorations: ReadonlyArray<PmDecoration>
    /** Decorations applied to the node's content. */
    innerDecorations: DecorationSource
    /** User-supplied configuration. */
    options: CoreNodeViewUserOptions<Component>
}
