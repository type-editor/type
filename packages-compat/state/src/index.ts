/**
 * @type-editor-compat/state
 *
 * Compatibility layer for @type-editor/state providing ProseMirror-compatible type signatures.
 *
 * This module re-exports all classes from @type-editor/state with augmented TypeScript types
 * that use concrete class references instead of interface types (PmEditorState, PmPlugin, etc.).
 *
 * KEY DIFFERENCES FROM BASE MODULE:
 * - EditorProps uses EditorView, EditorState, Transaction instead of Pm* interfaces
 * - PluginSpec uses concrete types
 * - StateField uses concrete types
 * - All classes return concrete types instead of interfaces
 */

import type {Decoration} from '@type-editor/decoration';
import type {
    AttrValue,
    DecorationSpec,
    DOMEventMap,
    EditorStateDto,
    Mappable,
    PmDecoration,
    SelectionJSON,
    StateJSON,
    ViewMutationRecord,
} from '@type-editor/editor-types';
import {Dragging} from '@type-editor/input';
import {
    AllSelection as BaseAllSelection,
    EditorState as BaseEditorState,
    type EditorStateConfiguration,
    type FieldDesc,
    NodeSelection as BaseNodeSelection,
    Plugin as BasePlugin,
    PluginKey as BasePluginKey,
    Selection as BaseSelection,
    SelectionFactory as BaseSelectionFactory,
    SelectionRange as BaseSelectionRange,
    TextSelection as BaseTextSelection,
    Transaction as BaseTransaction,
} from '@type-editor/state';
import type {
    Attrs,
    ContentMatch,
    DOMSerializer,
    Fragment,
    Mark,
    MarkType,
    NodeRange,
    NodeType,
    PmNode,
    ResolvedPos,
    Schema,
    Slice,
} from '@type-editor-compat/model';
import type {
    Mapping as BaseMapping,
    Step as BaseStep,
    StepResult as BaseStepResult,
    Transform as BaseTransform,
} from '@type-editor-compat/transform';

// Forward declare EditorView type (will be defined in compat/view)
// This interface mirrors the EditorView from @type-editor-compat/view
// to avoid circular dependency while providing full type safety.
export interface EditorView {
    readonly props: Readonly<DirectEditorProps>;
    readonly root: Document | ShadowRoot;
    focused: boolean;
    markCursor: ReadonlyArray<Mark>;
    dragging: Dragging;
    readonly cursorWrapper: { dom: Node; deco: Decoration } | null;
    readonly dom: HTMLElement;
    readonly editable: boolean;
    readonly state: EditorState;
    readonly composing: boolean;
    readonly isDestroyed: boolean;

    update(props: DirectEditorProps): void;
    setProps(props: Partial<DirectEditorProps>): void;
    updateState(state: EditorState): void;
    scrollToSelection(): void;

    someProp<PropName extends keyof EditorProps, Result>(
        propName: PropName,
        callbackFunc?: (value: NonNullable<EditorProps[PropName]>) => Result
    ): Result | NonNullable<EditorProps[PropName]> | undefined;

    hasFocus(): boolean;
    focus(): void;
    updateRoot(): void;
    posAtCoords(coords: { left: number; top: number }): { pos: number; inside: number } | null;
    coordsAtPos(pos: number, side?: number): { left: number; right: number; top: number; bottom: number };
    domAtPos(pos: number, side?: number): { node: Node; offset: number };
    nodeDOM(pos: number): Node | null;
    posAtDOM(node: Node, offset: number, bias?: number): number;
    endOfTextblock(dir: 'up' | 'down' | 'left' | 'right' | 'forward' | 'backward', state?: EditorState): boolean;
    pasteHTML(html: string, event?: ClipboardEvent): boolean;
    pasteText(text: string, event?: ClipboardEvent): boolean;
    dispatch(tr: Transaction): void;
    destroy(): void;
}

// ============================================================================
// DirectEditorProps - Forward declaration for EditorView
// ============================================================================

export interface DirectEditorProps extends EditorProps {
    state: EditorState;
    plugins?: ReadonlyArray<Plugin>;
    dispatchTransaction?: (transaction: Transaction) => void;
}

// ============================================================================
// Concrete Type Aliases
// ============================================================================

/**
 * Plugin interface with concrete type references instead of Pm* interfaces.
 * This ensures getState() accepts the compat EditorState instead of the base module's EditorState.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Plugin<PluginState = any> {
    readonly props: EditorProps<Plugin<PluginState>>;
    readonly key: string;
    readonly spec: PluginSpec<PluginState>;

    /**
     * Extract the plugin's state field from an editor state.
     */
    getState(state: EditorState): PluginState | undefined;
}

// ============================================================================
// SelectionBookmark Interface - Override with concrete types
// ============================================================================

/**
 * A lightweight, document-independent representation of a selection.
 * You can define a custom bookmark type for a custom selection class
 * to make the history handle it well.
 *
 * This is a compatibility version that uses concrete Selection type
 * instead of PmSelection interface for the resolve method.
 *
 * Bookmarks store selection positions as simple numbers rather than
 * resolved positions, making them suitable for persistence across
 * document changes. They can be mapped through document transformations
 * and then resolved back into full selections.
 */
export interface SelectionBookmark {
    /**
     * Map the bookmark through a set of changes.
     * This updates the stored positions to reflect document transformations.
     *
     * @param mapping The mappable transformation (e.g., from a transaction)
     * @returns A new bookmark with mapped positions
     */
    map: (mapping: Mappable) => SelectionBookmark;

    /**
     * Resolve the bookmark to a real selection again. This may need to
     * do some error checking and may fall back to a default (usually
     * `EditorSelection.textSelectionBetween`) if mapping made the
     * bookmark invalid.
     *
     * @param doc The document in which to resolve the selection
     * @returns A valid selection in the given document
     */
    resolve: (doc: PmNode) => Selection;
}

