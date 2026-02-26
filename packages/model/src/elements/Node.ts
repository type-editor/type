import {isUndefinedOrNull} from '@type-editor/commons';

import {replace} from '../replace';
import type {MarkType} from '../schema/MarkType';
import type {NodeType} from '../schema/NodeType';
import type {Schema} from '../schema/Schema';
import type {ContentMatch} from '../types/content-parser/ContentMatch';
import type {MarkJSON} from '../types/elements/MarkJSON';
import type {NodeJSON} from '../types/elements/NodeJSON';
import type {PmElement} from '../types/elements/PmElement';
import type {Attrs} from '../types/schema/Attrs';
import {ElementType} from './ElementType';
import {Fragment} from './Fragment';
import {Mark} from './Mark';
import {ResolvedPos} from './ResolvedPos';
import {Slice} from './Slice';
import {compareDeep} from './util/compare-deep';

/**
 * This class represents a node in the tree that makes up a
 * ProseMirror document. So a document is an instance of `Node`, with
 * children that are also instances of `Node`.
 *
 * Nodes are persistent data structures. Instead of changing them, you
 * create new ones with the content you want. Old ones keep pointing
 * at the old document shape. This is made cheaper by sharing
 * structure between the old and new data as much as possible, which a
 * tree shape like this (without back pointers) makes easy.
 *
 * **Do not** directly mutate the properties of a `Node` object. See
 * [the guide](/docs/guide/#doc) for more information.
 */
export class Node implements PmElement {

    /**
     * A container holding the node's children.
     */
    protected readonly _content: Fragment;
    protected readonly _attrs: Attrs;
    protected readonly _marks: ReadonlyArray<Mark>;
    protected readonly nodeType: NodeType;
    protected _tag: Record<string, number> = {};
    /**
     * For text nodes, this contains the node's text content.
     */
    protected readonly _text: string | undefined;

    /**
     * Create a node. For most use cases, you should use
     * {@link NodeType.create} or Schema's node() method instead of calling this directly.
     *
     * @param type The type of node that this is.
     * @param attrs An object mapping attribute names to values. The kind of
     *              attributes allowed and required are [determined](#model.NodeSpec.attrs) by the node type.
     * @param content A fragment holding the node's children. If null or undefined, defaults to an empty fragment.
     * @param marks The marks (things like whether it is emphasized or part of a link) applied to this node.
     *              Defaults to an empty mark set.
     * @param text For text nodes, this contains the node's text content.
     */
    // Backward compatibility constructor, original prosemirror is less strict
    constructor(type?: NodeType,
                attrs?: Attrs,
                content?: Fragment,
                marks?: ReadonlyArray<Mark>,
                text?: string);
    constructor(type: NodeType,
                attrs: Attrs,
                content?: Fragment,
                marks?: ReadonlyArray<Mark>,
                text?: string) {

        this._content = content || Fragment.empty;
        this._text = text;
        this.nodeType = type;
        this._attrs = attrs;
        this._marks = marks || Mark.none;
    }

    get tag(): Record<string, number> {
        return this._tag;
    }

    set tag(tag: Record<string, number>) {
        this._tag = tag;
    }

    get elementType(): ElementType {
        return ElementType.Node;
    }

    /**
     * A fragment containing the node's children.
     */
    get content(): Fragment {
        return this._content;
    }

    /**
     * For text nodes, this contains the node's text content. For other nodes, returns null.
     */
    get text(): string | null {
        return this._text ?? null;
    }

    /**
     * The type of node that this is.
     */
    get type(): NodeType {
        return this.nodeType;
    }

    /**
     * An object mapping attribute names to values.
     */
    get attrs(): Attrs {
        return this._attrs;
    }

    /**
     * The marks applied to this node.
     */
    get marks(): ReadonlyArray<Mark> {
        return this._marks;
    }

    /**
     * The array of this node's child nodes.
     */
    get children(): ReadonlyArray<Node> {
        return this._content.content;
    }

    /**
     * The size of this node, as defined by the integer-based [indexing
     * scheme](/docs/guide/#doc.indexing). For text nodes, this is the
     * amount of characters. For other leaf nodes, it is one. For
     * non-leaf nodes, it is the size of the content plus two (the
     * start and end token).
     */
    get nodeSize(): number {
        return this.isLeaf ? 1 : 2 + this._content.size;
    }

