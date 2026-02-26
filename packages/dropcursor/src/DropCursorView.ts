import {isUndefinedOrNull} from '@type-editor/commons';
import type {PmEditorView} from '@type-editor/editor-types';
import type {PmNode, ResolvedPos, Slice} from '@type-editor/model';
import {type EditorState} from '@type-editor/state';
import {dropPoint} from '@type-editor/transform';

import type {DropCursorOptions} from './types/DropCursorOptions';
import type {EventHandler} from './types/EventHandler';
import type {Rect} from './types/Rect';

/**
 * Constants for drop cursor behavior.
 */
const DROP_CURSOR_CONSTANTS = {

    /** Timeout in ms before removing cursor after dragover stops */
    DRAGOVER_TIMEOUT: 5000,

    /** Timeout in ms before removing cursor after drop/dragend */
    DROP_END_TIMEOUT: 20,

    /** Z-index for the drop cursor element */
    Z_INDEX: 50,
} as const;


/**
 * View implementation for the drop cursor plugin.
 * Manages the visual drop cursor element and handles drag-and-drop events.
 */
export class DropCursorView {

    /** Width of the drop cursor in pixels */
    private readonly width: number;

    /** Color of the drop cursor, or undefined if color is disabled */
    private readonly color: string | undefined;

    /** Optional CSS class to apply to the cursor element */
    private readonly class: string | undefined;

    /** Registered event handlers for cleanup */
    private readonly handlers: Array<EventHandler>;

    /** Current position of the drop cursor, or null if not shown */
    private cursorPos: number | null = null;

    /** DOM element representing the drop cursor */
    private element: HTMLElement | null = null;

    /** Timeout ID for scheduled cursor removal */
    private timeout = -1;

    /** Last time dragover was processed (for throttling) */
    private lastDragoverTime = 0;

    /** Minimum time between dragover updates in ms */
    private readonly dragoverThrottle = 16; // ~60fps

    /**
     * Creates a new drop cursor view.
     *
     * @param editorView - The ProseMirror editor view instance
     * @param options - Configuration options for cursor appearance
     */
    constructor(readonly editorView: PmEditorView, options: DropCursorOptions) {
        this.width = options.width ?? 1;
        this.color = options.color === false ? undefined : (options.color || 'black');
        this.class = options.class;

        // Register drag-and-drop event handlers
        this.handlers = this.registerEventHandlers();
    }

    /**
     * Cleans up the drop cursor view by removing event listeners and DOM elements.
     * Called automatically when the plugin is destroyed.
     */
    public destroy(): void {
        this.clearScheduledRemoval();
        this.handlers.forEach(({name, handler}: EventHandler): void => {
            this.editorView.dom.removeEventListener(name, handler);
        });
        this.removeCursorElement();
    }

    /**
     * Updates the drop cursor when the editor state changes.
     * Removes the cursor if its position becomes invalid, or updates its visual position.
     *
     * @param editorView - The updated editor view
     * @param prevState - The previous editor state before the update
     */
    public update(editorView: PmEditorView, prevState: EditorState): void {
        if (isUndefinedOrNull(this.cursorPos)) {
            return;
        }

        // Only update if the document has changed
        if (prevState.doc === editorView.state.doc) {
            return;
        }

        // Remove cursor if position is now invalid
        if (this.cursorPos > editorView.state.doc.content.size) {
            this.setCursor(null);
        } else {
            // Update cursor position to reflect document changes
            this.updateOverlay();
        }
    }

    /**
     * Registers all required drag-and-drop event handlers on the editor DOM.
     *
     * @returns Array of registered event handlers for cleanup
     */
    private registerEventHandlers(): Array<EventHandler> {
        const eventNames = ['dragover', 'dragend', 'drop', 'dragleave'] as const;

        return eventNames.map((name: 'dragover' | 'dragend' | 'drop' | 'dragleave') => {
            const handler: (event: Event) => void = (event: Event): void => {
                this.handleEvent(name, event);
            };

            this.editorView.dom.addEventListener(name, handler);
            return {name, handler};
        });
    }

