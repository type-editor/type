import type {PluginViewSpec} from '@type-editor/adapter-core';
import type {PmEditorState, PmEditorView} from '@type-editor/editor-types';
import type {InjectionKey, ShallowRef} from 'vue';
import {inject} from 'vue';

import type {VuePluginViewUserOptions} from './VuePluginViewOptions';

/** Ref callback type used to attach a DOM element reference. */
export type PluginViewContentRef = (element: HTMLElement | null) => void

/** Reactive context provided to Vue plugin view components via `inject`. */
export interface PluginViewContext {
    /** A shallow ref to the current ProseMirror editor view. */
    view: ShallowRef<PmEditorView>
    /** A shallow ref to the editor state before the most recent transaction. */
    prevState: ShallowRef<PmEditorState | undefined>
}

/** Injection key for the {@link PluginViewContext}. */
export const pluginViewContext: InjectionKey<Readonly<PluginViewContext>> = Symbol(
    '[ProsemirrorAdapter]pluginViewContext',
);

/** Returns the plugin view context from the nearest provider. */
export function usePluginViewContext(): Readonly<PluginViewContext> {
    return inject(pluginViewContext);
}

/** Factory function type that creates a ProseMirror plugin view from user options. */
export type PluginViewFactory = (options: VuePluginViewUserOptions) => PluginViewSpec

/** Injection key for the {@link PluginViewFactory}. */
export const pluginViewFactoryKey: InjectionKey<PluginViewFactory> = Symbol('[ProsemirrorAdapter]usePluginViewFactory');

/** Returns the plugin view factory from the nearest provider. */
export function usePluginViewFactory(): PluginViewFactory {
    return inject(pluginViewFactoryKey);
}
