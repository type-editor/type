import {afterEach, describe, it} from 'vitest';
import ist from 'ist';
import {icons, joinUpItem, liftItem, MenuItem, redoItem, undoItem} from '@type-editor/menu';
import {Dropdown} from '@src/menubar/dropdown/Dropdown';
import {DropdownLegacy} from '@src/menubar/dropdown/DropdownLegacy';
import {blockquote, delay, doc, p} from '@type-editor/test-builder';
import {tempEditor} from './view';
import type {EditorView} from '@type-editor/view';

describe("MenuItem browser tests", () => {
    let view: EditorView | null = null;

    afterEach(() => {
        if (view) {
            view.destroy();
            view = null;
        }
    });

    describe("rendering in DOM", () => {
        it("should render icon in DOM", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
            });

            const { dom } = item.render(view);
            ist(dom instanceof HTMLElement, true);
            ist(dom.classList.contains("ProseMirror-icon"), true);
            const svg = dom.querySelector("svg");
            ist(svg !== null, true);
        });

        it("should render label in DOM", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const item = new MenuItem({
                run: () => {},
                label: "Test Label",
            });

            const { dom } = item.render(view);
            ist(dom instanceof HTMLElement, true);
            ist(dom.textContent, "Test Label");
        });

        it("should add title attribute to DOM element", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                title: "Bold Text",
            });

            const { dom } = item.render(view);
            ist(dom.getAttribute("title"), "Bold Text");
        });

        it("should apply CSS class to DOM element", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                class: "custom-button",
            });

            const { dom } = item.render(view);
            ist(dom.classList.contains("custom-button"), true);
        });
    });

    describe("click event handling", () => {
        it("should call run on click", async () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            let runCalled = false;
            const item = new MenuItem({
                run: () => { runCalled = true; },
                icon: icons.strong,
            });

            const { dom } = item.render(view);

            const event = new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
            });
            dom.dispatchEvent(event);

            await delay(20); // Allow any async updates to complete

            ist(runCalled, true);
        });

        it("should not call run when disabled", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            let runCalled = false;
            const item = new MenuItem({
                run: () => { runCalled = true; },
                icon: icons.strong,
                enable: () => false,
            });

            const { dom, update } = item.render(view);
            update(view.state);

            const event = new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
            });
            dom.dispatchEvent(event);

            ist(runCalled, false);
        });

        it("should prevent default on click", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
            });

            const { dom } = item.render(view);

            let defaultPrevented = false;
            const event = new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
            });
            Object.defineProperty(event, 'defaultPrevented', {
                get: () => defaultPrevented,
            });
            const originalPreventDefault = event.preventDefault;
            event.preventDefault = function() {
                defaultPrevented = true;
                originalPreventDefault.call(this);
            };

            dom.dispatchEvent(event);

            ist(defaultPrevented, true);
        });
    });

    describe("state updates", () => {
        it("should update enabled state correctly", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            let enabled = true;
            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                enable: () => enabled,
            });

            const { dom, update } = item.render(view);

            update(view.state);
            ist(dom.classList.contains("ProseMirror-menu-disabled"), false);

            enabled = false;
            update(view.state);
            ist(dom.classList.contains("ProseMirror-menu-disabled"), true);
        });

        it("should update active state correctly", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            let active = false;
            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                active: () => active,
            });

            const { dom, update } = item.render(view);

            update(view.state);
            ist(dom.classList.contains("ProseMirror-menu-active"), false);

            active = true;
            update(view.state);
            ist(dom.classList.contains("ProseMirror-menu-active"), true);
        });

        it("should update visibility correctly", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            let visible = true;
            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                select: () => visible,
            });

            const { dom, update } = item.render(view);

            update(view.state);
            ist(dom.style.display, "");

            visible = false;
            update(view.state);
            ist(dom.style.display, "none");
        });
    });

    describe("built-in menu items", () => {
        it("should render joinUpItem", () => {
            view = tempEditor({
                doc: doc(p("hello"), p("world"))
            });

            const { dom } = joinUpItem.render(view);
            ist(dom instanceof HTMLElement, true);
        });

        it("should render liftItem", () => {
            view = tempEditor({
                doc: doc(blockquote(p("hello")))
            });

            const { dom } = liftItem.render(view);
            ist(dom instanceof HTMLElement, true);
        });

        it("should render undoItem", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const { dom } = undoItem.render(view);
            ist(dom instanceof HTMLElement, true);
        });

        it("should render redoItem", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const { dom } = redoItem.render(view);
            ist(dom instanceof HTMLElement, true);
        });
    });

    describe("custom render function", () => {
        it("should use custom render function in DOM", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const customElement = document.createElement("button");
            customElement.textContent = "Custom Button";
            customElement.className = "my-custom-button";

            const item = new MenuItem({
                run: () => {},
                render: () => customElement,
            });

            const { dom } = item.render(view);
            ist(dom, customElement);
            ist(dom.textContent, "Custom Button");
            ist(dom.classList.contains("my-custom-button"), true);
        });
    });

    describe("icon rendering", () => {
        it("should render SVG icons correctly", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
            });

            const { dom } = item.render(view);
            ist(dom.classList.contains("ProseMirror-icon"), true);

            const svg = dom.querySelector("svg");
            ist(svg !== null, true);
        });

        it("should render text icons correctly", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const item = new MenuItem({
                run: () => {},
                icon: icons.testIcon,
            });

            const { dom } = item.render(view, false, true);
            ist(dom.tagName.toLowerCase(), "div");
            ist(dom.textContent?.length ?? 0 > 0, true);
        });
    });
});


