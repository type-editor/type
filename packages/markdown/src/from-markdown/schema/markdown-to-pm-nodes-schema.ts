import type Token from 'markdown-it/lib/token.mjs';

import type {ParseSpec} from '../../types/ParseSpec';


/**
 * Parse specification for unextended [CommonMark](http://commonmark.org/),
 * without inline HTML, producing a document in the basic schema.
 * Maps markdown-it token types to ProseMirror nodes and marks.
 */
export const markdownToPmNodesSchema: Record<string, ParseSpec> = {

    blockquote: {block: 'blockquote'},

    paragraph: {block: 'paragraph'},

    list_item: {block: 'list_item'},

    bullet_list: {
        block: 'bullet_list',
        getAttrs: (_: Token, tokens: Array<Token>, i: number) => ({
            tight: listIsTight(tokens, i)
        })
    },

    ordered_list: {
        block: 'ordered_list',
        getAttrs: (tok: Token, tokens: Array<Token>, i: number) => ({
            // Extract the starting number from the list token (defaults to 1 if not specified)
            order: +tok.attrGet('start') || 1,
            tight: listIsTight(tokens, i)
        })
    },

    heading: {
        block: 'heading',
        getAttrs: (tok: Token) => ({
            // Extract level from tag name (e.g., "h1" -> 1, "h2" -> 2)
            level: +tok.tag.slice(1)
        })
    },

    code_block: {block: 'code_block', noCloseToken: true},

    fence: {
        block: 'code_block',
        getAttrs: (tok: Token) => ({
            params: tok.info || ''
        }),
        noCloseToken: true
    },

    hr: {node: 'horizontal_rule'},

    image: {
        node: 'image',
        getAttrs: (tok: Token) => ({
            src: tok.attrGet('src'),
            title: tok.attrGet('title') || null,
            alt: tok.children?.[0]?.content || null
        })
    },
    hardbreak: {node: 'hard_break'},

    em: {mark: 'em'},

    strong: {mark: 'strong'},

    link: {
        mark: 'link',
        getAttrs: (tok: Token) => ({
            href: tok.attrGet('href'),
            title: tok.attrGet('title') ?? null
        })
    },

    code_inline: {mark: 'code', noCloseToken: true}
};

/**
 * Determines if a list is "tight" (without blank lines between items).
 * In markdown-it, tight lists are indicated by the `hidden` property on tokens.
 *
 * @param tokens - The array of all tokens.
 * @param i - The current token index (typically pointing at the list opening token).
 * @returns True if the list is tight (no blank lines), false otherwise.
 */
function listIsTight(tokens: ReadonlyArray<Token>, i: number): boolean {
    // Scan forward from the current position to find the first non-list_item_open token
    while (++i < tokens.length) {
        if (tokens[i].type !== 'list_item_open') {
            // In markdown-it, the `hidden` property indicates tight mode (no blank lines)
            return tokens[i].hidden;
        }
    }

    return false;
}
