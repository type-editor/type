import {isUndefinedOrNull, OrderedMap} from '@type-editor/commons';
import { nanoid } from 'nanoid';

import {ContentMatchFactory} from '../content-parser/ContentMatchFactory';
import {Fragment} from '../elements/Fragment';
import {Mark} from '../elements/Mark';
import {Node as PmNode} from '../elements/Node';
import type {ContentMatch} from '../types/content-parser/ContentMatch';
import type {Attrs} from '../types/schema/Attrs';
import type {NodeSpec} from '../types/schema/NodeSpec';
import type {MarkType} from './MarkType';
import type {Schema} from './Schema';
import {TypeBase} from './TypeBase';
import type { Attribute } from './Attribute';


/**
 * Node types are objects allocated once per `Schema` and used to
 * [tag](#model.Node.type) `Node` instances. They contain information
 * about the node type, such as its name and what kind of node it
 * represents.
 */
export class NodeType extends TypeBase {

    public static readonly ELEMENTS_ID_ATTR_NAME = 'id';

    /**
     * The starting match of the node type's content expression.
     */
    protected _contentMatch: ContentMatch;
    /**
     * True if this node type has inline content.
     */
    protected isInlineContent = false;
    /**
     * True if this is a block type
     */
    private readonly _isBlock: boolean;
    /**
     * True if this is the text node type.
     */
    private readonly _isText: boolean;
    /**
     * The default attributes for this node type, or null if any attribute is required.
     * @private
     */
    private readonly _defaultAttrs: Attrs;
    /**
     * The groups this node type belongs to.
     * @private
     */
    private readonly groups: ReadonlyArray<string>;
    /**
     * The name of this node type.
     * @private
     */
    private readonly _name: string;
    /**
     * Reference to the schema this node type belongs to.
     * @private
     */
    private readonly _schema: Schema;
    /**
     * The specification this node type is based on.
     * @private
     */
    private readonly _spec: NodeSpec;
    /**
     * The set of marks allowed in this node. `null` means all marks
     * are allowed.
     * @private
     */
    private _markSet: ReadonlyArray<MarkType> | null = null;

    /**
     * Creates a new NodeType instance.
     *
     * @param name - The name the node type has in this schema
     * @param schema - A link back to the Schema the node type belongs to
     * @param spec - The specification that this type is based on
     */
    constructor(name: string, schema: Schema, spec: NodeSpec) {
        super(name, spec.attrs);
        this._name = name;
        this._schema = schema;
        this._spec = spec;

        this.groups = spec.group ? spec.group.split(' ') : [];
        this._defaultAttrs = this.createDefaultAttrs();
        this._isBlock = !(spec.inline || name === 'text');
        this._isText = name === 'text';
    }

    /**
     * The name of this node type.
     */
    get name(): string {
        return this._name;
    }

    /**
     * The schema that this node type is part of.
     */
    get schema(): Schema {
        return this._schema;
    }

    /**
     * The spec that this node type is based on.
     */
    get spec(): NodeSpec {
        return this._spec;
    }

    /**
     * The starting match of the node type's content expression.
     * Used to validate and match content during node operations.
     */
    get contentMatch(): ContentMatch {
        return this._contentMatch;
    }

    /**
     * Sets the content match for this node type.
     * @param value - The ContentMatch instance to set
     */
    set contentMatch(value: ContentMatch) {
        this._contentMatch = value;
    }

    /**
     * The set of marks allowed in this node.
     * `null` means all marks are allowed, an empty array means no marks are allowed,
     * and a populated array restricts marks to the specified types.
     */
    get markSet(): ReadonlyArray<MarkType> | null {
        return this._markSet;
    }

    /**
     * Sets the mark restrictions for this node type.
     * @param value - The array of allowed mark types, null for all marks, or empty array for no marks
     */
    set markSet(value: ReadonlyArray<MarkType> | null) {
        this._markSet = value;
    }

    /**
     * The default attributes for this node type.
     * When creating nodes without specifying attributes, these defaults are used.
     */
    get defaultAttrs(): Attrs {
        return this._defaultAttrs;
    }

    /**
     * The attribute specifications for this node type.
     * Contains metadata about each attribute including validation and comparison behavior.
     */
    get attributeSpecs(): Record<string, Attribute> {
        return this.attrs;
    }

    /**
     * True if this node type has inline content.
     */
    get inlineContent(): boolean {
        return this.isInlineContent;
    }

    /**
     * Sets whether this node type has inline content.
     * @param value - True if the node should have inline content
     */
    set inlineContent(value: boolean) {
        this.isInlineContent = value;
    }

    /**
     * True if this is an inline type.
     */
    get isInline(): boolean {
        return !this._isBlock;
    }

    /**
     * True if this is a textblock type, a block that contains inline content.
     */
    get isTextblock(): boolean {
        return this._isBlock && this.isInlineContent;
    }