    /**
     * The number of children that the node has.
     */
    get childCount(): number {
        return this._content.childCount;
    }

    /**
     * Concatenates all the text nodes found in this node and its
     * children.
     */
    get textContent(): string {
        return (this.isLeaf && this.nodeType.spec.leafText)
            ? this.nodeType.spec.leafText(this)
            : this.textBetween(0, this._content.size, '');
    }

    /**
     * Returns this node's first child, or `null` if there are no
     * children.
     */
    get firstChild(): Node | null {
        return this._content.firstChild;
    }

    /**
     * Returns this node's last child, or `null` if there are no
     * children.
     */
    get lastChild(): Node | null {
        return this._content.lastChild;
    }

    /**
     * True when this is a block (non-inline node)
     */
    get isBlock(): boolean {
        return this.nodeType.isBlock;
    }

    /**
     * True when this is a textblock node, a block node with inline
     * content.
     */
    get isTextblock(): boolean {
        return this.nodeType.isTextblock;
    }

    /**
     * True when this node allows inline content.
     * */
    get inlineContent(): boolean {
        return this.nodeType.inlineContent;
    }

    /**
     * True when this is an inline node (a text node or a node that can
     * appear among text).
     */
    get isInline(): boolean {
        return this.nodeType.isInline;
    }

    /**
     * True when this is a text node.
     * */
    get isText(): boolean {
        return this.nodeType.isText;
    }

    /**
     * True when this is a leaf node.
     * */
    get isLeaf(): boolean {
        return this.nodeType.isLeaf;
    }

    /**
     * True when this is an atom, i.e. when it does not have directly
     * editable content. This is usually the same as `isLeaf`, but can
     * be configured with the [`atom` property](#model.NodeSpec.atom)
     * on a node's spec (typically used when the node is displayed as
     * an uneditable [node view](#view.NodeView)).
     */
    get isAtom(): boolean {
        return this.nodeType.isAtom;
    }

    /**
     * Type guard to check if a value is a Node.
     *
     * @param value The value to check for Node type.
     * @returns True if the value is a Node instance (elementType is 'Node').
     * @private
     */
    public static isNode(value: unknown): value is Node {
        return !isUndefinedOrNull(value)
            && typeof value === 'object'
            && 'elementType' in value
            && (value.elementType === ElementType.Node);
    }


    /**
     * Deserialize a node from its JSON representation.
     *
     * Note: NodeJSON as an array is not supported and will throw an error. It is only for backward compatibility.
     *
     * @param schema The schema to use for deserializing the node.
     * @param json The JSON object representing the node.
     * @returns A new Node instance.
     * @throws {RangeError} If the JSON is invalid or the node type doesn't exist in the schema.
     */
    public static fromJSON(schema: Schema, json: NodeJSON | Array<NodeJSON>): Node {
        if (!json) {
            throw new RangeError('Invalid input for Node.fromJSON: json parameter is required');
        }

        if(!Array.isArray(json)) {
            if (!json.type) {
                throw new RangeError('Invalid input for Node.fromJSON: type property is required');
            }

            // Parse marks if present
            let marks: Array<Mark> | undefined;
            if (json.marks) {
                if (!Array.isArray(json.marks)) {
                    throw new RangeError('Invalid mark data for Node.fromJSON: marks must be an array');
                }
                marks = json.marks.map(markJSON => schema.markFromJSON(markJSON));
            }

            // Handle text nodes
            if (json.type === 'text') {
                if (typeof json.text !== 'string') {
                    throw new RangeError('Invalid text node in JSON: text property must be a string');
                }
                return schema.text(json.text, marks);
            }

            // Handle regular nodes
            const content: Fragment = Fragment.fromJSON(schema, json.content);
            const node: Node = schema.nodeType(json.type).create(json.attrs, content, marks);
            node.type.checkAttrs(node.attrs);
            return node;
        } else {
            throw new RangeError('Invalid input for Node.fromJSON: type property is required');
        }


    }

