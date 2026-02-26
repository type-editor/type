import {defineComponent, Fragment, h, provide} from 'vue';

import {markViewFactoryKey} from './markView';
import {useVueMarkViewCreator} from './markView/useVueMarkViewCreator';
import {nodeViewFactoryKey} from './nodeView';
import {useVueNodeViewCreator} from './nodeView/useVueNodeViewCreator';
import {pluginViewFactoryKey} from './pluginView';
import {useVuePluginViewCreator} from './pluginView/useVuePluginViewCreator';
import {useVueRenderer} from './VueRenderer';
import {useVueWidgetViewCreator} from './widgetView/useVueWidgetViewCreator';
import {widgetViewFactoryKey} from './widgetView/widgetViewContext';

/** Factory type returned by `useVueNodeViewCreator`. */
export type CreateVueNodeView = ReturnType<typeof useVueNodeViewCreator>
/** Factory type returned by `useVueMarkViewCreator`. */
export type CreateVueMarkView = ReturnType<typeof useVueMarkViewCreator>
/** Factory type returned by `useVuePluginViewCreator`. */
export type CreateVuePluginView = ReturnType<typeof useVuePluginViewCreator>
/** Factory type returned by `useVueWidgetViewCreator`. */
export type CreateVueWidgetView = ReturnType<typeof useVueWidgetViewCreator>

/**
 * Provider component that wires up the Vue ProseMirror adapter.
 *
 * Wrap the component containing your ProseMirror editor with this provider so
 * that the `useNodeViewFactory`, `useMarkViewFactory`, `usePluginViewFactory`,
 * and `useWidgetViewFactory` composables can resolve their factories via
 * Vue's `inject`.
 */

export const ProsemirrorAdapterProvider = defineComponent({

    name: 'ProsemirrorAdapterProvider',

    setup: (_, {slots}) => {
        const {portals, renderVueRenderer, removeVueRenderer} = useVueRenderer();

        const createVueNodeView: CreateVueNodeView = useVueNodeViewCreator(renderVueRenderer, removeVueRenderer);
        const createVueMarkView: CreateVueMarkView = useVueMarkViewCreator(renderVueRenderer, removeVueRenderer);
        const createVuePluginView: CreateVuePluginView = useVuePluginViewCreator(renderVueRenderer, removeVueRenderer);
        const createVueWidgetView: CreateVueWidgetView = useVueWidgetViewCreator(renderVueRenderer, removeVueRenderer);

        provide(nodeViewFactoryKey, createVueNodeView);
        provide(markViewFactoryKey, createVueMarkView);
        provide(pluginViewFactoryKey, createVuePluginView);
        provide(widgetViewFactoryKey, createVueWidgetView);

        return () => {
            return h(Fragment, null, [slots.default?.(), Object.values(portals.value).map((x) => h(x))]);
        };
    },
});
