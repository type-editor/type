import {isUndefinedOrNull} from '@type-editor/commons';

import type {NodeType} from '../schema/NodeType';
import type {ContentMatch} from '../types/content-parser/ContentMatch';
import type {ContentPattern} from '../types/content-parser/ContentPattern';
import {ContentMatcher} from './ContentMatcher';
import {ContentMatchFactory} from './ContentMatchFactory';
import {TokenStream} from './TokenStream';


/**
 * Parser for ProseMirror content expressions.
 *
 * Content expressions use a regular-expression-like syntax to describe
 * what content is allowed in a node. For example:
 * - "paragraph+" means one or more paragraphs
 * - "heading | paragraph" means a heading or paragraph
 * - "block{2,4}" means 2 to 4 block elements
 *
 * The parser converts these expressions into a ContentMatch automaton
 * that can efficiently validate and match node sequences.
 */
export class ContentParser {

    /** Regex to test if a token contains non-digit characters */
    private static readonly NON_DIGIT_REGEX = /\D/;

    /** Regex to test if a token contains non-word characters */
    private static readonly NON_WORD_REGEX = /\W/;

    /**
     * Parses a content expression string into a ContentMatch automaton.
     *
     * @param string - The content expression to parse (e.g., "paragraph+ | heading")
     * @param nodeTypes - Map of available node type names to NodeType objects
     * @returns A ContentMatch representing the valid content patterns
     * @throws {SyntaxError} If the content expression is invalid
     */
    public static parse(string: string,
                        nodeTypes: Readonly<Record<string, NodeType>>): ContentMatch {
        return new ContentParser().parse(string, nodeTypes);
    }

    /**
     * Parses a content expression string into a ContentMatch automaton.
     *
     * @param string - The content expression to parse
     * @param nodeTypes - Map of available node type names to NodeType objects
     * @returns A ContentMatch representing the valid content patterns
     * @throws {SyntaxError} If the content expression is invalid
     */
    public parse(string: string,
                 nodeTypes: Readonly<Record<string, NodeType>>): ContentMatch {
        const stream = new TokenStream(string, nodeTypes);

        if (isUndefinedOrNull(stream.next)) {
            return ContentMatchFactory.EMPTY_CONTENT_MATCH;
        }

        const expr: ContentPattern = this.parseExpr(stream);

        if (stream.next) {
            stream.err('Unexpected trailing text');
        }

        const contentMatcher = new ContentMatcher(expr);
        return contentMatcher.getCheckedMatch(stream);
    }

    /**
     * Parses a choice expression (alternatives separated by |).
     * Handles expressions like "heading | paragraph | blockquote".
     *
     * @param stream - The token stream being parsed
     * @returns An expression representing the choice or a single sequence
     */
    private parseExpr(stream: TokenStream): ContentPattern {
        const expressions: Array<ContentPattern> = [];

        do {
            expressions.push(this.parseExprSeq(stream));
        } while (stream.eat('|'));

        return expressions.length === 1
            ? expressions[0]
            : {type: 'choice', exprs: expressions};
    }

    /**
     * Parses a sequence expression (space-separated elements).
     * Handles expressions like "heading paragraph paragraph".
     *
     * @param stream - The token stream being parsed
     * @returns An expression representing the sequence or a single subscripted element
     */
    private parseExprSeq(stream: TokenStream): ContentPattern {
        const expressions: Array<ContentPattern> = [];

        while (stream.next && stream.next !== ')' && stream.next !== '|') {
            expressions.push(this.parseExprSubscript(stream));
        }

        return expressions.length === 1
            ? expressions[0]
            : {type: 'seq', exprs: expressions};
    }

    /**
     * Parses an expression with optional suffix operators (+, *, ?, {n,m}).
     * Handles expressions like "paragraph+", "block*", "item?", or "heading{2,4}".
     *
     * @param stream - The token stream being parsed
     * @returns An expression with the appropriate repetition modifier
     */
    private parseExprSubscript(stream: TokenStream): ContentPattern {
        let expr: ContentPattern = this.parseExprAtom(stream);

        while (true) {
            if (stream.eat('+')) {
                expr = {type: 'plus', expr};
            } else if (stream.eat('*')) {
                expr = {type: 'star', expr};
            } else if (stream.eat('?')) {
                expr = {type: 'opt', expr};
            } else if (stream.eat('{')) {
                expr = this.parseExprRange(stream, expr);
            } else {
                break;
            }
        }

        return expr;
    }

