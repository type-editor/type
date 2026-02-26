import type {
    DecorationSpec,
    DecorationType,
    DecorationWidgetOptions,
    InlineDecorationOptions,
    Mappable,
    NodeDecorationOptions,
    PmDecoration
} from '@type-editor/editor-types';

import type {DecorationAttrs} from '../types/decoration/DecorationAttrs';
import type {WidgetConstructor} from '../types/decoration/WidgetConstructor';
import {InlineType} from './InlineType';
import {NodeType} from './NodeType';
import {WidgetType} from './WidgetType';


/**
 * Decoration objects can be provided to the view through the
 * [`decorations` prop](#view.EditorProps.decorations). They come in
 * several variants—see the static members of this class for details.
 *
 * Decorations allow you to add styling, attributes, or widgets to the
 * editor view without modifying the underlying document. They are used
 * for features like syntax highlighting, collaborative cursors, search
 * results, and inline UI elements.
 *
 * Provides static methods to create different types of decorations:
 * - Widget decorations: Insert DOM nodes at specific positions
 * - Inline decorations: Apply styling to ranges of inline content
 * - Node decorations: Apply styling to entire block nodes
 *
 * @example
 * ```typescript
 * // Create an inline decoration to highlight text
 * Decoration.inline(from, to, {class: "highlight"})
 *
 * // Create a widget decoration to insert a DOM element
 * Decoration.widget(pos, () => document.createElement("button"))
 *
 * // Create a node decoration to style a block
 * Decoration.node(from, to, {class: "selected-paragraph"})
 * ```
 */
export class Decoration implements PmDecoration {

    /** The start position of this decoration in the document */
    private readonly _from: number;
    /** The end position of this decoration in the document */
    private readonly _to: number;
    /** The decoration type (widget, inline, or node) */
    private readonly _type: DecorationType;

    /**
     * Creates a new decoration instance.
     *
     * @param from - The start position of the decoration
     * @param to - The end position. Will be the same as `from` for widget decorations
     * @param type - The type of decoration (widget, inline, or node)
     */
    constructor(from: number, to: number, type: DecorationType) {
        this._from = from;
        this._to = to;
        this._type = type;
    }

    /**
     * Get the start position of this decoration.
     *
     * @returns The start position in the document (0-indexed)
     */
    get from(): number {
        return this._from;
    }

    /**
     * Get the end position of this decoration.
     *
     * For widget decorations, this will equal `from` since widgets don't span a range.
     *
     * @returns The end position in the document (0-indexed)
     */
    get to(): number {
        return this._to;
    }

    /**
     * Get the type of this decoration.
     *
     * @returns The decoration type (WidgetType, InlineType, or NodeType)
     */
    get type(): DecorationType {
        return this._type;
    }

    /**
     * The spec provided when creating this decoration. Can be useful
     * if you've stored extra information in that object.
     *
     * @returns The decoration specification with options and custom data
     */
    get spec(): DecorationSpec {
        return this._type.spec;
    }

    /**
     * Check if this is an inline decoration.
     *
     * @returns True if this decoration applies styling to a range of inline content
     */
    get inline(): boolean {
        return this._type instanceof InlineType;
    }

    /**
     * Check if this is a widget decoration.
     *
     * @returns True if this decoration inserts a DOM widget at a position
     */
    get widget(): boolean {
        return this._type instanceof WidgetType;
    }

    /**
     * Creates a widget decoration, which is a DOM node that's shown in
     * the document at the given position. It is recommended that you
     * delay rendering the widget by passing a function that will be
     * called when the widget is actually drawn in a view, but you can
     * also directly pass a DOM node. `getPos` can be used to find the
     * widget's current document position.
     *
     * Widget decorations are useful for adding inline UI elements like
     * buttons, icons, mention suggestions, or other interactive components
     * that don't correspond to actual document content.
     *
     * @param pos - The position in the document where the widget should appear
     * @param toDOM - A function that creates the DOM node for this widget, or a DOM node directly.
     *                The function receives the editor view and a getPos function that returns
     *                the widget's current position.
     * @param spec - Optional configuration:
     *               - `side`: Number indicating whether widget should appear before (-1), at (0), or after (1) the position
     *               - `stopEvent`: Function to prevent certain events from bubbling out of the widget
     *               - `ignoreSelection`: If true, selection near the widget won't be drawn
     *               - `key`: Unique key for widget comparison and reuse
     *               - `destroy`: Callback invoked when the widget is removed
     * @returns A new widget decoration
     *
     * @example
     * ```typescript
     * // Create a button widget
     * const widget = Decoration.widget(10, (view, getPos) => {
     *   const button = document.createElement("button");
     *   button.textContent = "Insert";
     *   button.onclick = () => {
     *     const pos = getPos();
     *     // Insert content at position
     *   };
     *   return button;
     * }, { side: 1 });
     * ```
     */
    public static widget(pos: number, toDOM: WidgetConstructor, spec?: DecorationWidgetOptions): Decoration {
        return new Decoration(pos, pos, new WidgetType(toDOM, spec));
    }

