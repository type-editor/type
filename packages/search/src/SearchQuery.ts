import type { PmEditorState } from '@type-editor/editor-types';
import {Fragment, type Mark, type PmNode, type ResolvedPos, Slice} from '@type-editor/model';

import {QueryFactory} from './search-query/QueryFactory';
import {regexFlags} from './search-query/regex-flags';
import type {QueryImpl} from './types/QueryImpl';
import type {ReplacementRange} from './types/ReplacementRange';
import type {SearchQueryConfig} from './types/SearchQueryConfig';
import type {SearchResult} from './types/SearchResult';


interface ReplacementGroup {
    group: number;
    copy: boolean;
}

/**
 * Extended RegExpMatchArray type that includes indices for capture groups.
 */
type RegExpMatchArrayWithIndices = RegExpMatchArray & { indices: Array<[number, number]> };



export class SearchQuery {

    /**
     * The search string (or regular expression).
     */
    private readonly _search: string;
    /**
     * Indicates whether the search is case-sensitive.
     */
    private readonly _caseSensitive: boolean;
    /**
     * By default, string search will replace `\n`, `\r`, and `\t` in
     * the query with newline, return, and tab characters. When this
     * is set to true, that behavior is disabled.
     */
    private readonly literal: boolean;
    /**
     * When true, the search string is interpreted as a regular
     * expression.
     */
    private readonly regexp: boolean;
    /**
     * The replace text, or the empty string if no replace text has
     * been given.
     */
    private readonly replace: string;
    /**
     * Whether this query is non-empty and, in case of a regular
     * expression search, syntactically valid.
     */
    private readonly _valid: boolean;
    /**
     * When true, matches that contain words are ignored when there are
     * further word characters around them.
     */
    private readonly wholeWord: boolean;
    /**
     * An optional filter that causes some results to be ignored.
     */
    private readonly filter: ((state: PmEditorState, result: SearchResult) => boolean) | null;

    private readonly queryImpl: QueryImpl;

    /**
     * Creates a new search query object.
     *
     * @param config - Configuration options for the search query
     */
    constructor(config: SearchQueryConfig) {
        this._search = config.search;
        this._caseSensitive = config.caseSensitive ?? false;
        this.literal = config.literal ?? false;
        this.regexp = config.regexp ?? false;
        this.replace = config.replace || '';
        this.wholeWord = config.wholeWord ?? false;
        this.filter = config.filter || null;

        // Validate the query
        this._valid = this.isQueryValid();

        // Select the appropriate query implementation based on validity and type
        this.queryImpl = this.selectQueryImplementation();
    }

    /**
     * Gets the search string or regular expression pattern.
     */
    get search(): string {
        return this._search;
    }

    /**
     * Gets whether the search is case-sensitive.
     */
    get caseSensitive(): boolean {
        return this._caseSensitive;
    }

    /**
     * Gets whether this query is valid (non-empty and syntactically correct if regex).
     */
    get valid(): boolean {
        return this._valid;
    }

    /**
     * Compares this query to another query for equality.
     * Two queries are equal if all their configuration options match.
     *
     * @param other - The query to compare with
     * @returns `true` if the queries are equal, `false` otherwise
     */
    public eq(other: SearchQuery): boolean {
        return this._search === other.search
            && this.replace === other.replace
            && this._caseSensitive === other.caseSensitive
            && this.regexp === other.regexp
            && this.wholeWord === other.wholeWord
            && this.literal === other.literal;
    }

    /**
     * Finds the next occurrence of this query in the given range.
     * The search continues forward from the `from` position until a match is found
     * or the end of the range is reached.
     *
     * @param state - The editor state to search in
     * @param from - The position to start searching from (default: 0)
     * @param to - The position to search up to (default: document size)
     * @returns The search result if found, or `null` if no match exists
     */
    public findNext(state: PmEditorState,
                    from = 0,
                    to: number = state.doc.content.size): SearchResult | null {
        while (from < to) {
            const result: SearchResult | null = this.queryImpl.findNext(state, from, to);

            if (!result) {
                return null;
            }

            if (this.checkResult(state, result)) {
                return result;
            }

            // Move past this match to continue searching
            from = result.from + 1;
        }

        return null;
    }

    /**
     * Finds the previous occurrence of this query in the given range.
     * The search continues backward from the `from` position until a match is found
     * or the start of the range is reached.
     *
     * Note: When searching backward, `from` should be greater than `to`.
     *
     * @param state - The editor state to search in
     * @param from - The position to start searching from (default: document size)
     * @param to - The position to search back to (default: 0)
     * @returns The search result if found, or `null` if no match exists
     */
    public findPrev(state: PmEditorState,
                    from: number = state.doc.content.size,
                    to = 0): SearchResult | null {
        while (from > to) {
            const result: SearchResult | null = this.queryImpl.findPrev(state, from, to);

            if (!result) {
                return null;
            }

            if (this.checkResult(state, result)) {
                return result;
            }

            // Move before this match to continue searching backward
            from = result.to - 1;
        }

        return null;
    }

