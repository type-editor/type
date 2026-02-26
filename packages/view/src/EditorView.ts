import {
    browser,
    DOCUMENT_FRAGMENT_NODE,
    DOCUMENT_NODE,
    ELEMENT_NODE,
    hasOwnProperty,
    isUndefinedOrNull,
} from '@type-editor/commons';
import { Decoration, type DecorationAttrs, viewDecorations } from '@type-editor/decoration';
import { readDOMChange } from '@type-editor/dom-change-util';
import {
    coordsAtPos,
    endOfTextblock,
    focusPreventScroll,
    posAtCoords,
    resetScrollPos,
    scrollRectIntoView,
    type StoredScrollPos,
    storeScrollPos,
} from '@type-editor/dom-coords-util';
import { clearReusedRange, deepActiveElement } from '@type-editor/dom-util';
import type {
    DecorationSource,
    DirectEditorProps,
    DOMSelectionRange,
    EditorProps,
    MarkViewConstructor,
    NodeViewConstructor,
    NodeViewSet,
    PluginView,
    PmDecoration,
    PmEditorState,
    PmEditorView,
    PmInputState,
    PmPlugin,
    PmSelection,
    StateJSON,
} from '@type-editor/editor-types';
import { clearComposition, doPaste, Dragging, InputState, serializeForClipboard } from '@type-editor/input';
import {
    DOMParser as PmDOMParser,
    DOMSerializer,
    type Mark,
    type PmNode,
    type Schema,
    type Slice,
} from '@type-editor/model';
import { anchorInRightPlace, selectionToDOM, syncNodeSelection } from '@type-editor/selection-util';
import { EditorState, SelectionFactory, type Transaction } from '@type-editor/state';
import { docViewDesc, type NodeViewDesc, type ViewDesc, ViewDescUpdater } from '@type-editor/viewdesc';

import { DOMObserver } from './dom-observer/DOMObserver';
import { safariShadowSelectionRange } from './dom-observer/safari-shadow-selection-range';
import { findCompositionNode } from './util/find-composition-node';

/**
 * An editor view manages the DOM structure that represents an
 * editable document. Its state and behavior are determined by its
 * [props](#view.DirectEditorProps).
 *
 * The view is responsible for:
 * - Rendering the document state as DOM elements
 * - Handling user input and converting it to transactions
 * - Managing selections and keeping them in sync with the DOM
 * - Coordinating plugin views and custom node views
 * - Observing external DOM changes (composition, spellcheck, etc.)
 */
export class EditorView implements PmEditorView {

    /**
     * An editable DOM node containing the document. (You probably
     * should not directly interfere with its content.)
     */
    private readonly _dom: HTMLElement;

    /**
     * Indicates whether the editor was mounted via the mount property.
     * This affects cleanup behavior during destroy.
     */
    private readonly mounted: boolean;

    /**
     * Manages input handling including keyboard, mouse, and composition events.
     */
    private readonly inputState: PmInputState;

    /**
     * Observes the DOM for external changes (e.g., from composition, spellcheck).
     */
    private readonly _domObserver: DOMObserver;

    /**
     * Cached frozen copy of props with current state. Invalidated when props or state change.
     */
    private _frozenProps: Readonly<DirectEditorProps> | null = null;

    /**
     * Plugins passed directly to the view (must not have state components).
     */
    private directPlugins: ReadonlyArray<PmPlugin>;

    /**
     * Flag indicating that plugin views need to be recreated on next update.
     */
    private isPluginsUpdateNeeded = false;

    /**
     * Array of plugin view instances created from plugin specs.
     */
    private pluginViews: Array<PluginView> = [];

    /**
     * The view's current [state](#state.EditorState).
     */
    private editorState: PmEditorState;

    /**
     * The current editor props.
     */
    private _props: DirectEditorProps;

    /**
     * Cached document or shadow root containing the editor. Null until first accessed.
     */
    private _root: Document | ShadowRoot | null = null;

    /**
     * Whether the editor currently has focus.
     */
    private _focused = false;

    /**
     * Marks to be applied to the next input (stored marks).
     */
    private _markCursor: ReadonlyArray<Mark> | null = null;

    /**
     * Widget decoration representing the cursor when stored marks are present.
     */
    private _cursorWrapper: { dom: Node, deco: PmDecoration; } | null = null;

    /**
     * The current set of node and mark view constructors.
     */
    private _nodeViews: NodeViewSet;

    /**
     * The root view descriptor representing the entire document.
     */
    private _docView: NodeViewDesc;

    /**
     * The last view descriptor that was selected (for internal tracking).
     */
    private _lastSelectedViewDesc: ViewDesc | undefined = undefined;

    /**
     * Kludge used to work around a Chrome bug @internal
     */
    private _trackWrites: Node | null = null;

    /**
     * When editor content is being dragged, this object contains
     * information about the dragged slice and whether it is being
     * copied or moved. At any other time, it is null.
     */
    private _dragging: null | Dragging = null;


    /**
     * Create a view. `place` may be a DOM node that the editor should
     * be appended to, a function that will place it into the document,
     * or an object whose `mount` property holds the node to use as the
     * document container. If it is `null`, the editor will not be
     * added to the document.
     *
     * @param editorContainer - The placement configuration for the editor DOM element. Can be:
     *   - A DOM node to append the editor to
     *   - A function that receives the editor element and places it in the document
     *   - An object with a `mount` property containing an existing element to use
     *   - `null` to create the editor without mounting it
     * @param props - The editor properties including initial state and configuration
     *
     * @example
     * ```typescript
     * // Append to a DOM element
     * const view = new EditorView(document.querySelector('#editor'), {
     *   state: EditorState.create({ schema })
     * });
     *
     * // Use a custom mounting function
     * const view = new EditorView((editorElement) => {
     *   document.body.appendChild(editorElement);
     * }, { state });
     *
     * // Reuse an existing element
     * const view = new EditorView({ mount: document.querySelector('#editor') }, { state });
     * ```
     */
    constructor(editorContainer: null | Node | ((editor: HTMLElement) => void) | { mount: HTMLElement; },
                props: DirectEditorProps) {
        this.inputState = new InputState(this);
        this._props = props;
        this.editorState = props.state;
        this.directPlugins = this.directPlugins ? Array.from(this.directPlugins).concat(props.plugins || []) : [];
        this.isPluginsUpdateNeeded = this.directPlugins.length > 0;

        // Validate plugins don't have state components - plugins with state must be added to EditorState
        this.directPlugins.forEach(this.checkStateComponent());

        // Bind dispatch method to this instance for passing as callback
        this.dispatch = this.dispatch.bind(this);

        // Initialize DOM and mount if needed
        this._dom = this.createEditorDOM(editorContainer);
        this.mounted = this.mountEditorDOM(editorContainer);

        // Setup views
        this.updateCursorWrapper();
        this._nodeViews = this.buildNodeViews();

        // Initialize DOM observer to watch for external DOM changes (e.g., from composition, spellcheck)
        this._domObserver = new DOMObserver(
            this,
            (from, to, typeOver, added) => {
                readDOMChange(this, from, to, typeOver, added);
            });

        // Create document view and start observing
        this._docView = docViewDesc(this.editorState.doc, this.computeDocDeco(), viewDecorations(this), this._dom, this);
        this._domObserver.start();
        this.inputState.initInput();
        this.updatePluginViews();
    }

