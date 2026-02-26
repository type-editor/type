import type {DecorationSource, NodeViewConstructor, PmDecoration, PmEditorView} from '@type-editor/editor-types';
import type {Attrs, Node} from '@type-editor/model';
import {getContext} from 'svelte';
import type {Writable} from 'svelte/store';

import type {SvelteNodeViewUserOptions} from './SvelteNodeViewOptions';

/** Reactive context provided to Svelte node view components via `getContext`. */
export interface NodeViewContext {
    // won't change
    /** Ref callback – attach this to the element that should host editable content. */
    contentRef: (element: HTMLElement | null) => void
    /** The outer DOM element of this node view. */
    dom: HTMLElement
    /** The ProseMirror editor view. */
    view: PmEditorView
    /** Returns the node's current document position. */
    getPos: () => number | undefined
    /** Dispatches a transaction updating this node's attributes. */
    setAttrs: (attrs: Attrs) => void

    // changes between updates
    /** Writable store containing the current ProseMirror document node. */
    node: Writable<Node>
    /** Writable store indicating whether this node is currently selected. */
    selected: Writable<boolean>
    /** Writable store containing the decorations applied to this node. */
    decorations: Writable<ReadonlyArray<PmDecoration>>
    /** Writable store containing the decorations applied to this node's content. */
    innerDecorations: Writable<DecorationSource>
}

/**
 * Retrieves a single property from the node view context.
 *
 * @param key - The context property to retrieve.
 * @returns The value of the requested context property.
 */
export function useNodeViewContext<Key extends keyof NodeViewContext>(key: Key): NodeViewContext[Key] {
    return getContext(key);
}

/** Context key for the {@link NodeViewFactory}. */
export const nodeViewFactoryKey = '[ProsemirrorAdapter]useNodeViewFactory';

/** Factory function type that creates a ProseMirror node view constructor from user options. */
export type NodeViewFactory = (options: SvelteNodeViewUserOptions) => NodeViewConstructor

/** Returns the node view factory from the nearest Svelte context. */
export function useNodeViewFactory(): NodeViewFactory {
    return getContext<NodeViewFactory>(nodeViewFactoryKey);
}
