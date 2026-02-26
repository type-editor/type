import type {PluginViewSpec} from '@type-editor/adapter-core';
import type {PmEditorState, PmEditorView} from '@type-editor/editor-types';
import {type Context, createContext, useContext} from 'react';

import type {ReactPluginViewUserOptions} from './ReactPluginViewOptions';

/** Ref callback type used to attach a DOM element reference. */
export type PluginViewContentRef = (element: HTMLElement | null) => void

/** Context provided to React plugin view components. */
export interface PluginViewContext {
  /** The current ProseMirror editor view. */
  view: PmEditorView
  /** The editor state before the most recent transaction. */
  prevState?: PmEditorState
}

/** React context that holds the {@link PluginViewContext} for the current plugin view. */
export const pluginViewContext: Context<PluginViewContext> = createContext<PluginViewContext>({
  view: null,
});

/** Returns the plugin view context from the nearest provider. */
export function usePluginViewContext (): PluginViewContext {
    return useContext(pluginViewContext);
}

/** Factory function type that creates a ProseMirror plugin view spec from user options. */
export type PluginViewFactory = (options: ReactPluginViewUserOptions) => PluginViewSpec;

function defaultPluginViewFactory(_options: ReactPluginViewUserOptions): PluginViewSpec {
    throw new Error(
        'No ProsemirrorAdapterProvider detected, maybe you need to wrap the component with the Editor with ProsemirrorAdapterProvider?',
    );
}

/** React context that holds the {@link PluginViewFactory}. */
export const createPluginViewContext: Context<PluginViewFactory> = createContext<PluginViewFactory>(defaultPluginViewFactory);

/** Returns the plugin view factory from the nearest provider. */
export function usePluginViewFactory (): PluginViewFactory {
    return useContext(createPluginViewContext);
}