// ============================================================================
// Selection Interfaces - Override with concrete types
// ============================================================================

/**
 * Selection type discriminant - used for TypeScript narrowing.
 * Each selection subtype has a unique literal type value.
 */
export type SelectionType = 'text' | 'node' | 'all' | 'base' | 'custom';

/**
 * Selection interface with concrete type references instead of Pm* interfaces.
 * This ensures methods like map(), replace(), and replaceWith() use concrete types.
 */
export interface Selection extends Omit<BaseSelection, 'map' | 'replace' | 'replaceWith' | 'ranges' | 'eq' | 'getBookmark' | 'node' | 'type' | '$from' | '$to' | 'anchorPos' | 'headPos' | '$cursor' | '$head' | '$anchor' | 'content'> {
    /**
     * The type of this selection. Used as a discriminant for type narrowing.
     */
    readonly type: SelectionType;

    /** The ranges covered by the selection */
    readonly ranges: ReadonlyArray<SelectionRange>;
    /**
     * The selected node if this is a node selection, null otherwise
     */
    readonly node: PmNode

    readonly $from: ResolvedPos

    readonly $to: ResolvedPos

    readonly $head: ResolvedPos

    readonly $anchor: ResolvedPos

    readonly anchorPos: ResolvedPos

    readonly headPos: ResolvedPos

    readonly $cursor: ResolvedPos | null;

    /**
     * Test whether this selection is equal to another selection.
     * Selections are equal if they have the same type and positions.
     *
     * @param selection The selection to compare with
     * @returns True if the selections are equal, false otherwise
     */
    eq(selection: Selection): boolean;

    /**
     * Map this selection through a mappable transformation.
     * Updates the selection to reflect document changes.
     *
     * @param doc The new document after the transformation
     * @param mapping The mappable transformation
     * @returns A new selection mapped to the new document
     */
    map(doc: PmNode, mapping: Mappable): Selection;

    /**
     * Replace the selection with a slice or, if no slice is given,
     * delete the selection. Will append to the given transaction.
     *
     * @param transaction The transaction to append the replacement to
     * @param content The content to insert (optional, defaults to empty/delete)
     */
    replace(transaction: Transaction, content?: Slice): void;

    /**
     * Replace the selection with the given node, appending the changes
     * to the given transaction.
     *
     * @param transaction The transaction to append the replacement to
     * @param node The node to insert in place of the selection
     */
    replaceWith(transaction: Transaction, node: PmNode): void;

    /**
     * Get a bookmark for this selection. A bookmark is a lightweight,
     * document-independent representation that can be mapped through
     * changes and resolved back to a selection.
     *
     * @returns A bookmark that can recreate this selection, or null if bookmarking is not supported
     */
    getBookmark(): SelectionBookmark | null;

    /**
     * Convert this selection to a JSON representation that can be serialized
     * and later restored using fromJSON.
     *
     * @returns A JSON object representing this selection
     */
    toJSON(): SelectionJSON;

    content(): Slice;
}

export type {SelectionJSON};

/**
 * SelectionRange interface with concrete type references.
 */
export interface SelectionRange {
    readonly $from: ResolvedPos;
    readonly $to: ResolvedPos;
}

export interface SelectionRangeConstructor {
    // eslint-disable-next-line @typescript-eslint/prefer-function-type
    new($from: ResolvedPos, $to: ResolvedPos): SelectionRange;
}

/**
 * TextSelection interface with concrete type references.
 */
export interface TextSelection extends Omit<Selection, 'type'> {
    readonly type: 'text';
    readonly $cursor: ResolvedPos | null;

    /**
     * Test whether this selection is equal to another selection.
     */
    eq(other: Selection): boolean;
}

/**
 * NodeSelection interface with concrete type references.
 */
export interface NodeSelection extends Omit<Selection, 'type'> {
    readonly type: 'node';
    readonly node: PmNode;

    /**
     * Test whether this selection is equal to another selection.
     */
    eq(other: Selection): boolean;

    /**
     * Get the content of this selection as a slice.
     */
    content(): Slice;
}

/**
 * AllSelection interface with concrete type references.
 */
export interface AllSelection extends Omit<Selection, 'type'> {
    readonly type: 'all';

    /**
     * Test whether this selection is equal to another selection.
     */
    eq(other: Selection): boolean;
}

/**
 * Union of all concrete selection types.
 * Use this type when you need to work with a specific selection type
 * and benefit from TypeScript's discriminated union narrowing.
 *
 * This enables proper type narrowing with type guard functions:
 * ```typescript
 * function isNodeSelection(value: unknown): value is NodeSelection {
 *     return value instanceof NodeSelection;
 * }
 *
 * if (isNodeSelection(state.selection)) {
 *     // TypeScript knows state.selection is NodeSelection
 * } else {
 *     // TypeScript knows state.selection is TextSelection | AllSelection
 * }
 * ```
 */
export type AnySelection = TextSelection | NodeSelection | AllSelection;

// Transform types - used in Transaction interface
export type Step = BaseStep;
export type StepResult = BaseStepResult;
export type Mapping = BaseMapping;

// ============================================================================
// DecorationSet / DecorationGroup - compat types using PmNode from compat/model
// Declared here (not in view compat) so EditorProps.decorations can reference
// CompatDecorationSetInstance without a circular dependency.
// ============================================================================


