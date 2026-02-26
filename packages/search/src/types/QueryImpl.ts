import type { PmEditorState } from '@type-editor/editor-types';

import type { SearchResult } from './SearchResult';

/**
 * Internal interface for query implementation strategies.
 * Different implementations handle string search vs. regex search.
 */
export interface QueryImpl {
    /**
     * Finds the next occurrence of the query in the document.
     *
     * @param state - The editor state to search in
     * @param from - The position to start searching from
     * @param to - The position to search up to
     * @returns The search result if found, or `null` if no match exists
     */
    findNext(state: PmEditorState, from: number, to: number): SearchResult | null;

    /**
     * Finds the previous occurrence of the query in the document.
     *
     * @param state - The editor state to search in
     * @param from - The position to start searching from
     * @param to - The position to search back to
     * @returns The search result if found, or `null` if no match exists
     */
    findPrev(state: PmEditorState, from: number, to: number): SearchResult | null;
}
