import {isUndefinedOrNull} from '@type-editor/commons';

import type {NodeType} from '../schema/NodeType';
import type {PmElement} from '../types/elements/PmElement';
import type {TextNodeJSON} from '../types/elements/TextNodeJSON';
import type {Attrs} from '../types/schema/Attrs';
import {ElementType} from './ElementType';
import {Fragment} from './Fragment';
import type {Mark} from './Mark';
import {Node as PmNode} from './Node';

/**
 * A text node represents a piece of text in the document. Text nodes
 * are leaf nodes that contain only text content and cannot have children.
 * They can have marks applied to them (like bold, italic, links, etc.).
 */
export class TextNode extends PmNode implements PmElement {

    /**
     * Create a text node. For most use cases, you should use
     * Schema's text() method instead of calling this directly.
     *
     * @param type The node type (should be the text node type from the schema).
     * @param attrs The node's attributes.
     * @param content The text content of this node.
     * @param marks The marks applied to this text node.
     * @throws {RangeError} If the content is empty (empty text nodes are not allowed).
     */
    constructor(type: NodeType,
                attrs: Attrs,
                content: string,
                marks?: ReadonlyArray<Mark>) {

        super(type, attrs, Fragment.empty, marks, content);

        if (!content) {
            throw new RangeError('Empty text nodes are not allowed');
        }
    }

    get elementType(): ElementType {
        return ElementType.TextNode;
    }

    /**
     * The text content of this text node. For text nodes, this returns
     * the actual text string contained in the node.
     *
     * @returns The text content as a string.
     */
    get textContent(): string {
        return this._text;
    }

    /**
     * The size of this text node, which equals the length of its text content.
     */
    get nodeSize(): number {
        return this._text.length;
    }

    /**
     * Type guard to check if a value is a TextNode or Node.
     *
     * @param value The value to check for TextNode or Node type.
     * @returns True if the value is a TextNode or Node instance (elementType is 'TextNode' or 'Node').
     * @private
     */
    public static isNode(value: unknown): value is PmNode {
        return !isUndefinedOrNull(value)
            && typeof value === 'object'
            && 'elementType' in value
            && (value.elementType === ElementType.Node || value.elementType === ElementType.TextNode);
    }

    /**
     * Type guard to check if a value is a TextNode.
     *
     * @param value The value to check for TextNode type.
     * @returns True if the value is a TextNode instance (elementType is 'TextNode').
     * @private
     */
    public static isTextNode(value: unknown): value is TextNode {
        return !isUndefinedOrNull(value)
            && typeof value === 'object'
            && 'elementType' in value
            && (value.elementType === ElementType.TextNode);
    }

    /**
     * Return a string representation of this text node for debugging purposes.
     *
     * @returns A debug string representation of this node.
     */
    public toString(): string {
        if (this.nodeType.spec.toDebugString) {
            return this.nodeType.spec.toDebugString(this);
        }
        return this.wrapMarks(this._marks, JSON.stringify(this._text));
    }

    /**
     * Get the text content between the given positions within this text node.
     *
     * @param from The starting position within the text.
     * @param to The ending position within the text.
     * @returns The text content between the positions.
     */
    public textBetween(from: number, to: number): string {
        return this._text.slice(from, to);
    }

    /**
     * Create a copy of this text node with the given marks applied.
     *
     * @param marks The marks to apply to the new text node.
     * @returns A new text node with the specified marks, or this node if marks are unchanged.
     */
    public mark(marks: ReadonlyArray<Mark>): TextNode {
        return marks === this._marks ? this : new TextNode(this.nodeType, this._attrs, this._text, marks);
    }

    /**
     * Create a copy of this text node with different text content.
     *
     * @param text The new text content.
     * @returns A new text node with the specified text, or this node if text is unchanged.
     */
    withText(text: string): TextNode {
        if (text === this._text) {
            return this;
        }
        return new TextNode(this.nodeType, this._attrs, text, this._marks);
    }

    /**
     * Create a copy of this text node containing only the text between
     * the given positions.
     *
     * @param from The starting position. Defaults to 0.
     * @param to The ending position. Defaults to the end of the text.
     * @returns A new text node with the specified text range, or this node if the range is unchanged.
     */
    public cut(from = 0, to?: number): TextNode {
        const text: string = this._text;
        const toPos: number = to ?? text.length;

        if (from === 0 && toPos === text.length) {
            return this;
        }

        return this.withText(text.slice(from, toPos));
    }

    /**
     * Test whether this text node is equal to another node.
     *
     * @param other The node to compare with.
     * @returns `true` if the nodes have the same markup and text content, `false` otherwise.
     */
    public eq(other: PmNode): boolean {
        return this.sameMarkup(other) && this._text === other.text;
    }

    /**
     * Return a JSON-serializable representation of this text node.
     *
     * @returns A JSON representation of this text node.
     */
    public toJSON(): TextNodeJSON {
        const base: TextNodeJSON = super.toJSON();
        base.text = this._text;
        return base;
    }
}
