import {describe, it} from 'vitest';
import type {Node} from '@src/elements/Node';
import {a, doc, em, p, schema} from './helper';
import ist from "ist";
import {Schema} from "@src/schema/Schema";
import {Mark} from "@src/elements/Mark";

let em_ = schema.mark("em");
let strong = schema.mark("strong");
let link = (href: string, title?: string) => schema.mark("link", { href, title });
let code = schema.mark("code");

let customSchema: Schema = new Schema({
    nodes: { doc: { content: "paragraph+" }, paragraph: { content: "text*" }, text: {} },
    marks: {
        remark: { attrs: { id: {} }, excludes: "", inclusive: false },
        user: { attrs: { id: {} }, excludes: "_" },
        strong: { excludes: "em-group" },
        em: { group: "em-group" }
    }
}), custom = customSchema.marks;
let remark1 = custom.remark.create({ id: 1 }), remark2 = custom.remark.create({ id: 2 }),
    user1 = custom.user.create({ id: 1 }), user2 = custom.user.create({ id: 2 }),
    customEm = custom.em.create(), customStrong = custom.strong.create();

let idSchema: Schema = new Schema({
    nodes: { doc: { content: "paragraph+" }, paragraph: { content: "text*" }, text: {} },
    marks: {
        tracked: { 
            attrs: { 
                id: { default: null, excludeFromMarkupComparison: true },
                author: { validate: 'string' }
            } 
        }
    }
}), idMarks = idSchema.marks;

