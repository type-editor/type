import {browser} from '@type-editor/commons';
import type { PmEditorState, PmEditorView, PmSelection } from '@type-editor/editor-types';

import {cssClassProsemirrorMenubar} from '../css-classes';
import type {MenuBarOptions} from '../types/MenuBarOptions';
import {renderGrouped} from './render-grouped';
import {createHtmlElement} from './util/create-html-element';
import { WcagKeyNavUtil } from './WcagKeyNavUtil';
import type { PmNode } from '@type-editor/model';


/**
 * View class that manages the menu bar display and behavior.
 *
 * Handles DOM structure, floating behavior, scroll events, and menu updates.
 * The menu bar can float at the top of the viewport when scrolling, and
 * automatically adjusts its position and visibility.
 */
export class MenuBarView {

    /**
     * Minimum vertical clearance needed when floating menu is active (in pixels).
     * This ensures there's enough space for the menu to float without overlapping content.
     */
    private static readonly MIN_VERTICAL_CLEARANCE = 10;

    /** The wrapper element containing both the menu and editor */
    private readonly wrapper: HTMLElement;

    /** The menu bar element itself */
    private readonly menu: HTMLElement;

    /** Handler for scroll events (null if floating is disabled) */
    private readonly scrollHandler: ((event: Event) => void) | null = null;

    /** Reference to the ProseMirror editor view */
    private readonly editorView: PmEditorView;

    /** Configuration options passed to the plugin */
    private readonly options: MenuBarOptions;

    /** Spacer element used when menu is floating to prevent content jump */
    private spacer: HTMLElement | null = null;

    /** Maximum observed height of the menu */
    private maxHeight = 0;

    /** Width at which maxHeight was measured */
    private widthForMaxHeight = 0;

    /** Whether the menu is currently in floating mode */
    private floating = false;

    /** Function to update menu content based on editor state */
    private contentUpdate: (state: PmEditorState) => boolean;

    /** The document or shadow root containing the editor */
    private root: Document | ShadowRoot;

    /** List of elements that have scroll listeners attached */
    private scrollListeners: Array<Node | Window> = [];

    /** Cached menu height for performance optimization */
    private cachedMenuHeight = 0;

    private previousDoc: PmNode | null = null;
    private previousSelection: PmSelection | null = null;
    private timer: number | null = null;

    /**
     * Creates a new MenuBarView instance.
     *
     * Sets up the DOM structure, initializes the menu content, and
     * optionally configures floating behavior with scroll listeners.
     *
     * @param editorView - The ProseMirror editor view
     * @param options - Menu bar configuration options
     */
    constructor (editorView: PmEditorView,
                 options: MenuBarOptions) {
        this.editorView = editorView;
        this.options = options;
        this.root = editorView.root;
        this.wrapper = createHtmlElement('div', { class: cssClassProsemirrorMenubar + '-wrapper' });
        this.menu = this.wrapper.appendChild(createHtmlElement('div', { class: cssClassProsemirrorMenubar }));
        this.menu.className = cssClassProsemirrorMenubar;
        this.menu.role = 'toolbar';
        this.menu.ariaLabel = 'Text formatting options';
        this.menu.ariaControlsElements = [this.editorView.dom];
        this.menu.tabIndex = 0;


        if (editorView.dom.parentNode) {
            editorView.dom.parentNode.replaceChild(this.wrapper, editorView.dom);
        }
        this.wrapper.appendChild(editorView.dom);

        const items = renderGrouped(this.editorView, this.options.content, this.options.showLabel, this.options.isLegacy);

        if(items) {
            const { dom, update, menuItems } = items;
            this.contentUpdate = update;
            this.menu.appendChild(dom);
            this.update();

            const wcagKeyNavUtil = new WcagKeyNavUtil(this.menu, menuItems);
            wcagKeyNavUtil.addArrowKeyNavigation();

            if (options.floating && !browser.ios) {
                this.updateFloat();
                const potentialScrollers: Array<Node | Window> = this.getAllWrapping(this.wrapper);
                this.scrollListeners = potentialScrollers;

                this.scrollHandler = (e: Event): void => {
                    const root: Document | ShadowRoot = this.editorView.root;
                    if (!((root as Document).body || root).contains(this.wrapper)) {
                        this.removeScrollListeners();
                    } else {
                        const target = e.target as HTMLElement;
                        this.updateFloat(target && typeof target.getBoundingClientRect === 'function' ? target : undefined);
                    }
                };
                potentialScrollers.forEach((element: Node | Window): void => {
                    element.addEventListener('scroll', this.scrollHandler);
                });
            }
        }
    }


