import type {PmEditorState, PmEditorView} from '@type-editor/editor-types';

import type {VueRendererResult} from '../VueRenderer';
import type {PluginViewFactory} from './pluginViewContext';
import {VuePluginView} from './VuePluginView';

/**
 * Creates a factory function that produces ProseMirror plugin view specs
 * backed by Vue components.
 *
 * @param renderVueRenderer - Callback to register a Vue renderer for portal rendering.
 * @param removeVueRenderer - Callback to unregister a Vue renderer on destruction.
 * @returns A {@link PluginViewFactory} that the consumer uses to define plugin views.
 */

export function useVuePluginViewCreator(renderVueRenderer: VueRendererResult['renderVueRenderer'],
                                        removeVueRenderer: VueRendererResult['removeVueRenderer']): PluginViewFactory {
    return (options) => (view: PmEditorView): VuePluginView => {
        const pluginView = new VuePluginView({
            view,
            options: {
                ...options,

                update: (view: PmEditorView, prevState: PmEditorState): void => {
                    options.update?.(view, prevState);
                    pluginView.updateContext();
                },

                destroy: (): void => {
                    options.destroy?.();
                    removeVueRenderer(pluginView);
                },
            },
        });

        renderVueRenderer(pluginView);

        return pluginView;
    };
}