    public static fromJSON(editorContainer: null | Node | ((editor: HTMLElement) => void) | { mount: HTMLElement; },
                           schema: Schema,
                           docJSON: StateJSON,
                           plugins?: ReadonlyArray<PmPlugin>,
                           nodeViews?: Record<string, NodeViewConstructor>,
                           markViews?: Record<string, MarkViewConstructor>): EditorView {
        const state: PmEditorState = EditorState.fromJSON({ schema, plugins: plugins }, docJSON);
        return new EditorView(editorContainer, { state, nodeViews, markViews });
    }

    public static fromHTML(editorContainer: null | Node | ((editor: HTMLElement) => void) | { mount: HTMLElement; },
                           schema: Schema,
                           docHTML: HTMLElement | string,
                           plugins?: ReadonlyArray<PmPlugin>,
                           nodeViews?: Record<string, NodeViewConstructor>,
                           markViews?: Record<string, MarkViewConstructor>): EditorView {

        const htmlDoc: HTMLElement = typeof docHTML === 'string' ? document.createElement('div') : docHTML;

        if(typeof htmlDoc === 'string') {
            (htmlDoc as HTMLDivElement).innerHTML = docHTML as string;
        }
        const mainEl: HTMLElement = htmlDoc.querySelector('main[data-pmroot]');
        const docAttrs = mainEl ? {
            id: mainEl.dataset.pmid,
            version: mainEl.dataset.pmversion,
            preVersion: mainEl.dataset.pmprevision,
        } : null;
        const rootNode: PmNode = docAttrs ? schema.topNodeType.create(docAttrs) : null;

        const doc: PmNode = PmDOMParser.fromSchema(schema).parse(docHTML, { topNode: rootNode });
        const state: PmEditorState = EditorState.create({ doc, plugins: plugins });
        return new EditorView(editorContainer, { state, nodeViews, markViews });
    }

    /**
     * The view's current [props](#view.EditorProps).
     * Returns a frozen copy of the props with the current state.
     */
    get props(): Readonly<DirectEditorProps> {
        // Cache frozen props for performance - only recreate if state changed or cache is invalidated
        // This prevents creating new object references on every access
        if (!this._frozenProps || this._props.state !== this.editorState) {
            const propsWithCurrentState: DirectEditorProps = {
                ...this._props,
                state: this.editorState
            };
            this._frozenProps = Object.freeze(propsWithCurrentState);
        }
        return this._frozenProps;
    }

    /**
     * Get the document root in which the editor exists. This will
     * usually be the top-level `document`, but might be a [shadow
     * DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)
     * root if the editor is inside one.
     */
    get root(): Document | ShadowRoot {
        // Return cached value if available for performance
        if (this._root) {
            return this._root;
        }

        // Walk up the parent chain to find the document or shadow root
        let search: ParentNode | null = this._dom.parentNode;
        while (search) {
            if (search.nodeType === DOCUMENT_NODE
                // DocumentFragment (shadow root has .host property)
                || (search.nodeType === DOCUMENT_FRAGMENT_NODE && (search as any).host)) {

                // Polyfill getSelection for older browsers that don't support it on shadow roots
                // This allows selection APIs to work consistently across document and shadow roots
                if (!(search as any).getSelection) {
                    Object.getPrototypeOf(search).getSelection = (): Selection => (search as Node).ownerDocument.getSelection();
                }
                // Cache and return the found root
                this._root = search as Document | ShadowRoot;
                return this._root;
            }
            search = search.parentNode;
        }

        // Fallback to global document if not yet attached to DOM
        this._root = document;
        return this._root;
    }

    /**
     * Indicates whether the view currently has focus.
     * @internal
     */
    get focused(): boolean {
        return this._focused;
    }

    /**
     * Sets the focused state of the view.
     * @param focused - Whether the view should be considered focused
     * @internal
     */
    set focused(focused: boolean) {
        this._focused = focused;
    }

    /**
     * The marks that should be applied to the next input. This is used
     * to represent stored marks in a zero-width position.
     */
    get markCursor(): ReadonlyArray<Mark> | null {
        return this._markCursor;
    }

    /**
     * Sets the marks to be applied to the next input.
     * @param markCursor - Array of marks to apply
     */
    set markCursor(markCursor: ReadonlyArray<Mark>) {
        this._markCursor = markCursor;
    }

    /**
     * The cursor wrapper widget decoration used to display stored marks
     * when the cursor is at a position with no text.
     */
    get cursorWrapper(): { dom: Node, deco: PmDecoration; } | null {
        return this._cursorWrapper;
    }

    /**
     * The set of node and mark view constructors currently in use.
     */
    get nodeViews(): Readonly<NodeViewSet> {
        return this._nodeViews;
    }

    /**
     * The document view descriptor, representing the entire document's
     * DOM structure.
     */
    get docView(): NodeViewDesc {
        return this._docView;
    }

    /**
     * The view descriptor that was last selected (for internal use).
     * @internal
     */
    get lastSelectedViewDesc(): ViewDesc | null {
        return this._lastSelectedViewDesc || null;
    }

    /**
     * Sets the last selected view descriptor.
     * @param lastSelectedViewDesc - The view descriptor to set, or null
     * @internal
     */
    set lastSelectedViewDesc(lastSelectedViewDesc: ViewDesc | null) {
        this._lastSelectedViewDesc = lastSelectedViewDesc || null;
    }

    /**
     * Used to work around a Chrome selection bug. Tracks a DOM node to
     * detect if it gets removed during updates.
     * @internal
     */
    get trackWrites(): Node | null {
        return this._trackWrites;
    }

    /**
     * When editor content is being dragged, this contains information
     * about the dragged slice and whether it is being copied or moved.
     * At any other time, it is null.
     */
    get dragging(): Dragging | null {
        return this._dragging;
    }

    /**
     * Sets the current dragging state.
     * @param dragging - The dragging state, or null to clear it
     */
    set dragging(dragging: Dragging | null) {
        this._dragging = dragging;
    }

