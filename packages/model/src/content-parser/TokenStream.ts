import type {NodeType} from '../schema/NodeType';

/**
 * Tokenizes and provides streaming access to a content expression string.
 * Splits the expression into individual tokens for parsing.
 */
export class TokenStream {

    /** Array of tokens extracted from the expression string */
    private readonly tokens: Array<string>;
    private readonly _nodeTypes: Readonly<Record<string, NodeType>>;
    private readonly expression: string;

    /** Tracks whether the expression contains inline content */
    private isInline: boolean | null = null;

    /** Current position in the token array */
    private position = 0;

    /**
     * Creates a new token stream from a content expression string.
     *
     * @param expression - The content expression to tokenize
     * @param nodeTypes - Map of available node types for name resolution
     */
    constructor(expression: string, nodeTypes: Readonly<Record<string, NodeType>>) {
        this._nodeTypes = nodeTypes;
        this.expression = expression;

        // Split on whitespace before word boundaries, non-word characters, or end of string
        this.tokens = expression.split(/\s*(?=\b|\W|$)/);

        // Remove empty tokens at the boundaries
        if (this.tokens.length > 0 && this.tokens[this.tokens.length - 1] === '') {
            this.tokens.pop();
        }

        if (this.tokens.length > 0 && this.tokens[0] === '') {
            this.tokens.shift();
        }
    }

    /**
     * Tracks whether the expression contains inline content (true),
     * block content (false), or hasn't been determined yet (null).
     * Used to prevent mixing inline and block content in expressions.
     */
    get inline(): boolean | null {
        return this.isInline;
    }

    set inline(isInline: boolean) {
        this.isInline = isInline;
    }

    /**
     * Current position in the token array
     */
    get pos(): number {
        return this.position;
    }

    /**
     * Current position in the token array
     *
     * @param position
     * @throws {RangeError} If position is negative
     */
    set pos(position: number) {
        if (position < 0) {
            throw new RangeError(`Token position cannot be negative: ${position}`);
        }
        this.position = position;
    }

    /**
     * Map of available node types for name resolution
     */
    get nodeTypes(): Readonly<Record<string, NodeType>> {
        return this._nodeTypes;
    }

    /**
     * Gets the current token without consuming it.
     *
     * @returns The current token, or undefined if at end of stream
     */
    get next(): string | undefined {
        return this.tokens[this.position];
    }

    /**
     * Attempts to consume a specific token.
     * If the current token matches, advances the position and returns true.
     *
     * @param tok - The token to try to consume
     * @returns true if the token was consumed, false otherwise
     */
    public eat(tok: string): boolean {
        if (this.next === tok) {
            this.position++;
            return true;
        }
        return false;
    }

    /**
     * Throws a syntax error with context about the content expression.
     *
     * @param str - The error message
     * @throws {SyntaxError} Always throws with the provided message and expression context
     */
    public err(str: string): never {
        throw new SyntaxError(`${str} (in content expression '${this.expression}')`);
    }
}