    /**
     * Processes escape sequences in the given text.
     * If `literal` mode is enabled, returns text as-is.
     * Otherwise, replaces escape sequences: `\n` → newline, `\r` → return, `\t` → tab, `\\` → backslash.
     *
     * @param text - The text to process
     * @returns The processed text with escape sequences replaced (unless in literal mode)
     */
    public unquote(text: string): string {
        if (this.literal) {
            return text;
        }

        return text.replace(/\\([nrt\\])/g, (_match: string, ch: string): string => {
            switch (ch) {
                case 'n':
                    return '\n';
                case 'r':
                    return '\r';
                case 't':
                    return '\t';
                case '\\':
                    return '\\';
                default:
                    return '\\' + ch; // Shouldn't happen due to regex, but handle safely
            }
        });
    }

    /**
     * Generates the ranges that should be replaced for a search result.
     * This can return multiple ranges when `this.replace` contains capture group
     * placeholders like `$1`, `$2`, or `$&`, in which case the preserved
     * content is skipped by the replacements.
     *
     * Ranges are sorted by position, and `from`/`to` positions all
     * refer to positions in `state.doc`. When applying these, you should
     * either apply them from back to front, or map these positions
     * through your transaction's current mapping.
     *
     * @param state - The editor state containing the document
     * @param result - The search result to generate replacements for
     * @returns An array of replacement ranges with their insertion slices
     */
    public getReplacements(state: PmEditorState, result: SearchResult): Array<ReplacementRange> {
        const $from: ResolvedPos = state.doc.resolve(result.from);
        const marks: ReadonlyArray<Mark> = $from.marksAcross(state.doc.resolve(result.to));
        const ranges: Array<{ from: number, to: number, insert: Slice }> = [];

        let frag: Fragment = Fragment.empty;
        let pos: number = result.from;
        const {match} = result;
        const groups: Array<[number, number] | undefined> = match ? this.getGroupIndices(match as RegExpMatchArrayWithIndices) : [[0, result.to - result.from]];
        const replParts: Array<string | ReplacementGroup> = this.parseReplacement(this.unquote(this.replace));

        for (const part of replParts) {
            // Replacement text
            if (typeof part === 'string') {
                frag = frag.addToEnd(state.schema.text(part, marks));
            } else {
                const groupSpan: [number, number] = groups[part.group];
                if (groupSpan) {
                    const from: number = result.matchStart + groupSpan[0];
                    const to: number = result.matchStart + groupSpan[1];

                    if (part.copy) { // Copied content
                        frag = frag.append(state.doc.slice(from, to).content);
                    } else {
                        // Skipped content
                        if (frag !== Fragment.empty || from > pos) {
                            ranges.push({from: pos, to: from, insert: new Slice(frag, 0, 0)});
                            frag = Fragment.empty;
                        }
                        pos = to;
                    }
                }
            }
        }

        if (frag !== Fragment.empty || pos < result.to) {
            ranges.push({
                from: pos,
                to: result.to,
                insert: new Slice(frag, 0, 0)
            });
        }
        return ranges;
    }

    /**
     * Validates whether the query is non-empty and, for regex queries, syntactically valid.
     * @returns `true` if the query is valid, `false` otherwise
     */
    private isQueryValid(): boolean {
        if (!this._search) {
            return false;
        }

        return !this.regexp || this.isValidRegExp(this._search);
    }

    /**
     * Selects the appropriate query implementation strategy.
     * @returns The query implementation to use for searches
     */
    private selectQueryImplementation(): QueryImpl {
        if (!this._valid) {
            return QueryFactory.createNullQuery();
        }

        return this.regexp ? QueryFactory.createRegExpQuery(this) : QueryFactory.createStringQuery(this);
    }

    /**
     * Validates a search result against whole-word and filter constraints.
     *
     * @param state - The editor state
     * @param result - The search result to validate
     * @returns `true` if the result passes all constraints, `false` otherwise
     */
    private checkResult(state: PmEditorState, result: SearchResult): boolean {
        // Check whole-word constraint
        if (this.wholeWord) {
            const hasValidStartBoundary: boolean = this.checkWordBoundary(state, result.from);
            const hasValidEndBoundary: boolean = this.checkWordBoundary(state, result.to);

            if (!hasValidStartBoundary || !hasValidEndBoundary) {
                return false;
            }
        }

        // Check custom filter
        return !this.filter || this.filter(state, result);
    }