    /**
     * The editor's DOM node. This is the element that should be placed
     * in the document.
     */
    get dom(): HTMLElement {
        return this._dom;
    }

    /**
     * Indicates whether the editor is currently editable.
     */
    get editable(): boolean {
        return this.getEditableStatus();
    }

    /**
     * The input state handler, managing keyboard and mouse input.
     * @internal
     */
    get input(): InputState {
        return this.inputState as InputState;
    }

    /**
     * The DOM observer that watches for external changes to the editor DOM.
     * @internal
     */
    get domObserver(): DOMObserver {
        return this._domObserver;
    }

    /**
     * The view's current editor state.
     */
    get state(): EditorState {
        return this.editorState as EditorState;
    }

    /**
     * Holds `true` when a
     * [composition](https://w3c.github.io/uievents/#events-compositionevents)
     * is active.
     */
    get composing(): boolean {
        return this.inputState.composing;
    }

    /**
     * This is true when the view has been
     * [destroyed](#view.EditorView.destroy) (and thus should not be
     * used anymore).
     */
    get isDestroyed(): boolean {
        return isUndefinedOrNull(this._docView);
    }

    /**
     * Serializes the current editor state to a JSON string.
     * This can be used to save the editor content and state for persistence.
     *
     * @param pluginFields - Optional mapping of plugin fields to include in the serialization
     * @returns A JSON string representation of the editor state
     *
     * @example
     * ```typescript
     * // Serialize the current state
     * const json = view.toJSON();
     * localStorage.setItem('editorState', json);
     * ```
     */
    public toJSON(pluginFields?: Readonly<Record<string, PmPlugin>>): string {
        return JSON.stringify(this.state.toJSON(pluginFields, true));
    }

    /**
     * Converts the editor content to an HTML string with ProseMirror-specific
     * classes removed. This provides a clean HTML representation suitable for
     * export or display outside the editor context.
     *
     * @returns The editor's HTML content without ProseMirror classes
     *
     * @example
     * ```typescript
     * // Get clean HTML for export
     * const html = view.toHtml();
     * // Use the HTML in another context
     * document.getElementById('preview').innerHTML = html;
     * ```
     */
    public toHtml() : string {
        if(this.editorState.doc.type.spec.toDOM) {
            const doc: PmNode = this.editorState.doc;
            const rootElement: Node = DOMSerializer.fromSchema(this.state.schema).serializeNode(doc);
            return (rootElement as HTMLElement).outerHTML;

        } else {
            const doc: PmNode = this.editorState.doc;
            const serializer: DOMSerializer = DOMSerializer.fromSchema(this.state.schema);
            const fragment: DocumentFragment | HTMLElement = serializer.serializeFragment(doc.content);
            const wrapper: HTMLDivElement = document.createElement('div');
            wrapper.appendChild(fragment);
            return wrapper.innerHTML;
        }
    }


    /**
     * Dynamically adds a plugin to the editor view. The plugin must not have
     * state components (state, filterTransaction, or appendTransaction) - such
     * plugins must be added to the EditorState instead.
     *
     * If the plugin has a view specification, its view will be immediately
     * created and added to the active plugin views.
     *
     * @param plugin - The plugin to add to the view
     * @throws {RangeError} If the plugin has state components
     *
     * @example
     * ```typescript
     * // Add a plugin dynamically
     * const myPlugin = new Plugin({ view: () => ({ update: (view) => {} }) });
     * view.addPlugin(myPlugin);
     * ```
     */
    public addPlugin(plugin: PmPlugin): void {
        this.directPlugins = Array.from(this.directPlugins).concat([plugin]);
        if(this.state) {
            // Validate plugins don't have state components - plugins with state must be added to EditorState
            this.checkStateComponent()(plugin);
            if (plugin.spec.view) {
                this.pluginViews.push(plugin.spec.view(this));
            }
        }
    }

    /**
     * Clears the tracked writes node.
     * @internal
     */
    public clearTrackWrites(): void {
        this._trackWrites = null;
    }

    /**
     * Update the view's props. Will immediately cause an update to
     * the DOM.
     *
     * @param props - The new props to apply to the view
     *
     * @example
     * ```typescript
     * // Update with a new state
     * view.update({
     *   state: newState,
     *   plugins: [myPlugin],
     *   editable: () => true
     * });
     * ```
     */
    public update(props: DirectEditorProps): void {
        // Re-register event listeners if DOM event handlers changed
        if (props.handleDOMEvents !== this._props.handleDOMEvents) {
            this.inputState.ensureListeners();
        }

        const prevProps: DirectEditorProps = this._props;
        this._props = props;
        this._frozenProps = null; // Invalidate cache to force recomputation on next access

        // Handle plugin array changes
        if (props.plugins && this.directPlugins !== props.plugins) {
            props.plugins.forEach(this.checkStateComponent());
            this.directPlugins = props.plugins;
            this.isPluginsUpdateNeeded = true;
        }

        // Propagate state update through the view
        this.updateStateInner(props.state, prevProps);
    }

    /**
     * Update the view by updating existing props object with the object
     * given as argument. Equivalent to `view.update(Object.assign({},
     * view.props, props))`.
     *
     * @param props - Partial props to merge with existing props
     */
    public setProps(props: Partial<DirectEditorProps>): void {
        const updated: DirectEditorProps = {
            ...this._props,
            state: this.editorState,
            ...props
        };
        this.update(updated);
    }

    /**
     * Update the editor's `state` prop, without touching any of the
     * other props.
     *
     * @param state - The new editor state to apply
     *
     * @example
     * ```typescript
     * // Apply a transaction and update the view
     * const newState = view.state.apply(tr);
     * view.updateState(newState);
     * ```
     */
    public updateState(state: PmEditorState): void {
        this.updateStateInner(state, this._props);
    }

    /**
     * Scrolls the current selection into view if it's not already visible.
     */
    public scrollToSelection(): void {
        const startDOM: Node = this.domSelectionRange().focusNode;
        // Verify selection is within the editor (handle nodeType 1 = Element, 3 = Text)
        if (!startDOM || !this._dom.contains(startDOM.nodeType === ELEMENT_NODE ? startDOM : startDOM.parentNode)) {
            // Ignore selections outside the editor
            return;
        }

        // Allow custom scroll handlers to override default behavior
        if (this.someProp('handleScrollToSelection', f => f(this))) {
            // Handler took care of scrolling
            return;
        }

        // For node selections, scroll the entire selected node into view
        if (this.editorState.selection.isNodeSelection()) {
            const target: Node = this._docView.domAfterPos(this.editorState.selection.from);
            if (target.nodeType === ELEMENT_NODE) {
                scrollRectIntoView(this, (target as HTMLElement).getBoundingClientRect(), startDOM);
            }
        } else {
            // For text selections, scroll the cursor position (head) into view
            scrollRectIntoView(this, this.coordsAtPos(this.editorState.selection.head, 1), startDOM);
        }
    }

