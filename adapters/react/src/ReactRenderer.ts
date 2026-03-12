import { createElement, Fragment, type ReactElement, type ReactPortal, type RefObject } from 'react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

/**
 * A renderer entry managed by the React adapter.
 *
 * Each view (node, mark, plugin, widget) implements this interface so the
 * provider can maintain a portal map that React renders on every update.
 *
 * @typeParam Context - The shape of the context object shared with the
 *   rendered component tree.
 */
export interface ReactRenderer<Context> {
    /** Unique key used to identify this renderer's portal in the map. */
    key: string;
    /** The context object provided to the rendered component. */
    context: Context;
    /** Creates a React portal that renders the user component. */
    render: () => ReactPortal;
    /** Synchronises the context object with the latest editor state. */
    updateContext: () => void;
}

/** Return value of {@link useReactRenderer}. */
export interface ReactRendererResult {
    /** The current map of active React portals keyed by renderer key. */
    readonly render: () => Array<ReactElement>;
    /**
     * Registers or updates a renderer's portal.
     *
     * @param nodeView - The renderer to register.
     * @param update - Whether to call `updateContext` before rendering.
     *   Defaults to `true`.
     */
    readonly renderReactRenderer: (nodeView: ReactRenderer<unknown>, update?: boolean) => void;
    /**
     * Removes a renderer's portal.
     *
     * @param nodeView - The renderer to remove.
     */
    readonly removeReactRenderer: (nodeView: ReactRenderer<unknown>) => void;
}

type PortalState = [keys: Array<string>, nodes: Array<ReactElement>]

function updateRenderer(state: PortalState, renderer: ReactRenderer<unknown>): PortalState {
    const [keys, nodes] = state;
    const newKey = renderer.key;
    const newNode: ReactElement = createElement(Fragment, { key: newKey }, renderer.render());

    const index = keys.indexOf(newKey);
    if (index === -1) {
        return [
            [...keys, newKey],
            [...nodes, newNode],
        ];
    } else {
        const newNodes = [...nodes];
        newNodes[index] = newNode;
        return [keys, newNodes];
    }
}

function removeRenderer(state: PortalState, renderer: ReactRenderer<unknown>): PortalState {
    const [keys, nodes] = state;
    const index = keys.indexOf(renderer.key);
    if (index === -1) {return state;}
    const newKeys = [...keys];
    const newNodes = [...nodes];
    newKeys.splice(index, 1);
    newNodes.splice(index, 1);
    return [newKeys, newNodes];
}

/**
 * React hook that manages a map of React portals for the adapter's views.
 *
 * It wraps state updates in `flushSync` when the component is already mounted
 * so that ProseMirror's synchronous update cycle sees the DOM changes
 * immediately (e.g. for correct cursor positioning).
 *
 * @returns An object containing the portal map and callbacks to add/remove
 *   renderers.
 */
export function useReactRenderer(): ReactRendererResult {
    const [portalState, setPortalState] = useState<PortalState>([[], []]);
    const mountedRef: RefObject<boolean> = useRef(false);

    useLayoutEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const maybeFlushSync = useCallback((fn: () => void) => {
        if (mountedRef.current) {
            flushSync(fn);
        } else {
            fn();
        }
    }, []);

    const renderReactRenderer = useCallback(
        (nodeView: ReactRenderer<unknown>, update = true) => {
            maybeFlushSync(() => {
                if (update) {
                    nodeView.updateContext();
                }

                setPortalState((prev: PortalState): PortalState => updateRenderer(prev, nodeView));
            });
        },
        [maybeFlushSync],
    );

    const removeReactRenderer = useCallback(
        (nodeView: ReactRenderer<unknown>) => {
            maybeFlushSync(() => {
                setPortalState((prev: PortalState): PortalState => removeRenderer(prev, nodeView));
            });
        },
        [maybeFlushSync],
    );

    return {
        render: () => portalState[1],
        renderReactRenderer,
        removeReactRenderer,
    } as const;
}
