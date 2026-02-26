import ist from 'ist';
import { describe, it } from 'vitest';

import { type Node, Schema } from '@type-editor/model';
import { EditorState, Selection, SelectionFactory } from '@type-editor/state';
import {
    blockquote,
    br,
    builders,
    doc,
    em,
    eq,
    h1,
    hr,
    img,
    li,
    ol,
    p,
    pre,
    schema,
    strong,
    ul,
} from '@type-editor/test-builder';
import { joinBackward } from '@src/join-backward';
import { joinTextblockBackward } from '@src/join-textblock-backward';
import { selectNodeBackward } from '@src/select-node-backward';
import { deleteSelection } from '@src/delete-selection';
import { joinForward } from '@src/join-forward';
import { joinTextblockForward } from '@src/join-textblock-forward';
import { selectNodeForward } from '@src/select-node-forward';
import { joinUp } from '@src/join-up';
import { joinDown } from '@src/join-down';
import { lift } from '@src/lift';
import { wrapIn } from '@src/wrap-in';
import { splitBlock, splitBlockAs } from '@src/split-block';
import { splitBlockKeepMarks } from '@src/split-block-keep-marks';
import { toggleMark } from '@src/toggle-mark';
import { liftEmptyBlock } from '@src/lift-empty-block';
import { createParagraphNear } from '@src/create-paragraph-near';
import { setBlockType } from '@src/set-block-type';
import { selectParentNode } from '@src/select-parent-node';
import { autoJoin } from '@src/auto-join';
import { selectTextblockEnd, selectTextblockStart } from '@src/select-textblock';
import { toggleBlockType } from '@src/toggle-block-type';
import { toggleWrapIn } from '@src/toggle-wrap-in';
import { insertHardBreak } from '@src/insert-hard-break';
import type { Command } from '@type-editor/editor-types';

function t(node: Node): { [name: string]: number; } {
  return (node as any).tag;
}

function selFor(doc: Node) {
  let a = t(doc).a;
  if (a != null) {
    let $a = doc.resolve(a);
    if ($a.parent.inlineContent) {
        return SelectionFactory.createTextSelection($a, t(doc).b != null ? doc.resolve(t(doc).b) : undefined);
    } else {
        return SelectionFactory.createNodeSelection($a);
    }
  }
  return Selection.atStart(doc);
}

function mkState(doc: Node) {
  return EditorState.create({ doc, selection: selFor(doc) });
}

function apply(doc: Node, command: Command, result: Node | null) {
  let state = mkState(doc);
  command(state, tr => state = state.apply(tr));
  ist(state.doc, result || doc, eq);
  if (result && t(result).a != null) ist(state.selection, selFor(result), eq);
}

describe("joinBackward", () => {
  it("can join paragraphs", () =>
    apply(doc(p("hi"), p("<a>there")), joinBackward, doc(p("hithere"))));

  it("can join out of a nested node", () =>
    apply(doc(p("hi"), blockquote(p("<a>there"))), joinBackward,
      doc(p("hi"), p("there"))));

  it("moves a block into an adjacent wrapper", () =>
    apply(doc(blockquote(p("hi")), p("<a>there")), joinBackward,
      doc(blockquote(p("hi"), p("there")))));

  it("moves a block into an adjacent wrapper from another wrapper", () =>
    apply(doc(blockquote(p("hi")), blockquote(p("<a>there"))), joinBackward,
      doc(blockquote(p("hi"), p("there")))));

  it("joins the wrapper to a subsequent one if applicable", () =>
    apply(doc(blockquote(p("hi")), p("<a>there"), blockquote(p("x"))), joinBackward,
      doc(blockquote(p("hi"), p("there"), p("x")))));

  it("moves a block into a list item", () =>
    apply(doc(ul(li(p("hi"))), p("<a>there")), joinBackward,
      doc(ul(li(p("hi")), li(p("there"))))));

  it("joins lists", () =>
    apply(doc(ul(li(p("hi"))), ul(li(p("<a>there")))), joinBackward,
      doc(ul(li(p("hi")), li(p("there"))))));

  it("joins list items", () =>
    apply(doc(ul(li(p("hi")), li(p("<a>there")))), joinBackward,
      doc(ul(li(p("hi"), p("there"))))));

  it("lifts out of a list at the start", () =>
    apply(doc(ul(li(p("<a>there")))), joinBackward, doc(p("<a>there"))));

  it("joins lists before and after", () =>
    apply(doc(ul(li(p("hi"))), p("<a>there"), ul(li(p("x")))), joinBackward,
      doc(ul(li(p("hi")), li(p("there")), li(p("x"))))));

  it("deletes leaf nodes before", () =>
    apply(doc(hr, p("<a>there")), joinBackward, doc(p("there"))));

  it("lifts before it deletes", () =>
    apply(doc(hr, blockquote(p("<a>there"))), joinBackward, doc(hr, p("there"))));

  it("does nothing at start of doc", () =>
    apply(doc(p("<a>foo")), joinBackward, null));

  it("can join single-textblock-child nodes", () => {
    let s: Schema = new Schema({
      nodes: {
        text: { inline: true },
        doc: { content: "block+" },
        block: { content: "para" },
        para: { content: "text*" }
      }
    });
    let doc = s.node("doc", null, [
      s.node("block", null, [s.node("para", null, [s.text("a")])]),
      s.node("block", null, [s.node("para", null, [s.text("b")])])
    ]);
    let state = EditorState.create({ doc, selection: Selection.near(doc.resolve(7)) });
    ist(joinBackward(state, tr => state = state.apply(tr)));
    ist(state.doc.toString(), "doc(block(para(\"ab\")))");
  });

  it("doesn't return true on empty blocks that can't be deleted", () =>
    apply(doc(p("a"), ul(li(p("<a>"), ul(li("b"))))), joinBackward, null));

  it("doesn't join surrounding nodes of different @types", () =>
    apply(doc(ul(li(p("a"))), p("<a>"), ol(li(p("b")))), joinBackward,
      doc(ul(li(p("a")), li(p("<a>"))), ol(li(p("b"))))));
});

describe("joinTextblockBackward", () => {
  it("can join paragraphs", () =>
    apply(doc(p("hi"), p("<a>there")), joinTextblockBackward, doc(p("hi<a>there"))));

  it("can join if second block is wrapped", () =>
    apply(doc(p("hi"), ul(li(p("<a>there")))), joinTextblockBackward, doc(p("hi<a>there"))));

  it("can join if first block is wrapped", () =>
    apply(doc(blockquote(p("hi")), p("<a>there")), joinTextblockBackward, doc(blockquote(p("hi<a>there")))));

  it("does nothing at start of doc", () =>
    apply(doc(p("<a>foo")), joinTextblockBackward, null));

  it("can join if inside a nested block", () =>
    apply(doc(blockquote(blockquote(p("hi")), p("<a>there"))),
      joinTextblockBackward,
      doc(blockquote(blockquote(p("hi<a>there"))))));
});

