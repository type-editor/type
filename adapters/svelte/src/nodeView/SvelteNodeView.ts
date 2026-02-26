import {CoreNodeView} from '@type-editor/adapter-core';
import {nanoid} from 'nanoid';
import {writable} from 'svelte/store';

import {createContextMap} from '../context';
import {mount} from '../mount';
import type {SvelteRenderer} from '../SvelteRenderer';
import type {SvelteRenderOptions} from '../types';
import type {NodeViewContext} from './nodeViewContext';
import type {SvelteNodeViewComponent} from './SvelteNodeViewOptions';

/**
 * Svelte-specific node view that bridges a {@link CoreNodeView} with the
 * Svelte rendering pipeline.  Provides reactive context to descendant
 * components via Svelte's `context` mechanism and writable stores.
 */
export class SvelteNodeView extends CoreNodeView<SvelteNodeViewComponent> implements SvelteRenderer<NodeViewContext> {
    private readonly _key: string = nanoid();
    private readonly _context: NodeViewContext;

    constructor(...args: ConstructorParameters<typeof CoreNodeView<SvelteNodeViewComponent>>) {
        super(...args);

        this._context = {
            contentRef: (element: HTMLElement): void => {
                if (element && element instanceof HTMLElement && this.contentDOM && element.firstChild !== this.contentDOM) {
                    element.appendChild(this.contentDOM);
                }
            },
            dom: this.dom,
            view: this.view,
            getPos: this.getPos,
            setAttrs: this.setAttrs,
            node: writable(this.node),
            selected: writable(this.selected),
            decorations: writable(this.decorations),
            innerDecorations: writable(this.innerDecorations),
        };
    }

    get context(): NodeViewContext {
        return this._context;
    }

    get key(): string {
        return this._key;
    }

    public updateContext(): void {
        this._context.node.set(this.node);
        this._context.selected.set(this.selected);
        this._context.decorations.set(this.decorations);
        this._context.innerDecorations.set(this.innerDecorations);
    };

    public render(options: SvelteRenderOptions): VoidFunction {
        const UserComponent: SvelteNodeViewComponent = this.component;

        const context: Map<any, any> = createContextMap(options.context, this.context);

        return mount(UserComponent, {
            target: this.dom,
            context,
        });
    };
}
