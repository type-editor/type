import {CoreWidgetView} from '@type-editor/adapter-core';
import {nanoid} from 'nanoid';
import type {ReactPortal} from 'react';
import {createPortal} from 'react-dom';

import type {ReactRenderer} from '../ReactRenderer';
import type {ReactWidgetViewComponent} from './ReactWidgetViewOptions';
import type {WidgetViewContext} from './widgetViewContext';
import {widgetViewContext} from './widgetViewContext';

/**
 * React-specific widget view that bridges a {@link CoreWidgetView} with the
 * React rendering pipeline.  Renders the user component inside a React portal
 * and provides widget context via React context.
 */
export class ReactWidgetView extends CoreWidgetView<ReactWidgetViewComponent> implements ReactRenderer<WidgetViewContext> {

    private readonly _key: string = nanoid();
    private readonly _context: WidgetViewContext;

    constructor(...args: ConstructorParameters<typeof CoreWidgetView<ReactWidgetViewComponent>>) {
        super(...args);

        this._context = {
            view: this.view,
            getPos: this.getPos,
            spec: this.spec,
        };
    }

    /** Returns the stable context object shared with the React component tree. */
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

    /** Creates a React portal that renders the user component into the widget's DOM element. */
    public render(): ReactPortal {
        const UserComponent: ReactWidgetViewComponent = this.component;

        return createPortal(
            <widgetViewContext.Provider value={this._context}>
                <UserComponent/>
            </widgetViewContext.Provider>,
            this.dom,
            this._key,
        );
    }
}
