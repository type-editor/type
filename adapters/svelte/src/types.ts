import type {Component, ComponentConstructorOptions, SvelteComponent} from 'svelte';

/** A generic record type used for component props. */
export type AnyRecord = Record<string, any>

/** Svelte v4 class-based component constructor. */
export type SvelteV4ComponentConstructor<T extends AnyRecord = any> =
    new (options: ComponentConstructorOptions<T>) => SvelteComponent

/**
 * Union of Svelte v4 and v5 component types.
 *
 * In Svelte v4 components are classes; in v5 they are functions (`Component`).
 */
export type SvelteComponentConstructor<T extends AnyRecord = any> = SvelteV4ComponentConstructor<T> | Component<T>

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