describe("selectNodeBackward", () => {
  it("selects the node before the cut", () =>
    apply(doc(blockquote(p("a")), blockquote(p("<a>b"))), selectNodeBackward,
      doc("<a>", blockquote(p("a")), blockquote(p("b")))));

  it("does nothing when not at the start of the textblock", () =>
    apply(doc(p("a<a>b")), selectNodeBackward, null));
});

describe("deleteSelection", () => {
  it("deletes part of a text node", () =>
    apply(doc(p("f<a>o<b>o")), deleteSelection, doc(p("fo"))));

  it("can delete across blocks", () =>
    apply(doc(p("f<a>oo"), p("ba<b>r")), deleteSelection, doc(p("fr"))));

  it("deletes node selections", () =>
    apply(doc(p("foo"), "<a>", hr()), deleteSelection, doc(p("foo"))));

  it("moves selection after deleted node", () =>
    apply(doc(p("a"), "<a>", p("b"), blockquote(p("c"))), deleteSelection,
      doc(p("a"), blockquote(p("<a>c")))));

  it("moves selection before deleted node at end", () =>
    apply(doc(p("a"), "<a>", p("b")), deleteSelection,
      doc(p("a<a>"))));
});

describe("joinForward", () => {
  it("joins two textblocks", () =>
    apply(doc(p("foo<a>"), p("bar")), joinForward, doc(p("foobar"))));

  it("keeps type of second node when first is empty", () =>
    apply(doc(p("x"), p("<a>"), h1("hi")), joinForward, doc(p("x"), h1("<a>hi"))));

  it("clears nodes from joined node that wouldn't be allowed in target node", () =>
    apply(doc(pre("foo<a>"), p("bar", img())), joinForward, doc(pre("foo<a>bar"))));

  it("does nothing at the end of the document", () =>
    apply(doc(p("foo<a>")), joinForward, null));

  it("deletes a leaf node after the current block", () =>
    apply(doc(p("foo<a>"), hr(), p("bar")), joinForward, doc(p("foo"), p("bar"))));

  it("pulls the next block into the current list item", () =>
    apply(doc(ul(li(p("a<a>")), li(p("b")))), joinForward,
      doc(ul(li(p("a"), p("b"))))));

  it("joins two blocks inside of a list item", () =>
    apply(doc(ul(li(p("a<a>"), p("b")))), joinForward,
      doc(ul(li(p("ab"))))));

  it("pulls the next block into a blockquote", () =>
    apply(doc(blockquote(p("foo<a>")), p("bar")), joinForward,
      doc(blockquote(p("foo<a>"), p("bar")))));

  it("joins two blockquotes", () =>
    apply(doc(blockquote(p("hi<a>")), blockquote(p("there"))), joinForward,
      doc(blockquote(p("hi"), p("there")))));

  it("pulls the next block outside of a wrapping blockquote", () =>
    apply(doc(p("foo<a>"), blockquote(p("bar"))), joinForward,
      doc(p("foo"), p("bar"))));

  it("joins two lists", () =>
    apply(doc(ul(li(p("hi<a>"))), ul(li(p("there")))), joinForward,
      doc(ul(li(p("hi")), li(p("there"))))));

  it("does nothing in a nested node at the end of the document", () =>
    apply(doc(ul(li(p("there<a>")))), joinForward,
      null));

  it("deletes a leaf node at the end of the document", () =>
    apply(doc(p("there<a>"), hr()), joinForward,
      doc(p("there"))));

  it("moves before it deletes a leaf node", () =>
    apply(doc(blockquote(p("there<a>")), hr()), joinForward,
      doc(blockquote(p("there"), hr()))));

  it("does nothing when it can't join", () =>
    apply(doc(p("foo<a>"), ul(li(p("bar"), ul(li(p("baz")))))), joinForward,
      null));
});

describe("joinTextblockForward", () => {
  it("can join paragraphs", () =>
    apply(doc(p("hi<a>"), p("there")), joinTextblockForward, doc(p("hi<a>there"))));

  it("can join if second block is wrapped", () =>
    apply(doc(p("hi<a>"), ul(li(p("there")))), joinTextblockForward, doc(p("hi<a>there"))));

  it("can join if first block is wrapped", () =>
    apply(doc(blockquote(p("hi<a>")), p("there")), joinTextblockForward, doc(blockquote(p("hi<a>there")))));

  it("does nothing at end of doc", () =>
    apply(doc(p("foo<a>")), joinTextblockForward, null));
});

describe("selectNodeForward", () => {
  it("selects the next node", () =>
    apply(doc(p("foo<a>"), ul(li(p("bar"), ul(li(p("baz")))))), selectNodeForward,
      doc(p("foo<a>"), "<a>", ul(li(p("bar"), ul(li(p("baz"))))))));

  it("does nothing at end of document", () =>
    apply(doc(p("foo<a>")), selectNodeForward, null));
});

describe("joinUp", () => {
  it("joins identical parent blocks", () =>
    apply(doc(blockquote(p("foo")), blockquote(p("<a>bar"))), joinUp,
      doc(blockquote(p("foo"), p("<a>bar")))));

  it("does nothing in the first block", () =>
    apply(doc(blockquote(p("<a>foo")), blockquote(p("bar"))), joinUp, null));

  it("joins lists", () =>
    apply(doc(ul(li(p("foo"))), ul(li(p("<a>bar")))), joinUp,
      doc(ul(li(p("foo")), li(p("bar"))))));

  it("joins list items", () =>
    apply(doc(ul(li(p("foo")), li(p("<a>bar")))), joinUp,
      doc(ul(li(p("foo"), p("bar"))))));

  it("doesn't look at ancestors when a block is selected", () =>
    apply(doc(ul(li(p("foo")), li("<a>", p("bar")))), joinUp, null));

  it("can join selected block nodes", () =>
    apply(doc(ul(li(p("foo")), "<a>", li(p("bar")))), joinUp,
      doc(ul("<a>", li(p("foo"), p("bar"))))));
});

describe("joinDown", () => {
  it("joins parent blocks", () =>
    apply(doc(blockquote(p("foo<a>")), blockquote(p("bar"))), joinDown,
      doc(blockquote(p("foo<a>"), p("bar")))));

  it("doesn't join with the block before", () =>
    apply(doc(blockquote(p("foo")), blockquote(p("<a>bar"))), joinDown, null));

  it("joins lists", () =>
    apply(doc(ul(li(p("foo<a>"))), ul(li(p("bar")))), joinDown,
      doc(ul(li(p("foo")), li(p("bar"))))));

  it("joins list items", () =>
    apply(doc(ul(li(p("<a>foo")), li(p("bar")))), joinDown,
      doc(ul(li(p("foo"), p("bar"))))));

  it("doesn't look at parent nodes of a selected node", () =>
    apply(doc(ul(li("<a>", p("foo")), li(p("bar")))), joinDown, null));

  it("can join selected nodes", () =>
    apply(doc(ul("<a>", li(p("foo")), li(p("bar")))), joinDown,
      doc(ul("<a>", li(p("foo"), p("bar"))))));
});

