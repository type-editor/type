import type { PmEditorState, PmPlugin } from '@type-editor/editor-types';


let cachedPreserveItems = false;
let cachedPreserveItemsPlugins: ReadonlyArray<PmPlugin> | null = null;

/**
 * Checks whether any plugin requires history items to be preserved for rebasing.
 *
 * When a plugin has the `historyPreserveItems` property in its spec (typically
 * for collaboration support), history steps must be preserved exactly as they
 * came in to allow for proper rebasing of concurrent changes.
 *
 * @param state - The editor state containing the plugins to check
 * @returns True if any plugin requires preserving history items, false otherwise
 */
export function mustPreserveItems(state: PmEditorState): boolean {
    const plugins: ReadonlyArray<PmPlugin> = state.plugins;
    if (cachedPreserveItemsPlugins !== plugins) {
        cachedPreserveItems = false;
        cachedPreserveItemsPlugins = plugins;

        for (const plugin of plugins) {
            if ((plugin.spec as { historyPreserveItems?: boolean }).historyPreserveItems) {
                cachedPreserveItems = true;
                break;
            }
        }
    }
    return cachedPreserveItems;
}
