import {describe, it} from 'vitest';
import {type Command, EditorState, Selection, SelectionFactory} from '@type-editor/state';
import {blockquote, doc, eq, li, ol, p, schema, ul} from '@type-editor/test-builder';
import ist from "ist";
import type {Node} from '@type-editor/model';
import {wrapInList} from "@src/list-commands/wrap-in-list";
import {splitListItem} from "@src/list-commands/split-list-item";
import {liftListItem} from "@src/list-commands/lift-list-item";
import {sinkListItem} from "@src/list-commands/sink-list-item";

function selFor(doc: Node) {
    let a = doc.tag.a, b = doc.tag.b;
    if (a != null) {
        let $a = doc.resolve(a);
        if ($a.parent.inlineContent) return SelectionFactory.createTextSelection($a, b != null ? doc.resolve(b) : undefined);
        else return SelectionFactory.createNodeSelection($a);
    }
    return Selection.atStart(doc);
}

function apply(doc: Node, command: Command, result: Node | null) {
    let state = EditorState.create({ doc, selection: selFor(doc) });
    command(state, tr => state = state.apply(tr));
    ist(state.doc, result || doc, eq);
    if (result && result.tag.a != null) ist(state.selection, selFor(result), eq);
}

function applyWithAllSelection(docNode: Node, command: Command, result: Node | null) {
    let state = EditorState.create({ doc: docNode, selection: SelectionFactory.createAllSelection(docNode) });
    command(state, tr => state = state.apply(tr));
    ist(state.doc, result || docNode, eq);
}

describe("wrapInList", () => {
    let wrap = wrapInList(schema.nodes.bullet_list);
    let wrapo = wrapInList(schema.nodes.ordered_list);

    it("can wrap a paragraph", () =>
        apply(doc(p("<a>foo")), wrap, doc(ul(li(p("foo"))))));

    it("can wrap a nested paragraph", () =>
        apply(doc(blockquote(p("<a>foo"))), wrapo, doc(blockquote(ol(li(p("foo")))))));

    it("can wrap multiple paragraphs", () =>
        apply(doc(p("foo"), p("ba<a>r"), p("ba<b>z")), wrap,
            doc(p("foo"), ul(li(p("bar")), li(p("baz"))))));

    it("unwraps when already in a bullet list (toggle off)", () =>
        apply(doc(ul(li(p("<a>foo")))), wrap, doc(p("foo"))));

    it("unwraps when already in an ordered list (toggle off)", () =>
        apply(doc(ol(li(p("<a>foo")))), wrapo, doc(p("foo"))));

    it("unwraps entire list when selection is in second paragraph (toggle off)", () =>
        apply(doc(ul(li(p("foo"), p("<a>bar")))), wrap, doc(p("foo"), p("bar"))));

    it("converts list type when cursor is in any list item", () =>
        apply(doc(ul(li(p("foo")), li(p("<a>bar")), li(p("baz")))), wrapo,
            doc(ol(li(p("foo")), li(p("bar")), li(p("baz"))))));

    it("only splits items where valid", () =>
        apply(doc(p("<a>one"), ol(li("two")), p("three<b>")), wrapo,
            doc(ol(li(p("one"), ol(li("two"))), li(p("three"))))));

    it("converts bullet list to ordered list", () =>
        apply(doc(ul(li(p("<a>foo")))), wrapo, doc(ol(li(p("foo"))))));

    it("converts ordered list to bullet list", () =>
        apply(doc(ol(li(p("<a>foo")))), wrap, doc(ul(li(p("foo"))))));

    it("converts bullet list with multiple items to ordered list", () =>
        apply(doc(ul(li(p("<a>one")), li(p("two")), li(p("three")))), wrapo,
            doc(ol(li(p("one")), li(p("two")), li(p("three"))))));

    it("converts ordered list with multiple items to bullet list", () =>
        apply(doc(ol(li(p("<a>one")), li(p("two")), li(p("three")))), wrap,
            doc(ul(li(p("one")), li(p("two")), li(p("three"))))));

    it("converts nested ordered list to bullet list without affecting outer list", () =>
        apply(doc(ul(li(p("outer"), ol(li(p("<a>inner")))))), wrap,
            doc(ul(li(p("outer"), ul(li(p("inner"))))))));

    it("converts nested bullet list to ordered list without affecting outer list", () =>
        apply(doc(ol(li(p("outer"), ul(li(p("<a>inner")))))), wrapo,
            doc(ol(li(p("outer"), ol(li(p("inner"))))))));

    it("lifts inner list items to outer list when toggling off in nested structure", () =>
        apply(doc(ul(li(p("outer"), ul(li(p("<a>inner1")), li(p("inner2")))))), wrap,
            doc(ul(li(p("outer")), li(p("inner1")), li(p("inner2"))))));

    it("lifts inner ordered list items to outer ordered list when toggling off", () =>
        apply(doc(ol(li(p("outer"), ol(li(p("<a>inner")))))), wrapo,
            doc(ol(li(p("outer")), li(p("inner"))))));

    it("unwraps when entire document is selected (AllSelection) with bullet list", () =>
        applyWithAllSelection(doc(ul(li(p("foo")), li(p("bar")))), wrap,
            doc(p("foo"), p("bar"))));

    it("unwraps when entire document is selected (AllSelection) with ordered list", () =>
        applyWithAllSelection(doc(ol(li(p("foo")), li(p("bar")))), wrapo,
            doc(p("foo"), p("bar"))));

    it("converts list type when entire document is selected (AllSelection)", () =>
        applyWithAllSelection(doc(ul(li(p("foo")), li(p("bar")))), wrapo,
            doc(ol(li(p("foo")), li(p("bar"))))));
});

