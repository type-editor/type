import {isUndefinedOrNull, OrderedMap} from '@type-editor/commons';

import {ContentParser} from '../content-parser/ContentParser';
import type {Fragment} from '../elements/Fragment';
import {Mark} from '../elements/Mark';
import {Node as PmNode} from '../elements/Node';
import {TextNode} from '../elements/TextNode';
import type {ContentMatch} from '../types/content-parser/ContentMatch';
import type {MarkJSON} from '../types/elements/MarkJSON';
import type {NodeJSON} from '../types/elements/NodeJSON';
import type {Attrs} from '../types/schema/Attrs';
import type {BasicSchemaSpec} from '../types/schema/BasicSchemaSpec';
import type {MarkSpec} from '../types/schema/MarkSpec';
import type {NodeSpec} from '../types/schema/NodeSpec';
import type {SchemaSpec} from '../types/schema/SchemaSpec';
import {MarkType} from './MarkType';
import {NodeType} from './NodeType';

/**
 * A document schema. Holds [node](#model.NodeType) and [mark
 * type](#model.MarkType) objects for the nodes and marks that may
 * occur in conforming documents, and provides functionality for
 * creating and deserializing such documents.
 *
 * When given, the type parameters provide the names of the nodes and
 * marks in this schema.
 */
export class Schema<Nodes extends string = string, Marks extends string = string> {

    /**
     * The [spec](#model.SchemaSpec) on which the schema is based,
     * with the added guarantee that its `nodes` and `marks`
     * properties are
     * [`OrderedMap`](https://github.com/marijnh/orderedmap) instances
     * (not raw objects).
     */
    private readonly schemaSpec: BasicSchemaSpec<NodeSpec, MarkSpec>;

    /**
     * An object mapping the schema's node names to node type objects.
     */
    private readonly schemaNodes: Readonly<Record<Nodes, NodeType>> & Readonly<Record<string, NodeType>>;

    /**
     * A map from mark names to mark type objects.
     */
    private readonly schemaMarks: Readonly<Record<Marks, MarkType>> & Readonly<Record<string, MarkType>>;

    /**
     * The [linebreak
     * replacement](#model.NodeSpec.linebreakReplacement) node defined
     * in this schema, if any.
     */
    private readonly _linebreakReplacement: NodeType | null = null;

    /**
     * The type of the [default top node](#model.SchemaSpec.topNode)
     * for this schema.
     */
    private readonly _topNodeType: NodeType;

    /**
     * An object for storing whatever values modules may want to
     * compute and cache per schema. (If you want to store something
     * in it, try to use property names unlikely to clash.)
     */
    private readonly cachedValues: Record<string, unknown> = Object.create(null) as Record<string, unknown>;

    /**
     * Bound function for deserializing nodes from JSON.
     *
     * NodeJSON as array for backward compatibility
     */
    private readonly nodeFromJSONFunc: (json: NodeJSON | Array<NodeJSON>) => PmNode;

    /**
     * Bound function for deserializing marks from JSON.
     */
    private readonly markFromJSONFunc: (json: MarkJSON) => Mark;

    /**
     * Constructs a schema from a schema specification.
     * Compiles node and mark types, validates the schema structure, and initializes
     * content matching and mark restrictions.
     *
     * @param spec - The schema specification containing node and mark definitions
     * @throws {RangeError} If the schema is invalid (e.g., duplicate node/mark names,
     *                      multiple linebreak nodes, invalid linebreak node configuration)
     */
    constructor(spec: SchemaSpec<Nodes, Marks>) {
        // Convert the spec's nodes and marks to OrderedMaps for consistent ordering
        const instanceSpec: BasicSchemaSpec<NodeSpec, MarkSpec> = {
            nodes: OrderedMap.from(spec.nodes),
            marks: OrderedMap.from(spec.marks || {}),
        };

        // Copy additional properties from the spec (e.g., topNode)
        for (const prop in spec) {
            if (prop !== 'nodes' && prop !== 'marks') {
                (instanceSpec as unknown as Record<string, unknown>)[prop] = (spec as unknown as Record<string, unknown>)[prop];
            }
        }

        this.schemaSpec = instanceSpec;
        this.schemaNodes = NodeType.compile(this.schemaSpec.nodes, this);
        this.schemaMarks = MarkType.compile(this.schemaSpec.marks, this) as Readonly<Record<Marks, MarkType>> & Readonly<Record<string, MarkType>>;

        this.initializeNodeTypes();
        this.initializeMarkExclusions();

        // Bind JSON deserialization methods
        this.nodeFromJSONFunc = (json: NodeJSON | Array<NodeJSON>): PmNode => PmNode.fromJSON(this, json);
        this.markFromJSONFunc = (json: MarkJSON): Mark => Mark.fromJSON(this, json);

        // Set the top node type and initialize cache
        this._topNodeType = this.schemaNodes[this.spec.topNode || 'doc'];
        this.cachedValues.wrappings = Object.create(null) as Record<string, ReadonlyArray<NodeType>>;
    }