export interface CompatDecorationSetInstance {
    get local(): ReadonlyArray<PmDecoration>;
    get children(): ReadonlyArray<number | CompatDecorationSetInstance>;
    find(start?: number, end?: number, predicate?: (spec: DecorationSpec) => boolean): Array<PmDecoration>;
    map(mapping: Mappable, doc: PmNode, options?: { onRemove?: (decorationSpec: DecorationSpec) => void }): CompatDecorationSetInstance;
    mapInner(mapping: Mappable, node: PmNode, offset: number, oldOffset: number, options: { onRemove?: (decorationSpec: DecorationSpec) => void }): CompatDecorationSetInstance;
    add(doc: PmNode, decorations: Array<PmDecoration>): CompatDecorationSetInstance;
    remove(decorations: Array<PmDecoration>): CompatDecorationSetInstance;
    forChild(offset: number, node: PmNode): CompatDecorationSetInstance | CompatDecorationGroupInstance;
    eq(other: CompatDecorationSetInstance): boolean;
    locals(node: PmNode): Array<PmDecoration>;
    localsInner(node: PmNode): ReadonlyArray<PmDecoration>;
    forEachSet(callbackFunc: (set: CompatDecorationSetInstance) => void): void;
}

export interface CompatDecorationSetConstructor {
    new(local?: ReadonlyArray<PmDecoration>, children?: ReadonlyArray<number | CompatDecorationSetInstance>): CompatDecorationSetInstance;
    readonly empty: CompatDecorationSetInstance;
    create(doc: PmNode, decorations: Array<PmDecoration>): CompatDecorationSetInstance;
}

export type DecorationSet = CompatDecorationSetInstance;

export interface CompatDecorationGroupInstance {
    map(mapping: Mappable, doc: PmNode): DecorationSource;
    forChild(offset: number, child: PmNode): DecorationSource | CompatDecorationSetInstance;
    eq(other: CompatDecorationGroupInstance): boolean;
    locals(node: PmNode): ReadonlyArray<PmDecoration>;
    forEachSet(callbackFunc: (set: CompatDecorationSetInstance) => void): void;
}

export interface CompatDecorationGroupConstructor {
    // eslint-disable-next-line @typescript-eslint/prefer-function-type
    new(members: ReadonlyArray<CompatDecorationSetInstance>): CompatDecorationGroupInstance;
}

// ============================================================================
// DecorationSource - Override with concrete types
// ============================================================================

/**
 * An object that can provide decorations.
 * Implemented by DecorationSet, and passed to node views.
 */
export interface DecorationSource {
    /**
     * Map the set of decorations in response to a change in the document.
     */
    map: (mapping: Mappable, node: PmNode) => DecorationSource;

    /**
     * Get local decorations for the given node.
     * @internal
     */
    locals(node: PmNode): ReadonlyArray<Decoration>;

    /**
     * Extract a DecorationSource containing decorations for the given child node at the given offset.
     */
    forChild(offset: number, child: PmNode): DecorationSource;

    /**
     * Check equality with another decoration source.
     * @internal
     */
    eq(other: DecorationSource): boolean;

    /**
     * Call the given function for each decoration set in the group.
     */
    forEachSet(callbackFunc: (set: DecorationSource) => void): void;
}

// ============================================================================
// NodeView - Override with concrete types
// ============================================================================

/**
 * By default, document nodes are rendered using the result of the
 * toDOM method of their spec, and managed entirely by the editor.
 * For some use cases, you want more control over the behavior of
 * a node's in-editor representation, and need to define a custom node view.
 */
export interface NodeView {
    /**
     * The outer DOM node that represents the document node.
     */
    dom: Node;

    /**
     * The DOM node that should hold the node's content.
     */
    contentDOM?: HTMLElement | null;

    /**
     * When given, this will be called when the view is updating itself.
     * Should return true if it was able to update to that node.
     */
    update?: (node: PmNode, decorations: ReadonlyArray<Decoration>, innerDecorations: DecorationSource) => boolean;

    /**
     * By default, update will only be called when a node of the same
     * node type appears in this view's position. Set to true to allow
     * handling multiple node types.
     */
    multiType?: boolean;

    /**
     * Can be used to override the way the node's selected status is displayed.
     */
    selectNode?: () => void;

    /**
     * When defining a selectNode method, also provide deselectNode.
     */
    deselectNode?: () => void;

    /**
     * Handle setting the selection inside the node.
     */
    setSelection?: (anchor: number, head: number, root: Document | ShadowRoot) => void;

    /**
     * Prevent the editor view from handling some or all DOM events.
     */
    stopEvent?: (event: Event) => boolean;

    /**
     * Called when a mutation happens within the view.
     */
    ignoreMutation?: (mutation: ViewMutationRecord) => boolean;

    /**
     * Called when the node view is removed from the editor or destroyed.
     */
    destroy?: () => void;
}

// ============================================================================
// MarkView - Override with concrete types
// ============================================================================

/**
 * By default, document marks are rendered using the result of the
 * toDOM method of their spec, and managed entirely by the editor.
 */
export interface MarkView {
    /**
     * The outer DOM node that represents the mark.
     */
    dom: Node;

    /**
     * The DOM node that should hold the mark's content.
     */
    contentDOM?: HTMLElement | null;

    /**
     * Called when a mutation happens within the view.
     */
    ignoreMutation?: (mutation: ViewMutationRecord) => boolean;

    /**
     * Called when the mark view is removed from the editor or destroyed.
     */
    destroy?: () => void;
}

// ============================================================================
// NodeViewConstructor - Override with concrete types
// ============================================================================

/**
 * The type of function provided to create node views.
 * Uses concrete EditorView and Decoration types instead of interfaces.
 */
export type NodeViewConstructor = (
    node: PmNode,
    view: EditorView,
    getPos: () => number | undefined,
    decorations: ReadonlyArray<Decoration>,
    innerDecorations: DecorationSource
) => NodeView;

// ============================================================================
// MarkViewConstructor - Override with concrete types
// ============================================================================

/**
 * The type of function used to create mark views.
 * Uses concrete EditorView type instead of interface.
 */
export type MarkViewConstructor = (mark: Mark, view: EditorView, inline: boolean) => MarkView;

// ============================================================================
// EditorProps - Override with concrete types
// ============================================================================

