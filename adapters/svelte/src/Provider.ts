import {setContext} from 'svelte';

import {type MarkViewFactory, markViewFactoryKey} from './markView';
import {useSvelteMarkViewCreator} from './markView/useSvelteMarkViewCreator';
import {type NodeViewFactory, nodeViewFactoryKey} from './nodeView';
import {useSvelteNodeViewCreator} from './nodeView/useSvelteNodeViewCreator';
import {type PluginViewFactory, pluginViewFactoryKey} from './pluginView';
import {useSveltePluginViewCreator} from './pluginView/useSveltePluginViewCreator';
import {useSvelteRenderer} from './SvelteRenderer';
import {widgetViewFactoryKey} from './widgetView';
import {useSvelteWidgetViewCreator} from './widgetView/useSvelteWidgetViewCreator';

/**
 * Svelte setup function that wires up the ProseMirror adapter.
 *
 * Call this inside a Svelte component's `<script>` block (or setup context) so
 * that child components can use `useNodeViewFactory`, `useMarkViewFactory`,
 * `usePluginViewFactory`, and `useWidgetViewFactory` to resolve their
 * factories via Svelte's `getContext`.
 */
export function useProsemirrorAdapterProvider(): void {
    const {renderSvelteRenderer, removeSvelteRenderer} = useSvelteRenderer();

    const createSvelteNodeView: NodeViewFactory = useSvelteNodeViewCreator(renderSvelteRenderer, removeSvelteRenderer);
    const createSvelteMarkView: MarkViewFactory = useSvelteMarkViewCreator(renderSvelteRenderer, removeSvelteRenderer);
    const createSveltePluginView: PluginViewFactory = useSveltePluginViewCreator(renderSvelteRenderer, removeSvelteRenderer);
    const createSvelteWidgetView = useSvelteWidgetViewCreator(renderSvelteRenderer, removeSvelteRenderer);

    setContext(nodeViewFactoryKey, createSvelteNodeView);
    setContext(markViewFactoryKey, createSvelteMarkView);
    setContext(pluginViewFactoryKey, createSveltePluginView);
    setContext(widgetViewFactoryKey, createSvelteWidgetView);
}
