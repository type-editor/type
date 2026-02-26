import type {Writable} from 'svelte/store';
import {writable} from 'svelte/store';

import type {SvelteRenderOptions} from './types';

/**
 * A renderer entry managed by the Svelte adapter.
 *
 * Each view (node, mark, plugin, widget) implements this interface so the
 * provider can mount and unmount Svelte components at the right time.
 *
 * @typeParam Context - The shape of the context object shared with the
 *   rendered component tree.
 */
export interface SvelteRenderer<Context> {
    /** Unique key used to identify this renderer in the unmount map. */
    key: string
    /** The context object provided to the rendered component. */
    context: Context
    /**
     * Mounts the user component and returns an unmount function.
     *
     * @param options - Render options containing the parent context map.
     */
    render: (options: SvelteRenderOptions) => VoidFunction
    /** Synchronises the context object with the latest editor state. */
    updateContext: () => void
}

/** Return value of {@link useSvelteRenderer}. */
export interface SvelteRendererResult {
    /**
     * Mounts a renderer's component and stores its unmount function.
     *
     * @param renderer - The renderer to mount.
     * @param options - Render options containing the parent context map.
     */
    readonly renderSvelteRenderer: (renderer: SvelteRenderer<unknown>, options: SvelteRenderOptions) => void
    /**
     * Unmounts a renderer's component and removes it from the map.
     *
     * @param renderer - The renderer to unmount.
     */
    readonly removeSvelteRenderer: (renderer: SvelteRenderer<unknown>) => void
}

/**
 * Svelte helper that manages a map of unmount functions for the adapter's
 * views.
 *
 * @returns An object containing callbacks to mount/unmount renderers.
 */

export function useSvelteRenderer(): SvelteRendererResult {
    const unmounts: Writable<Record<string, VoidFunction>> = writable({});

    const renderSvelteRenderer = (
        renderer: SvelteRenderer<unknown>,
        options: SvelteRenderOptions): void => {

        unmounts.update((records) => ({
            ...records,
            [renderer.key]: renderer.render(options),
        }));
    };

    const removeSvelteRenderer = (renderer: SvelteRenderer<unknown>): void => {
        unmounts.update((records: Record<string, VoidFunction>) => {
            const {[renderer.key]: unmount, ...rest} = records;
            unmount?.();
            return rest;
        });
    };

    return {
        renderSvelteRenderer,
        removeSvelteRenderer,
    } as const;
}