    /**
     * Get the child node at the given index. Raises an error when the
     * index is out of range.
     *
     * @param index The index of the child node to retrieve (0-based).
     * @returns The child node at the specified index.
     * @throws {RangeError} If the index is out of range.
     */
    public child(index: number): Node {
        return this._content.child(index);
    }

    /**
     * Get the child node at the given index, if it exists.
     *
     * @param index The index of the child node to retrieve (0-based).
     * @returns The child node at the specified index, or null if the index is out of range.
     */
    public maybeChild(index: number): Node | null {
        return this._content.maybeChild(index);
    }

    /**
     * Call `f` for every child node, passing the node, it's offset
     * into this parent node, and its index.
     *
     * @param callbackFunc The callback function to invoke for each child node.
     *                     Receives the node, its offset position, and its index.
     */
    public forEach(callbackFunc: (node: Node,
                                  offset: number,
                                  index: number) => void): void {
        this._content.forEach(callbackFunc);
    }

    /**
     * Invoke a callback for all descendant nodes recursively overlapping
     * the given two positions that are relative to start of this
     * node's content. This includes all ancestors of the nodes
     * containing the two positions. The callback is invoked with the
     * node, its position relative to the original node (method receiver),
     * its parent node, and its child index. When the callback returns
     * false for a given node, that node's children will not be
     * recursed over. The last parameter can be used to specify a
     * starting position to count from.
     *
     * @param from The starting position (inclusive).
     * @param to The ending position (exclusive).
     * @param callbackFunc The callback function to invoke for each node.
     *                     Return `false` to skip recursing into a node's children.
     * @param startPos The starting position offset for counting. Defaults to 0.
     */
    public nodesBetween(from: number,
                        to: number,
                        callbackFunc: (node: Node,
                                       pos: number,
                                       parent: Node | null,
                                       // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
                                       index: number) => boolean | void,
                        startPos = 0): void {
        this._content.nodesBetween(from, to, callbackFunc, startPos, this);
    }

    /**
     * Call the given callback for every descendant node. Doesn't
     * descend into a node when the callback returns `false`.
     *
     * @param callbackFunc The callback function to invoke for each descendant node.
     *                     Return `false` to skip recursing into a node's children.
     */
    public descendants(callbackFunc: (node: Node,
                                      pos: number,
                                      parent: Node | null,
                                      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
                                      index: number) => boolean | void): void {
        this.nodesBetween(0, this._content.size, callbackFunc);
    }

    /**
     * Get all text between positions `from` and `to`. When
     * `blockSeparator` is given, it will be inserted to separate text
     * from different block nodes. If `leafText` is given, it'll be
     * inserted for every non-text leaf node encountered, otherwise
     * [`leafText`](#model.NodeSpec.leafText) will be used.
     *
     * @param from The starting position.
     * @param to The ending position.
     * @param blockSeparator Optional string to insert between block nodes.
     * @param leafText Optional string or function to provide text for leaf nodes.
     * @returns The concatenated text content between the positions.
     */
    public textBetween(from: number,
                       to: number,
                       blockSeparator?: string | null,
                       leafText?: null | string | ((leafNode: Node) => string)): string {
        return this._content.textBetween(from, to, blockSeparator, leafText);
    }

    /**
     * Test whether two nodes represent the same piece of document.
     *
     * @param other The node to compare with this node.
     * @returns `true` if the nodes are equal, `false` otherwise.
     */
    public eq(other: Node): boolean {
        return this === other || (this.sameMarkup(other) && this._content.eq(other.content));
    }

    /**
     * Compare the markup (type, attributes, and marks) of this node to
     * those of another. Returns `true` if both have the same markup.
     *
     * @param other The node to compare markup with.
     * @returns `true` if both nodes have the same markup, `false` otherwise.
     */
    public sameMarkup(other: Node): boolean {
        return this.hasMarkup(other.type, other.attrs, other.marks);
    }

    /**
     * Check whether this node's markup correspond to the given type,
     * attributes, and marks.
     *
     * @param type The node type to check against.
     * @param attrs The attributes to check against (defaults to type's default attributes).
     * @param marks The marks to check against (defaults to no marks).
     * @returns `true` if the markup matches, `false` otherwise.
     */
    public hasMarkup(type: NodeType,
                     attrs?: Attrs | null,
                     marks?: ReadonlyArray<Mark>): boolean {
        return this.nodeType === type
            && this.compareAttrsForMarkup(type, attrs || type.defaultAttrs)
            && Mark.sameSet(this._marks, marks || Mark.none);
    }

