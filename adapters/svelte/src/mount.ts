import type {SvelteComponentConstructor, SvelteV4ComponentConstructor} from './types';

import * as svelte from 'svelte';

/** Whether the current Svelte runtime is v5 (has `mount` and `flushSync`). */
const isSvelte5 = !!svelte.mount && !!svelte.flushSync;

/** Options accepted by both Svelte v4 and v5 mount functions. */
interface MountOptions {
    /** The DOM element to mount the component into. */
    target: HTMLElement
    /** The Svelte context map to provide to the component tree. */
    context: Map<unknown, unknown>
}

/**
 * Mounts a Svelte v5 component using `svelte.mount`.
 *
 * Calls `flushSync` after mounting so that `onMount` callbacks and action
 * functions run synchronously (unlike the default v5 behaviour).
 *
 * @param UserComponent - The Svelte component constructor/function.
 * @param options - Mount options (target element and context map).
 * @returns An async function that unmounts the component.
 */
function mountComponentV5(UserComponent: SvelteComponentConstructor,
                          options: MountOptions): () => Promise<void> {
    const component = svelte.mount(UserComponent, {...options}) as svelte.SvelteComponent;
    svelte.flushSync();
    return (): Promise<void> => svelte.unmount(component);
}

/**
 * Mounts a Svelte v4 component using the class constructor.
 *
 * @param UserComponent - The Svelte component constructor.
 * @param options - Mount options (target element and context map).
 * @returns A function that destroys the component.
 */
function mountComponentV4(UserComponent: SvelteComponentConstructor, options: MountOptions): VoidFunction {
    const component = new (UserComponent as SvelteV4ComponentConstructor)(options);
    return (): void => {
        component.$destroy();
    };
}

/**
 * Mounts a Svelte component to a DOM element.
 *
 * Automatically selects the appropriate strategy (v4 class instantiation or
 * v5 `mount` API) based on the runtime Svelte version.
 *
 * @returns A function that unmounts / destroys the component.
 */
export const mount = isSvelte5 ? mountComponentV5 : mountComponentV4;