    /**
     * Goes over the values of a prop, first those provided directly,
     * then those from plugins given to the view, then from plugins in
     * the state (in order), and calls the callback function every time
     * a non-undefined value is found. When the callback returns a truthy
     * value, that is immediately returned. When callback isn't provided,
     * it is treated as the identity function (the prop value is returned directly).
     *
     * @param propName - The name of the prop to search for
     * @param callbackFunc - Optional callback to process the prop value
     * @returns The result from the callback, the prop value, or undefined
     *
     * @example
     * ```typescript
     * // Check if any plugin handles a specific key
     * const handled = view.someProp('handleKeyDown', (handler) => {
     *   return handler(view, event);
     * });
     *
     * // Get the first defined decorations prop
     * const decos = view.someProp('decorations');
     * ```
     */
    public someProp<PropName extends keyof EditorProps, Result>(
        propName: PropName,
        callbackFunc: (value: NonNullable<EditorProps[PropName]>) => Result
    ): Result | undefined;

    public someProp<PropName extends keyof EditorProps>(propName: PropName): NonNullable<EditorProps[PropName]> | undefined;

    public someProp<PropName extends keyof EditorProps, Result = NonNullable<EditorProps[PropName]>>(
        propName: PropName,
        callbackFunc?: (value: NonNullable<EditorProps[PropName]>) => Result
    ): Result | NonNullable<EditorProps[PropName]> | undefined {
        // Priority order: direct props > direct plugins > state plugins
        // This allows view-level props to override plugin behavior

        // Check direct props first (highest priority)
        const directProp: DirectEditorProps[PropName] = this._props?.[propName];
        if (!isUndefinedOrNull(directProp)) {
            const result = callbackFunc ? callbackFunc(directProp) : directProp;
            if (result) {
                return result as Result | NonNullable<EditorProps[PropName]>;
            }
        }

        // Check direct plugins (second priority)
        for (const plugin of this.directPlugins) {
            const pluginProp: EditorProps<PmPlugin>[PropName] = plugin.props[propName];
            if (!isUndefinedOrNull(pluginProp)) {
                const result = callbackFunc ? callbackFunc(pluginProp) : pluginProp;
                if (result) {
                    return result as Result | NonNullable<EditorProps[PropName]>;
                }
            }
        }

        // Check state plugins (lowest priority)
        const statePlugins: ReadonlyArray<PmPlugin> = this.editorState.plugins;
        if (statePlugins) {
            for (const plugin of statePlugins) {
                const pluginProp: EditorProps<PmPlugin>[PropName] = plugin.props[propName];
                if (!isUndefinedOrNull(pluginProp)) {
                    const result = callbackFunc ? callbackFunc(pluginProp) : pluginProp;
                    if (result) {
                        return result as Result | NonNullable<EditorProps[PropName]>;
                    }
                }
            }
        }

        return undefined;
    }

    /**
     * Query whether the view has focus.
     *
     * @returns true if the editor view has focus, false otherwise
     *
     * @example
     * ```typescript
     * // Only update something if the editor has focus
     * if (view.hasFocus()) {
     *   // Perform focus-dependent action
     * }
     * ```
     */
    public hasFocus(): boolean {
        const activeElement: Element = this.root.activeElement;

        // Standard case for non-IE browsers - simple equality check
        if (!browser.ie) {
            return activeElement === this._dom;
        }

        // IE workaround: handle focus correctly when resize handles are shown
        // In IE, when the cursor is inside an element with resize handles,
        // activeElement will be that element instead of this.dom
        if (activeElement === this._dom) {
            return true;
        }

        if (!activeElement || !this._dom.contains(activeElement)) {
            return false;
        }

        // Consider focused if activeElement is inside editor and not in a contenteditable=false region
        return this.hasNoNonEditableAncestor(activeElement);
    }

    /**
     * Focus the editor.
     *
     * @example
     * ```typescript
     * // Focus the editor after initialization
     * view.focus();
     *
     * // Focus and set selection
     * view.focus();
     * view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, pos)));
     * ```
     */
    public focus(): void {
        this._domObserver.stop();
        if (this.editable) {
            focusPreventScroll(this._dom);
        }
        selectionToDOM(this);
        this._domObserver.start();
    }

    /**
     * When an existing editor view is moved to a new document or
     * shadow tree, call this to make it recompute its root.
     */
    public updateRoot(): void {
        this._root = null;
    }

    /**
     * Given a pair of viewport coordinates, return the document
     * position that corresponds to them. May return null if the given
     * coordinates aren't inside the editor. When an object is
     * returned, its `pos` property is the position nearest to the
     * coordinates, and its `inside` property holds the position of the
     * inner node that the position falls inside, or -1 if it is at
     * the top level, not in any node.
     *
     * @param coords - The viewport coordinates with left and top properties
     * @returns An object with pos and inside properties, or null if outside editor
     *
     * @example
     * ```typescript
     * // Get document position from a mouse click
     * editor.addEventListener('click', (event) => {
     *   const pos = view.posAtCoords({ left: event.clientX, top: event.clientY });
     *   if (pos) {
     *     console.log('Clicked at document position:', pos.pos);
     *   }
     * });
     * ```
     */
    public posAtCoords(coords: { left: number, top: number; }): { pos: number, inside: number; } | null {
        return posAtCoords(this, coords);
    }

    /**
     * Returns the viewport rectangle at a given document position.
     * `left` and `right` will be the same number, as this returns a
     * flat cursor-ish rectangle. If the position is between two things
     * that aren't directly adjacent, `side` determines which element
     * is used. When < 0, the element before the position is used,
     * otherwise the element after.
     *
     * @param pos - The document position
     * @param side - Which side to prefer: < 0 for before, >= 0 for after (default: 1)
     * @returns An object with left, right, top, and bottom properties
     *
     * @example
     * ```typescript
     * // Get the screen coordinates of the cursor
     * const coords = view.coordsAtPos(view.state.selection.head);
     * console.log('Cursor is at:', coords.left, coords.top);
     *
     * // Position a tooltip at a specific document position
     * const rect = view.coordsAtPos(pos);
     * tooltip.style.left = rect.left + 'px';
     * tooltip.style.top = rect.bottom + 'px';
     * ```
     */
    public coordsAtPos(pos: number, side = 1): { left: number, right: number, top: number, bottom: number; } {
        return coordsAtPos(this, pos, side);
    }

