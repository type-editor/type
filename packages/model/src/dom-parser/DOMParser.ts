import {hasOwnProperty, isUndefinedOrNull} from '@type-editor/commons';

import type {Fragment} from '../elements/Fragment';
import {Mark} from '../elements/Mark';
import type {Node as PmNode} from '../elements/Node';
import {Slice} from '../elements/Slice';
import type {NodeType} from '../schema/NodeType';
import type {Schema} from '../schema/Schema';
import type {DOMParseContext} from '../types/dom-parser/DOMParseContext';
import type {ParseOptions} from '../types/dom-parser/ParseOptions';
import type {ParseRule} from '../types/dom-parser/ParseRule';
import type {StyleParseRule} from '../types/dom-parser/StyleParseRule';
import type {TagParseRule} from '../types/dom-parser/TagParseRule';
import type {Attrs} from '../types/schema/Attrs';
import {DOMParseContextFactory} from './DOMParseContextFactory';


/**
 * A DOM parser represents a strategy for parsing DOM content into a
 * ProseMirror document conforming to a given schema. Its behavior is
 * defined by an array of [rules](#model.ParseRule).
 *
 * The parser processes DOM nodes and converts them into ProseMirror document nodes
 * based on the configured parse rules. It supports both tag-based rules (matching
 * DOM elements by selector) and style-based rules (matching CSS properties).
 *
 * @example
 * ```typescript
 * // Create a parser from a schema
 * const parser = DOMParser.fromSchema(mySchema);
 *
 * // Parse a DOM element
 * const doc = parser.parse(domElement);
 *
 * // Parse a slice (for partial content)
 * const slice = parser.parseSlice(domElement);
 * ```
 */
export class DOMParser {

    /**
     * Regular expression to extract the CSS property name from a style rule.
     * Matches everything before the '=' character (if present).
     */
    private static readonly REGEX_STYLE_PROP_NAME = /[^=]*/;

    /**
     * Regular expression to identify list tags (ul or ol elements).
     */
    private static readonly REGEX_LIST_TAG = /^(ul|ol)\b/;

    /**
     * Default priority value for parse rules that don't specify a priority.
     * Rules with higher priority are tried first.
     */
    private static readonly DEFAULT_RULE_PRIORITY = 50;

    /**
     * Character code for the equals sign '=', used for parsing style value specifications.
     */
    private static readonly EQUALS_CHAR_CODE = 61; // '='

    /**
     * Array of tag-based parse rules (matching DOM elements by CSS selector).
     */
    private readonly tags: ReadonlyArray<TagParseRule>;

    /**
     * Array of style-based parse rules (matching CSS properties and values).
     */
    private readonly styles: ReadonlyArray<StyleParseRule>;

    /**
     * List of CSS property names that have associated style parse rules.
     * Used to optimize style matching by only checking relevant properties.
     */
    private readonly _matchedStyles: ReadonlyArray<string>;

    /**
     * Whether list normalization should be performed during parsing.
     * True when list nodes in the schema cannot directly contain themselves.
     */
    private readonly isNormalizeLists: boolean;

    /**
     * The ProseMirror schema this parser targets.
     */
    private readonly _schema: Schema;

    /**
     * Performance optimization: Maps tag parse rules to their array indices
     * for O(1) lookups instead of O(n) indexOf operations.
     */
    private readonly tagIndexMap: Map<TagParseRule, number>;

    /**
     * Performance optimization: Maps style parse rules to their array indices
     * for O(1) lookups instead of O(n) indexOf operations.
     */
    private readonly styleIndexMap: Map<StyleParseRule, number>;

