import type Token from 'markdown-it/lib/token.mjs';

import type {MarkdownParseState} from '../from-markdown/MarkdownParseState';


/**
 * Function type for handling a specific markdown-it token during parsing.
 *
 * @param state - The current parse state.
 * @param token - The token being processed.
 * @param tokens - The complete array of tokens.
 * @param i - The index of the current token in the tokens array.
 */
export type TokenHandler = (state: MarkdownParseState, token: Token, tokens: Array<Token>, i: number) => void;