    /**
     * Updates the menu bar content and layout.
     *
     * This method is called by ProseMirror on editor state changes.
     * It handles:
     * - Rebuilding menu content if the root document has changed
     * - Updating menu item states based on current editor state
     * - Managing menu height to prevent layout shifts
     * - Scrolling the cursor into view when menu is floating
     */
    public update(): void {
        // Rebuild menu if root document changed (e.g., shadow DOM updates)
        if (this.editorView.root !== this.root) {
            const items = renderGrouped(this.editorView, this.options.content, this.options.showLabel);
            if (items) {
                const { dom, update } = items;
                this.contentUpdate = update;
                if (this.menu.firstChild) {
                    this.menu.replaceChild(dom, this.menu.firstChild);
                }
                this.root = this.editorView.root;
            }
        }

        // Handle menu updates during keyboard input delayed
        this.setKeyInputWaitState();

        // Update menu only if document or selection has changed
        if(this.ignoreUpdate()) {
            return;
        }


        // Update menu item states
        // Allow other processes to complete first
        window.setTimeout(() => this.contentUpdate(this.editorView.state), 10);

        if (this.floating) {
            this.updateScrollCursor();
        } else {
            // Track and maintain maximum menu height to prevent layout shifts
            if (this.menu.offsetWidth !== this.widthForMaxHeight) {
                this.widthForMaxHeight = this.menu.offsetWidth;
                this.maxHeight = 0;
            }

            if (this.menu.offsetHeight > this.maxHeight) {
                this.maxHeight = this.menu.offsetHeight;
                this.menu.style.minHeight = `${this.maxHeight}px`;
            }
        }
    }

    /**
     * Delays menu updates during keyboard input to improve performance.
     *
     * When the user is actively typing (beforeinput event), this method debounces
     * the menu content update by 800ms to avoid excessive re-renders. Each new
     * keyboard input resets the timer, ensuring the menu only updates after the
     * user pauses typing.
     */
    private setKeyInputWaitState(): void {
        if(this.editorView.input.lastEventType === 'beforeinput') {
            if(this.timer) {
                window.clearTimeout(this.timer);
                this.timer = null;
            }

            this.timer = window.setTimeout((): void => {
                this.timer = null;
                // Update menu item states
                this.contentUpdate(this.editorView.state);
            }, 800);
        }
    }

    /**
     * Determines whether the current update should be skipped.
     *
     * This method optimizes menu updates by checking if meaningful changes have occurred
     * in the editor state. It returns true (skip update) when:
     * - Neither the document nor selection has changed
     * - The update was triggered by keyboard events (keyup, keypress, beforeinput)
     *   which are handled with a delay by {@link setKeyInputWaitState}
     *
     * When changes are detected, it updates the cached previous state and clears
     * any pending delayed update timer.
     *
     * @returns true if the update should be skipped, false if it should proceed
     */
    private ignoreUpdate(): boolean {
        const currentDoc: PmNode = this.editorView.state.doc;
        const currentSelection: PmSelection = this.editorView.state.selection;

        const docChanged = this.previousDoc !== currentDoc && !this.previousDoc?.eq(currentDoc);
        const selectionChanged = this.previousSelection !== currentSelection && !this.previousSelection?.eq(currentSelection);

        if (docChanged || selectionChanged) {
            this.previousDoc = currentDoc;
            this.previousSelection = currentSelection;
        } else {
            // No changes detected; skip update
            return true;
        }

        // Ignore some keyboard input as it is handled delayed with `setKeyInputWaitState()`
        if(this.editorView.input.lastEventType === 'keyup'
            || this.editorView.input.lastEventType === 'keypress'
            || this.editorView.input.lastEventType === 'beforeinput') {
            return true;
        }

        if(this.timer) {
            window.clearTimeout(this.timer);
            this.timer = null;
        }

        return false;
    }