/**
 * EditorProps with concrete type references instead of Pm* interfaces.
 * This is the key type that needs overriding for ProseMirror compatibility.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface EditorProps<P = any> {
    handleDOMEvents?: {
        // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
        [event in keyof DOMEventMap]?: (this: P, view: EditorView, event: DOMEventMap[event]) => boolean | void
    };
    handleKeyDown?: (this: P, view: EditorView, event: KeyboardEvent) => boolean | void;
    handleKeyPress?: (this: P, view: EditorView, event: KeyboardEvent) => boolean | void;
    handleTextInput?: (this: P, view: EditorView, from: number, to: number, text: string, deflt: () => Transaction) => boolean | void;
    handleClickOn?: (this: P, view: EditorView, pos: number, node: PmNode, nodePos: number, event: MouseEvent, direct: boolean) => boolean | void;
    handleClick?: (this: P, view: EditorView, pos: number, event: MouseEvent) => boolean | void;
    handleDoubleClickOn?: (this: P, view: EditorView, pos: number, node: PmNode, nodePos: number, event: MouseEvent, direct: boolean) => boolean | void;
    handleDoubleClick?: (this: P, view: EditorView, pos: number, event: MouseEvent) => boolean | void;
    handleTripleClickOn?: (this: P, view: EditorView, pos: number, node: PmNode, nodePos: number, event: MouseEvent, direct: boolean) => boolean | void;
    handleTripleClick?: (this: P, view: EditorView, pos: number, event: MouseEvent) => boolean | void;
    handlePaste?: (this: P, view: EditorView, event: ClipboardEvent, slice: Slice) => boolean | void;
    handleDrop?: (this: P, view: EditorView, event: DragEvent, slice: Slice, moved: boolean) => boolean | void;
    handleScrollToSelection?: (this: P, view: EditorView) => boolean | void;
    dragCopies?: (event: DragEvent) => boolean;
    createSelectionBetween?: (this: P, view: EditorView, anchor: ResolvedPos, head: ResolvedPos) => Selection | null;
    domParser?: DOMParser;
    transformPastedHTML?: (this: P, html: string, view: EditorView) => string;
    clipboardParser?: DOMParser;
    transformPastedText?: (this: P, text: string, plain: boolean, view: EditorView) => string;
    clipboardTextParser?: (this: P, text: string, $context: ResolvedPos, plain: boolean, view: EditorView) => Slice;
    transformPasted?: (this: P, slice: Slice, view: EditorView, plain: boolean) => Slice;
    transformCopied?: (this: P, slice: Slice, view: EditorView) => Slice;
    nodeViews?: Record<string, NodeViewConstructor>;
    markViews?: Record<string, MarkViewConstructor>;
    clipboardSerializer?: DOMSerializer;
    clipboardTextSerializer?: (this: P, content: Slice, view: EditorView) => string;
    decorations?: (this: P, state: EditorState) => CompatDecorationSetInstance | DecorationSource | null | undefined;
    editable?: (this: P, state: EditorState) => boolean;
    attributes?: Record<string, string> | ((state: EditorState) => Record<string, string>);
    scrollThreshold?: number | { top: number; right: number; bottom: number; left: number };
    scrollMargin?: number | { top: number; right: number; bottom: number; left: number };
}

// ============================================================================
// PluginView - Override with concrete types
// ============================================================================

export interface PluginView {
    update?: (view: EditorView, prevState: EditorState) => void;
    destroy?: () => void;
}

// ============================================================================
// Transaction - Override with concrete types
// ============================================================================

/**
 * Transaction type with concrete type references instead of Pm* interfaces.
 * This ensures getMeta and setMeta accept PluginKey from this compat module,
 * and Transform methods use Step instead of PmStep and return Transaction instead of Transform.
 *
 * IMPORTANT: Since BaseTransaction extends Transform, we must omit all Transform methods
 * from BaseTransaction as well, not just from BaseTransform. Otherwise, the inherited
 * methods from Transform will still be present with their original `this` return type.
 *
 * Transaction extends BaseTransform (the compat Transform interface from @type-editor-compat/transform)
 * so that it is assignable to Transform wherever that is expected.
 */
export type Transaction = Omit<BaseTransaction,
    // Transaction-specific methods
    | 'getMeta' | 'setMeta' | 'selection' | 'setSelection' | 'replaceSelection'
    | 'replaceSelectionWith' | 'deleteSelection' | 'insertText' | 'ensureMarks'
    | 'addStoredMark' | 'removeStoredMark' | 'setTime' | 'scrollIntoView' | 'setStoredMarks'
    // Transform properties/methods that are re-declared below with compat types
    | 'steps' | 'docs' | 'doc' | 'mapping' | 'before'
    | 'step' | 'maybeStep' | 'addStep' | 'replace' | 'replaceWith' | 'delete' | 'insert'
    | 'replaceRange' | 'replaceRangeWith' | 'deleteRange' | 'lift' | 'join' | 'wrap'
    | 'setBlockType' | 'setNodeMarkup' | 'setNodeAttribute' | 'setDocAttribute'
    | 'addNodeMark' | 'removeNodeMark' | 'split' | 'addMark' | 'removeMark' | 'clearIncompatible'
> & Omit<BaseTransform,
    // Omit all Transform methods/properties that are explicitly overridden below
    | 'steps' | 'docs' | 'doc' | 'mapping' | 'before'
    | 'step' | 'maybeStep' | 'addStep' | 'replace' | 'replaceWith' | 'delete' | 'insert'
    | 'replaceRange' | 'replaceRangeWith' | 'deleteRange' | 'lift' | 'join' | 'wrap'
    | 'setBlockType' | 'setNodeMarkup' | 'setNodeAttribute' | 'setDocAttribute'
    | 'addNodeMark' | 'removeNodeMark' | 'split' | 'addMark' | 'removeMark' | 'clearIncompatible'