describe("lift", () => {
  it("lifts out of a parent block", () =>
    apply(doc(blockquote(p("<a>foo"))), lift, doc(p("<a>foo"))));

  it("splits the parent block when necessary", () =>
    apply(doc(blockquote(p("foo"), p("<a>bar"), p("baz"))), lift,
      doc(blockquote(p("foo")), p("bar"), blockquote(p("baz")))));

  it("can lift out of a list", () =>
    apply(doc(ul(li(p("<a>foo")))), lift, doc(p("foo"))));

  it("does nothing for a top-level block", () =>
    apply(doc(p("<a>foo")), lift, null));

  it("lifts out of the innermost parent", () =>
    apply(doc(blockquote(ul(li(p("foo<a>"))))), lift,
      doc(blockquote(p("foo<a>")))));

  it("can lift a node selection", () =>
    apply(doc(blockquote("<a>", ul(li(p("foo"))))), lift,
      doc("<a>", ul(li(p("foo"))))));

  it("lifts out of a nested list", () =>
    apply(doc(ul(li(p("one"), ul(li(p("<a>sub1")), li(p("sub2")))), li(p("two")))), lift,
      doc(ul(li(p("one"), p("<a>sub1"), ul(li(p("sub2")))), li(p("two"))))));
});

describe("wrapIn", () => {
  let wrap = wrapIn(schema.nodes.blockquote);

  it("can wrap a paragraph", () =>
    apply(doc(p("fo<a>o")), wrap, doc(blockquote(p("foo")))));

  it("wraps multiple pragraphs", () =>
    apply(doc(p("fo<a>o"), p("bar"), p("ba<b>z"), p("quux")), wrap,
      doc(blockquote(p("foo"), p("bar"), p("baz")), p("quux"))));

  it("wraps an already wrapped node", () =>
    apply(doc(blockquote(p("fo<a>o"))), wrap,
      doc(blockquote(blockquote(p("foo"))))));

  it("can wrap a node selection", () =>
    apply(doc("<a>", ul(li(p("foo")))), wrap,
      doc(blockquote(ul(li(p("foo")))))));
});

describe("splitBlock", () => {
  it("splits a paragraph at the end", () =>
    apply(doc(p("foo<a>")), splitBlock, doc(p("foo"), p())));

  it("split a pragraph in the middle", () =>
    apply(doc(p("foo<a>bar")), splitBlock, doc(p("foo"), p("bar"))));

  it("splits a paragraph from a heading", () =>
    apply(doc(h1("foo<a>")), splitBlock, doc(h1("foo"), p())));

  it("splits a heading in two when in the middle", () =>
    apply(doc(h1("foo<a>bar")), splitBlock, doc(h1("foo"), h1("bar"))));

  it("deletes selected content", () =>
    apply(doc(p("fo<a>ob<b>ar")), splitBlock, doc(p("fo"), p("ar"))));

  it("splits a parent block when a node is selected", () =>
    apply(doc(ol(li(p("a")), "<a>", li(p("b")), li(p("c")))), splitBlock,
      doc(ol(li(p("a"))), ol(li(p("b")), li(p("c"))))));

  it("doesn't split the parent block when at the start", () =>
    apply(doc(ol("<a>", li(p("a")), li(p("b")), li(p("c")))), splitBlock, null));

  it("splits off a normal paragraph when splitting at the start of a textblock", () =>
    apply(doc(h1("<a>foo")), splitBlock, doc(p(), h1("foo"))));

  const hSchema: Schema = new Schema({
    nodes: schema.spec.nodes.update("heading", {
      content: "inline*"
    }).update("doc", {
      content: "heading block*"
    }).addToEnd("span", {
      inline: true,
      group: "inline",
      content: "inline*"
    })
  });
  function hDoc(a: number) {
    const hDoc = hSchema.node("doc", null, [
      hSchema.node("heading", { level: 1 }, hSchema.text("foobar"))
    ])
      ; (hDoc as any).tag = { a };
    return hDoc;
  }

  it("splits a paragraph from a heading when a double heading isn't allowed", () =>
    apply(hDoc(4), splitBlock,
      hSchema.node("doc", null, [
        hSchema.node("heading", { level: 1 }, hSchema.text("foo")),
        hSchema.node("paragraph", null, hSchema.text("bar"))
      ])));

  it("won't try to reset the type of an empty leftover when the schema forbids it", () =>
    apply(hDoc(1), splitBlock,
      hSchema.node("doc", null, [
        hSchema.node("heading", { level: 1 }),
        hSchema.node("paragraph", null, hSchema.text("foobar"))
      ])));

  it("can split an inline node", () => {
    let d = hSchema.node("doc", null, [
      hSchema.node("heading", { level: 1 }, [
        hSchema.node("span", null, hSchema.text("abcd"))])])
      ; (d as any).tag = { a: 4 };
    apply(d, splitBlock, hSchema.node("doc", null, [
      hSchema.node("heading", { level: 1 }, hSchema.node("span", null, hSchema.text("ab"))),
      hSchema.node("paragraph", null, hSchema.node("span", null, hSchema.text("cd")))
    ]));
  });

  it("prefers textblocks", () => {
    let s: Schema = new Schema({
      nodes: {
        text: {},
        para: { content: "text*", toDOM() { return ["p", 0]; } },
        section: { content: "para+", toDOM() { return ["section", 0]; } },
        doc: { content: "para* section*" }
      }
    });
    let doc = s.node("doc", null, [s.node("para", null, [s.text("hello")])])
      ; (doc as any).tag = { a: 3 };
    apply(doc, splitBlock,
      s.node("doc", null, [s.node("para", null, [s.text("he")]),
      s.node("para", null, [s.text("llo")])]));
  });
});

describe("splitBlockAs", () => {
  it("splits to the appropriate type", () =>
    apply(doc(p("on<a>e")), splitBlockAs(n => ({ type: n.type.schema.nodes.heading, attrs: { level: 1 } })),
      doc(p("on"), h1("<a>e"))));

  it("passes an end-of-block flag", () =>
    apply(doc(p("one<a>")),
      splitBlockAs((n, e) => e ? { type: n.type.schema.nodes.code_block } : null),
      doc(p("one"), pre("<a>"))));
});

describe("splitBlockKeepMarks", () => {
  it("keeps marks when used after marked text", () => {
    let state = mkState(doc(p(strong("foo<a>"), "bar")));
    splitBlockKeepMarks(state, tr => state = state.apply(tr));
    ist(state.storedMarks!.length, 1);
  });

  it("preserves the stored marks", () => {
    let state = mkState(doc(p(em("foo<a>"))));
    toggleMark(schema.marks.strong)(state, tr => state = state.apply(tr));
    splitBlockKeepMarks(state, tr => state = state.apply(tr));
    ist(state.storedMarks!.length, 2);
  });
});

