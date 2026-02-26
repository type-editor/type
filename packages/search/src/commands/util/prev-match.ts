import type { PmEditorState } from '@type-editor/editor-types';

import type {SearchState} from '../../SearchState';
import type {DocumentRange} from '../../types/DocumentRange';
import type {SearchResult} from '../../types/SearchResult';


/**
 * Finds the previous match before the current position, optionally wrapping around
 * to the end of the search range.
 *
 * @param search - The current search state
 * @param state - The editor state
 * @param wrap - Whether to wrap around to the end if no match is found
 * @param curFrom - The start position of the current selection
 * @param curTo - The end position of the current selection
 * @returns The previous search result, or null if no match is found
 */
export function prevMatch(search: SearchState,
                          state: PmEditorState,
                          wrap: boolean,
                          curFrom: number,
                          curTo: number): SearchResult {
    const range: DocumentRange = search.range ?? {from: 0, to: state.doc.content.size};
    const searchEnd: number = Math.min(curFrom, range.to);

    let prev: SearchResult = search.query.findPrev(state, searchEnd, range.from);

    // If no match found and wrapping is enabled, search from the end
    if (!prev && wrap) {
        const wrapStart: number = Math.max(curTo, range.from);
        prev = search.query.findPrev(state, range.to, wrapStart);
    }

    return prev;
}