> & {
    /**
     * Store a metadata property in this transaction, keyed either by
     * name or by plugin.
     */
    setMeta(key: string | Plugin | PluginKey, value: any): Transaction;

    /**
     * Retrieve a metadata property for a given name or plugin.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getMeta(key: string | Plugin | PluginKey): any;

    // ========================================================================
    // Transform methods overridden with concrete types
    // ========================================================================

    /**
     * The steps in this transform.
     */
    readonly steps: ReadonlyArray<Step>;

    /**
     * The documents before each of the steps.
     */
    readonly docs: ReadonlyArray<PmNode>;

    /**
     * A mapping with the maps for each of the steps in this transform.
     */
    readonly mapping: Mapping;

    /**
     * The current document (the result of applying all steps).
     */
    readonly doc: PmNode;

    /**
     * The starting document.
     */
    readonly before: PmNode;

    /**
     * Apply a new step in this transform, saving the result. Throws an
     * error when the step fails.
     * @param step - The step to apply.
     * @returns This transaction instance for chaining.
     * @throws {TransformError} When the step fails to apply.
     */
    step(step: Step): Transaction;

    /**
     * Try to apply a step in this transformation, ignoring it if it
     * fails. Returns the step result.
     * @param step - The step to try applying.
     * @returns The result of applying the step, which may indicate failure.
     */
    maybeStep(step: Step): StepResult;

    /**
     * Add a step to the transform without applying it (assumes it has already been applied).
     * Updates the internal state to track the step and its resulting document.
     * @param step - The step that was applied.
     * @param doc - The resulting document after applying the step.
     */
    addStep(step: Step, doc: PmNode): void;

    // ========================================================================
    // Transaction methods using Selection or returning Transaction
    // ========================================================================

    /**
     * The transaction's current selection. This defaults to the editor
     * selection mapped through the steps in the transaction, but can be
     * overwritten with setSelection.
     */
    readonly selection: AnySelection;

    /**
     * Update the transaction's current selection. Will determine the
     * selection that the editor gets when the transaction is applied.
     * @param selection - The selection to set.
     * @returns This transaction instance for chaining.
     */
    setSelection(selection: Selection): Transaction;

    /**
     * Replace the current selection with the given slice.
     * @param slice - The slice to replace the selection with.
     * @returns This transaction instance for chaining.
     */
    replaceSelection(slice: Slice): Transaction;

    /**
     * Replace the selection with the given node. When `inheritMarks` is
     * true and the content is inline, it inherits the marks from the
     * place where it is inserted.
     * @param node - The node to replace the selection with.
     * @param inheritMarks - Whether to inherit marks from the insertion position.
     * @returns This transaction instance for chaining.
     */
    replaceSelectionWith(node: PmNode, inheritMarks?: boolean): Transaction;

    /**
     * Delete the selection.
     * @returns This transaction instance for chaining.
     */
    deleteSelection(): Transaction;

    /**
     * Replace the given range, or the selection if no range is given,
     * with a text node containing the given string.
     * @param text - The text to insert.
     * @param from - The start position of the range to replace (optional).
     * @param to - The end position of the range to replace (optional).
     * @returns This transaction instance for chaining.
     */
    insertText(text: string, from?: number, to?: number): Transaction;

    /**
     * Make sure the current stored marks or, if that is null, the marks
     * at the selection, match the given set of marks. Does nothing if
     * this is already the case.
     * @param marks - The marks to ensure.
     * @returns This transaction instance for chaining.
     */
    ensureMarks(marks: ReadonlyArray<Mark>): Transaction;

    /**
     * Add a mark to the set of stored marks.
     * @param mark - The mark to add.
     * @returns This transaction instance for chaining.
     */
    addStoredMark(mark: Mark): Transaction;

    /**
     * Remove a mark or mark type from the set of stored marks.
     * @param mark - The mark or mark type to remove.
     * @returns This transaction instance for chaining.
     */
    removeStoredMark(mark: Mark | MarkType): Transaction;

    /**
     * Update the timestamp for the transaction.
     * @param time - The timestamp to set.
     * @returns This transaction instance for chaining.
     */
    setTime(time: number): Transaction;

    /**
     * Indicate that the editor should scroll the selection into view
     * when updated to the state produced by this transaction.
     * @returns This transaction instance for chaining.
     */
    scrollIntoView(): Transaction;

    /**
     * Set the current stored marks.
     * @param marks - The marks to set, or null to clear.
     * @returns This transaction instance for chaining.
     */
    setStoredMarks(marks: ReadonlyArray<Mark> | null): Transaction;

    // ========================================================================
    // Transform methods overridden to return Transaction instead of Transform
    // ========================================================================

    /**
     * Replace a range of the document with a slice, or, if no slice is given,
     * delete the range. Will append to the given transaction.
     * @param from - The start position of the range.
     * @param to - The end position of the range (optional, defaults to from).
     * @param slice - The content to insert (optional, defaults to empty/delete).
     * @returns This transaction instance for chaining.
     */
    replace(from: number, to?: number, slice?: Slice): Transaction;

    /**
     * Replace the given range with the given content, which may be a fragment,
     * node, or array of nodes.
     * @param from - The start position of the range.
     * @param to - The end position of the range.
     * @param content - The content to insert.
     * @returns This transaction instance for chaining.
     */
    replaceWith(from: number, to: number, content: Fragment | PmNode | ReadonlyArray<PmNode>): Transaction;

    /**
     * Delete the part of the document between the given positions.
     * @param from - The start position.
     * @param to - The end position.
     * @returns This transaction instance for chaining.
     */
    delete(from: number, to: number): Transaction;

    /**
     * Insert the given content at the given position.
     * @param pos - The position to insert at.
     * @param content - The content to insert.
     * @returns This transaction instance for chaining.
     */
    insert(pos: number, content: Fragment | PmNode | ReadonlyArray<PmNode>): Transaction;

    /**
     * Replace a range of the document with a slice.
     * @param from - The start position of the range.
     * @param to - The end position of the range.
     * @param slice - The slice to insert.
     * @returns This transaction instance for chaining.
     */
    replaceRange(from: number, to: number, slice: Slice): Transaction;

    /**
     * Replace the given range with a single node.
     * @param from - The start position of the range.
     * @param to - The end position of the range.
     * @param node - The node to insert.
     * @returns This transaction instance for chaining.
     */
    replaceRangeWith(from: number, to: number, node: PmNode): Transaction;

    /**
     * Delete a range of content.
     * @param from - The start position of the range.
     * @param to - The end position of the range.
     * @returns This transaction instance for chaining.
     */
    deleteRange(from: number, to: number): Transaction;

    /**
     * Lift the target range out of the given wrapper node.
     * @param range - The range to lift.
     * @param target - The target depth.
     * @returns This transaction instance for chaining.
     */
    lift(range: NodeRange, target: number): Transaction;

    /**
     * Join the blocks around the given position.
     * @param pos - The position to join at.
     * @param depth - The depth to join (optional).
     * @returns This transaction instance for chaining.
     */
    join(pos: number, depth?: number): Transaction;

    /**
     * Wrap the given range in the given set of wrappers.
     * @param range - The range to wrap.
     * @param wrappers - The wrapper specifications.
     * @returns This transaction instance for chaining.
     */
    wrap(range: NodeRange, wrappers: ReadonlyArray<{ type: NodeType; attrs?: Attrs | null }>): Transaction;

    /**
     * Set the type of a range of blocks.
     * @param from - The start position.
     * @param to - The end position (optional).
     * @param type - The new node type (optional).
     * @param attrs - The new attributes (optional).
     * @returns This transaction instance for chaining.
     */
    setBlockType(from: number, to?: number, type?: NodeType, attrs?: Attrs | null | ((oldNode: PmNode) => Attrs)): Transaction;

    /**
     * Change the type, attributes, and/or marks of a single node.
     * @param pos - The position of the node.
     * @param type - The new node type (optional).
     * @param attrs - The new attributes (optional).
     * @param marks - The new marks (optional).
     * @returns This transaction instance for chaining.
     */
    setNodeMarkup(pos: number, type?: NodeType | null, attrs?: Attrs | null, marks?: ReadonlyArray<Mark>): Transaction;

    /**
     * Set a single attribute on a given node.
     * @param pos - The position of the node.
     * @param attr - The name of the attribute to set.
     * @param value - The new value for the attribute.
     * @returns This transaction instance for chaining.
     */
    setNodeAttribute(pos: number, attr: string, value: AttrValue): Transaction;

    /**
     * Set a single attribute on the document.
     * @param attr - The name of the attribute to set.
     * @param value - The new value for the attribute.
     * @returns This transaction instance for chaining.
     */
    setDocAttribute(attr: string, value: AttrValue): Transaction;

    /**
     * Add a mark to the node at the given position.
     * @param position - The position of the node.
     * @param mark - The mark to add.
     * @returns This transaction instance for chaining.
     */
    addNodeMark(position: number, mark: Mark): Transaction;

    /**
     * Remove a mark from the node at the given position.
     * @param position - The position of the node.
     * @param mark - The mark to remove.
     * @returns This transaction instance for chaining.
     */
    removeNodeMark(position: number, mark: Mark | MarkType): Transaction;

    /**
     * Split the node at the given position.
     * @param pos - The position to split at.
     * @param depth - The depth to split (optional).
     * @param typesAfter - The types to use after splitting (optional).
     * @returns This transaction instance for chaining.
     */
    split(pos: number, depth?: number, typesAfter?: Array<null | { type: NodeType; attrs?: Attrs | null }>): Transaction;

    /**
     * Add a mark to a range of text.
     * @param from - The start position.
     * @param to - The end position.
     * @param mark - The mark to add.
     * @returns This transaction instance for chaining.
     */
    addMark(from: number, to: number, mark: Mark): Transaction;

    /**
     * Remove marks from a range of text.
     * @param from - The start position.
     * @param to - The end position.
     * @param mark - The mark to remove (optional, removes all marks if not specified).
     * @returns This transaction instance for chaining.
     */
    removeMark(from: number, to: number, mark?: Mark | MarkType | null): Transaction;

    /**
     * Remove all marks and nodes that don't match the given parent node type.
     * @param position - The position of the parent node.
     * @param parentType - The node type to match content against.
     * @param match - Optional starting content match.
     * @returns This transform instance for chaining.
     */
    clearIncompatible(position: number, parentType: NodeType, match?: ContentMatch): Transaction;
};

