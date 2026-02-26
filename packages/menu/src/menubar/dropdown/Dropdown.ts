import type { PmEditorView } from '@type-editor/editor-types';
import type { EditorState } from '@type-editor/state';

import { cssClassProsemirrorMenu } from '../../css-classes';
import type { DropdownMenuOptions } from '../../types/DropdownMenuOptions';
import type { MenuElement } from '../../types/MenuElement';
import { translate } from '../../util/translate';
import { combineUpdates } from '../util/combine-updates';
import { createHtmlElement } from '../util/create-html-element';
import { WcagKeyNavUtil } from '../WcagKeyNavUtil';
import type { ParentMenuElement } from '../../types/ParentMenuElement';
import type { MenuItemSpec } from '../../types/MenuItemSpec';

/**
 * A drop-down menu, displayed as a label with a downwards-pointing
 * triangle to the right of it.
 */
export class Dropdown implements MenuElement, ParentMenuElement {

    protected readonly items: ReadonlyArray<MenuElement>;
    private readonly _options: DropdownMenuOptions;
    private dropDownButton: HTMLElement | null = null;
    private subMenu: HTMLElement | null = null;
    private subMenuItems: Array<HTMLElement> = [];
    private isSubMenuInitialized = false;
    private editorView: PmEditorView | null = null;
    private label = '';

    // Event listener references for cleanup
    private winCloseFunc: (() => boolean) | null = null;
    private clickListener: ((event: MouseEvent) => void) | null = null;
    private subMenuKeyDownListener: ((event: KeyboardEvent) => void) | null = null;

    // Cached references
    private wcagKeyNavUtil: WcagKeyNavUtil | null = null;
    private cachedWindow: Window | null = null;


    /**
     * Create a dropdown wrapping the elements.
     *
     * @param content - A single menu element or array of menu elements to display in the dropdown
     * @param options - Configuration options for the dropdown appearance and behavior
     */
    constructor(content: ReadonlyArray<MenuElement> | MenuElement,
                options: DropdownMenuOptions = {}) {
        this.items = Array.isArray(content) ? content : [content];
        this._options = options;
    }

    get content(): ReadonlyArray<MenuElement> {
        return this.items;
    }

    get options(): DropdownMenuOptions {
        return this._options;
    }

    /**
     * Render the dropdown menu and sub-items.
     *
     * @param editorView - The editor view instance
     * @returns An object containing the DOM element and an update function
     */
    public render(editorView: PmEditorView) {
        // Clean up any previous render to prevent memory leaks
        this.destroy();

        // Cache the window reference
        this.cachedWindow = editorView.dom.ownerDocument.defaultView ?? window;

        // Create submenu
        const subMenu = this.renderDropdownItems(editorView, this._options);

        if(!subMenu) {
            return null;
        }

        this.subMenu = subMenu.dom;
        this.subMenuItems = subMenu.domList;

        this.wcagKeyNavUtil = new WcagKeyNavUtil(this.subMenu, this.subMenuItems, false);

        // Create dropdown button that is visible in the menu bar
        this.dropDownButton = this.createDropdownButton(editorView);

        // Store event listener references for cleanup

        // Click listener to open
        this.clickListener = (event: MouseEvent): void => {
            this.openDropDown(event);
        };
        this.dropDownButton.addEventListener('click', this.clickListener);

        // Listener (ESC) to close dropdown
        this.subMenuKeyDownListener = (event: KeyboardEvent): void => {
            event.preventDefault();
            event.stopPropagation();

            if (event.key === 'Escape') {
                if (this.subMenu) {
                    this.subMenu.style.display = 'none';
                }
                this.dropDownButton?.focus();
                this.removeWindowCloseListener();
            }
        };
        this.subMenu.addEventListener('keydown', this.subMenuKeyDownListener);


        const update = (state: EditorState): boolean => {
            // Add submenu to DOM on first open
            if (!this.isSubMenuInitialized) {
                this.appendSubMenu(editorView);
            }

            // Reset label on update (see notifySubElementIsActive())
            this.dropDownButton.innerText = this.label;

            const inner: boolean = subMenu.update(state);
            if (this.dropDownButton) {
                // Hide dropdown button if no inner items are enabled
                this.dropDownButton.style.display = inner ? '' : 'none';
            }
            return inner;
        };

        return {
            dom: this.dropDownButton,
            update,
        };
    }

    public notifySubElementIsActive(menuItemSpec: MenuItemSpec): void {
        if(this.options.static) {
            return;
        }

        if (menuItemSpec.label && this.editorView) {
            this.dropDownButton.innerText = translate(this.editorView, menuItemSpec.label);
        } else if (menuItemSpec.label) {
            this.dropDownButton.innerText = menuItemSpec.label;
        } else {
            this.dropDownButton.innerText = this.label;
        }
    }

    /**
     * Clean up event listeners and references to prevent memory leaks.
     * Should be called when the dropdown is no longer needed.
     */
    public destroy(): void {
        // Remove event listeners from dropdown button
        if (this.dropDownButton && this.clickListener) {
            this.dropDownButton.removeEventListener('click', this.clickListener);
            this.clickListener = null;
        }

        // Remove event listeners from submenu
        if (this.subMenu && this.subMenuKeyDownListener) {
            this.subMenu.removeEventListener('keydown', this.subMenuKeyDownListener);
            this.subMenuKeyDownListener = null;
        }

        // Remove window event listener
        this.removeWindowCloseListener();

        // Clean up WcagKeyNavUtil
        if (this.wcagKeyNavUtil) {
            this.wcagKeyNavUtil.destroy();
            this.wcagKeyNavUtil = null;
        }

        // Clear references
        this.dropDownButton = null;
        this.subMenu = null;
        this.subMenuItems = [];
        this.cachedWindow = null;
        this.isSubMenuInitialized = false;
    }

