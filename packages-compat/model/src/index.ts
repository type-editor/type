/**
 * @type-editor-compat/model
 *
 * Compatibility layer for @type-editor/model.
 * Direct re-export - no type modifications needed.
 */

import type {
    DiffPosition,
    DOMOutputSpec,
    Mark,
    MarkJSON,
    NodeJSON,
    NodeSpec as _NodeSpec,
    ParseOptions as _ParseOptions,
    SliceJSON,
    StyleParseRule as _StyleParseRule,
    TagParseRule as _TagParseRule,
} from '@type-editor/model';
import {
    DOMParser as _DOMParser,
    DOMSerializer as _DOMSerializer,
    Fragment as _Fragment,
    Node as _Node,
    NodeRange as _NodeRange,
    NodeType as _NodeType,
    ResolvedPos as _ResolvedPos,
    Schema as _Schema,
    Slice as _Slice,
} from '@type-editor/model';

export * from '@type-editor/model';

// Explicit re-exports for common ProseMirror imports
export type { Attrs } from '@type-editor/model';
export {
    Mark,
    MarkType,
    ReplaceError,
    TextNode,
} from '@type-editor/model';

// Note: Node, PmNode, ResolvedPos, Fragment, Slice, NodeType, ContentMatch, NodeRange, Schema are exported below with patched return types.

// ---------------------------------------------------------------------------
// Fragment
// Re-export Fragment with a compatible `toJSON` return type.
// In the original ProseMirror, Fragment.toJSON returns Array<NodeJSON> (never null).
// In @type-editor/model it returns Array<NodeJSON> | null. We patch the type here.
// ---------------------------------------------------------------------------

// Extend the real Fragment class, narrowing all Node_2 references to CompatNodeInstance
// and all Fragment references to CompatFragmentInstance.
export interface CompatFragmentInstance {
    get content(): ReadonlyArray<CompatNodeInstance>;
    get size(): number;
    get firstChild(): CompatNodeInstance | null;
    get lastChild(): CompatNodeInstance | null;
    get childCount(): number;
    nodesBetween(from: number, to: number, callbackFunc: (node: CompatNodeInstance, start: number, parent: CompatNodeInstance | null, index: number) => boolean | undefined, nodeStart?: number, parent?: CompatNodeInstance): void;
    textBetween(from: number, to: number, blockSeparator?: string | null, leafText?: string | null | ((leafNode: CompatNodeInstance) => string)): string;
    append(other: CompatFragmentInstance): CompatFragmentInstance;
    cut(from: number, to?: number): CompatFragmentInstance;
    cutByIndex(from: number, to: number): CompatFragmentInstance;
    replaceChild(index: number, node: CompatNodeInstance): CompatFragmentInstance;
    eq(other: CompatFragmentInstance): boolean;
    child(index: number): CompatNodeInstance;
    maybeChild(index: number): CompatNodeInstance | null;
    forEach(callbackFunc: (node: CompatNodeInstance, offset: number, index: number) => void): void;
    findDiffStart(other: CompatFragmentInstance, pos?: number): number | null;
    findDiffEnd(other: CompatFragmentInstance, pos?: number, otherPos?: number): DiffPosition | null;
    addToStart(node: CompatNodeInstance): CompatFragmentInstance;
    addToEnd(node: CompatNodeInstance): CompatFragmentInstance;
    descendants(callbackFunc: (node: CompatNodeInstance, pos: number, parent: CompatNodeInstance | null, index: number) => boolean | undefined): void;
    toString(): string;
    toStringInner(): string;
    /** Compatible signature: never returns null. */
    toJSON(): Array<NodeJSON>;
}

export interface CompatFragmentConstructor {
    new(content: ReadonlyArray<CompatNodeInstance>, size?: number): CompatFragmentInstance;
    readonly empty: CompatFragmentInstance;
    fromJSON(schema: CompatSchemaInstance, value?: Array<NodeJSON>): CompatFragmentInstance;
    from(nodes?: CompatFragmentInstance | CompatNodeInstance | ReadonlyArray<CompatNodeInstance> | null): CompatFragmentInstance;
    isFragment(value: CompatFragmentInstance | CompatNodeInstance): value is CompatFragmentInstance;
    fromArray(array: ReadonlyArray<CompatNodeInstance>): CompatFragmentInstance;
}

// Export Fragment as both a value (the constructor) and a type (the instance shape).
export const Fragment: CompatFragmentConstructor = _Fragment as unknown as CompatFragmentConstructor;
export type Fragment = CompatFragmentInstance;