    /**
     * The schema specification this schema is based on, with nodes and marks
     * converted to OrderedMap instances for consistent ordering.
     */
    get spec(): BasicSchemaSpec<NodeSpec, MarkSpec> {
        return this.schemaSpec;
    }

    /**
     * An object mapping node names to NodeType instances.
     * Contains all node types defined in this schema.
     */
    get nodes(): Readonly<Record<Nodes, NodeType>> & Readonly<Record<string, NodeType>> {
        return this.schemaNodes;
    }

    /**
     * An object mapping mark names to MarkType instances.
     * Contains all mark types defined in this schema.
     */
    get marks(): Readonly<Record<Marks, MarkType>> & Readonly<Record<string, MarkType>> {
        return this.schemaMarks;
    }

    /**
     * The linebreak replacement node type, if one is defined in this schema.
     * This node type is used to replace newline characters in pasted content.
     */
    get linebreakReplacement(): NodeType | null {
        return this._linebreakReplacement;
    }

    /**
     * The top-level node type for this schema (defaults to 'doc').
     * This is the root node type that contains the document content.
     */
    get topNodeType(): NodeType {
        return this._topNodeType;
    }

    /**
     * An object for storing cached values computed from the schema.
     * Modules can use this to cache expensive computations. Use unique
     * property names to avoid conflicts.
     */
    get cached(): Record<string, any> {
        return this.cachedValues;
    }

    /**
     * Deserialize a node from its JSON representation. This method is
     * bound.
     *
     * NodeJSON as array for backwards compatibility
     */
    get nodeFromJSON(): (json: NodeJSON | Array<NodeJSON>) => PmNode {
        return this.nodeFromJSONFunc;
    }

    /**
     * Deserialize a mark from its JSON representation. This method is
     * bound.
     */
    get markFromJSON(): (json: MarkJSON) => Mark {
        return this.markFromJSONFunc;
    }

    /**
     * Create a node in this schema. The `type` may be a string or a
     * `NodeType` instance. Attributes will be extended with defaults,
     * `content` may be a `Fragment`, `null`, a `Node`, or an array of
     * nodes.
     *
     * @param type - The node type name or NodeType instance
     * @param attrs - Attribute values for the node, or null to use defaults
     * @param content - Fragment, single node, array of nodes, or undefined for empty content
     * @param marks - Array of marks to apply to the node, or undefined for no marks
     * @returns A new Node instance
     * @throws {RangeError} If the type is invalid or from a different schema
     */
    public node(type: string | NodeType,
                attrs: Attrs | null = null,
                content?: Fragment | PmNode | ReadonlyArray<PmNode>,
                marks?: ReadonlyArray<Mark>): PmNode {
        if (typeof type === 'string') {
            type = this.nodeType(type);
        } else if (!(type instanceof NodeType)) {
            throw new RangeError(`Invalid node type: ${type as unknown as string}`);
        } else if (type.schema !== this) {
            throw new RangeError(`Node type from different schema used (${type.name})`);
        }

        return type.createChecked(attrs, content, marks);
    }

    /**
     * Create a text node in this schema. Empty text nodes are not
     * allowed.
     *
     * @param text - The text content for the node
     * @param marks - Array of marks to apply to the text node, or undefined for no marks
     * @returns A new text Node instance
     */
    public text(text: string, marks?: ReadonlyArray<Mark>): PmNode {
        const type: NodeType = this.schemaNodes.text;
        return new TextNode(type, type.defaultAttrs, text, Mark.setFrom(marks));
    }

