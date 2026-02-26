// see: https://github.com/marijnh/orderedmap

/**
 * Persistent data structure representing an ordered mapping from
 * strings to values, with some convenient update methods.
 */
export class OrderedMap<T> {

    /**
     * Internal storage: [key1, value1, key2, value2, ...]
     * @internal
     */
    private readonly content: ReadonlyArray<string | T>;

    /**
     * Create a new OrderedMap with the given content array.
     * @param content - Array of alternating keys and values [key1, value1, key2, value2, ...]
     */
    constructor(content: Array<string | T>) {
        this.content = content;
    }

    get type(): string {
        return 'OrderedMap';
    }

    /**
     * The amount of keys in this map.
     */
    get size(): number {
        return this.content.length >> 1;
    }

    /**
     * Return a map with the given content. If null, create an empty
     * map. If given an ordered map, return that map itself. If given an
     * object, create a map from the object's properties.
     * @param value - The value to create a map from
     * @returns An OrderedMap
     */
    public static from<T>(value: OrderedMap<T> | Record<string, T> | null | undefined): OrderedMap<T> {
        if (value instanceof OrderedMap) {
            return value;
        }

        // If instanceof fails due to multiple instances
        if (OrderedMap.isOrderedMap(value)) {
            return value as OrderedMap<T>;
        }

        const content: Array<string | T> = [];
        if (value) {
            for (const prop in value) {
                content.push(prop, value[prop]);
            }
        }
        return new OrderedMap(content);
    }

    /**
     * Check if a value is an OrderedMap-like object using duck typing.
     * This handles cases where multiple instances of the OrderedMap class
     * exist due to bundling, making instanceof unreliable.
     * @param value - The value to check
     * @returns True if the value is an OrderedMap-like object
     */
    private static isOrderedMap<T>(value: unknown): value is OrderedMap<T> {
        if (!value || typeof value !== 'object') {
            return false;
        }

        const obj = value as Record<string, unknown>;
        return obj.type === 'OrderedMap';
    }

    /**
     * Find the index of a key in the content array.
     * @param key - The key to find
     * @returns The index of the key, or -1 if not found
     * @internal
     */
    public find(key: string): number {
        for (let i = 0; i < this.content.length; i += 2) {
            if (this.content[i] === key) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Retrieve the value stored under `key`, or return undefined when
     * no such key exists.
     * @param key - The key to retrieve
     * @returns The value associated with the key, or undefined
     */
    public get(key: string): T | undefined {
        const found: number = this.find(key);
        return found === -1 ? undefined : (this.content[found + 1] as T);
    }

    /**
     * Create a new map by replacing the value of `key` with a new
     * value, or adding a binding to the end of the map. If `newKey` is
     * given, the key of the binding will be replaced with that key.
     * @param key - The key to update
     * @param value - The new value
     * @param newKey - Optional new key name
     * @returns A new OrderedMap with the update applied
     */
    public update(key: string, value: T, newKey?: string): OrderedMap<T> {
        const self: OrderedMap<T> = newKey && newKey !== key ? this.remove(newKey) : this;
        const found: number = self.find(key);
        const content: Array<string | T> = self.content.slice();
        if (found === -1) {
            content.push(newKey || key, value);
        } else {
            content[found + 1] = value;
            if (newKey) {
                content[found] = newKey;
            }
        }
        return new OrderedMap<T>(content);
    }

    /**
     * Return a map with the given key removed, if it existed.
     * @param key - The key to remove
     * @returns A new OrderedMap with the key removed
     */
    public remove(key: string): OrderedMap<T> {
        const found: number = this.find(key);
        if (found === -1) {
            return this;
        }

        const content: Array<string | T> = this.content.slice();
        content.splice(found, 2);
        return new OrderedMap<T>(content);
    }

    /**
     * Add a new key to the start of the map.
     * @param key - The key to add
     * @param value - The value to add
     * @returns A new OrderedMap with the key added at the start
     */
    public addToStart(key: string, value: T): OrderedMap<T> {
        return new OrderedMap<T>([key, value, ...this.remove(key).content]);
    }

    /**
     * Add a new key to the end of the map.
     * @param key - The key to add
     * @param value - The value to add
     * @returns A new OrderedMap with the key added at the end
     */
    public addToEnd(key: string, value: T): OrderedMap<T> {
        const content: Array<string | T> = this.remove(key).content.slice();
        content.push(key, value);
        return new OrderedMap<T>(content);
    }

    /**
     * Add the given key/value before `place`. If `place` is not found,
     * the new key is added to the end.
     * @param place - The key to add before
     * @param key - The key to add
     * @param value - The value to add
     * @returns A new OrderedMap with the key added before the place key
     */
    public addBefore(place: string, key: string, value: T): OrderedMap<T> {
        const without: OrderedMap<T> = this.remove(key);
        const content: Array<string | T> = without.content.slice();
        const found: number = without.find(place);
        content.splice(found === -1 ? content.length : found, 0, key, value);
        return new OrderedMap<T>(content);
    }

    /**
     * Call the given function for each key/value pair in the map, in
     * order.
     * @param f - Function to call for each key/value pair
     */
    public forEach(f: (key: string, value: T) => void): void {
        for (let i = 0; i < this.content.length; i += 2) {
            f(this.content[i] as string, this.content[i + 1] as T);
        }
    }

    /**
     * Create a new map by prepending the keys in this map that don't
     * appear in `map` before the keys in `map`.
     * @param map - The map to prepend, or an object
     * @returns A new OrderedMap with the prepended keys
     */
    public prepend(map: OrderedMap<T> | Record<string, T> | null | undefined): OrderedMap<T> {
        const mapObj: OrderedMap<T> = OrderedMap.from<T>(map);
        if (!mapObj.size) {
            return this;
        }
        return new OrderedMap<T>(mapObj.content.concat(this.subtract(mapObj).content));
    }

    /**
     * Create a new map by appending the keys in this map that don't
     * appear in `map` after the keys in `map`.
     * @param map - The map to append, or an object
     * @returns A new OrderedMap with the appended keys
     */
    public append(map: OrderedMap<T> | Record<string, T> | null | undefined): OrderedMap<T> {
        const mapObj: OrderedMap<T> = OrderedMap.from<T>(map);
        if (!mapObj.size) {
            return this;
        }
        return new OrderedMap<T>(this.subtract(mapObj).content.concat(mapObj.content));
    }

    /**
     * Create a map containing all the keys in this map that don't
     * appear in `map`.
     * @param map - The map to subtract, or an object
     * @returns A new OrderedMap with the subtracted keys
     */
    public subtract(map: OrderedMap<T> | Record<string, T> | null | undefined): OrderedMap<T> {
        const mapObj: OrderedMap<T> = OrderedMap.from<T>(map);
        if (!mapObj.size) {
            return this;
        }

        const content: Array<string | T> = [];
        for (let i = 0; i < this.content.length; i += 2) {
            if (mapObj.find(this.content[i] as string) === -1) {
                content.push(this.content[i], this.content[i + 1]);
            }
        }

        return new OrderedMap<T>(content);
    }

    /**
     * Turn ordered map into a plain object.
     * @returns A plain object representation of the map
     */
    public toObject(): Record<string, T> {
        const result: Record<string, T> = {};
        this.forEach((key, value) => {
            result[key] = value;
        });
        return result;
    }
}
