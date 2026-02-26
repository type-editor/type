import type {PmNode} from '@type-editor/model';

import type {TableMap} from '../../tablemap/TableMap';

/**
 * Cache interface for TableMap storage.
 * Provides read and write operations for caching computed table maps.
 */
export interface TableMapCache {
    /** Retrieves a cached TableMap for the given table node */
    get: (key: PmNode) => TableMap | undefined;
    /** Stores a TableMap in the cache and returns it */
    set: (key: PmNode, value: TableMap) => TableMap;
}
