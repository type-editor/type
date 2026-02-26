import type {Transaction} from '@type-editor/state';

import {searchPluginKey} from './search-plugin-key';
import type {SearchQuery} from './SearchQuery';
import type {DocumentRange} from './types/DocumentRange';


/**
 * Add metadata to a transaction that updates the active search query
 * and searched range, when dispatched.
 *
 * @param transaction - The transaction to add metadata to
 * @param query - The new search query to set
 * @param range - Optional range to limit search scope, or null to search the entire document
 * @returns The transaction with the search metadata added
 */
export function setSearchState(transaction: Transaction,
                               query: SearchQuery,
                               range: DocumentRange | null = null): Transaction {
    return transaction.setMeta(searchPluginKey, {query, range});
}
