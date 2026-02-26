import type {DecorationType, DecorationWidgetOptions, Mappable, PmDecoration} from '@type-editor/editor-types';

import type {WidgetConstructor} from '../types/decoration/WidgetConstructor';
import {AbstractDecorationType} from './AbstractDecorationType';
import {DecorationFactory} from './DecorationFactory';


/**
 * Widget decoration type that represents a DOM node inserted at a specific
 * position in the document. Widgets appear at a single position and don't
 * span a range.
 *
 * Widgets are useful for adding inline UI elements like mention suggestions,
 * inline buttons, or custom markers that don't correspond to actual document
 * content. The widget's DOM node is inserted into the editor at the specified
 * position without affecting the document model.
 */
export class WidgetType extends AbstractDecorationType implements DecorationType {

    /** The widget specification with configuration options */
    private readonly _spec: DecorationWidgetOptions;
    /** Side value determining widget placement relative to its position */
    private readonly _side: number;
    /** Function that constructs the DOM node for this widget */
    private readonly _toDOM: WidgetConstructor;

    /**
     * Creates a new widget decoration type.
     *
     * @param toDOM - Function that constructs the DOM node for this widget
     * @param spec - Optional configuration for the widget decoration
     */
    constructor (toDOM: WidgetConstructor, spec?: DecorationWidgetOptions) {
        super();
        this._toDOM = toDOM;
        this._spec = spec ?? WidgetType.EMPTY_DECORATION_WIDGET_OPTIONS;
        this._side = this._spec.side ?? 0;
    }

    get toDOM(): WidgetConstructor {
        return this._toDOM;
    }

    /**
     * Get the specification object for this widget decoration.
     *
     * @returns The widget decoration options including side, stopEvent, ignoreSelection, and key
     */
    get spec(): DecorationWidgetOptions {
        return this._spec;
    }

    /**
     * Get the side value that determines whether the widget appears
     * before (-1) or after (1) the position, or at the position (0).
     *
     * This affects how the widget is positioned relative to the cursor
     * and other content at the same position.
     *
     * @returns The side value: -1 (before), 0 (at), or 1 (after)
     */
    get side(): number {
        return this._side;
    }

    /**
     * Map this decoration through a document change.
     *
     * @param mapping - The mapping object representing document changes
     * @param span - The decoration being mapped
     * @param offset - The current document offset
     * @param oldOffset - The offset in the old document
     * @returns The mapped decoration or null if the position was deleted
     */
    public map(mapping: Mappable,
               span: PmDecoration,
               offset: number,
               oldOffset: number): PmDecoration | null {
        const { pos, deleted } = mapping.mapResult(
            span.from + oldOffset,
            this._side < 0 ? -1 : 1
        );
        return deleted ? null : DecorationFactory.createDecoration(pos - offset, pos - offset, this);
    }

    /**
     * Check if this widget decoration is valid. Widgets are always valid.
     *
     * @returns Always returns true
     */
    public valid(): boolean {
        return true;
    }

    /**
     * Check if this widget type is equal to another decoration type.
     *
     * @param other - The other decoration type to compare with
     * @returns True if the types are equal
     */
    public eq(other: WidgetType): boolean {
        if (this === other) {
            return true;
        }

        if (!(other instanceof WidgetType)) {
            return false;
        }

        // Compare by key if both have keys
        if (this._spec.key && this._spec.key === other.spec.key) {
            return true;
        }

        // Compare by toDOM function and specs
        return this._toDOM === other.toDOM
            && this.compareObjs(
                this._spec as Record<string, unknown>,
                other.spec as Record<string, unknown>
            );
    }

    /**
     * Clean up this widget decoration when it's removed from the document.
     * Calls the optional destroy callback if specified.
     *
     * @param node - The DOM node being destroyed
     */
    public destroy(node: Node): void {
        if (this._spec.destroy) {
            this._spec.destroy(node);
        }
    }
}
