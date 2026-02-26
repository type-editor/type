import type { PmEditorState } from '@type-editor/editor-types';

import type {SearchState} from '../../SearchState';
import type {DocumentRange} from '../../types/DocumentRange';
import type {SearchResult} from '../../types/SearchResult';


/**
 * Finds the next match after the current position, optionally wrapping around
 * to the start of the search range.
 *
 * @param search - The current search state
 * @param state - The editor state
 * @param wrap - Whether to wrap around to the beginning if no match is found
 * @param curFrom - The start position of the current selection
 * @param curTo - The end position of the current selection
 * @returns The next search result, or null if no match is found
 */
export function nextMatch(search: SearchState,
                          state: PmEditorState,
                          wrap: boolean,
                          curFrom: number,
                          curTo: number): SearchResult {
    const range: DocumentRange = search.range ?? {from: 0, to: state.doc.content.size};
    const searchStart: number = Math.max(curTo, range.from);

    let next: SearchResult = search.query.findNext(state, searchStart, range.to);

    // If no match found and wrapping is enabled, search from the beginning
    if (!next && wrap) {
        const wrapEnd: number = Math.min(curFrom, range.to);
        next = search.query.findNext(state, range.from, wrapEnd);
    }

    return next;
}
