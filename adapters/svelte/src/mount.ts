import { flushSync, mount as svelteMount, unmount } from 'svelte'

import type {SvelteComponentConstructor} from './types';

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
export function mount(UserComponent: SvelteComponentConstructor,
                      options: MountOptions): () => Promise<void> {
    const component = svelteMount(UserComponent, {...options});
    flushSync();
    return (): Promise<void> => unmount(component);
}
