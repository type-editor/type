import type {WidgetDecorationFactory, WidgetDecorationSpec} from '@type-editor/adapter-core';
import {Decoration} from '@type-editor/decoration';
import type {DecorationWidgetOptions, PmEditorView} from '@type-editor/editor-types';
import {useCallback} from 'react';

import type {ReactRendererResult} from '../ReactRenderer';
import {ReactWidgetView} from './ReactWidgetView';
import type {ReactWidgetViewUserOptions} from './ReactWidgetViewOptions';

/**
 * React hook that returns a factory for creating ProseMirror widget decoration
 * factories backed by React components.
 *
 * @param renderReactRenderer - Callback to register/update a React renderer portal.
 * @param removeReactRenderer - Callback to unregister a React renderer portal.
 * @returns A memoised factory function.
 */

export function useReactWidgetViewCreator(renderReactRenderer: ReactRendererResult['renderReactRenderer'],
                                          removeReactRenderer: ReactRendererResult['removeReactRenderer']) {
    return useCallback(
        (options: ReactWidgetViewUserOptions): WidgetDecorationFactory => {
            return (pos: number, userSpec: DecorationWidgetOptions) => {

                const widgetView = new ReactWidgetView({
                    pos,
                    options,
                });

                const spec: WidgetDecorationSpec = {
                    ...userSpec,
                    destroy: (node) => {
                        userSpec.destroy?.(node);
                        removeReactRenderer(widgetView);
                    },
                };

                widgetView.spec = spec;

                return Decoration.widget(
                    pos,
                    (view: PmEditorView, getPos: () => (number | undefined)): HTMLElement => {
                        widgetView.bind(view, getPos);
                        renderReactRenderer(widgetView);

                        return widgetView.dom;
                    },
                    spec,
                );
            };
        },
        [removeReactRenderer, renderReactRenderer]
    );
}