    /**
     * Create a parser that targets the given schema, using the given
     * parsing rules.
     *
     * The constructor categorizes rules into tag and style rules, builds index maps
     * for efficient rule lookup during parsing, and determines whether list normalization
     * is needed based on the schema's content model.
     *
     * @param schema The schema into which the parser parses. Defines the document structure
     *               and which node and mark types are available.
     * @param rules The set of [parse rules](#model.ParseRule) that the parser uses, in order
     *              of precedence. Can include both tag-based rules (matching DOM elements) and
     *              style-based rules (matching CSS properties). Rules are processed in the order
     *              provided, with earlier rules taking precedence.
     */
    constructor(schema: Schema, rules: ReadonlyArray<ParseRule>) {
        this._schema = schema;
        const {tags, styles, matchedStyles} = this.initRules(rules);
        this.tags = tags;
        this.styles = styles;
        this._matchedStyles = matchedStyles;

        // Build index maps for O(1) lookups instead of O(n) indexOf
        this.tagIndexMap = new Map(tags.map((rule: TagParseRule, index: number): [TagParseRule, number] => [rule, index]));
        this.styleIndexMap = new Map(styles.map((rule: StyleParseRule, index: number): [StyleParseRule, number] => [rule, index]));

        // Only normalize list elements when lists in the schema can't directly contain themselves
        this.isNormalizeLists = this.checkListNormalization(schema);
    }

    /**
     * Get the list of CSS property names that have associated style parse rules.
     *
     * This is used by the parser to optimize style matching by only checking
     * CSS properties that have relevant rules defined.
     *
     * @returns A readonly array of CSS property names (e.g., ["font-weight", "color"]).
     */
    get matchedStyles(): ReadonlyArray<string> {
        return this._matchedStyles;
    }

    /**
     * Get whether list normalization should be performed during parsing.
     *
     * List normalization is needed when the schema doesn't allow list nodes to
     * directly contain themselves (i.e., nested lists must be wrapped in list items).
     *
     * @returns True if list normalization should be performed, false otherwise.
     */
    get normalizeLists(): boolean {
        return this.isNormalizeLists;
    }

    /**
     * Get the ProseMirror schema this parser targets.
     *
     * @returns The schema that defines the document structure for this parser.
     */
    get schema(): Schema {
        return this._schema;
    }

    /**
     * Construct a DOM parser using the parsing rules listed in a
     * schema's [node specs](#model.NodeSpec.parseDOM) and
     * [mark specs](#model.MarkSpec.parseDOM), reordered by
     * [priority](#model.GenericParseRule.priority).
     *
     * The parser is cached on the schema object for reuse, so subsequent
     * calls with the same schema will return the same parser instance.
     *
     * This is the recommended way to create a parser, as it automatically
     * extracts all parse rules from the schema's node and mark specifications.
     *
     * @param schema The schema to extract parsing rules from. All parseDOM rules
     *               defined in the schema's node and mark specifications will be
     *               collected and sorted by priority.
     * @returns A DOM parser instance configured for the given schema. Returns the
     *          cached instance if one exists, otherwise creates and caches a new one.
     *
     * @example
     * ```typescript
     * const schema = new Schema({
     *   nodes: {
     *     doc: {content: "block+"},
     *     paragraph: {
     *       parseDOM: [{tag: "p"}],
     *       toDOM: () => ["p", 0]
     *     }
     *   }
     * });
     *
     * const parser = DOMParser.fromSchema(schema);
     * const doc = parser.parse(document.querySelector('#content'));
     * ```
     */
    public static fromSchema(schema: Schema): DOMParser {
        schema.cached.domParser ??= new DOMParser(schema, DOMParser.schemaRules(schema));
        return schema.cached.domParser as DOMParser;
    }