describe("MenuItem WCAG browser tests", () => {
    let view: EditorView | null = null;

    afterEach(() => {
        if (view) {
            view.destroy();
            view = null;
        }
    });

    describe("button element rendering", () => {
        it("should render as button element with WCAG compliance", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                title: "Bold",
            });

            const { dom } = item.render(view);
            ist(dom.tagName, "BUTTON");
            ist(dom.classList.contains("ProseMirror-icon"), true);
        });

        it("should render hidden label for icon-only items", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                title: "Bold",
            });

            const { dom } = item.render(view);
            const wcagLabel = dom.querySelector(".wcag-label");
            
            ist(wcagLabel !== null, true);
            ist(wcagLabel?.textContent, "Bold");
        });

        it("should set aria-label on button", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                title: "Bold Text",
            });

            const { dom } = item.render(view, true);
            ist(dom.getAttribute("aria-label"), "Bold Text");
        });
    });

    describe("ARIA state attributes", () => {
        it("should update aria-disabled attribute", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            let enabled = true;
            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                title: "Bold",
                enable: () => enabled,
            });

            const { dom, update } = item.render(view, true);

            update(view.state);
            ist(dom.getAttribute("aria-disabled"), null);

            enabled = false;
            update(view.state);
            ist(dom.getAttribute("aria-disabled"), "true");

            enabled = true;
            update(view.state);
            ist(dom.getAttribute("aria-disabled"), null);
        });

        it("should update aria-pressed attribute", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            let active = false;
            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                title: "Bold",
                active: () => active,
            });

            const { dom, update } = item.render(view, true);

            update(view.state);
            ist(dom.getAttribute("aria-pressed"), "false");

            active = true;
            update(view.state);
            ist(dom.getAttribute("aria-pressed"), "true");

            active = false;
            update(view.state);
            ist(dom.getAttribute("aria-pressed"), "false");
        });
    });

    describe("SVG aria-hidden", () => {
        it("should set aria-hidden on SVG element", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                title: "Bold",
            });

            const { dom } = item.render(view, true);
            const svg = dom.querySelector("svg");
            
            ist(svg?.getAttribute("aria-hidden"), "true");
        });
    });

    describe("keyboard interaction", () => {
        it("should handle click event on button", async () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            let runCalled = false;
            const item = new MenuItem({
                run: () => { runCalled = true; },
                icon: icons.strong,
                title: "Bold",
            });

            const { dom } = item.render(view, true);

            const event = new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
            });
            dom.dispatchEvent(event);

            await delay(20); // Allow any async updates to complete

            ist(runCalled, true);
        });
    });
});

