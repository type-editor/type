import type {PmEditorView} from '@type-editor/editor-types';
import type {Mark} from '@type-editor/model';
import {getAllContexts} from 'svelte';

import type {SvelteRendererResult} from '../SvelteRenderer';
import type {MarkViewFactory} from './markViewContext';
import {SvelteMarkView} from './SvelteMarkView';
import type {SvelteMarkViewUserOptions} from './SvelteMarkViewOptions';

/**
 * Creates a factory function that produces ProseMirror mark view constructors
 * backed by Svelte components.
 *
 * @param renderSvelteRenderer - Callback to mount a Svelte renderer.
 * @param removeSvelteRenderer - Callback to unmount a Svelte renderer.
 * @returns A {@link MarkViewFactory} that the consumer uses to define mark views.
 */

export function useSvelteMarkViewCreator(renderSvelteRenderer: SvelteRendererResult['renderSvelteRenderer'],
                                         removeSvelteRenderer: SvelteRendererResult['removeSvelteRenderer']): MarkViewFactory {
    const context: Map<any, any> = getAllContexts();

    return (options: SvelteMarkViewUserOptions) => (mark: Mark, view: PmEditorView, inline: boolean): SvelteMarkView => {
        const markView = new SvelteMarkView({
            mark,
            view,
            inline,
            options: {
                ...options,
                destroy() {
                    options.destroy?.();
                    removeSvelteRenderer(markView);
                },
            },
        });
        renderSvelteRenderer(markView, {context});

        return markView;
    };
}