    /**
     * Extract and combine all parsing rules from a schema's node and mark specifications,
     * sorted by priority (higher priority rules come first).
     *
     * This method iterates through all mark types and node types in the schema,
     * collecting their parseDOM rules. Each rule is copied to avoid mutation of
     * the original schema specifications. If a rule doesn't specify which mark
     * or node it creates, that information is filled in based on the type it
     * came from.
     *
     * The resulting array is sorted by priority (default 50), with higher priority
     * rules appearing first. This ensures that more specific rules are tried before
     * more general ones during parsing.
     *
     * @param schema The schema to extract rules from. Must contain node and mark
     *               specifications with parseDOM arrays.
     * @returns An array of parse rules sorted by priority in descending order
     *          (highest priority first). Each rule is a copy of the original with
     *          mark/node names filled in where needed.
     *
     * @example
     * ```typescript
     * const schema = new Schema({
     *   nodes: { doc: {}, paragraph: {parseDOM: [{tag: "p"}]} },
     *   marks: { strong: {parseDOM: [{tag: "strong"}]} }
     * });
     *
     * const rules = DOMParser.schemaRules(schema);
     * // Returns array with strong and paragraph rules, sorted by priority
     * ```
     */
    public static schemaRules(schema: Schema): Array<ParseRule> {
        const result: Array<ParseRule> = [];

        /**
         * Insert a rule into the result array at the correct position based on its priority.
         * Rules are sorted in descending priority order (higher priority first).
         *
         * Uses insertion sort to maintain the sorted order. Rules without an explicit
         * priority are assigned the default priority of 50.
         *
         * @param rule The parse rule to insert into the sorted result array.
         */
        const insertByPriority = (rule: ParseRule): void => {
            const priority: number = rule.priority ?? DOMParser.DEFAULT_RULE_PRIORITY;
            let insertIndex = 0;

            for (; insertIndex < result.length; insertIndex++) {
                const existingRule: TagParseRule | StyleParseRule = result[insertIndex];
                const existingPriority: number = existingRule.priority ?? DOMParser.DEFAULT_RULE_PRIORITY;
                if (existingPriority < priority) {
                    break;
                }
            }

            result.splice(insertIndex, 0, rule);
        };

        // Process mark rules
        for (const markName in schema.marks) {
            const markRules: ReadonlyArray<ParseRule> = schema.marks[markName].spec.parseDOM;
            if (markRules) {
                markRules.forEach((originalRule: ParseRule): void => {
                    const rule: TagParseRule | StyleParseRule = DOMParser.copy(originalRule);

                    // Set the mark name if not already specified
                    if (!(rule.mark || rule.ignore || (rule as StyleParseRule).clearMark)) {
                        rule.mark = markName;
                    }

                    insertByPriority(rule);
                });
            }
        }

        // Process node rules
        for (const nodeName in schema.nodes) {
            const nodeRules: ReadonlyArray<TagParseRule> = schema.nodes[nodeName].spec.parseDOM;
            if (nodeRules) {
                nodeRules.forEach((originalRule: TagParseRule): void => {
                    const rule: TagParseRule = DOMParser.copy(originalRule);

                    // Set the node name if not already specified
                    if (!(rule.node || rule.ignore || rule.mark)) {
                        rule.node = nodeName;
                    }

                    insertByPriority(rule);
                });
            }
        }

        return result;
    }

    /**
     * Create a shallow copy of an object, copying only its own enumerable properties.
     *
     * This is used to create mutable copies of parse rules from schema specifications
     * without modifying the original schema. Only properties directly owned by the
     * object are copied (not inherited properties).
     *
     * @param obj The object to copy. Must be a non-null object.
     * @returns A shallow copy of the object with all own enumerable properties.
     *          Property values are copied by reference (not deep cloned).
     */
    private static copy<T extends object>(obj: T): T {
        const copy = {} as T;
        for (const prop in obj) {
            if (hasOwnProperty(obj, prop)) {
                copy[prop] = obj[prop];
            }
        }
        return copy;
    }

