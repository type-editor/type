
export abstract class PluginBase {

    private static readonly KEYS = new Map<string, number>();

    /**
     * Creates a unique key by appending a counter to the given name.
     * Each call with the same name increments the counter.
     */
    protected createKey(name: string): string {
        const currentId: number = PluginBase.KEYS.get(name) ?? -1;
        const nextId: number = currentId + 1;
        PluginBase.KEYS.set(name, nextId);
        return `${name}$${nextId}`;
    }
}
