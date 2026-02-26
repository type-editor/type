import type {PmNode} from '@type-editor/model';

import type {TableMapCache} from '../types/tablemap/TableMapCache';
import type {TableMap} from './TableMap';


/**
 * The table map cache instance.
 * Uses WeakMap when available, falls back to a fixed-size array cache.
 */
export const StandardTableMapCache: TableMapCache = typeof WeakMap !== 'undefined' ? createWeakMapCache() : createArrayCache();


/**
 * Creates a WeakMap-based cache for TableMap instances.
 * This is the preferred implementation as it allows garbage collection
 * of table nodes that are no longer referenced.
 *
 * @returns A cache implementation using WeakMap
 */
function createWeakMapCache(): TableMapCache {
    const cache = new WeakMap<PmNode, TableMap>();

    return {
        get: (key: PmNode): TableMap | undefined => cache.get(key),
        set: (key: PmNode, value: TableMap): TableMap => {
            cache.set(key, value);
            return value;
        },
    };
}

/**
 * Creates a fixed-size LRU-like cache for TableMap instances.
 * Used as fallback when WeakMap is not available.
 *
 * @param maxSize - Maximum number of entries to cache (default: 10)
 * @returns A cache implementation using a circular array
 */
function createArrayCache(maxSize = 10): TableMapCache {
    const cache: Array<PmNode | TableMap> = [];
    let position = 0;

    return {
        get: (key: PmNode): TableMap | undefined => {
            for (let i = 0; i < cache.length; i += 2) {
                if (cache[i] === key) {
                    return cache[i + 1] as TableMap;
                }
            }
            return undefined;
        },
        set: (key: PmNode, value: TableMap): TableMap => {
            if (position >= maxSize * 2) {
                position = 0;
            }
            cache[position++] = key;
            cache[position++] = value;
            return value;
        },
    };
}