    /**
     * Checks if a position in the document is at a word boundary.
     * A position is at a word boundary if:
     * - There's no text node before or after it, OR
     * - The character before is not a letter, OR
     * - The character after is not a letter
     *
     * Uses Unicode-aware letter detection to support all languages.
     *
     * @param state - The editor state
     * @param pos - The position to check
     * @returns `true` if the position is at a word boundary, `false` otherwise
     */
    private checkWordBoundary(state: PmEditorState, pos: number): boolean {
        const $pos: ResolvedPos = state.doc.resolve(pos);
        const nodeBefore: PmNode | null = $pos.nodeBefore;
        const nodeAfter: PmNode | null = $pos.nodeAfter;

        // If there's no text on either side, it's a word boundary
        if (!nodeBefore || !nodeAfter || !nodeBefore.isText || !nodeAfter.isText) {
            return true;
        }

        // Check if there's a letter at the end of the before node
        const hasLetterBefore: boolean = /\p{L}$/u.test(nodeBefore.text || '');

        // Check if there's a letter at the start of the after node
        const hasLetterAfter: boolean = /^\p{L}/u.test(nodeAfter.text || '');

        // It's a word boundary if there's NOT a letter on both sides
        return !hasLetterBefore || !hasLetterAfter;
    }

    /**
     * Parses a replacement string into parts that are either literal text or references to capture groups.
     * Supports placeholders:
     * - `$$` → literal dollar sign
     * - `$&` → entire match (group 0)
     * - `$1`, `$2`, etc. → capture group references
     *
     * @param text - The replacement text to parse
     * @returns An array of string literals and group reference objects
     */
    private parseReplacement(text: string): Array<string | ReplacementGroup> {
        const result: Array<string | { group: number, copy: boolean }> = [];
        let highestGroupSeen = -1;

        /**
         * Adds literal text to the result, merging with previous text if possible.
         * @param textToAdd - The text to add
         */
        const addLiteralText = (textToAdd: string): void => {
            const lastIndex: number = result.length - 1;

            if (lastIndex >= 0 && typeof result[lastIndex] === 'string') {
                // Merge with previous string
                result[lastIndex] += textToAdd;
            } else {
                result.push(textToAdd);
            }
        };

        // Parse the replacement text
        while (text.length > 0) {
            // Match dollar sign placeholders: $$, $&, $1, $2, etc.
            const match: RegExpExecArray | null = /\$([$&]|\d+)/.exec(text);

            if (!match) {
                // No more placeholders, add remaining text
                addLiteralText(text);
                return result;
            }

            // Add any text before the placeholder
            if (match.index > 0) {
                const beforeMatch: string = text.slice(0, match.index);
                addLiteralText(beforeMatch);
            }

            // Handle escaped dollar sign ($$)
            if (match[1] === '$') {
                addLiteralText('$');
            }
            // Handle capture group references ($& or $1, $2, etc.)
            else {
                const groupNumber: number = match[1] === '&' ? 0 : +match[1];

                // Determine if this group's content should be copied or skipped
                const shouldCopy: boolean = highestGroupSeen >= groupNumber;

                if (!shouldCopy) {
                    highestGroupSeen = groupNumber || 1000;
                }

                result.push({group: groupNumber, copy: shouldCopy});
            }

            // Continue with the rest of the text
            text = text.slice(match.index + match[0].length);
        }

        return result;
    }

    /**
     * Extracts the start and end indices for each capture group in a regex match.
     * If the match has native indices support, uses those. Otherwise, calculates them manually.
     *
     * Note: The fallback implementation may be inaccurate if capture groups contain identical text
     * that appears multiple times in the match. Native indices support ('d' flag) is preferred.
     *
     * @param match - The regular expression match array
     * @returns An array of [start, end] tuples for each capture group, or undefined for unmatched groups
     */
    private getGroupIndices(match: RegExpMatchArrayWithIndices): Array<[number, number] | undefined> {
        // Use native indices if available
        if (match.indices) {
            return match.indices;
        }

        // Start with the full match (group 0)
        const result: Array<[number, number] | undefined> = [[0, match[0].length]];

        // Calculate indices for each capture group
        // Note: This is a best-effort fallback that may be inaccurate for duplicate group text
        let searchPosition = 0;
        for (let i = 1; i < match.length; i++) {
            const groupText: string = match[i];

            if (!groupText) {
                // Group didn't match
                result.push(undefined);
                continue;
            }

            const groupStart: number = match[0].indexOf(groupText, searchPosition);

            if (groupStart < 0) {
                // Couldn't find the group text - this shouldn't normally happen
                result.push(undefined);
            } else {
                const groupEnd: number = groupStart + groupText.length;
                result.push([groupStart, groupEnd]);
                // Move search position to end of this group to handle sequential groups correctly
                searchPosition = groupEnd;
            }
        }

        return result;
    }

    /**
     * Validates whether a string is a syntactically correct regular expression.
     *
     * @param source - The regular expression pattern to validate
     * @returns `true` if the pattern is valid, `false` otherwise
     */
    private isValidRegExp(source: string): boolean {
        try {
            new RegExp(source, regexFlags);
            return true;
        } catch {
            return false;
        }
    }
}