    /**
     * Compare attributes for markup comparison, excluding attributes marked with
     * excludeFromMarkupComparison.
     *
     * @param type The node type to check against.
     * @param compareAttrs The attributes to compare against.
     * @returns `true` if the attributes match (excluding excluded attributes), `false` otherwise.
     * @private
     */
    private compareAttrsForMarkup(type: NodeType, compareAttrs: Attrs): boolean {
        const thisAttrs = this._attrs;
        const typeAttrs = type.attributeSpecs;

        // Collect attributes that should be compared
        const attrsToCompare: Record<string, unknown> = {};
        const compareAttrsToCompare: Record<string, unknown> = {};

        for (const attrName in typeAttrs) {
            const attrSpec = typeAttrs[attrName];

            // Skip attributes marked for exclusion from markup comparison
            if (attrSpec.excludeFromMarkupComparison) {
                continue;
            }

            attrsToCompare[attrName] = thisAttrs[attrName];
            compareAttrsToCompare[attrName] = compareAttrs[attrName];
        }

        return compareDeep(attrsToCompare, compareAttrsToCompare);
    }

    /**
     * Create a new node with the same markup as this node, containing
     * the given content (or empty, if no content is given).
     *
     * @param content The content for the new node. If null, creates an empty node.
     * @returns A new node with the same markup but different content, or this node if content is unchanged.
     */
    public copy(content: Fragment | null = null): Node {
        if (content === this._content) {
            return this;
        }
        return new Node(this.nodeType, this._attrs, content || Fragment.empty, this._marks);
    }

    /**
     * Create a copy of this node, with the given set of marks instead
     * of the node's own marks.
     *
     * @param marks The marks to apply to the new node.
     * @returns A new node with the specified marks, or this node if marks are unchanged.
     */
    public mark(marks: ReadonlyArray<Mark>): Node {
        return marks === this._marks ? this : new Node(this.nodeType, this._attrs, this._content, marks);
    }

    /**
     * Create a copy of this node with only the content between the
     * given positions. If `to` is not given, it defaults to the end of
     * the node.
     *
     * @param from The starting position.
     * @param to The ending position. Defaults to the end of the node's content.
     * @returns A new node containing only the specified content range.
     */
    public cut(from: number, to: number = this._content.size): Node {
        if (from === 0 && to === this._content.size) {
            return this;
        }
        return this.copy(this._content.cut(from, to));
    }

    /**
     * Cut out the part of the document between the given positions, and
     * return it as a `Slice` object.
     *
     * @param from The starting position.
     * @param to The ending position. Defaults to the end of the node's content.
     * @param includeParents Whether to include parent nodes in the slice. Defaults to false.
     * @returns A Slice object representing the content between the positions.
     */
    public slice(from: number, to: number = this._content.size, includeParents = false): Slice {
        if (from === to) {
            return Slice.empty;
        }

        const $from: ResolvedPos = this.resolve(from);
        const $to: ResolvedPos = this.resolve(to);
        const depth: number = includeParents ? 0 : $from.sharedDepth(to);
        const start: number = $from.start(depth);
        const node: Node = $from.node(depth);
        const content: Fragment = node.content.cut($from.pos - start, $to.pos - start);

        return new Slice(content, $from.depth - depth, $to.depth - depth);
    }

    /**
     * Replace the part of the document between the given positions with
     * the given slice. The slice must 'fit', meaning its open sides
     * must be able to connect to the surrounding content, and its
     * content nodes must be valid children for the node they are placed
     * into. If any of this is violated, an error of type
     * [`ReplaceError`](#model.ReplaceError) is thrown.
     *
     * @param from The starting position of the range to replace.
     * @param to The ending position of the range to replace.
     * @param slice The slice to insert at the specified position.
     * @returns A new node with the replacement applied.
     * @throws {ReplaceError} If the slice doesn't fit in the specified location.
     */
    public replace(from: number, to: number, slice: Slice): Node {
        return replace(this.resolve(from), this.resolve(to), slice);
    }

