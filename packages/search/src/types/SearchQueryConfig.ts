import type {SearchResult} from './SearchResult';
import type { PmEditorState } from '@type-editor/editor-types';

/**
 * Configuration options for creating a search query.
 */
export interface SearchQueryConfig {
    /**
     * The search string or regular expression pattern.
     */
    search: string;

    /**
     * Controls whether the search should be case-sensitive.
     * @default false
     */
    caseSensitive?: boolean;

    /**
     * By default, string search will replace `\n`, `\r`, and `\t` in
     * the query with newline, return, and tab characters. When this
     * is set to true, that behavior is disabled.
     * @default false
     */
    literal?: boolean;

    /**
     * When true, interpret the search string as a regular expression.
     * @default false
     */
    regexp?: boolean;

    /**
     * The replacement text to use when performing replacements.
     * Supports capture group references like `$1`, `$2`, and `$&` for regex searches.
     * @default ''
     */
    replace?: string;

    /**
     * Enable whole-word matching. When enabled, matches that are surrounded
     * by word characters will be ignored.
     * @default false
     */
    wholeWord?: boolean;

    /**
     * Optional filter function that can exclude certain search results.
     * Results for which this function returns false will be ignored.
     *
     * @param state - The current editor state
     * @param result - The search result to filter
     * @returns `true` to include the result, `false` to exclude it
     */
    filter?: (state: PmEditorState, result: SearchResult) => boolean;
}
