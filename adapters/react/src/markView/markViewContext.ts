import type {MarkViewConstructor, PmEditorView} from '@type-editor/editor-types';
import type {Mark} from '@type-editor/model';
import {type Context, createContext, useContext} from 'react';

import type {ReactMarkViewUserOptions} from './ReactMarkViewOptions';

/** Ref callback used to attach the content DOM element inside a React mark view component. */
export type MarkViewContentRef = (element: HTMLElement | null) => void

/** Context provided to React mark view components via `useMarkViewContext`. */
export interface MarkViewContext {
    // won't change
    /** Ref callback – attach this to the element that should host editable content. */
    contentRef: MarkViewContentRef
    /** The ProseMirror editor view. */
    view: PmEditorView
    /** The ProseMirror mark rendered by this view. */
    mark: Mark
}

/** React context that holds the {@link MarkViewContext} for the current mark view. */
export const markViewContext: Context<MarkViewContext> = createContext<MarkViewContext>({
    contentRef: () => {
        // nothing to do
    },
    view: null as never,
    mark: null as never,
});

/** Returns the mark view context from the nearest provider. */
export const useMarkViewContext = (): MarkViewContext => useContext(markViewContext);

/** Factory function type that creates a ProseMirror mark view constructor from user options. */
export type MarkViewFactory = (options: ReactMarkViewUserOptions) => MarkViewConstructor;

function defaultMarkViewFactory(_options: ReactMarkViewUserOptions): MarkViewConstructor {
    throw new Error(
        'No ProsemirrorAdapterProvider detected, maybe you need to wrap the component with the Editor with ProsemirrorAdapterProvider?',
    );
}

/** React context that holds the {@link MarkViewFactory}. */
export const createMarkViewContext: Context<MarkViewFactory> = createContext<MarkViewFactory>(defaultMarkViewFactory);

/** Returns the mark view factory from the nearest provider. */
export const useMarkViewFactory = (): MarkViewFactory => useContext(createMarkViewContext);