// ---------------------------------------------------------------------------
// NodeSpec
// Re-export NodeSpec with compatible Node references so that the toDOM,
// toDebugString, and leafText callbacks receive CompatNodeInstance.
// ---------------------------------------------------------------------------

export interface NodeSpec {
    content?: string;
    marks?: string;
    group?: string;         // ← TypeScript resolves this as string | undefined
    inline?: boolean;
    atom?: boolean;
    attrs?: _NodeSpec['attrs'];   // import PmAttributeSpec from @type-editor/model directly if needed
    selectable?: boolean;
    draggable?: boolean;
    code?: boolean;
    whitespace?: 'pre' | 'normal';
    definingAsContext?: boolean;
    definingForContent?: boolean;
    defining?: boolean;
    isolating?: boolean;
    linebreakReplacement?: boolean;
    topNode?: boolean;
    toDOM?: (node: CompatNodeInstance) => DOMOutputSpec;
    toDebugString?: (node: CompatNodeInstance) => string;
    leafText?: (node: CompatNodeInstance) => string;
    parseDOM?: ReadonlyArray<ParseRule>;
    [key: string]: any;    // preserved for ProseMirror's arbitrary-props usage
}

// ---------------------------------------------------------------------------
// SchemaSpec
// Re-export SchemaSpec using the compat NodeSpec so that passing
// schema.spec.nodes.append({...}) into new Schema({...}) type-checks correctly.
// ---------------------------------------------------------------------------

export type SchemaSpec<Nodes extends string = string, Marks extends string = string> = {
    nodes: Record<Nodes, NodeSpec> | import('@type-editor/commons').OrderedMap<NodeSpec>;
    marks?: Record<Marks, MarkSpec> | import('@type-editor/commons').OrderedMap<MarkSpec>;
    topNode?: string;
};

