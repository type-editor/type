import {isUndefinedOrNull} from '@type-editor/commons';
import type {DecorationType, Mappable, MapResult, NodeDecorationOptions, PmDecoration} from '@type-editor/editor-types';
import type {Node} from '@type-editor/model';

import type {DecorationAttrs} from '../types/decoration/DecorationAttrs';
import {AbstractDecorationType} from './AbstractDecorationType';
import {DecorationFactory} from './DecorationFactory';


/**
 * Node decoration type that applies styling or attributes to an entire
 * node in the document. Node decorations span exactly one node.
 *
 * Node decorations are used to add styling or attributes to block-level
 * nodes, such as highlighting an entire paragraph, marking a code block
 * as having an error, or adding a visual indicator to a selected table cell.
 * They wrap the entire node's DOM representation.
 */
export class NodeType extends AbstractDecorationType implements DecorationType {

    /** The node decoration specification with configuration options */
    private readonly _spec: NodeDecorationOptions;
    private readonly _attrs: DecorationAttrs;

    /**
     * Creates a new node decoration type.
     *
     * @param attrs - The attributes to apply to the decorated node
     * @param spec - Optional configuration for the node decoration
     */
    constructor (attrs: DecorationAttrs, spec?: NodeDecorationOptions) {
        super();
        this._attrs = attrs;
        this._spec = spec ?? NodeType.EMPTY_DECORATION_WIDGET_OPTIONS;
    }

    get attrs(): DecorationAttrs {
        return this._attrs;
    }

    /**
     * Node decorations have no side preference since they wrap an entire node.
     *
     * @returns Always 0 for node decorations
     */
    readonly side = 0;

    /**
     * Get the specification object for this node decoration.
     *
     * @returns The node decoration options and configuration
     */
    get spec(): NodeDecorationOptions {
        return this._spec;
    }

    /**
     * Map this decoration through a document change.
     *
     * @param mapping - The mapping object representing document changes
     * @param span - The decoration being mapped
     * @param offset - The current document offset
     * @param oldOffset - The offset in the old document
     * @returns The mapped decoration or null if the node was deleted or split
     */
    public map(mapping: Mappable,
               span: PmDecoration,
               offset: number,
               oldOffset: number): PmDecoration | null {
        const from: MapResult = mapping.mapResult(span.from + oldOffset, 1);
        if (from.deleted) {
            return null;
        }

        const to: MapResult = mapping.mapResult(span.to + oldOffset, -1);
        if (to.deleted || to.pos <= from.pos) {
            return null;
        }
        return DecorationFactory.createDecoration(from.pos - offset, to.pos - offset, this);
    }

    /**
     * Check if this node decoration is valid for the given node and span.
     * A node decoration is valid only if it spans exactly one non-text node.
     *
     * @param node - The parent node containing the decorated node
     * @param span - The decoration span to validate
     * @returns True if the span covers exactly one non-text child node
     */
    public valid(node: Node, span: PmDecoration): boolean {
        const { index, offset } = node.content.findIndex(span.from);
        if (offset !== span.from) {
            return false;
        }

        const child: Node | null = node.maybeChild(index);

        return !isUndefinedOrNull(child)
            && !child.isText
            && offset + child.nodeSize === span.to;
    }

    /**
     * Check if this node type is equal to another decoration type.
     *
     * @param other - The other decoration type to compare with
     * @returns True if the types are equal
     */
    public eq(other: DecorationType): boolean {
        return this === other
            || (other instanceof NodeType
                && this.compareObjs(this._attrs, other.attrs)
                && this.compareObjs(this._spec as Record<string, unknown>, other.spec as Record<string, unknown>));
    }

    /**
     * Clean up this decoration. Node decorations have no cleanup needed.
     */
    public destroy(): void {
        /* empty */
    }
}