describe("splitListItem", () => {
    let split = splitListItem(schema.nodes.list_item);

    it("has no effect outside of a list", () =>
        apply(doc(p("foo<a>bar")), split, null));

    it("has no effect on the top level", () =>
        apply(doc("<a>", p("foobar")), split, null));

    it("has no effect in an empty top-level list item", () =>
        apply(doc(ul(li(p("hello")), li(p("<a>")))), split, null));

    it("can split a list item", () =>
        apply(doc(ul(li(p("foo<a>bar")))), split, doc(ul(li(p("foo")), li(p("bar"))))));

    it("can split a list item at the end", () =>
        apply(doc(ul(li(p("foobar<a>")))), split, doc(ul(li(p("foobar")), li(p())))));

    it("deletes selected content", () =>
        apply(doc(ul(li(p("foo<a>ba<b>r")))), split,
            doc(ul(li(p("foo")), li(p("r"))))));

    it("splits when lifting from a nested list", () =>
        apply(doc(ul(li(p("a"), ul(li(p("b")), li(p("<a>"))))), p("x")), split,
            doc(ul(li(p("a"), ul(li(p("b")))), li(p("<a>"))), p("x"))));

    it("can lift from a continued nested list item", () =>
        apply(doc(ul(li(p("a"), ul(li(p("b")), li(p("ok"), p("<a>"))))), p("x")), split,
            doc(ul(li(p("a"), ul(li(p("b")), li(p("ok")))), li(p("<a>"))), p("x"))));

    it("correctly lifts an entirely empty sublist", () =>
        apply(doc(ul(li(p("one"), ul(li(p("<a>"))), p("two")))), split,
            doc(ul(li(p("one")), li(p("<a>")), li(p("two"))))));
});

describe("liftListItem", () => {
    let lift = liftListItem(schema.nodes.list_item);

    it("can lift from a nested list", () =>
        apply(doc(ul(li(p("hello"), ul(li(p("o<a><b>ne")), li(p("two")))))), lift,
            doc(ul(li(p("hello")), li(p("one"), ul(li(p("two"))))))));

    it("can lift two items from a nested list", () =>
        apply(doc(ul(li(p("hello"), ul(li(p("o<a>ne")), li(p("two<b>")))))), lift,
            doc(ul(li(p("hello")), li(p("one")), li(p("two"))))));

    it("can lift two items from a nested three-item list", () =>
        apply(doc(ul(li(p("hello"), ul(li(p("o<a>ne")), li(p("two<b>")), li(p("three")))))), lift,
            doc(ul(li(p("hello")), li(p("one")), li(p("two"), ul(li(p("three"))))))));

    it("can lift an item out of a list", () =>
        apply(doc(p("a"), ul(li(p("b<a>"))), p("c")), lift,
            doc(p("a"), p("b"), p("c"))));

    it("can lift two items out of a list", () =>
        apply(doc(p("a"), ul(li(p("b<a>")), li(p("c<b>"))), p("d")), lift,
            doc(p("a"), p("b"), p("c"), p("d"))));

    it("can lift three items from the middle of a list", () =>
        apply(doc(ul(li(p("a")), li(p("b<a>")), li(p("c")), li(p("d<b>")), li(p("e")))), lift,
            doc(ul(li(p("a"))), p("b"), p("c"), p("d"), ul(li(p("e"))))));

    it("can lift the first item from a list", () =>
        apply(doc(ul(li(p("a<a>")), li(p("b")), li(p("c")))), lift,
            doc(p("a"), ul(li(p("b")), li(p("c"))))));

    it("can lift the last item from a list", () =>
        apply(doc(ul(li(p("a")), li(p("b")), li(p("c<a>")))), lift,
            doc(ul(li(p("a")), li(p("b"))), p("c"))));

    it("joins adjacent lists when lifting an item with subitems", () =>
        apply(doc(ol(li(p("a"), ol(li(p("<a>b<b>"), ol(li(p("c")))), li(p("d")))), li(p("e")))), lift,
            doc(ol(li(p("a")), li(p("b"), ol(li(p("c")), li(p("d")))), li(p("e"))))));

    it("only joins adjacent lists when lifting if their @types match", () =>
        apply(doc(ol(li(p("a"), ul(li(p("<a>b<b>"), ol(li(p("c")))), li(p("d")))))), lift,
            doc(ol(li(p("a")), li(p("b"), ol(li(p("c"))), ul(li(p("d"))))))));
});

describe("sinkListItem", () => {
    let sink = sinkListItem(schema.nodes.list_item);

    it("can wrap a simple item in a list", () =>
        apply(doc(ul(li(p("one")), li(p("t<a><b>wo")), li(p("three")))), sink,
            doc(ul(li(p("one"), ul(li(p("two")))), li(p("three"))))));

    it("won't wrap the first item in a sublist", () =>
        apply(doc(ul(li(p("o<a><b>ne")), li(p("two")), li(p("three")))), sink, null));

    it("will move an item's content into the item above", () =>
        apply(doc(ul(li(p("one")), li(p("..."), ul(li(p("two")))), li(p("t<a><b>hree")))), sink,
            doc(ul(li(p("one")), li(p("..."), ul(li(p("two")), li(p("three"))))))));
});