describe("liftEmptyBlock", () => {
  it("splits the parent block when there are sibling before", () =>
    apply(doc(blockquote(p("foo"), p("<a>"), p("bar"))), liftEmptyBlock,
      doc(blockquote(p("foo")), blockquote(p(), p("bar")))));

  it("lifts the last child out of its parent", () =>
    apply(doc(blockquote(p("foo"), p("<a>"))), liftEmptyBlock,
      doc(blockquote(p("foo")), p())));

  it("lifts an only child", () =>
    apply(doc(blockquote(p("foo")), blockquote(p("<a>"))), liftEmptyBlock,
      doc(blockquote(p("foo")), p("<a>"))));

  it("does not violate schema constraints", () =>
    apply(doc(ul(li(p("<a>foo"), blockquote(p("bar"))))), liftEmptyBlock, null));

  it("lifts out of a list", () =>
    apply(doc(ul(li(p("hi")), li(p("<a>")))), liftEmptyBlock,
      doc(ul(li(p("hi"))), p())));
});

describe("createParagraphNear", () => {
  it("creates a paragraph before a selected node at the start of the doc", () =>
    apply(doc("<a>", hr(), hr()), createParagraphNear, doc(p(), hr(), hr())));

  it("creates a paragraph after a lone selected node", () =>
    apply(doc("<a>", hr()), createParagraphNear, doc(hr(), p())));

  it("creates a paragraph after selected nodes not at the start of the doc", () =>
    apply(doc(p(), "<a>", hr()), createParagraphNear, doc(p(), hr(), p())));
});

describe("setBlockType", () => {
  let setHeading = setBlockType(schema.nodes.heading, { level: 1 });
  let setPara = setBlockType(schema.nodes.paragraph);
  let setCode = setBlockType(schema.nodes.code_block);

  it("can change the type of a paragraph", () =>
    apply(doc(p("fo<a>o")), setHeading, doc(h1("foo"))));

  it("can change the type of a code block", () =>
    apply(doc(pre("fo<a>o")), setHeading, doc(h1("foo"))));

  it("can make a heading into a paragraph", () =>
    apply(doc(h1("fo<a>o")), setPara, doc(p("foo"))));

  it("preserves marks", () =>
    apply(doc(h1("fo<a>o", em("bar"))), setPara, doc(p("foo", em("bar")))));

  it("acts on node selections", () =>
    apply(doc("<a>", h1("foo")), setPara, doc(p("foo"))));

  it("can make a block a code block", () =>
    apply(doc(h1("fo<a>o")), setCode, doc(pre("foo"))));

  it("strips marks that are not allowed in code blocks", () =>
    apply(doc(p("fo<a>o", em("bar"))), setCode, doc(pre("foobar"))));

  it("acts on multiple blocks when possible", () =>
    apply(doc(p("a<a>bc"), p("def"), ul(li(p("ghi"), p("jk<b>l")))), setCode,
      doc(pre("a<a>bc"), pre("def"), ul(li(p("ghi"), pre("jk<b>l"))))));

  it("returns false when all textblocks in the selection are already this type", () =>
    apply(doc(pre("a<a>bc"), pre("de<b>f")), setCode, null));

  it("returns false when the selected blocks can't be changed", () =>
    apply(doc(ul(p("a<a>b<b>c"), p("def"))), setCode, null));

  // Tests for fast path with large documents (>= 50 blocks)
  describe("fast path for large documents", () => {
    // Helper to create a document with many paragraphs
    function createLargeDoc(count: number, startTag: boolean = true, endTag: boolean = true): Node {
      const paragraphs: Node[] = [];
      for (let i = 0; i < count; i++) {
        if (i === 0 && startTag) {
          paragraphs.push(p(`<a>para${i}`));
        } else if (i === count - 1 && endTag) {
          paragraphs.push(p(`para${i}<b>`));
        } else {
          paragraphs.push(p(`para${i}`));
        }
      }
      return doc(...paragraphs);
    }

    // Helper to create expected result document with headings
    function createLargeDocHeadings(count: number, startTag: boolean = true, endTag: boolean = true): Node {
      const headings: Node[] = [];
      for (let i = 0; i < count; i++) {
        if (i === 0 && startTag) {
          headings.push(h1(`<a>para${i}`));
        } else if (i === count - 1 && endTag) {
          headings.push(h1(`para${i}<b>`));
        } else {
          headings.push(h1(`para${i}`));
        }
      }
      return doc(...headings);
    }

    it("handles documents with 50 or more blocks (fast path threshold)", () => {
      const largeDoc = createLargeDoc(60);
      const expectedDoc = createLargeDocHeadings(60);
      apply(largeDoc, setHeading, expectedDoc);
    });

    it("handles documents just below the fast path threshold", () => {
      const largeDoc = createLargeDoc(49);
      const expectedDoc = createLargeDocHeadings(49);
      apply(largeDoc, setHeading, expectedDoc);
    });

    it("handles exactly at fast path threshold (50 blocks)", () => {
      const largeDoc = createLargeDoc(50);
      const expectedDoc = createLargeDocHeadings(50);
      apply(largeDoc, setHeading, expectedDoc);
    });

    it("handles large documents with mixed block types", () => {
      // Create a document with paragraphs and headings interleaved
      const mixedBlocks: Node[] = [];
      const expectedBlocks: Node[] = [];

      for (let i = 0; i < 60; i++) {
        if (i === 0) {
          mixedBlocks.push(p(`<a>para${i}`));
          expectedBlocks.push(h1(`<a>para${i}`));
        } else if (i === 59) {
          if (i % 2 === 0) {
            mixedBlocks.push(p(`para${i}<b>`));
            expectedBlocks.push(h1(`para${i}<b>`));
          } else {
            // Already heading - won't change
            mixedBlocks.push(h1(`para${i}<b>`));
            expectedBlocks.push(h1(`para${i}<b>`));
          }
        } else if (i % 3 === 0) {
          // Every 3rd block is already a heading (won't change)
          mixedBlocks.push(h1(`heading${i}`));
          expectedBlocks.push(h1(`heading${i}`));
        } else {
          // Paragraph blocks will be converted
          mixedBlocks.push(p(`para${i}`));
          expectedBlocks.push(h1(`para${i}`));
        }
      }

      apply(doc(...mixedBlocks), setHeading, doc(...expectedBlocks));
    });

    it("handles large documents nested in blockquotes", () => {
      const nestedBlocks: Node[] = [];
      const expectedBlocks: Node[] = [];

      // Create 60 blockquotes with paragraphs inside
      for (let i = 0; i < 60; i++) {
        if (i === 0) {
          nestedBlocks.push(blockquote(p(`<a>quoted${i}`)));
          expectedBlocks.push(blockquote(h1(`<a>quoted${i}`)));
        } else if (i === 59) {
          nestedBlocks.push(blockquote(p(`quoted${i}<b>`)));
          expectedBlocks.push(blockquote(h1(`quoted${i}<b>`)));
        } else {
          nestedBlocks.push(blockquote(p(`quoted${i}`)));
          expectedBlocks.push(blockquote(h1(`quoted${i}`)));
        }
      }

      apply(doc(...nestedBlocks), setHeading, doc(...expectedBlocks));
    });

    it("handles large documents with marks that are preserved", () => {
      const markedBlocks: Node[] = [];
      const expectedBlocks: Node[] = [];

      for (let i = 0; i < 60; i++) {
        if (i === 0) {
          markedBlocks.push(p(`<a>text`, em("emphasized")));
          expectedBlocks.push(h1(`<a>text`, em("emphasized")));
        } else if (i === 59) {
          markedBlocks.push(p(`text`, strong("bold<b>")));
          expectedBlocks.push(h1(`text`, strong("bold<b>")));
        } else if (i % 2 === 0) {
          markedBlocks.push(p(`text${i}`, em("em")));
          expectedBlocks.push(h1(`text${i}`, em("em")));
        } else {
          markedBlocks.push(p(`text${i}`, strong("str")));
          expectedBlocks.push(h1(`text${i}`, strong("str")));
        }
      }

      apply(doc(...markedBlocks), setHeading, doc(...expectedBlocks));
    });

    it("returns false for large documents when all blocks already have the target type", () => {
      const headings: Node[] = [];
      for (let i = 0; i < 60; i++) {
        if (i === 0) {
          headings.push(h1(`<a>heading${i}`));
        } else if (i === 59) {
          headings.push(h1(`heading${i}<b>`));
        } else {
          headings.push(h1(`heading${i}`));
        }
      }
      // null means the document should remain unchanged
      apply(doc(...headings), setHeading, null);
    });

    it("handles large documents with deeply nested blockquotes", () => {
      // Create a document with deeply nested blockquotes - all paragraphs should convert
      const blocks: Node[] = [];
      const expectedBlocks: Node[] = [];

      for (let i = 0; i < 60; i++) {
        if (i === 0) {
          // First block: deeply nested paragraph with start marker
          blocks.push(blockquote(blockquote(p(`<a>nested${i}`))));
          expectedBlocks.push(blockquote(blockquote(h1(`<a>nested${i}`))));
        } else if (i === 59) {
          // Last block: deeply nested paragraph with end marker
          blocks.push(blockquote(blockquote(p(`nested${i}<b>`))));
          expectedBlocks.push(blockquote(blockquote(h1(`nested${i}<b>`))));
        } else if (i % 3 === 0) {
          // Single level nesting
          blocks.push(blockquote(p(`single${i}`)));
          expectedBlocks.push(blockquote(h1(`single${i}`)));
        } else if (i % 3 === 1) {
          // Double nesting
          blocks.push(blockquote(blockquote(p(`double${i}`))));
          expectedBlocks.push(blockquote(blockquote(h1(`double${i}`))));
        } else {
          // Plain paragraph
          blocks.push(p(`plain${i}`));
          expectedBlocks.push(h1(`plain${i}`));
        }
      }

      apply(doc(...blocks), setHeading, doc(...expectedBlocks));
    });

    it("command enablement check (without dispatch) works for large documents", () => {
      const largeDoc = createLargeDoc(100);
      const state = mkState(largeDoc);
      // Just check enablement - should return true without dispatch
      ist(setHeading(state));
    });

    it("command enablement check returns false for large documents that cannot be converted", () => {
      const headings: Node[] = [];
      for (let i = 0; i < 100; i++) {
        if (i === 0) {
          headings.push(h1(`<a>heading${i}`));
        } else if (i === 99) {
          headings.push(h1(`heading${i}<b>`));
        } else {
          headings.push(h1(`heading${i}`));
        }
      }
      const largeHeadingsDoc = doc(...headings);
      const state = mkState(largeHeadingsDoc);
      // Should return false since all blocks are already headings
      ist(!setHeading(state));
    });
  });
});

