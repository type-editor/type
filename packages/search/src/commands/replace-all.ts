import type { Command, DispatchFunction, PmEditorState, PmTransaction } from '@type-editor/editor-types';

import {searchPluginKey} from '../search-plugin-key';
import type {SearchQuery} from '../SearchQuery';
import type {SearchState} from '../SearchState';
import type {DocumentRange} from '../types/DocumentRange';
import type {ReplacementRange} from '../types/ReplacementRange';
import type {SearchResult} from '../types/SearchResult';
import {applyReplacements} from './util/apply-replacements';


/**
 * Replace all instances of the current search query in the document or search range.
 *
 * @param state - The editor state
 * @param dispatch - Optional dispatch function to apply the transaction
 * @returns True if the command can be executed, false otherwise
 */
export const replaceAll: Command = (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
    const search: SearchState = searchPluginKey.getState(state);
    if (!search?.query.valid) {
        return false;
    }

    const range: DocumentRange = search.range ?? {from: 0, to: state.doc.content.size};
    const matches: Array<SearchResult> = collectAllMatches(state, search.query, range);

    if (matches.length === 0) {
        return false;
    }

    if (dispatch) {
        const transaction: PmTransaction = state.transaction;

        // Apply all replacements in reverse order to maintain position validity
        for (let i = matches.length - 1; i >= 0; i--) {
            const match: SearchResult = matches[i];
            const replacements: Array<ReplacementRange> = search.query.getReplacements(state, match);
            applyReplacements(transaction, replacements);
        }

        dispatch(transaction);
    }

    return true;
};


/**
 * Collects all search matches within the specified range.
 *
 * @param state - The editor state
 * @param query - The search query to match
 * @param range - The range to search within
 * @returns An array of all search results in the range
 */
function collectAllMatches(state: PmEditorState,
                           query: SearchQuery,
                           range: DocumentRange): Array<SearchResult> {
    const matches: Array<SearchResult> = [];
    let currentPos: number = range.from;

    while (currentPos <= range.to) {
        const match: SearchResult = query.findNext(state, currentPos, range.to);
        if (!match) {
            break;
        }
        matches.push(match);
        // Prevent infinite loop on zero-width matches
        currentPos = match.to > currentPos ? match.to : currentPos + 1;
    }

    return matches;
}
