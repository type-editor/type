import {describe, it} from 'vitest';
import ist from 'ist';
import {DecorationFactory} from '../src';
import {InlineType} from '@src/decoration/InlineType';
import {WidgetType} from '@src/decoration/WidgetType';
import {NodeType} from '@src/decoration/NodeType';

describe("DecorationFactory", () => {
    describe("createDecoration", () => {
        it("creates a decoration with inline type", () => {
            const type = new InlineType({class: "test"});
            const deco = DecorationFactory.createDecoration(5, 10, type);

            ist(deco.from, 5);
            ist(deco.to, 10);
            ist(deco.type, type);
            ist(deco.inline);
        });

        it("creates a decoration with widget type", () => {
            const type = new WidgetType(() => document.createElement("span"));
            const deco = DecorationFactory.createDecoration(5, 5, type);

            ist(deco.from, 5);
            ist(deco.to, 5);
            ist(deco.type, type);
            ist(deco.widget);
        });

        it("creates a decoration with node type", () => {
            const type = new NodeType({class: "node-test"});
            const deco = DecorationFactory.createDecoration(10, 20, type);

            ist(deco.from, 10);
            ist(deco.to, 20);
            ist(deco.type, type);
            ist(!deco.inline);
            ist(!deco.widget);
        });

        it("preserves type spec", () => {
            const attrs = {class: "highlight", style: "background: yellow"};
            const type = new InlineType(attrs);
            const deco = DecorationFactory.createDecoration(0, 10, type);

            ist((deco.type as any).attrs.class, "highlight");
            ist((deco.type as any).attrs.style, "background: yellow");
        });
    });
});

