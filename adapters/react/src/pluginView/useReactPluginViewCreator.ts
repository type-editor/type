import type {PluginViewSpec} from '@type-editor/adapter-core';
import type {PmEditorState, PmEditorView} from '@type-editor/editor-types';
import {useCallback} from 'react';

import type {ReactRendererResult} from '../ReactRenderer';
import {ReactPluginView} from './ReactPluginView';
import type {ReactPluginViewUserOptions} from './ReactPluginViewOptions';

/**
 * React hook that returns a factory for creating ProseMirror plugin view specs
 * backed by React components.
 *
 * @param renderReactRenderer - Callback to register/update a React renderer portal.
 * @param removeReactRenderer - Callback to unregister a React renderer portal.
 * @returns A memoised factory function.
 */

export function useReactPluginViewCreator(renderReactRenderer: ReactRendererResult['renderReactRenderer'],
                                          removeReactRenderer: ReactRendererResult['removeReactRenderer']) {
    return useCallback(
        (options: ReactPluginViewUserOptions): PluginViewSpec => {
            return (view: PmEditorView): ReactPluginView => {

                const pluginView = new ReactPluginView({
                    view,
                    options: {
                        ...options,
                        update: (view: PmEditorView, prevState: PmEditorState): void => {
                            options.update?.(view, prevState);
                            renderReactRenderer(pluginView);
                        },
                        destroy: () => {
                            options.destroy?.();
                            removeReactRenderer(pluginView);
                        },
                    },
                });

                renderReactRenderer(pluginView, false);

                return pluginView;
            };
        },
        [removeReactRenderer, renderReactRenderer],
    );
}
