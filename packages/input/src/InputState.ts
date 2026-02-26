import {browser, DOCUMENT_FRAGMENT_NODE} from '@type-editor/commons';
import type {PmEditorView, PmInputState} from '@type-editor/editor-types';
import type {ViewDesc} from '@type-editor/viewdesc';

import type {EventHandler} from './types/input/EventHandler';
import {beforeInputHandler} from './input-handler/before-input/before-input-handler';
import {COMPOSITION_ENDED_INITIAL} from './input-handler/compositon-constants';
import {contextMenuHandler} from './input-handler/context-menu/context-menu-handler';
import {copyHandler} from './input-handler/copy-paste/copy-handler';
import {pasteHandler} from './input-handler/copy-paste/paste-handler';
import {dragEndHandler} from './input-handler/drag-drop/drag-end-handler';
import {dragOverEnterHandler} from './input-handler/drag-drop/drag-over-enter-handler';
import {dragStartHandler} from './input-handler/drag-drop/drag-start-handler';
import {dropHandler} from './input-handler/drag-drop/drop-handler';
import {blurHandler} from './input-handler/focus/blur-handler';
import {focusHandler} from './input-handler/focus/focus-handler';
import {compositionEndHandler} from './input-handler/keyboard/composition-end-handler';
import {compositionStartUpdateHandler} from './input-handler/keyboard/composition-start-update-handler';
import {keyDownHandler} from './input-handler/keyboard/key-down-handler';
import {keyPressHandler} from './input-handler/keyboard/key-press-handler';
import {keyUpHandler} from './input-handler/keyboard/key-up-handler';
import {mouseDownHandler} from './input-handler/mouse/mouse-down-handler';
import type {MouseDown} from './input-handler/mouse/MouseDown';
import {touchMoveHandler} from './input-handler/touch/touch-move-handler';
import {touchStartHandler} from './input-handler/touch/touch-start-handler';


/**
 * Tracks the current input state of the editor, including keyboard, mouse,
 * composition events, and selection state.
 */
export class InputState implements PmInputState {

    private static readonly INPUT_HANDLER: ReadonlyMap<string, EventHandler<Event>> = new Map<string, EventHandler<Event>>([
        ['copy', copyHandler],
        ['mousedown', mouseDownHandler],
        ['touchstart', touchStartHandler],
        ['touchmove', touchMoveHandler],
        ['contextmenu', contextMenuHandler],
        ['beforeinput', beforeInputHandler],
        ['focus', focusHandler],
        ['blur', blurHandler],
        ['dragstart', dragStartHandler],
        ['dragend', dragEndHandler]
    ]);

    /**
     * Handlers that only run when editor is editable
     */
    private static readonly INPUT_EDIT_HANDLER: ReadonlyMap<string, EventHandler<Event>> = new Map<string, EventHandler<Event>>([
        ['keydown', keyDownHandler],
        ['keypress', keyPressHandler],
        ['keyup', keyUpHandler],
        ['cut', copyHandler],
        ['paste', pasteHandler],
        ['compositionstart', compositionStartUpdateHandler],
        ['compositionupdate', compositionStartUpdateHandler],
        ['compositionend', compositionEndHandler],
        ['dragover', dragOverEnterHandler],
        ['dragenter', dragOverEnterHandler],
        ['drop', dropHandler]
    ]);

    /**
     * All event handlers (including edit handlers)
     */
    private static readonly ALL_INPUT_HANDLER: ReadonlyMap<string, EventHandler<Event>> = new Map<string, EventHandler<Event>>([
        ...InputState.INPUT_HANDLER,
        ...InputState.INPUT_EDIT_HANDLER
    ]);

    /**
     * Events that use passive listeners
     */
    private static readonly PASSIVE_HANDLER_TOUCHSTART = 'touchstart';
    private static readonly PASSIVE_HANDLER_TOUCHMOVE = 'touchmove';

    private readonly view: PmEditorView;
    /** Map of event types to their handler functions */
    private readonly eventHandlers: Record<string, (event: Event) => boolean> = {};


    /** Whether the Shift key is currently pressed */
    public shiftKey = false;
    public ctlKey = false;
    public altKey = false;
    public metaKey = false;
    /** Current mouse down operation, if any */
    public mouseDown: MouseDown | null = null;
    /** The last key code that was pressed */
    /** @deprecated('Use lastKey instead') */
    public lastKeyCode: number | null = null;
    /** The last key that was pressed */
    public lastKey: string | null = null;
    /** Timestamp of the last keydown event */
    public lastKeyCodeTime = 0;
    /** Information about the last click event for double/triple click detection */
    public lastClick = {time: 0, x: 0, y: 0, type: '', button: 0};
    /** Origin of the last selection change (e.g., 'key', 'pointer') */
    public lastSelectionOrigin: string | null = null;
    /** Timestamp of the last selection change */
    public lastSelectionTime = 0;
    /** Timestamp of last Enter key press on iOS */
    public lastIOSEnter = 0;
    /** Timeout ID for iOS Enter key fallback handling */
    public lastIOSEnterFallbackTimeout = -1;
    /** Timestamp of last focus event */
    public lastFocus = 0;
    /** Timestamp of last touch event */
    public lastTouch = 0;
    /** Timestamp of last Chrome delete operation */
    public lastChromeDelete = 0;
    /** Whether composition is currently in progress */
    public composing = false;
    /** The DOM text node currently being composed in */
    public compositionNode: Text | null = null;
    /** Timeout ID for composition end detection */
    public composingTimeout = -1;
    /** List of view descriptors affected by current composition */
    public readonly compositionNodes: Array<ViewDesc> = [];
    /** Timestamp when composition ended (initialized to very negative value) */
    public compositionEndedAt = COMPOSITION_ENDED_INITIAL;
    /** Incrementing ID for tracking composition sessions */
    public compositionID = 1;
    /** Set to a composition ID when there are pending changes at compositionend */
    public compositionPendingChanges = 0;
    /** Counter for DOM changes, used to detect when changes occur */
    public domChangeCount = 0;
    /** Function to call to remove the selection hiding guard */
    public hideSelectionGuard: (() => void) | null = null;
    /** The type of the last event processed */
    public lastEventType: string | null = null;