// ============================================================================
// StateField - Override with concrete types
// ============================================================================

export type StateFieldInitFunction<T> = (config: EditorStateConfig, instance: EditorState) => T;
export type StateFieldApplyFunction<T> = (transaction: Transaction, value: T, oldState: EditorState, newState: EditorState) => T;

export interface StateField<T> {
    init: StateFieldInitFunction<T>;
    apply: StateFieldApplyFunction<T>;
    toJSON?: (value: T) => any;
    fromJSON?: (config: EditorStateConfig, value: any, state: EditorState) => T;
}

// ============================================================================
// EditorStateConfig - Override with concrete types
// ============================================================================

export interface EditorStateConfig {
    schema?: Schema;
    doc?: PmNode;
    selection?: Selection;
    storedMarks?: ReadonlyArray<Mark>;
    plugins?: ReadonlyArray<Plugin>;
}

// ============================================================================
// PluginSpec - Override with concrete types
// ============================================================================

export interface PluginSpec<PluginState> {
    props?: EditorProps<Plugin<PluginState>>;
    state?: StateField<PluginState>;
    key?: PluginKey;
    view?: (view: EditorView) => PluginView;
    filterTransaction?: (transaction: Transaction, state: EditorState) => boolean;
    appendTransaction?: (transactions: ReadonlyArray<Transaction>, oldState: EditorState, newState: EditorState) => Transaction | null | undefined;
    [key: string]: any;
}