    /**
     * Create a mark with the given type and attributes.
     *
     * @param type - The mark type name or MarkType instance
     * @param attrs - Attribute values for the mark, or undefined to use defaults
     * @returns A new Mark instance
     * @throws {RangeError} If the mark type is not found in this schema
     */
    public mark(type: string | MarkType, attrs?: Attrs): Mark {
        if (typeof type === 'string') {
            const markType: MarkType = this.schemaMarks[type];
            if (!markType) {
                throw new RangeError(`Unknown mark type: ${type}`);
            }
            type = markType;
        }
        return type.create(attrs);
    }

    /**
     * Retrieves a node type by name.
     *
     * @param name - The name of the node type to retrieve
     * @returns The NodeType instance
     * @throws {RangeError} If the node type is not found in this schema
     */
    public nodeType(name: string): NodeType {
        const found: NodeType = this.schemaNodes[name];
        if (!found) {
            throw new RangeError('Unknown node type: ' + name);
        }
        return found;
    }

    /**
     * Initializes node types by setting up content matching, inline content flags,
     * linebreak replacement nodes, and mark restrictions.
     *
     * @throws {RangeError} If a name is used for both a node and mark, or if linebreak
     *                      replacement configuration is invalid
     */
    private initializeNodeTypes(): void {
        const contentExprCache = new Map<string, ContentMatch>();

        for (const prop in this.schemaNodes) {
            // Ensure no name conflicts between nodes and marks
            if (prop in this.schemaMarks) {
                throw new RangeError(`${prop} can not be both a node and a mark`);
            }

            const type: NodeType = this.schemaNodes[prop];

            // Parse and cache content expressions
            const contentExpr: string = type.spec.content || '';
            type.contentMatch = contentExprCache.get(contentExpr) ?? ContentParser.parse(contentExpr, this.schemaNodes);
            contentExprCache.set(contentExpr, type.contentMatch);
            type.inlineContent = type.contentMatch.inlineContent;

            // Handle linebreak replacement nodes
            if (type.spec.linebreakReplacement) {
                if (this._linebreakReplacement) {
                    throw new RangeError('Multiple linebreak nodes defined');
                }
                if (!type.isInline || !type.isLeaf) {
                    throw new RangeError('Linebreak replacement nodes must be inline leaf nodes');
                }
                (this as unknown as { _linebreakReplacement: NodeType | null })._linebreakReplacement = type;
            }

            // Set up mark restrictions
            const markExpr: string = type.spec.marks;
            type.markSet = null;
            if (markExpr !== '_') {
                if (markExpr) {
                    type.markSet = this.gatherMarks(markExpr.split(' '));
                } else if (markExpr === '' || !type.inlineContent) {
                    type.markSet = [];
                }
            }
        }
    }

    /**
     * Initializes mark type exclusions based on their specifications.
     * By default, marks exclude themselves unless explicitly configured otherwise.
     */
    private initializeMarkExclusions(): void {
        for (const prop in this.schemaMarks) {
            const type: MarkType = this.schemaMarks[prop];
            const excl: string = type.spec.excludes;

            if (isUndefinedOrNull(excl)) {
                // By default, marks exclude themselves
                type.excluded = [type];
            } else if (excl === '') {
                // Empty string means no exclusions
                type.excluded = [];
            } else {
                // Parse exclusion list
                type.excluded = this.gatherMarks(excl.split(' '));
            }
        }
    }

    /**
     * Gathers mark types from a list of mark names or group names.
     *
     * @param marks - Array of mark names or group names to gather
     * @returns Array of MarkType instances matching the names (deduplicated)
     * @throws {SyntaxError} If a mark name or group is not found
     */
    private gatherMarks(marks: ReadonlyArray<string>): Array<MarkType> {
        const found = new Set<MarkType>();

        for (const name of marks) {
            // Try direct mark name lookup first
            const directMark: MarkType = this.schemaMarks[name];

            if (directMark) {
                found.add(directMark);
            } else {
                // Try group name lookup or wildcard
                const isWildcard = name === '_';
                let matchedAny = false;

                for (const prop in this.schemaMarks) {
                    const mark: MarkType = this.schemaMarks[prop];

                    if (isWildcard) {
                        found.add(mark);
                        matchedAny = true;
                    } else {
                        // Check if mark belongs to the named group
                        const groups: Array<string> = mark.spec.group?.split(' ');
                        if (groups?.includes(name)) {
                            found.add(mark);
                            matchedAny = true;
                        }
                    }
                }

                if (!matchedAny) {
                    throw new SyntaxError(`Unknown mark type: '${name}'`);
                }
            }
        }

        return Array.from(found);
    }
}
