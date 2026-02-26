import {CorePluginView} from '@type-editor/adapter-core';
import {nanoid} from 'nanoid';
import {defineComponent, h, markRaw, provide, shallowRef, Teleport} from 'vue';

import type {VueRenderer, VueRendererComponent} from '../VueRenderer';
import type {PluginViewContext} from './pluginViewContext';
import {pluginViewContext} from './pluginViewContext';
import type {VuePluginViewComponent} from './VuePluginViewOptions';

/**
 * Vue-specific plugin view that bridges a {@link CorePluginView} with Vue's
 * rendering pipeline.  Provides reactive context (editor view and previous
 * state) to descendant components via Vue's `provide`/`inject` mechanism.
 */
export class VuePluginView extends CorePluginView<VuePluginViewComponent> implements VueRenderer<PluginViewContext> {

    private readonly _key: string = nanoid();
    private readonly _context: PluginViewContext;

    constructor(...args: ConstructorParameters<typeof CorePluginView<VuePluginViewComponent>>) {
        super(...args);

        this._context = {
            view: shallowRef(this.view),
            prevState: shallowRef(this.prevState),
        };
    }

    /** Returns the stable reactive context object shared with descendant components. */
    get context(): PluginViewContext {
        return this._context;
    }

    get key(): string {
        return this._key;
    }

    /**
     * Updates the reactive refs inside the stored context so that Vue picks up
     * the changes.  The editor view is shallow-cloned so that Vue's identity
     * check on the {@link shallowRef} detects the change.
     */
    public updateContext(): void {
        // Clone the view so Vue's shallowRef identity check triggers reactivity
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this._context.view.value = Object.assign(
            Object.create(Object.getPrototypeOf(this.view) as object | null),
            this.view,
        );
        this._context.prevState.value = this.prevState;
    }

    /** Creates a raw Vue component that teleports the user component into the plugin's root element. */
    public render(): VueRendererComponent {
        const UserComponent: VuePluginViewComponent = this.component;

        return markRaw(
            defineComponent({
                name: 'ProsemirrorPluginView',
                setup: () => {
                    provide(pluginViewContext, this._context);
                    return () => h(Teleport, {key: this._key, to: this.root}, [h(UserComponent)]);
                },
            }),
        ) as VueRendererComponent;
    }
}