    /**
     * Ensures the cursor remains visible when the floating menu might obscure it.
     *
     * When the menu is floating, it may cover the cursor position. This method
     * detects when the cursor is behind the menu and scrolls the viewport to
     * make it visible again.
     */
    private updateScrollCursor(): void {
        const selection: Selection | null = (this.editorView.root as Document).getSelection();
        if (!selection?.focusNode || selection.rangeCount === 0) {
            return;
        }

        const rects: DOMRectList = selection.getRangeAt(0).getClientRects();
        if (rects.length === 0) {
            return;
        }

        const selRect: DOMRect = rects[this.selectionIsInverted(selection) ? 0 : rects.length - 1];
        if (!selRect) {
            return;
        }

        const menuRect: DOMRect = this.menu.getBoundingClientRect();

        // Check if cursor is obscured by the floating menu
        if (selRect.top < menuRect.bottom && selRect.bottom > menuRect.top) {
            const scrollable: HTMLElement | null = this.findWrappingScrollable(this.wrapper);
            if (scrollable) {
                scrollable.scrollTop -= (menuRect.bottom - selRect.top);
            }
        }
    }

    /**
     * Updates the floating state of the menu based on scroll position.
     *
     * Determines whether the menu should be in floating mode (fixed position)
     * or normal mode based on the editor's scroll position. When floating,
     * the menu sticks to the top of the viewport. When not floating, it
     * scrolls naturally with the editor content.
     *
     * @param scrollAncestor - Optional element that triggered the scroll event
     */
    private updateFloat(scrollAncestor?: HTMLElement): void {
        const parent: HTMLElement = this.wrapper;
        const editorRect: DOMRect = parent.getBoundingClientRect();
        const top: number = scrollAncestor ? Math.max(0, scrollAncestor.getBoundingClientRect().top) : 0;

        if (this.floating) {
            this.handleFloatingMode(editorRect, top, parent);
        } else {
            this.handleNormalMode(editorRect, top, parent);
        }
    }

    /**
     * Handles menu behavior when already in floating mode.
     *
     * Checks if conditions still warrant floating mode, and if not,
     * reverts to normal positioning.
     *
     * @param editorRect - Bounding rectangle of the editor wrapper
     * @param top - Top position for floating menu
     * @param parent - The wrapper element
     */
    private handleFloatingMode(editorRect: DOMRect,
                               top: number,
                               parent: HTMLElement): void {
        // Use cached height to avoid layout recalculation
        const menuHeight = this.cachedMenuHeight || this.menu.offsetHeight;
        const shouldStopFloating =
            editorRect.top >= top
            || editorRect.bottom < menuHeight + MenuBarView.MIN_VERTICAL_CLEARANCE;

        if (shouldStopFloating) {
            this.disableFloating();
        } else {
            this.updateFloatingPosition(editorRect, top, parent);
        }
    }

    /**
     * Handles menu behavior when in normal (non-floating) mode.
     *
     * Checks if conditions warrant switching to floating mode, and if so,
     * enables it.
     *
     * @param editorRect - Bounding rectangle of the editor wrapper
     * @param top - Top position for floating menu
     * @param parent - The wrapper element
     */
    private handleNormalMode(editorRect: DOMRect,
                             top: number,
                             parent: HTMLElement): void {
        const shouldStartFloating: boolean =
            editorRect.top < top
            && editorRect.bottom >= this.menu.offsetHeight + MenuBarView.MIN_VERTICAL_CLEARANCE;

        if (shouldStartFloating) {
            this.enableFloating(parent, top);
        }
    }

    /**
     * Disables floating mode and restores normal menu positioning.
     */
    private disableFloating(): void {
        this.floating = false;
        this.cachedMenuHeight = 0; // Clear cache when exiting floating mode

        // Reset all floating-related styles
        this.menu.style.position = '';
        this.menu.style.left = '';
        this.menu.style.top = '';
        this.menu.style.width = '';
        this.menu.style.display = '';

        // Remove spacer element if it exists
        if (this.spacer?.parentNode) {
            this.spacer.parentNode.removeChild(this.spacer);
            this.spacer = null;
        }
    }

