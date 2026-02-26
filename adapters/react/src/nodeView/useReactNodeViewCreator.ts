import type {DecorationSource, NodeViewConstructor, PmDecoration, PmEditorView} from '@type-editor/editor-types';
import type {PmNode} from '@type-editor/model';
import {useCallback} from 'react';

import type {ReactRendererResult} from '../ReactRenderer';
import {ReactNodeView} from './ReactNodeView';
import type {ReactNodeViewUserOptions} from './ReactNodeViewOptions';

/**
 * React hook that returns a factory for creating ProseMirror node view
 * constructors backed by React components.
 *
 * The returned factory wraps each user-supplied lifecycle callback so that the
 * React portal is automatically re-rendered (or removed) at the right time.
 *
 * @param renderReactRenderer - Callback to register/update a React renderer portal.
 * @param removeReactRenderer - Callback to unregister a React renderer portal.
 * @returns A memoised factory function.
 */

export function useReactNodeViewCreator(renderReactRenderer: ReactRendererResult['renderReactRenderer'],
                                        removeReactRenderer: ReactRendererResult['removeReactRenderer']) {
    return useCallback(
        (options: ReactNodeViewUserOptions): NodeViewConstructor => {
            return (
                node: PmNode,
                view: PmEditorView,
                getPos: () => (number | undefined),
                decorations: ReadonlyArray<PmDecoration>,
                innerDecorations: DecorationSource
            ): ReactNodeView => {
                const enhancedOptions = {
                    ...options,
                    onUpdate(): void {
                        options.onUpdate?.();
                        renderReactRenderer(nodeView);
                    },
                    selectNode(): void {
                        options.selectNode?.();
                        renderReactRenderer(nodeView);
                    },
                    deselectNode(): void {
                        options.deselectNode?.();
                        renderReactRenderer(nodeView);
                    },
                    destroy(): void {
                        options.destroy?.();
                        removeReactRenderer(nodeView);
                    },
                };

                const nodeView = new ReactNodeView({
                    node,
                    view,
                    getPos,
                    decorations,
                    innerDecorations,
                    options: enhancedOptions,
                });

                // Trigger initial render
                renderReactRenderer(nodeView, false);

                return nodeView;
            };
        },
        [renderReactRenderer, removeReactRenderer],
    );
}
