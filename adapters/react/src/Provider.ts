import { createElement, Fragment, type JSX, type ReactNode } from 'react';

import { createMarkViewContext } from './markView';
import { useReactMarkViewCreator } from './markView/useReactMarkViewCreator';
import { createNodeViewContext } from './nodeView';
import { useReactNodeViewCreator } from './nodeView/useReactNodeViewCreator';
import { createPluginViewContext } from './pluginView';
import { useReactPluginViewCreator } from './pluginView/useReactPluginViewCreator';
import { useReactRenderer } from './ReactRenderer';
import { createWidgetViewContext } from './widgetView';
import { useReactWidgetViewCreator } from './widgetView/useReactWidgetViewCreator';

/** Factory type returned by `useReactNodeViewCreator`. */
export type CreateReactNodeView = ReturnType<typeof useReactNodeViewCreator>
/** Factory type returned by `useReactMarkViewCreator`. */
export type CreateReactMarkView = ReturnType<typeof useReactMarkViewCreator>
/** Factory type returned by `useReactPluginViewCreator`. */
export type CreateReactPluginView = ReturnType<typeof useReactPluginViewCreator>
/** Factory type returned by `useReactWidgetViewCreator`. */
export type CreateReactWidgetView = ReturnType<typeof useReactWidgetViewCreator>

/**
 * Provider component that wires up the React ProseMirror adapter.
 *
 * Wrap the component containing your ProseMirror editor with this provider so
 * that the `useNodeViewFactory`, `useMarkViewFactory`, `usePluginViewFactory`,
 * and `useWidgetViewFactory` hooks can resolve their factories.
 */

export const ProsemirrorAdapterProvider: ({ children }: { children: ReactNode }) => JSX.Element = ({ children }: {
    children: ReactNode
}): JSX.Element => {
    const { renderReactRenderer, removeReactRenderer, render } = useReactRenderer();

    const createReactNodeView: CreateReactNodeView = useReactNodeViewCreator(renderReactRenderer, removeReactRenderer);

    const createReactMarkView: CreateReactMarkView = useReactMarkViewCreator(renderReactRenderer, removeReactRenderer);

    const createReactPluginView: CreateReactPluginView = useReactPluginViewCreator(
        renderReactRenderer,
        removeReactRenderer,
    );

    const createReactWidgetView: CreateReactWidgetView = useReactWidgetViewCreator(
        renderReactRenderer,
        removeReactRenderer,
    );

    return createElement(
        createNodeViewContext.Provider,
        { value: createReactNodeView },
        createElement(
            createMarkViewContext.Provider,
            { value: createReactMarkView },
            createElement(
                createPluginViewContext.Provider,
                { value: createReactPluginView },
                createElement(
                    createWidgetViewContext.Provider,
                    { value: createReactWidgetView },
                    createElement(Fragment, { key: 1 }, children),
                    createElement(Fragment, { key: 2 }, render()),
                ),
            ),
        ),
    );
};
