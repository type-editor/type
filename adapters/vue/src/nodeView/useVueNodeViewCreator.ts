import type {DecorationSource, PmDecoration, PmEditorView} from '@type-editor/editor-types';
import type {PmNode} from '@type-editor/model';

import type {VueRendererResult} from '../VueRenderer';
import type {NodeViewFactory} from './nodeViewContext';
import {VueNodeView} from './VueNodeView';
import type {VueNodeViewUserOptions} from './VueNodeViewOptions';

/**
 * Creates a factory function that produces ProseMirror node view constructors
 * backed by Vue components.
 *
 * @param renderVueRenderer - Callback to register a Vue renderer for portal rendering.
 * @param removeVueRenderer - Callback to unregister a Vue renderer on destruction.
 * @returns A {@link NodeViewFactory} that the consumer uses to define node views.
 */

export function useVueNodeViewCreator(
    renderVueRenderer: VueRendererResult['renderVueRenderer'],
    removeVueRenderer: VueRendererResult['removeVueRenderer'],
) {
    const createVueNodeView: NodeViewFactory = (options: VueNodeViewUserOptions) => (
        node: PmNode,
        view: PmEditorView,
        getPos: () => (number | undefined),
        decorations: ReadonlyArray<PmDecoration>,
        innerDecorations: DecorationSource): VueNodeView => {

        const nodeView = new VueNodeView({
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
                    renderVueRenderer(nodeView);
                },

                selectNode(): void {
                    options.selectNode?.();
                    nodeView.updateContext();
                    renderVueRenderer(nodeView);
                },

                deselectNode(): void {
                    options.deselectNode?.();
                    nodeView.updateContext();
                    renderVueRenderer(nodeView);
                },

                destroy(): void {
                    options.destroy?.();
                    removeVueRenderer(nodeView);
                },
            },
        });

        // Trigger initial render
        renderVueRenderer(nodeView);

        return nodeView;
    };

    return createVueNodeView;
}