    /**
     * Find the first matching tag parse rule for the given DOM element.
     *
     * This method iterates through the parser's tag rules and returns the first rule
     * that matches the given element's tag selector, namespace, and parsing context.
     * If a rule has a getAttrs function, it's called to compute or validate attributes,
     * and the rule is skipped if it returns false.
     *
     * @param dom The DOM node to match against tag rules. Will be cast to Element
     *            for selector matching and to HTMLElement for getAttrs calls.
     * @param context The current parsing context, used to check context restrictions
     *                defined in the rules (e.g., "paragraph/" or "blockquote/paragraph/").
     * @param after Optional rule to start searching after. Used when iterating through
     *              multiple matching rules for the same element. If provided, the search
     *              starts immediately after this rule in the rules array.
     * @returns The first matching tag parse rule with its attrs property potentially
     *          modified by getAttrs, or undefined if no matching rule is found.
     *
     * @remarks
     * **Side Effect Warning**: This method may mutate the returned rule's attrs property
     * when getAttrs is defined. This is intentional and expected by the parsing context,
     * which relies on the attrs being set on the rule object.
     */
    public matchTag(dom: Node, context: DOMParseContext, after?: TagParseRule): TagParseRule | undefined {
        const startIndex: number = after ? (this.tagIndexMap.get(after) ?? -1) + 1 : 0;
        const domElement = dom as Element;

        for (let i = startIndex; i < this.tags.length; i++) {
            const rule: TagParseRule = this.tags[i];

            if (!this.isTagRuleApplicable(domElement, rule, context)) {
                continue;
            }

            if (rule.getAttrs) {
                const htmlElement = dom as HTMLElement;
                const attrs: Attrs | false = rule.getAttrs(htmlElement);
                if (attrs === false) {
                    continue;
                }
                // Mutate the rule to set attrs (this is expected by parsing context)
                rule.attrs = attrs || undefined;
            }

            return rule;
        }

        return undefined;
    }

    /**
     * Find the first matching style parse rule for the given CSS property and value.
     *
     * This method iterates through the parser's style rules and returns the first rule
     * that matches the given property name and value. Style rules can match either
     * just a property name (e.g., "font-weight") or a property-value pair
     * (e.g., "font-weight=bold"). If a rule has a getAttrs function, it's called
     * with the value to compute or validate attributes.
     *
     * @param prop The CSS property name to match (e.g., "font-weight", "color", "text-decoration").
     *             Must exactly match the property name portion of the style rule.
     * @param value The CSS property value to match (e.g., "bold", "#ff0000", "underline").
     *              This is checked against style rules that specify a value (property=value format).
     * @param context The current parsing context, used to check context restrictions
     *                defined in the rules.
     * @param after Optional rule to start searching after. Used when iterating through
     *              multiple matching rules for the same property-value pair. If provided,
     *              the search starts immediately after this rule in the rules array.
     * @returns The first matching style parse rule with its attrs property potentially
     *          modified by getAttrs, or undefined if no matching rule is found.
     *
     * @remarks
     * **Side Effect Warning**: This method may mutate the returned rule's attrs property
     * when getAttrs is defined. This is intentional and expected by the parsing context.
     *
     * @example
     * ```typescript
     * // Match a simple property rule: {style: "font-weight"}
     * const rule1 = parser.matchStyle("font-weight", "bold", context);
     *
     * // Match a property-value rule: {style: "font-weight=bold"}
     * const rule2 = parser.matchStyle("font-weight", "bold", context);
     * ```
     */
    public matchStyle(prop: string, value: string, context: DOMParseContext, after?: StyleParseRule): StyleParseRule | undefined {
        const startIndex: number = after ? (this.styleIndexMap.get(after) ?? -1) + 1 : 0;

        for (let i = startIndex; i < this.styles.length; i++) {
            const rule: StyleParseRule = this.styles[i];

            if (!this.isStyleRuleApplicable(rule, prop, value, context)) {
                continue;
            }

            if (rule.getAttrs) {
                const attrs: Attrs | false = rule.getAttrs(value);
                if (attrs === false) {
                    continue;
                }
                // Mutate the rule to set attrs (this is expected by parsing context)
                rule.attrs = attrs || undefined;
            }

            return rule;
        }

        return undefined;
    }

