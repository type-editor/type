import type { PmEditorView } from '@type-editor/dropcursor';

/**
 * Represents an event listener registered on a DOM element.
 * Used to track listeners for proper cleanup.
 */
export interface PmDialogEventListener {
    /** The element (window or HTMLElement) that the listener is attached to */
    element: Window | HTMLElement;
    /** The type of event being listened to (e.g., 'click', 'keydown') */
    eventType: string;
    /** The event listener function */
    listener: EventListener;
}

/**
 * Configuration constants for the EditDialog.
 */
const DIALOG_CONFIG = {
    /** CSS class for the dialog element */
    CLASS_NAME: 'pm-dialog',
    /** ID for the close button */
    CLOSE_BUTTON_ID: 'pm-close-drop-zone',
    /** CSS class for the close button */
    CLOSE_BUTTON_CLASS: 'pm-close-btn',
    /** default CSS class for buttons */
    TAB_BUTTON_CLASS: 'pm-tab-btn',
    /** CSS class for menu rows */
    ROW_CLASS: 'pm-menu-row',
    /** CSS class for menu row end markers */
    ROW_END_CLASS: 'pm-menu-row-end',
    /** Top offset from editor in pixels */
    TOP_OFFSET: 10,
    /** Delay before cleanup in milliseconds */
    CLEANUP_DELAY: 100,
    /** ID prefix for dialog pages */
    DIALOG_PAGE_ID: 'pm-dialogpage',
    /** ID prefix for dialog page tabs */
    PAGE_TAB_ID: 'pm-dialogpagetab',
} as const;

/**
 * A utility class for creating and managing modal dialogs in the editor.
 * Provides a fluent API for building dialog content with rows and custom HTML.
 * Handles both native HTML dialog elements and fallback div elements for older browsers.
 *
 * @example
 * ```typescript
 * const dialog = new EditDialog();
 * dialog
 *   .addPage('Settings')
 *   .add('<h2>Edit Image</h2>')
 *   .addRow('<label>Width:</label><input type="text" id="width" />')
 *   .addRow('<label>Height:</label><input type="text" id="height" />')
 *   .open(editorView, 400, 300);
 * ```
 */
export class EditDialog {

    /** The dialog element (native dialog or fallback div) */
    private dialog: HTMLDialogElement | HTMLDivElement | null = null;

    /** Whether the browser supports native HTML dialog elements */
    private isDialogSupported = true;

    /** Tracks all event listeners for proper cleanup */
    private listeners: Array<PmDialogEventListener> = [];

    /** HTML content for each dialog page */
    private pages: Array<string> = [];

    /** Tab button HTML for each page */
    private tabs: Array<string> = [];

    /** Currently active page index (1-based) */
    private activePageIndex = 0;

    /**
     * Adds an event listener to a DOM element and tracks it for cleanup.
     * Supports element IDs, direct element references, or the string 'window'.
     *
     * If the element cannot be resolved, the listener will not be added and
     * a warning will be logged to the console.
     *
     * @param domElement - The element ID, element reference, or 'window' string
     * @param eventType - The event type to listen for (e.g., 'click', 'keydown')
     * @param listener - The event listener callback function
     * @throws {Error} If domElement is null or undefined
     */
    public addListener(domElement: string | HTMLElement,
                       eventType: string,
                       listener: EventListener): void {
        const element = this.resolveElement(domElement);

        if (!element) {
            const elementIdentifier = typeof domElement === 'string'
                ? domElement
                : domElement.tagName || 'HTMLElement';
            console.warn(`EditDialog: Unable to resolve element "${elementIdentifier}" for event "${eventType}"`);
            return;
        }

        element.addEventListener(eventType, listener);

        this.listeners.push({
            element,
            eventType,
            listener,
        });
    }

    /**
     * Opens the dialog in the editor view.
     * Creates the dialog element, positions it, and displays it as a modal (if supported).
     *
     * @param editorView - The ProseMirror editor view to attach the dialog to
     * @param width - The width of the dialog in pixels
     * @param height - The height of the dialog in pixels
     */
    public open(editorView: PmEditorView, width: number, height: number): void {
        // Close existing dialog if open
        if (this.dialog) {
            this.close(editorView);
        }

        this.createDialog(width, height);
        this.buildDialogContent();
        this.attachTabButtonHandlers();
        this.attachCloseHandler(editorView);
        this.showDialog();
        this.positionDialog(editorView);
    }

    /**
     * Closes the dialog and cleans up all event listeners.
     * Returns focus to the editor view.
     *
     * @param editorView - The ProseMirror editor view to return focus to
     */
    public close(editorView: PmEditorView): void {
        if (!this.dialog) {
            return;
        }

        this.hideDialog();
        editorView.focus();

        // Delay cleanup to allow animations to complete
        window.setTimeout((): void => {
            this.cleanup();
        }, DIALOG_CONFIG.CLEANUP_DELAY);
    }