    /**
     * Creates an inline decoration, which adds the given attributes to
     * each inline node between `from` and `to`.
     *
     * Inline decorations are rendered as inline elements (like `<span>`)
     * that wrap the decorated content. They are useful for:
     * - Highlighting search results
     * - Showing spell-check errors
     * - Marking tracked changes
     * - Adding temporary styling
     *
     * @param from - The start position of the range to decorate
     * @param to - The end position of the range to decorate
     * @param attrs - Attributes to apply to the decorated range. Can include:
     *                - `class`: CSS class name(s)
     *                - `style`: Inline CSS styles
     *                - `nodeName`: HTML tag name (default: "span")
     *                - Any other HTML attributes (e.g., `data-*`, `title`)
     * @param spec - Optional configuration:
     *               - `inclusiveStart`: If true, content inserted at the start position is included in the decoration
     *               - `inclusiveEnd`: If true, content inserted at the end position is included in the decoration
     * @returns A new inline decoration
     *
     * @example
     * ```typescript
     * // Highlight search results
     * const highlight = Decoration.inline(5, 15, {
     *   class: "search-result",
     *   style: "background-color: yellow"
     * });
     *
     * // Mark a spelling error
     * const error = Decoration.inline(20, 25, {
     *   class: "spelling-error",
     *   title: "Possible spelling mistake"
     * });
     * ```
     */
    public static inline(from: number, to: number, attrs: DecorationAttrs, spec?: InlineDecorationOptions): Decoration {
        return new Decoration(from, to, new InlineType(attrs, spec));
    }

    /**
     * Creates a node decoration. `from` and `to` should point precisely
     * before and after a node in the document. That node, and only that
     * node, will receive the given attributes.
     *
     * Node decorations wrap the entire DOM representation of a block-level
     * node. They are useful for:
     * - Highlighting selected blocks
     * - Marking nodes with errors or warnings
     * - Adding visual indicators to specific paragraphs or code blocks
     * - Showing collaborative editing cursors at block level
     *
     * @param from - The start position of the node (must be exactly at node boundary)
     * @param to - The end position of the node (must be exactly at node boundary, equals from + node.nodeSize)
     * @param attrs - Attributes to apply to the node. Can include:
     *                - `class`: CSS class name(s)
     *                - `style`: Inline CSS styles
     *                - Any other HTML attributes (e.g., `data-*`, `title`)
     * @param spec - Optional configuration for the node decoration
     * @returns A new node decoration
     *
     * @example
     * ```typescript
     * // Highlight a selected paragraph
     * // Assuming a paragraph starts at position 10 and has nodeSize 20
     * const nodeDecoration = Decoration.node(10, 30, {
     *   class: "selected-block",
     *   style: "background-color: lightblue"
     * });
     *
     * // Mark a code block with an error
     * const errorDecoration = Decoration.node(50, 100, {
     *   class: "error-block",
     *   "data-error": "Syntax error on line 3"
     * });
     * ```
     */
    public static node(from: number, to: number, attrs: DecorationAttrs, spec?: NodeDecorationOptions): Decoration {
        return new Decoration(from, to, new NodeType(attrs, spec));
    }

    /**
     * Create a copy of this decoration with new positions.
     *
     * @param from - The new start position
     * @param to - The new end position
     * @returns A new decoration with the same type but different positions
     */
    public copy(from: number, to: number): Decoration {
        return new Decoration(from, to, this.type);
    }

    /**
     * Check if this decoration is equal to another decoration.
     *
     * @param other - The decoration to compare with
     * @param offset - Optional offset to apply to this decoration's positions
     * @returns True if the decorations are equal
     */
    public eq(other: PmDecoration, offset = 0): boolean {
        return this.type.eq(other.type) && this._from + offset === other.from && this._to + offset === other.to;
    }

    /**
     * Map this decoration through a document change.
     *
     * @param mapping - The mapping representing document changes
     * @param offset - The current document offset
     * @param oldOffset - The offset in the old document
     * @returns The mapped decoration or null if it was deleted
     */
    public map(mapping: Mappable, offset: number, oldOffset: number): Decoration {
        return this.type.map(mapping, this, offset, oldOffset) as Decoration;
    }
}
