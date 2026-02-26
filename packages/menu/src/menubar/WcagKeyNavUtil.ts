
export class WcagKeyNavUtil {

    // If keyboard event is translated to a mouse event, use this synthetic button number
    // to identify it as such
    public static readonly SYNTHETIC_EVENT_BUTTON_NUMBER = 42;

    private readonly menu: HTMLElement;
    private readonly menuItems: Array<HTMLElement>;
    private activeIndex = 0;

    private readonly nextKey: string;
    private readonly prevKey: string;

    // Event listener references for cleanup
    private menuKeydownListener: ((event: KeyboardEvent) => void) | null = null;
    private menuFocusListener: (() => void) | null = null;
    private itemEventListeners = new WeakMap<HTMLElement, {
        focus: () => void;
        blur: () => void;
        keydown: (event: KeyboardEvent) => void;
        click: () => void;
    }>();

    constructor(menu: HTMLElement,
                menuItems: Array<HTMLElement>,
                isHorizontal = true) {
        this.menu = menu;
        this.menuItems = menuItems;
        this.nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
        this.prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
    }

    public addArrowKeyNavigation(): void {

        this.menuKeydownListener = (event: KeyboardEvent): void => {
            // Only handle arrow keys
            if(event.key !== this.nextKey && event.key !== this.prevKey) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            // Bounds check before accessing array
            if(this.activeIndex < 0 || this.activeIndex >= this.menuItems.length) {
                this.activeIndex = 0;
            }

            // Deactivate current item
            if(this.menuItems[this.activeIndex]) {
                this.menuItems[this.activeIndex].tabIndex = -1;
            }

            // Activate next item (ArrowRight/ArrowDown)
            if (event.key === this.nextKey) {
                this.activeIndex = this.getNextActiveIndex(this.activeIndex, 'right', this.menuItems);
                if(this.menuItems[this.activeIndex]) {
                    this.menuItems[this.activeIndex].tabIndex = 0;
                    this.menuItems[this.activeIndex].focus();
                }
            }
            // Activate previous item (ArrowLeft/ArrowUp)
            else if (event.key === this.prevKey) {
                this.activeIndex = this.getNextActiveIndex(this.activeIndex, 'left', this.menuItems);
                if(this.menuItems[this.activeIndex]) {
                    this.menuItems[this.activeIndex].tabIndex = 0;
                    this.menuItems[this.activeIndex].focus();
                }
            }
        };

        this.menu.addEventListener('keydown', this.menuKeydownListener);

        // Toggle focus, execute menu item action on Enter/Space (usually open submenu or apply formating)
        this.menuItems.forEach((element: HTMLElement, index: number): void => {
            // Display with focused style and set active index
            const focusListener = (): void => {
                this.activeIndex = index;
                element.tabIndex = 0;
            };

            // Remove focused style
            const blurListener = (): void => {
                element.tabIndex = -1;
            };

            // Apply formatting
            const executeListener = (event: KeyboardEvent): void => {

                if(event.key === ' ' || event.key === 'Enter') {
                    event.preventDefault();
                    event.stopPropagation();
                    element.dispatchEvent(new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        // Hack, set buttons to 42 to allow identify this as part of keyboard interaction
                        buttons: WcagKeyNavUtil.SYNTHETIC_EVENT_BUTTON_NUMBER
                    }));
                }
            };

            // Workaround to avoid that more than one item is displayed focused at a time
            const clickListener = (): void => {
                // Blur all items - cache the items to avoid repeated property access
                const items = this.menuItems;
                for(const item of items) {
                    item.blur();
                }
            };

            // Store listeners for cleanup
            this.itemEventListeners.set(element, {
                focus: focusListener,
                blur: blurListener,
                keydown: executeListener,
                click: clickListener
            });

            element.addEventListener('focus', focusListener);
            element.addEventListener('blur', blurListener);
            element.addEventListener('keydown', executeListener);
            element.addEventListener('click', clickListener);
        });

        this.menuFocusListener = (): void => {
            // Bounds check before accessing array
            if(this.activeIndex >= 0 && this.activeIndex < this.menuItems.length && this.menuItems[this.activeIndex]) {
                this.menuItems[this.activeIndex].tabIndex = 0;
                this.menuItems[this.activeIndex].focus();
            }
        };

        this.menu.addEventListener('focus', this.menuFocusListener);
    }

    public activateFirstItem(): void {
        this.activeIndex = 0;
    }

    /**
     * Clean up event listeners to prevent memory leaks.
     * Should be called when the navigation is no longer needed.
     */
    public destroy(): void {
        // Remove menu listeners
        if(this.menuKeydownListener) {
            this.menu.removeEventListener('keydown', this.menuKeydownListener);
            this.menuKeydownListener = null;
        }

        if(this.menuFocusListener) {
            this.menu.removeEventListener('focus', this.menuFocusListener);
            this.menuFocusListener = null;
        }

        // Remove item listeners
        this.menuItems.forEach((element: HTMLElement): void => {
            const listeners = this.itemEventListeners.get(element);
            if(listeners) {
                element.removeEventListener('focus', listeners.focus);
                element.removeEventListener('blur', listeners.blur);
                element.removeEventListener('keydown', listeners.keydown);
                element.removeEventListener('click', listeners.click);
            }
        });

        // Clear the WeakMap (though it will be garbage collected anyway)
        this.itemEventListeners = new WeakMap();
    }

    private getNextActiveIndex(currentIndex: number, direction: 'left' | 'right', items: Array<HTMLElement>): number {
        const totalItems = items.length;
        if (totalItems === 0) {
            return currentIndex;
        }

        const isVisible = (element: HTMLElement): boolean => {
            const computedStyle: CSSStyleDeclaration = window.getComputedStyle(element);
            return computedStyle.display !== 'none' && !element.classList.contains('ProseMirror-menu-disabled');
        };

        let nextIndex = currentIndex;
        let attempts = 0;

        // Try to find a visible element, maximum attempts = array length to avoid infinite loop
        while (attempts < totalItems) {
            // Calculate next index based on direction
            if (direction === 'right') {
                nextIndex = (nextIndex + 1) % totalItems;
            } else {
                nextIndex = nextIndex - 1;
                if (nextIndex < 0) {
                    nextIndex = totalItems - 1;
                }
            }

            // Check if the element at nextIndex is visible
            if (isVisible(items[nextIndex])) {
                return nextIndex;
            }

            attempts++;
        }

        // If no visible element found, return current index
        return currentIndex;
    }
}
