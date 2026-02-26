import type {DecorationType, InlineDecorationOptions, PmDecoration} from '@type-editor/editor-types';
import type {Mappable} from '@type-editor/editor-types';
import type {Node} from '@type-editor/model';

import type {DecorationAttrs} from '../types/decoration/DecorationAttrs';
import {AbstractDecorationType} from './AbstractDecorationType';
import {DecorationFactory} from './DecorationFactory';


/**
 * Inline decoration type that applies styling or attributes to a range
 * of content without changing the document structure.
 *
 * Inline decorations are used to add visual styling or data attributes to
 * a range of content, such as highlighting search results, showing tracked
 * changes, or marking spelling errors. They render as inline elements (like
 * `<span>`) that wrap the decorated content.
 */
export class InlineType extends AbstractDecorationType implements DecorationType {

    /** The inline decoration specification with configuration options */
    private readonly _spec: InlineDecorationOptions;
    private readonly _attrs: DecorationAttrs;

    /**
     * Creates a new inline decoration type.
     *
     * @param attrs - The attributes to apply to the decorated range
     * @param spec - Optional configuration for the inline decoration
     */
    constructor (attrs: DecorationAttrs, spec?: InlineDecorationOptions) {
        super();
        this._attrs = attrs;
        this._spec = spec ?? InlineType.EMPTY_DECORATION_WIDGET_OPTIONS;
    }

    /**
     * The attributes to apply to the decorated range (class, style, data-*, etc.)
     * */
    get attrs(): DecorationAttrs {
        return this._attrs;
    }

    /**
     * Get the specification object for this inline decoration.
     *
     * @returns The inline decoration options including inclusiveStart and inclusiveEnd
     */
    get spec(): InlineDecorationOptions {
        return this._spec;
    }

    /**
     * Inline decorations have no side preference since they span a range.
     *
     * @returns Always 0 for inline decorations
     */
    readonly side = 0;

    /**
     * Map this decoration through a document change.
     *
     * @param mapping - The mapping object representing document changes
     * @param span - The decoration being mapped
     * @param offset - The current document offset
     * @param oldOffset - The offset in the old document
     * @returns The mapped decoration or null if the range collapsed
     */
    public map(mapping: Mappable,
               span: PmDecoration,
               offset: number,
               oldOffset: number): PmDecoration | null {
        const from: number = mapping.map(
            span.from + oldOffset,
            this._spec.inclusiveStart ? -1 : 1
        ) - offset;

        const to: number = mapping.map(
            span.to + oldOffset,
            this._spec.inclusiveEnd ? 1 : -1
        ) - offset;

        return from >= to ? null : DecorationFactory.createDecoration(from, to, this);
    }

    /**
     * Check if this inline decoration is valid for the given node and span.
     *
     * @param _ - The node (unused)
     * @param span - The decoration span to validate
     * @returns True if the span has a positive length
     */
    public valid(_: Node, span: PmDecoration): boolean {
        return span.from < span.to;
    }

    /**
     * Check if this inline type is equal to another decoration type.
     *
     * @param other - The other decoration type to compare with
     * @returns True if the types are equal
     */
    public eq(other: DecorationType): boolean {
        return this === other
            || (other instanceof InlineType
                && this.compareObjs(this._attrs, other.attrs)
                && this.compareObjs(this._spec as Record<string, unknown>, other.spec as Record<string, unknown>));
    }

    /**
     * Check if a decoration is an inline decoration.
     *
     * @param span - The decoration to check
     * @returns True if the decoration is an inline type
     */
    public static is(span: PmDecoration): boolean {
        return span.type instanceof InlineType;
    }

    /**
     * Clean up this decoration. Inline decorations have no cleanup needed.
     */
    public destroy(): void {
        /* empty */
    }
}