export interface MarkSpec {
    attrs?: Record<string, import('@type-editor/model').PmAttributeSpec>;
    inclusive?: boolean;
    excludes?: string;
    group?: string;
    spanning?: boolean;
    isCode?: boolean;
    toDOM?: (mark: Mark, inline: boolean) => DOMOutputSpec;
    parseDOM?: Array<ParseRule>;
    [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// TagParseRule / StyleParseRule / ParseRule
// Re-export parse rule types replacing Fragment with CompatFragmentInstance
// and removing the implicit `any` from getContent's schema parameter.
// ---------------------------------------------------------------------------

export type TagParseRule = Omit<_TagParseRule, 'getContent'> & {
    getContent?: (node: globalThis.Node, schema: any) => CompatFragmentInstance;
};

export type StyleParseRule = _StyleParseRule;

export type ParseRule = TagParseRule | StyleParseRule;

// ---------------------------------------------------------------------------
// ParseOptions
// Re-export ParseOptions replacing Node/ContentMatch/ResolvedPos/TagParseRule
// with compat types.
// ---------------------------------------------------------------------------

export type ParseOptions = Omit<_ParseOptions, 'topNode' | 'topMatch' | 'context' | 'ruleFromNode'> & {
    topNode?: CompatNodeInstance;
    topMatch?: CompatContentMatchInstance;
    context?: CompatResolvedPosInstance;
    ruleFromNode?: (node: globalThis.Node) => Omit<TagParseRule, 'tag'> | null;
};

// ---------------------------------------------------------------------------
// Node / PmNode
// Re-export Node with a compatible `content` return type.
// Node.content returns Fragment from @type-editor/model, but consumers of the
// compat layer expect it to return the compat Fragment (with non-null toJSON).
// ---------------------------------------------------------------------------

export interface CompatNodeInstance {
    get content(): CompatFragmentInstance;
    get text(): string | null;
    get type(): CompatNodeTypeInstance;
    get attrs(): import('@type-editor/model').Attrs;
    get marks(): ReadonlyArray<import('@type-editor/model').Mark>;
    get children(): ReadonlyArray<CompatNodeInstance>;
    get nodeSize(): number;
    get childCount(): number;
    get textContent(): string;
    get firstChild(): CompatNodeInstance | null;
    get lastChild(): CompatNodeInstance | null;
    get isBlock(): boolean;
    get isTextblock(): boolean;
    get inlineContent(): boolean;
    get isInline(): boolean;
    get isText(): boolean;
    get isLeaf(): boolean;
    get isAtom(): boolean;
    child(index: number): CompatNodeInstance;
    maybeChild(index: number): CompatNodeInstance | null;
    forEach(callbackFunc: (node: CompatNodeInstance, offset: number, index: number) => void): void;
    nodesBetween(from: number, to: number, callbackFunc: (node: CompatNodeInstance, pos: number, parent: CompatNodeInstance | null, index: number) => boolean | void, startPos?: number): void;
    descendants(callbackFunc: (node: CompatNodeInstance, pos: number, parent: CompatNodeInstance | null, index: number) => boolean | void): void;
    textBetween(from: number, to: number, blockSeparator?: string | null, leafText?: null | string | ((leafNode: CompatNodeInstance) => string)): string;
    eq(other: CompatNodeInstance): boolean;
    sameMarkup(other: CompatNodeInstance): boolean;
    hasMarkup(type: CompatNodeTypeInstance, attrs?: import('@type-editor/model').Attrs | null, marks?: ReadonlyArray<import('@type-editor/model').Mark>): boolean;
    copy(content?: CompatFragmentInstance | null): CompatNodeInstance;
    mark(marks: ReadonlyArray<import('@type-editor/model').Mark>): CompatNodeInstance;
    cut(from: number, to?: number): CompatNodeInstance;
    slice(from: number, to?: number, includeParents?: boolean): CompatSliceInstance;
    replace(from: number, to: number, slice: CompatSliceInstance): CompatNodeInstance;
    nodeAt(pos?: number): CompatNodeInstance | null;
    childAfter(pos: number): { node: CompatNodeInstance | null; index: number; offset: number };
    childBefore(pos: number): { node: CompatNodeInstance | null; index: number; offset: number };
    resolve(pos: number): CompatResolvedPosInstance;
    resolveNoCache(pos: number): CompatResolvedPosInstance;
    rangeHasMark(from: number, to: number, type: import('@type-editor/model').Mark | import('@type-editor/model').MarkType): boolean;
    toString(): string;
    contentMatchAt(index: number): CompatContentMatchInstance;
    canReplace(from: number, to: number, replacement?: CompatFragmentInstance, start?: number, end?: number): boolean;
    canReplaceWith(from: number, to: number, type: CompatNodeTypeInstance, marks?: ReadonlyArray<import('@type-editor/model').Mark>): boolean;
    canAppend(other: CompatNodeInstance): boolean;
    check(): void;
    toJSON(): NodeJSON;
}

export interface CompatNodeConstructor {
    new(type?: import('@type-editor/model').NodeType, attrs?: import('@type-editor/model').Attrs, content?: CompatFragmentInstance, marks?: ReadonlyArray<import('@type-editor/model').Mark>, text?: string): CompatNodeInstance;
    isNode(value: unknown): value is CompatNodeInstance;
    fromJSON(schema: CompatSchemaInstance, json: NodeJSON | Array<NodeJSON>): CompatNodeInstance;
}

export const Node: CompatNodeConstructor = _Node as unknown as CompatNodeConstructor;
export type Node = CompatNodeInstance;
// PmNode is an alias for Node in @type-editor/model
export const PmNode: CompatNodeConstructor = _Node as unknown as CompatNodeConstructor;
export type PmNode = CompatNodeInstance;

// ---------------------------------------------------------------------------
// ResolvedPos
// Re-export ResolvedPos with compatible return types for methods that return
// Node, so that e.g. $pos.doc and $pos.node() return CompatNodeInstance.
// ---------------------------------------------------------------------------

export interface CompatResolvedPosInstance {
    get depth(): number;
    get pos(): number;
    get parentOffset(): number;
    get parent(): CompatNodeInstance;
    get doc(): CompatNodeInstance;
    get textOffset(): number;
    get nodeAfter(): CompatNodeInstance | null;
    get nodeBefore(): CompatNodeInstance | null;
    node(depth?: number): CompatNodeInstance;
    index(depth?: number): number;
    indexAfter(depth?: number | null): number;
    start(depth?: number | null): number;
    end(depth?: number | null): number;
    before(depth?: number | null): number;
    after(depth?: number | null): number;
    posAtIndex(index: number, depth?: number | null): number;
    marks(): ReadonlyArray<import('@type-editor/model').Mark>;
    marksAcross($end: CompatResolvedPosInstance): ReadonlyArray<import('@type-editor/model').Mark> | null;
    sharedDepth(pos: number): number;
    blockRange(other?: CompatResolvedPosInstance, pred?: (node: CompatNodeInstance) => boolean): CompatNodeRangeInstance | null;
    sameParent(other: CompatResolvedPosInstance): boolean;
    max(other: CompatResolvedPosInstance): CompatResolvedPosInstance;
    min(other: CompatResolvedPosInstance): CompatResolvedPosInstance;
    toString(): string;
}

export interface CompatResolvedPosConstructor {
    new(pos: number, path: ReadonlyArray<CompatNodeInstance | number>, parentOffset: number): CompatResolvedPosInstance;
    resolve(doc: CompatNodeInstance, pos: number): CompatResolvedPosInstance;
    resolveCached(doc: CompatNodeInstance, pos: number): CompatResolvedPosInstance;
}

export const ResolvedPos: CompatResolvedPosConstructor = _ResolvedPos as unknown as CompatResolvedPosConstructor;
export type ResolvedPos = CompatResolvedPosInstance;

// ---------------------------------------------------------------------------
// Slice
// Re-export Slice with compatible Fragment references so that e.g.
// slice.content returns CompatFragmentInstance.
// toJSON() is also narrowed from SliceJSON | null to SliceJSON, matching
// the original ProseMirror signature.
// ---------------------------------------------------------------------------

export interface CompatSliceInstance {
    get content(): CompatFragmentInstance;
    get openStart(): number;
    get openEnd(): number;
    get size(): number;
    insertAt(pos: number, fragment: CompatFragmentInstance): CompatSliceInstance | null;
    removeBetween(from: number, to: number): CompatSliceInstance;
    eq(other: CompatSliceInstance): boolean;
    toString(): string;
    /** Compatible signature: never returns null. */
    toJSON(): SliceJSON;
}

export interface CompatSliceConstructor {
    new(content: CompatFragmentInstance, openStart: number, openEnd: number): CompatSliceInstance;
    readonly empty: CompatSliceInstance;
    isSlice(value: unknown): value is CompatSliceInstance;
    fromJSON(schema: CompatSchemaInstance, json: SliceJSON): CompatSliceInstance;
    maxOpen(fragment: CompatFragmentInstance, openIsolating?: boolean): CompatSliceInstance;
}

export const Slice: CompatSliceConstructor = _Slice as unknown as CompatSliceConstructor;
export type Slice = CompatSliceInstance;

// ---------------------------------------------------------------------------
// NodeRange
// Re-export NodeRange with compatible $from/$to (CompatResolvedPosInstance)
// and parent (CompatNodeInstance) so consumers get compat types throughout.
// ---------------------------------------------------------------------------

export interface CompatNodeRangeInstance {
    get $from(): CompatResolvedPosInstance;
    get $to(): CompatResolvedPosInstance;
    get depth(): number;
    get start(): number;
    get end(): number;
    get parent(): CompatNodeInstance;
    get startIndex(): number;
    get endIndex(): number;
}

export interface CompatNodeRangeConstructor {
    // eslint-disable-next-line @typescript-eslint/prefer-function-type
    new($from: CompatResolvedPosInstance, $to: CompatResolvedPosInstance, depth: number): CompatNodeRangeInstance;
}

export const NodeRange: CompatNodeRangeConstructor = _NodeRange as unknown as CompatNodeRangeConstructor;
export type NodeRange = CompatNodeRangeInstance;

// ---------------------------------------------------------------------------
// Schema
// Re-export Schema with compatible Node/Fragment/NodeType references so that
// e.g. schema.nodes returns CompatNodeTypeInstance and schema.node() returns
// CompatNodeInstance.
// ---------------------------------------------------------------------------

export interface CompatSchemaInstance<Nodes extends string = string, Marks extends string = string> {
    /**
     * The schema's spec, with nodes and marks normalised to OrderedMap
     * (as they are stored internally after construction).
     */
    get spec(): {
        nodes: import('@type-editor/commons').OrderedMap<NodeSpec>;
        marks: import('@type-editor/commons').OrderedMap<MarkSpec>;
        topNode?: string;
    };
    get nodes(): Readonly<Record<Nodes, CompatNodeTypeInstance>> & Readonly<Record<string, CompatNodeTypeInstance>>;
    get marks(): Readonly<Record<Marks, import('@type-editor/model').MarkType>> & Readonly<Record<string, import('@type-editor/model').MarkType>>;
    get linebreakReplacement(): CompatNodeTypeInstance | null;
    get topNodeType(): CompatNodeTypeInstance;
    get cached(): Record<string, unknown>;
    get nodeFromJSON(): (json: NodeJSON | Array<NodeJSON>) => CompatNodeInstance;
    get markFromJSON(): (json: MarkJSON) => import('@type-editor/model').Mark;
    node(type: string | CompatNodeTypeInstance, attrs?: import('@type-editor/model').Attrs | null, content?: CompatFragmentInstance | CompatNodeInstance | ReadonlyArray<CompatNodeInstance>, marks?: ReadonlyArray<import('@type-editor/model').Mark>): CompatNodeInstance;
    text(text: string, marks?: ReadonlyArray<import('@type-editor/model').Mark>): CompatNodeInstance;
    mark(type: string | import('@type-editor/model').MarkType, attrs?: import('@type-editor/model').Attrs): import('@type-editor/model').Mark;
    nodeType(name: string): CompatNodeTypeInstance;
}

export interface CompatSchemaConstructor {
    // eslint-disable-next-line @typescript-eslint/prefer-function-type
    new<Nodes extends string = string, Marks extends string = string>(spec: SchemaSpec<Nodes, Marks>): CompatSchemaInstance<Nodes, Marks>;
}

export const Schema: CompatSchemaConstructor = _Schema as unknown as CompatSchemaConstructor;
export type Schema<Nodes extends string = string, Marks extends string = string> = CompatSchemaInstance<Nodes, Marks>;

// ---------------------------------------------------------------------------
// ContentMatch
// Re-export ContentMatch with compatible Fragment/Node references so that
// e.g. fillBefore() returns CompatFragmentInstance | null.
// ---------------------------------------------------------------------------

export interface CompatContentMatchInstance {
    readonly next: Array<{ type: CompatNodeTypeInstance; next: CompatContentMatchInstance }>;
    readonly validEnd: boolean;
    readonly inlineContent: boolean;
    readonly defaultType: CompatNodeTypeInstance;
    readonly edgeCount: number;
    matchType(type: CompatNodeTypeInstance): CompatContentMatchInstance | null;
    matchFragment(fragment: CompatFragmentInstance, start?: number, end?: number): CompatContentMatchInstance | null;
    compatible(other: CompatContentMatchInstance): boolean;
    fillBefore(after: CompatFragmentInstance, toEnd?: boolean, startIndex?: number): CompatFragmentInstance | null;
    findWrapping(target: CompatNodeTypeInstance): ReadonlyArray<CompatNodeTypeInstance> | null;
    edge(n: number): { type: CompatNodeTypeInstance; next: CompatContentMatchInstance };
    toString(): string;
}

// ---------------------------------------------------------------------------
// NodeType
// Re-export NodeType with compatible Node/Fragment references so that
// e.g. create() returns CompatNodeInstance and accepts CompatFragmentInstance.
// ---------------------------------------------------------------------------

export interface CompatNodeTypeInstance {
    get name(): string;
    get schema(): CompatSchemaInstance;
    get spec(): NodeSpec;
    get contentMatch(): CompatContentMatchInstance;
    set contentMatch(value: CompatContentMatchInstance);
    get markSet(): ReadonlyArray<import('@type-editor/model').MarkType> | null;
    get defaultAttrs(): import('@type-editor/model').Attrs;
    get inlineContent(): boolean;
    get isInline(): boolean;
    get isTextblock(): boolean;
    get isBlock(): boolean;
    get isText(): boolean;
    get isLeaf(): boolean;
    get isAtom(): boolean;
    get whitespace(): 'pre' | 'normal';
    isInGroup(group: string): boolean;
    hasRequiredAttrs(): boolean;
    compatibleContent(other: CompatNodeTypeInstance): boolean;
    create(attrs?: import('@type-editor/model').Attrs | null, content?: CompatFragmentInstance | CompatNodeInstance | ReadonlyArray<CompatNodeInstance> | null, marks?: ReadonlyArray<import('@type-editor/model').Mark>): CompatNodeInstance;
    createChecked(attrs?: import('@type-editor/model').Attrs | null, content?: CompatFragmentInstance | CompatNodeInstance | ReadonlyArray<CompatNodeInstance> | null, marks?: ReadonlyArray<import('@type-editor/model').Mark>): CompatNodeInstance;
    createAndFill(attrs?: import('@type-editor/model').Attrs | null, content?: CompatFragmentInstance | CompatNodeInstance | ReadonlyArray<CompatNodeInstance> | null, marks?: ReadonlyArray<import('@type-editor/model').Mark>): CompatNodeInstance | null;
    validContent(content: CompatFragmentInstance): boolean;
    checkContent(content: CompatFragmentInstance): void;
    checkAttrs(attrs: import('@type-editor/model').Attrs): void;
    allowsMarkType(markType: import('@type-editor/model').MarkType): boolean;
    allowsMarks(marks: ReadonlyArray<import('@type-editor/model').Mark>): boolean;
    allowedMarks(marks: ReadonlyArray<import('@type-editor/model').Mark>): ReadonlyArray<import('@type-editor/model').Mark>;
}

export interface CompatNodeTypeConstructor {
    new(name: string, schema: CompatSchemaInstance, spec: NodeSpec): CompatNodeTypeInstance;
    compile<Nodes extends string>(nodes: import('@type-editor/commons').OrderedMap<NodeSpec>, schema: CompatSchemaInstance<Nodes>): Readonly<Record<Nodes, CompatNodeTypeInstance>>;
}

export const NodeType: CompatNodeTypeConstructor = _NodeType as unknown as CompatNodeTypeConstructor;
export type NodeType = CompatNodeTypeInstance;
export type ContentMatch = CompatContentMatchInstance;

// ---------------------------------------------------------------------------
// DOMSerializer
// Re-export DOMSerializer with compatible Node/Fragment/Schema references so
// that the node/mark serialiser callbacks receive CompatNodeInstance and
// fromSchema accepts CompatSchemaInstance.
// ---------------------------------------------------------------------------

export interface CompatDOMSerializerInstance {
    get nodes(): Record<string, (node: CompatNodeInstance) => DOMOutputSpec>;
    get marks(): Record<string, (mark: import('@type-editor/model').Mark, inline: boolean) => DOMOutputSpec>;
    serializeFragment(fragment: CompatFragmentInstance, options?: { document?: Document }, target?: HTMLElement | DocumentFragment): HTMLElement | DocumentFragment;
    serializeNode(node: CompatNodeInstance, options?: { document?: Document }): globalThis.Node;
}

export interface CompatDOMSerializerConstructor {
    new(
        nodes: Record<string, (node: CompatNodeInstance) => DOMOutputSpec>,
        marks: Record<string, (mark: import('@type-editor/model').Mark, inline: boolean) => DOMOutputSpec>,
    ): CompatDOMSerializerInstance;
    renderSpec(doc: Document, structure: DOMOutputSpec, xmlNS?: string | null): { dom: globalThis.Node; contentDOM?: HTMLElement };
    fromSchema(schema: CompatSchemaInstance): CompatDOMSerializerInstance;
    nodesFromSchema(schema: CompatSchemaInstance): Record<string, (node: CompatNodeInstance) => DOMOutputSpec>;
    marksFromSchema(schema: CompatSchemaInstance): Record<string, (mark: import('@type-editor/model').Mark, inline: boolean) => DOMOutputSpec>;
}

export const DOMSerializer: CompatDOMSerializerConstructor = _DOMSerializer as unknown as CompatDOMSerializerConstructor;
export type DOMSerializer = CompatDOMSerializerInstance;

// ---------------------------------------------------------------------------
// DOMParser
// Re-export DOMParser with a compatible `parse` return type.
// In the original ProseMirror, DOMParser.parse returns Node | Fragment.
// In @type-editor/model it returns Node | undefined. We wrap it here so
// that downstream ProseMirror-compatible code sees the original signature.
// ---------------------------------------------------------------------------

export interface CompatDOMParserInstance {
    readonly matchedStyles: ReadonlyArray<string>;
    readonly normalizeLists: boolean;
    readonly schema: CompatSchemaInstance;
    matchTag(dom: globalThis.Node, context: unknown, after?: TagParseRule): TagParseRule | undefined;
    matchStyle(prop: string, value: string, context: unknown, after?: StyleParseRule): StyleParseRule | undefined;
    /** Compatible signature: returns Node | Fragment (never undefined). */
    parse(dom: globalThis.Node | Element | string | null, options?: ParseOptions): CompatNodeInstance | CompatFragmentInstance;
    parseSlice(dom: globalThis.Node, options?: ParseOptions): CompatSliceInstance;
}

export interface CompatDOMParserConstructor {
    new(schema: CompatSchemaInstance, rules: ReadonlyArray<ParseRule>): CompatDOMParserInstance;
    fromSchema(schema: CompatSchemaInstance): CompatDOMParserInstance;
    schemaRules(schema: CompatSchemaInstance): Array<ParseRule>;
}

export const DOMParser = _DOMParser as unknown as CompatDOMParserConstructor;
