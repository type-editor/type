import {CoreNodeView} from '@type-editor/adapter-core';
import {nanoid} from 'nanoid';
import {defineComponent, h, markRaw, provide, shallowRef, Teleport} from 'vue';

import type {VueRenderer, VueRendererComponent} from '../VueRenderer';
import type {NodeViewContext} from './nodeViewContext';
import {nodeViewContext} from './nodeViewContext';
import type {VueNodeViewComponent} from './VueNodeViewOptions';

/**
 * Vue-specific node view that bridges a {@link CoreNodeView} with the Vue
 * rendering pipeline.  Provides reactive context to descendant components via
 * Vue's `provide`/`inject` mechanism.
 */
export class VueNodeView extends CoreNodeView<VueNodeViewComponent> implements VueRenderer<NodeViewContext> {

    private readonly _key: string = nanoid();
    private readonly _context: NodeViewContext;

    constructor(...args: ConstructorParameters<typeof CoreNodeView<VueNodeViewComponent>>) {
        super(...args);

        this._context = {
            contentRef: (element): void => {
                if (element && element instanceof HTMLElement && this.contentDOM && element.firstChild !== this.contentDOM) {
                    element.appendChild(this.contentDOM);
                }
            },
            dom: this.dom,
            view: this.view,
            getPos: this.getPos,
            setAttrs: this.setAttrs,
            node: shallowRef(this.node),
            selected: shallowRef(this.selected),
            decorations: shallowRef(this.decorations),
            innerDecorations: shallowRef(this.innerDecorations),
        };
    }

    get context(): NodeViewContext {
        return this._context;
    }

    get key(): string {
        return this._key;
    }

    public updateContext(): void {
        Object.entries({
            node: this.node,
            selected: this.selected,
            decorations: this.decorations,
            innerDecorations: this.innerDecorations,
        }).forEach(([key, value]): void => {
            const prev = this.context[key as 'node' | 'selected' | 'decorations' | 'innerDecorations'];
            if (prev.value !== value) {
                prev.value = value;
            }
        });
    };

    public render(): VueRendererComponent {
        const UserComponent: VueNodeViewComponent = this.component;

        return markRaw(
            defineComponent({
                name: 'ProsemirrorNodeView',
                setup: () => {
                    provide(nodeViewContext, this.context);
                    return () => h(Teleport, {key: this._key, to: this.dom}, [h(UserComponent)]);
                },
            }),
        ) as VueRendererComponent;
    };
}
