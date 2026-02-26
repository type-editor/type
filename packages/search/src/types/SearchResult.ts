/**
 * Represents a matched instance of a search query.
 */
export interface SearchResult {
    /**
     * The starting position of the match in the document.
     */
    from: number;

    /**
     * The ending position of the match in the document.
     */
    to: number;

    /**
     * The regular expression match array. This will be non-null
     * only for regular expression queries and contains capture groups.
     */
    match: RegExpMatchArray | null;

    /**
     * The starting position of the text block where the match was found.
     */
    matchStart: number;
}
