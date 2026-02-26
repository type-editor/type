import type {WidgetDecorationFactory, WidgetDecorationSpec} from '@type-editor/adapter-core';
import {Decoration} from '@type-editor/decoration';
import type {DecorationWidgetOptions, PmDecoration, PmEditorView} from '@type-editor/editor-types';
import {getAllContexts} from 'svelte';

import type {SvelteRendererResult} from '../SvelteRenderer';
import {SvelteWidgetView} from './SvelteWidgetView';
import type {SvelteWidgetViewUserOptions} from './SvelteWidgetViewOptions';

/**
 * Creates a factory function that produces ProseMirror widget decoration
 * factories backed by Svelte components.
 *
 * @param renderSvelteRenderer - Callback to mount a Svelte renderer.
 * @param removeSvelteRenderer - Callback to unmount a Svelte renderer.
 * @returns A factory function that the consumer uses to create widget decorations.
 */

export function useSvelteWidgetViewCreator(renderSvelteRenderer: SvelteRendererResult['renderSvelteRenderer'],
                                           removeSvelteRenderer: SvelteRendererResult['removeSvelteRenderer']) {
    const context: Map<any, any> = getAllContexts();

    return (options: SvelteWidgetViewUserOptions): WidgetDecorationFactory => {
        return (pos: number, userSpec: DecorationWidgetOptions): PmDecoration => {
            const widgetView = new SvelteWidgetView({
                pos,
                options,
            });
            const spec: WidgetDecorationSpec = {
                ...userSpec,
                destroy: (node: Node): void => {
                    userSpec.destroy?.(node);
                    removeSvelteRenderer(widgetView);
                },
            };
            widgetView.spec = spec;

            return Decoration.widget(
                pos,
                (view: PmEditorView, getPos: () => (number | undefined)): HTMLElement => {
                    widgetView.bind(view, getPos);
                    widgetView.updateContext();
                    renderSvelteRenderer(widgetView, {context});

                    return widgetView.dom;
                },
                spec,
            );
        };
    };
}