    /**
     * Renders an array of menu elements as dropdown items.
     *
     * @param view - The editor view instance
     * @param options - Configuration options for the dropdown appearance and behavior
     * @returns An object containing rendered DOM elements and a combined update function
     */
    private renderDropdownItems(view: PmEditorView,
                                options: DropdownMenuOptions = {}) {
        const rendered: Array<HTMLElement> = [];
        const subMenuItems: Array<HTMLElement> = [];
        const updates: Array<(state: EditorState) => boolean> = [];

        // Submenu list container
        const dropdownList: HTMLElement = createHtmlElement('ul', {
            role: 'menu',
            tabindex: -1,
            style: 'display: none;',
            class: cssClassProsemirrorMenu + '-dropdown-menu ' + (options.class || ''),
        });

        for (const item of this.items) {
            const { dom, update } = item.render(view, options.showLabel, false, this);
            if(!dom) {
                continue;
            }

            subMenuItems.push(dom);

            // Create dropdown using html list (<ul>)
            const dropdownListItem: HTMLElement = createHtmlElement('li', {
                class: cssClassProsemirrorMenu + '-dropdown-item',
                tabindex: -1,
                role: 'menuitem',
            }, dom);
            dropdownList.appendChild(dropdownListItem);
            rendered.push(dropdownListItem);

            updates.push(update);
        }

        return subMenuItems.length ? {
            dom: dropdownList,
            update: combineUpdates(updates, rendered),
            domList: subMenuItems,
        } : null;
    }

    private createDropdownButton(editorView: PmEditorView): HTMLElement {
        this.label = translate(editorView, this._options.title);
        return createHtmlElement(
            'button',
            {
                class: cssClassProsemirrorMenu + '-dropdown-wrap',
                tabindex: '-1',
            },
            this.label);
    }

    /**
     * Append the menu items to the DOM.
     *
     * @internal
     * @param editorView
     */
    private appendSubMenu(editorView: PmEditorView): void {

        const parent = this.dropDownButton.parentElement;

        // Should not happen, silently ignore
        if (!parent || !this.subMenu) {
            return;
        }

        parent.appendChild(this.subMenu);
        this.isSubMenuInitialized = true;

        this.adjustDropdownButtonWidth(editorView);

        this.wcagKeyNavUtil?.addArrowKeyNavigation();
    }

    /**
     * Adjust the dropdown button width to match the widest submenu item label.
     * If the state of a submenu changes to active the label of the dropdown button
     * is updated with the items label (see notifySubElementIsActive()), so we need to
     * ensure the button is wide enough to avoid layout shifts.
     *
     * @param editorView
     * @private
     */
    private adjustDropdownButtonWidth(editorView: PmEditorView): void {
        if (!this.dropDownButton || this.subMenuItems.length === 0) {
            return;
        }

        if(this.options.static) {
            return;
        }

        const tempContainer = this.createDropdownButton(editorView);
        this.dropDownButton.parentElement?.appendChild(tempContainer);
        tempContainer.style.position = 'absolute';
        tempContainer.style.visibility = 'hidden';
        tempContainer.style.left = '-10000px';

        // Calculate the maximum width required by submenu items
        let maxWidth = tempContainer.offsetWidth;
        for (const item of this.subMenuItems) {
            tempContainer.innerText = item.innerText;
            const buttonWidth = tempContainer.offsetWidth;
            if (buttonWidth > maxWidth) {
                maxWidth = buttonWidth;
            }
        }

        // Set the dropdown button width to match the widest submenu item
        this.dropDownButton.style.minWidth = `${maxWidth}px`;

        // Clean up temporary container
        if (tempContainer.parentElement) {
            tempContainer.parentElement.removeChild(tempContainer);
        }
    }

    private openDropDown(event: MouseEvent): void {
        event.stopPropagation();
        event.preventDefault();

        if (!this.subMenu || !this.dropDownButton) {
            return;
        }

        // Toggle submenu visibility
        const isCurrentlyClosed = !(this.subMenu.style.display !== 'none');

        if (isCurrentlyClosed) {
            // Opening the menu
            // Calculate position
            const left = this.dropDownButton.offsetLeft;
            const top = this.dropDownButton.offsetTop + this.dropDownButton.offsetHeight;

            // Set position and display using individual properties for better performance (single reflow)
            this.subMenu.style.left = `${left}px`;
            this.subMenu.style.top = `${top}px`;
            this.subMenu.style.display = '';

            // Reset key navigation to first item
            this.wcagKeyNavUtil?.activateFirstItem();

            // Keyboard navigation, focus the submenu directly
            if(event.buttons === WcagKeyNavUtil.SYNTHETIC_EVENT_BUTTON_NUMBER) {
                this.subMenu.focus();
            }

            // Add window click listener to close dropdown when clicking outside
            this.winCloseFunc = () => {
                if (this.subMenu) {
                    this.subMenu.style.display = 'none';
                }
                this.removeWindowCloseListener();
                return true;
            };

            this.cachedWindow?.addEventListener('click', this.winCloseFunc);
        } else {
            // Closing the menu
            this.subMenu.style.display = 'none';
            this.removeWindowCloseListener();
        }
    }

    /**
     * Remove the window close event listener
     */
    private removeWindowCloseListener(): void {
        if (this.winCloseFunc && this.cachedWindow) {
            this.cachedWindow.removeEventListener('click', this.winCloseFunc);
            this.winCloseFunc = null;
        }
    }
}