    /**
     * Parse a document from the content of a DOM node.
     *
     * This method creates a complete ProseMirror document by parsing the given DOM node
     * and its children according to the parser's rules. The resulting document will
     * conform to the parser's schema constraints.
     *
     * @param dom The DOM node whose content should be parsed. Can be any DOM node type
     *            (Element, Text, DocumentFragment, etc.). The node's children will be
     *            recursively parsed. Can also be a HTML string.
     * @param options Optional parsing configuration object:
     *                - `preserveWhitespace`: Controls whitespace handling (boolean or "full")
     *                - `findPositions`: Array of DOM nodes to track positions for
     *                - `from`: Starting index in the DOM node's children
     *                - `to`: Ending index in the DOM node's children
     *                - `topNode`: The node type to use as document root
     *                - `topMatch`: Content match to use for the document
     *                - `context`: Additional parsing context
     * @returns A ProseMirror node representing the parsed document. This will be a
     *          complete, valid node according to the schema's constraints.
     *
     * @example
     * ```typescript
     * const parser = DOMParser.fromSchema(mySchema);
     *
     * // Parse an entire document
     * const doc = parser.parse(document.body);
     *
     * // Parse with options
     * const doc2 = parser.parse(domElement, {
     *   preserveWhitespace: true,
     *   from: 0,
     *   to: 10
     * });
     * ```
     */
    public parse(dom: Node | Element | string | null, options: ParseOptions = {}): PmNode | undefined {
        if(dom === null) {
            return undefined;
        }

        if(typeof dom === 'string') {
            const contentContainer = document.createElement('div');
            contentContainer.innerHTML = dom;
            dom = document.createDocumentFragment().appendChild(contentContainer);
        }

        const context: DOMParseContext = DOMParseContextFactory.createParseContext(this, options, false);
        context.addAll(dom, Mark.none, options.from, options.to);
        return context.finish() as PmNode;
    }

    /**
     * Parses the content of the given DOM node, like
     * [`parse`](#model.DOMParser.parse), and takes the same set of
     * options. But unlike that method, which produces a whole node,
     * this one returns a slice that is open at the sides, meaning that
     * the schema constraints aren't applied to the start of nodes to
     * the left of the input and the end of nodes at the end.
     *
     * This is particularly useful for parsing content that will be inserted
     * into an existing document, such as clipboard content or drag-and-drop data,
     * where you want to preserve the structure without forcing it to be a
     * complete document.
     *
     * @param dom The DOM node whose content should be parsed. Can be any DOM node type.
     *            The content will be parsed more leniently than in `parse()`, allowing
     *            partial structures.
     * @param options Optional parsing configuration object (same as {@link parse}):
     *                - `preserveWhitespace`: Controls whitespace handling
     *                - `findPositions`: Array of DOM nodes to track positions for
     *                - `from`: Starting index in the DOM node's children
     *                - `to`: Ending index in the DOM node's children
     *                - `topNode`: The node type to use as root
     *                - `topMatch`: Content match to use
     *                - `context`: Additional parsing context
     * @returns A slice representing the parsed content with open sides. The slice's
     *          `openStart` and `openEnd` properties indicate how many parent nodes
     *          are "open" at the start and end, allowing the content to be inserted
     *          flexibly into different contexts.
     *
     * @example
     * ```typescript
     * const parser = DOMParser.fromSchema(mySchema);
     *
     * // Parse clipboard content as a slice
     * const slice = parser.parseSlice(clipboardData);
     *
     * // Insert the slice into a document at a position
     * const tr = state.tr.replaceRange(from, to, slice);
     * ```
     */
    public parseSlice(dom: Node, options: ParseOptions = {}): Slice {
        const context: DOMParseContext = DOMParseContextFactory.createParseContext(this, options, true);
        context.addAll(dom, Mark.none, options.from, options.to);
        return Slice.maxOpen(context.finish() as Fragment);
    }