    /**
     * Find the node directly after the given position.
     *
     * @param pos The position to search from.
     * @returns The node at the specified position, or null if no node is found.
     */
    public nodeAt(pos?: number): Node | null {
        if(isUndefinedOrNull(pos)) {
            return null;
        }
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        for (let node: Node | null = this; ;) {
            const {index, offset} = node._content.findIndex(pos);

            node = node.maybeChild(index);
            if (!node) {
                return null;
            }

            if (offset === pos || node.isText) {
                return node;
            }
            pos -= offset + 1;
        }
    }

    /**
     * Find the (direct) child node after the given offset, if any,
     * and return it along with its index and offset relative to this
     * node.
     *
     * @param pos The position to search from.
     * @returns An object containing the node, its index, and its offset.
     */
    public childAfter(pos: number): { node: Node | null, index: number, offset: number; } {
        const {index, offset} = this._content.findIndex(pos);
        return {node: this._content.maybeChild(index), index, offset};
    }

    /**
     * Find the (direct) child node before the given offset, if any,
     * and return it along with its index and offset relative to this
     * node.
     *
     * @param pos The position to search from.
     * @returns An object containing the node, its index, and its offset.
     */
    public childBefore(pos: number): { node: Node | null, index: number, offset: number; } {
        if (pos === 0) {
            return {node: null, index: 0, offset: 0};
        }

        const {index, offset} = this._content.findIndex(pos);
        if (offset < pos) {
            return {node: this._content.child(index), index, offset};
        }

        const node: Node = this._content.child(index - 1);
        return {node, index: index - 1, offset: offset - node.nodeSize};
    }

    /**
     * Resolve the given position in the document, returning an
     * [object](#model.ResolvedPos) with information about its context.
     *
     * @param pos The position to resolve.
     * @returns A ResolvedPos object with information about the position's context.
     */
    public resolve(pos: number): ResolvedPos {
        return ResolvedPos.resolveCached(this, pos);
    }

    /**
     * Resolve the given position without using the cache.
     *
     * @param pos The position to resolve.
     * @returns A ResolvedPos object with information about the position's context.
     */
    public resolveNoCache(pos: number): ResolvedPos {
        return ResolvedPos.resolve(this, pos);
    }

    /**
     * Test whether a given mark or mark type occurs in this document
     * between the two given positions.
     *
     * @param from The starting position.
     * @param to The ending position.
     * @param type The mark or mark type to search for.
     * @returns `true` if the mark is found in the range, `false` otherwise.
     */
    public rangeHasMark(from: number, to: number, type: Mark | MarkType): boolean {
        let found = false;
        if (to > from) {
            this.nodesBetween(from, to, (node: Node): boolean => {
                if (type.isInSet(node.marks)) {
                    found = true;
                }
                return !found;
            });
        }
        return found;
    }

    /**
     * Return a string representation of this node for debugging purposes.
     */
    public toString(): string {
        if (this.nodeType.spec.toDebugString) {
            return this.nodeType.spec.toDebugString(this);
        }

        let name: string = this.nodeType.name;
        if (this._content.size) {
            name += `(${this._content.toStringInner()})`;
        }

        return this.wrapMarks(this._marks, name);
    }

    /**
     * Get the content match in this node at the given index.
     *
     * @param index The child index to get the content match at.
     * @returns The content match at the specified index.
     * @throws {Error} If the node has invalid content.
     */
    public contentMatchAt(index: number): ContentMatch {
        const match: ContentMatch = this.nodeType.contentMatch.matchFragment(this._content, 0, index);
        if (!match) {
            throw new Error('Called contentMatchAt on a node with invalid content');
        }
        return match;
    }

