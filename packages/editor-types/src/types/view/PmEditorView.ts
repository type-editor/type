import { type Mark, type Slice } from '@type-editor/model';

import type { PmEditorState, PmPlugin, PmTransaction } from '../state';
import type { PmDecoration } from './decoration/PmDecoration';
import type { DOMSelectionRange } from './dom/DOMSelectionRange';
import type { DirectEditorProps } from './editor-view/DirectEditorProps';
import type { EditorProps } from './editor-view/EditorProps';
import type { NodeViewSet } from './editor-view/NodeViewSet';
import type { PmDragging } from './input-handler/PmDragging';
import type { PmInputState } from './input-handler/PmInputState';
import type { PmDOMObserver } from './PmDOMObserver';
import type { PmNodeViewDesc } from './view-desc/PmNodeViewDesc';
import type { PmViewDesc } from './view-desc/PmViewDesc';

export interface PmEditorView {

    readonly props: Readonly<DirectEditorProps>;
    readonly root: Document | ShadowRoot;
    focused: boolean;
    markCursor: ReadonlyArray<Mark>;
    readonly cursorWrapper: { dom: Node; deco: PmDecoration };
    readonly nodeViews: Readonly<NodeViewSet>;
    readonly docView: PmNodeViewDesc;
    lastSelectedViewDesc: PmViewDesc;
    readonly trackWrites: Node | null;
    dragging: PmDragging;
    readonly dom: HTMLElement;
    readonly editable: boolean;
    readonly input: PmInputState;
    readonly domObserver: PmDOMObserver;
    readonly state: PmEditorState;
    readonly composing: boolean;
    readonly isDestroyed: boolean;

    /**
     * Clears the tracked writes node.
     * @internal
     */
    clearTrackWrites(): void;

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
    update(props: DirectEditorProps): void;

    /**
     * Update the view by updating existing props object with the object
     * given as argument. Equivalent to `view.update(Object.assign({},
     * view.props, props))`.
     *
     * @param props - Partial props to merge with existing props
     */
    setProps(props: Partial<DirectEditorProps>): void;

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
    updateState(state: PmEditorState): void;

    /**
     * Scrolls the current selection into view if it's not already visible.
     */
    scrollToSelection(): void;

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
    someProp<PropName extends keyof EditorProps, Result>(
        propName: PropName,
        callbackFunc: (value: NonNullable<EditorProps[PropName]>) => Result
    ): Result | undefined;

    someProp<PropName extends keyof EditorProps>(propName: PropName): NonNullable<EditorProps[PropName]> | undefined;

    someProp<PropName extends keyof EditorProps, Result = NonNullable<EditorProps[PropName]>>(
        propName: PropName,
        callbackFunc?: (value: NonNullable<EditorProps[PropName]>) => Result
    ): Result | NonNullable<EditorProps[PropName]> | undefined;

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
    hasFocus(): boolean;

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
    focus(): void;

    /**
     * When an existing editor view is moved to a new document or
     * shadow tree, call this to make it recompute its root.
     */
    updateRoot(): void;

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
    posAtCoords(coords: { left: number, top: number; }): { pos: number, inside: number; } | null;

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
    coordsAtPos(pos: number, side?: number): { left: number, right: number, top: number, bottom: number; };

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
    domAtPos(pos: number, side?: number): { node: Node, offset: number; };

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
    nodeDOM(pos: number): Node | null;

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
    posAtDOM(node: Node, offset: number, bias?: number): number;

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
    endOfTextblock(dir: 'up' | 'down' | 'left' | 'right' | 'forward' | 'backward', state?: PmEditorState): boolean;

    /**
     * Run the editor's paste logic with the given HTML string. The
     * `event`, if given, will be passed to the
     * [`handlePaste`](#view.EditorProps.handlePaste) hook.
     *
     * @param html - The HTML string to paste
     * @param event - Optional clipboard event to pass to handlers
     * @returns true if the paste was handled
     */
    pasteHTML(html: string, event?: ClipboardEvent): boolean;

    /**
     * Run the editor's paste logic with the given plain-text input.
     *
     * @param text - The plain text string to paste
     * @param event - Optional clipboard event to pass to handlers
     * @returns true if the paste was handled
     */
    pasteText(text: string, event?: ClipboardEvent): boolean;

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
    serializeForClipboard(slice: Slice): { dom: HTMLElement, text: string, slice: Slice; };

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
    destroy(): void;

    /**
     * Used for testing. Dispatches a DOM event to the input state handler.
     *
     * @param event - The DOM event to dispatch
     */
    dispatchEvent(event: Event): void;

    /**
     * Gets the current DOM selection range, with workarounds for Safari shadow DOM.
     *
     * @returns The DOM selection range with focus and anchor information
     */
    domSelectionRange(): DOMSelectionRange;

    /**
     * Gets the current DOM selection object.
     *
     * @returns The DOM selection object, or null if not available
     */
    domSelection(): Selection | null;

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
    dispatch(transaction: PmTransaction): void;

    /**
     * Serializes the editor state to a JSON string representation.
     * This can be used to save the document state for persistence or
     * transfer.
     *
     * @param pluginFields - Optional mapping of plugin names to plugins
     *   whose state should be included in the serialized output
     * @returns A JSON string representation of the editor state
     *
     * @example
     * ```typescript
     * // Save the editor content to local storage
     * const json = view.toJSON();
     * localStorage.setItem('document', json);
     *
     * // Include specific plugin states
     * const jsonWithPlugins = view.toJSON({ myPlugin: myPluginInstance });
     * ```
     */
    toJSON(pluginFields?: Readonly<Record<string, PmPlugin>>): string;

    /**
     * Serializes the editor content to an HTML string representation.
     * This uses the schema's DOM serializer to convert the document
     * structure into HTML markup.
     *
     * @returns An HTML string representation of the editor content
     *
     * @example
     * ```typescript
     * // Get HTML for export or display
     * const html = view.toHtml();
     * console.log(html); // '<p>Hello <strong>world</strong></p>'
     *
     * // Copy HTML to clipboard
     * navigator.clipboard.writeText(view.toHtml());
     * ```
     */
    toHtml(): string;

    /**
     * Dynamically adds a plugin to the editor view. The plugin will be
     * initialized and its state will be included in subsequent transactions.
     *
     * @param plugin - The plugin instance to add to the editor
     *
     * @example
     * ```typescript
     * // Add a plugin after editor initialization
     * const myPlugin = new Plugin({
     *   key: new PluginKey('myPlugin'),
     *   // plugin configuration...
     * });
     * view.addPlugin(myPlugin);
     * ```
     */
    addPlugin(plugin: PmPlugin): void;

}
