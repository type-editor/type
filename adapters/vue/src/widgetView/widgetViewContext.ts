import type {WidgetDecorationFactory, WidgetDecorationSpec} from '@type-editor/adapter-core';
import type {PmEditorView} from '@type-editor/editor-types';
import type {InjectionKey} from 'vue';
import {inject} from 'vue';

import type {VueWidgetViewUserOptions} from './VueWidgetViewOptions';

/** Context provided to Vue widget view components via `inject`. */
export interface WidgetViewContext {
    /** The ProseMirror editor view. */
    view: PmEditorView
    /** Returns the widget's current document position. */
    getPos: () => number | undefined
    /** The decoration spec associated with this widget. */
    spec?: WidgetDecorationSpec
}

/** Injection key for the {@link WidgetViewContext}. */
export const widgetViewContext: InjectionKey<Readonly<WidgetViewContext>> = Symbol(
    '[ProsemirrorAdapter]widgetViewContext',
);

/** Returns the widget view context from the nearest provider. */
export function useWidgetViewContext(): Readonly<WidgetViewContext> {
    return inject(widgetViewContext);
}

/** Factory function type that creates a widget decoration factory from user options. */
export type WidgetViewFactory = (options: VueWidgetViewUserOptions) => WidgetDecorationFactory

/** Injection key for the {@link WidgetViewFactory}. */
export const widgetViewFactoryKey: InjectionKey<WidgetViewFactory> = Symbol('[ProsemirrorAdapter]useWidgetViewFactory');

/** Returns the widget view factory from the nearest provider. */
export function useWidgetViewFactory(): WidgetViewFactory {
    return inject(widgetViewFactoryKey);
}