describe("selectParentNode", () => {
  it("selects the whole textblock", () =>
    apply(doc(ul(li(p("foo"), p("b<a>ar")), li(p("baz")))), selectParentNode,
      doc(ul(li(p("foo"), "<a>", p("bar")), li(p("baz"))))));

  it("goes one level up when on a block", () =>
    apply(doc(ul(li(p("foo"), "<a>", p("bar")), li(p("baz")))), selectParentNode,
      doc(ul("<a>", li(p("foo"), p("bar")), li(p("baz"))))));

  it("goes further up", () =>
    apply(doc(ul("<a>", li(p("foo"), p("bar")), li(p("baz")))), selectParentNode,
      doc("<a>", ul(li(p("foo"), p("bar")), li(p("baz"))))));

  it("stops at the top level", () =>
    apply(doc("<a>", ul(li(p("foo"), p("bar")), li(p("baz")))), selectParentNode,
      doc("<a>", ul(li(p("foo"), p("bar")), li(p("baz"))))));
});

describe("autoJoin", () => {
  it("joins lists when deleting a paragraph between them", () =>
    apply(doc(ul(li(p("a"))), "<a>", p("b"), ul(li(p("c")))),
      autoJoin(deleteSelection, ["bullet_list"]),
      doc(ul(li(p("a")), li(p("c"))))));

  it("doesn't join lists when deleting an item inside of them", () =>
    apply(doc(ul(li(p("a")), "<a>", li(p("b"))), ul(li(p("c")))),
      autoJoin(deleteSelection, ["bullet_list"]),
      doc(ul(li(p("a"))), ul(li(p("c"))))));

  it("joins lists when wrapping a paragraph after them in a list", () =>
    apply(doc(ul(li(p("a"))), p("b<a>")),
      autoJoin(wrapIn(schema.nodes.bullet_list), ["bullet_list"]),
      doc(ul(li(p("a")), li(p("b"))))));

  it("joins lists when wrapping a paragraph between them in a list", () =>
    apply(doc(ul(li(p("a"))), p("b<a>"), ul(li(p("c")))),
      autoJoin(wrapIn(schema.nodes.bullet_list), ["bullet_list"]),
      doc(ul(li(p("a")), li(p("b")), li(p("c"))))));

  it("joins lists when lifting a list between them", () =>
    apply(doc(ul(li(p("a"))), blockquote("<a>", ul(li(p("b")))), ul(li(p("c")))),
      autoJoin(lift, ["bullet_list"]),
      doc(ul(li(p("a")), li(p("b")), li(p("c"))))));
});

