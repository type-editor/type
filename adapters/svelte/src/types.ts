import type {Component} from 'svelte';

/** A generic record type used for component props. */
export type AnyRecord = Record<string, any>

export type SvelteComponentConstructor<T extends AnyRecord = any> = Component<T>

/**
 * Options passed to a renderer's `render` method.
 *
 * @internal
 */
export interface SvelteRenderOptions {
    /**
     * The full context map from the closest parent Svelte component,
     * as returned by `getAllContexts` from `svelte`.
     */
    context: Map<unknown, unknown>
}
