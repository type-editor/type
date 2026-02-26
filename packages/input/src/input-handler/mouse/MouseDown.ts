import {browser, ELEMENT_NODE} from '@type-editor/commons';
import type {PmEditorView, PmMouseDown, PmSelection, PmTransaction} from '@type-editor/editor-types';
import type {Node, ResolvedPos} from '@type-editor/model';
import {selectionToDOM} from '@type-editor/selection-util';
import {Selection, SelectionFactory} from '@type-editor/state';
import {type NodeViewDesc, ViewDescUtil} from '@type-editor/viewdesc';


/**
 * Manages mouse down state and handles mouse-based text selection and dragging.
 * Tracks the initial state, sets up drag attributes if needed, and handles
 * mouse move and mouse up events.
 */
export class MouseDown implements PmMouseDown {

    // Delay for setting contentEditable on Firefox (ms)
    private static readonly GECKO_DRAGGABLE_DELAY = 20;
    // Min mouse movement to consider as drag vs click (px)
    private static readonly MOUSE_MOVE_THRESHOLD = 4;

    /** The document state when the mouse down occurred */
    private readonly startDoc: Node;

    /** Whether node selection mode is active (modifier key pressed) */
    private readonly selectNode: boolean;
    /** Information about a potential drag operation, if applicable */
    private readonly _mightDrag: { node: Node, pos: number, addAttr: boolean, setUneditable: boolean; } | null = null;
    /** The target DOM element for the mouse down */
    private readonly target: HTMLElement | null;
    /** The editor view */
    private readonly view: PmEditorView;
    /** The document position where mouse down occurred */
    private readonly pos: { pos: number, inside: number; };
    /** The original mouse event */
    private readonly event: MouseEvent;
    /** Whether DOM was flushed before this mouse down */
    private readonly flushed: boolean;
    /** Bound mouseup handler */
    private readonly upHandler: (event: MouseEvent) => void;
    /** Bound mousemove handler */
    private readonly moveHandler: (event: MouseEvent) => void;

    /** Whether to allow default browser selection behavior */
    private _allowDefault: boolean;
    /** Whether selection sync should be delayed until after event handling */
    private _delayedSelectionSync = false;

    /**
     * Creates a new MouseDown handler.
     * @param view - The editor view
     * @param pos - The document position where the mouse down occurred
     * @param event - The mouse event
     * @param flushed - Whether the DOM was flushed before this event
     */
    constructor(view: PmEditorView,
                pos: { pos: number, inside: number; },
                event: MouseEvent,
                flushed: boolean) {
        this.view = view;
        this.pos = pos;
        this.event = event;
        this.startDoc = view.state.doc;
        this.selectNode = browser.mac ? event.metaKey : event.ctrlKey;
        this._allowDefault = event.shiftKey;

        const MOUSE_LEFT_BUTTON = 0;

        let targetNode: Node;
        let targetPos: number;

        if (pos.inside > -1) {
            targetNode = view.state.doc.nodeAt(pos.inside);
            targetPos = pos.inside;
        } else {
            const $pos: ResolvedPos = view.state.doc.resolve(pos.pos);
            targetNode = $pos.parent;
            targetPos = $pos.depth ? $pos.before() : 0;
        }

        const target: HTMLElement = flushed ? null : event.target as HTMLElement;
        const targetDesc: NodeViewDesc = target ? ViewDescUtil.nearestNodeViewDesc(view.docView, target) : null;
        this.target = targetDesc?.nodeDOM.nodeType === ELEMENT_NODE ? targetDesc.nodeDOM as HTMLElement : null;

        const {selection} = view.state;
        // Check if this might be the start of a drag operation
        const isLeftButtonOnDraggableNode: boolean = event.button === MOUSE_LEFT_BUTTON
            && targetNode.type.spec.draggable
            && targetNode.type.spec.selectable;
        const isClickOnSelectedNode: boolean = selection.isNodeSelection()
            && selection.from <= targetPos
            && selection.to > targetPos;

        if (isLeftButtonOnDraggableNode || isClickOnSelectedNode) {
            this._mightDrag = {
                node: targetNode,
                pos: targetPos,
                addAttr: this.target && !this.target.draggable,
                setUneditable: this.target && browser.gecko && !this.target.hasAttribute('contentEditable')
            };
        }

        // Set up DOM attributes needed for dragging to work properly in different browsers
        if (this.target
            && this._mightDrag
            && (this._mightDrag.addAttr || this._mightDrag.setUneditable)) {
            this.view.domObserver.stop();

            // Make element draggable if not already
            if (this._mightDrag.addAttr) {
                this.target.draggable = true;
            }

            // Firefox requires contentEditable=false for drag-and-drop to work on node selections
            if (this._mightDrag.setUneditable) {
                setTimeout(() => {
                    if (this.view.input.mouseDown === this) {
                        this.target.setAttribute('contentEditable', 'false');
                    }
                }, MouseDown.GECKO_DRAGGABLE_DELAY);
            }
            this.view.domObserver.start();
        }

        this.upHandler = this.up.bind(this) as (event: MouseEvent) => void;
        this.moveHandler = this.move.bind(this) as (event: MouseEvent) => void;

        view.root.addEventListener('mouseup', this.upHandler);
        view.root.addEventListener('mousemove', this.moveHandler);

        this.setSelectionOrigin(view, 'pointer');
    }