describe("toggleMark", () => {
  let toggleEm = toggleMark(schema.marks.em), toggleStrong = toggleMark(schema.marks.strong);
  let toggleEmStoredMarks = toggleMark(schema.marks.em, null, { extendEmptySelection: false });
  let toggleStrongStoredMarks = toggleMark(schema.marks.strong, null, { extendEmptySelection: false });
  let toggleEm2 = toggleMark(schema.marks.em, null, { removeWhenPresent: false });

  it("can add a mark", () => {
    apply(doc(p("one <a>two<b>")), toggleEm,
      doc(p("one ", em("two"))));
  });

  it("can stack marks", () => {
    apply(doc(p("one <a>tw", strong("o<b>"))), toggleEm,
      doc(p("one ", em("tw", strong("o")))));
  });

  it("can remove marks", () => {
    apply(doc(p(em("one <a>two<b>"))), toggleEm,
      doc(p(em("one "), "two")));
  });

  it("can toggle pending marks", () => {
    let state = mkState(doc(p("hell<a>o")));
    toggleEmStoredMarks(state, tr => state = state.apply(tr));
    ist(state.storedMarks!.length, 1);
    toggleStrongStoredMarks(state, tr => state = state.apply(tr));
    ist(state.storedMarks!.length, 2);
    toggleEmStoredMarks(state, tr => state = state.apply(tr));
    ist(state.storedMarks!.length, 1);
  });

  it("skips whitespace at selection ends when adding marks", () => {
    apply(doc(p("one<a> two  <b>three")), toggleEm,
      doc(p("one ", em("two"), "  three")));
  });

  it("doesn't skip whitespace-only selections", () => {
    apply(doc(p("one<a> <b>two")), toggleEm,
      doc(p("one", em(" "), "two")));
  });

  it("includes whitespace when asked", () => {
    apply(doc(p("one<a> two  <b>three")), toggleMark(schema.marks.em, null, { includeWhitespace: true }),
      doc(p("one", em(" two  "), "three")));
  });

  it("can add marks with remove-when-present off", () => {
    apply(doc(p("<a>", em("one"), " two<b>")), toggleEm2,
      doc(p(em("one two"))));
    apply(doc(p("<a>three<b>")), toggleEm2,
      doc(p(em("three"))));
  });

  it("can remove marks with remove-when-present off", () => {
    apply(doc(p(em("o<a>ne two<b>"))), toggleEm2,
      doc(p(em("o"), "ne two")));
  });

  it("can remove marks with trailing space when remove-when-present is off", () => {
    apply(doc(p(em("o<a>ne two"), "  <b>three")), toggleEm2,
      doc(p(em("o"), "ne two  three")));
  });

  function footnoteSchema() {
    let schema: Schema = new Schema({
      nodes: {
        text: { inline: true, group: "inline" },
        doc: { content: "para+" },
        footnote: { content: "text*|inline", atom: true, inline: true, group: "inline" },
        para: { content: "(text | footnote | inline)*" },
      },
      marks: {
        em: {}
      }
    });
    return builders(schema);
  }

  it("enters inline atoms by default", () => {
    let { doc, para, footnote, em, schema } = footnoteSchema();
    apply(doc(para("h<a>ello", footnote("okay"), "<b>")),
      toggleMark(schema.marks.em),
      doc(para("h", em("ello", footnote(em("okay"))))));
  });

  it("doesn't enter inline atoms to add a mark when told not to", () => {
    let { doc, para, footnote, em, schema } = footnoteSchema();
    apply(doc(para("h<a>ello", footnote("okay"), "<b>")),
      toggleMark(schema.marks.em, null, { enterInlineAtoms: false }),
      doc(para("h", em("ello", footnote("okay")))));
  });

  it("can apply styles inside inline atoms", () => {
    let { doc, para, footnote, em, schema } = footnoteSchema();
    apply(doc(para("hello", footnote("o<a>kay<b>"))),
      toggleMark(schema.marks.em, null, { enterInlineAtoms: false }),
      doc(para("hello", footnote("o", em("kay")))));
  });

  it("can add a mark even if already active inside an inline atom", () => {
    let { doc, para, footnote, em, schema } = footnoteSchema();
    apply(doc(para("h<a>ello", footnote(em("okay")), "<b>")),
      toggleMark(schema.marks.em, null, { enterInlineAtoms: false }),
      doc(para("h", em("ello", footnote(em("okay"))))));
  });

  it("doesn't enter inline atoms to remove a mark when told not to", () => {
    let { doc, para, footnote, em, schema } = footnoteSchema();
    apply(doc(para(em("h<a>ello", footnote(em("okay")), "<b>"))),
      toggleMark(schema.marks.em, null, { enterInlineAtoms: false }),
      doc(para(em("h"), "ello", footnote(em("okay")))));
  });

  describe("extendEmptySelection", () => {
    it("extends selection to character before cursor when extendEmptySelection is true", () => {
      let state = mkState(doc(p("hello<a>")));
      toggleMark(schema.marks.em, null, { extendEmptySelection: true })(state, tr => state = state.apply(tr));
      ist(state.doc, doc(p("hell", em("o"))), eq);
    });

    it("extends selection to character after cursor when no character before", () => {
      let state = mkState(doc(p("<a>hello")));
      toggleMark(schema.marks.em, null, { extendEmptySelection: true })(state, tr => state = state.apply(tr));
      ist(state.doc, doc(p(em("h"), "ello")), eq);
    });

    it("can remove mark from character before cursor with extendEmptySelection", () => {
      let state = mkState(doc(p("hell", em("o"), "<a>")));
      toggleMark(schema.marks.em, null, { extendEmptySelection: true })(state, tr => state = state.apply(tr));
      ist(state.doc, doc(p("hello")), eq);
    });

    it("prefers character before cursor over character after", () => {
      let state = mkState(doc(p("ab<a>cd")));
      toggleMark(schema.marks.em, null, { extendEmptySelection: true })(state, tr => state = state.apply(tr));
      ist(state.doc, doc(p("a", em("b"), "cd")), eq);
    });

    it("returns false when cursor is at start of empty paragraph with extendEmptySelection", () => {
      let state = mkState(doc(p("<a>")));
      ist(toggleMark(schema.marks.em, null, { extendEmptySelection: true })(state, () => {}), false);
    });

    it("skips whitespace when looking for character to extend to", () => {
      let state = mkState(doc(p("hello <a>world")));
      toggleMark(schema.marks.em, null, { extendEmptySelection: true })(state, tr => state = state.apply(tr));
      ist(state.doc, doc(p("hello ", em("w"), "orld")), eq);
    });

    it("only removes mark from trailing whitespace when cursor is at end of marked range", () => {
      let state = mkState(doc(p(strong("test "), "<a>")));
      toggleMark(schema.marks.strong, null, { extendEmptySelection: true })(state, tr => state = state.apply(tr));
      ist(state.doc, doc(p(strong("test"), " ")), eq);
    });

    it("only removes mark from leading whitespace when cursor is at start of marked range", () => {
      let state = mkState(doc(p("<a>", strong(" test"))));
      toggleMark(schema.marks.strong, null, { extendEmptySelection: true })(state, tr => state = state.apply(tr));
      ist(state.doc, doc(p(" ", strong("test"))), eq);
    });

    it("removes mark from entire range when cursor is at end but no trailing whitespace", () => {
      let state = mkState(doc(p(strong("test"), "<a>")));
      toggleMark(schema.marks.strong, null, { extendEmptySelection: true })(state, tr => state = state.apply(tr));
      ist(state.doc, doc(p("test")), eq);
    });

    it("removes mark from entire range when cursor is not at edge", () => {
      let state = mkState(doc(p(strong("te<a>st "))));
      toggleMark(schema.marks.strong, null, { extendEmptySelection: true })(state, tr => state = state.apply(tr));
      ist(state.doc, doc(p("test ")), eq);
    });

    it("removes mark from multiple trailing whitespace characters", () => {
      let state = mkState(doc(p(strong("test   "), "<a>")));
      toggleMark(schema.marks.strong, null, { extendEmptySelection: true })(state, tr => state = state.apply(tr));
      ist(state.doc, doc(p(strong("test"), "   ")), eq);
    });

    it("removes entire mark if text is only whitespace", () => {
      let state = mkState(doc(p(strong("   "), "<a>")));
      toggleMark(schema.marks.strong, null, { extendEmptySelection: true })(state, tr => state = state.apply(tr));
      ist(state.doc, doc(p("   ")), eq);
    });

    it("extends to entire marked range when cursor is inside (not at edge)", () => {
      let state = mkState(doc(p(em("hel<a>lo"))));
      toggleMark(schema.marks.em, null, { extendEmptySelection: true })(state, tr => state = state.apply(tr));
      ist(state.doc, doc(p("hello")), eq);
    });

    it("extends to entire marked word when cursor is in the middle of marked text", () => {
      let state = mkState(doc(p("before ", em("wor<a>ld"), " after")));
      toggleMark(schema.marks.em, null, { extendEmptySelection: true })(state, tr => state = state.apply(tr));
      ist(state.doc, doc(p("before ", "world", " after")), eq);
    });

    it("adds mark to single character when cursor is next to unmarked text", () => {
      let state = mkState(doc(p("hel<a>lo")));
      toggleMark(schema.marks.em, null, { extendEmptySelection: true })(state, tr => state = state.apply(tr));
      ist(state.doc, doc(p("he", em("l"), "lo")), eq);
    });

    it("handles cursor at boundary between marked and unmarked text - removes entire mark if cursor considered inside", () => {
      let state = mkState(doc(p(em("hello"), "<a>world")));
      toggleMark(schema.marks.em, null, { extendEmptySelection: true })(state, tr => state = state.apply(tr));
      // When cursor is right after marked text, it finds the marked range and removes it
      ist(state.doc, doc(p("helloworld")), eq);
    });

    it("removes mark from entire range when cursor is between two marked characters", () => {
      let state = mkState(doc(p(em("ab<a>cd"))));
      toggleMark(schema.marks.em, null, { extendEmptySelection: true })(state, tr => state = state.apply(tr));
      ist(state.doc, doc(p("abcd")), eq);
    });

    it("handles cursor after image when character before is an image", () => {
      let state = mkState(doc(p("text", img(), "<a>more")));
      toggleMark(schema.marks.em, null, { extendEmptySelection: true })(state, tr => state = state.apply(tr));
      ist(state.doc, doc(p("text", img(), em("m"), "ore")), eq);
    });

    it("handles cursor before image", () => {
      let state = mkState(doc(p("text<a>", img(), "more")));
      toggleMark(schema.marks.em, null, { extendEmptySelection: true })(state, tr => state = state.apply(tr));
      ist(state.doc, doc(p("tex", em("t"), img(), "more")), eq);
    });

    it("adds mark to character after cursor when before is whitespace", () => {
      let state = mkState(doc(p("word <a>next")));
      toggleMark(schema.marks.em, null, { extendEmptySelection: true })(state, tr => state = state.apply(tr));
      ist(state.doc, doc(p("word ", em("n"), "ext")), eq);
    });

    it("extends to entire marked range spanning multiple text nodes with same mark", () => {
      let state = mkState(doc(p(em("hel", strong("lo<a>wor"), "ld"))));
      toggleMark(schema.marks.em, null, { extendEmptySelection: true })(state, tr => state = state.apply(tr));
      ist(state.doc, doc(p("hel", strong("lowor"), "ld")), eq);
    });

    it("returns false when extendEmptySelection is false and selection is empty", () => {
      let state = mkState(doc(p("hello<a>")));
      ist(toggleMark(schema.marks.em, null, { extendEmptySelection: false })(state, () => {}), true);
      // With extendEmptySelection: false, it should toggle stored marks instead
    });

    it("can add mark then remove it with extendEmptySelection at same position", () => {
      let state = mkState(doc(p("hello<a>")));
      toggleMark(schema.marks.em, null, { extendEmptySelection: true })(state, tr => state = state.apply(tr));
      ist(state.doc, doc(p("hell", em("o"))), eq);

      // Now remove the mark - cursor should be at position 6 (end of document content)
      // Create selection on the current state's document
      const pos = state.doc.resolve(6);
      state = state.apply(state.tr.setSelection(SelectionFactory.createTextSelection(pos)));
      toggleMark(schema.marks.em, null, { extendEmptySelection: true })(state, tr => state = state.apply(tr));
      ist(state.doc, doc(p("hello")), eq);
    });

    it("returns false when cursor is between two whitespaces", () => {
      let state = mkState(doc(p("word <a> next")));
      // Character before is whitespace, character after is also whitespace
      // Both are skipped, and since there's nothing to extend to, command returns false
      ist(toggleMark(schema.marks.em, null, { extendEmptySelection: true })(state, () => {}), false);
    });

    it("handles cursor at end of document with only whitespace before", () => {
      let state = mkState(doc(p("   <a>")));
      ist(toggleMark(schema.marks.em, null, { extendEmptySelection: true })(state, () => {}), false);
    });

    it("handles cursor between two different marked ranges", () => {
      // em("ab") followed by strong("cd"), cursor between them
      let state = mkState(doc(p(em("ab"), "<a>", strong("cd"))));
      toggleMark(schema.marks.em, null, { extendEmptySelection: true })(state, tr => state = state.apply(tr));
      // Should remove em from "ab" since cursor is at boundary of em range
      ist(state.doc, doc(p("ab", strong("cd"))), eq);
    });

    it("can apply different mark to character in marked range", () => {
      let state = mkState(doc(p(em("hel<a>lo"))));
      toggleMark(schema.marks.strong, null, { extendEmptySelection: true })(state, tr => state = state.apply(tr));
      // Should add strong to "l" which already has em
      ist(state.doc, doc(p(em("he", strong("l"), "lo"))), eq);
    });
  });

  describe("onlyNumbers", () => {
    it("applies mark only to numeric content", () => {
      apply(doc(p("test<a>123<b>end")),
        toggleMark(schema.marks.em, null, { onlyNumbers: true }),
        doc(p("test", em("123"), "end")));
    });

    it("does not apply mark to non-numeric content", () => {
      let state = mkState(doc(p("<a>abc<b>")));
      ist(toggleMark(schema.marks.em, null, { onlyNumbers: true })(state, () => {}), false);
    });

    it("does not apply mark to mixed content", () => {
      let state = mkState(doc(p("<a>12ab<b>")));
      ist(toggleMark(schema.marks.em, null, { onlyNumbers: true })(state, () => {}), false);
    });

    it("applies mark with extendEmptySelection when character before is numeric", () => {
      let state = mkState(doc(p("test5<a>")));
      toggleMark(schema.marks.em, null, { onlyNumbers: true, extendEmptySelection: true })(state, tr => state = state.apply(tr));
      ist(state.doc, doc(p("test", em("5"))), eq);
    });

    it("does not apply mark with extendEmptySelection when character before is not numeric", () => {
      let state = mkState(doc(p("testa<a>")));
      ist(toggleMark(schema.marks.em, null, { onlyNumbers: true, extendEmptySelection: true })(state, () => {}), false);
    });

    it("applies mark with extendEmptySelection when character after is numeric", () => {
      let state = mkState(doc(p("<a>5test")));
      toggleMark(schema.marks.em, null, { onlyNumbers: true, extendEmptySelection: true })(state, tr => state = state.apply(tr));
      ist(state.doc, doc(p(em("5"), "test")), eq);
    });

    it("does not apply mark with extendEmptySelection when character after is not numeric", () => {
      let state = mkState(doc(p("<a>atest")));
      ist(toggleMark(schema.marks.em, null, { onlyNumbers: true, extendEmptySelection: true })(state, () => {}), false);
    });

    it("can remove mark from numeric character with extendEmptySelection and onlyNumbers", () => {
      let state = mkState(doc(p("test", em("5"), "<a>")));
      toggleMark(schema.marks.em, null, { onlyNumbers: true, extendEmptySelection: true })(state, tr => state = state.apply(tr));
      ist(state.doc, doc(p("test5")), eq);
    });
  });
});