    /**
     * Sets the drop cursor position or removes it.
     *
     * @param pos - The document position where the cursor should appear, or null to hide it
     */
    private setCursor(pos: number | null): void {
        if (pos === this.cursorPos) {
            return;
        }

        this.cursorPos = pos;

        if (isUndefinedOrNull(pos)) {
            this.removeCursorElement();
        } else {
            this.updateOverlay();
        }
    }

    /**
     * Removes the cursor element from the DOM if it exists.
     */
    private removeCursorElement(): void {
        if (this.element?.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }

    /**
     * Clears any scheduled cursor removal timeout.
     */
    private clearScheduledRemoval(): void {
        if (this.timeout !== -1) {
            clearTimeout(this.timeout);
            this.timeout = -1;
        }
    }

    /**
     * Updates the visual position and appearance of the drop cursor overlay.
     * Called when the cursor position changes or the document is updated.
     */
    private updateOverlay(): void {
        if (isUndefinedOrNull(this.cursorPos)) {
            return;
        }

        // Validate position before resolving
        const docSize: number = this.editorView.state.doc.content.size;
        if (this.cursorPos < 0 || this.cursorPos > docSize) {
            this.removeCursorElement();
            return;
        }

        let $pos: ResolvedPos;
        try {
            $pos = this.editorView.state.doc.resolve(this.cursorPos);
        } catch (_error) {
            // Position is invalid, remove cursor
            this.removeCursorElement();
            return;
        }

        const isBlock = !$pos.parent.inlineContent;

        // Calculate the rectangle for the cursor
        const rect: Rect = this.calculateCursorRect($pos, isBlock);

        // Create or update the cursor element
        this.ensureCursorElement(isBlock);

        // Position the element based on its parent
        this.positionCursorElement(rect);
    }

    /**
     * Calculates the rectangle for the cursor based on position and type.
     *
     * @param $pos - Resolved position in the document
     * @param isBlock - Whether the cursor is between block nodes
     * @returns The rectangle coordinates for the cursor
     */
    private calculateCursorRect($pos: ResolvedPos, isBlock: boolean): Rect {
        const editorDOM: HTMLElement = this.editorView.dom;
        const editorRect: DOMRect = editorDOM.getBoundingClientRect();

        // Protect against division by zero
        const scaleX: number = editorDOM.offsetWidth > 0 ? editorRect.width / editorDOM.offsetWidth : 1;
        const scaleY: number = editorDOM.offsetHeight > 0 ? editorRect.height / editorDOM.offsetHeight : 1;

        if (isBlock) {
            const blockRect: Rect = this.calculateBlockCursorRect($pos, scaleY);
            if (blockRect) {
                return blockRect;
            }
        }

        // Fall back to inline cursor positioning
        return this.calculateInlineCursorRect(scaleX);
    }

    /**
     * Calculates the rectangle for a block-level cursor.
     *
     * @param $pos - Resolved position in the document
     * @param scaleY - Vertical scale factor for the editor
     * @returns The rectangle coordinates, or undefined if not applicable
     */
    private calculateBlockCursorRect($pos: ResolvedPos, scaleY: number): Rect | undefined {
        // This method is only called when cursorPos is not null
        if (isUndefinedOrNull(this.cursorPos)) {
            return undefined;
        }

        const before: PmNode = $pos.nodeBefore;
        const after: PmNode = $pos.nodeAfter;

        if (!before && !after) {
            return undefined;
        }

        const nodePos: number = this.cursorPos - (before ? before.nodeSize : 0);
        const node: DOMNode | null = this.editorView.nodeDOM(nodePos);

        if (!node) {
            return undefined;
        }

        const nodeRect: DOMRect = (node as HTMLElement).getBoundingClientRect();
        let top: number = before ? nodeRect.bottom : nodeRect.top;

        // If cursor is between two blocks, center it
        if (before && after) {
            const afterNode: DOMNode | null = this.editorView.nodeDOM(this.cursorPos);
            if (afterNode) {
                const afterRect: DOMRect = (afterNode as HTMLElement).getBoundingClientRect();
                top = (top + afterRect.top) / 2;
            }
        }

        const halfWidth: number = (this.width / 2) * scaleY;
        return {
            left: nodeRect.left,
            right: nodeRect.right,
            top: top - halfWidth,
            bottom: top + halfWidth
        };
    }

    /**
     * Calculates the rectangle for an inline cursor.
     *
     * @param scaleX - Horizontal scale factor for the editor
     * @returns The rectangle coordinates for the inline cursor
     */
    private calculateInlineCursorRect(scaleX: number): Rect {
        // This method is only called when cursorPos is not null
        if (isUndefinedOrNull(this.cursorPos)) {
            throw new Error('Cannot calculate inline cursor rect without a cursor position');
        }

        const coords: Rect = this.editorView.coordsAtPos(this.cursorPos);
        const halfWidth: number = (this.width / 2) * scaleX;

        return {
            left: coords.left - halfWidth,
            right: coords.left + halfWidth,
            top: coords.top,
            bottom: coords.bottom
        };
    }

    /**
     * Ensures the cursor element exists and has the correct styling.
     *
     * @param isBlock - Whether the cursor is for a block-level position
     */
    private ensureCursorElement(isBlock: boolean): void {
        const parent = (this.editorView.dom.offsetParent || document.body) as HTMLElement;

        if (!this.element) {
            this.element = this.createCursorElement(parent);
        }

        // Update CSS classes based on cursor type
        this.element.classList.toggle('prosemirror-dropcursor-block', isBlock);
        this.element.classList.toggle('prosemirror-dropcursor-inline', !isBlock);
    }

    /**
     * Creates a new cursor DOM element with initial styling.
     *
     * @param parent - The parent element to append the cursor to
     * @returns The created cursor element
     */
    private createCursorElement(parent: HTMLElement): HTMLElement {
        const element: HTMLDivElement = parent.appendChild(document.createElement('div'));

        if (this.class) {
            element.className = this.class;
        }

        element.style.cssText = `position: absolute; z-index: ${DROP_CURSOR_CONSTANTS.Z_INDEX}; pointer-events: none;`;

        if (this.color) {
            element.style.backgroundColor = this.color;
        }

        return element;
    }

    /**
     * Positions the cursor element within its parent container.
     *
     * @param rect - The target rectangle for the cursor
     */
    private positionCursorElement(rect: Rect): void {
        if (!this.element) {
            return;
        }

        const editorDOM: HTMLElement = this.editorView.dom;
        const editorRect: DOMRect = editorDOM.getBoundingClientRect();

        // Protect against division by zero
        const scaleX: number = editorDOM.offsetWidth > 0 ? editorRect.width / editorDOM.offsetWidth : 1;
        const scaleY: number = editorDOM.offsetHeight > 0 ? editorRect.height / editorDOM.offsetHeight : 1;

        const {left: parentLeft, top: parentTop} = this.getParentOffset();

        this.element.style.left = `${(rect.left - parentLeft) / scaleX}px`;
        this.element.style.top = `${(rect.top - parentTop) / scaleY}px`;
        this.element.style.width = `${(rect.right - rect.left) / scaleX}px`;
        this.element.style.height = `${(rect.bottom - rect.top) / scaleY}px`;
    }

    /**
     * Calculates the offset of the parent element for absolute positioning.
     *
     * @returns The left and top offset of the parent
     */
    private getParentOffset(): { left: number; top: number } {
        const parent = this.editorView.dom.offsetParent as HTMLElement;

        // Check if parent is the body with static positioning
        if (!parent || (parent === document.body && getComputedStyle(parent).position === 'static')) {
            return {
                left: -pageXOffset,
                top: -pageYOffset
            };
        }

        const parentRect = parent.getBoundingClientRect();

        // Protect against division by zero
        const parentScaleX: number = parent.offsetWidth > 0 ? parentRect.width / parent.offsetWidth : 1;
        const parentScaleY: number = parent.offsetHeight > 0 ? parentRect.height / parent.offsetHeight : 1;

        return {
            left: parentRect.left - parent.scrollLeft * parentScaleX,
            top: parentRect.top - parent.scrollTop * parentScaleY
        };
    }

    /**
     * Schedules the cursor to be removed after a specified timeout.
     *
     * @param timeout - Time in milliseconds before removing the cursor
     */
    private scheduleRemoval(timeout: number): void {
        this.clearScheduledRemoval();
        this.timeout = window.setTimeout(() => {
            this.setCursor(null);
        }, timeout);
    }

    /**
     * Handles the dragover event to show the cursor at the potential drop position.
     *
     * @param event - The dragover event
     */
    private dragover(event: DragEvent): void {
        if (!this.editorView.editable) {
            return;
        }

        // Throttle dragover events to improve performance
        const now = Date.now();
        if (now - this.lastDragoverTime < this.dragoverThrottle) {
            // Still schedule removal to keep cursor visible
            this.scheduleRemoval(DROP_CURSOR_CONSTANTS.DRAGOVER_TIMEOUT);
            return;
        }
        this.lastDragoverTime = now;

        const pos: { pos: number; inside: number } = this.editorView.posAtCoords({
            left: event.clientX,
            top: event.clientY
        });

        if (!pos) {
            return;
        }

        // Check if the drop cursor is disabled for this position
        if (this.isDropCursorDisabled(pos, event)) {
            return;
        }

        // Calculate the best drop position
        const dropPosition = this.calculateDropPosition(pos);

        this.setCursor(dropPosition);
        this.scheduleRemoval(DROP_CURSOR_CONSTANTS.DRAGOVER_TIMEOUT);
    }

    /**
     * Checks if the drop cursor is disabled at the given position.
     *
     * @param pos - The position to check
     * @param event - The drag event
     * @returns True if the drop cursor should be disabled
     */
    private isDropCursorDisabled(pos: { pos: number; inside: number },
                                 event: DragEvent): boolean {
        if (pos.inside < 0) {
            return false;
        }

        const node: PmNode = this.editorView.state.doc.nodeAt(pos.inside);
        if (!node) {
            return false;
        }

        const disableDropCursor = node.type.spec.disableDropCursor;

        if (typeof disableDropCursor === 'function') {
            return disableDropCursor(this.editorView, pos, event);
        }

        // Return true only if explicitly set to true, false otherwise
        if (!isUndefinedOrNull(disableDropCursor)) {
            return disableDropCursor;
        }

        return false;
    }

    /**
     * Calculates the optimal drop position, considering the dragged content.
     *
     * @param pos - The initial position from coordinates
     * @returns The calculated drop position
     */
    private calculateDropPosition(pos: { pos: number; inside: number }): number {
        let target: number = pos.pos;

        // If we're dragging a slice, find the best drop point
        const draggingSlice: Slice = this.editorView.dragging?.slice;
        if (draggingSlice) {
            const dropPos: number = dropPoint(
                this.editorView.state.doc,
                target,
                draggingSlice
            );
            if (dropPos !== null) {
                target = dropPos;
            }
        }

        return target;
    }

    /**
     * Handles the dragend event to hide the cursor.
     */
    private dragend(): void {
        this.scheduleRemoval(DROP_CURSOR_CONSTANTS.DROP_END_TIMEOUT);
    }

    /**
     * Handles the drop event to hide the cursor.
     */
    private drop(): void {
        this.scheduleRemoval(DROP_CURSOR_CONSTANTS.DROP_END_TIMEOUT);
    }

    /**
     * Handles the dragleave event to hide the cursor when leaving the editor.
     *
     * @param event - The dragleave event
     */
    private dragleave(event: DragEvent): void {
        const relatedTarget: EventTarget = event.relatedTarget;

        // Only hide if we've left the editor entirely
        if (relatedTarget instanceof Node && !this.editorView.dom.contains(relatedTarget)) {
            this.setCursor(null);
        }
    }

    /**
     * Routes drag-and-drop events to their appropriate handlers.
     *
     * @param name - The event name
     * @param event - The event object
     */
    private handleEvent(name: string, event: Event): void {
        switch (name) {
            case 'dragover':
                this.dragover(event as DragEvent);
                break;
            case 'dragend':
                this.dragend();
                break;
            case 'drop':
                this.drop();
                break;
            case 'dragleave':
                this.dragleave(event as DragEvent);
                break;
        }
    }
}
