import type {PmViewDesc} from '../view-desc/PmViewDesc';
import type {PmMouseDown} from './PmMouseDown';


export interface PmInputState {
    shiftKey: boolean;
    ctlKey: boolean;
    altKey: boolean;
    metaKey: boolean;
    mouseDown: PmMouseDown | null;
    lastKeyCode: number | null;
    lastKey: string | null;
    lastKeyCodeTime: number;
    lastClick: { time: number; x: number; y: number; type: string; button: number };
    lastSelectionOrigin: string | null;
    lastSelectionTime: number;
    lastIOSEnter: number;
    lastIOSEnterFallbackTimeout: number;
    lastFocus: number;
    lastTouch: number;
    lastChromeDelete: number;
    composing: boolean;
    compositionNode: Text | null;
    composingTimeout: number;
    compositionNodes: Array<PmViewDesc>;
    compositionEndedAt: number;
    compositionID: number;
    compositionPendingChanges: number;
    domChangeCount: number;
    hideSelectionGuard: (() => void) | null;
    lastEventType: string | null;

    /**
     * Initializes input handling for an editor view by registering all necessary
     * event handlers on the editor's DOM element.
     */
    initInput(): void;

    /**
     * Cleans up all input-related resources and event listeners when destroying a view.
     */
    destroyInput(): void;

    /**
     * Ensures that any custom event handlers defined via handleDOMEvents prop
     * are properly registered on the editor's DOM element.
     */
    ensureListeners(): void;

    /**
     * Dispatches a DOM event to the appropriate handler. First checks custom
     * handlers, then falls back to default handlers if the view is editable.
     * @param event - The DOM event to dispatch
     */
    dispatchEvent(event: Event): void;
}