describe('selectTextblockStart and selectTextblockEnd', () => {
  it("can move the cursor when the selection is empty", () => {
    apply(doc(p("one <a>two")), selectTextblockStart,
      doc(p("<a>one two")));

    apply(doc(p("one <a>two")), selectTextblockEnd,
      doc(p("one two<a>")));
  });

  it("can move the cursor when the selection is not empty", () => {
    apply(doc(p("one <a>two<b>")), selectTextblockStart,
      doc(p("<a>one two")));

    apply(doc(p("one <a>two<b>")), selectTextblockEnd,
      doc(p("one two<a>")));
  });

  it("can move the cursor when the selection crosses multiple text blocks", () => {
    apply(doc(p("one <a>two"), p('three<b> four')), selectTextblockStart,
      doc(p("<a>one two"), p('three four')));

    apply(doc(p("one <a>two"), p('three<b> four')), selectTextblockEnd,
      doc(p("one two"), p('three four<a>')));
  });
});

describe("toggleBlockType", () => {
  let toggleHeading = toggleBlockType(schema.nodes.heading, schema.nodes.paragraph, { level: 1 });

  it("converts a paragraph to a heading", () =>
    apply(doc(p("fo<a>o")), toggleHeading, doc(h1("foo"))));

  it("converts a heading back to a paragraph", () =>
    apply(doc(h1("fo<a>o")), toggleHeading, doc(p("foo"))));

  it("toggles multiple paragraphs to headings", () =>
    apply(doc(p("fo<a>o"), p("bar<b>")), toggleHeading, doc(h1("foo"), h1("bar"))));

  it("toggles nested paragraph in blockquote", () =>
    apply(doc(blockquote(p("fo<a>o"))), toggleHeading, doc(blockquote(h1("foo")))));

  it("preserves marks when toggling", () =>
    apply(doc(p("fo<a>o", em("bar"))), toggleHeading, doc(h1("foo", em("bar")))));

  it("handles selection at the beginning of text", () =>
    apply(doc(p("<a>foo")), toggleHeading, doc(h1("foo"))));

  it("handles selection at the end of text", () =>
    apply(doc(p("foo<a>")), toggleHeading, doc(h1("foo"))));

  describe("with allowUnwrap = false", () => {
    let toggleHeadingNoUnwrap = toggleBlockType(schema.nodes.heading, schema.nodes.paragraph, { level: 1 }, false);

    it("converts a paragraph to a heading", () =>
      apply(doc(p("fo<a>o")), toggleHeadingNoUnwrap, doc(h1("foo"))));

    it("does not toggle heading back when unwrap is disabled", () =>
      apply(doc(h1("fo<a>o")), toggleHeadingNoUnwrap, null));
  });
});

