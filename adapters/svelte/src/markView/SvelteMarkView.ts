import {CoreMarkView} from '@type-editor/adapter-core';
import {nanoid} from 'nanoid';
import {writable} from 'svelte/store';

import {createContextMap} from '../context';
import {mount} from '../mount';
import type {SvelteRenderer} from '../SvelteRenderer';
import type {SvelteRenderOptions} from '../types';
import type {MarkViewContext} from './markViewContext';
import type {SvelteMarkViewComponent} from './SvelteMarkViewOptions';

/**
 * Svelte-specific mark view that bridges a {@link CoreMarkView} with the
 * Svelte rendering pipeline.  Provides reactive context to descendant
 * components via Svelte's `context` mechanism and writable stores.
 */
export class SvelteMarkView extends CoreMarkView<SvelteMarkViewComponent> implements SvelteRenderer<MarkViewContext> {

    private readonly _key: string = nanoid();
    private readonly _context: MarkViewContext;

    constructor(...args: ConstructorParameters<typeof CoreMarkView<SvelteMarkViewComponent>>) {
        super(...args);

        this._context = {
            contentRef: (element: HTMLElement): void => {
                if (element && element instanceof HTMLElement && this.contentDOM && element.firstChild !== this.contentDOM) {
                    element.appendChild(this.contentDOM);
                }
            },
            view: this.view,
            mark: writable(this.mark),
        };
    }

    get key(): string {
        return this._key;
    }

    /** Returns the stable context object shared with descendant components. */
    get context(): MarkViewContext {
        return this._context;
    }

    /** Pushes the current mark into the writable store so Svelte subscribers are notified. */
    public updateContext(): void {
        this._context.mark.set(this.mark);
    }

    /**
     * Mounts the user component into the mark's DOM element using the
     * Svelte mount helper.
     *
     * @param options - Render options containing the parent context map.
     * @returns A function that unmounts the component.
     */
    public render(options: SvelteRenderOptions): VoidFunction {
        const UserComponent: SvelteMarkViewComponent = this.component;

        const context: Map<unknown, unknown> = createContextMap(options.context, this._context);

        return mount(UserComponent, {
            target: this.dom,
            context,
        });
    }
}
