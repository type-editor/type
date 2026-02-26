import {CorePluginView} from '@type-editor/adapter-core';
import {nanoid} from 'nanoid';
import type {ReactPortal} from 'react';
import {createPortal} from 'react-dom';

import type {ReactRenderer} from '../ReactRenderer';
import type {PluginViewContext} from './pluginViewContext';
import {pluginViewContext} from './pluginViewContext';
import type {ReactPluginViewComponent} from './ReactPluginViewOptions';

/**
 * React-specific plugin view that bridges a {@link CorePluginView} with the
 * React rendering pipeline.  Renders the user component inside a React portal
 * and provides editor context via React context.
 */
export class ReactPluginView extends CorePluginView<ReactPluginViewComponent> implements ReactRenderer<PluginViewContext> {

    private readonly _key: string = nanoid();
    private readonly _context: PluginViewContext;

    constructor(...args: ConstructorParameters<typeof CorePluginView<ReactPluginViewComponent>>) {
        super(...args);

        this._context = {
            view: this.view,
            prevState: this.prevState,
        };
    }

    /** Returns the stable context object shared with the React component tree. */
    get context(): PluginViewContext {
        return this._context;
    }

    get key(): string {
        return this._key;
    }

    /** Synchronises the stored context with the current plugin view state. */
    public updateContext(): void {
        this._context.view = this.view;
        this._context.prevState = this.prevState;
    }

    /** Creates a React portal that renders the user component into the plugin's root element. */
    public render(): ReactPortal {
        const UserComponent: ReactPluginViewComponent = this.component;

        return createPortal(
            <pluginViewContext.Provider value={this._context}>
                <UserComponent/>
            </pluginViewContext.Provider>,
            this.root,
            this._key,
        );
    }
}