describe("toggleWrapIn", () => {
  let toggleBlockquote = toggleWrapIn(schema.nodes.blockquote);

  it("wraps a paragraph in a blockquote", () =>
    apply(doc(p("fo<a>o")), toggleBlockquote, doc(blockquote(p("foo")))));

  it("unwraps a paragraph from a blockquote", () =>
    apply(doc(blockquote(p("fo<a>o"))), toggleBlockquote, doc(p("foo"))));

  it("wraps multiple paragraphs in a blockquote", () =>
    apply(doc(p("fo<a>o"), p("bar"), p("ba<b>z")), toggleBlockquote,
      doc(blockquote(p("foo"), p("bar"), p("baz")))));

  it("can wrap a node selection", () =>
    apply(doc("<a>", ul(li(p("foo")))), toggleBlockquote,
      doc(blockquote(ul(li(p("foo")))))));


  describe("with allowUnwrap = false", () => {
    let wrapBlockquoteNoUnwrap = toggleWrapIn(schema.nodes.blockquote, null, false);

    it("wraps a paragraph in a blockquote", () =>
      apply(doc(p("fo<a>o")), wrapBlockquoteNoUnwrap, doc(blockquote(p("foo")))));

    it("wraps an already wrapped paragraph again", () =>
      apply(doc(blockquote(p("fo<a>o"))), wrapBlockquoteNoUnwrap,
        doc(blockquote(blockquote(p("foo"))))));
  });
});

describe("insertHardBreak", () => {
  let insertBreak = insertHardBreak(schema.nodes.hard_break);

  it("inserts a hard break at the cursor position", () =>
    apply(doc(p("fo<a>o")), insertBreak, doc(p("fo", br(), "o"))));

  it("inserts a hard break at the end of a paragraph", () =>
    apply(doc(p("foo<a>")), insertBreak, doc(p("foo", br()))));

  it("inserts a hard break at the beginning of a paragraph", () =>
    apply(doc(p("<a>foo")), insertBreak, doc(p(br(), "foo"))));

  it("replaces selected text with a hard break", () =>
    apply(doc(p("f<a>o<b>o")), insertBreak, doc(p("f", br(), "o"))));

  it("inserts a hard break inside a heading", () =>
    apply(doc(h1("fo<a>o")), insertBreak, doc(h1("fo", br(), "o"))));

  it("preserves marks around the hard break", () =>
    apply(doc(p(em("fo<a>o"))), insertBreak, doc(p(em("fo"), em(br()), em("o")))));
});

