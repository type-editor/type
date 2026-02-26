import type {Node as PmNode} from '../../elements/Node';
import type {ResolvedPos} from '../../elements/ResolvedPos';
import type {ContentMatch} from '../content-parser/ContentMatch';
import type {TagParseRule} from './TagParseRule';

/**
 * Configuration options recognized by the DOM parser's parse and parseSlice methods.
 * These options control how DOM content is converted into ProseMirror document structure.
 *
 * @example
 * ```typescript
 * const options: ParseOptions = {
 *   preserveWhitespace: 'full',
 *   from: 0,
 *   to: 5,
 *   findPositions: [{ node: someNode, offset: 10 }]
 * };
 * ```
 */
export interface ParseOptions {

    /**
     * Controls whitespace handling during parsing.
     *
     * @remarks
     * Determines how whitespace characters (spaces, tabs, newlines) are processed:
     * - `false` or `undefined`: Whitespace is collapsed according to HTML rules (multiple spaces become one)
     * - `true`: Whitespace is preserved, but newlines are normalized to spaces or line break replacements
     * - `'full'`: All whitespace is preserved entirely, including newlines (useful for code blocks)
     *
     * @example
     * ```typescript
     * // HTML whitespace collapsing (default)
     * preserveWhitespace: false
     *
     * // Preserve spaces, normalize newlines
     * preserveWhitespace: true
     *
     * // Preserve everything (for <pre> blocks)
     * preserveWhitespace: 'full'
     * ```
     */
    preserveWhitespace?: boolean | 'full';

    /**
     * Array of DOM positions to track during parsing.
     *
     * @remarks
     * Allows tracking how DOM positions map to document positions during parsing.
     * The parser will add a `pos` property to each object containing the corresponding
     * document position after parsing. DOM positions not found in the parsed content
     * will remain unchanged (pos will be undefined).
     *
     * This is useful for maintaining cursor positions or tracking specific DOM locations
     * through the parsing process.
     *
     * @example
     * ```typescript
     * const positions = [
     *   { node: textNode, offset: 5 },
     *   { node: elementNode, offset: 0 }
     * ];
     * parser.parse(dom, { findPositions: positions });
     * // After parsing, positions[0].pos will contain the document position
     * ```
     */
    findPositions?: Array<{ node: Node, offset: number, pos?: number; }>;

    /**
     * The child node index to start parsing from (inclusive).
     *
     * @remarks
     * When specified, parsing will begin at this child index instead of the first child.
     * If not specified, parsing starts from the first child node (index 0).
     * Useful for parsing only a portion of a DOM element's children.
     *
     * @example
     * ```typescript
     * // Parse only children from index 2 onwards
     * parser.parse(dom, { from: 2 })
     * ```
     */
    from?: number;

    /**
     * The child node index to stop parsing at (exclusive).
     *
     * @remarks
     * When specified, parsing will stop before this child index.
     * If not specified, parsing continues through the last child node.
     * Combined with `from`, allows parsing a specific range of children.
     *
     * @example
     * ```typescript
     * // Parse children from index 1 to 4 (indices 1, 2, 3)
     * parser.parse(dom, { from: 1, to: 4 })
     * ```
     */
    to?: number;

    /**
     * The node to use as the top-level container for parsed content.
     *
     * @remarks
     * By default, content is parsed into the schema's topNodeType (usually "doc").
     * This option allows using a different node type and attributes as the container,
     * which is useful when parsing into a specific context or creating fragments.
     *
     * @example
     * ```typescript
     * // Parse into a blockquote instead of doc
     * const blockquote = schema.nodes.blockquote.create();
     * parser.parse(dom, { topNode: blockquote })
     * ```
     */
    topNode?: PmNode;

    /**
     * The starting content match for validating parsed content against the top node.
     *
     * @remarks
     * This determines what content is allowed in the top node at the start of parsing.
     * By default, uses the topNode's contentMatch. This option allows starting from
     * a different match state, useful when continuing to parse into existing content.
     *
     * @example
     * ```typescript
     * // Start matching after some existing content
     * const existingContent = Fragment.from(someNodes);
     * const match = topNode.type.contentMatch.matchFragment(existingContent);
     * parser.parse(dom, { topNode, topMatch: match })
     * ```
     */
    topMatch?: ContentMatch;

    /**
     * Additional ancestor context for parsing.
     *
     * @remarks
     * Provides a set of ancestor nodes to consider as context when evaluating
     * parse rules, in addition to the top node. This affects how context-sensitive
     * parse rules are matched (rules with a "context" property).
     *
     * The context is specified as a resolved position, which includes the full
     * ancestor chain at that position in the document.
     *
     * @example
     * ```typescript
     * // Parse with knowledge of surrounding document structure
     * const $pos = doc.resolve(10); // Position in existing document
     * parser.parseSlice(dom, { context: $pos })
     * ```
     */
    context?: ResolvedPos;

    /**
     * Custom function to generate parse rules for specific DOM nodes.
     *
     * @param node - The DOM node to generate a rule for
     * @returns A parse rule without the tag property, or null if no custom rule applies
     *
     * @remarks
     * This function is called for each DOM element during parsing, before checking
     * the parser's standard rules. It allows dynamic rule generation based on
     * DOM element properties, attributes, or other runtime conditions.
     *
     * Return null to fall back to standard rule matching.
     *
     * @example
     * ```typescript
     * ruleFromNode: (node) => {
     *   if (node.getAttribute('data-custom') === 'special') {
     *     return { node: 'custom_node', attrs: { id: node.id } };
     *   }
     *   return null; // Use standard rules
     * }
     * ```
     */
    ruleFromNode?: (node: Node) => Omit<TagParseRule, 'tag'> | null;

    /**
     * Whether the top node should be left open after parsing.
     *
     * @remarks
     * When true, the top node won't be automatically closed and filled with required
     * content at the end of parsing. This allows additional content to be added later,
     * which is useful when parsing incrementally or creating partial document structures.
     *
     * When false (default), the parser ensures all required trailing content is added
     * according to the schema's content expressions.
     *
     * @example
     * ```typescript
     * // Parse into an open document that can be extended
     * const slice = parser.parseSlice(dom, { topOpen: true });
     * ```
     */
    topOpen?: boolean;
}