    /** Whether to allow default browser selection behavior */
    get allowDefault(): boolean {
        return this._allowDefault;
    }

    /** Set whether selection sync should be delayed */
    set delayedSelectionSync(sync: boolean) {
        this._delayedSelectionSync = sync;
    }

    /** Information about a potential drag operation */
    get mightDrag(): { node: Node, pos: number, addAttr: boolean, setUneditable: boolean; } | null {
        return this._mightDrag;
    }

    /**
     * Updates the editor selection, focusing the editor if necessary and
     * dispatching a transaction if the selection changed.
     * @param view - The editor view
     * @param selection - The new selection
     * @param origin - The origin of the selection change (e.g., 'pointer')
     */
    public static updateSelection(view: PmEditorView, selection: PmSelection, origin: string): void {
        if (!view.focused) {
            view.focus();
        }

        if (view.state.selection.eq(selection)) {
            return;
        }

        const transaction: PmTransaction = view.state.transaction.setSelection(selection);
        if (origin === 'pointer') {
            transaction.setMeta('pointer', true);
        }

        view.dispatch(transaction);
    }

    /**
     * Runs click handlers (handleClickOn, handleDoubleClickOn, handleTripleClickOn)
     * for nodes in the editor tree, traversing from the clicked position up through
     * parent nodes.
     * @param view - The editor view
     * @param propName - The name of the handler prop to invoke
     * @param pos - The document position where the click occurred
     * @param inside - The position inside the clicked node (-1 if not inside a node)
     * @param event - The mouse event
     * @returns True if a handler processed the click
     */
    public static runHandlerOnContext(view: PmEditorView,
                                      propName: 'handleClickOn' | 'handleDoubleClickOn' | 'handleTripleClickOn',
                                      pos: number,
                                      inside: number,
                                      event: MouseEvent): boolean {
        if (inside === -1) {
            return false;
        }

        const $pos: ResolvedPos = view.state.doc.resolve(inside);

        // Walk up the node hierarchy from innermost to outermost,
        // giving each node a chance to handle the click
        for (let i = $pos.depth + 1; i > 0; i--) {
            if (view.someProp(propName, callbackFunc => i > $pos.depth
                ? callbackFunc(view, pos, $pos.nodeAfter, $pos.before(i), event, true)
                : callbackFunc(view, pos, $pos.node(i), $pos.before(i), event, false))) {

                return true;
            }
        }
        return false;
    }

    /**
     * Cleans up the mouse down state, removing event listeners and
     * restoring DOM attributes that were modified for dragging.
     */
    public done(): void {
        this.view.root.removeEventListener('mouseup', this.upHandler);
        this.view.root.removeEventListener('mousemove', this.moveHandler);

        if (this._mightDrag && this.target) {
            this.view.domObserver.stop();

            if (this._mightDrag.addAttr) {
                this.target.removeAttribute('draggable');
            }

            if (this._mightDrag.setUneditable) {
                this.target.removeAttribute('contentEditable');
            }

            this.view.domObserver.start();
        }

        if (this._delayedSelectionSync) {setTimeout(() => {
            selectionToDOM(this.view);
        });}

        this.view.input.mouseDown = null;
    }

    /**
     * Handles mouse up events, finalizing the selection or click action.
     * @param event - The mouse up event
     */
    private up(event: MouseEvent): void {
        this.done();

        if (!this.view.dom.contains(event.target as HTMLElement)) {
            return;
        }

        let pos: { pos: number, inside: number; } | null = this.pos;
        if (this.view.state.doc !== this.startDoc) {
            pos = this.view.posAtCoords({
                left: event.clientX,
                top: event.clientY
            });
        }

        this.updateAllowDefault(event);
        if (this._allowDefault || !pos) {
            this.setSelectionOrigin(this.view, 'pointer');
            return;
        }

        if (this.handleSingleClick(this.view, pos.pos, pos.inside, event, this.selectNode)) {
            event.preventDefault();
            return;
        }

        const MOUSE_LEFT_BUTTON = 0;
        const CHROME_SELECTION_TOLERANCE = 2;

        // Determine if we need to force a selection update due to browser quirks
        const shouldForceSelection = event.button === MOUSE_LEFT_BUTTON && (
            this.flushed
            // Safari ignores clicks on draggable elements, so we need to force selection
            || (browser.safari && this._mightDrag && !this._mightDrag.node.isAtom)
            // Chrome has a bug where it shows a hidden cursor for node selections
            // but reports the node as selected. If clicking near that hidden cursor,
            // force a proper selection to avoid confusing behavior.
            || (browser.chrome
                && !this.view.state.selection.visible
                && Math.min(
                    Math.abs(pos.pos - this.view.state.selection.from),
                    Math.abs(pos.pos - this.view.state.selection.to)
                ) <= CHROME_SELECTION_TOLERANCE)
        );

        if (shouldForceSelection) {
            MouseDown.updateSelection(this.view, Selection.near(this.view.state.doc.resolve(pos.pos)), 'pointer');
            event.preventDefault();
        } else {
            this.setSelectionOrigin(this.view, 'pointer');
        }
    }

