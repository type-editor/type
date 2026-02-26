import type { PmEditorState } from '@type-editor/editor-types';
import type {PmNode} from '@type-editor/model';

import type {SearchQuery} from '../SearchQuery';
import type {QueryImpl} from '../types/QueryImpl';
import type {SearchResult} from '../types/SearchResult';
import {AbstractQueryImpl} from './AbstractQueryImpl';


/**
 * Query implementation for plain text string searches.
 * Handles case-sensitive and case-insensitive string matching.
 */
export class StringQuery extends AbstractQueryImpl implements QueryImpl {
    private readonly text: string;
    private readonly query: SearchQuery;

    /**
     * Creates a new string query implementation.
     *
     * @param query - The parent search query configuration
     */
    constructor(query: SearchQuery) {
        super();
        this.query = query;
        let text: string = query.unquote(query.search);

        if (!query.caseSensitive) {
            text = text.toLowerCase();
        }

        this.text = text;
    }

    /**
     * Finds the next occurrence of the search text in the document.
     *
     * @param state - The editor state to search in
     * @param from - The position to start searching from
     * @param to - The position to search up to
     * @returns The search result if found, or `null` if no match exists
     */
    public findNext(state: PmEditorState, from: number, to: number): SearchResult | null {
        return this.scanTextblocks(state.doc, from, to, (node: PmNode, start: number): SearchResult | null => {
            const searchStart: number = Math.max(from, start);
            const searchEnd: number = Math.min(node.content.size, to - start);
            const content: string = this.textContent(node).slice(searchStart - start, searchEnd);

            const searchableContent: string = this.query.caseSensitive
                ? content
                : content.toLowerCase();
            const index: number = searchableContent.indexOf(this.text);

            if (index < 0) {
                return null;
            }

            return {
                from: searchStart + index,
                to: searchStart + index + this.text.length,
                match: null,
                matchStart: start
            };
        });
    }

    /**
     * Finds the previous occurrence of the search text in the document.
     *
     * @param state - The editor state to search in
     * @param from - The position to start searching from
     * @param to - The position to search back to
     * @returns The search result if found, or `null` if no match exists
     */
    public findPrev(state: PmEditorState, from: number, to: number): SearchResult | null {
        return this.scanTextblocks(state.doc, from, to, (node: PmNode, start: number): SearchResult | null => {
            const searchStart: number = Math.max(start, to);
            const searchEnd: number = Math.min(node.content.size, from - start);
            let content: string = this.textContent(node).slice(searchStart - start, searchEnd);

            if (!this.query.caseSensitive) {
                content = content.toLowerCase();
            }

            const index: number = content.lastIndexOf(this.text);

            if (index < 0) {
                return null;
            }

            return {
                from: searchStart + index,
                to: searchStart + index + this.text.length,
                match: null,
                matchStart: start
            };
        });
    }
}