    /**
     * True if this is a block type (not inline).
     */
    get isBlock(): boolean {
        return this._isBlock;
    }

    /**
     * True if this is the text node type.
     */
    get isText(): boolean {
        return this._isText;
    }

    /**
     * True for node types that allow no content.
     */
    get isLeaf(): boolean {
        return this._contentMatch === ContentMatchFactory.EMPTY_CONTENT_MATCH;
    }

    /**
     * True when this node is an atom, i.e. when it does not have
     * directly editable content.
     */
    get isAtom(): boolean {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-conversion
        return this.isLeaf || !!this._spec.atom;
    }

    /**
     * The node type's [whitespace](#model.NodeSpec.whitespace) option.
     */
    get whitespace(): 'pre' | 'normal' {
        const whitespaceOrCode: 'pre' | 'normal' = this._spec.whitespace || (this._spec.code ? 'pre' : 'normal');
        if (whitespaceOrCode !== 'pre' && whitespaceOrCode !== 'normal') {
            return 'normal';
        }
        return whitespaceOrCode;
    }

    /**
     * Compiles a set of node specifications into NodeType instances.
     * Validates that required node types (top node and text) are present and correctly configured.
     *
     * @param nodes - An OrderedMap of node specifications
     * @param schema - The schema these node types belong to
     * @returns A readonly record mapping node names to NodeType instances
     * @throws {RangeError} If the top node type is missing, text type is missing,
     *                      or text type has attributes
     */
    public static compile<Nodes extends string>(nodes: OrderedMap<NodeSpec>,
                                                schema: Schema<Nodes>): Readonly<Record<Nodes, NodeType>> {

        const result = Object.create(null) as Record<string, NodeType>;

        // Create NodeType instances for all node specifications
        nodes.forEach((name: string, spec: NodeSpec): NodeType => {
            result[name] = new NodeType(name, schema, spec);
            return result[name];
        });

        // Validate required node types exist and are correctly configured
        const topType: string = schema.spec.topNode || 'doc';
        if (!result[topType]) {
            throw new RangeError(`Schema is missing its top node type ('${topType}')`);
        }
        if (!result.text) {
            throw new RangeError('Every schema needs a \'text\' type');
        }
        if ((result.text).attrs && Object.getOwnPropertyNames((result.text).attrs).length > 0) {
            throw new RangeError('The text node type should not have attributes');
        }

        return result as Readonly<Record<Nodes, NodeType>>;
    }

    /**
     * Checks whether this node type is part of the given group.
     * Groups are defined in the node spec and allow categorizing node types.
     *
     * @param group - The group name to check membership for
     * @returns True if this node type belongs to the specified group
     */
    public isInGroup(group: string): boolean {
        return this.groups.includes(group);
    }

