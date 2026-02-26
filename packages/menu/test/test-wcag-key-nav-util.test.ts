import {describe, it, beforeEach, afterEach} from 'vitest';
import ist from 'ist';
import {WcagKeyNavUtil} from "@src/menubar/WcagKeyNavUtil";

describe("WcagKeyNavUtil", () => {
    let container: HTMLElement;
    let menu: HTMLElement;
    let menuItems: Array<HTMLElement>;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        
        menu = document.createElement('ul');
        menu.setAttribute('role', 'menu');
        menu.tabIndex = -1;
        container.appendChild(menu);
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    describe("horizontal navigation", () => {
        beforeEach(() => {
            menuItems = [];
            for (let i = 0; i < 3; i++) {
                const item = document.createElement('button');
                item.textContent = `Item ${i + 1}`;
                item.tabIndex = -1;
                menu.appendChild(item);
                menuItems.push(item);
            }
        });

        it("should navigate to next item with ArrowRight", () => {
            const util = new WcagKeyNavUtil(menu, menuItems);
            util.addArrowKeyNavigation();

            menuItems[0].tabIndex = 0;
            menuItems[0].focus();

            const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
            menu.dispatchEvent(event);

            ist(menuItems[1].tabIndex, 0);
            ist(document.activeElement, menuItems[1]);
        });

        it("should navigate to previous item with ArrowLeft", () => {
            const util = new WcagKeyNavUtil(menu, menuItems);
            util.addArrowKeyNavigation();

            menuItems[1].tabIndex = 0;
            menuItems[1].focus();

            const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
            menu.dispatchEvent(event);

            ist(menuItems[0].tabIndex, 0);
            ist(document.activeElement, menuItems[0]);
        });

        it("should wrap around to first item from last item", () => {
            const util = new WcagKeyNavUtil(menu, menuItems);
            util.addArrowKeyNavigation();

            menuItems[2].tabIndex = 0;
            menuItems[2].focus();

            const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
            menu.dispatchEvent(event);

            ist(menuItems[0].tabIndex, 0);
            ist(document.activeElement, menuItems[0]);
        });

        it("should wrap around to last item from first item", () => {
            const util = new WcagKeyNavUtil(menu, menuItems);
            util.addArrowKeyNavigation();

            menuItems[0].tabIndex = 0;
            menuItems[0].focus();

            const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
            menu.dispatchEvent(event);

            ist(menuItems[2].tabIndex, 0);
            ist(document.activeElement, menuItems[2]);
        });
    });

    describe("vertical navigation", () => {
        beforeEach(() => {
            menuItems = [];
            for (let i = 0; i < 3; i++) {
                const item = document.createElement('button');
                item.textContent = `Item ${i + 1}`;
                item.tabIndex = -1;
                menu.appendChild(item);
                menuItems.push(item);
            }
        });

        it("should navigate to next item with ArrowDown", () => {
            const util = new WcagKeyNavUtil(menu, menuItems, false);
            util.addArrowKeyNavigation();

            menuItems[0].tabIndex = 0;
            menuItems[0].focus();

            const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
            menu.dispatchEvent(event);

            ist(menuItems[1].tabIndex, 0);
            ist(document.activeElement, menuItems[1]);
        });

        it("should navigate to previous item with ArrowUp", () => {
            const util = new WcagKeyNavUtil(menu, menuItems, false);
            util.addArrowKeyNavigation();

            menuItems[1].tabIndex = 0;
            menuItems[1].focus();

            const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
            menu.dispatchEvent(event);

            ist(menuItems[0].tabIndex, 0);
            ist(document.activeElement, menuItems[0]);
        });

        it("should wrap around to first item from last item", () => {
            const util = new WcagKeyNavUtil(menu, menuItems, false);
            util.addArrowKeyNavigation();

            menuItems[2].tabIndex = 0;
            menuItems[2].focus();

            const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
            menu.dispatchEvent(event);

            ist(menuItems[0].tabIndex, 0);
            ist(document.activeElement, menuItems[0]);
        });

        it("should wrap around to last item from first item", () => {
            const util = new WcagKeyNavUtil(menu, menuItems, false);
            util.addArrowKeyNavigation();

            menuItems[0].tabIndex = 0;
            menuItems[0].focus();

            const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
            menu.dispatchEvent(event);

            ist(menuItems[2].tabIndex, 0);
            ist(document.activeElement, menuItems[2]);
        });
    });

    describe("skip disabled items", () => {
        beforeEach(() => {
            menuItems = [];
            for (let i = 0; i < 4; i++) {
                const item = document.createElement('button');
                item.textContent = `Item ${i + 1}`;
                item.tabIndex = -1;
                menu.appendChild(item);
                menuItems.push(item);
            }
        });

        it("should skip disabled items when navigating right", () => {
            const util = new WcagKeyNavUtil(menu, menuItems);
            util.addArrowKeyNavigation();

            // Disable the second item
            menuItems[1].classList.add('ProseMirror-menu-disabled');

            menuItems[0].tabIndex = 0;
            menuItems[0].focus();

            const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
            menu.dispatchEvent(event);

            // Should skip item 1 and go to item 2
            ist(menuItems[2].tabIndex, 0);
            ist(document.activeElement, menuItems[2]);
        });

        it("should skip hidden items when navigating", () => {
            const util = new WcagKeyNavUtil(menu, menuItems);
            util.addArrowKeyNavigation();

            // Hide the second item
            menuItems[1].style.display = 'none';

            menuItems[0].tabIndex = 0;
            menuItems[0].focus();

            const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
            menu.dispatchEvent(event);

            // Should skip item 1 and go to item 2
            ist(menuItems[2].tabIndex, 0);
            ist(document.activeElement, menuItems[2]);
        });

        it("should skip multiple disabled items in a row", () => {
            const util = new WcagKeyNavUtil(menu, menuItems);
            util.addArrowKeyNavigation();

            // Disable items 1 and 2
            menuItems[1].classList.add('ProseMirror-menu-disabled');
            menuItems[2].classList.add('ProseMirror-menu-disabled');

            menuItems[0].tabIndex = 0;
            menuItems[0].focus();

            const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
            menu.dispatchEvent(event);

            // Should skip items 1 and 2, and go to item 3
            ist(menuItems[3].tabIndex, 0);
            ist(document.activeElement, menuItems[3]);
        });
    });

    describe("activateFirstItem", () => {
        beforeEach(() => {
            menuItems = [];
            for (let i = 0; i < 3; i++) {
                const item = document.createElement('button');
                item.textContent = `Item ${i + 1}`;
                item.tabIndex = -1;
                menu.appendChild(item);
                menuItems.push(item);
            }
        });

        it("should set active index to 0", () => {
            const util = new WcagKeyNavUtil(menu, menuItems);
            util.addArrowKeyNavigation();

            // Navigate to second item first
            menuItems[1].tabIndex = 0;
            menuItems[1].focus();

            // Now activate first item
            util.activateFirstItem();

            // Navigate to check if we're at the first item
            const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
            menu.dispatchEvent(event);

            // Should move to item 1 (second item) since we reset to 0
            ist(menuItems[1].tabIndex, 0);
        });
    });

    describe("focus and blur behavior", () => {
        beforeEach(() => {
            menuItems = [];
            for (let i = 0; i < 3; i++) {
                const item = document.createElement('button');
                item.textContent = `Item ${i + 1}`;
                item.tabIndex = -1;
                menu.appendChild(item);
                menuItems.push(item);
            }
        });

        it("should update tabindex on focus", () => {
            const util = new WcagKeyNavUtil(menu, menuItems);
            util.addArrowKeyNavigation();

            // Manually focus an item
            menuItems[1].focus();

            ist(menuItems[1].tabIndex, 0);
        });

        it("should reset tabindex on blur", () => {
            const util = new WcagKeyNavUtil(menu, menuItems);
            util.addArrowKeyNavigation();

            // Focus and then blur
            menuItems[1].focus();
            menuItems[1].blur();

            ist(menuItems[1].tabIndex, -1);
        });

        it("should focus active item when menu receives focus", () => {
            const util = new WcagKeyNavUtil(menu, menuItems);
            util.addArrowKeyNavigation();

            // Set first item as active
            menuItems[0].tabIndex = 0;

            // Focus the menu
            menu.focus();

            ist(document.activeElement, menuItems[0]);
        });
    });

    describe("click behavior", () => {
        beforeEach(() => {
            menuItems = [];
            for (let i = 0; i < 3; i++) {
                const item = document.createElement('button');
                item.textContent = `Item ${i + 1}`;
                item.tabIndex = -1;
                menu.appendChild(item);
                menuItems.push(item);
            }
        });

        it("should blur all items on click", () => {
            const util = new WcagKeyNavUtil(menu, menuItems);
            util.addArrowKeyNavigation();

            // Focus an item first
            menuItems[1].tabIndex = 0;
            menuItems[1].focus();

            // Simulate click
            const event = new MouseEvent('click', { bubbles: true });
            menuItems[1].dispatchEvent(event);

            // All items should have tabindex -1 after blur
            ist(menuItems[0].tabIndex, -1);
            ist(menuItems[1].tabIndex, -1);
            ist(menuItems[2].tabIndex, -1);
        });
    });

    describe("Enter/Space key triggers click", () => {
        beforeEach(() => {
            menuItems = [];
            for (let i = 0; i < 3; i++) {
                const item = document.createElement('button');
                item.textContent = `Item ${i + 1}`;
                item.tabIndex = -1;
                menu.appendChild(item);
                menuItems.push(item);
            }
        });

        it("should dispatch click event on Enter key", () => {
            const util = new WcagKeyNavUtil(menu, menuItems);
            util.addArrowKeyNavigation();

            let clickReceived = false;
            let clickButtons = -1;
            menuItems[0].addEventListener('click', (e: MouseEvent) => {
                clickReceived = true;
                clickButtons = e.buttons;
            });

            menuItems[0].tabIndex = 0;
            menuItems[0].focus();

            const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
            menuItems[0].dispatchEvent(event);

            ist(clickReceived, true);
            ist(clickButtons, WcagKeyNavUtil.SYNTHETIC_EVENT_BUTTON_NUMBER);
        });

        it("should dispatch click event on Space key", () => {
            const util = new WcagKeyNavUtil(menu, menuItems);
            util.addArrowKeyNavigation();

            let clickReceived = false;
            let clickButtons = -1;
            menuItems[0].addEventListener('click', (e: MouseEvent) => {
                clickReceived = true;
                clickButtons = e.buttons;
            });

            menuItems[0].tabIndex = 0;
            menuItems[0].focus();

            const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
            menuItems[0].dispatchEvent(event);

            ist(clickReceived, true);
            ist(clickButtons, WcagKeyNavUtil.SYNTHETIC_EVENT_BUTTON_NUMBER);
        });

        it("should not dispatch click on other keys", () => {
            const util = new WcagKeyNavUtil(menu, menuItems);
            util.addArrowKeyNavigation();

            let clickReceived = false;
            menuItems[0].addEventListener('click', () => {
                clickReceived = true;
            });

            menuItems[0].tabIndex = 0;
            menuItems[0].focus();

            const event = new KeyboardEvent('keydown', { key: 'a', bubbles: true });
            menuItems[0].dispatchEvent(event);

            ist(clickReceived, false);
        });
    });

    describe("SYNTHETIC_EVENT_BUTTON_NUMBER", () => {
        it("should have value 42", () => {
            ist(WcagKeyNavUtil.SYNTHETIC_EVENT_BUTTON_NUMBER, 42);
        });
    });

    describe("destroy", () => {
        beforeEach(() => {
            menuItems = [];
            for (let i = 0; i < 3; i++) {
                const item = document.createElement('button');
                item.textContent = `Item ${i + 1}`;
                item.tabIndex = -1;
                menu.appendChild(item);
                menuItems.push(item);
            }
        });

        it("should remove keydown listener from menu after destroy", () => {
            const util = new WcagKeyNavUtil(menu, menuItems);
            util.addArrowKeyNavigation();

            // Verify navigation works before destroy
            menuItems[0].tabIndex = 0;
            menuItems[0].focus();

            let event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
            menu.dispatchEvent(event);
            ist(document.activeElement, menuItems[1]);

            // Destroy and verify navigation no longer works
            util.destroy();

            menuItems[1].tabIndex = 0;
            menuItems[1].focus();

            event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
            menu.dispatchEvent(event);

            // Should still be on item 1 since listener was removed
            ist(document.activeElement, menuItems[1]);
        });

        it("should remove focus listener from menu after destroy", () => {
            const util = new WcagKeyNavUtil(menu, menuItems);
            util.addArrowKeyNavigation();

            util.destroy();

            // Focus on menu should not auto-focus the first item anymore
            menuItems[0].tabIndex = 0;
            menu.focus();

            // The focus listener was removed, so activeElement should be menu, not menuItems[0]
            ist(document.activeElement, menu);
        });

        it("should remove item event listeners after destroy", () => {
            const util = new WcagKeyNavUtil(menu, menuItems);
            util.addArrowKeyNavigation();

            // Add click listener before destroy to track if WcagKeyNavUtil triggers it
            let clickReceived = false;
            menuItems[0].addEventListener('click', () => {
                clickReceived = true;
            });

            // Verify Enter key triggers click before destroy
            menuItems[0].tabIndex = 0;
            menuItems[0].focus();

            let event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
            menuItems[0].dispatchEvent(event);

            ist(clickReceived, true);

            // Reset and destroy
            clickReceived = false;
            util.destroy();

            // Enter key should not trigger click anymore (keydown listener removed)
            event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
            menuItems[0].dispatchEvent(event);

            ist(clickReceived, false);
        });

        it("should be safe to call destroy multiple times", () => {
            const util = new WcagKeyNavUtil(menu, menuItems);
            util.addArrowKeyNavigation();

            // Should not throw
            util.destroy();
            util.destroy();
            util.destroy();

            ist(true, true);
        });
    });

    describe("edge cases", () => {
        it("should handle empty menu items array", () => {
            const util = new WcagKeyNavUtil(menu, []);
            util.addArrowKeyNavigation();

            // Should not throw when navigating with empty items
            const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
            menu.dispatchEvent(event);

            ist(true, true);
        });

        it("should handle single menu item", () => {
            const singleItem = document.createElement('button');
            singleItem.textContent = 'Single Item';
            singleItem.tabIndex = -1;
            menu.appendChild(singleItem);

            const util = new WcagKeyNavUtil(menu, [singleItem]);
            util.addArrowKeyNavigation();

            singleItem.tabIndex = 0;
            singleItem.focus();

            // Navigate right should wrap to the same item
            const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
            menu.dispatchEvent(event);

            ist(document.activeElement, singleItem);
        });

        it("should stay on current item if all other items are disabled", () => {
            menuItems = [];
            for (let i = 0; i < 3; i++) {
                const item = document.createElement('button');
                item.textContent = `Item ${i + 1}`;
                item.tabIndex = -1;
                menu.appendChild(item);
                menuItems.push(item);
            }

            const util = new WcagKeyNavUtil(menu, menuItems);
            util.addArrowKeyNavigation();

            // Disable all items except the first one
            menuItems[1].classList.add('ProseMirror-menu-disabled');
            menuItems[2].classList.add('ProseMirror-menu-disabled');

            menuItems[0].tabIndex = 0;
            menuItems[0].focus();

            const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
            menu.dispatchEvent(event);

            // Should stay on first item since it's the only enabled one
            ist(document.activeElement, menuItems[0]);
        });
    });
});
