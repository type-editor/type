import type {PluginViewSpec} from '@type-editor/adapter-core';
import type {PmEditorState, PmEditorView} from '@type-editor/editor-types';
import {getContext} from 'svelte';
import type {Writable} from 'svelte/store';

import type {SveltePluginViewUserOptions} from './SveltePluginViewOptions';

/** Ref callback type used to attach a DOM element reference. */
export type PluginViewContentRef = (element: HTMLElement | null) => void

/** Reactive context provided to Svelte plugin view components via `getContext`. */
export interface PluginViewContext {
    /** Writable store containing the current ProseMirror editor view. */
    view: Writable<PmEditorView>
    /** Writable store containing the editor state before the most recent transaction. */
    prevState: Writable<PmEditorState | undefined>
}

/**
 * Retrieves a single property from the plugin view context.
 *
 * @param key - The context property to retrieve.
 * @returns The value of the requested context property.
 */
export function usePluginViewContext<Key extends keyof PluginViewContext>(key: Key): PluginViewContext[Key] {
    return getContext(key);
}

/** Factory function type that creates a ProseMirror plugin view spec from user options. */
export type PluginViewFactory = (options: SveltePluginViewUserOptions) => PluginViewSpec

/** Context key for the {@link PluginViewFactory}. */
export const pluginViewFactoryKey = '[ProsemirrorAdapter]usePluginViewFactory';

/** Returns the plugin view factory from the nearest Svelte context. */
export function usePluginViewFactory(): PluginViewFactory {
    return getContext<PluginViewFactory>(pluginViewFactoryKey);
}