    /**
     * Handles mouse move events during a mouse down operation.
     * @param event - The mouse move event
     */
    private move(event: MouseEvent): void {
        this.updateAllowDefault(event);
        this.setSelectionOrigin(this.view, 'pointer');
        if (event.buttons === 0) {
            this.done();
        }
    }

    /**
     * Updates the allowDefault flag if the mouse has moved beyond the threshold,
     * indicating the user is dragging rather than clicking.
     * @param event - The current mouse event
     */
    private updateAllowDefault(event: MouseEvent): void {
        if (!this._allowDefault
            && (Math.abs(this.event.x - event.clientX) > MouseDown.MOUSE_MOVE_THRESHOLD
                || Math.abs(this.event.y - event.clientY) > MouseDown.MOUSE_MOVE_THRESHOLD)) {
            this._allowDefault = true;
        }
    }

    /**
     * Handles a single click in the editor. Runs custom handlers first, then
     * attempts to select a node or leaf based on the selectNode flag.
     * @param view - The editor view
     * @param pos - The document position where the click occurred
     * @param inside - The position inside the clicked node
     * @param event - The mouse event
     * @param selectNode - Whether to attempt node selection (when modifier key is pressed)
     * @returns True if the click was handled
     */
    private handleSingleClick(view: PmEditorView,
                              pos: number,
                              inside: number,
                              event: MouseEvent,
                              selectNode: boolean): boolean {
        if (MouseDown.runHandlerOnContext(view, 'handleClickOn', pos, inside, event)) {
            return true;
        }

        view.someProp('handleClick', callbackFunc => callbackFunc(view, pos, event));

        if (selectNode) {
            return this.selectClickedNode(view, inside);
        }
        return this.selectClickedLeaf(view, inside);
    }

    /**
     * Attempts to select a node at the clicked position, cycling through node
     * selections when clicking on already-selected nodes with selectNode modifier.
     * @param view - The editor view
     * @param inside - The position inside the clicked node
     * @returns True if a selectable node was found and selected
     */
    private selectClickedNode(view: PmEditorView, inside: number): boolean {
        if (inside === -1) {
            return false;
        }

        const selection: PmSelection = view.state.selection;
        let selectedNode: Node;
        let selectAt: number;

        if (selection.isNodeSelection()) {
            selectedNode = selection.node;
        }

        const $pos: ResolvedPos = view.state.doc.resolve(inside);

        // Walk up the node tree to find selectable nodes
        for (let i = $pos.depth + 1; i > 0; i--) {
            const node: Node = i > $pos.depth ? $pos.nodeAfter : $pos.node(i);

            if (Selection.isNodeSelectable(node)) {
                // If we're clicking on an already selected node, select its parent instead
                // (allowing users to "cycle out" of nested selections)
                if (selectedNode && selection.$from.depth > 0
                    && i >= selection.$from.depth
                    && $pos.before(selection.$from.depth + 1) === selection.$from.pos) {

                    selectAt = $pos.before(selection.$from.depth);
                } else {
                    selectAt = $pos.before(i);
                }

                break;
            }
        }

        if (selectAt !== null) {
            MouseDown.updateSelection(view, SelectionFactory.createNodeSelection(view.state.doc, selectAt), 'pointer');
            return true;
        } else {
            return false;
        }
    }

    /**
     * Attempts to select a leaf node (atom) at the clicked position if it's selectable.
     * @param view - The editor view
     * @param inside - The position inside the clicked node
     * @returns True if a selectable leaf node was found and selected
     */
    private selectClickedLeaf(view: PmEditorView, inside: number): boolean {
        if (inside === -1) {
            return false;
        }

        const $pos: ResolvedPos = view.state.doc.resolve(inside);
        const node: Node = $pos.nodeAfter;

        if (node && node.isAtom && Selection.isNodeSelectable(node)) {
            MouseDown.updateSelection(view, SelectionFactory.createNodeSelection($pos), 'pointer');
            return true;
        }

        return false;
    }

    /**
     * Records the origin of a selection change for tracking purposes.
     * @param view - The editor view
     * @param origin - The origin type (e.g., 'key', 'pointer', 'paste')
     */
    private setSelectionOrigin(view: PmEditorView, origin: string): void {
        view.input.lastSelectionOrigin = origin;
        view.input.lastSelectionTime = Date.now();
    }
}
