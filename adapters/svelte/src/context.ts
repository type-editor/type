/**
 * Merges a parent Svelte context map with the adapter-specific context entries.
 *
 * Adapter entries are placed last so they take precedence in case of key
 * conflicts with the parent context.
 *
 * @param allContext - Context from parent Svelte components, retrieved by
 *   `getAllContexts()` from `svelte`.
 * @param adapterContext - Context entries required by the prosemirror-adapter
 *   view (e.g. node/mark/plugin/widget context properties).
 * @returns A new `Map` containing all merged entries.
 */
export function createContextMap(allContext: Map<unknown, unknown>,
                                 adapterContext: object): Map<unknown, unknown> {
  return new Map<unknown, unknown>([
    ...allContext.entries(),

    // Put it last so that it can override if there are key conflicts.
    ...Object.entries(adapterContext),
  ]);
}