    /**
     * Adds custom HTML content to the current dialog page.
     * Can be chained for fluent API usage.
     *
     * Automatically creates a default page if no page exists.
     *
     * @param content - The HTML content to add to the dialog
     * @returns The current EditDialog instance for chaining
     */
    public add(content: string): EditDialog {
        this.ensurePageExists();
        this.pages[this.activePageIndex - 1] += content;
        return this;
    }

    /**
     * Adds a content row to the dialog with proper wrapper elements.
     * Can be chained for fluent API usage.
     *
     * Automatically creates a default page if no page exists.
     *
     * @param content - The HTML content to add within the row
     * @returns The current EditDialog instance for chaining
     */
    public addRow(content: string): EditDialog {
        this.ensurePageExists();
        const pageIndex = this.activePageIndex - 1;
        this.pages[pageIndex] += `<div class="${DIALOG_CONFIG.ROW_CLASS}">${content}</div>`;
        this.pages[pageIndex] += `<div class="${DIALOG_CONFIG.ROW_END_CLASS}"></div>`;
        return this;
    }

    /**
     * Adds a new page to the dialog with a tab button.
     * Each page can contain different content and is accessible via tab navigation.
     * The first page added is automatically set as active.
     *
     * @param label - The label text for the tab button
     * @returns The current EditDialog instance for chaining
     */
    public addPage(label: string): EditDialog {
        this.activePageIndex += 1;
        this.pages.push('');

        const activeClass = this.activePageIndex === 1 ? ' active' : '';
        const tabButton = `<button id="${DIALOG_CONFIG.PAGE_TAB_ID}${this.activePageIndex}" title="${label}" class="${DIALOG_CONFIG.TAB_BUTTON_CLASS}${activeClass}">${label}</button>`;
        this.tabs.push(tabButton);

        return this;
    }

    /**
     * Ensures at least one page exists before adding content.
     * Creates a default page if the pages array is empty.
     *
     * @private
     */
    private ensurePageExists(): void {
        if (this.pages.length === 0) {
            this.pages.push('');
            this.activePageIndex = 1;
        }
    }

    /**
     * Resolves a DOM element from various input types.
     *
     * @param domElement - Element ID string, 'window' string, or HTMLElement
     * @returns The resolved Window or HTMLElement, or null if not found
     * @private
     */
    private resolveElement(domElement: string | HTMLElement): Window | HTMLElement | null {
        if (typeof domElement === 'string') {
            return domElement === 'window'
                ? window
                : document.getElementById(domElement);
        }
        return domElement;
    }

    /**
     * Creates the dialog element and sets its initial styles.
     *
     * @param width - The width of the dialog in pixels
     * @param height - The height of the dialog in pixels
     * @private
     */
    private createDialog(width: number, height: number): void {
        this.isDialogSupported = typeof HTMLDialogElement === 'function';

        const elementType = this.isDialogSupported ? 'dialog' : 'div';
        const element: HTMLDialogElement | HTMLDivElement = document.createElement(elementType);
        this.dialog = document.body.appendChild(element);

        this.dialog.classList.add(DIALOG_CONFIG.CLASS_NAME);
        this.dialog.style.width = `${width}px`;
        this.dialog.style.height = `${height}px`;
        this.dialog.style.visibility = 'hidden';
    }

    /**
     * Builds and sets the inner HTML content of the dialog.
     * Wraps user content and adds a close button for each page.
     * If multiple pages exist, also adds a tab bar for navigation.
     *
     * @private
     */
    private buildDialogContent(): void {
        if (!this.dialog) {
            return;
        }

        const pagesContent = this.buildPagesContent();
        const tabBar = this.buildTabBar();

        this.dialog.innerHTML = pagesContent + tabBar;
    }

    /**
     * Builds the HTML content for all dialog pages with their close buttons.
     * First page is visible by default, others are hidden.
     *
     * @returns The combined HTML string for all pages
     * @private
     */
    private buildPagesContent(): string {
        let content = '';

        for (let i = 0; i < this.pages.length; i++) {
            const pageNumber = i + 1;
            const isFirstPage = i === 0;
            const hiddenStyle = isFirstPage ? '' : ' style="display:none;"';

            const contentWrapper = `<div id="${DIALOG_CONFIG.DIALOG_PAGE_ID}${pageNumber}"${hiddenStyle}>${this.pages[i]}</div>`;
            // const closeButton = `<button id="${DIALOG_CONFIG.CLOSE_BUTTON_ID}${pageNumber}" class="${DIALOG_CONFIG.CLOSE_BUTTON_CLASS}" title="Close">Close</button>`;

            content += contentWrapper;
        }

        const closeButton = `<button id="${DIALOG_CONFIG.CLOSE_BUTTON_ID}" class="${DIALOG_CONFIG.CLOSE_BUTTON_CLASS}" title="Close">Close</button>`;
        content += closeButton;

        return content;
    }

