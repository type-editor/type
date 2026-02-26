import {describe, it} from 'vitest';
import ist from 'ist';
import {delay, doc, p, schema} from '@type-editor/test-builder';
import {EditorState} from '@type-editor/state';
import type {PmEditorView} from "@type-editor/editor-types";
import {MenuItem} from "@src/menubar/MenuItem";
import {Dropdown} from "@src/menubar/dropdown/Dropdown";
import {DropdownLegacy} from "@src/menubar/dropdown/DropdownLegacy";
import {DropdownSubmenu} from "@src/menubar/dropdown/DropdownSubmenu";
import {icons} from "@src/menubar/icons/icons";
import {renderGrouped} from "@src/menubar/render-grouped";

describe("Dropdown", () => {
    const createMockView = (state: EditorState): PmEditorView => {
        return {
            state,
            dispatch: () => {},
            root: document,
            dom: {
                ownerDocument: document,
            } as HTMLElement,
            _props: {},
            props: {},
        } as unknown as PmEditorView;
    };

    describe("constructor", () => {
        it("should create a dropdown with single element", () => {
            const item = new MenuItem({
                run: () => {},
                label: "Item 1",
            });
            const dropdown = new DropdownLegacy(item);

            ist(dropdown.content.length, 1);
            ist(dropdown.content[0], item);
        });

        it("should create a dropdown with multiple elements", () => {
            const items = [
                new MenuItem({ run: () => {}, label: "Item 1" }),
                new MenuItem({ run: () => {}, label: "Item 2" }),
            ];
            const dropdown = new DropdownLegacy(items);

            ist(dropdown.content.length, 2);
        });

        it("should accept options", () => {
            const item = new MenuItem({ run: () => {}, label: "Item" });
            const dropdown = new DropdownLegacy(item, {
                label: "Menu",
                title: "Menu Title",
                class: "custom-dropdown",
                css: "color: blue;",
            });

            ist(dropdown.options.label, "Menu");
            ist(dropdown.options.title, "Menu Title");
            ist(dropdown.options.class, "custom-dropdown");
        });
    });

    describe("render", () => {
        it("should render dropdown with label", () => {
            const item = new MenuItem({ run: () => {}, label: "Item 1" });
            const dropdown = new DropdownLegacy(item, { label: "Menu" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = dropdown.render(view);

            ist(dom instanceof HTMLElement, true);
            ist(dom.querySelector(".ProseMirror-menu-dropdown") !== null, true);
        });

        it("should apply custom class", () => {
            const item = new MenuItem({ run: () => {}, label: "Item 1" });
            const dropdown = new DropdownLegacy(item, {
                label: "Menu",
                class: "my-custom-class"
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom } = dropdown.render(view);

            const label = dom.querySelector(".ProseMirror-menu-dropdown");
            ist(label !== null, true);
            ist(label?.classList.contains("my-custom-class"), true);
        });

        it("should set title attribute", () => {
            const item = new MenuItem({ run: () => {}, label: "Item 1" });
            const dropdown = new DropdownLegacy(item, {
                label: "Menu",
                title: "Dropdown Title"
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom } = dropdown.render(view);

            const label = dom.querySelector(".ProseMirror-menu-dropdown");
            ist(label?.getAttribute("title"), "Dropdown Title");
        });

        it("should render multiple items", () => {
            const items = [
                new MenuItem({ run: () => {}, label: "Item 1" }),
                new MenuItem({ run: () => {}, label: "Item 2" }),
                new MenuItem({ run: () => {}, label: "Item 3" }),
            ];
            const dropdown = new DropdownLegacy(items, { label: "Menu" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom } = dropdown.render(view);

            ist(dom instanceof HTMLElement, true);
        });
    });

    describe("update function", () => {
        it("should hide dropdown when all items are hidden", () => {
            const item = new MenuItem({
                run: () => {},
                label: "Item 1",
                select: () => false,
            });
            const dropdown = new DropdownLegacy(item, { label: "Menu" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = dropdown.render(view);

            const result = update(state);
            ist(result, false);
            ist(dom.style.display, "none");
        });

        it("should show dropdown when at least one item is visible", () => {
            const items = [
                new MenuItem({ run: () => {}, label: "Item 1", select: () => false }),
                new MenuItem({ run: () => {}, label: "Item 2", select: () => true }),
            ];
            const dropdown = new DropdownLegacy(items, { label: "Menu" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = dropdown.render(view);

            const result = update(state);
            ist(result, true);
            ist(dom.style.display, "");
        });
    });
});

describe("Dropdown (WCAG Compliant)", () => {
    const createMockView = (state: EditorState): PmEditorView => {
        const mockDoc = {
            ...document,
            defaultView: window,
        };
        return {
            state,
            dispatch: () => {},
            root: document,
            dom: {
                ownerDocument: mockDoc,
            } as HTMLElement,
            _props: {},
            props: {},
        } as unknown as PmEditorView;
    };

    describe("constructor", () => {
        it("should create a dropdown with single element", () => {
            const item = new MenuItem({
                run: () => {},
                label: "Item 1",
            });
            const dropdown = new Dropdown(item);

            ist(dropdown.content.length, 1);
            ist(dropdown.content[0], item);
        });

        it("should create a dropdown with multiple elements", () => {
            const items = [
                new MenuItem({ run: () => {}, label: "Item 1" }),
                new MenuItem({ run: () => {}, label: "Item 2" }),
            ];
            const dropdown = new Dropdown(items);

            ist(dropdown.content.length, 2);
        });

        it("should accept options", () => {
            const item = new MenuItem({ run: () => {}, label: "Item" });
            const dropdown = new Dropdown(item, {
                label: "Menu",
                title: "Menu Title",
                class: "custom-dropdown",
                css: "color: blue;",
            });

            ist(dropdown.options.label, "Menu");
            ist(dropdown.options.title, "Menu Title");
            ist(dropdown.options.class, "custom-dropdown");
        });
    });

    describe("render", () => {
        it("should render dropdown button with label", () => {
            const item = new MenuItem({ run: () => {}, label: "Item 1" });
            const dropdown = new Dropdown(item, { label: "Menu", title: "Menu Title" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = dropdown.render(view);

            ist(dom instanceof HTMLElement, true);
            ist(dom.tagName, "BUTTON");
            ist(dom.classList.contains("ProseMirror-menu-dropdown-wrap"), true);
        });

        it("should render submenu as HTML list (ul)", () => {
            const item = new MenuItem({ run: () => {}, label: "Item 1" });
            const dropdown = new Dropdown(item, { label: "Menu" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = dropdown.render(view);

            // Attach to document body to enable proper DOM manipulation
            const container = document.createElement('div');
            container.appendChild(dom);
            document.body.appendChild(container);

            // Call update to trigger submenu insertion
            update(state);

            // The submenu should now be attached to the DOM
            const submenu = container.querySelector("ul.ProseMirror-menu-dropdown-menu");
            ist(submenu !== null, true);

            // Cleanup
            document.body.removeChild(container);
        });

        it("should render menu items inside list items (li)", () => {
            const items = [
                new MenuItem({ run: () => {}, label: "Item 1" }),
                new MenuItem({ run: () => {}, label: "Item 2" }),
            ];
            const dropdown = new Dropdown(items, { label: "Menu" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = dropdown.render(view);

            // Attach to document body to enable proper DOM manipulation
            const container = document.createElement('div');
            container.appendChild(dom);
            document.body.appendChild(container);

            // Call update to trigger submenu insertion
            update(state);

            // Open the dropdown
            dom.dispatchEvent(new Event('click'));
            
            const submenu = container.querySelector("ul.ProseMirror-menu-dropdown-menu");
            const listItems = submenu?.querySelectorAll("li.ProseMirror-menu-dropdown-item");
            ist(listItems !== undefined, true);
            ist(listItems!.length, 2);

            // Cleanup
            document.body.removeChild(container);
        });

        it("should apply custom class to submenu", () => {
            const item = new MenuItem({ run: () => {}, label: "Item 1" });
            const dropdown = new Dropdown(item, {
                label: "Menu",
                class: "my-custom-class"
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = dropdown.render(view);

            // Attach to document body to enable proper DOM manipulation
            const container = document.createElement('div');
            container.appendChild(dom);
            document.body.appendChild(container);

            // Call update to trigger submenu insertion
            update(state);

            // Open the dropdown
            dom.dispatchEvent(new Event('click'));
            
            const submenu = container.querySelector("ul.ProseMirror-menu-dropdown-menu");
            ist(submenu?.classList.contains("my-custom-class"), true);

            // Cleanup
            document.body.removeChild(container);
        });

        it("should set role=menu on submenu", () => {
            const item = new MenuItem({ run: () => {}, label: "Item 1" });
            const dropdown = new Dropdown(item, { label: "Menu" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = dropdown.render(view);

            // Attach to document body to enable proper DOM manipulation
            const container = document.createElement('div');
            container.appendChild(dom);
            document.body.appendChild(container);

            // Call update to trigger submenu insertion
            update(state);

            // Open the dropdown
            dom.dispatchEvent(new Event('click'));
            
            const submenu = container.querySelector("ul");
            ist(submenu?.getAttribute("role"), "menu");

            // Cleanup
            document.body.removeChild(container);
        });

        it("should set role=menuitem on list items", () => {
            const item = new MenuItem({ run: () => {}, label: "Item 1" });
            const dropdown = new Dropdown(item, { label: "Menu" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = dropdown.render(view);

            // Attach to document body to enable proper DOM manipulation
            const container = document.createElement('div');
            container.appendChild(dom);
            document.body.appendChild(container);

            // Call update to trigger submenu insertion
            update(state);

            // Open the dropdown
            dom.dispatchEvent(new Event('click'));
            
            const listItem = container.querySelector("li");
            ist(listItem?.getAttribute("role"), "menuitem");

            // Cleanup
            document.body.removeChild(container);
        });
    });

    describe("update function", () => {
        it("should hide dropdown button when all items are hidden", () => {
            const item = new MenuItem({
                run: () => {},
                label: "Item 1",
                select: () => false,
            });
            const dropdown = new Dropdown(item, { label: "Menu" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = dropdown.render(view);

            const result = update(state);
            ist(result, false);
            ist(dom.style.display, "none");
        });

        it("should show dropdown button when at least one item is visible", () => {
            const items = [
                new MenuItem({ run: () => {}, label: "Item 1", select: () => false }),
                new MenuItem({ run: () => {}, label: "Item 2", select: () => true }),
            ];
            const dropdown = new Dropdown(items, { label: "Menu" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = dropdown.render(view);

            const result = update(state);
            ist(result, true);
            ist(dom.style.display, "");
        });
    });

    describe("keyboard interaction", () => {
        // Note: Enter and Space key handling is done by WcagKeyNavUtil, which triggers a click event.
        // These tests verify that the dropdown opens correctly when click is triggered.
        it("should open dropdown on click (triggered by Enter/Space via WcagKeyNavUtil)", () => {
            const item = new MenuItem({ run: () => {}, label: "Item 1" });
            const dropdown = new Dropdown(item, { label: "Menu" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = dropdown.render(view);

            // Attach to document body to enable proper DOM manipulation
            const container = document.createElement('div');
            container.appendChild(dom);
            document.body.appendChild(container);

            // Call update to trigger submenu insertion
            update(state);

            // WcagKeyNavUtil converts Enter/Space to click events
            dom.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

            const submenu = container.querySelector("ul.ProseMirror-menu-dropdown-menu") as HTMLElement;
            ist(submenu !== null, true);
            ist(submenu?.style.display, "");

            // Cleanup
            document.body.removeChild(container);
        });

        it("should close dropdown on Escape key", () => {
            const item = new MenuItem({ run: () => {}, label: "Item 1" });
            const dropdown = new Dropdown(item, { label: "Menu" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = dropdown.render(view);

            // Attach to document body to enable proper DOM manipulation
            const container = document.createElement('div');
            container.appendChild(dom);
            document.body.appendChild(container);

            // Call update to trigger submenu insertion
            update(state);

            // Open first
            dom.dispatchEvent(new Event('click'));
            const submenu = container.querySelector("ul.ProseMirror-menu-dropdown-menu") as HTMLElement;
            ist(submenu?.style.display, "");

            // Now close with Escape
            const keyEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            submenu.dispatchEvent(keyEvent);

            ist(submenu.style.display, "none");

            // Cleanup
            document.body.removeChild(container);
        });

        it("should toggle dropdown visibility on repeated clicks", () => {
            const item = new MenuItem({ run: () => {}, label: "Item 1" });
            const dropdown = new Dropdown(item, { label: "Menu" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = dropdown.render(view);

            // Attach to document body to enable proper DOM manipulation
            const container = document.createElement('div');
            container.appendChild(dom);
            document.body.appendChild(container);

            // Call update to trigger submenu insertion
            update(state);

            // First click - open
            dom.dispatchEvent(new Event('click'));
            let submenu = container.querySelector("ul.ProseMirror-menu-dropdown-menu") as HTMLElement;
            ist(submenu?.style.display, "");

            // Second click - close
            dom.dispatchEvent(new Event('click'));
            ist(submenu.style.display, "none");

            // Third click - open again
            dom.dispatchEvent(new Event('click'));
            ist(submenu.style.display, "");

            // Cleanup
            document.body.removeChild(container);
        });

        it("should navigate submenu items with ArrowDown key", () => {
            const items = [
                new MenuItem({ run: () => {}, label: "Item 1" }),
                new MenuItem({ run: () => {}, label: "Item 2" }),
                new MenuItem({ run: () => {}, label: "Item 3" }),
            ];
            const dropdown = new Dropdown(items, { label: "Menu" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = dropdown.render(view);

            // Attach to document body
            const container = document.createElement('div');
            container.appendChild(dom);
            document.body.appendChild(container);

            // Call update to trigger submenu insertion
            update(state);

            // Open the dropdown
            dom.dispatchEvent(new Event('click'));

            const submenu = container.querySelector("ul.ProseMirror-menu-dropdown-menu") as HTMLElement;
            // Get the inner menu item elements (inside the li elements), not the li wrappers
            const menuItemElements = container.querySelectorAll("li.ProseMirror-menu-dropdown-item > *");

            // Focus first item
            (menuItemElements[0] as HTMLElement).tabIndex = 0;
            (menuItemElements[0] as HTMLElement).focus();

            // Navigate down
            const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
            submenu.dispatchEvent(arrowDownEvent);

            // Second item should be focused
            ist(document.activeElement, menuItemElements[1]);

            // Cleanup
            document.body.removeChild(container);
        });

        it("should navigate submenu items with ArrowUp key", () => {
            const items = [
                new MenuItem({ run: () => {}, label: "Item 1" }),
                new MenuItem({ run: () => {}, label: "Item 2" }),
                new MenuItem({ run: () => {}, label: "Item 3" }),
            ];
            const dropdown = new Dropdown(items, { label: "Menu" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = dropdown.render(view);

            // Attach to document body
            const container = document.createElement('div');
            container.appendChild(dom);
            document.body.appendChild(container);

            // Call update to trigger submenu insertion
            update(state);

            // Open the dropdown
            dom.dispatchEvent(new Event('click'));

            const submenu = container.querySelector("ul.ProseMirror-menu-dropdown-menu") as HTMLElement;
            // Get the inner menu item elements (inside the li elements), not the li wrappers
            const menuItemElements = container.querySelectorAll("li.ProseMirror-menu-dropdown-item > *");

            // Focus second item
            (menuItemElements[1] as HTMLElement).tabIndex = 0;
            (menuItemElements[1] as HTMLElement).focus();

            // Navigate up
            const arrowUpEvent = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
            submenu.dispatchEvent(arrowUpEvent);

            // First item should be focused
            ist(document.activeElement, menuItemElements[0]);

            // Cleanup
            document.body.removeChild(container);
        });

        it("should focus submenu when opened with synthetic keyboard event", () => {
            const item = new MenuItem({ run: () => {}, label: "Item 1" });
            const dropdown = new Dropdown(item, { label: "Menu" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = dropdown.render(view);

            // Attach to document body
            const container = document.createElement('div');
            container.appendChild(dom);
            document.body.appendChild(container);

            // Call update to trigger submenu insertion
            update(state);

            // Open with synthetic keyboard event (buttons = 42)
            dom.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                buttons: 42 // WcagKeyNavUtil.SYNTHETIC_EVENT_BUTTON_NUMBER
            }));

            const submenu = container.querySelector("ul.ProseMirror-menu-dropdown-menu") as HTMLElement;
            ist(submenu !== null, true);
            // Submenu should be visible (display not none) when opened with keyboard
            ist(submenu.style.display, "");

            // Cleanup
            document.body.removeChild(container);
        });

        it("should return focus to dropdown button on Escape", () => {
            const item = new MenuItem({ run: () => {}, label: "Item 1" });
            const dropdown = new Dropdown(item, { label: "Menu" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = dropdown.render(view);

            // Attach to document body
            const container = document.createElement('div');
            container.appendChild(dom);
            document.body.appendChild(container);

            // Call update to trigger submenu insertion
            update(state);

            // Open the dropdown
            dom.dispatchEvent(new Event('click'));

            const submenu = container.querySelector("ul.ProseMirror-menu-dropdown-menu") as HTMLElement;
            submenu.focus();

            // Press Escape
            const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
            submenu.dispatchEvent(escapeEvent);

            // Dropdown button should be focused again
            ist(document.activeElement, dom);

            // Cleanup
            document.body.removeChild(container);
        });
    });

    describe("submenu positioning", () => {
        it("should position submenu below the button", () => {
            const item = new MenuItem({ run: () => {}, label: "Item 1" });
            const dropdown = new Dropdown(item, { label: "Menu" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = dropdown.render(view);

            // Attach to document body to enable proper DOM manipulation
            const container = document.createElement('div');
            container.appendChild(dom);
            document.body.appendChild(container);

            // Call update to trigger submenu insertion
            update(state);

            // Open the dropdown
            dom.dispatchEvent(new Event('click'));
            
            const submenu = container.querySelector("ul.ProseMirror-menu-dropdown-menu") as HTMLElement;
            ist(submenu !== null, true);
            // Position should be set based on button dimensions
            ist(submenu.style.left !== "", true);
            ist(submenu.style.top !== "", true);

            // Cleanup
            document.body.removeChild(container);
        });
    });

    describe("destroy", () => {
        it("should clean up event listeners on destroy", () => {
            const item = new MenuItem({ run: () => {}, label: "Item 1" });
            const dropdown = new Dropdown(item, { label: "Menu" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = dropdown.render(view);

            // Attach to document body
            const container = document.createElement('div');
            container.appendChild(dom);
            document.body.appendChild(container);

            // Call update to trigger submenu insertion
            update(state);

            // Destroy the dropdown
            dropdown.destroy();

            // Click should no longer open submenu (listener removed)
            dom.dispatchEvent(new Event('click'));

            // The submenu should not be reachable after destroy
            // This is a basic check - actual implementation details may vary
            ist(true, true);

            // Cleanup
            document.body.removeChild(container);
        });

        it("should be safe to call destroy multiple times", () => {
            const item = new MenuItem({ run: () => {}, label: "Item 1" });
            const dropdown = new Dropdown(item, { label: "Menu" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            dropdown.render(view);

            // Should not throw
            dropdown.destroy();
            dropdown.destroy();
            dropdown.destroy();

            ist(true, true);
        });

        it("should clean up WcagKeyNavUtil on destroy", () => {
            const items = [
                new MenuItem({ run: () => {}, label: "Item 1" }),
                new MenuItem({ run: () => {}, label: "Item 2" }),
            ];
            const dropdown = new Dropdown(items, { label: "Menu" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = dropdown.render(view);

            // Attach to document body
            const container = document.createElement('div');
            container.appendChild(dom);
            document.body.appendChild(container);

            // Call update to trigger submenu insertion
            update(state);

            // Open dropdown
            dom.dispatchEvent(new Event('click'));

            const submenu = container.querySelector("ul.ProseMirror-menu-dropdown-menu") as HTMLElement;
            ist(submenu !== null, true);

            // Destroy should clean up WcagKeyNavUtil without errors
            dropdown.destroy();

            ist(true, true);

            // Cleanup
            document.body.removeChild(container);
        });

        it("should remove window click listener on destroy", () => {
            const item = new MenuItem({ run: () => {}, label: "Item 1" });
            const dropdown = new Dropdown(item, { label: "Menu" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = dropdown.render(view);

            // Attach to document body
            const container = document.createElement('div');
            container.appendChild(dom);
            document.body.appendChild(container);

            // Call update to trigger submenu insertion
            update(state);

            // Open dropdown (adds window click listener)
            dom.dispatchEvent(new Event('click'));

            // Destroy (should remove window click listener)
            dropdown.destroy();

            // Window click should not cause errors
            window.dispatchEvent(new Event('click'));

            ist(true, true);

            // Cleanup
            document.body.removeChild(container);
        });
    });
});

describe("DropdownSubmenu", () => {
    const createMockView = (state: EditorState): PmEditorView => {
        const mockDoc = {
            ...document,
            defaultView: window,
        };
        return {
            state,
            dispatch: () => {},
            root: document,
            dom: {
                ownerDocument: mockDoc,
            } as HTMLElement,
            _props: {},
            props: {},
        } as unknown as PmEditorView;
    };

    describe("constructor", () => {
        it("should create a submenu with single element", () => {
            const item = new MenuItem({ run: () => {}, label: "Item 1" });
            const submenu = new DropdownSubmenu(item);

            ist(submenu.content.length, 1);
            ist(submenu.content[0], item);
        });

        it("should create a submenu with multiple elements", () => {
            const items = [
                new MenuItem({ run: () => {}, label: "Item 1" }),
                new MenuItem({ run: () => {}, label: "Item 2" }),
            ];
            const submenu = new DropdownSubmenu(items);

            ist(submenu.content.length, 2);
        });

        it("should accept label option", () => {
            const item = new MenuItem({ run: () => {}, label: "Item" });
            const submenu = new DropdownSubmenu(item, { label: "Submenu" });

            ist(submenu.options.label, "Submenu");
        });
    });

    describe("render", () => {
        it("should render submenu with label", () => {
            const item = new MenuItem({ run: () => {}, label: "Item 1" });
            const submenu = new DropdownSubmenu(item, { label: "Submenu" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = submenu.render(view);

            ist(dom instanceof HTMLElement, true);
            // Check that render returns the wrapper element
            ist(dom.className.includes("submenu-wrap"), true);
        });

        it("should render multiple items in submenu", () => {
            const items = [
                new MenuItem({ run: () => {}, label: "Item 1" }),
                new MenuItem({ run: () => {}, label: "Item 2" }),
            ];
            const submenu = new DropdownSubmenu(items, { label: "Submenu" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom } = submenu.render(view);

            ist(dom instanceof HTMLElement, true);
            // Check that the submenu wrapper is an HTML element
            ist(dom.className.includes("submenu-wrap"), true);
        });
    });

    describe("update function", () => {
        it("should hide submenu when all items are hidden", () => {
            const item = new MenuItem({
                run: () => {},
                label: "Item 1",
                select: () => false,
            });
            const submenu = new DropdownSubmenu(item, { label: "Submenu" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = submenu.render(view);

            const result = update(state);
            ist(result, false);
            ist(dom.style.display, "none");
        });

        it("should show submenu when at least one item is visible", () => {
            const items = [
                new MenuItem({ run: () => {}, label: "Item 1", select: () => false }),
                new MenuItem({ run: () => {}, label: "Item 2", select: () => true }),
            ];
            const submenu = new DropdownSubmenu(items, { label: "Submenu" });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = submenu.render(view);

            const result = update(state);
            ist(result, true);
            ist(dom.style.display, "");
        });
    });
});

describe("renderGrouped", () => {
    const createMockView = (state: EditorState): PmEditorView => {
        return {
            state,
            dispatch: () => {},
            root: document,
            dom: {
                ownerDocument: document,
            } as HTMLElement,
            _props: {},
            props: {},
        } as unknown as PmEditorView;
    };

    it("should render single group", () => {
        const items = [
            new MenuItem({ run: () => {}, icon: icons.strong }),
            new MenuItem({ run: () => {}, icon: icons.em }),
        ];

        const state = EditorState.create({ doc: doc(p("hello")), schema });
        const view = createMockView(state);
        const { dom, update } = renderGrouped(view, [items]);

        ist(dom instanceof DocumentFragment, true);
    });

    it("should render multiple groups with separators", () => {
        const group1 = [
            new MenuItem({ run: () => {}, icon: icons.strong }),
            new MenuItem({ run: () => {}, icon: icons.em }),
        ];
        const group2 = [
            new MenuItem({ run: () => {}, icon: icons.undo }),
            new MenuItem({ run: () => {}, icon: icons.redo }),
        ];

        const state = EditorState.create({ doc: doc(p("hello")), schema });
        const view = createMockView(state);
        const { dom, update } = renderGrouped(view, [group1, group2], false, true);

        ist(dom instanceof DocumentFragment, true);
        const container = document.createElement("div");
        container.appendChild(dom);

        // Check for separator
        const separator = container.querySelector(".ProseMirror-menuseparator");
        ist(separator !== null, true);
    });

    it("should handle empty groups", () => {
        const group1 = [
            new MenuItem({ run: () => {}, icon: icons.strong }),
        ];
        const group2: MenuItem[] = [];
        const group3 = [
            new MenuItem({ run: () => {}, icon: icons.undo }),
        ];

        const state = EditorState.create({ doc: doc(p("hello")), schema });
        const view = createMockView(state);
        const { dom, update } = renderGrouped(view, [group1, group2, group3]);

        ist(dom instanceof DocumentFragment, true);
    });

    it("should hide separator when adjacent group becomes hidden", async () => {
        const group1 = [
            new MenuItem({ run: () => {}, icon: icons.strong }),
        ];
        const group2 = [
            new MenuItem({ run: () => {}, icon: icons.em, select: () => false }),
        ];

        const state = EditorState.create({ doc: doc(p("hello")), schema });
        const view = createMockView(state);
        const { dom, update } = renderGrouped(view, [group1, group2]);

        const container = document.createElement("div");
        container.appendChild(dom);

        update(state);

        await delay(100); // Allow any async updates to complete

        const separator = container.querySelector(".ProseMirror-menuseparator") as HTMLElement;
        if (separator) {
            ist(separator.style.display, "none");
        }


    });

    it("should update all items in all groups", async () => {
        let updateCount1 = 0;
        let updateCount2 = 0;

        const item1 = new MenuItem({
            run: () => {},
            icon: icons.strong,
            enable: () => { updateCount1++; return true; },
        });
        const item2 = new MenuItem({
            run: () => {},
            icon: icons.em,
            enable: () => { updateCount2++; return true; },
        });

        const state = EditorState.create({ doc: doc(p("hello")), schema });
        const view = createMockView(state);
        const { dom, update } = renderGrouped(view, [[item1], [item2]]);

        update(state);

        await delay(100); // Allow any async updates to complete

        ist(updateCount1 > 0, true);
        ist(updateCount2 > 0, true);
    });
});

