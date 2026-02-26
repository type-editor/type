import { Decoration, DecorationSet } from '@type-editor/decoration';
import type {
    EditorStateConfig,
    PmDecoration,
    PmEditorState,
    PmSelection,
    PmTransaction,
} from '@type-editor/editor-types';
import { Plugin } from '@type-editor/state';

import { searchPluginKey } from './search-plugin-key';
import { SearchQuery } from './SearchQuery';
import { SearchState } from './SearchState';
import type { DocumentRange } from './types/DocumentRange';
import type { SearchPluginOptions } from './types/SearchPluginOptions';
import type { SearchResult } from './types/SearchResult';


/**
 * CSS class names for search match highlighting.
 */
const SEARCH_MATCH_CLASS = 'ProseMirror-search-match';
const ACTIVE_SEARCH_MATCH_CLASS = 'ProseMirror-active-search-match';



/**
 * Creates a search plugin that stores a current search query and searched range,
 * and highlights matches of the query.
 *
 * @param options - Configuration options for the search plugin
 * @returns A ProseMirror plugin that manages search state and match highlighting
 */
export function searchPlugin(options: SearchPluginOptions = {}): Plugin {
    return new Plugin<SearchState>({
        key: searchPluginKey,
        state: {
            init(_config: EditorStateConfig, state: PmEditorState): SearchState {
                const query: SearchQuery = options.initialQuery ?? new SearchQuery({search: ''});
                const range: DocumentRange = options.initialRange ?? null;
                return new SearchState(query, range, buildMatchDeco(state, query, range));
            },
            apply(transaction: PmTransaction, currentSearch: SearchState, _oldState: PmEditorState, newState: PmEditorState): SearchState {
                // Check if the transaction explicitly updates the search state
                const explicitUpdate = transaction.getMeta(searchPluginKey) as
                    | { query: SearchQuery; range: DocumentRange | null }
                    | undefined;

                if (explicitUpdate) {
                    return new SearchState(
                        explicitUpdate.query,
                        explicitUpdate.range,
                        buildMatchDeco(newState, explicitUpdate.query, explicitUpdate.range)
                    );
                }

                // Update search state if document changed
                if (transaction.docChanged) {
                    let updatedRange: DocumentRange = currentSearch.range;

                    // Map the range through the transaction's changes
                    if (updatedRange) {
                        const mappedFrom: number = transaction.mapping.map(updatedRange.from, 1);
                        const mappedTo: number = transaction.mapping.map(updatedRange.to, -1);
                        // Ensure the range is still valid after mapping
                        updatedRange = mappedFrom < mappedTo ? {from: mappedFrom, to: mappedTo} : null;
                    }

                    return new SearchState(
                        currentSearch.query,
                        updatedRange,
                        buildMatchDeco(newState, currentSearch.query, updatedRange)
                    );
                }

                // If only selection changed, rebuild decorations to update active match highlighting
                if (transaction.selectionSet) {
                    return new SearchState(
                        currentSearch.query,
                        currentSearch.range,
                        buildMatchDeco(newState, currentSearch.query, currentSearch.range)
                    );
                }

                return currentSearch;
            }
        },
        props: {
            decorations: (state: PmEditorState): DecorationSet => searchPluginKey.getState(state)?.deco ?? DecorationSet.empty
        }
    });
}


/**
 * Builds a decoration set that highlights all matches of the search query.
 *
 * @param state - The editor state
 * @param query - The search query to match
 * @param range - Optional range to limit the search scope
 * @returns A decoration set containing inline decorations for each match
 */
function buildMatchDeco(state: PmEditorState,
                        query: SearchQuery,
                        range: DocumentRange | null): DecorationSet {
    if (!query.valid) {
        return DecorationSet.empty;
    }

    const decorations: Array<PmDecoration> = [];
    const selection: PmSelection = state.selection;
    const searchStart: number = range?.from ?? 0;
    const searchEnd: number = range?.to ?? state.doc.content.size;

    let currentPos: number = searchStart;
    while (true) {
        const match: SearchResult = query.findNext(state, currentPos, searchEnd);
        if (!match) {
            break;
        }

        const isActiveMatch: boolean = match.from === selection.from && match.to === selection.to;
        const cssClass: string = isActiveMatch ? ACTIVE_SEARCH_MATCH_CLASS : SEARCH_MATCH_CLASS;

        decorations.push(
            Decoration.inline(match.from, match.to, {class: cssClass})
        );

        // Prevent infinite loop on zero-width matches
        currentPos = match.to > currentPos ? match.to : currentPos + 1;
        if (currentPos > searchEnd) {
            break;
        }
    }

    return DecorationSet.create(state.doc, decorations);
}