    /**
     * Parses a number from the token stream.
     *
     * @param stream - The token stream being parsed
     * @returns The parsed number
     * @throws {SyntaxError} If the current token is not a valid number
     */
    private parseNum(stream: TokenStream): number {
        if (!stream.next) {
            stream.err('Expected number, got end of input');
        }

        const token: string = stream.next;

        if (ContentParser.NON_DIGIT_REGEX.test(token)) {
            stream.err(`Expected number, got '${token}'`);
        }

        const result = Number(token);
        stream.pos++;
        return result;
    }

    /**
     * Parses a range expression like {2,5} or {3} or {2,}.
     *
     * @param stream - The token stream being parsed
     * @param expr - The expression to which the range applies
     * @returns A range expression with min and max bounds
     * @throws {SyntaxError} If the range syntax is invalid
     */
    private parseExprRange(stream: TokenStream, expr: ContentPattern): ContentPattern {
        const min: number = this.parseNum(stream);
        let max: number = min;

        if (stream.eat(',')) {
            // {n,} means n or more (unbounded)
            if (stream.next !== '}') {
                max = this.parseNum(stream);
            } else {
                max = -1; // -1 represents unbounded
            }
        }

        // Validate range constraints
        if (min < 0) {
            stream.err(`Range minimum cannot be negative: ${min}`);
        }
        if (max !== -1 && max < min) {
            stream.err(`Range maximum (${max}) cannot be less than minimum (${min})`);
        }

        if (!stream.eat('}')) {
            stream.err('Unclosed braced range');
        }

        return {type: 'range', min, max, expr};
    }

    /**
     * Resolves a name to one or more node types.
     * The name can be either a specific node type or a group name.
     *
     * @param stream - The token stream (used for error reporting)
     * @param name - The name to resolve (node type or group name)
     * @returns Array of matching node types
     * @throws {SyntaxError} If no matching node type or group is found
     */
    private resolveName(stream: TokenStream, name: string): ReadonlyArray<NodeType> {
        const types: Readonly<Record<string, NodeType>> = stream.nodeTypes;
        const directType: NodeType = types[name];

        // Check for direct node type match
        if (directType) {
            return [directType];
        }

        // Check for group membership
        const matchingTypes: Array<NodeType> = [];
        for (const typeName in types) {
            const type: NodeType = types[typeName];
            if (type.isInGroup(name)) {
                matchingTypes.push(type);
            }
        }

        if (matchingTypes.length === 0) {
            stream.err(`No node type or group '${name}' found`);
        }


        return matchingTypes;
    }

    /**
     * Parses an atomic expression (name or parenthesized expression).
     * Handles expressions like "paragraph", "(heading | paragraph)", or "block".
        // Check for unexpected end of input
        if (!stream.next) {
            stream.err('Unexpected end of content expression');
        }

     *
     * @param stream - The token stream being parsed
     * @returns An atomic expression
     * @throws {SyntaxError} If the expression is invalid
     */
    private parseExprAtom(stream: TokenStream): ContentPattern {
        // Handle parenthesized sub-expressions
        if (stream.eat('(')) {
            const expression: ContentPattern = this.parseExpr(stream);
            if (!stream.eat(')')) {
                stream.err('Missing closing paren');
            }
            return expression;
        }

        // Handle node names and group names
        if (!ContentParser.NON_WORD_REGEX.test(stream.next)) {
            const nodeName: string = stream.next;
            const nodeTypes: ReadonlyArray<NodeType> = this.resolveName(stream, nodeName);

            stream.pos++;

            // Optimize for common case of single node type
            if (nodeTypes.length === 1) {
                const type: NodeType = nodeTypes[0];
                if (isUndefinedOrNull(stream.inline)) {
                    stream.inline = type.isInline;
                } else if (stream.inline !== type.isInline) {
                    stream.err('Mixing inline and block content');
                }
                return {type: 'name', value: type};
            }

            // Validate that we're not mixing inline and block content for multiple types
            const expressions: Array<ContentPattern> = nodeTypes.map((type: NodeType): ContentPattern => {
                if (isUndefinedOrNull(stream.inline)) {
                    stream.inline = type.isInline;
                } else if (stream.inline !== type.isInline) {
                    stream.err('Mixing inline and block content');
                }
                return {type: 'name', value: type};
            });

            return {type: 'choice', exprs: expressions};
        }

        stream.err(`Unexpected token '${stream.next}'`);
    }

}
