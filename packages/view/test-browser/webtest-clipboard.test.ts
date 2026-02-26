import {assert, describe, it} from 'vitest';
import {blockquote, br, doc, hr, li, ol, p, strong, ul} from '@type-editor/test-builder';
import {Fragment, Schema, Slice} from '@type-editor/model';
import {tempEditor} from './view';
import {__parseFromClipboard as parseFromClipboard} from '@type-editor/input';
import {SelectionFactory} from '@type-editor/state';


function tableSchema(): Schema {
  return new Schema({
    nodes: {
      td: { content: "text*", toDOM: () => ["td", 0], parseDOM: [{ tag: "td" }] },
      tr: { content: "td+", toDOM: () => ["tr", 0], parseDOM: [{ tag: "tr" }] },
      table: { content: "tr+", toDOM: () => ["table", ["tbody", 0]], parseDOM: [{ tag: "table" }] },
      doc: { content: "table+" },
      text: {}
    }
  });
}

function assertEqual(slice1: Slice, slice2: Slice): void {
  assert.equal(JSON.stringify(slice1, null, 2), JSON.stringify(slice2, null, 2));
}

describe("Clipboard interface", () => {

  it("copies only the node for a node selection", () => {
    let d = doc(blockquote(p("a"), "<a>", hr()), p("b"));
    let view = tempEditor({ doc: d });
    let { dom } = view.serializeForClipboard(SelectionFactory.createNodeSelection(d, d.tag.a).content());
    assert(dom.innerHTML, '<hr data-pm-slice="0 0 []">');
    assertEqual(parseFromClipboard(view, "", dom.innerHTML, false, d.resolve(1)), d.slice(d.tag.a, d.tag.a + 1));
  });

  it("includes context for text selections", () => {
    let d = doc(blockquote(ul(li(p("fo<a>o"), p("b<b>ar")))));
    let view = tempEditor({ doc: d });
    let slice = SelectionFactory.createTextSelection(d, d.tag.a, d.tag.b).content();
    let { dom, text } = view.serializeForClipboard(slice);
    assert(dom.innerHTML, '<li data-pm-slice="2 2 [&quot;blockquote&quot;,{},&quot;bullet_list&quot;,{}]"><p>o</p><p>b</p></li>');
    assertEqual(parseFromClipboard(view, text, dom.innerHTML, false, d.resolve(1)), d.slice(d.tag.a, d.tag.b, true));
    assertEqual(parseFromClipboard(view, text, dom.innerHTML, true, d.resolve(1)), new Slice(doc(p("o"), p("b")).content, 1, 1));
  });

  it("preserves open nodes", () => {
    let d = doc(blockquote(blockquote(p("foo"))));
    let view = tempEditor({ doc: d });
    let slice = new Slice(Fragment.from(d.firstChild), 1, 1);
    let html = view.serializeForClipboard(slice).dom.innerHTML;
    let parsed = parseFromClipboard(view, "-", html, false, d.resolve(1));
    assertEqual(parsed, slice);
  });

  it("uses clipboardTextSerializer when given", () => {
    let view = tempEditor({
      doc: doc(p("hello")),
      clipboardTextSerializer(_) { return "OK"; }
    });
    let { text } = view.serializeForClipboard(view.state.doc.slice(1, 6));
    assert(text, "OK");
  });

  it("can read external HTML", () => {
    let view = tempEditor(), $p = view.state.doc.resolve(1);

    assertEqual(parseFromClipboard(view, "", "<p>hello</p><hr>", false, $p), new Slice(doc(p("hello"), hr()).content, 1, 0));
    assertEqual(parseFromClipboard(view, "", "<p>hello</p>bar", false, $p), new Slice(doc(p("hello"), p("bar")).content, 1, 1));
  });

  it("will sanely clean up top-level nodes in HTML", () => {
    let view = tempEditor(), $p = view.state.doc.resolve(1);

    assertEqual(
      parseFromClipboard(view, "", "<ul><li>foo</li></ul>bar<br>baz", false, $p),
      new Slice(doc(ul(li(p("foo"))), p("bar", br(), "baz")).content, 3, 1));

    assertEqual(
      parseFromClipboard(view, "", "<ul><li>foo</li></ul>bar<br><p>x</p>", false, $p),
      new Slice(doc(ul(li(p("foo"))), p("bar", br()), p("x")).content, 3, 1));

    assertEqual(
      parseFromClipboard(view, "", "<li>foo</li><li>bar</li><p>x</p>", false, $p),
      new Slice(doc(ol(li(p("foo")), li(p("bar"))), p("x")).content, 3, 1));
  });

  it("only drops trailing br nodes in block parents", () => {
    let view = tempEditor();

    assertEqual(
      parseFromClipboard(view, "", "<p><strong>a<br></strong> b</p>", false, view.state.doc.resolve(1)),
      new Slice(doc(p(strong("a"), strong(br), " b")).content, 1, 1));
  });

  it("will call transformPastedHTML", () => {
    let view = tempEditor({ transformPastedHTML(_) { return "abc"; } });
    assertEqual(
      parseFromClipboard(view, "", "def", false, view.state.doc.resolve(1)),
      new Slice(p("abc").content, 0, 0));
  });

  it("will call transformPastedText", () => {
    let view = tempEditor({ transformPastedText(_) { return "abc"; } });
    assertEqual(
      parseFromClipboard(view, "def", null, false, view.state.doc.resolve(1)),
      new Slice(doc(p("abc")).content, 1, 1));
  });

  it("allows text parsing to be overridden with clipboardTextParser", () => {
    let view = tempEditor({ clipboardTextParser(text) { return doc(p(text.toUpperCase())).slice(1, text.length + 1); } });
    assertEqual(parseFromClipboard(view, "abc", null, false, view.state.doc.resolve(1)),
      new Slice(p("ABC").content, 0, 0));
  });

  it("preserves attributes", () => {
    let d = doc(ol({ order: 3 }, li(p("f<a>o<b>o"))));
    let view = tempEditor({ doc: d });
    let { dom, text } = view.serializeForClipboard(SelectionFactory.createTextSelection(d, d.tag.a, d.tag.b).content());
    assertEqual(parseFromClipboard(view, text, dom.innerHTML, false, d.resolve(1)),
      d.slice(d.tag.a, d.tag.b, true));
  });

  it("adds necessary wrappers for parsing", () => {
    let s = tableSchema();
    let doc = s.node("doc", null, [s.node("table", null, [s.node("tr", null, [
      s.node("td", null, [s.text("A")]),
      s.node("td", null, [s.text("B")])
    ])])]);
    let view = tempEditor({ doc });
    let slice = doc.slice(3, 4, true);
    let html = view.serializeForClipboard(slice).dom.innerHTML;
    assert(/<table/.test(html));
    assertEqual(parseFromClipboard(view, "", html, false, doc.resolve(3)), slice);
  });

  it("can parse content wrapped in comments", () => {
    let s = tableSchema();
    let doc = s.node("doc", null, [s.node("table", null, [s.node("tr", null, [s.node("td")])])]);
    let html = `<html><body><!--StartFragment--><table data-pm-slice="1 1 -2 []"><tbody><tr><td class="PROSEMIRROR_TABLE_TD_CLS" align="left"><p>123</p></td></tr><tr><td class="PROSEMIRROR_TABLE_TD_CLS" align="left"><p>123</p></td></tr></tbody></table><!--EndFragment--></body></html>`;
    assert(parseFromClipboard(tempEditor({ doc }), "", html, false, doc.resolve(1)) + "",
      "<tr(td(\"123\")), tr(td(\"123\"))>(1,1)");
  });
});
