import type {PmEditorState, PmEditorView} from '@type-editor/editor-types';
import {getAllContexts} from 'svelte';

import type {SvelteRendererResult} from '../SvelteRenderer';
import type {PluginViewFactory} from './pluginViewContext';
import {SveltePluginView} from './SveltePluginView';
import type {SveltePluginViewUserOptions} from './SveltePluginViewOptions';

/**
 * Creates a factory function that produces ProseMirror plugin view specs
 * backed by Svelte components.
 *
 * @param renderSvelteRenderer - Callback to mount a Svelte renderer.
 * @param removeSvelteRenderer - Callback to unmount a Svelte renderer.
 * @returns A {@link PluginViewFactory} that the consumer uses to define plugin views.
 */

export function useSveltePluginViewCreator(renderSvelteRenderer: SvelteRendererResult['renderSvelteRenderer'],
                                           removeSvelteRenderer: SvelteRendererResult['removeSvelteRenderer']): PluginViewFactory {
    const context: Map<any, any> = getAllContexts();

    return (options: SveltePluginViewUserOptions) => (view: PmEditorView): SveltePluginView => {

        const pluginView = new SveltePluginView({
            view,
            options: {
                ...options,
                update: (view: PmEditorView, prevState: PmEditorState): void => {
                    options.update?.(view, prevState);
                    pluginView.updateContext();
                },
                destroy: (): void => {
                    options.destroy?.();
                    removeSvelteRenderer(pluginView);
                },
            },
        });

        renderSvelteRenderer(pluginView, {context});

        return pluginView;
    };
}
