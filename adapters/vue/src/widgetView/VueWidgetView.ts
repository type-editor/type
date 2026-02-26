import {CoreWidgetView} from '@type-editor/adapter-core';
import {nanoid} from 'nanoid';
import {defineComponent, h, markRaw, provide, Teleport} from 'vue';

import type {VueRenderer, VueRendererComponent} from '../VueRenderer';
import type {VueWidgetViewComponent} from './VueWidgetViewOptions';
import type {WidgetViewContext} from './widgetViewContext';
import {widgetViewContext} from './widgetViewContext';

/**
 * Vue-specific widget view that bridges a {@link CoreWidgetView} with the Vue
 * rendering pipeline.  Provides context to descendant components via Vue's
 * `provide`/`inject` mechanism.
 */
export class VueWidgetView extends CoreWidgetView<VueWidgetViewComponent> implements VueRenderer<WidgetViewContext> {

    private readonly _key: string = nanoid();
    private readonly _context: WidgetViewContext;

    constructor(...args: ConstructorParameters<typeof CoreWidgetView<VueWidgetViewComponent>>) {
        super(...args);

        this._context = {
            view: this.view,
            getPos: this.getPos,
            spec: this.spec,
        };
    }

    /** Returns the stable context object shared with descendant components. */
    get context(): WidgetViewContext {
        return this._context;
    }

    get key(): string {
        return this._key;
    }

    /** Synchronises the stored context with the current widget state. */
    public updateContext(): void {
        this._context.view = this.view;
        this._context.getPos = this.getPos;
        this._context.spec = this.spec;
    }

    /** Creates a raw Vue component that teleports the user component into the widget's DOM element. */
    public render(): VueRendererComponent {
        const UserComponent: VueWidgetViewComponent = this.component;

        return markRaw(
            defineComponent({
                name: 'ProsemirrorWidgetView',
                setup: () => {
                    provide(widgetViewContext, this._context);
                    return () => h(Teleport, {key: this._key, to: this.dom}, [h(UserComponent)]);
                },
            }),
        ) as VueRendererComponent;
    }
}