    /**
     * Find the DOM position that corresponds to the given document
     * position. When `side` is negative, find the position as close as
     * possible to the content before the position. When positive,
     * prefer positions close to the content after the position. When
     * zero, prefer as shallow a position as possible.
     *
     * Note that you should **not** mutate the editor's internal DOM,
     * only inspect it (and even that is usually not necessary).
     *
     * @param pos - The document position
     * @param side - Side preference: negative for before, positive for after, 0 for shallow (default: 0)
     * @returns An object with the DOM node and offset
     */
    public domAtPos(pos: number, side = 0): { node: Node, offset: number; } {
        return this._docView.domFromPos(pos, side);
    }

    /**
     * Find the DOM node that represents the document node after the
     * given position. May return `null` when the position doesn't point
     * in front of a node or if the node is inside an opaque node view.
     *
     * This is intended to be able to call things like
     * `getBoundingClientRect` on that DOM node. Do **not** mutate the
     * editor DOM directly, or add styling this way, since that will be
     * immediately overriden by the editor as it redraws the node.
     *
     * @param pos - The document position
     * @returns The DOM node at the position, or null if not found or inside opaque view
     */
    public nodeDOM(pos: number): Node | null {
        const desc: ViewDesc = this._docView.descAt(pos);
        return desc ? (desc as NodeViewDesc).nodeDOM : null;
    }

    /**
     * Find the document position that corresponds to a given DOM
     * position. (Whenever possible, it is preferable to inspect the
     * document structure directly, rather than poking around in the
     * DOM, but sometimes—for example when interpreting an event
     * target—you don't have a choice.)
     *
     * The `bias` parameter can be used to influence which side of a DOM
     * node to use when the position is inside a leaf node.
     *
     * @param node - The DOM node
     * @param offset - The offset within the node
     * @param bias - Side bias for leaf nodes: negative for start, positive for end (default: -1)
     * @returns The document position
     * @throws {RangeError} If the DOM position is not inside the editor
     */
    public posAtDOM(node: Node, offset: number, bias = -1): number {
        const pos: number = this._docView.posFromDOM(node, offset, bias);
        if (isUndefinedOrNull(pos)) {
            throw new RangeError('DOM position not inside the editor');
        }
        return pos;
    }

    /**
     * Find out whether the selection is at the end of a textblock when
     * moving in a given direction. When, for example, given `'left'`,
     * it will return true if moving left from the current cursor
     * position would leave that position's parent textblock. Will apply
     * to the view's current state by default, but it is possible to
     * pass a different state.
     *
     * @param dir - The direction to check: 'up', 'down', 'left', 'right', 'forward', or 'backward'
     * @param state - The editor state to use (defaults to current state)
     * @returns true if at the end of a textblock in the given direction
     */
    public endOfTextblock(dir: 'up' | 'down' | 'left' | 'right' | 'forward' | 'backward', state?: EditorState): boolean {
        return endOfTextblock(this, state || this.editorState, dir);
    }

    /**
     * Run the editor's paste logic with the given HTML string. The
     * `event`, if given, will be passed to the
     * [`handlePaste`](#view.EditorProps.handlePaste) hook.
     *
     * @param html - The HTML string to paste
     * @param event - Optional clipboard event to pass to handlers
     * @returns true if the paste was handled
     */
    public pasteHTML(html: string, event?: ClipboardEvent): boolean {
        return doPaste(this, '', html, false, event || new ClipboardEvent('paste'));
    }

    /**
     * Run the editor's paste logic with the given plain-text input.
     *
     * @param text - The plain text string to paste
     * @param event - Optional clipboard event to pass to handlers
     * @returns true if the paste was handled
     */
    public pasteText(text: string, event?: ClipboardEvent): boolean {
        return doPaste(this, text, null, true, event || new ClipboardEvent('paste'));
    }

    /**
     * Serialize the given slice as it would be if it was copied from
     * this editor. Returns a DOM element that contains a
     * representation of the slice as its children, a textual
     * representation, and the transformed slice (which can be
     * different from the given input due to hooks like
     * [`transformCopied`](#view.EditorProps.transformCopied)).
     *
     * @param slice - The content slice to serialize
     * @returns An object containing the DOM representation, text, and transformed slice
     */
    public serializeForClipboard(slice: Slice): { dom: HTMLElement, text: string, slice: Slice; } {
        return serializeForClipboard(this, slice);
    }

    /**
     * Removes the editor from the DOM and destroys all [node
     * views](#view.NodeView). After calling this method, the view
     * should not be used anymore.
     *
     * @example
     * ```typescript
     * // Clean up when unmounting a component
     * componentWillUnmount() {
     *   if (this.view) {
     *     this.view.destroy();
     *   }
     * }
     * ```
     */
    public destroy(): void {
        if (!this._docView) {
            return;
        }

        // Stop observing DOM changes to prevent callbacks during teardown
        this._domObserver.stop();

        // Clean up input handlers and event listeners
        this.inputState.destroyInput();
        this.destroyPluginViews();

        // Different cleanup based on how the editor was mounted
        if (this.mounted) {
            // If mounted via mount property, destroy node views but leave container in place
            ViewDescUpdater.update(this._docView, this, this.editorState.doc, [], viewDecorations(this));
            this._dom.textContent = '';
        } else if (this._dom.parentNode) {
            // If mounted via function or appendChild, remove the editor element
            this._dom.parentNode.removeChild(this._dom);
        }

        // Destroy document view descriptors and clean up internal state
        this._docView.destroy();
        this._docView = null;
        clearReusedRange(); // Clear global text range cache
    }

    /**
     * Used for testing. Dispatches a DOM event to the input state handler.
     *
     * @param event - The DOM event to dispatch
     */
    public dispatchEvent(event: Event): void {
        this.inputState.dispatchEvent(event);
    }

    /**
     * Gets the current DOM selection range, with workarounds for Safari shadow DOM.
     *
     * @returns The DOM selection range with focus and anchor information
     */
    public domSelectionRange(): DOMSelectionRange {
        const selection: Selection = this.domSelection();
        if (!selection) {
            return {
                focusNode: null,
                focusOffset: 0,
                anchorNode: null,
                anchorOffset: 0
            };
        }

        // Safari has a bug where getSelection() in shadow DOM returns incorrect positions
        // We need to use a different method to get accurate selection in shadow roots
        const isSafariShadowRoot = browser.safari
            // DocumentFragment (shadow root)
            && this.root.nodeType === DOCUMENT_FRAGMENT_NODE
            && deepActiveElement(this._dom.ownerDocument) === this._dom;

        return isSafariShadowRoot
            ? safariShadowSelectionRange(this, selection) || selection
            : selection;
    }

    /**
     * Gets the current DOM selection object.
     *
     * @returns The DOM selection object, or null if not available
     */
    public domSelection(): Selection | null {
        return (this.root as Document).getSelection();
    }

