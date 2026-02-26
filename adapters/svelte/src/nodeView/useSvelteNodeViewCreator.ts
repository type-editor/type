import type {DecorationSource, PmDecoration, PmEditorView} from '@type-editor/editor-types';
import type {PmNode} from '@type-editor/model';
import {getAllContexts} from 'svelte';

import type {SvelteRendererResult} from '../SvelteRenderer';
import type {NodeViewFactory} from './nodeViewContext';
import {SvelteNodeView} from './SvelteNodeView';
import type {SvelteNodeViewUserOptions} from './SvelteNodeViewOptions';

/**
 * Creates a factory function that produces ProseMirror node view constructors
 * backed by Svelte components.
 *
 * @param renderSvelteRenderer - Callback to mount a Svelte renderer.
 * @param removeSvelteRenderer - Callback to unmount a Svelte renderer.
 * @returns A {@link NodeViewFactory} that the consumer uses to define node views.
 */

export function useSvelteNodeViewCreator(renderSvelteRenderer: SvelteRendererResult['renderSvelteRenderer'],
                                         removeSvelteRenderer: SvelteRendererResult['removeSvelteRenderer']): NodeViewFactory {
    const context: Map<any, any> = getAllContexts();

    return (options: SvelteNodeViewUserOptions) => (
        node: PmNode,
        view: PmEditorView,
        getPos: () => (number | undefined),
        decorations: ReadonlyArray<PmDecoration>,
        innerDecorations: DecorationSource): SvelteNodeView => {

        const nodeView = new SvelteNodeView({
            node,
            view,
            getPos,
            decorations,
            innerDecorations,
            options: {
                ...options,
                onUpdate(): void {
                    options.onUpdate?.();
                    nodeView.updateContext();
                },
                selectNode(): void {
                    options.selectNode?.();
                    nodeView.updateContext();
                },
                deselectNode(): void {
                    options.deselectNode?.();
                    nodeView.updateContext();
                },
                destroy(): void {
                    options.destroy?.();
                    removeSvelteRenderer(nodeView);
                },
            },
        });
      
        // Trigger initial render
        renderSvelteRenderer(nodeView, {context});

        return nodeView;
    };
}
