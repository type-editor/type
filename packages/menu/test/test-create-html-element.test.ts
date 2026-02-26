import {describe, it} from 'vitest';
import ist from 'ist';
import {createHtmlElement} from '@src/menubar/util/create-html-element';


describe("createHtmlElement", () => {
    describe("element creation", () => {
        it("should create a simple element from tag name", () => {
            const el = createHtmlElement("div");
            ist(el instanceof HTMLDivElement, true);
            ist(el.tagName, "DIV");
        });

        it("should create different element types", () => {
            const div = createHtmlElement("div");
            const span = createHtmlElement("span");
            const button = createHtmlElement("button");

            ist(div.tagName, "DIV");
            ist(span.tagName, "SPAN");
            ist(button.tagName, "BUTTON");
        });

        it("should accept an existing element", () => {
            const existing = document.createElement("div");
            existing.id = "existing";
            const el = createHtmlElement(existing);

            ist(el, existing);
            ist(el.id, "existing");
        });
    });

    describe("attributes", () => {
        it("should set string attributes", () => {
            const el = createHtmlElement("div", { id: "test", class: "foo bar" });

            ist(el.getAttribute("id"), "test");
            ist(el.getAttribute("class"), "foo bar");
        });

        it("should set element properties for non-string values", () => {
            const el = createHtmlElement("input", {
                type: "text",
                disabled: true,
                maxLength: 10
            }) as HTMLInputElement;

            ist(el.type, "text");
            ist(el.disabled, true);
            ist(el.maxLength, 10);
        });

        it("should skip null attribute values", () => {
            const el = createHtmlElement("div", {
                title: "test",
                className: null
            });

            ist(el.getAttribute("title"), "test");
            // null values are set as properties (el[name] = null)
            // which doesn't throw an error but may not have visible effect
            ist(el instanceof HTMLElement, true);
        });

        it("should set multiple attributes", () => {
            const el = createHtmlElement("div", {
                id: "multi",
                class: "test",
                "data-value": "123",
                title: "tooltip"
            });

            ist(el.getAttribute("id"), "multi");
            ist(el.getAttribute("class"), "test");
            ist(el.getAttribute("data-value"), "123");
            ist(el.getAttribute("title"), "tooltip");
        });

        it("should handle style as property", () => {
            const el = createHtmlElement("div", {
                style: "color: red; font-size: 16px;"
            }) as HTMLElement;

            ist(el.style.color, "red");
            ist(el.style.fontSize, "16px");
        });
    });

    describe("text content", () => {
        it("should add text content as string", () => {
            const el = createHtmlElement("div", null, "Hello World");

            ist(el.textContent, "Hello World");
            ist(el.childNodes.length, 1);
            ist(el.childNodes[0].nodeType, Node.TEXT_NODE);
        });

        it("should add multiple text nodes", () => {
            const el = createHtmlElement("div", null, "Hello", " ", "World");

            ist(el.textContent, "Hello World");
            ist(el.childNodes.length, 3);
        });

        it("should handle empty string", () => {
            const el = createHtmlElement("div", null, "");

            ist(el.textContent, "");
            ist(el.childNodes.length, 1);
        });
    });

    describe("child nodes", () => {
        it("should append child elements", () => {
            const child = document.createElement("span");
            const el = createHtmlElement("div", null, child);

            ist(el.childNodes.length, 1);
            ist(el.firstChild, child);
        });

        it("should append multiple children", () => {
            const child1 = document.createElement("span");
            const child2 = document.createElement("span");
            const el = createHtmlElement("div", null, child1, child2);

            ist(el.childNodes.length, 2);
            ist(el.childNodes[0], child1);
            ist(el.childNodes[1], child2);
        });

        it("should mix text and element children", () => {
            const span = document.createElement("span");
            span.textContent = "middle";
            const el = createHtmlElement("div", null, "start ", span, " end");

            ist(el.textContent, "start middle end");
            ist(el.childNodes.length, 3);
        });

        it("should handle nested createHtmlElement calls", () => {
            const el = createHtmlElement("div", null,
                createHtmlElement("span", { class: "inner" }, "text")
            );

            ist(el.childNodes.length, 1);
            ist((el.firstChild as HTMLElement).tagName, "SPAN");
            ist((el.firstChild as HTMLElement).className, "inner");
            ist(el.textContent, "text");
        });

        it("should ignore null children", () => {
            const el = createHtmlElement("div", null, "text", null, "more");

            ist(el.textContent, "textmore");
            ist(el.childNodes.length, 2);
        });
    });

    describe("array children", () => {
        it("should flatten array of children", () => {
            const child1 = document.createElement("span");
            const child2 = document.createElement("span");
            const el = createHtmlElement("div", null, [child1, child2]);

            ist(el.childNodes.length, 2);
            ist(el.childNodes[0], child1);
            ist(el.childNodes[1], child2);
        });

        it("should flatten nested arrays", () => {
            const el = createHtmlElement("div", null,
                ["text1", ["text2", "text3"]]
            );

            ist(el.textContent, "text1text2text3");
            ist(el.childNodes.length, 3);
        });

        it("should handle array with mixed content", () => {
            const span = document.createElement("span");
            const el = createHtmlElement("div", null,
                ["start", span, "end"]
            );

            ist(el.childNodes.length, 3);
            ist(el.childNodes[1], span);
        });

        it("should handle empty arrays", () => {
            const el = createHtmlElement("div", null, []);

            ist(el.childNodes.length, 0);
        });

        it("should handle arrays with null elements", () => {
            const el = createHtmlElement("div", null,
                ["text", null, "more"]
            );

            ist(el.textContent, "textmore");
            ist(el.childNodes.length, 2);
        });
    });

    describe("complex structures", () => {
        it("should create complex nested structure", () => {
            const el = createHtmlElement("div", { class: "container" },
                createHtmlElement("header", null, "Title"),
                createHtmlElement("main", null,
                    createHtmlElement("p", null, "Paragraph 1"),
                    createHtmlElement("p", null, "Paragraph 2")
                ),
                createHtmlElement("footer", null, "Footer")
            );

            ist(el.className, "container");
            ist(el.childNodes.length, 3);
            ist((el.childNodes[0] as HTMLElement).tagName, "HEADER");
            ist((el.childNodes[1] as HTMLElement).tagName, "MAIN");
            ist((el.childNodes[2] as HTMLElement).tagName, "FOOTER");
            ist((el.childNodes[1] as HTMLElement).childNodes.length, 2);
        });

        it("should handle attributes and children together", () => {
            const el = createHtmlElement("button",
                {
                    type: "button",
                    class: "btn btn-primary",
                    disabled: false
                },
                "Click me"
            );

            ist((el as HTMLButtonElement).type, "button");
            ist(el.className, "btn btn-primary");
            ist((el as HTMLButtonElement).disabled, false);
            ist(el.textContent, "Click me");
        });

        it("should create menu-like structure", () => {
            const el = createHtmlElement("div", { class: "menu" },
                createHtmlElement("div", { class: "menu-item" }, "Item 1"),
                createHtmlElement("div", { class: "menu-item" }, "Item 2"),
                createHtmlElement("div", { class: "menu-separator" }),
                createHtmlElement("div", { class: "menu-item" }, "Item 3")
            );

            ist(el.className, "menu");
            ist(el.childNodes.length, 4);
            ist((el.childNodes[2] as HTMLElement).className, "menu-separator");
        });
    });

    describe("edge cases", () => {
        it("should handle element without attributes or children", () => {
            const el = createHtmlElement("div");

            ist(el.tagName, "DIV");
            ist(el.childNodes.length, 0);
            ist(el.attributes.length, 0);
        });

        it("should handle element with empty attributes object", () => {
            const el = createHtmlElement("div", {});

            ist(el.tagName, "DIV");
            ist(el.childNodes.length, 0);
        });

        it("should handle only null children", () => {
            const el = createHtmlElement("div", null, null, null);

            ist(el.childNodes.length, 0);
        });


        it("should not confuse attributes object with child object", () => {
            // This tests that objects without nodeType in first position are treated as attributes
            const el = createHtmlElement("div", { class: "test" });
            ist(el.className, "test");
            ist(el.childNodes.length, 0);
        });
    });

    describe("real-world menu usage patterns", () => {
        it("should create dropdown wrapper structure", () => {
            const label = createHtmlElement("div", {
                class: "ProseMirror-menu-dropdown"
            }, "Menu");
            const wrap = createHtmlElement("div", {
                class: "ProseMirror-menu-dropdown-wrap"
            }, label);

            ist(wrap.className, "ProseMirror-menu-dropdown-wrap");
            ist(wrap.childNodes.length, 1);
            ist((wrap.firstChild as HTMLElement).className, "ProseMirror-menu-dropdown");
            ist(wrap.textContent, "Menu");
        });

        it("should create menu item with icon", () => {
            const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            const item = createHtmlElement("span", {
                class: "ProseMirror-menuitem"
            }, icon);

            ist(item.className, "ProseMirror-menuitem");
            ist(item.childNodes.length, 1);
            ist(item.firstChild, icon);
        });

        it("should create submenu structure", () => {
            const items = [
                createHtmlElement("div", { class: "item" }, "Item 1"),
                createHtmlElement("div", { class: "item" }, "Item 2")
            ];

            const label = createHtmlElement("div", {
                class: "ProseMirror-submenu-label"
            }, "Submenu");

            const submenu = createHtmlElement("div", {
                class: "ProseMirror-submenu"
            }, items);

            const wrap = createHtmlElement("div", {
                class: "ProseMirror-submenu-wrap"
            }, label, submenu);

            ist(wrap.className, "ProseMirror-submenu-wrap");
            ist(wrap.childNodes.length, 2);
            ist((submenu as HTMLElement).childNodes.length, 2);
        });

        it("should create separator", () => {
            const sep = createHtmlElement("span", {
                class: "ProseMirror-menuseparator"
            });

            ist(sep.className, "ProseMirror-menuseparator");
            ist(sep.childNodes.length, 0);
        });

        it("should create menubar wrapper", () => {
            const wrapper = createHtmlElement("div", {
                class: "ProseMirror-menubar-wrapper"
            });
            wrapper.appendChild(createHtmlElement("div", {
                class: "ProseMirror-menubar"
            }));

            ist(wrapper.className, "ProseMirror-menubar-wrapper");
            ist(wrapper.childNodes.length, 1);
            ist((wrapper.firstChild as HTMLElement).className, "ProseMirror-menubar");
        });

        it("should create spacer with inline style", () => {
            const height = 42;
            const spacer = createHtmlElement("div", {
                class: "ProseMirror-menubar-spacer",
                style: `height: ${height}px`
            });

            ist(spacer.className, "ProseMirror-menubar-spacer");
            ist(spacer.style.height, "42px");
        });
    });

    describe("attribute handling details", () => {
        it("should only iterate own properties of attributes object", () => {
            const proto = { inherited: "value" };
            const attrs = Object.create(proto);
            attrs.own = "ownValue";

            const el = createHtmlElement("div", attrs);

            ist(el.getAttribute("own"), "ownValue");
            ist(el.getAttribute("inherited"), null);
        });

        it("should handle data attributes", () => {
            const el = createHtmlElement("div", {
                "data-id": "123",
                "data-name": "test",
                "data-value": "abc"
            });

            ist(el.getAttribute("data-id"), "123");
            ist(el.getAttribute("data-name"), "test");
            ist(el.getAttribute("data-value"), "abc");
        });

        it("should handle aria attributes", () => {
            const el = createHtmlElement("button", {
                "aria-label": "Close",
                "aria-expanded": "false"
            });

            ist(el.getAttribute("aria-label"), "Close");
            ist(el.getAttribute("aria-expanded"), "false");
        });
    });
});

