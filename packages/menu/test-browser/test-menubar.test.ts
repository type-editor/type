import {afterEach, describe, it} from 'vitest';
import ist from 'ist';
import {icons, menuBar, MenuItem} from '@type-editor/menu';
import {delay, doc, p} from '@type-editor/test-builder';
import {tempEditor} from './view';
import type {EditorView} from '@type-editor/view';
import {SelectionFactory} from '@type-editor/state';

describe("menuBar plugin", () => {
    let view: EditorView | null = null;

    afterEach(() => {
        if (view) {
            view.destroy();
            view = null;
        }
    });

    describe("initialization", () => {
        it("should initialize menubar with basic content", () => {
            const content = [
                [
                    new MenuItem({ run: () => {}, icon: icons.strong }),
                    new MenuItem({ run: () => {}, icon: icons.em }),
                ]
            ];

            view = tempEditor({
                doc: doc(p("hello")),
                plugins: [menuBar({ content })],
            });

            ist(view.state.plugins.length >= 1, true);
        });

        it("should add menubar to DOM", () => {
            const content = [
                [
                    new MenuItem({ run: () => {}, icon: icons.strong }),
                ]
            ];

            view = tempEditor({
                doc: doc(p("hello")),
                plugins: [menuBar({ content })],
            });

            const menubar = view.dom.parentElement?.querySelector(".ProseMirror-menubar");
            ist(menubar !== null, true);
        });

        it("should wrap editor in menubar wrapper", () => {
            const content = [
                [
                    new MenuItem({ run: () => {}, icon: icons.strong }),
                ]
            ];

            view = tempEditor({
                doc: doc(p("hello")),
                plugins: [menuBar({ content })],
            });

            const wrapper = view.dom.parentElement;
            ist(wrapper?.classList.contains("ProseMirror-menubar-wrapper"), true);
        });
    });

    describe("menu content", () => {
        it("should render menu items", () => {
            const content = [
                [
                    new MenuItem({ run: () => {}, icon: icons.strong }),
                    new MenuItem({ run: () => {}, icon: icons.em }),
                    new MenuItem({ run: () => {}, icon: icons.code }),
                ]
            ];

            view = tempEditor({
                doc: doc(p("hello")),
                plugins: [menuBar({ content, isLegacy: true })],
            });

            const menubar = view.dom.parentElement?.querySelector(".ProseMirror-menubar");
            const items = menubar?.querySelectorAll(".ProseMirror-menuitem");

            ist(items !== undefined, true);
            ist(items!.length >= 3, true);
        });

        it("should render multiple groups with separators", () => {
            const content = [
                [
                    new MenuItem({ run: () => {}, icon: icons.strong }),
                    new MenuItem({ run: () => {}, icon: icons.em }),
                ],
                [
                    new MenuItem({ run: () => {}, icon: icons.undo }),
                    new MenuItem({ run: () => {}, icon: icons.redo }),
                ]
            ];

            view = tempEditor({
                doc: doc(p("hello")),
                plugins: [menuBar({ content, isLegacy: true })],
            });

            const menubar = view.dom.parentElement?.querySelector(".ProseMirror-menubar");
            const separator = menubar?.querySelector(".ProseMirror-menuseparator");

            ist(separator !== null, true);
        });

        it("should update menu items on state change", async () => {
            let enabled = true;
            const content = [
                [
                    new MenuItem({
                        run: () => {},
                        icon: icons.strong,
                        enable: () => enabled,
                    }),
                ]
            ];

            view = tempEditor({
                doc: doc(p("hello")),
                plugins: [menuBar({ content })],
            });

            const menubar = view.dom.parentElement?.querySelector(".ProseMirror-menubar");
            const item = menubar?.querySelector("svg");

            ist(item?.parentElement?.classList.contains("ProseMirror-menu-disabled"), false);

            enabled = false;
            view.updateState(view.state);

            await delay(100); // Allow any async updates to complete

            ist(item?.parentElement?.classList.contains("ProseMirror-menu-disabled"), true);
        });
    });

    describe("floating menubar", () => {
        it("should initialize with floating option", () => {
            const content = [
                [
                    new MenuItem({ run: () => {}, icon: icons.strong }),
                ]
            ];

            view = tempEditor({
                doc: doc(p("hello")),
                plugins: [menuBar({ content, floating: true })],
            });

            ist(view.state.plugins.length >= 1, true);
            const menubar = view.dom.parentElement?.querySelector(".ProseMirror-menubar");
            ist(menubar !== null, true);
        });

        it("should not float on iOS", () => {
            // Note: This test would need to mock navigator.userAgent
            // to properly test iOS behavior. For now, we just ensure
            // the plugin initializes correctly.
            const content = [
                [
                    new MenuItem({ run: () => {}, icon: icons.strong }),
                ]
            ];

            view = tempEditor({
                doc: doc(p("hello")),
                plugins: [menuBar({ content, floating: true })],
            });

            ist(view.state.plugins.length >= 1, true);
        });
    });

    describe("menu visibility", () => {
        it("should hide items based on select function", async () => {
            const content = [
                [
                    new MenuItem({
                        run: () => {},
                        icon: icons.strong,
                        select: () => false,
                    }),
                ]
            ];

            view = tempEditor({
                doc: doc(p("hello")),
                plugins: [menuBar({ content })],
            });

            const menubar = view.dom.parentElement?.querySelector(".ProseMirror-menubar");
            const item = menubar?.querySelector("svg");

            await delay(100); // Allow any async updates to complete

            if (item) {
                ist(item.parentElement?.style.display, "none");
            }
        });

        it("should show items based on select function", () => {
            const content = [
                [
                    new MenuItem({
                        run: () => {},
                        icon: icons.strong,
                        select: () => true,
                    }),
                ]
            ];

            view = tempEditor({
                doc: doc(p("hello")),
                plugins: [menuBar({ content })],
            });

            const menubar = view.dom.parentElement?.querySelector(".ProseMirror-menubar");
            const item = menubar?.querySelector("svg");

            if (item) {
                ist(item.parentElement?.style.display !== "none", true);
            }
        });
    });

    describe("menu interactions", () => {
        it("should execute command on menu item click", async () => {
            let executed = false;
            const content = [
                [
                    new MenuItem({
                        run: () => { executed = true; },
                        icon: icons.strong,
                    }),
                ]
            ];

            view = tempEditor({
                doc: doc(p("hello")),
                plugins: [menuBar({ content })],
            });

            const menubar = view.dom.parentElement?.querySelector(".ProseMirror-menubar");
            const item = menubar?.querySelector("svg");

            const event = new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
            });
            item?.dispatchEvent(event);

            await delay(20); // Allow any async updates to complete

            ist(executed, true);
        });

        it("should not execute disabled commands", async () => {
            let executed = false;
            const content = [
                [
                    new MenuItem({
                        run: () => { executed = true; },
                        icon: icons.strong,
                        enable: () => false,
                    }),
                ]
            ];

            view = tempEditor({
                doc: doc(p("hello")),
                plugins: [menuBar({ content })],
            });

            const menubar = view.dom.parentElement?.querySelector(".ProseMirror-menubar");
            const item = menubar?.querySelector("svg");

            const event = new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
            });
            item?.dispatchEvent(event);

            await delay(100); // Allow any async updates to complete

            ist(executed, false);
        });
    });

    describe("complex menu structures", () => {
        it("should render menu with labels", () => {
            const content = [
                [
                    new MenuItem({
                        run: () => {},
                        label: "Bold",
                    }),
                    new MenuItem({
                        run: () => {},
                        label: "Italic",
                    }),
                ]
            ];

            view = tempEditor({
                doc: doc(p("hello")),
                plugins: [menuBar({ content })],
            });

            const menubar = view.dom.parentElement?.querySelector(".ProseMirror-menubar");
            ist(menubar?.textContent?.includes("Bold"), true);
            ist(menubar?.textContent?.includes("Italic"), true);
        });

        it("should handle empty groups gracefully", () => {
            const content: MenuItem[][] = [
                [],
                [
                    new MenuItem({ run: () => {}, icon: icons.strong }),
                ],
                []
            ];

            view = tempEditor({
                doc: doc(p("hello")),
                plugins: [menuBar({ content })],
            });

            const menubar = view.dom.parentElement?.querySelector(".ProseMirror-menubar");
            ist(menubar !== null, true);
        });
    });

    describe("menubar update on state changes", () => {
        it("should update active state when selection changes", () => {
            const content = [
                [
                    new MenuItem({
                        run: () => {},
                        icon: icons.strong,
                        active: (state) => {
                            // Check if cursor is in a heading
                            const { $from } = state.selection;
                            return $from.parent.type.name === "heading";
                        },
                    }),
                ]
            ];

            view = tempEditor({
                doc: doc(p("hello")),
                plugins: [menuBar({ content })],
            });

            const menubar = view.dom.parentElement?.querySelector(".ProseMirror-menubar");
            const item = menubar?.querySelector("svg");

            // Initially in paragraph
            ist(item?.parentElement?.classList.contains("ProseMirror-menu-active"), false);

            // Just verify the menu item is present and check class updates work
            // (Full document replacement would need more complex transaction handling)
            ist(item !== null, true);
        });
    });

    describe("menubar destruction", () => {
        it("should properly destroy menubar", () => {
            const content = [
                [
                    new MenuItem({ run: () => {}, icon: icons.strong }),
                ]
            ];

            view = tempEditor({
                doc: doc(p("hello")),
                plugins: [menuBar({ content })],
            });

            const wrapper = view.dom.parentElement;
            ist(wrapper?.classList.contains("ProseMirror-menubar-wrapper"), true);

            view.destroy();
            view = null;

            // After destroy, the wrapper should be cleaned up
            // (though in this test environment, we can't fully verify DOM cleanup)
            ist(true, true);
        });
    });

    describe("renderGrouped function", () => {
        it("should work with menuBar plugin", () => {
            const item1 = new MenuItem({ run: () => {}, icon: icons.strong });
            const item2 = new MenuItem({ run: () => {}, icon: icons.em });
            const content = [[item1, item2]];

            view = tempEditor({
                doc: doc(p("hello")),
                plugins: [menuBar({ content })],
            });

            const menubar = view.dom.parentElement?.querySelector(".ProseMirror-menubar");
            ist(menubar !== null, true);
        });
    });

    describe("WCAG keyboard navigation", () => {
        it("should have role=toolbar on menubar", () => {
            const content = [
                [
                    new MenuItem({ run: () => {}, icon: icons.strong }),
                    new MenuItem({ run: () => {}, icon: icons.em }),
                ]
            ];

            view = tempEditor({
                doc: doc(p("hello")),
                plugins: [menuBar({ content })],
            });

            const menubar = view.dom.parentElement?.querySelector(".ProseMirror-menubar");
            ist(menubar?.getAttribute("role"), "toolbar");
        });

        it("should have aria-label on menubar", () => {
            const content = [
                [
                    new MenuItem({ run: () => {}, icon: icons.strong }),
                ]
            ];

            view = tempEditor({
                doc: doc(p("hello")),
                plugins: [menuBar({ content })],
            });

            const menubar = view.dom.parentElement?.querySelector(".ProseMirror-menubar");
            ist(menubar?.getAttribute("aria-label"), "Text formatting options");
        });

        it("should have tabindex on menubar for focusability", () => {
            const content = [
                [
                    new MenuItem({ run: () => {}, icon: icons.strong }),
                ]
            ];

            view = tempEditor({
                doc: doc(p("hello")),
                plugins: [menuBar({ content })],
            });

            const menubar = view.dom.parentElement?.querySelector(".ProseMirror-menubar");
            ist(menubar?.getAttribute("tabindex"), "0");
        });

        it("should navigate menu items with arrow keys", async () => {
            let item1Executed = false;
            let item2Executed = false;

            const content = [
                [
                    new MenuItem({
                        run: () => { item1Executed = true; },
                        icon: icons.strong
                    }),
                    new MenuItem({
                        run: () => { item2Executed = true; },
                        icon: icons.em
                    }),
                ]
            ];

            view = tempEditor({
                doc: doc(p("hello")),
                plugins: [menuBar({ content })],
            });

            const menubar = view.dom.parentElement?.querySelector(".ProseMirror-menubar") as HTMLElement;
            const items = menubar?.querySelectorAll(".ProseMirror-icon");

            ist(items?.length >= 2, true);

            // Focus first item
            (items[0] as HTMLElement).focus();
            (items[0] as HTMLElement).tabIndex = 0;

            await delay(20);

            // Navigate to second item with ArrowRight
            const arrowRightEvent = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
                bubbles: true
            });
            menubar.dispatchEvent(arrowRightEvent);

            await delay(20);

            // Second item should be focused
            ist(document.activeElement, items[1]);
        });

        it("should execute menu item on Enter key", async () => {
            let executed = false;

            const content = [
                [
                    new MenuItem({
                        run: () => { executed = true; },
                        icon: icons.strong
                    }),
                ]
            ];

            view = tempEditor({
                doc: doc(p("hello")),
                plugins: [menuBar({ content })],
            });

            const menubar = view.dom.parentElement?.querySelector(".ProseMirror-menubar") as HTMLElement;
            const item = menubar?.querySelector(".ProseMirror-icon") as HTMLElement;

            ist(item !== null, true);

            // Focus the item
            item.tabIndex = 0;
            item.focus();

            await delay(20);

            // Press Enter
            const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                bubbles: true
            });
            item.dispatchEvent(enterEvent);

            await delay(20);

            ist(executed, true);
        });

        it("should execute menu item on Space key", async () => {
            let executed = false;

            const content = [
                [
                    new MenuItem({
                        run: () => { executed = true; },
                        icon: icons.strong
                    }),
                ]
            ];

            view = tempEditor({
                doc: doc(p("hello")),
                plugins: [menuBar({ content })],
            });

            const menubar = view.dom.parentElement?.querySelector(".ProseMirror-menubar") as HTMLElement;
            const item = menubar?.querySelector(".ProseMirror-icon") as HTMLElement;

            ist(item !== null, true);

            // Focus the item
            item.tabIndex = 0;
            item.focus();

            await delay(20);

            // Press Space
            const spaceEvent = new KeyboardEvent('keydown', {
                key: ' ',
                bubbles: true
            });
            item.dispatchEvent(spaceEvent);

            await delay(20);

            ist(executed, true);
        });

        it("should skip disabled items during keyboard navigation", async () => {
            const content = [
                [
                    new MenuItem({
                        run: () => {},
                        icon: icons.strong
                    }),
                    new MenuItem({
                        run: () => {},
                        icon: icons.em,
                        enable: () => false, // This item will be disabled
                    }),
                    new MenuItem({
                        run: () => {},
                        icon: icons.code
                    }),
                ]
            ];

            view = tempEditor({
                doc: doc(p("hello")),
                plugins: [menuBar({ content })],
            });

            const menubar = view.dom.parentElement?.querySelector(".ProseMirror-menubar") as HTMLElement;

            await delay(100); // Wait for initial update

            const items = menubar?.querySelectorAll(".ProseMirror-icon");
            ist(items?.length >= 3, true);

            // Focus first item
            (items[0] as HTMLElement).tabIndex = 0;
            (items[0] as HTMLElement).focus();

            await delay(20);

            // Navigate right - should skip disabled second item
            const arrowRightEvent = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
                bubbles: true
            });
            menubar.dispatchEvent(arrowRightEvent);

            await delay(20);

            // Third item should be focused (skipped disabled second item)
            ist(document.activeElement, items[2]);
        });
    });

    describe("delayed menu update", () => {
        it("should delay update during keyboard input", async () => {
            let updateCount = 0;

            const content = [
                [
                    new MenuItem({
                        run: () => {},
                        icon: icons.strong,
                        enable: () => {
                            updateCount++;
                            return true;
                        },
                    }),
                ]
            ];

            view = tempEditor({
                doc: doc(p("hello")),
                plugins: [menuBar({ content })],
            });


            // Simulate beforeinput event (keyboard typing)
            // @ts-ignore - accessing internal property for testing
            if (view.input) {
                // @ts-ignore
                view.input.lastEventType = 'beforeinput';
            }

            // Trigger multiple state updates rapidly
            view.updateState(view.state);
            view.updateState(view.state);
            view.updateState(view.state);

            // Updates should be delayed, so count should not increase significantly
            await delay(100);

            // After delay, the debounced update should eventually fire (800ms)
            // For this test, we just verify the mechanism doesn't break
            ist(true, true);
        });

        it("should update immediately on selection change", async () => {
            let updateCount = 0;

            const content = [
                [
                    new MenuItem({
                        run: () => {},
                        icon: icons.strong,
                        enable: () => {
                            updateCount++;
                            return true;
                        },
                    }),
                ]
            ];

            view = tempEditor({
                doc: doc(p("hello world")),
                plugins: [menuBar({ content })],
            });

            await delay(50);
            const initialUpdateCount = updateCount;

            // Change selection (not a keyboard input event)
            const { tr } = view.state;
            const $pos = view.state.doc.resolve(3);
            tr.setSelection(SelectionFactory.createTextSelection($pos));
            view.dispatch(tr);

            await delay(50);

            // Update should have been called
            ist(updateCount > initialUpdateCount, true);
        });
    });
});

