import type {DecorationSource, NodeViewConstructor, PmDecoration, PmEditorView} from '@type-editor/editor-types';
import type {Attrs, Node} from '@type-editor/model';
import type {InjectionKey, ShallowRef, VNodeRef} from 'vue';
import {inject} from 'vue';

import type {VueNodeViewComponent, VueNodeViewUserOptions} from './VueNodeViewOptions';

/** Reactive context provided to Vue node view components via `inject`. */
export interface NodeViewContext {
    // won't change
    /** Ref callback – attach this to the element that should host editable content. */
    contentRef: VNodeRef
    /** The outer DOM element of this node view. */
    dom: HTMLElement
    /** The ProseMirror editor view. */
    view: PmEditorView
    /** Returns the node's current document position. */
    getPos: () => number | undefined
    /** Dispatches a transaction updating this node's attributes. */
    setAttrs: (attrs: Attrs) => void

    // changes between updates
    /** Shallow ref to the current ProseMirror document node. */
    node: ShallowRef<Node>
    /** Shallow ref indicating whether this node is currently selected. */
    selected: ShallowRef<boolean>
    /** Shallow ref to the decorations applied to this node. */
    decorations: ShallowRef<ReadonlyArray<PmDecoration>>
    /** Shallow ref to the decorations applied to this node's content. */
    innerDecorations: ShallowRef<DecorationSource>
}

/** Injection key for the {@link NodeViewContext}. */
export const nodeViewContext: InjectionKey<Readonly<NodeViewContext>> = Symbol('[ProsemirrorAdapter]nodeViewContext');

/** Returns the node view context from the nearest provider. */
export function useNodeViewContext(): Readonly<VueNodeViewComponent> {
    return inject(nodeViewContext);
}

/** Factory function type that creates a ProseMirror node view constructor from user options. */
export type NodeViewFactory = (options: VueNodeViewUserOptions) => NodeViewConstructor

/** Injection key for the {@link NodeViewFactory}. */
export const nodeViewFactoryKey: InjectionKey<NodeViewFactory> = Symbol('[ProsemirrorAdapter]useNodeViewFactory');

/** Returns the node view factory from the nearest provider. */
export function useNodeViewFactory(): NodeViewFactory {
    return inject(nodeViewFactoryKey);
}
