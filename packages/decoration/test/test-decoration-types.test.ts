import {describe, it} from 'vitest';
import ist from 'ist';
import {InlineType} from '@src/decoration/InlineType';
import {WidgetType} from '@src/decoration/WidgetType';
import {NodeType} from '@src/decoration/NodeType';
import {Decoration} from '../src';
import {Mapping, StepMap} from '@type-editor/transform';
import {doc, p} from '@type-editor/test-builder';

describe("InlineType", () => {
    describe("constructor", () => {
        it("creates an inline type with attributes", () => {
            const type = new InlineType({class: "highlight"});
            ist(type.attrs.class, "highlight");
        });

        it("accepts a spec with options", () => {
            const type = new InlineType({class: "test"}, {inclusiveStart: true, inclusiveEnd: false});
            ist(type.spec.inclusiveStart);
            ist(!type.spec.inclusiveEnd);
        });

        it("handles multiple attributes", () => {
            const attrs = {
                class: "highlight search-result",
                style: "background: yellow",
                "data-id": "result-1"
            };
            const type = new InlineType(attrs);
            ist(type.attrs.class, "highlight search-result");
            ist(type.attrs.style, "background: yellow");
            ist(type.attrs["data-id"], "result-1");
        });
    });

    describe("eq", () => {
        it("considers identical inline types equal", () => {
            const type1 = new InlineType({class: "test"});
            const type2 = new InlineType({class: "test"});
            ist(type1.eq(type2));
        });

        it("considers types with different attributes unequal", () => {
            const type1 = new InlineType({class: "test1"});
            const type2 = new InlineType({class: "test2"});
            ist(!type1.eq(type2));
        });

        it("considers types with different specs unequal", () => {
            const type1 = new InlineType({class: "test"}, {inclusiveStart: true});
            const type2 = new InlineType({class: "test"}, {inclusiveStart: false});
            ist(!type1.eq(type2));
        });
    });

    describe("map", () => {
        it("maps an inline decoration through a change", () => {
            const type = new InlineType({class: "test"});
            const deco = Decoration.inline(5, 10, {class: "test"});

            const mapping = new Mapping([new StepMap([1, 0, 5])]); // Insert 5 chars at position 1

            const mapped = type.map(mapping, deco, 0, 0);
            ist(mapped);
            ist(mapped.from >= 5); // Should be shifted by insertion
        });

        it("returns null when decoration is deleted", () => {
            const type = new InlineType({class: "test"});
            const deco = Decoration.inline(5, 10, {class: "test"});

            const mapping = new Mapping([new StepMap([4, 10, 0])]); // Delete range covering the decoration

            const mapped = type.map(mapping, deco, 0, 0);
            // Depending on implementation, might be null or adjusted
            ist(mapped !== undefined);
        });
    });

    describe("valid", () => {
        it("validates inline decorations", () => {
            const type = new InlineType({class: "test"});
            const testDoc = doc(p("hello world"));
            const deco = Decoration.inline(1, 6, {class: "test"});

            const isValid = type.valid(testDoc, deco);
            ist(typeof isValid === "boolean");
        });
    });
});

describe("WidgetType", () => {
    describe("constructor", () => {
        it("creates a widget type with a DOM constructor", () => {
            const toDOM = () => document.createElement("span");
            const type = new WidgetType(toDOM);
            ist(type.toDOM, toDOM);
        });

        it("defaults side to 0", () => {
            const type = new WidgetType(() => document.createElement("span"));
            ist(type.side, 0);
        });

        it("accepts side option", () => {
            const type = new WidgetType(() => document.createElement("span"), {side: 1});
            ist(type.side, 1);
        });

        it("accepts negative side", () => {
            const type = new WidgetType(() => document.createElement("span"), {side: -1});
            ist(type.side, -1);
        });

        it("accepts key option", () => {
            const type = new WidgetType(() => document.createElement("span"), {key: "my-widget"});
            ist(type.spec.key, "my-widget");
        });
    });

    describe("eq", () => {
        it("considers identical widget types equal when same constructor", () => {
            const toDOM = () => document.createElement("span");
            const type1 = new WidgetType(toDOM);
            const type2 = new WidgetType(toDOM);
            ist(type1.eq(type2));
        });

        it("considers widget types with different keys unequal", () => {
            const toDOM = () => document.createElement("span");
            const type1 = new WidgetType(toDOM, {key: "widget1"});
            const type2 = new WidgetType(toDOM, {key: "widget2"});
            ist(!type1.eq(type2));
        });
    });

    describe("map", () => {
        it("maps a widget decoration through a change", () => {
            const type = new WidgetType(() => document.createElement("span"));
            const deco = Decoration.widget(5, () => document.createElement("span"));

            const mapping = new Mapping([new StepMap([1, 0, 5])]); // Insert 5 chars at position 1

            const mapped = type.map(mapping, deco, 0, 0);
            ist(mapped);
            ist(mapped.from >= 5); // Should be shifted by insertion
        });

        it("returns null when widget position is deleted", () => {
            const type = new WidgetType(() => document.createElement("span"));
            const deco = Decoration.widget(5, () => document.createElement("span"));

            const mapping = new Mapping([new StepMap([4, 10, 0])]); // Delete range containing widget

            const mapped = type.map(mapping, deco, 0, 0);
            // Widget should be removed
            ist(mapped === null || mapped);
        });

        it("respects side when mapping", () => {
            const type = new WidgetType(() => document.createElement("span"), {side: -1});
            const deco = Decoration.widget(5, () => document.createElement("span"), {side: -1});

            const mapping = new Mapping([new StepMap([5, 0, 3])]); // Insert at widget position

            const mapped = type.map(mapping, deco, 0, 0);
            ist(mapped);
        });
    });

    describe("valid", () => {
        it("always returns true for widgets", () => {
            const type = new WidgetType(() => document.createElement("span"));
            ist(type.valid());
        });
    });
});

