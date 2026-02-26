import type {PmEditorView} from '@type-editor/editor-types';
import type {Mark} from '@type-editor/model';

import type {VueRendererResult} from '../VueRenderer';
import type {MarkViewFactory} from './markViewContext';
import {VueMarkView} from './VueMarkView';
import type {VueMarkViewUserOptions} from './VueMarkViewOptions';

/**
 * Creates a factory function that produces ProseMirror mark view constructors
 * backed by Vue components.
 *
 * @param renderVueRenderer - Callback to register a Vue renderer for portal rendering.
 * @param removeVueRenderer - Callback to unregister a Vue renderer on destruction.
 * @returns A {@link MarkViewFactory} that the consumer uses to define mark views.
 */
export function useVueMarkViewCreator(renderVueRenderer: VueRendererResult['renderVueRenderer'],
                                      removeVueRenderer: VueRendererResult['removeVueRenderer']): MarkViewFactory {
    return (options: VueMarkViewUserOptions) => (
        mark: Mark,
        view: PmEditorView, inline: boolean): VueMarkView => {

        const markView = new VueMarkView({
            mark,
            view,
            inline,
            options: {
                ...options,
                destroy() {
                    options.destroy?.();
                    removeVueRenderer(markView);
                },
            },
        });

        // Trigger initial render
        renderVueRenderer(markView);

        return markView;
    };
}
