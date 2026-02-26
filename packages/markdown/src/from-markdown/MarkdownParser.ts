import {type Attrs, type MarkType, type Node, type NodeType, type Schema} from '@type-editor/model';
import MarkdownIt from 'markdown-it';
import type Token from 'markdown-it/lib/token.mjs';

import type {ParseSpec} from '../types/ParseSpec';
import type {TokenHandler} from '../types/TokenHandler';
import {MarkdownParseState} from './MarkdownParseState';


/**
 * A configuration of a Markdown parser. Such a parser uses
 * [markdown-it](https://github.com/markdown-it/markdown-it) to
 * tokenize a file, and then runs the custom rules it is given over
 * the tokens to create a ProseMirror document tree.
 */
export class MarkdownParser {

    protected readonly schema: Schema;
    protected readonly tokenizer: MarkdownIt;
    protected readonly tokens: Record<string, ParseSpec>;
    private readonly tokenHandlers: Record<string, TokenHandler>;

    /**
     * Create a parser with the given configuration. You can configure
     * the markdown-it parser to parse the dialect you want, and provide
     * a description of the ProseMirror entities those tokens map to in
     * the `tokens` object, which maps token names to descriptions of
     * what to do with them. Such a description is an object, and may
     * have the following properties:
     *
     * @param schema - The parser's document schema.
     * @param tokenizer - This parser's markdown-it tokenizer.
     * @param tokens - The value of the `tokens` object used to construct this parser.
     * Can be useful to copy and modify to base other parsers on.
     */
    constructor(schema: Schema,
                tokenizer: MarkdownIt,
                tokens: Record<string, ParseSpec>) {
        this.schema = schema;
        this.tokenizer = tokenizer;
        this.tokens = tokens;
        this.tokenHandlers = this.getTokenHandlers(schema, tokens);
    }


    /**
     * Parse a string as [CommonMark](http://commonmark.org/) markup,
     * and create a ProseMirror document as prescribed by this parser's
     * rules.
     *
     * The second argument, when given, is passed through to the
     * [Markdown
     * parser](https://markdown-it.github.io/markdown-it/#MarkdownIt.parse).
     *
     * @param text - The markdown text to parse.
     * @param markdownEnv - Optional environment object passed to the markdown-it parser.
     * @returns The parsed ProseMirror document node.
     */
    public parse(text: string, markdownEnv: object = {}): Node {
        const state = new MarkdownParseState(this.schema, this.tokenHandlers);
        let doc: Node;
        // Parse markdown text into tokens and process them
        state.parseTokens(this.tokenizer.parse(text, markdownEnv));

        // Close all remaining nodes on the stack (typically just the root document node)
        // This ensures the entire document tree is properly finalized
        do {
            doc = state.closeNode();
        } while (state.stack.length);

        // Return the completed document, or create an empty one if parsing failed
        return doc || this.schema.topNodeType.createAndFill();
    }

