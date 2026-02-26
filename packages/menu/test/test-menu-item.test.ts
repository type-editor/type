import {describe, it} from 'vitest';
import ist from 'ist';
import {doc, h1, p, schema} from '@type-editor/test-builder';
import {EditorState} from '@type-editor/state';
import type {PmEditorView} from "@type-editor/editor-types";
import {icons} from "@src/menubar/icons/icons";
import {MenuItem} from "@src/menubar/MenuItem";
import {wrapItem} from "@src/menu-items/util/wrap-item";
import {blockTypeItem} from "@src/menu-items/util/block-type-item";

describe("MenuItem", () => {
    const createMockView = (state: EditorState): PmEditorView => {
        return {
            state,
            dispatch: () => {},
            root: document,
            _props: {},
            props: {},
        } as unknown as PmEditorView;
    };

    describe("constructor", () => {
        it("should create a menu item with spec", () => {
            const spec = {
                run: () => {},
                icon: icons.strong,
            };
            const item = new MenuItem(spec);
            ist(item.spec, spec);
        });
    });

    describe("render", () => {
        it("should render with icon", () => {
            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom } = item.render(view);

            ist(dom instanceof HTMLElement, true);
            ist(dom.classList.contains("ProseMirror-icon"), true);
            const svg = dom.querySelector("svg");
            ist(svg !== null, true);
        });

        it("should render with label", () => {
            const item = new MenuItem({
                run: () => {},
                label: "Test Label",
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = item.render(view);

            ist(dom instanceof HTMLElement, true);
            ist(dom.textContent, "Test Label");
        });

        it("should throw error when no icon or label provided", () => {
            const item = new MenuItem({
                run: () => {},
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);

            let error: Error | null = null;
            try {
                item.render(view);
            } catch (e) {
                error = e as Error;
            }
            ist(error instanceof RangeError, true);
        });

        it("should set title attribute", () => {
            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                title: "Test Title",
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom } = item.render(view);

            ist(dom.getAttribute("title"), "Test Title");
        });

        it("should set title attribute from function", () => {
            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                title: () => "Dynamic Title",
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom } = item.render(view);

            ist(dom.getAttribute("title"), "Dynamic Title");
        });

        it("should add CSS class", () => {
            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                class: "custom-class",
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom } = item.render(view);

            ist(dom.classList.contains("custom-class"), true);
        });

        it("should add inline CSS", () => {
            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                css: "color: red;",
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom } = item.render(view);

            ist(dom.style.cssText.includes("color"), true);
        });

        it("should use custom render function", () => {
            const customElement = document.createElement("span");
            customElement.textContent = "Custom";

            const item = new MenuItem({
                run: () => {},
                render: () => customElement,
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom } = item.render(view);

            ist(dom, customElement);
        });
    });

    describe("update function", () => {
        it("should hide item when select returns false", () => {
            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                select: (state) => false,
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = item.render(view);

            const result = update(state);
            ist(result, false);
            ist(dom.style.display, "none");
        });

        it("should show item when select returns true", () => {
            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                select: (state) => true,
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = item.render(view);

            const result = update(state);
            ist(result, true);
            ist(dom.style.display, "");
        });

        it("should disable item when enable returns false", () => {
            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                enable: (state) => false,
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = item.render(view);

            update(state);
            ist(dom.classList.contains("ProseMirror-menu-disabled"), true);
        });

        it("should enable item when enable returns true", () => {
            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                enable: (state) => true,
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = item.render(view);

            update(state);
            ist(dom.classList.contains("ProseMirror-menu-disabled"), false);
        });

        it("should mark item as active when active returns true", () => {
            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                active: (state) => true,
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = item.render(view);

            update(state);
            ist(dom.classList.contains("ProseMirror-menu-active"), true);
        });

        it("should not mark disabled item as active", () => {
            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                enable: (state) => false,
                active: (state) => true,
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = item.render(view);

            update(state);
            ist(dom.classList.contains("ProseMirror-menu-active"), false);
        });
    });

    describe("icon specs", () => {
        it("should have all required icons", () => {
            ist(!!icons.join, true);
            ist(!!icons.lift, true);
            ist(!!icons.selectParentNode, true);
            ist(!!icons.undo, true);
            ist(!!icons.redo, true);
            ist(!!icons.strong, true);
            ist(!!icons.em, true);
            ist(!!icons.code, true);
            ist(!!icons.link, true);
            ist(!!icons.bulletList, true);
            ist(!!icons.orderedList, true);
            ist(!!icons.blockquote, true);
        });

        it("should have valid SVG icon structure for join", () => {
            const icon = icons.join as any;
            ist(typeof icon.path, "string");
            ist(typeof icon.width, "number");
            ist(typeof icon.height, "number");
        });

        it("should have valid text icon structure for text icon", () => {
            const icon = icons.testIcon as any;
            ist(typeof icon.text, "string");
        });
    });
});