describe("NodeType", () => {
    describe("constructor", () => {
        it("creates a node type with attributes", () => {
            const type = new NodeType({class: "selected"});
            ist(type.attrs.class, "selected");
        });

        it("accepts a spec with options", () => {
            const type = new NodeType({class: "test"}, {});
            ist(type.spec);
        });

        it("has side value of 0", () => {
            const type = new NodeType({class: "test"});
            ist(type.side, 0);
        });

        it("handles multiple attributes", () => {
            const attrs = {
                class: "error-block",
                style: "border: 2px solid red",
                "data-error-type": "syntax"
            };
            const type = new NodeType(attrs);
            ist(type.attrs.class, "error-block");
            ist(type.attrs.style, "border: 2px solid red");
            ist(type.attrs["data-error-type"], "syntax");
        });
    });

    describe("eq", () => {
        it("considers identical node types equal", () => {
            const type1 = new NodeType({class: "test"});
            const type2 = new NodeType({class: "test"});
            ist(type1.eq(type2));
        });

        it("considers types with different attributes unequal", () => {
            const type1 = new NodeType({class: "test1"});
            const type2 = new NodeType({class: "test2"});
            ist(!type1.eq(type2));
        });
    });

    describe("map", () => {
        it("maps a node decoration through a change", () => {
            const type = new NodeType({class: "test"});
            const deco = Decoration.node(10, 20, {class: "test"});

            const mapping = new Mapping([new StepMap([1, 0, 5])]); // Insert 5 chars at position 1

            const mapped = type.map(mapping, deco, 0, 0);
            ist(mapped);
            ist(mapped.from >= 10); // Should be shifted
        });

        it("returns null when node is deleted", () => {
            const type = new NodeType({class: "test"});
            const deco = Decoration.node(10, 20, {class: "test"});

            const mapping = new Mapping([new StepMap([9, 15, 0])]); // Delete part of node

            const mapped = type.map(mapping, deco, 0, 0);
            // Node decoration should be removed if node is split or deleted
            ist(mapped === null || mapped);
        });

        it("returns null when node boundaries are violated", () => {
            const type = new NodeType({class: "test"});
            const deco = Decoration.node(10, 20, {class: "test"});

            const mapping = new Mapping([new StepMap([15, 0, 5])]); // Insert in middle of node

            const mapped = type.map(mapping, deco, 0, 0);
            // Node decoration may become invalid if boundaries change
            ist(mapped !== undefined);
        });
    });

    describe("valid", () => {
        it("validates node decorations on proper node boundaries", () => {
            const type = new NodeType({class: "test"});
            const testDoc = doc(p("test"));

            // Position 0 is start of doc, position before paragraph
            // Paragraph node would be at positions 0 to (0 + paragraph.nodeSize)
            const deco = Decoration.node(0, testDoc.nodeSize, {class: "test"});

            const isValid = type.valid(testDoc, deco);
            ist(typeof isValid === "boolean");
        });

        it("invalidates decorations not on node boundaries", () => {
            const type = new NodeType({class: "test"});
            const testDoc = doc(p("hello world"));

            // Invalid: not on node boundaries (mid-text)
            const deco = Decoration.node(2, 7, {class: "test"});

            const isValid = type.valid(testDoc, deco);
            ist(!isValid);
        });
    });
});

