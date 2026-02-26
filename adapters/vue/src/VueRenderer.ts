import type {ComponentInternalInstance, DefineComponent, Ref} from 'vue';
import {getCurrentInstance, markRaw, onBeforeMount, onUnmounted, ref} from 'vue';

/** A Vue component type used as a renderable unit (any `DefineComponent`). */
export type VueRendererComponent = DefineComponent<any, any, any>

/**
 * A renderer entry managed by the Vue adapter.
 *
 * Each view (node, mark, plugin, widget) implements this interface so the
 * provider can maintain a component map that Vue renders on every update.
 *
 * @typeParam Context - The shape of the context object shared with the
 *   rendered component tree.
 */
export interface VueRenderer<Context> {
    /** Unique key used to identify this renderer in the portal map. */
    key: string
    /** The context object provided to the rendered component. */
    context: Context
    /** Creates a Vue component that renders the user component via Teleport. */
    render: () => VueRendererComponent
    /** Synchronises the context object with the latest editor state. */
    updateContext: () => void
}

/** Return value of {@link useVueRenderer}. */
export interface VueRendererResult {
    /** Reactive map of active Vue renderer components keyed by renderer key. */
    readonly portals: Ref<Record<string, VueRendererComponent>>
    /**
     * Registers or updates a renderer in the portal map.
     *
     * @param renderer - The renderer to register.
     */
    readonly renderVueRenderer: (renderer: VueRenderer<unknown>) => void
    /**
     * Removes a renderer from the portal map.
     *
     * @param renderer - The renderer to remove.
     */
    readonly removeVueRenderer: (renderer: VueRenderer<unknown>) => void
}

/**
 * Vue composable that manages a map of Vue renderer components for the
 * adapter's views.
 *
 * It forces a component update after registering a renderer so that
 * ProseMirror's synchronous update cycle sees the DOM changes immediately
 * (e.g. for correct cursor positioning).
 *
 * @returns An object containing the portal map and callbacks to add/remove
 *   renderers.
 */

export function useVueRenderer(): VueRendererResult {
    const portals = ref<Record<string, VueRendererComponent>>({});
    const instance: ComponentInternalInstance = getCurrentInstance();
    const update = markRaw<{ updater?: () => void }>({});

    onBeforeMount((): void => {
        update.updater = (): void => {
            instance?.update();
        };
    });

    onUnmounted((): void => {
        update.updater = undefined;
    });

    function renderVueRenderer(renderer: VueRenderer<unknown>): void {
        portals.value[renderer.key] = renderer.render();

        // Force update the vue component to render
        // Cursor won't move to new node without this
        update.updater?.();
    }

    function removeVueRenderer(renderer: VueRenderer<unknown>): void {
        delete portals.value[renderer.key];
    }

    return {
        portals,
        renderVueRenderer,
        removeVueRenderer,
    } as const;
}
