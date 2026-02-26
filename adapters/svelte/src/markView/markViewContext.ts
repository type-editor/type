import type {MarkViewConstructor, PmEditorView} from '@type-editor/editor-types';
import type {Mark} from '@type-editor/model';
import {getContext} from 'svelte';
import type {Writable} from 'svelte/store';

import type {SvelteMarkViewUserOptions} from './SvelteMarkViewOptions';

/** Reactive context provided to Svelte mark view components via `getContext`. */
export interface MarkViewContext {
    // won't change
    /** Ref callback – attach this to the element that should host editable content. */
    contentRef: (element: HTMLElement | null) => void
    /** The ProseMirror editor view. */
    view: PmEditorView
    /** Writable store containing the ProseMirror mark rendered by this view. */
    mark: Writable<Mark>
}

/**
 * Retrieves a single property from the mark view context.
 *
 * @param key - The context property to retrieve.
 * @returns The value of the requested context property.
 */
export function useMarkViewContext<Key extends keyof MarkViewContext>(key: Key): MarkViewContext[Key] {
    return getContext(key);
}

/** Context key for the {@link MarkViewFactory}. */
export const markViewFactoryKey = '[ProsemirrorAdapter]useMarkViewFactory';

/** Factory function type that creates a ProseMirror mark view constructor from user options. */
export type MarkViewFactory = (options: SvelteMarkViewUserOptions) => MarkViewConstructor

/** Returns the mark view factory from the nearest Svelte context. */
export function useMarkViewFactory(): MarkViewFactory {
    return getContext<MarkViewFactory>(markViewFactoryKey);
}