    public constructor(view: PmEditorView) {
        this.view = view;
    }

    /**
     * Initializes input handling for an editor view by registering all necessary
     * event handlers on the editor's DOM element.
     */
    public initInput(): void {
        InputState.ALL_INPUT_HANDLER.forEach((handler: EventHandler<Event>, eventName: string): void => {
            const eventHandler = (event: Event): boolean => {
                this.lastEventType = event.type;

                // Only process events that belong to this view, haven't been handled by custom
                // handlers, and respect editability (some handlers only work in editable mode)
                if (this.eventBelongsToView(event)
                    && !this.runCustomHandler(event)
                    && (this.view.editable || !(InputState.INPUT_EDIT_HANDLER.has(event.type)))) {
                    return !!handler(this.view, event);
                }
                return false;
            };

            // Touch events use passive listeners for better scroll performance
            // (allows the browser to scroll immediately without waiting for preventDefault checks)
            const passiveArg: {
                passive: boolean
            } = eventName === InputState.PASSIVE_HANDLER_TOUCHSTART || eventName === InputState.PASSIVE_HANDLER_TOUCHMOVE
                ? {passive: true} : undefined;

            this.eventHandlers[eventName] = eventHandler;
            this.view.dom.addEventListener(eventName, eventHandler, passiveArg);
        });

        // Safari workaround: adding a no-op input event handler prevents an issue where
        // composition text vanishes when pressing Enter
        if (browser.safari) {
            this.view.dom.addEventListener('input', () => null);
        }

        this.ensureListeners();
    }

    /**
     * Cleans up all input-related resources and event listeners when destroying a view.
     */
    public destroyInput(): void {
        this.view.domObserver.stop();
        for (const type in this.eventHandlers) {
            this.view.dom.removeEventListener(type, this.eventHandlers[type]);
        }
        clearTimeout(this.composingTimeout);
        clearTimeout(this.lastIOSEnterFallbackTimeout);
    }

    /**
     * Ensures that any custom event handlers defined via handleDOMEvents prop
     * are properly registered on the editor's DOM element.
     */
    public ensureListeners(): void {
        this.view.someProp('handleDOMEvents', currentHandlers => {
            for (const type in currentHandlers) {
                if (!this.eventHandlers[type]) {
                    const eventHandler = (event: Event): boolean => {
                        return this.runCustomHandler(event);
                    };

                    this.eventHandlers[type] = eventHandler;
                    this.view.dom.addEventListener(type, eventHandler);
                }
            }
        });
    }

    /**
     * Dispatches a DOM event to the appropriate handler. First checks custom
     * handlers, then falls back to default handlers if the view is editable.
     * @param event - The DOM event to dispatch
     */
    public dispatchEvent(event: Event): void {
        if (!this.runCustomHandler(event)
            && InputState.ALL_INPUT_HANDLER.has(event.type)
            && (this.view.editable || !(InputState.INPUT_EDIT_HANDLER.has(event.type)))) {

            InputState.ALL_INPUT_HANDLER.get(event.type)(this.view, event);
        }
    }

    /**
     * Runs custom DOM event handlers defined by plugins or props.
     * @param event - The DOM event to handle
     * @returns True if the event was handled and should not propagate
     */
    private runCustomHandler(event: Event): boolean {
        return this.view.someProp('handleDOMEvents', handlers => {
            const handler: EventHandler<Event> = handlers[event.type];
            if (handler) {
                if (handler(this.view, event)) {
                    return true;
                }
                return event.defaultPrevented;
            }
            return false;
        });
    }

    /**
     * Determines whether a DOM event originated from within the editor view
     * and should be processed by it. Checks event propagation and whether
     * any ancestor view descriptors want to stop the event.
     * @param event - The DOM event to check
     * @returns True if the event belongs to this view
     */
    private eventBelongsToView(event: Event): boolean {
        // Non-bubbling events always belong to their target
        if (!event.bubbles) {
            return true;
        }

        // If already handled via preventDefault, don't process
        if (event.defaultPrevented) {
            return false;
        }

        // Walk up the DOM tree from event target to editor root
        let node: Node = event.target as Node;
        while (node !== this.view.dom) {
            // Stop if we hit a document fragment (nodeType 11) or null
            if (!node || node.nodeType === DOCUMENT_FRAGMENT_NODE || (node.pmViewDesc?.stopEvent(event))) {
                return false;
            }
            node = node.parentNode;
        }

        return true;
    }
}