    /**
     * Test whether replacing the range between `from` and `to` (by
     * child index) with the given replacement fragment (which defaults
     * to the empty fragment) would leave the node's content valid. You
     * can optionally pass `start` and `end` indices into the
     * replacement fragment.
     *
     * @param from The starting child index.
     * @param to The ending child index.
     * @param replacement The replacement fragment. Defaults to an empty fragment.
     * @param start The start index in the replacement fragment. Defaults to 0.
     * @param end The end index in the replacement fragment. Defaults to the fragment's child count.
     * @returns `true` if the replacement would be valid, `false` otherwise.
     */
    public canReplace(from: number,
                      to: number,
                      replacement: Fragment = Fragment.empty,
                      start = 0,
                      end: number = replacement.childCount): boolean {
        const one: ContentMatch = this.contentMatchAt(from).matchFragment(replacement, start, end);
        const two: ContentMatch = one?.matchFragment(this._content, to);
        if (!two?.validEnd) {
            return false;
        }

        for (let i = start; i < end; i++) {
            if (!this.nodeType.allowsMarks(replacement.child(i).marks)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Test whether replacing the range `from` to `to` (by index) with
     * a node of the given type would leave the node's content valid.
     *
     * @param from The starting child index.
     * @param to The ending child index.
     * @param type The node type to test.
     * @param marks Optional marks to apply to the node.
     * @returns `true` if the replacement would be valid, `false` otherwise.
     */
    public canReplaceWith(from: number,
                          to: number,
                          type: NodeType,
                          marks?: ReadonlyArray<Mark>): boolean {
        if (marks && !this.nodeType.allowsMarks(marks)) {
            return false;
        }

        const start: ContentMatch = this.contentMatchAt(from).matchType(type);
        const end: ContentMatch = start?.matchFragment(this._content, to);
        return end ? end.validEnd : false;
    }

    /**
     * Test whether the given node's content could be appended to this
     * node. If that node is empty, this will only return true if there
     * is at least one node type that can appear in both nodes (to avoid
     * merging completely incompatible nodes).
     *
     * @param other The node whose content to test for appending.
     * @returns `true` if the content can be appended, `false` otherwise.
     */
    public canAppend(other: Node): boolean {
        if (other.content.size) {
            return this.canReplace(this.childCount, this.childCount, other.content);
        } else {
            return this.nodeType.compatibleContent(other.type);
        }
    }

    /**
     * Check whether this node and its descendants conform to the
     * schema, and raise an exception when they do not.
     *
     * @throws {RangeError} If the node or its descendants don't conform to the schema.
     */
    public check(): void {
        // Validate content and attributes
        this.nodeType.checkContent(this._content);
        this.nodeType.checkAttrs(this._attrs);

        // Validate marks and their ordering
        let copy: ReadonlyArray<Mark> = Mark.none;
        for (const mark of this._marks) {
            mark.type.checkAttrs(mark.attrs);
            copy = mark.addToSet(copy);
        }

        if (!Mark.sameSet(copy, this._marks)) {
            const markNames: string = this._marks.map((m: Mark): string => m.type.name).join(', ');
            throw new RangeError(
                `Invalid collection of marks for node ${this.nodeType.name}: ${markNames}`
            );
        }

        // Recursively check children
        this._content.forEach((node: Node): void => {
            node.check();
        });
    }

    /**
     * Return a JSON-serializable representation of this node.
     *
     * @returns A JSON representation of this node.
     */
    public toJSON(): NodeJSON {
        const nodeJson: NodeJSON = {type: this.nodeType.name};

        // Only include attributes if they exist and are non-empty
        if (this._attrs && Object.keys(this._attrs).length > 0) {
            const attrsWithoutNullValues: Record<string, any> = {};
            let count = 0;

            for (const attrName in this._attrs) {
                if (this._attrs[attrName] !== null) {
                    count++;
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    attrsWithoutNullValues[attrName] = this._attrs[attrName];
                }
            }

            if(this.nodeType.spec.topNode) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                attrsWithoutNullValues.preVersion = attrsWithoutNullValues.version ?? 0;
                attrsWithoutNullValues.version = Date.now();
                count++;
            }

            if(count) {
                nodeJson.attrs = attrsWithoutNullValues;
            }
        }

        // Only include content if non-empty
        if (this._content.size) {
            nodeJson.content = this._content.toJSON();
        }

        // Only include marks if present
        if (this._marks.length) {
            nodeJson.marks = this._marks.map((mark: Mark): MarkJSON => mark.toJSON());
        }

        return nodeJson;
    }

    protected wrapMarks(marks: ReadonlyArray<Mark>, content: string): string {
        for (let i = marks.length - 1; i >= 0; i--) {
            content = `${marks[i].type.name}(${content})`;
        }
        return content;
    }
}
