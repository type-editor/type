import type { PmEditorState } from '@type-editor/editor-types';
import type {PmNode} from '@type-editor/model';

import type {SearchQuery} from '../SearchQuery';
import type {QueryImpl} from '../types/QueryImpl';
import type {SearchResult} from '../types/SearchResult';
import {AbstractQueryImpl} from './AbstractQueryImpl';
import {regexFlags} from './regex-flags';

/**
 * Query implementation for regular expression searches.
 * Handles pattern matching with capture groups.
 */
export class RegExpQuery extends AbstractQueryImpl implements QueryImpl {


    
    private readonly regexp: RegExp;

    /**
     * Creates a new regular expression query implementation.
     *
     * @param query - The parent search query configuration
     */
    constructor(query: SearchQuery) {
        super();
        const flags: string = regexFlags + (query.caseSensitive ? '' : 'i');
        this.regexp = new RegExp(query.search, flags);
    }

    /**
     * Finds the next occurrence matching the regular expression in the document.
     *
     * @param state - The editor state to search in
     * @param from - The position to start searching from
     * @param to - The position to search up to
     * @returns The search result with match details if found, or `null` if no match exists
     */
    public findNext(state: PmEditorState, from: number, to: number): SearchResult | null {
        return this.scanTextblocks(state.doc, from, to, (node: PmNode, start: number): SearchResult | null => {
            const contentEnd: number = Math.min(node.content.size, to - start);

            // Early exit if the search range is invalid
            if (contentEnd <= 0) {
                return null;
            }

            const content: string = this.textContent(node).slice(0, contentEnd);

            // Set the starting position for the regex search
            this.regexp.lastIndex = Math.max(0, from - start);
            const match: RegExpExecArray | null = this.regexp.exec(content);

            if (match) {
                return {
                    from: start + match.index,
                    to: start + match.index + match[0].length,
                    match,
                    matchStart: start
                };
            }

            return null;
        });
    }

    /**
     * Finds the previous occurrence matching the regular expression in the document.
     * Since regex doesn't support backward search, this iterates forward to find the last match.
     *
     * @param state - The editor state to search in
     * @param from - The position to start searching from
     * @param to - The position to search back to
     * @returns The search result with match details if found, or `null` if no match exists
     */
    public findPrev(state: PmEditorState, from: number, to: number): SearchResult | null {
        return this.scanTextblocks(state.doc, from, to, (node: PmNode, start: number): SearchResult | null => {
            const contentEnd: number = Math.min(node.content.size, from - start);

            // Early exit if the search range is invalid
            if (contentEnd <= 0) {
                return null;
            }

            const content: string = this.textContent(node).slice(0, contentEnd);
            let lastMatch: RegExpExecArray | null = null;

            // Find the last match by iterating through all matches
            // Reset lastIndex to ensure consistent behavior
            this.regexp.lastIndex = 0;

            for (let offset = 0; ;) {
                this.regexp.lastIndex = offset;
                const currentMatch: RegExpExecArray | null = this.regexp.exec(content);

                if (!currentMatch) {
                    break;
                }

                // Only consider matches that end before the 'to' position
                if (start + currentMatch.index + currentMatch[0].length <= from) {
                    lastMatch = currentMatch;
                }

                offset = currentMatch.index + 1;
            }

            if (lastMatch) {
                return {
                    from: start + lastMatch.index,
                    to: start + lastMatch.index + lastMatch[0].length,
                    match: lastMatch,
                    matchStart: start
                };
            }

            return null;
        });
    }
}
