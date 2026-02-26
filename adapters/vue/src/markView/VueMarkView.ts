import {CoreMarkView} from '@type-editor/adapter-core';
import {nanoid} from 'nanoid';
import {defineComponent, h, markRaw, provide, shallowRef, Teleport} from 'vue';

import type {VueRenderer, VueRendererComponent} from '../VueRenderer';
import type {MarkViewContext} from './markViewContext';
import {markViewContext} from './markViewContext';
import type {VueMarkViewComponent} from './VueMarkViewOptions';

/**
 * Vue-specific mark view that bridges a {@link CoreMarkView} with the Vue
 * rendering pipeline.  Provides reactive context to descendant components via
 * Vue's `provide`/`inject` mechanism.
 */
export class VueMarkView extends CoreMarkView<VueMarkViewComponent> implements VueRenderer<MarkViewContext> {

    private readonly _key: string = nanoid();
    private readonly _context: MarkViewContext;

    constructor(...args: ConstructorParameters<typeof CoreMarkView<VueMarkViewComponent>>) {
        super(...args);

        this._context = {
            contentRef: (element): void => {
                if (element && element instanceof HTMLElement && this.contentDOM && element.firstChild !== this.contentDOM) {
                    element.appendChild(this.contentDOM);
                }
            },
            view: this.view,
            mark: shallowRef(this.mark),
        };
    }

    /** Returns the stable reactive context object shared with descendant components. */
    get context(): MarkViewContext {
        return this._context;
    }

    get key(): string {
        return this._key;
    }

    /** Updates the reactive refs inside the stored context so that Vue picks up the changes. */
    public updateContext(): void {
        const {mark} = this;
        if (this._context.mark.value !== mark) {
            this._context.mark.value = mark;
        }
    }

    /** Creates a raw Vue component that teleports the user component into the mark's DOM element. */
    public render(): VueRendererComponent {
        const UserComponent: VueMarkViewComponent = this.component;

        return markRaw(
            defineComponent({
                name: 'ProsemirrorMarkView',
                setup: () => {
                    provide(markViewContext, this._context);
                    return () => h(Teleport, {key: this._key, to: this.dom}, [h(UserComponent)]);
                },
            }),
        ) as VueRendererComponent;
    }
}