describe("Mark", () => {
    describe("sameSet", () => {
        it("returns true for two empty sets", () => ist(Mark.sameSet([], [])));

        it("returns true for simple identical sets", () =>
            ist(Mark.sameSet([em_, strong], [em_, strong])));

        it("returns false for different sets", () =>
            ist(!Mark.sameSet([em_, strong], [em_, code])));

        it("returns false when set size differs", () =>
            ist(!Mark.sameSet([em_, strong], [em_, strong, code])));

        it("recognizes identical links in set", () =>
            ist(Mark.sameSet([link("http://foo"), code], [link("http://foo"), code])));

        it("recognizes different links in set", () =>
            ist(!Mark.sameSet([link("http://foo"), code], [link("http://bar"), code])));
    });

    describe("eq", () => {
        it("considers identical links to be the same", () =>
            ist(link("http://foo").eq(link("http://foo"))));

        it("considers different links to differ", () =>
            ist(!link("http://foo").eq(link("http://bar"))));

        it("considers links with different titles to differ", () =>
            ist(!link("http://foo", "A").eq(link("http://foo", "B"))));
    });

    describe("addToSet", () => {
        it("can add to the empty set", () =>
            ist(em_.addToSet([]), [em_], Mark.sameSet));

        it("is a no-op when the added thing is in set", () =>
            ist(em_.addToSet([em_]), [em_], Mark.sameSet));

        it("adds marks with lower rank before others", () =>
            ist(em_.addToSet([strong]), [em_, strong], Mark.sameSet));

        it("adds marks with higher rank after others", () =>
            ist(strong.addToSet([em_]), [em_, strong], Mark.sameSet));

        it("replaces different marks with new attributes", () =>
            ist(link("http://bar").addToSet([link("http://foo"), em_]),
                [link("http://bar"), em_], Mark.sameSet));

        it("does nothing when adding an existing link", () =>
            ist(link("http://foo").addToSet([em_, link("http://foo")]),
                [em_, link("http://foo")], Mark.sameSet));

        it("puts code marks at the end", () =>
            ist(code.addToSet([em_, strong, link("http://foo")]),
                [em_, strong, link("http://foo"), code], Mark.sameSet));

        it("puts marks with middle rank in the middle", () =>
            ist(strong.addToSet([em_, code]), [em_, strong, code], Mark.sameSet));

        it("allows nonexclusive instances of marks with the same type", () =>
            ist(remark2.addToSet([remark1]), [remark1, remark2], Mark.sameSet));

        it("doesn't duplicate identical instances of nonexclusive marks", () =>
            ist(remark1.addToSet([remark1]), [remark1], Mark.sameSet));

        it("clears all others when adding a globally-excluding mark", () =>
            ist(user1.addToSet([remark1, customEm]), [user1], Mark.sameSet));

        it("does not allow adding another mark to a globally-excluding mark", () =>
            ist(customEm.addToSet([user1]), [user1], Mark.sameSet));

        it("does overwrite a globally-excluding mark when adding another instance", () =>
            ist(user2.addToSet([user1]), [user2], Mark.sameSet));

        it("doesn't add anything when another mark excludes the added mark", () =>
            ist(customEm.addToSet([remark1, customStrong]), [remark1, customStrong], Mark.sameSet));

        it("remove excluded marks when adding a mark", () =>
            ist(customStrong.addToSet([remark1, customEm]), [remark1, customStrong], Mark.sameSet));
    });

    describe("removeFromSet", () => {
        it("is a no-op for the empty set", () =>
            ist(Mark.sameSet(em_.removeFromSet([]), [])));

        it("can remove the last mark from a set", () =>
            ist(Mark.sameSet(em_.removeFromSet([em_]), [])));

        it("is a no-op when the mark isn't in the set", () =>
            ist(Mark.sameSet(strong.removeFromSet([em_]), [em_])));

        it("can remove a mark with attributes", () =>
            ist(Mark.sameSet(link("http://foo").removeFromSet([link("http://foo")]), [])));

        it("doesn't remove a mark when its attrs differ", () =>
            ist(Mark.sameSet(link("http://foo", "title").removeFromSet([link("http://foo")]),
                [link("http://foo")])));
    });

    describe("ResolvedPos.marks", () => {
        function isAt(doc: Node, mark: Mark, result: boolean) {
            ist(mark.isInSet(doc.resolve(doc.tag.a).marks()), result);
        }

        it("recognizes a mark exists inside marked text", () =>
            isAt(doc(p(em("fo<a>o"))), em_, true));

        it("recognizes a mark doesn't exist in non-marked text", () =>
            isAt(doc(p(em("fo<a>o"))), strong, false));

        it("considers a mark active after the mark", () =>
            isAt(doc(p(em("hi"), "<a> there")), em_, true));

        it("considers a mark inactive before the mark", () =>
            isAt(doc(p("one <a>", em("two"))), em_, false));

        it("considers a mark active at the start of the textblock", () =>
            isAt(doc(p(em("<a>one"))), em_, true));

        it("notices that attributes differ", () =>
            isAt(doc(p(a("li<a>nk"))), link("http://baz"), false));

        let customDoc = customSchema.node("doc", null, [
            customSchema.node("paragraph", null, [ // pos 1
                customSchema.text("one", [remark1, customStrong]), customSchema.text("two")
            ]),
            customSchema.node("paragraph", null, [ // pos 9
                customSchema.text("one"), customSchema.text("two", [remark1]), customSchema.text("three", [remark1])
            ]), // pos 22
            customSchema.node("paragraph", null, [
                customSchema.text("one", [remark2]), customSchema.text("two", [remark1])
            ])
        ]);

        it("omits non-inclusive marks at end of mark", () =>
            ist(Mark.sameSet(customDoc.resolve(4).marks(), [customStrong])));

        it("includes non-inclusive marks inside a text node", () =>
            ist(Mark.sameSet(customDoc.resolve(3).marks(), [remark1, customStrong])));

        it("omits non-inclusive marks at the end of a line", () =>
            ist(Mark.sameSet(customDoc.resolve(20).marks(), [])));

        it("includes non-inclusive marks between two marked nodes", () =>
            ist(Mark.sameSet(customDoc.resolve(15).marks(), [remark1])));

        it("excludes non-inclusive marks at a point where mark attrs change", () =>
            ist(Mark.sameSet(customDoc.resolve(25).marks(), [])));
    });

    describe("auto-generated id attribute", () => {
        it("generates an id when null is provided for id attribute with default null", () => {
            const mark1 = idMarks.tracked.create({ id: null, author: "Alice" });
            const mark2 = idMarks.tracked.create({ id: null, author: "Bob" });
            
            ist(mark1.attrs.id);
            ist(mark2.attrs.id);
            ist(typeof mark1.attrs.id, "string");
            ist(typeof mark2.attrs.id, "string");
            ist(mark1.attrs.id !== mark2.attrs.id);
        });

        it("preserves explicitly provided id values", () => {
            const mark = idMarks.tracked.create({ id: "custom-id-123", author: "Alice" });
            ist(mark.attrs.id, "custom-id-123");
        });
    });

    describe("excludeFromMarkupComparison for id attribute", () => {
        it("considers marks equal when only auto-generated ids differ", () => {
            const mark1 = idMarks.tracked.create({ id: null, author: "Alice" });
            const mark2 = idMarks.tracked.create({ id: null, author: "Alice" });
            
            // Marks should be equal because id is excluded from markup comparison
            ist(mark1.eq(mark2));
        });

        it("considers marks different when other attributes differ", () => {
            const mark1 = idMarks.tracked.create({ id: null, author: "Alice" });
            const mark2 = idMarks.tracked.create({ id: null, author: "Bob" });
            
            // Marks should differ because author is not excluded
            ist(!mark1.eq(mark2));
        });

        it("allows marks with different ids in the same set", () => {
            const mark1 = idMarks.tracked.create({ id: null, author: "Alice" });
            const mark2 = idMarks.tracked.create({ id: null, author: "Alice" });
            
            // Since they are considered equal, addToSet should return original set
            ist(mark1.addToSet([mark2]), [mark2], Mark.sameSet);
        });

        it("considers marks with explicit different ids but same other attrs as equal", () => {
            const mark1 = idMarks.tracked.create({ id: "id-1", author: "Alice" });
            const mark2 = idMarks.tracked.create({ id: "id-2", author: "Alice" });
            
            // Should still be equal because id is excluded from markup comparison
            ist(mark1.eq(mark2));
        });
    });
});