    /**
     * Checks whether this node type has any required attributes (attributes without default values).
     *
     * @returns True if at least one attribute is required, false otherwise
     */
    public hasRequiredAttrs(): boolean {
        for (const name in this.attrs) {
            if (this.attrs[name].isRequired) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks whether this node type allows some of the same content as another node type.
     * Used to determine if content can be transferred between different node types.
     *
     * @param other - The node type to compare content compatibility with
     * @returns True if the content expressions are compatible
     */
    public compatibleContent(other: NodeType): boolean {
        return this === other || this._contentMatch.compatible(other.contentMatch);
    }

    /**
     * Creates a Node of this type with the specified attributes, content, and marks.
     * Attributes are merged with defaults. This method does not validate content.
     *
     * @param attrs - Attribute values for the node, or null to use all defaults
     * @param content - Fragment, single node, array of nodes, or null for empty content
     * @param marks - Array of marks to apply to the node, or undefined for no marks
     * @returns A new Node instance
     * @throws {Error} If called on the text node type (use schema.text() instead)
     */
    public create(attrs?: Attrs | null,
                  content?: Fragment | PmNode | ReadonlyArray<PmNode> | null,
                  marks?: ReadonlyArray<Mark>): PmNode {
        if (this._isText) {
            throw new Error('NodeType.create can\'t construct text nodes');
        }
        return new PmNode(this, this.computeAttrs(attrs), Fragment.from(content), Mark.setFrom(marks));
    }

    /**
     * Creates a Node like create(), but validates content against the node type's
     * content restrictions before creating the node.
     *
     * @param attrs - Attribute values for the node, or null to use all defaults
     * @param content - Fragment, single node, array of nodes, or null for empty content
     * @param marks - Array of marks to apply to the node, or undefined for no marks
     * @returns A new Node instance
     * @throws {RangeError} If the content doesn't match the node type's content expression
     */
    public createChecked(attrs: Attrs | null = null,
                         content?: Fragment | PmNode | ReadonlyArray<PmNode> | null,
                         marks?: ReadonlyArray<Mark>): PmNode {
        content = Fragment.from(content);
        this.checkContent(content);
        return new PmNode(this, this.computeAttrs(attrs), content, Mark.setFrom(marks));
    }

    /**
     * Creates a Node like create(), but attempts to add required nodes to the start
     * or end of the content to satisfy the node type's content expression.
     * Returns null if the content cannot be made valid.
     *
     * @param attrs - Attribute values for the node, or null to use all defaults
     * @param content - Fragment, single node, array of nodes, or null for empty content
     * @param marks - Array of marks to apply to the node, or undefined for no marks
     * @returns A new Node instance with filled content, or null if content cannot be fixed
     * @remarks This will always succeed with null or empty content since required nodes
     *          can be automatically created
     */
    public createAndFill(attrs: Attrs | null = null,
                         content?: Fragment | PmNode | ReadonlyArray<PmNode> | null,
                         marks?: ReadonlyArray<Mark>): PmNode {
        attrs = this.computeAttrs(attrs);
        content = Fragment.from(content);
        if (content.size) {
            const before: Fragment = this._contentMatch.fillBefore(content);
            if (!before) {
                return null;
            }
            content = before.append(content);
        }
        const matched: ContentMatch = this._contentMatch.matchFragment(content);
        const after: Fragment = matched?.fillBefore(Fragment.empty, true);
        if (!after) {
            return null;
        }
        return new PmNode(this, attrs, content.append(after), Mark.setFrom(marks));
    }

    /**
     * Checks whether the given fragment is valid content for this node type.
     * Validates both the content structure and that all marks are allowed.
     *
     * @param content - The fragment to validate
     * @returns True if the content is valid for this node type
     */
    public validContent(content: Fragment): boolean {
        const result: ContentMatch = this._contentMatch.matchFragment(content);
        if (!result?.validEnd) {
            return false;
        }

        for (let i = 0; i < content.childCount; i++) {
            if (!this.allowsMarks(content.child(i).marks)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Validates that the given fragment is valid content for this node type.
     *
     * @param content - The fragment to validate
     * @throws {RangeError} If the content is not valid for this node type
     */
    public checkContent(content: Fragment): void {
        if (!this.validContent(content)) {
            throw new RangeError(`Invalid content for node ${this._name}: ${content.toString().slice(0, 50)}`);
        }
    }

    /**
     * Validates attributes for this node type.
     *
     * @param attrs - The attributes to validate
     * @throws {RangeError} If any attribute is invalid
     */
    public checkAttrs(attrs: Attrs): void {
        this.checkAttributes(attrs, 'node');
    }

    /**
     * Checks whether the given mark type is allowed in this node.
     *
     * @param markType - The mark type to check
     * @returns True if the mark type is allowed in this node
     */
    public allowsMarkType(markType: MarkType): boolean {
        return isUndefinedOrNull(this._markSet) || this._markSet.includes(markType);
    }

    /**
     * Tests whether the given set of marks are all allowed in this node.
     *
     * @param marks - The array of marks to test
     * @returns True if all marks in the set are allowed in this node
     */
    public allowsMarks(marks: ReadonlyArray<Mark>): boolean {
        if (isUndefinedOrNull(this._markSet)) {
            return true;
        }

        for (const item of marks) {
            if (!this.allowsMarkType(item.type)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Filters the given marks to only those allowed in this node.
     * Returns a new array with disallowed marks removed.
     *
     * @param marks - The array of marks to filter
     * @returns A new array containing only the marks allowed in this node
     */
    public allowedMarks(marks: ReadonlyArray<Mark>): ReadonlyArray<Mark> {
        if (isUndefinedOrNull(this._markSet)) {
            return marks;
        }

        let copy: Array<Mark> | undefined;
        for (let i = 0; i < marks.length; i++) {
            if (!this.allowsMarkType(marks[i].type)) {
                copy ??= marks.slice(0, i);
            } else if (copy) {
                copy.push(marks[i]);
            }
        }
        return !copy ? marks : copy.length ? copy : Mark.none;
    }

    /**
     * Computes the complete attributes for a node by merging provided attributes with defaults.
     * Optimizes by returning the cached default attributes object when no custom attributes are provided.
     *
     * To ensurce that elements have a unique id, a unique ID is generated and added (if missing)
     * if an attribute 'id' is defined in the schema.
     *
     * @param attrs - The attributes provided, or null to use all defaults
     * @returns A complete Attrs object with all attributes resolved
     * @private
     */
    private computeAttrs(attrs: Attrs | null): Attrs {
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        let attributes: Record<string, unknown | null | undefined> = {};
        if(!attrs && this._defaultAttrs) {
            attributes = {...this._defaultAttrs};
        } else {
            attributes = this.computeAttributes(attrs);
        }

        if (NodeType.ELEMENTS_ID_ATTR_NAME in this.attrs && attributes.id === null) {
            attributes.id = nanoid();
        }

        return attributes;
    }
}
