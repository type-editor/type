import type {DecorationSet} from '@type-editor/decoration';

import type {SearchQuery} from './SearchQuery';
import type {DocumentRange} from './types/DocumentRange';


/**
 * Internal state for the search plugin, maintaining the current search query,
 * optional search range, and decoration set for highlighting matches.
 */
export class SearchState {
    private readonly _query: SearchQuery;
    private readonly _range: DocumentRange | null;
    private readonly _deco: DecorationSet;

    /**
     * Creates a new SearchState instance.
     *
     * @param query - The search query to use
     * @param range - Optional range to limit search scope
     * @param deco - Decoration set for highlighting matches
     */
    constructor(query: SearchQuery, range: DocumentRange | null, deco: DecorationSet) {
        this._query = query;
        this._range = range;
        this._deco = deco;
    }

    /**
     * Gets the current search query.
     */
    get query(): SearchQuery {
        return this._query;
    }

    /**
     * Gets the current search range, if any.
     */
    get range(): DocumentRange | null {
        return this._range;
    }

    /**
     * Gets the decoration set for highlighting matches.
     */
    get deco(): DecorationSet {
        return this._deco;
    }

}