    /**
     * Dispatch a transaction. Will call
     * [`dispatchTransaction`](#view.DirectEditorProps.dispatchTransaction)
     * when given, and otherwise defaults to applying the transaction to
     * the current state and calling
     * [`updateState`](#view.EditorView.updateState) with the result.
     * This method is bound to the view instance, so that it can be
     * easily passed around.
     *
     * @param transaction - The transaction to dispatch
     *
     * @example
     * ```typescript
     * // Insert text at the current selection
     * const transaction = view.state.transaction.insertText('Hello');
     * view.dispatch(transaction);
     *
     * // Delete the current selection
     * view.dispatch(view.state.transaction.deleteSelection());
     * ```
     */
    public dispatch(transaction: Transaction): void {
        const dispatchTransaction = this._props.dispatchTransaction;

        if (dispatchTransaction) {
            // Custom dispatch handler - typically used for state management integration
            dispatchTransaction.call(this, transaction);
        } else {
            // Default behavior - apply transaction and update view immediately
            this.updateState(this.editorState.apply(transaction));
        }
    }

    /**
     * Internal method to update the editor state and synchronize the DOM.
     *
     * @param state - The new editor state
     * @param prevProps - The previous editor props for comparison
     */
    private updateStateInner(state: PmEditorState, prevProps: DirectEditorProps): void {
        const prev: PmEditorState = this.editorState;
        let redraw = false;
        let updateSel = false;

        // When stored marks are added, stop composition, so that they can be displayed
        if (state.storedMarks && this.composing) {
            clearComposition(this);
            updateSel = true;
        }

        this.editorState = state;

        // Check if plugins or node views changed - these require rebuilding the view tree
        const pluginsChanged: boolean = this.hasPluginsChanged(prev, state, prevProps);
        const nodeViewsChanged: boolean = pluginsChanged
            || this._props.plugins !== prevProps.plugins
            || this._props.nodeViews !== prevProps.nodeViews;

        if (nodeViewsChanged) {
            const nodeViews: NodeViewSet = this.buildNodeViews();
            // Only trigger full redraw if node view implementations actually changed
            if (this.changedNodeViews(nodeViews, this._nodeViews)) {
                this._nodeViews = nodeViews;
                redraw = true;
            }
        }

        // Re-register event listeners if plugins or DOM handlers changed
        if (pluginsChanged || prevProps.handleDOMEvents !== this._props.handleDOMEvents) {
            this.inputState.ensureListeners();
        }

        // Update cursor wrapper decoration for stored marks
        this.updateCursorWrapper();

        // Collect all decorations that need to be applied
        const innerDeco: DecorationSource = viewDecorations(this);
        const outerDeco: Array<PmDecoration> = this.computeDocDeco();

        // Determine scroll behavior based on what changed
        const scrollBehavior = this.determineScrollBehavior(prev, state);

        // Check if document structure requires DOM update
        const updateDoc: boolean = redraw || !this._docView.matchesNode(state.doc, outerDeco, innerDeco);
        if (updateDoc || !state.selection.eq(prev.selection)) {
            updateSel = true;
        }

        // Store scroll position if we need to preserve it (overflowAnchor check for browser support)
        const oldScrollPos: StoredScrollPos | null =
            scrollBehavior === 'preserve' && updateSel && isUndefinedOrNull(this._dom.style.overflowAnchor)
                ? storeScrollPos(this)
                : null;

        if (updateSel) {
            // Apply changes to selection and real DOM
            this.updateSelectionAndDOM(prev, state, updateDoc, redraw, outerDeco, innerDeco);
        }

        // Notify plugin views about the state change
        this.updatePluginViews(prev);

        // Update dragged node position if document changed during drag
        if (this._dragging?.nodeSelection && !prev.doc.eq(state.doc)) {
            this.updateDraggedNode(this._dragging, prev);
        }

        // Apply scroll behavior
        this.applyScrollBehavior(scrollBehavior, oldScrollPos);
    }

    /**
     * Checks if plugins have changed between states or props.
     *
     * @param prevState - The previous editor state
     * @param newState - The new editor state
     * @param prevProps - The previous editor props
     * @returns true if plugins have changed
     */
    private hasPluginsChanged(prevState: PmEditorState, newState: PmEditorState, prevProps: DirectEditorProps): boolean {
        return prevState.plugins !== newState.plugins || this._props.plugins !== prevProps.plugins;
    }

    /**
     * Determines the scroll behavior based on state changes.
     *
     * @param prevState - The previous editor state
     * @param newState - The new editor state
     * @returns The scroll behavior: 'reset', 'to selection', or 'preserve'
     */
    private determineScrollBehavior(prevState: PmEditorState, newState: PmEditorState): 'reset' | 'to selection' | 'preserve' {
        if (prevState.plugins !== newState.plugins && !prevState.doc.eq(newState.doc)) {
            return 'reset';
        }
        if (newState.scrollToSelection > prevState.scrollToSelection) {
            return 'to selection';
        }
        return 'preserve';
    }

    /**
     * Updates the selection and DOM based on state changes.
     *
     * @param prevState - The previous editor state
     * @param newState - The new editor state
     * @param updateDoc - Whether the document needs to be updated
     * @param redraw - Whether a full redraw is needed
     * @param outerDeco - Outer decorations
     * @param innerDeco - Inner decorations
     */
    private updateSelectionAndDOM(prevState: PmEditorState,
                                  newState: PmEditorState,
                                  updateDoc: boolean,
                                  redraw: boolean,
                                  outerDeco: Array<PmDecoration>,
                                  innerDeco: DecorationSource): void {
        // Stop observing to prevent our own changes from triggering the observer
        this._domObserver.stop();

        // Work around Chrome/IE/Edge selection issues when DOM changes
        let forceSelUpdate: boolean = this.needsForceSelectionUpdate(prevState, newState, updateDoc);

        if (updateDoc) {
            // Chrome workaround: track if the focus node gets removed during update
            // If it does, we need to restore the selection explicitly
            let chromeKludge: Node | null = null;
            if (browser.chrome) {
                const selectionRange: DOMSelectionRange = this.domSelectionRange();
                chromeKludge = this._trackWrites = selectionRange.focusNode;
            }

            // Preserve composition node during updates to maintain IME state
            if (this.composing) {
                this.inputState.compositionNode = findCompositionNode(this);
            }

            // Try incremental update first, fall back to full redraw if needed
            if (redraw || !ViewDescUpdater.update(this._docView, this, newState.doc, outerDeco, innerDeco)) {
                this._docView.updateOuterDeco(outerDeco);
                this._docView.destroy();
                this._docView = docViewDesc(newState.doc, outerDeco, innerDeco, this._dom, this);
            }

            // If Chrome workaround detected focus node was removed, force selection update
            if (chromeKludge && (!this.trackWrites || !this.dom.contains(this.trackWrites))) {
                forceSelUpdate = true;
            }
        }

        // Update selection in DOM - skip if mouse is down and selection hasn't changed
        if (this.shouldUpdateSelection(forceSelUpdate)) {
            selectionToDOM(this, forceSelUpdate);
        } else {
            syncNodeSelection(this, newState.selection);
            this._domObserver.setCurSelection();
        }

        // Resume observing for external DOM changes
        this._domObserver.start();
    }