    /**
     * Check if a tag parse rule is applicable to the given DOM element and context.
     *
     * This method performs three checks in sequence:
     * 1. Does the element match the rule's CSS selector?
     * 2. Does the element's namespace match the rule's namespace (if specified)?
     * 3. Does the current parsing context match the rule's context restriction (if specified)?
     *
     * @param domElement The DOM element to check. Must be a valid Element object
     *                   with support for the matches() method (or legacy equivalents).
     * @param rule The tag parse rule to evaluate. Contains the CSS selector, optional
     *             namespace restriction, and optional context restriction.
     * @param context The current parsing context, which tracks the parent node hierarchy.
     *                Used to evaluate context restrictions like "paragraph/" or "blockquote/".
     * @returns True if the rule matches the element and context (all checks pass),
     *          false if any check fails.
     */
    private isTagRuleApplicable(domElement: Element, rule: TagParseRule, context: DOMParseContext): boolean {
        // Check if the element matches the tag selector
        if (!this.matches(domElement, rule.tag)) {
            return false;
        }

        // Check namespace if specified
        if (!isUndefinedOrNull(rule.namespace) && (domElement as HTMLElement).namespaceURI !== rule.namespace) {
            return false;
        }

        // Check context if specified
        if (rule.context) {
            if (!context.matchesContext(rule.context)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check if a style parse rule is applicable to the given property, value, and context.
     *
     * The style string in the rule can take two forms:
     * - Property only: "font-weight" (matches any value of that property)
     * - Property-value pair: "font-weight=bold" (matches only that specific value)
     *
     * This method performs three checks in sequence:
     * 1. Does the style property name match the rule's property?
     * 2. Does the current parsing context match the rule's context restriction (if specified)?
     * 3. If the rule specifies a value, does it match the given value?
     *
     * @param rule The style parse rule to evaluate. Contains the style specification
     *             (property or property=value format) and optional context restriction.
     * @param prop The CSS property name to check (e.g., "font-weight", "color").
     *             Must exactly match the property portion of the rule's style.
     * @param value The CSS property value to check (e.g., "bold", "#ff0000").
     *              Only relevant when the rule specifies a value (property=value format).
     * @param context The current parsing context, which tracks the parent node hierarchy.
     *                Used to evaluate context restrictions.
     * @returns True if the rule matches the property, value, and context (all checks pass),
     *          false if any check fails.
     */
    private isStyleRuleApplicable(rule: StyleParseRule, prop: string, value: string, context: DOMParseContext): boolean {
        const style: string = rule.style;

        // Check if the style starts with the property name
        if (!style.startsWith(prop)) {
            return false;
        }

        // Check context if specified
        if (rule.context) {
            if (!context.matchesContext(rule.context)) {
                return false;
            }
        }

        // Check if the style string matches the property and value
        if (style.length > prop.length) {
            // Style has a value specification (e.g., "font-weight=bold")
            const hasEqualsSign: boolean = style.charCodeAt(prop.length) === DOMParser.EQUALS_CHAR_CODE;
            const valueMatches: boolean = style.slice(prop.length + 1) === value;

            if (!hasEqualsSign || !valueMatches) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check if a parse rule is a tag-based rule (targets DOM elements).
     *
     * @param rule The parse rule to check.
     * @returns True if the rule has a tag property, false otherwise.
     */
    private isTagRule(rule: ParseRule): boolean {
        return !isUndefinedOrNull((rule as TagParseRule).tag);
    }

    /**
     * Check if a parse rule is a style-based rule (targets CSS properties).
     *
     * @param rule The parse rule to check.
     * @returns True if the rule has a style property, false otherwise.
     */
    private isStyleRule(rule: ParseRule): boolean {
        return !isUndefinedOrNull((rule as StyleParseRule).style);
    }

    /**
     * Test if a DOM element matches a CSS selector.
     *
     * Uses the standard Element.matches() method, with fallbacks for legacy browsers:
     * - `msMatchesSelector` for Internet Explorer
     * - `webkitMatchesSelector` for old WebKit browsers (Safari, old Chrome)
     * - `mozMatchesSelector` for old Gecko browsers (Firefox)
     *
     * The method tries each implementation in order of preference (standard first,
     * then vendor-prefixed versions) and returns false if none are available.
     *
     * @param dom The DOM element to test. Must be a valid Element object.
     * @param selector The CSS selector to match against (e.g., "p", ".class", "#id", "[attr]").
     *                 Supports all standard CSS selector syntax.
     * @returns True if the element matches the selector, false if it doesn't match
     *          or if no matching method is available.
     */
    private matches(dom: Element, selector: string): boolean {
        if ('matches' in dom && typeof dom.matches === 'function') {
            return dom.matches(selector);
        }
        const domWithLegacy = dom as Element & {
            msMatchesSelector?: (selector: string) => boolean;
            webkitMatchesSelector?: (selector: string) => boolean;
            mozMatchesSelector?: (selector: string) => boolean;
        };
        if (domWithLegacy.msMatchesSelector) {
            return domWithLegacy.msMatchesSelector(selector);
        }
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        if (domWithLegacy.webkitMatchesSelector) {

            // eslint-disable-next-line @typescript-eslint/no-deprecated
            return domWithLegacy.webkitMatchesSelector(selector);
        }
        if (domWithLegacy.mozMatchesSelector) {
            return domWithLegacy.mozMatchesSelector(selector);
        }
        return false;
    }

    /**
     * Initialize and categorize the parse rules into tag rules and style rules.
     *
     * This method separates rules into two categories:
     * - Tag rules: Match DOM elements by CSS selector (have a `tag` property)
     * - Style rules: Match CSS properties (have a `style` property)
     *
     * For style rules, it also extracts the property names (e.g., "font-weight" from
     * "font-weight=bold") and stores them in a Set for efficient lookup. This allows
     * the parser to quickly determine which CSS properties need to be checked during
     * parsing.
     *
     * @param rules The array of parse rules to categorize. Can include both tag-based
     *              and style-based rules in any order.
     * @returns An object containing:
     *          - `tags`: Array of tag parse rules (matching DOM elements)
     *          - `styles`: Array of style parse rules (matching CSS properties)
     *          - `matchedStyles`: Array of unique CSS property names that have rules
     */
    private initRules(rules: ReadonlyArray<ParseRule>): {
        tags: ReadonlyArray<TagParseRule>;
        styles: ReadonlyArray<StyleParseRule>;
        matchedStyles: ReadonlyArray<string>;
    } {
        const tags: Array<TagParseRule> = [];
        const styles: Array<StyleParseRule> = [];
        const matchedStylesSet = new Set<string>();

        rules.forEach((rule: ParseRule): void => {
            if (this.isTagRule(rule)) {
                tags.push(rule as TagParseRule);
            } else if (this.isStyleRule(rule)) {
                const styleRule = rule as StyleParseRule;
                const match: RegExpExecArray = DOMParser.REGEX_STYLE_PROP_NAME.exec(styleRule.style);
                const propertyName: string = match?.[0];

                if (propertyName) {
                    matchedStylesSet.add(propertyName);
                }

                styles.push(styleRule);
            }
        });

        return {tags, styles, matchedStyles: Array.from(matchedStylesSet)};
    }

    /**
     * Check if list normalization is required for this parser's schema.
     *
     * List normalization is a process that wraps nested list elements in appropriate
     * list item nodes when the schema doesn't allow direct nesting of list nodes.
     *
     * This method checks if any list tags (ul, ol) in the parse rules map to node types
     * that can contain themselves. If they can, normalization is not needed. If they
     * cannot (which is the typical case), normalization must be performed during parsing
     * to ensure nested lists are properly wrapped in list items.
     *
     * @param schema The schema to check for list normalization requirements. The schema's
     *               content model determines whether list nodes can contain themselves.
     * @returns True if list normalization should be performed (lists cannot directly contain
     *          themselves), false if normalization is not needed (lists can contain themselves).
     */
    private checkListNormalization(schema: Schema): boolean {
        return !this.tags.some((tagParseRule: TagParseRule): boolean => {
            // Check if this is a list tag rule
            if (!DOMParser.REGEX_LIST_TAG.test(tagParseRule.tag) || !tagParseRule.node) {
                return false;
            }

            // Check if the list node can contain itself
            const node: NodeType | undefined = schema.nodes[tagParseRule.node];
            if (!node) {
                return false;
            }
            return Boolean(node.contentMatch.matchType(node));
        });
    }
}





