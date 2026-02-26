import type {DecorationSource, NodeViewConstructor, PmDecoration, PmEditorView} from '@type-editor/editor-types';
import type {Attrs, Node} from '@type-editor/model';
import {type Context, createContext, useContext} from 'react';

import type {ReactNodeViewUserOptions} from './ReactNodeViewOptions';

/** Ref callback used to attach the content DOM element inside a React node view component. */
export type NodeViewContentRef = (element: HTMLElement | null) => void

/** Context provided to React node view components via `useNodeViewContext`. */
export interface NodeViewContext {
    // won't change
    /** Ref callback – attach this to the element that should host editable content. */
    contentRef: NodeViewContentRef
    /** The outer DOM element of this node view. */
    dom: HTMLElement
    /** The ProseMirror editor view. */
    view: PmEditorView
    /** Returns the node's current document position. */
    getPos: () => number | undefined
    /** Dispatches a transaction updating this node's attributes. */
    setAttrs: (attrs: Attrs) => void

    // changes between updates
    /** The current ProseMirror document node. */
    node: Node
    /** Whether this node is currently selected. */
    selected: boolean
    /** Decorations applied to this node. */
    decorations: ReadonlyArray<PmDecoration>
    /** Decorations applied to this node's content. */
    innerDecorations: DecorationSource
}

/** React context that holds the {@link NodeViewContext} for the current node view. */
export const nodeViewContext: Context<NodeViewContext> = createContext<NodeViewContext>({
    contentRef: (): void => {
        // nothing to do
    },
    dom: null,
    view: null,
    getPos: (): number => 0,
    setAttrs: (): void => {
        // nothing to do
    },

    node: null,
    selected: false,
    decorations: [],
    innerDecorations: null,
});

/** Returns the node view context from the nearest provider. */
export function useNodeViewContext(): NodeViewContext {
    return useContext(nodeViewContext);
}

/** Factory function type that creates a ProseMirror node view constructor from user options. */
export type NodeViewFactory = (options: ReactNodeViewUserOptions) => NodeViewConstructor;

function defaultNodeViewFactory(_options: ReactNodeViewUserOptions): NodeViewConstructor {
    throw new Error(
        'No ProsemirrorAdapterProvider detected, maybe you need to wrap the component with the Editor with ProsemirrorAdapterProvider?',
    );
}

/** React context that holds the {@link NodeViewFactory}. */
export const createNodeViewContext: Context<NodeViewFactory> = createContext<NodeViewFactory>(defaultNodeViewFactory);

/** Returns the node view factory from the nearest provider. */
export function useNodeViewFactory(): NodeViewFactory {
    return useContext(createNodeViewContext);
}
