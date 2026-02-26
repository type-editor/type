import { CoreNodeView } from '@type-editor/adapter-core';
import type { ReactPortal } from 'react';
import { createPortal } from 'react-dom';

import type { ReactRenderer } from '../ReactRenderer';
import type { NodeViewContext } from './nodeViewContext';
import { nodeViewContext } from './nodeViewContext';
import type { ReactNodeViewComponent } from './ReactNodeViewOptions';

/**
 * React-specific node view that bridges a {@link CoreNodeView} with the React
 * rendering pipeline.  Renders the user component inside a React portal and
 * provides editor context via React context.
 */
export class ReactNodeView extends CoreNodeView<ReactNodeViewComponent> implements ReactRenderer<NodeViewContext> {

    private readonly _context: NodeViewContext;

    constructor(...args: ConstructorParameters<typeof CoreNodeView<ReactNodeViewComponent>>) {
        super(...args);

        this._context = {
            contentRef: (element: HTMLElement): void => {
                if (element && this.contentDOM && element.firstChild !== this.contentDOM) {
                    element.appendChild(this.contentDOM);
                }
            },
            dom: this.dom,
            view: this.view,
            getPos: this.getPos,
            setAttrs: this.setAttrs,
            node: this.node,
            selected: this.selected,
            decorations: this.decorations,
            innerDecorations: this.innerDecorations,
        };
    }

    /** Returns the stable context object shared with the React component tree. */
    get context(): NodeViewContext {
        return this._context;
    }

    get key(): string {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.node.attrs.id;
    }

    /** Synchronises the stored context with the current node state. */
    public updateContext(): void {
        this._context.node = this.node;
        this._context.selected = this.selected;
        this._context.decorations = this.decorations;
        this._context.innerDecorations = this.innerDecorations;
    }

    /** Creates a React portal that renders the user component into the node's DOM element. */
    public render(): ReactPortal {
        const UserComponent: ReactNodeViewComponent = this.component;

        return createPortal(
            <nodeViewContext.Provider value={this._context}>
                <UserComponent/>
            </nodeViewContext.Provider>,
            this.dom,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            this.node.attrs.id,
        );
    }
}