    /**
     * Checks if forced selection update is needed due to browser quirks.
     *
     * @param prevState - The previous editor state
     * @param newState - The new editor state
     * @param updateDoc - Whether the document is being updated
     * @returns true if forced selection update is needed
     */
    private needsForceSelectionUpdate(prevState: PmEditorState, newState: PmEditorState, updateDoc: boolean): boolean {
        return updateDoc
            && (browser.ie || browser.chrome)
            && !this.composing
            && !prevState.selection.empty
            && !newState.selection.empty
            && this.selectionContextChanged(prevState.selection, newState.selection);
    }

    /**
     * Determines if selection should be updated in the DOM.
     *
     * @param forceUpdate - Whether to force the update
     * @returns true if selection should be updated
     */
    private shouldUpdateSelection(forceUpdate: boolean): boolean {
        return forceUpdate
            || !(this.inputState.mouseDown
                && this._domObserver.currentSelection.eq(this.domSelectionRange())
                && anchorInRightPlace(this));
    }

    /**
     * Applies the determined scroll behavior.
     *
     * @param behavior - The scroll behavior to apply
     * @param oldScrollPos - The stored scroll position for preservation
     */
    private applyScrollBehavior(behavior: 'reset' | 'to selection' | 'preserve', oldScrollPos: StoredScrollPos | null): void {
        if (behavior === 'reset') {
            this._dom.scrollTop = 0;
        } else if (behavior === 'to selection') {
            this.scrollToSelection();
        } else if (oldScrollPos) {
            resetScrollPos(oldScrollPos);
        }
    }

    /**
     * Destroys all plugin views by calling their destroy methods.
     * Clears the pluginViews array.
     */
    private destroyPluginViews(): void {
        while (this.pluginViews.length > 0) {
            const view: PluginView | undefined = this.pluginViews.pop();
            if (view?.destroy) {
                view.destroy();
            }
        }
    }

    /**
     * Updates plugin views. If plugins have changed or this is the first update,
     * recreates all plugin views. Otherwise, calls update on existing views.
     *
     * @param prevState - The previous editor state, if available
     */
    private updatePluginViews(prevState?: PmEditorState): void {
        // Recreate plugin views if: first update, plugins changed, or plugin array changed
        const shouldRecreate = !prevState
            || this.isPluginsUpdateNeeded
            || prevState.plugins !== this.editorState.plugins;

        if (shouldRecreate) {
            this.isPluginsUpdateNeeded = false;
            // Destroy and recreate all plugin views when plugin configuration changes
            this.destroyPluginViews();
            this.createPluginViews();
        } else {
            // Just notify existing plugin views of state change
            this.updateExistingPluginViews(prevState);
        }
    }

    /**
     * Creates plugin views for all plugins that have a view spec.
     */
    private createPluginViews(): void {
        for (const plugin of this.directPlugins) {
            if (plugin.spec.view) {
                this.pluginViews.push(plugin.spec.view(this));
            }
        }

        for (const plugin of this.editorState.plugins) {
            if (plugin.spec.view) {
                this.pluginViews.push(plugin.spec.view(this));
            }
        }
    }

    /**
     * Updates existing plugin views by calling their update methods.
     *
     * @param prevState - The previous editor state
     */
    private updateExistingPluginViews(prevState: PmEditorState): void {
        for (const pluginView of this.pluginViews) {
            if (pluginView.update) {
                pluginView.update(this, prevState);
            }
        }
    }

    /**
     * Updates the dragged node position after a document change.
     * Tries to find the dragged node in the new document.
     *
     * @param dragging - The current dragging state
     * @param prevState - The previous editor state
     */
    private updateDraggedNode(dragging: Dragging, prevState: PmEditorState): void {
        const selection: PmSelection = dragging.nodeSelection;
        let foundPosition = -1;

        // First try: check if node is still at the same position (common case)
        if (this.editorState.doc.nodeAt(selection.from) === selection.node) {
            foundPosition = selection.from;
        } else {
            // Second try: adjust position based on document size change
            // This handles cases where content was added/removed before the dragged node
            const docSizeDiff: number = this.editorState.doc.content.size - prevState.doc.content.size;
            const potentialPosition: number = selection.from + docSizeDiff;

            // Verify the adjusted position is valid and contains the same node
            if (potentialPosition >= 0 && potentialPosition <= this.editorState.doc.content.size) {
                const nodeAtNewPosition: PmNode | null = this.editorState.doc.nodeAt(potentialPosition);
                if (nodeAtNewPosition === selection.node) {
                    foundPosition = potentialPosition;
                }
            }
        }

        // Create new dragging state with updated position (undefined if node not found)
        this._dragging = new Dragging(
            dragging.slice,
            dragging.move,
            foundPosition >= 0
                ? SelectionFactory.createNodeSelection(this.editorState.doc, foundPosition)
                : undefined
        );
    }

    /**
     * Checks if the given element has no non-editable ancestors within the editor DOM.
     *
     * @param element - The element to check
     * @returns true if no ancestor has contenteditable="false"
     */
    private hasNoNonEditableAncestor(element: Element): boolean {
        let current: Element | null = element;

        while (current && current !== this._dom && this._dom.contains(current)) {
            if ((current as HTMLElement).contentEditable === 'false') {
                return false;
            }
            current = current.parentElement;
        }

        return true;
    }

    /**
     * Creates the editor DOM element. If place has a mount property, uses that,
     * otherwise creates a new div element.
     *
     * @param place - The placement configuration
     * @returns The created or extracted HTML element
     */
    private createEditorDOM(place: null | Node | ((editor: HTMLElement) => void) | {
        mount: HTMLElement;
    }): HTMLElement {
        if (place && typeof place === 'object' && 'mount' in place) {
            return place.mount;
        }
        return document.createElement('div');
    }

