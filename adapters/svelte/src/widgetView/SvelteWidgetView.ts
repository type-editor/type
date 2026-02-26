import {CoreWidgetView} from '@type-editor/adapter-core';
import {nanoid} from 'nanoid';

import {createContextMap} from '../context';
import {mount} from '../mount';
import type {SvelteRenderer} from '../SvelteRenderer';
import type {SvelteRenderOptions} from '../types';
import type {SvelteWidgetViewComponent} from './SvelteWidgetViewOptions';
import type {WidgetViewContext} from './widgetViewContext';

/**
 * Svelte-specific widget view that bridges a {@link CoreWidgetView} with the
 * Svelte rendering pipeline.  Provides context to descendant components via
 * Svelte's context mechanism.
 */
export class SvelteWidgetView extends CoreWidgetView<SvelteWidgetViewComponent> implements SvelteRenderer<WidgetViewContext> {
    private readonly _key: string = nanoid();
    private readonly _context: WidgetViewContext;

    constructor(...args: ConstructorParameters<typeof CoreWidgetView<SvelteWidgetViewComponent>>) {
        super(...args);

        this._context = {
            view: this.view,
            getPos: this.getPos,
            spec: this.spec,
        };
    }

    get key(): string {
        return this._key;
    }

    /** Returns the stable context object shared with descendant components. */
    get context(): WidgetViewContext {
        return this._context;
    }

    /** Synchronises the stored context with the current widget state. */
    public updateContext(): void {
        this._context.view = this.view;
        this._context.getPos = this.getPos;
        this._context.spec = this.spec;
    }

    /**
     * Mounts the user component into the widget's DOM element using the
     * Svelte mount helper.
     *
     * @param options - Render options containing the parent context map.
     * @returns A function that unmounts the component.
     */
    public render(options: SvelteRenderOptions): VoidFunction {
        const UserComponent: SvelteWidgetViewComponent = this.component;

        const context: Map<unknown, unknown> = createContextMap(options.context, this._context);

        return mount(UserComponent, {
            target: this.dom,
            context,
        });
    }
}
