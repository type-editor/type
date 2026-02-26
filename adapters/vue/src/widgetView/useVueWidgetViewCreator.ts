import type {WidgetDecorationFactory, WidgetDecorationSpec} from '@type-editor/adapter-core';
import {Decoration} from '@type-editor/decoration';
import type {DecorationWidgetOptions, PmDecoration, PmEditorView} from '@type-editor/editor-types';

import type {VueRendererResult} from '../VueRenderer';
import {VueWidgetView} from './VueWidgetView';
import type {VueWidgetViewUserOptions} from './VueWidgetViewOptions';

/**
 * Creates a factory function that produces ProseMirror widget decoration
 * factories backed by Vue components.
 *
 * @param renderVueRenderer - Callback to register a Vue renderer for portal rendering.
 * @param removeVueRenderer - Callback to unregister a Vue renderer on destruction.
 * @returns A factory function that the consumer uses to create widget decorations.
 */

export function useVueWidgetViewCreator(renderVueRenderer: VueRendererResult['renderVueRenderer'],
                                        removeVueRenderer: VueRendererResult['removeVueRenderer']) {
    return (options: VueWidgetViewUserOptions): WidgetDecorationFactory => {
        return (pos: number, userSpec: DecorationWidgetOptions): PmDecoration => {

            const widgetView = new VueWidgetView({
                pos,
                options,
            });

            const spec: WidgetDecorationSpec = {
                ...userSpec,
                destroy: (node: Node): void => {
                    userSpec.destroy?.(node);
                    removeVueRenderer(widgetView);
                },
            };

            widgetView.spec = spec;

            return Decoration.widget(
                pos,
                (view: PmEditorView, getPos: () => number): HTMLElement => {
                    widgetView.bind(view, getPos);
                    widgetView.updateContext();
                    renderVueRenderer(widgetView);

                    return widgetView.dom;
                },
                spec,
            );
        };
    };
}
