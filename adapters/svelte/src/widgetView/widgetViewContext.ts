import type { WidgetDecorationFactory, WidgetDecorationSpec } from '@type-editor/adapter-core';
import type { PmEditorView } from '@type-editor/editor-types';
import { getContext } from 'svelte';

import type { SvelteWidgetViewUserOptions } from './SvelteWidgetViewOptions';

/** Context provided to Svelte widget view components via `getContext`. */
export interface WidgetViewContext {
  /** The ProseMirror editor view. */
  view: PmEditorView
  /** Returns the widget's current document position. */
  getPos: () => number | undefined
  /** The decoration spec associated with this widget. */
  spec?: WidgetDecorationSpec
}

/**
 * Retrieves a single property from the widget view context.
 *
 * @param key - The context property to retrieve.
 * @returns The value of the requested context property.
 */
export function useWidgetViewContext<Key extends keyof WidgetViewContext>(key: Key): WidgetViewContext[Key] {
  return getContext(key);
}

/** Factory function type that creates a widget decoration factory from user options. */
export type WidgetViewFactory = (options: SvelteWidgetViewUserOptions) => WidgetDecorationFactory

/** Context key for the {@link WidgetViewFactory}. */
export const widgetViewFactoryKey = '[ProsemirrorAdapter]useWidgetViewFactory';

/** Returns the widget view factory from the nearest Svelte context. */
export function useWidgetViewFactory(): WidgetViewFactory {
    return getContext<WidgetViewFactory>(widgetViewFactoryKey);
}