    /**
     * Builds the tab bar HTML if multiple pages exist.
     *
     * @returns The tab bar HTML string, or empty string if only one page exists
     * @private
     */
    private buildTabBar(): string {
        if (this.pages.length <= 1) {
            return '';
        }

        const tabButtons = this.tabs.join('');
        return `<div id="pm-tab-bar" class="pm-tab-bar">${tabButtons}</div>`;
    }

    /**
     * Attaches the close button event handler for all pages.
     * Each page has its own close button that triggers the dialog close action.
     *
     * @param editorView - The ProseMirror editor view to return focus to upon closing
     * @private
     */
    private attachCloseHandler(editorView: PmEditorView): void {
        this.addListener(DIALOG_CONFIG.CLOSE_BUTTON_ID, 'click', (): void => {
            this.close(editorView);
        });
    }

    /**
     * Attaches click event handlers to all tab buttons for page navigation.
     * Each tab button switches the visible page and updates the active tab styling.
     *
     * @private
     */
    private attachTabButtonHandlers(): void {
        if (this.pages.length <= 1) {
            return;
        }

        let currentlyActivePage = 1;

        for (let i = 0; i < this.tabs.length; i++) {
            const targetPageNumber = i + 1;

            this.addListener(`${DIALOG_CONFIG.PAGE_TAB_ID}${targetPageNumber}`, 'click', (): void => {
                this.switchToPage(currentlyActivePage, targetPageNumber);
                currentlyActivePage = targetPageNumber;
            });
        }
    }

    /**
     * Switches the visible page from one to another, updating visibility and active states.
     *
     * @param fromPageNumber - The currently visible page number (1-based)
     * @param toPageNumber - The page number to switch to (1-based)
     * @private
     */
    private switchToPage(fromPageNumber: number, toPageNumber: number): void {
        const fromPage = document.getElementById(`${DIALOG_CONFIG.DIALOG_PAGE_ID}${fromPageNumber}`);
        const fromTab = document.getElementById(`${DIALOG_CONFIG.PAGE_TAB_ID}${fromPageNumber}`);
        const toPage = document.getElementById(`${DIALOG_CONFIG.DIALOG_PAGE_ID}${toPageNumber}`);
        const toTab = document.getElementById(`${DIALOG_CONFIG.PAGE_TAB_ID}${toPageNumber}`);

        if (fromPage && fromTab && toPage && toTab) {
            fromPage.style.display = 'none';
            fromTab.classList.remove('active');
            toPage.style.display = '';
            toTab.classList.add('active');
        }
    }

    /**
     * Positions the tab bar to the left of the dialog.
     * Only applies if multiple pages exist.
     *
     * @private
     */
    private positionTabBar(): void {
        if (this.pages.length <= 1) {
            return;
        }

        const tabBar: HTMLElement = document.getElementById('pm-tab-bar');
        if (tabBar) {
            tabBar.style.left = `${-(tabBar.offsetWidth)}px`;
        }
    }

    /**
     * Shows the dialog using the appropriate method based on browser support.
     * @private
     */
    private showDialog(): void {
        if (!this.dialog) {
            return;
        }

        if (this.isDialogSupported) {
            (this.dialog as HTMLDialogElement).showModal();
        }

        this.positionTabBar();
    }

    /**
     * Positions the dialog centered horizontally relative to the editor view.
     *
     * @param editorView - The ProseMirror editor view to position relative to
     * @private
     */
    private positionDialog(editorView: PmEditorView): void {
        if (!this.dialog) {
            return;
        }

        const topPosition = editorView.dom.offsetTop + DIALOG_CONFIG.TOP_OFFSET;
        const centerX = editorView.dom.offsetLeft + editorView.dom.offsetWidth / 2;
        const leftPosition = Math.max(0, centerX - this.dialog.offsetWidth / 2);

        this.dialog.style.top = `${topPosition}px`;
        this.dialog.style.left = `${leftPosition}px`;
        this.dialog.style.visibility = 'visible';
    }

    /**
     * Hides the dialog using the appropriate method based on browser support.
     * @private
     */
    private hideDialog(): void {
        if (!this.dialog) {
            return;
        }

        if (this.isDialogSupported) {
            (this.dialog as HTMLDialogElement).close();
        } else {
            this.dialog.style.display = 'none';
        }
    }

    /**
     * Removes all registered event listeners.
     * @private
     */
    private removeAllListeners(): void {
        for (const { element, eventType, listener } of this.listeners) {
            element.removeEventListener(eventType, listener);
        }
        this.listeners = [];
    }

    /**
     * Performs cleanup by removing listeners and the dialog element from the DOM.
     * @private
     */
    private cleanup(): void {
        this.removeAllListeners();

        if (this.dialog) {
            this.dialog.remove();
            this.dialog = null;
        }
    }
}