    /**
     * Mounts the editor DOM element according to the placement configuration.
     *
     * @param place - The placement configuration
     * @returns true if the editor was mounted via the mount property, false otherwise
     */
    private mountEditorDOM(place: null | Node | ((editor: HTMLElement) => void) | { mount: HTMLElement; }): boolean {
        if (!place) {
            // No mounting needed - editor created but not attached
            return false;
        }

        if (typeof place === 'function') {
            // Custom mounting function - let caller decide where to place editor
            place(this._dom);
            return false;
        }

        if (typeof place === 'object') {
            if ('mount' in place) {
                // Mount property means the element is reused, not created by us
                return true;
            }
            if ('appendChild' in place && place.appendChild) {
                // Direct DOM node - append editor as child
                place.appendChild(this._dom);
                return false;
            }
        }

        return false;
    }

    /**
     * Creates a validator function that checks if a plugin has state components.
     * Plugins passed directly to the view must not have state components.
     *
     * @returns A validation function for plugins
     */
    private checkStateComponent(): (plugin: PmPlugin) => void {
        return (plugin: PmPlugin): void => {
            if (plugin.spec.state || plugin.spec.filterTransaction || plugin.spec.appendTransaction) {
                throw new RangeError('Plugins passed directly to the view must not have a state component');
            }
        };
    }

    /**
     * Checks if node view sets have changed by comparing their properties.
     *
     * @param newViews - The new node view set
     * @param oldViews - The old node view set
     * @returns true if the node views have changed
     */
    private changedNodeViews(newViews: NodeViewSet, oldViews: NodeViewSet): boolean {
        // Check if any view constructor changed or if new views were added
        for (const prop in newViews) {
            if (newViews[prop] !== oldViews[prop]) {
                return true;
            }
        }

        // Check if any views were removed
        for (const prop in oldViews) {
            if (!(prop in newViews)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Builds the node view set by collecting node and mark views from props and plugins.
     *
     * @returns A combined set of node and mark view constructors
     */
    private buildNodeViews(): NodeViewSet {
        const resultSet: NodeViewSet = {};

        // Collect views with first-wins priority (earlier sources take precedence)
        const collectViews = (nodeViewSet: NodeViewSet): void => {
            for (const prop in nodeViewSet) {
                // Only add if not already present - this ensures priority order from someProp
                if (!hasOwnProperty(resultSet, prop)) {
                    resultSet[prop] = nodeViewSet[prop];
                }
            }
        };

        // someProp iterates in priority order: direct props > direct plugins > state plugins
        this.someProp('nodeViews', collectViews);
        this.someProp('markViews', collectViews);

        return resultSet;
    }

    /**
     * Checks if the selection context (the parent node at shared depth) has changed.
     * Used to detect when a forced selection update is needed in Chrome/IE/Edge.
     *
     * @param oldSelection - The previous selection
     * @param newSelection - The new selection
     * @returns true if the selection context has changed
     */
    private selectionContextChanged(oldSelection: PmSelection, newSelection: PmSelection): boolean {
        // Find the minimum shared depth between anchor and head for both selections
        // This gives us the deepest common ancestor that contains the entire selection
        const sharedDepth: number = Math.min(
            oldSelection.$anchor.sharedDepth(oldSelection.head),
            newSelection.$anchor.sharedDepth(newSelection.head)
        );

        // Compare if the parent node at this depth changed between selections
        // If it did, we're in a different structural context and need to update selection
        return oldSelection.$anchor.start(sharedDepth) !== newSelection.$anchor.start(sharedDepth);
    }

    /**
     * Determines the current editable status from props.
     *
     * @returns true if the editor is editable, false otherwise
     */
    private getEditableStatus(): boolean {
        return !this.someProp('editable', value => !value(this.editorState));
    }

    /**
     * Updates the cursor wrapper decoration used for displaying stored marks.
     * Creates a widget decoration if marks are present, otherwise clears it.
     *
     * Stored marks are marks that should be applied to the next input but aren't
     * visible yet. The cursor wrapper provides a zero-width element to attach these
     * marks to, making them visible in the DOM for styling purposes.
     */
    private updateCursorWrapper(): void {
        if (this._markCursor) {
            // Create an invisible image element to represent the cursor with marks
            const wrapperElement: HTMLImageElement = document.createElement('img');
            wrapperElement.className = 'ProseMirror-separator';
            wrapperElement.setAttribute('mark-placeholder', 'true');
            wrapperElement.setAttribute('alt', '');

            this._cursorWrapper = {
                dom: wrapperElement,
                deco: Decoration.widget(
                    this.editorState.selection.from,
                    wrapperElement,
                    {raw: true, marks: this._markCursor}
                )
            };
        } else {
            this._cursorWrapper = null;
        }
    }

    /**
     * Computes the outer decorations for the document node.
     * Combines the base ProseMirror class and contenteditable attribute
     * with any custom attributes from props.
     *
     * @returns An array containing a single node decoration for the document
     */
    private computeDocDeco(): Array<PmDecoration> {
        // Start with base attributes required for editor functionality
        const attrs: DecorationAttrs =
            !this.editable
                ? {
                    class: 'ProseMirror',
                }
                : {
                    class: 'ProseMirror',
                    spellcheck: String(false),
                    translate: 'no',
                    contenteditable: String(true),
                };

        // Collect custom attributes from props and plugins
        this.someProp('attributes', attributeValue => {
            let resolvedValue = attributeValue;

            // Resolve function-based attributes (allows dynamic attributes based on state)
            if (typeof resolvedValue === 'function') {
                resolvedValue = resolvedValue(this.editorState);
            }

            if (resolvedValue) {
                this.mergeAttributes(attrs, resolvedValue);
            }
        });

        // Disable translation by default to prevent browsers from trying to translate editor content
        if (!attrs.translate) {
            attrs.translate = 'no';
        }

        // Return a single node decoration that spans the entire document
        return [Decoration.node(0, this.editorState.doc.content.size, attrs)];
    }

    /**
     * Merges custom attributes into the base attributes object.
     * Handles special cases for 'class' and 'style' attributes.
     *
     * @param baseAttrs - The base attributes to merge into
     * @param customAttrs - The custom attributes to merge
     */
    private mergeAttributes(baseAttrs: DecorationAttrs, customAttrs: Record<string, string>): void {
        for (const attr in customAttrs) {
            if (attr === 'class') {
                // Append classes to existing classes (space-separated)
                baseAttrs.class += ' ' + customAttrs[attr];
            } else if (attr === 'style') {
                // Append styles to existing styles (semicolon-separated)
                baseAttrs.style = (baseAttrs.style ? baseAttrs.style + ';' : '') + customAttrs[attr];
            } else if (!baseAttrs[attr] && attr !== 'contenteditable' && attr !== 'nodeName') {
                // For other attributes, only add if not already present
                // Protect contenteditable and nodeName from being overwritten
                baseAttrs[attr] = customAttrs[attr];
            }
        }
    }
}