    /**
     * Enables floating mode and sets up the menu in fixed position.
     *
     * @param parent - The wrapper element
     * @param top - Top position for floating menu
     */
    private enableFloating(parent: HTMLElement, top: number): void {
        this.floating = true;
        const menuRect: DOMRect = this.menu.getBoundingClientRect();

        // Cache the menu height for performance
        this.cachedMenuHeight = menuRect.height;

        // Set fixed position with current dimensions
        this.menu.style.position = 'fixed';
        this.menu.style.left = `${menuRect.left}px`;
        this.menu.style.width = `${menuRect.width}px`;
        this.menu.style.top = `${top}px`;

        // Insert spacer to prevent layout shift
        this.spacer = createHtmlElement(
            'div',
            {
                class: `${cssClassProsemirrorMenubar}-spacer`,
                style: `height: ${menuRect.height}px`
            }
        );
        parent.insertBefore(this.spacer, this.menu);
    }

    /**
     * Updates the position of the menu while in floating mode.
     *
     * Adjusts the menu's position and visibility based on scroll position
     * and viewport boundaries.
     *
     * @param editorRect - Bounding rectangle of the editor wrapper
     * @param top - Top position for floating menu
     * @param parent - The wrapper element
     */
    private updateFloatingPosition(editorRect: DOMRect, top: number, parent: HTMLElement): void {
        const border: number = (parent.offsetWidth - parent.clientWidth) / 2;
        this.menu.style.left = `${editorRect.left + border}px`;

        // Hide menu if editor is scrolled completely out of view
        const defaultView: Window = this.editorView.dom.ownerDocument.defaultView || window;
        const isOutsideWindow = editorRect.top > defaultView.innerHeight;
        this.menu.style.display = isOutsideWindow ? 'none' : '';

        this.menu.style.top = `${top}px`;
    }

    /**
     * Removes scroll event listeners from all registered elements.
     */
    private removeScrollListeners(): void {
        if (this.scrollHandler) {
            const handler = this.scrollHandler;
            this.scrollListeners.forEach((element: Node | Window): void => {
                element.removeEventListener('scroll', handler);
            });
            this.scrollListeners = [];
        }
    }

    /**
     * Cleans up the menu bar view when the plugin is destroyed.
     *
     * Restores the original DOM structure by removing the wrapper element
     * and placing the editor DOM back in its original location.
     * Also removes all event listeners to prevent memory leaks.
     */
    public destroy(): void {
        // Remove scroll event listeners first
        this.removeScrollListeners();

        // Restore original DOM structure
        if (this.wrapper.parentNode) {
            this.wrapper.parentNode.replaceChild(this.editorView.dom, this.wrapper);
        }
    }

    /**
     * Determines whether a DOM Selection's direction is inverted.
     *
     * A selection is considered inverted when the anchor (start point) comes
     * after the focus (end point) in document order. This is not completely
     * precise but works well enough for practical purposes.
     *
     * @param selection - The DOM Selection to check
     * @returns true if the selection is inverted (anchor after focus), false otherwise
     */
    private selectionIsInverted(selection: Selection): boolean {
        if (!selection.anchorNode || !selection.focusNode) {
            return false;
        }
        if (selection.anchorNode === selection.focusNode) {
            return selection.anchorOffset > selection.focusOffset;
        }
        return selection.anchorNode.compareDocumentPosition(selection.focusNode) === Node.DOCUMENT_POSITION_FOLLOWING;
    }

    /**
     * Finds the nearest ancestor element that has scrollable content.
     *
     * Traverses up the DOM tree from the given node to find the first
     * element whose scroll height exceeds its client height, indicating
     * it has scrollable overflow.
     *
     * @param node - The starting node to search from
     * @returns The first scrollable ancestor element, or undefined if none found
     */
    private findWrappingScrollable(node: Node): HTMLElement | undefined {
        for (let cur: ParentNode | null = node.parentNode; cur; cur = cur.parentNode) {
            if (cur instanceof HTMLElement && cur.scrollHeight > cur.clientHeight) {
                return cur;
            }
        }
        return undefined;
    }

    /**
     * Gets all ancestor elements and the window for a given node.
     *
     * Returns an array containing the window and all parent elements
     * up the DOM tree. This is useful for attaching scroll listeners
     * to all potential scroll containers.
     *
     * @param node - The node whose ancestors to collect
     * @returns Array containing the window and all ancestor nodes
     */
    private getAllWrapping(node: Node): Array<Node | Window> {
        const res: Array<Node | Window> = [node.ownerDocument.defaultView || window];
        for (let cur: ParentNode | null = node.parentNode; cur; cur = cur.parentNode) {
            res.push(cur);
        }
        return res;
    }

}
