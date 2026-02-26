import {CorePluginView} from '@type-editor/adapter-core';
import {nanoid} from 'nanoid';
import {writable} from 'svelte/store';

import {createContextMap} from '../context';
import {mount} from '../mount';
import type {SvelteRenderer} from '../SvelteRenderer';
import type {SvelteRenderOptions} from '../types';
import type {PluginViewContext} from './pluginViewContext';
import type {SveltePluginViewComponent} from './SveltePluginViewOptions';

/**
 * Svelte-specific plugin view that bridges a {@link CorePluginView} with the
 * Svelte rendering pipeline.  Provides reactive context (editor view and
 * previous state) to descendant components via Svelte's writable stores.
 */
export class SveltePluginView extends CorePluginView<SveltePluginViewComponent> implements SvelteRenderer<PluginViewContext> {

    private readonly _key: string = nanoid();
    private readonly _context: PluginViewContext;

    constructor(...args: ConstructorParameters<typeof CorePluginView<SveltePluginViewComponent>>) {
        super(...args);

        this._context = {
            view: writable(this.view),
            prevState: writable(this.prevState),
        };
    }

    get key(): string {
        return this._key;
    }

    /** Returns the stable context object shared with descendant components. */
    get context(): PluginViewContext {
        return this._context;
    }

    /** Pushes the current view and previous state into the writable stores. */
    public updateContext(): void {
        this._context.view.set(this.view);
        this._context.prevState.set(this.prevState);
    }

    /**
     * Mounts the user component into the plugin's root element using the
     * Svelte mount helper.
     *
     * @param options - Render options containing the parent context map.
     * @returns A function that unmounts the component.
     */
    public render(options: SvelteRenderOptions): VoidFunction {
        const UserComponent: SveltePluginViewComponent = this.component;

        const context: Map<unknown, unknown> = createContextMap(options.context, this._context);

        return mount(UserComponent, {
            target: this.root,
            context,
        });
    }
}