    /**
     * Creates a mapping of markdown-it token types to their corresponding handler functions.
     * This function generates the processing logic for each token type based on the parse specifications.
     *
     * @param schema - The ProseMirror schema to use for creating nodes and marks.
     * @param tokens - The parse specifications mapping token types to their handling rules.
     * @returns A record mapping token type strings to their handler functions.
     */
    private getTokenHandlers(schema: Schema,
                             tokens: Record<string, ParseSpec>): Record<string, TokenHandler> {
        const handlers: Record<string, TokenHandler> = {};

        // A no-operation function used as a placeholder handler for ignored tokens.
        const noOpFunc = (): void => {/* Intentionally empty */
        };

        // Generate handlers for each token type based on the parse specification
        for (const [type, spec] of Object.entries(tokens)) {

            // Handle block-level nodes (e.g., paragraphs, headings, blockquotes)
            if (spec.block) {
                const nodeType: NodeType = schema.nodeType(spec.block);
                if (this.isNoCloseToken(spec, type)) {
                    // Self-contained block tokens (like code blocks) - open, add content, close in one handler
                    handlers[type] = (state: MarkdownParseState, tok: Token, tokens: Array<Token>, i: number): void => {
                        state.openNode(nodeType, this.resolveAttributes(spec, tok, tokens, i));
                        state.addText(this.removeTrailingNewline(tok.content));
                        state.closeNode();
                    };
                } else {
                    // Paired tokens - separate handlers for _open and _close
                    handlers[type + '_open'] = (state: MarkdownParseState, tok: Token, tokens: Array<Token>, i: number): void => {
                        state.openNode(nodeType, this.resolveAttributes(spec, tok, tokens, i));
                    };
                    handlers[type + '_close'] = (state: MarkdownParseState): void => {
                        state.closeNode();
                    };
                }
            } else if (spec.node) {
                // Handle leaf nodes (e.g., images, horizontal rules) - single self-contained elements
                const nodeType: NodeType = schema.nodeType(spec.node);
                handlers[type] = (state: MarkdownParseState, tok: Token, tokens: Array<Token>, i: number): void => {
                    state.addNode(nodeType, this.resolveAttributes(spec, tok, tokens, i));
                };
            } else if (spec.mark) {
                // Handle inline marks (e.g., emphasis, strong, links) - styling that applies to text
                const markType: MarkType = schema.marks[spec.mark];
                if (this.isNoCloseToken(spec, type)) {
                    // Self-contained mark tokens (like inline code) - open, add content, close in one handler
                    handlers[type] = (state: MarkdownParseState, tok: Token, tokens: Array<Token>, i: number): void => {
                        state.openMark(markType.create(this.resolveAttributes(spec, tok, tokens, i)));
                        state.addText(this.removeTrailingNewline(tok.content));
                        state.closeMark(markType);
                    };
                } else {
                    // Paired tokens - separate handlers for _open and _close
                    handlers[type + '_open'] = (state: MarkdownParseState, tok: Token, tokens: Array<Token>, i: number): void => {
                        state.openMark(markType.create(this.resolveAttributes(spec, tok, tokens, i)));
                    };
                    handlers[type + '_close'] = (state: MarkdownParseState): void => {
                        state.closeMark(markType);
                    };
                }
            } else if (spec.ignore) {
                // Handle ignored tokens - tokens we want to skip during parsing
                if (this.isNoCloseToken(spec, type)) {
                    handlers[type] = noOpFunc;
                } else {
                    handlers[type + '_open'] = noOpFunc;
                    handlers[type + '_close'] = noOpFunc;
                }
            } else {
                throw new RangeError(`Unrecognized parsing spec: ${JSON.stringify(spec)}`);
            }
        }

        // Default handlers for common token types that appear in all markdown documents
        // Plain text content - directly add to the document
        handlers.text = (state: MarkdownParseState, tok: Token): void => {
            state.addText(tok.content);
        };
        // Inline content wrapper - recursively parse child tokens (contains text, emphasis, links, etc.)
        handlers.inline = (state: MarkdownParseState, tok: Token): void => {
            if (tok.children) {
                state.parseTokens(tok.children);
            }
        };
        // Soft line breaks - convert to spaces (unless overridden in the parse spec)
        handlers.softbreak ??= (state: MarkdownParseState): void => {
            state.addText(' ');
        };

        return handlers;
    }

    /**
     * Determines if a token type should be handled without separate open/close tokens.
     * Code content is represented as a single token with a `content` property in markdown-it,
     * rather than separate opening and closing tokens.
     *
     * @param spec - The parse specification for the token.
     * @param type - The token type string.
     * @returns True if the token should be handled as a single unit without close token.
     */
    private isNoCloseToken(spec: ParseSpec, type: string): boolean {
        return spec.noCloseToken
            || type === 'code_inline'
            || type === 'code_block'
            || type === 'fence';
    }

    /**
     * Removes a trailing newline character from a string if present.
     * This is useful for normalizing text content from markdown-it tokens.
     *
     * @param str - The string to process.
     * @returns The string without a trailing newline, or the original string if no trailing newline exists.
     */
    private removeTrailingNewline(str: string): string {
        return str.endsWith('\n') ? str.slice(0, str.length - 1) : str;
    }

    /**
     * Resolves attributes for a node or mark based on a parse specification.
     * Handles both static attributes and dynamic attribute generation via functions.
     *
     * @param spec - The parse specification containing attribute information.
     * @param token - The current markdown-it token being processed.
     * @param tokens - The complete array of tokens.
     * @param i - The index of the current token.
     * @returns The resolved attributes object, or null if no attributes are defined.
     */
    private resolveAttributes(spec: ParseSpec,
                              token: Token,
                              tokens: Array<Token>,
                              i: number): Attrs | null {
        // getAttrs has highest priority - allows dynamic attribute generation
        if (spec.getAttrs) {
            return spec.getAttrs(token, tokens, i);
        }
        // For backwards compatibility when `attrs` is a Function
        if (typeof spec.attrs === 'function') {
            return (spec.attrs as (token: Token) => Attrs | null)(token);
        }
        // Fall back to static attrs or null
        return spec.attrs ?? null;
    }
}