// ============================================================================
// PluginKey Interface - Override with concrete types
// ============================================================================

/**
 * PluginKey with concrete type references instead of Pm* interfaces.
 * This ensures getState() returns PluginState instead of any.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PluginKey<PluginState = any> {
    readonly key: string;

    /**
     * Get the active plugin with this key, if any, from an editor state.
     */
    get(state?: EditorState): Plugin<PluginState> | undefined;

    /**
     * Get the plugin's state from an editor state.
     */
    getState(state?: EditorState): PluginState | undefined;
}

// ============================================================================
// EditorState Interface - Override with concrete types
// ============================================================================

export interface EditorState {
    readonly type: string;
    readonly doc: PmNode;
    readonly selection: AnySelection;
    readonly scrollToSelection: number;
    readonly storedMarks: ReadonlyArray<Mark> | null;
    readonly schema: Schema;
    readonly plugins: ReadonlyArray<Plugin>;
    readonly transaction: Transaction;
    readonly tr: Transaction;

    getPlugin(key: string): Plugin | undefined;
    getFieldPluginValue(key: string): any;
    apply(transaction: Transaction): EditorState;
    applyTransaction(rootTransaction: Transaction): {
        state: EditorState;
        transactions: ReadonlyArray<Transaction>;
    };
    reconfigure(config: { plugins?: ReadonlyArray<Plugin> }): EditorState;
    toJSON(pluginFields?: Readonly<Record<string, Plugin>>): StateJSON;
}

// ============================================================================
// Command Type - Override with concrete types
// ============================================================================

export type Command = (state: EditorState, dispatch?: (tr: Transaction) => void, view?: EditorView) => boolean;
export type DispatchFunction = (tr: Transaction) => void;

// ============================================================================
// Constructor Types
// ============================================================================

interface EditorStateConstructor {
    new(
        config: EditorStateConfiguration,
        editorStateDto: EditorStateDto,
        isUpdate?: boolean
    ): EditorState;

    isEditorState(value: unknown): value is EditorState;

    fromJSON(
        config: { schema: Schema; plugins?: ReadonlyArray<Plugin> },
        json: StateJSON,
        pluginFields?: Readonly<Record<string, Plugin>>
    ): EditorState;

    create(config: EditorStateConfig): EditorState;

    createConfig(
        schema: Schema,
        plugins?: ReadonlyArray<Plugin>
    ): EditorStateConfiguration;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PluginKeyConstructor = new<T = any>(name?: string) => PluginKey<T>;

type TransactionConstructor = new(state: EditorState) => Transaction;

export interface SelectionConstructor {
    new($anchor: ResolvedPos, $head: ResolvedPos, ranges?: ReadonlyArray<SelectionRange>): Selection;
    readonly prototype: Selection;
    near($pos: ResolvedPos, bias?: number): Selection;
    atStart(doc: PmNode): Selection;
    atEnd(doc: PmNode): Selection;
    findFrom($pos: ResolvedPos, dir: number, textOnly?: boolean): Selection | null;
    fromJSON(doc: PmNode, json: any): Selection;
    between($anchor: ResolvedPos, $head: ResolvedPos, bias?: number): Selection;
    isNodeSelectable(node: PmNode): boolean;
    jsonID(jsonId: string, jsonDeserializerClass: any): void;
    registerJsonDeserializerClass(jsonId: string, jsonDeserializerClass: any): void;
}

interface TextSelectionConstructor extends SelectionConstructor {
    new($anchor: ResolvedPos, $head?: ResolvedPos): TextSelection;
    create(doc: PmNode, anchor: number, head?: number): TextSelection;
    create($anchor: ResolvedPos, $head?: ResolvedPos): TextSelection;
    from(doc: PmNode, anchor: number, head?: number): TextSelection;
    fromJSON(doc: PmNode, json: any): TextSelection;
}

interface NodeSelectionConstructor extends SelectionConstructor {
    new($pos: ResolvedPos): NodeSelection;
    create($pos: ResolvedPos): NodeSelection;
    create(doc: PmNode, from: number): NodeSelection;
    isSelectable(node: PmNode): boolean;
    fromJSON(doc: PmNode, json: any): NodeSelection;
}

interface AllSelectionConstructor extends SelectionConstructor {
    new(doc: PmNode): AllSelection;
    fromJSON(doc: PmNode): AllSelection;
    createAllSelection(doc: PmNode): AllSelection;
}

// ============================================================================
// Selection Class Wrappers - Wrap static methods to return compat types
// ============================================================================

/**
 * Wrapper for Selection class that ensures static methods return compat Selection types.
 */
const SelectionWrapper = {
    near($pos: ResolvedPos, bias?: number): Selection {
        return BaseSelection.near($pos as never, bias) as any as Selection;
    },
    atStart(doc: PmNode): Selection {
        return BaseSelection.atStart(doc as never) as any as Selection;
    },
    atEnd(doc: PmNode): Selection {
        return BaseSelection.atEnd(doc as never) as any as Selection;
    },
    findFrom($pos: ResolvedPos, dir: number, textOnly?: boolean): Selection | null {
        return BaseSelection.findFrom($pos as never, dir, textOnly) as any as Selection | null;
    },
    fromJSON(doc: PmNode, json: any): Selection {
        return BaseSelection.fromJSON(doc as never, json as never) as any as Selection;
    },
    between($anchor: ResolvedPos, $head: ResolvedPos, bias?: number): Selection {
        return BaseSelection.between($anchor as never, $head as never, bias) as any as Selection;
    },
    isNodeSelectable(node: PmNode): boolean {
        return BaseSelection.isNodeSelectable(node as never);
    },
    jsonID(jsonId: string, jsonDeserializerClass: any): void {
        BaseSelection.jsonID(jsonId, jsonDeserializerClass as never);
    },
    registerJsonDeserializerClass(jsonId: string, jsonDeserializerClass: any): void {
        BaseSelection.registerJsonDeserializerClass(jsonId, jsonDeserializerClass as never);
    },
};

/**
 * Static method wrappers for TextSelection that return compat types.
 */
const TextSelectionStaticMethods = {
    create(anchorOrDoc: ResolvedPos | PmNode, headOrAnchor?: ResolvedPos | number, head?: number): TextSelection {
        return BaseTextSelection.create(anchorOrDoc as never, headOrAnchor as never, head) as any as TextSelection;
    },
    from(doc: PmNode, anchor: number, head?: number): TextSelection {
        return BaseTextSelection.from(doc as never, anchor, head) as any as TextSelection;
    },
    fromJSON(doc: PmNode, json: any): TextSelection {
        return BaseTextSelection.fromJSON(doc as never, json as never) as any as TextSelection;
    },
};

/**
 * Static method wrappers for NodeSelection that return compat types.
 */
const NodeSelectionStaticMethods = {
    create(docOrPos: ResolvedPos | PmNode, position?: number): NodeSelection {
        return BaseNodeSelection.create(docOrPos as never, position as never) as any as NodeSelection;
    },
    isSelectable(node: PmNode): boolean {
        return BaseSelection.isNodeSelectable(node as never);
    },
    fromJSON(doc: PmNode, json: any): NodeSelection {
        return BaseNodeSelection.fromJSON(doc as never, json as never) as any as NodeSelection;
    },
};

/**
 * Static method wrappers for AllSelection that return compat types.
 */
const AllSelectionStaticMethods = {
    fromJSON(doc: PmNode): AllSelection {
        return BaseAllSelection.fromJSON(doc as never) as any as AllSelection;
    },
    createAllSelection(doc: PmNode): AllSelection {
        return BaseAllSelection.createAllSelection(doc as never) as any as AllSelection;
    },
};

// ============================================================================
// Class Exports - Runtime values with augmented types
// ============================================================================


export const EditorState: EditorStateConstructor = BaseEditorState as any as EditorStateConstructor;

/**
 * Plugin constructor with properly typed PluginSpec.
 *
 * This uses a Proxy to create a proper constructor that TypeScript can analyze
 * without looking through to the BasePlugin class. The Proxy intercepts the
 * `new` call and delegates to BasePlugin, while our explicit type annotation
 * ensures TypeScript uses the compat PluginSpec for inference.
 *
 * The view callback in PluginSpec uses the compat EditorView type.
 */
// Create a function that can be called with `new` via Proxy
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PluginFactory<T = any>(spec: PluginSpec<T>): Plugin<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
    return new BasePlugin(spec as any) as any as Plugin<T>;
}