describe("Dropdown (WCAG) browser tests", () => {
    let view: EditorView | null = null;

    afterEach(() => {
        if (view) {
            view.destroy();
            view = null;
        }
    });

    describe("rendering in DOM", () => {
        it("should render dropdown button in DOM", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const items = [
                new MenuItem({ run: () => {}, label: "Item 1" }),
                new MenuItem({ run: () => {}, label: "Item 2" }),
            ];
            const dropdown = new Dropdown(items, { title: "Menu" });

            const { dom } = dropdown.render(view);
            ist(dom instanceof HTMLElement, true);
            ist(dom.tagName, "BUTTON");
            ist(dom.classList.contains("ProseMirror-menu-dropdown-wrap"), true);
        });

        it("should render submenu as ul element", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const items = [
                new MenuItem({ run: () => {}, label: "Item 1" }),
                new MenuItem({ run: () => {}, label: "Item 2" }),
            ];
            const dropdown = new Dropdown(items, { title: "Menu" });

            const { dom, update } = dropdown.render(view);

            // Add to a container in the document
            const container = document.createElement('div');
            document.body.appendChild(container);
            container.appendChild(dom);

            // Call update to trigger submenu insertion
            update(view.state);

            // Open dropdown
            const event = new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
            });
            dom.dispatchEvent(event);

            const submenu = container.querySelector("ul.ProseMirror-menu-dropdown-menu");
            ist(submenu !== null, true);

            // Cleanup
            document.body.removeChild(container);
        });

        it("should render menu items inside li elements", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const items = [
                new MenuItem({ run: () => {}, label: "Item 1" }),
                new MenuItem({ run: () => {}, label: "Item 2" }),
                new MenuItem({ run: () => {}, label: "Item 3" }),
            ];
            const dropdown = new Dropdown(items, { title: "Menu" });

            const { dom, update } = dropdown.render(view);

            // Add to a container in the document
            const container = document.createElement('div');
            document.body.appendChild(container);
            container.appendChild(dom);

            // Call update to trigger submenu insertion
            update(view.state);

            // Open dropdown
            const event = new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
            });
            dom.dispatchEvent(event);

            const listItems = container.querySelectorAll("li.ProseMirror-menu-dropdown-item");
            ist(listItems?.length, 3);

            // Cleanup
            document.body.removeChild(container);
        });

        it("should set role=menu on submenu", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const items = [
                new MenuItem({ run: () => {}, label: "Item 1" }),
            ];
            const dropdown = new Dropdown(items, { title: "Menu" });

            const { dom, update } = dropdown.render(view);

            // Add to a container in the document
            const container = document.createElement('div');
            document.body.appendChild(container);
            container.appendChild(dom);

            // Call update to trigger submenu insertion
            update(view.state);

            // Open dropdown
            dom.dispatchEvent(new Event('click'));

            const submenu = container.querySelector("ul");
            ist(submenu?.getAttribute("role"), "menu");

            // Cleanup
            document.body.removeChild(container);
        });

        it("should set role=menuitem on list items", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const items = [
                new MenuItem({ run: () => {}, label: "Item 1" }),
            ];
            const dropdown = new Dropdown(items, { title: "Menu" });

            const { dom, update } = dropdown.render(view);

            // Add to a container in the document
            const container = document.createElement('div');
            document.body.appendChild(container);
            container.appendChild(dom);

            // Call update to trigger submenu insertion
            update(view.state);

            // Open dropdown
            dom.dispatchEvent(new Event('click'));

            const listItem = container.querySelector("li");
            ist(listItem?.getAttribute("role"), "menuitem");

            // Cleanup
            document.body.removeChild(container);
        });
    });

    describe("keyboard navigation", () => {
        // Note: Enter and Space key handling is done by WcagKeyNavUtil, which triggers a click event.
        // These tests verify that the dropdown opens correctly when click is triggered.
        it("should open dropdown on click (triggered by Enter/Space via WcagKeyNavUtil)", async () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const items = [
                new MenuItem({ run: () => {}, label: "Item 1" }),
            ];
            const dropdown = new Dropdown(items, { title: "Menu" });

            const { dom, update } = dropdown.render(view);

            // Add to a container in the document
            const container = document.createElement('div');
            document.body.appendChild(container);
            container.appendChild(dom);

            // Call update to trigger submenu insertion
            update(view.state);

            // WcagKeyNavUtil converts Enter/Space to click events
            dom.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

            const submenu = container.querySelector("ul") as HTMLElement;
            ist(submenu !== null, true);
            ist(submenu?.style.display, "");

            // Cleanup
            document.body.removeChild(container);
        });

        it("should close dropdown on Escape key", async () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const items = [
                new MenuItem({ run: () => {}, label: "Item 1" }),
            ];
            const dropdown = new Dropdown(items, { title: "Menu" });

            const { dom, update } = dropdown.render(view);

            // Add to a container in the document
            const container = document.createElement('div');
            document.body.appendChild(container);
            container.appendChild(dom);

            // Call update to trigger submenu insertion
            update(view.state);

            // Open dropdown first
            dom.dispatchEvent(new Event('click'));

            const submenu = container.querySelector("ul") as HTMLElement;
            ist(submenu?.style.display, "");

            // Close with Escape
            const escapeEvent = new KeyboardEvent("keydown", {
                key: "Escape",
                bubbles: true,
                cancelable: true,
            });
            submenu.dispatchEvent(escapeEvent);

            await delay(10);
            ist(submenu.style.display, "none");

            // Cleanup
            document.body.removeChild(container);
        });

        it("should toggle dropdown on repeated clicks", async () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const items = [
                new MenuItem({ run: () => {}, label: "Item 1" }),
            ];
            const dropdown = new Dropdown(items, { title: "Menu" });

            const { dom, update } = dropdown.render(view);

            // Add to a container in the document
            const container = document.createElement('div');
            document.body.appendChild(container);
            container.appendChild(dom);

            // Call update to trigger submenu insertion
            update(view.state);

            // First click - open
            dom.dispatchEvent(new Event('click'));

            let submenu = container.querySelector("ul") as HTMLElement;
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
    });

    describe("state updates", () => {
        it("should hide dropdown button when all items are hidden", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const items = [
                new MenuItem({ run: () => {}, label: "Item 1", select: () => false }),
                new MenuItem({ run: () => {}, label: "Item 2", select: () => false }),
            ];
            const dropdown = new Dropdown(items, { title: "Menu" });

            const { dom, update } = dropdown.render(view);

            update(view.state);
            ist(dom.style.display, "none");
        });

        it("should show dropdown button when at least one item is visible", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const items = [
                new MenuItem({ run: () => {}, label: "Item 1", select: () => false }),
                new MenuItem({ run: () => {}, label: "Item 2", select: () => true }),
            ];
            const dropdown = new Dropdown(items, { title: "Menu" });

            const { dom, update } = dropdown.render(view);

            update(view.state);
            ist(dom.style.display, "");
        });
    });

    describe("submenu positioning", () => {
        it("should position submenu below dropdown button", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const items = [
                new MenuItem({ run: () => {}, label: "Item 1" }),
            ];
            const dropdown = new Dropdown(items, { title: "Menu" });

            const { dom, update } = dropdown.render(view);

            // Add to a container in the document
            const container = document.createElement('div');
            document.body.appendChild(container);
            container.appendChild(dom);

            // Call update to trigger submenu insertion
            update(view.state);

            // Open dropdown
            dom.dispatchEvent(new Event('click'));

            const submenu = container.querySelector("ul") as HTMLElement;
            ist(submenu !== null, true);
            
            // Should have positioning styles set
            const hasLeft = submenu.style.left !== "";
            const hasTop = submenu.style.top !== "";
            ist(hasLeft || hasTop, true);

            // Cleanup
            document.body.removeChild(container);
        });
    });
});