describe("wrapItem", () => {
    it("should create a menu item that wraps selection", () => {
        const nodeType = schema.nodes.blockquote;
        const item = wrapItem(nodeType, { icon: icons.blockquote });

        ist(item instanceof MenuItem, true);
        ist(!!item.spec.run, true);
        ist(!!item.spec.select, true);
    });

    it("should pass attributes to wrap command", () => {
        const nodeType = schema.nodes.blockquote;
        const attrs = { class: "quote" };
        const item = wrapItem(nodeType, { icon: icons.blockquote, attrs });

        ist(item instanceof MenuItem, true);
    });

    it("should preserve additional options", () => {
        const nodeType = schema.nodes.blockquote;
        const item = wrapItem(nodeType, {
            icon: icons.blockquote,
            title: "Blockquote",
            class: "wrap-button",
        });

        ist(item.spec.title, "Blockquote");
        ist(item.spec.class, "wrap-button");
    });
});

describe("blockTypeItem", () => {
    it("should create a menu item that changes block type", () => {
        const nodeType = schema.nodes.heading;
        const item = blockTypeItem(nodeType, {
            icon: icons.strong,
            attrs: { level: 1 },
        });

        ist(item instanceof MenuItem, true);
        ist(!!item.spec.run, true);
        ist(!!item.spec.enable, true);
        ist(!!item.spec.active, true);
    });

    it("should preserve additional options", () => {
        const nodeType = schema.nodes.heading;
        const item = blockTypeItem(nodeType, {
            icon: icons.strong,
            attrs: { level: 1 },
            title: "Heading 1",
            class: "h1-button",
        });

        ist(item.spec.title, "Heading 1");
        ist(item.spec.class, "h1-button");
    });

    it("should check active state correctly", () => {
        const nodeType = schema.nodes.heading;
        const item = blockTypeItem(nodeType, {
            icon: icons.strong,
            attrs: { level: 1 },
        });

        const state = EditorState.create({
            doc: doc(h1("hello")),
            schema
        });

        ist(item.spec.active!(state), true);
    });
});

describe("MenuItem WCAG Compliance", () => {
    const createMockView = (state: EditorState): PmEditorView => {
        return {
            state,
            dispatch: () => {},
            root: document,
            _props: {},
            props: {},
        } as unknown as PmEditorView;
    };

    describe("WCAG button element rendering", () => {
        it("should render as button element when isLegacy=false (default)", () => {
            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                title: "Bold",
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom } = item.render(view);

            ist(dom.tagName, "BUTTON");
        });

        it("should render as div element when isLegacy=true (backward compatibility)", () => {
            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom } = item.render(view, false, true);

            ist(dom.tagName, "DIV");
        });

        it("should set aria-label attribute", () => {
            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                title: "Bold Text",
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom } = item.render(view);

            ist(dom.getAttribute("aria-label"), "Bold Text");
        });

        it("should set aria-disabled to true when disabled", () => {
            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                title: "Bold",
                enable: () => false,
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = item.render(view);

            update(state);
            ist(dom.getAttribute("aria-disabled"), "true");
        });

        it("should remove aria-disabled when enabled", () => {
            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                title: "Bold",
                enable: () => true,
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = item.render(view);

            update(state);
            ist(dom.getAttribute("aria-disabled"), null);
        });

        it("should set aria-pressed to true when active", () => {
            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                title: "Bold",
                active: () => true,
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = item.render(view);

            update(state);
            ist(dom.getAttribute("aria-pressed"), "true");
        });

        it("should set aria-pressed to false when not active", () => {
            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                title: "Bold",
                active: () => false,
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom, update } = item.render(view);

            update(state);
            ist(dom.getAttribute("aria-pressed"), "false");
        });
    });

    describe("WCAG hidden label for icon-only items", () => {
        it("should add hidden wcag-label span for icon-only items", () => {
            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                title: "Bold",
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom } = item.render(view);

            const wcagLabel = dom.querySelector(".wcag-label");
            ist(wcagLabel !== null, true);
            ist(wcagLabel?.textContent, "Bold");
        });

        it("should set aria-hidden=true on SVG element", () => {
            const item = new MenuItem({
                run: () => {},
                icon: icons.strong,
                title: "Bold",
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom } = item.render(view);

            const svg = dom.querySelector("svg");
            ist(svg?.getAttribute("aria-hidden"), "true");
        });

        it("should not add wcag-label for text-only items", () => {
            const item = new MenuItem({
                run: () => {},
                label: "Bold",
            });

            const state = EditorState.create({ doc: doc(p("hello")), schema });
            const view = createMockView(state);
            const { dom } = item.render(view);

            const wcagLabel = dom.querySelector(".wcag-label");
            ist(wcagLabel, null);
        });
    });
});