// Use a Proxy to make it callable with `new` while maintaining proper types
const PluginProxy = new Proxy(PluginFactory, {
    // Handle `new Plugin(spec)` calls
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    construct(_target, args: [PluginSpec<any>]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        return new BasePlugin(args[0] as any);
    },
    // Handle direct `Plugin(spec)` calls (just in case)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apply(_target, _thisArg, args: [PluginSpec<any>]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        return new BasePlugin(args[0] as any);
    }
});

// Export with explicit type annotation that uses compat PluginSpec
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Plugin: new<T = any>(spec: PluginSpec<T>) => Plugin<T> =
    PluginProxy as any as new<T>(spec: PluginSpec<T>) => Plugin<T>;

export const PluginKey: PluginKeyConstructor = BasePluginKey as any as PluginKeyConstructor;
export const Transaction: TransactionConstructor = BaseTransaction as any as TransactionConstructor;
// Create a Proxy to intercept static method calls and return compat types
// without mutating the original BaseSelection class (which would cause infinite recursion)
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
export const Selection: SelectionConstructor = new Proxy(BaseSelection, {
    get(target, prop, receiver) {
        // Check if the property exists in our wrapper first
        if (prop in SelectionWrapper) {
            return (SelectionWrapper as any)[prop];
        }
        // Otherwise delegate to the base class
        return Reflect.get(target, prop, receiver);
    }
}) as any as SelectionConstructor;
export const SelectionRange: SelectionRangeConstructor = BaseSelectionRange as unknown as SelectionRangeConstructor;
export const SelectionFactory = BaseSelectionFactory;
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
export const TextSelection: TextSelectionConstructor = new Proxy(BaseTextSelection, {
    get(target, prop, receiver) {
        if (prop in TextSelectionStaticMethods) {
            return (TextSelectionStaticMethods as any)[prop];
        }
        return Reflect.get(target, prop, receiver);
    }
}) as any as TextSelectionConstructor;
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
export const NodeSelection: NodeSelectionConstructor = new Proxy(BaseNodeSelection, {
    get(target, prop, receiver) {
        if (prop in NodeSelectionStaticMethods) {
            return (NodeSelectionStaticMethods as any)[prop];
        }
        return Reflect.get(target, prop, receiver);
    }
}) as any as NodeSelectionConstructor;
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
export const AllSelection: AllSelectionConstructor = new Proxy(BaseAllSelection, {
    get(target, prop, receiver) {
        if (prop in AllSelectionStaticMethods) {
            return (AllSelectionStaticMethods as any)[prop];
        }
        return Reflect.get(target, prop, receiver);
    }
}) as any as AllSelectionConstructor;

// ============================================================================
// Additional Type Re-exports
// ============================================================================

export type {EditorStateConfiguration, FieldDesc};