describe("Dropdown browser tests", () => {
    let view: EditorView | null = null;

    afterEach(() => {
        if (view) {
            view.destroy();
            view = null;
        }
    });

    describe("rendering in DOM", () => {
        it("should render dropdown in DOM", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const items = [
                new MenuItem({ run: () => {}, label: "Item 1" }),
                new MenuItem({ run: () => {}, label: "Item 2" }),
            ];
            const dropdown = new DropdownLegacy(items, { label: "Menu" });

            const { dom } = dropdown.render(view);
            ist(dom instanceof HTMLElement, true);

            const label = dom.querySelector(".ProseMirror-menu-dropdown");
            ist(label !== null, true);
        });

        it("should render dropdown items when opened", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const items = [
                new MenuItem({ run: () => {}, label: "Item 1" }),
                new MenuItem({ run: () => {}, label: "Item 2" }),
            ];
            const dropdown = new DropdownLegacy(items, { label: "Menu" });

            const { dom } = dropdown.render(view);
            const label = dom.querySelector(".ProseMirror-menu-dropdown") as HTMLElement;

            // Simulate click to open dropdown
            const event = new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
            });
            label.dispatchEvent(event);

            // Check that menu is now in DOM
            const menu = dom.querySelector(".ProseMirror-menu-dropdown-menu");
            ist(menu !== null, true);
        });

        it("should close dropdown on second click", async () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const items = [
                new MenuItem({ run: () => {}, label: "Item 1" }),
            ];
            const dropdown = new DropdownLegacy(items, { label: "Menu" });

            const { dom } = dropdown.render(view);
            const label = dom.querySelector(".ProseMirror-menu-dropdown") as HTMLElement;

            // Open dropdown
            const openEvent = new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
            });
            label.dispatchEvent(openEvent);

            let menu = dom.querySelector(".ProseMirror-menu-dropdown-menu");
            ist(menu !== null, true);

            // Close dropdown
            const closeEvent = new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
            });
            label.dispatchEvent(closeEvent);

            // Menu should be removed after a brief delay
            await delay(10);

            menu = dom.querySelector(".ProseMirror-menu-dropdown-menu");
            ist(menu, null);
        });
    });

    describe("dropdown interaction", () => {
        it("should render multiple dropdown items", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const items = [
                new MenuItem({ run: () => {}, label: "Item 1" }),
                new MenuItem({ run: () => {}, label: "Item 2" }),
                new MenuItem({ run: () => {}, label: "Item 3" }),
            ];
            const dropdown = new DropdownLegacy(items, { label: "Menu" });

            const { dom } = dropdown.render(view);
            const label = dom.querySelector(".ProseMirror-menu-dropdown") as HTMLElement;

            // Open dropdown
            const event = new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
            });
            label.dispatchEvent(event);

            const menuItems = dom.querySelectorAll(".ProseMirror-menu-dropdown-item");
            ist(menuItems.length, 3);
        });

        it("should apply custom class to dropdown", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const items = [
                new MenuItem({ run: () => {}, label: "Item 1" }),
            ];
            const dropdown = new DropdownLegacy(items, {
                label: "Menu",
                class: "custom-dropdown"
            });

            const { dom } = dropdown.render(view);
            const label = dom.querySelector(".ProseMirror-menu-dropdown");

            ist(label?.classList.contains("custom-dropdown"), true);
        });
    });

    describe("dropdown state updates", () => {
        it("should hide dropdown when all items are hidden", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const items = [
                new MenuItem({ run: () => {}, label: "Item 1", select: () => false }),
                new MenuItem({ run: () => {}, label: "Item 2", select: () => false }),
            ];
            const dropdown = new DropdownLegacy(items, { label: "Menu" });

            const { dom, update } = dropdown.render(view);

            update(view.state);
            ist(dom.style.display, "none");
        });

        it("should show dropdown when at least one item is visible", () => {
            view = tempEditor({
                doc: doc(p("hello"))
            });

            const items = [
                new MenuItem({ run: () => {}, label: "Item 1", select: () => false }),
                new MenuItem({ run: () => {}, label: "Item 2", select: () => true }),
            ];
            const dropdown = new DropdownLegacy(items, { label: "Menu" });

            const { dom, update } = dropdown.render(view);

            update(view.state);
            ist(dom.style.display, "");
        });
    });
});

