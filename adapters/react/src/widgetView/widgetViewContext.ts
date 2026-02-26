import type {WidgetDecorationFactory, WidgetDecorationSpec} from '@type-editor/adapter-core';
import type {PmEditorView} from '@type-editor/editor-types';
import {type Context, createContext, useContext} from 'react';

import type {ReactWidgetViewUserOptions} from './ReactWidgetViewOptions';

/** Context provided to React widget view components. */
export interface WidgetViewContext {
    /** The ProseMirror editor view, available after the widget is mounted. */
    view: PmEditorView
    /** Returns the widget's current document position. */
    getPos: () => number | undefined
    /** The decoration spec associated with this widget. */
    spec?: WidgetDecorationSpec
}

/** React context that holds the {@link WidgetViewContext} for the current widget view. */
export const widgetViewContext: Context<WidgetViewContext> = createContext<WidgetViewContext>({
    view: null,
    getPos: (): number | undefined => undefined,
});

/** Returns the widget view context from the nearest provider. */
export function useWidgetViewContext(): WidgetViewContext {
    return useContext(widgetViewContext);
}

/** Factory function type that creates a widget decoration factory from user options. */
export type WidgetViewFactory = (options: ReactWidgetViewUserOptions) => WidgetDecorationFactory;

function defaultWidgetViewFactory(_options: ReactWidgetViewUserOptions): WidgetDecorationFactory {
    throw new Error(
        'No ProsemirrorAdapterProvider detected, maybe you need to wrap the component with the Editor with ProsemirrorAdapterProvider?',
    );
}

/** React context that holds the {@link WidgetViewFactory}. */
export const createWidgetViewContext: Context<WidgetViewFactory> = createContext<WidgetViewFactory>(defaultWidgetViewFactory);

/** Returns the widget view factory from the nearest provider. */
export function useWidgetViewFactory(): WidgetViewFactory {
    return useContext(createWidgetViewContext);
}
