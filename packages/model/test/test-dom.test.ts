import {describe, it} from 'vitest';
import {
    a,
    blockquote,
    br,
    builders,
    code,
    doc,
    em,
    eq,
    h1,
    h2,
    hr,
    img,
    li,
    ol,
    p,
    pre,
    schema,
    strong,
    ul
} from './helper';
import ist from "ist";

import {JSDOM} from "jsdom";
import {DOMSerializer} from "@src/dom-parser/DOMSerializer";
import {DOMParser} from "@src/dom-parser/DOMParser";
import type {Node as PmNode} from '@src/elements/Node';
import {Schema} from "@src/schema/Schema";
import {Mark} from "@src/elements/Mark";
import type {ParseOptions} from "@src/types/dom-parser/ParseOptions";
import {Slice} from "@src/elements/Slice";
import {Fragment} from "@src/elements/Fragment";
import {ELEMENT_NODE, TEXT_NODE} from "../../commons/src";
import type {ParseRule} from "@src/types/dom-parser/ParseRule";
import type {Attrs} from "@src/types/schema/Attrs";

const document = new JSDOM().window.document;
const xmlDocument = new JSDOM("<tag/>", { contentType: "application/xml" }).window.document;

const parser = DOMParser.fromSchema(schema);
const serializer = DOMSerializer.fromSchema(schema);

describe("DOMParser", () => {
    describe("parse", () => {
        function domFrom(html: string, document_ = document) {
            let dom = document_.createElement("div");
            dom.innerHTML = html;
            return dom;
        }

        function test(doc: PmNode, html: string, document_ = document) {
            return () => {
                let derivedDOM = document_.createElement("div"), schema = doc.type.schema;
                derivedDOM.appendChild(DOMSerializer.fromSchema(schema).serializeFragment(doc.content, { document: document_ }));
                let declaredDOM = domFrom(html, document_);

                ist(derivedDOM.innerHTML, declaredDOM.innerHTML);
                ist(DOMParser.fromSchema(schema).parse(derivedDOM), doc, eq);
            };
        }

        it("can represent simple node",
            test(doc(p("hello")),
                "<p style=\"text-align: left;\">hello</p>"));

        it("can represent a line break",
            test(doc(p("hi", br(), "there")),
                "<p style=\"text-align: left;\">hi<br/>there</p>"));

        it("can represent an image",
            test(doc(p("hi", img({ alt: "x" }), "there")),
                '<p style=\"text-align: left;\">hi<img src="img.png" alt="x"/>there</p>'));

        it("joins styles",
            test(doc(p("one", strong("two", em("three")), em("four"), "five")),
                "<p style=\"text-align: left;\">one<strong>two</strong><em><strong>three</strong>four</em>five</p>"));

        it("can represent links",
            test(doc(p("a ", a({ href: "foo" }, "big ", a({ href: "bar" }, "nested"), " link"))),
                "<p style=\"text-align: left;\">a <a href=\"foo\">big </a><a href=\"bar\">nested</a><a href=\"foo\"> link</a></p>"));

        it("can represent and unordered list",
            test(doc(ul(li(p("one")), li(p("two")), li(p("three", strong("!")))), p("after")),
                "<ul><li><p style=\"text-align: left;\">one</p></li><li><p style=\"text-align: left;\">two</p></li><li><p style=\"text-align: left;\">three<strong>!</strong></p></li></ul><p style=\"text-align: left;\">after</p>"));

        it("can represent an ordered list",
            test(doc(ol(li(p("one")), li(p("two")), li(p("three", strong("!")))), p("after")),
                "<ol><li><p style=\"text-align: left;\">one</p></li><li><p style=\"text-align: left;\">two</p></li><li><p style=\"text-align: left;\">three<strong>!</strong></p></li></ol><p style=\"text-align: left;\">after</p>"));

        it("can represent a blockquote",
            test(doc(blockquote(p("hello"), p("bye"))),
                "<blockquote><p style=\"text-align: left;\">hello</p><p style=\"text-align: left;\">bye</p></blockquote>"));

        it("can represent a nested blockquote",
            test(doc(blockquote(blockquote(blockquote(p("he said"))), p("i said"))),
                "<blockquote><blockquote><blockquote><p style=\"text-align: left;\">he said</p></blockquote></blockquote><p style=\"text-align: left;\">i said</p></blockquote>"));

        it("can represent headings",
            test(doc(h1("one"), h2("two"), p("text")),
                "<h1>one</h1><h2>two</h2><p style=\"text-align: left;\">text</p>"));

        it("can represent inline code",
            test(doc(p("text and ", code("code that is ", em("emphasized"), "..."))),
                "<p style=\"text-align: left;\">text and <code>code that is </code><em><code>emphasized</code></em><code>...</code></p>"));

        it("can represent a code block",
            test(doc(blockquote(pre("some code")), p("and")),
                "<blockquote><pre><code>some code</code></pre></blockquote><p style=\"text-align: left;\">and</p>"));

        it("supports leaf nodes in marks",
            test(doc(p(em("hi", br(), "x"))),
                "<p style=\"text-align: left;\"><em>hi<br>x</em></p>"));

        it("doesn't collapse non-breaking spaces",
            test(doc(p("\u00a0 \u00a0hello\u00a0")),
                "<p style=\"text-align: left;\">\u00a0 \u00a0hello\u00a0</p>"));

        it("can parse marks on block nodes", () => {
            let commentSchema: Schema = new Schema({
                nodes: schema.spec.nodes.update("doc", Object.assign({ marks: "comment" }, schema.spec.nodes.get("doc"))),
                marks: schema.spec.marks.update("comment", {
                    parseDOM: [{ tag: "div.comment" }],
                    toDOM() { return ["div", { class: "comment" }, 0]; }
                })
            });
            let b = builders(commentSchema) as any;
            test(b.doc(b.paragraph("one"), b.comment(b.paragraph("two"), b.paragraph(b.strong("three"))), b.paragraph("four")),
                "<p style=\"text-align: left;\">one</p><div class=\"comment\"><p style=\"text-align: left;\">two</p><p style=\"text-align: left;\"><strong>three</strong></p></div><p style=\"text-align: left;\">four</p>")();
        });

        it("parses unique, non-exclusive, same-typed marks", () => {
            let commentSchema: Schema = new Schema({
                nodes: schema.spec.nodes,
                marks: schema.spec.marks.update("comment", {
                    attrs: { id: { default: null } },
                    parseDOM: [{
                        tag: "span.comment",
                        getAttrs(dom: HTMLElement) { return { id: parseInt(dom.getAttribute('data-id')!, 10) }; }
                    }],
                    excludes: '',
                    toDOM(mark: Mark) { return ["span", { class: "comment", "data-id": mark.attrs.id }, 0]; }
                })
            });
            let b = builders(commentSchema);
            test(b.schema.nodes.doc.createAndFill(undefined, [
                b.schema.nodes.paragraph.createAndFill(undefined, [
                    b.schema.text('double comment', [
                        b.schema.marks.comment.create({ id: 1 }),
                        b.schema.marks.comment.create({ id: 2 })
                    ])!
                ])!
            ])!,
                "<p style=\"text-align: left;\"><span class=\"comment\" data-id=\"1\"><span class=\"comment\" data-id=\"2\">double comment</span></span></p>")();
        });

        it("serializes non-spanning marks correctly", () => {
            let markSchema: Schema = new Schema({
                nodes: schema.spec.nodes,
                marks: schema.spec.marks.update("test", {
                    parseDOM: [{ tag: "test" }],
                    toDOM() { return ["test", 0]; },
                    spanning: false
                })
            });
            let b = builders(markSchema) as any;
            test(b.doc(b.paragraph(b.test("a", b.image({ src: "x" }), "b"))),
                "<p style=\"text-align: left;\"><test>a</test><test><img src=\"x\"></test><test>b</test></p>")();
        });

        it("serializes an element and an attribute with XML namespace", () => {
            let xmlnsSchema: Schema = new Schema({
                nodes: {
                    doc: { content: "svg*" }, text: {},
                    "svg": {
                        parseDOM: [{ tag: "svg", namespace: 'http://www.w3.org/2000/svg' }],
                        group: 'block',
                        toDOM() { return ["http://www.w3.org/2000/svg svg", ["use", { "http://www.w3.org/1999/xlink href": "#svg-id" }]]; },
                    },
                },
            });

            let b = builders(xmlnsSchema) as any;
            let d = b.doc(b.svg());
            test(d, '<svg xmlns="http://www.w3.org/2000/svg"><use xmlns:ns1="http://www.w3.org/1999/xlink" ns1:href="#svg-id"/></svg>', xmlDocument)();

            let dom = xmlDocument.createElement('div');
            dom.appendChild(DOMSerializer.fromSchema(xmlnsSchema).serializeFragment(d.content, { document: xmlDocument }));
            ist(dom.querySelector('svg').namespaceURI, 'http://www.w3.org/2000/svg');
            ist(dom.querySelector('use').namespaceURI, 'http://www.w3.org/2000/svg');
            ist(dom.querySelector('use').attributes[0].namespaceURI, 'http://www.w3.org/1999/xlink');
        });

        function recover(html: string | HTMLElement, doc: PmNode, options?: ParseOptions) {
            return () => {
                let dom = document.createElement("div");
                if (typeof html == "string") dom.innerHTML = html;
                else dom.appendChild(html);
                ist(parser.parse(dom, options), doc, eq);
            };
        }

        it("can recover a list item",
            recover("<ol><p style=\"text-align: left;\">Oh no</p></ol>",
                doc(ol(li(p("Oh no"))))));

        it("wraps a list item in a list",
            recover("<li>hey</li>",
                doc(ol(li(p("hey"))))));

        it("can turn divs into paragraphs",
            recover("<div>hi</div><div>bye</div>",
                doc(p("hi"), p("bye"))));

        it("interprets <i> and <b> as emphasis and strong",
            recover("<p style=\"text-align: left;\"><i>hello <b>there</b></i></p>",
                doc(p(em("hello ", strong("there"))))));

        it("wraps stray text in a paragraph",
            recover("hi",
                doc(p("hi"))));

        it("ignores an extra wrapping <div>",
            recover("<div><p style=\"text-align: left;\">one</p><p style=\"text-align: left;\">two</p></div>",
                doc(p("one"), p("two"))));

        it("ignores meaningless whitespace",
            recover(" <blockquote> <p style=\"text-align: left;\">woo  \n  <em> hooo</em></p> </blockquote> ",
                doc(blockquote(p("woo ", em("hooo"))))));

        it("removes whitespace after a hard break",
            recover("<p style=\"text-align: left;\">hello<br>\n  world</p>",
                doc(p("hello", br(), "world"))));

        it("converts br nodes to newlines when they would otherwise be ignored",
            recover("<pre>foo<br>bar</pre>",
                doc(pre("foo\nbar"))));

        it("finds a valid place for invalid content",
            recover("<ul><li>hi</li><p style=\"text-align: left;\">whoah</p><li>again</li></ul>",
                doc(ul(li(p("hi")), li(p("whoah")), li(p("again"))))));

        it("moves nodes up when they don't fit the current context",
            recover("<div>hello<hr/>bye</div>",
                doc(p("hello"), hr(), p("bye"))));

        it("doesn't ignore whitespace-only text nodes",
            recover("<p style=\"text-align: left;\"><em>one</em> <strong>two</strong></p>",
                doc(p(em("one"), " ", strong("two")))));

        it("can handle stray tab characters",
            recover("<p style=\"text-align: left;\"> <b>&#09;</b></p>",
                doc(p())));

        it("normalizes random spaces",
            recover("<p style=\"text-align: left;\"><b>1 </b>  </p>",
                doc(p(strong("1")))));

        it("can parse an empty code block",
            recover("<pre></pre>",
                doc(pre())));

        it("preserves trailing space in a code block",
            recover("<pre>foo\n</pre>",
                doc(pre("foo\n"))));

        it("normalizes newlines when preserving whitespace",
            recover("<p style=\"text-align: left;\">foo  bar\nbaz</p>",
                doc(p("foo  bar baz")), { preserveWhitespace: true }));

        it("ignores <script> tags",
            recover("<p style=\"text-align: left;\">hello<script>alert('x')</script>!</p>",
                doc(p("hello!"))));

        it("can handle a head/body input structure",
            recover("<head><title>T</title><meta charset='utf8'/></head><body>hi</body>",
                doc(p("hi"))));

        it("only applies a mark once",
            recover("<p style=\"text-align: left;\">A <strong>big <strong>strong</strong> monster</strong>.</p>",
                doc(p("A ", strong("big strong monster"), "."))));

        it("interprets font-style: italic as em",
            recover("<p style=\"text-align: left;\"><span style='font-style: italic'>Hello</span>!</p>",
                doc(p(em("Hello"), "!"))));

        it("interprets font-weight: bold as strong",
            recover("<p style='font-weight: bold'>Hello</p>",
                doc(p(strong("Hello")))));

        it("allows clearing of pending marks",
            recover("<blockquote style='font-style: italic'><p style='font-style: normal'>One</p><p style=\"text-align: left;\">Two</p></blockquote",
                doc(blockquote(p("One"), p(em("Two"))))));

        it("allo clearing of active marks",
            recover("<ul><li style='font-style:italic'><p style=\"text-align: left;\"><span>Foo</span><span></span>" +
                "<span style='font-style:normal'>Bar</span></p></li></ul>",
                doc(ul(li(p(em("Foo"), "Bar"))))));

        it("ignores unknown inline tags",
            recover("<p><h>a</h>bc</p>",
                doc(p("abc"))));

        it("can add marks specified before their parent node is opened",
            recover("<em>hi</em> you",
                doc(p(em("hi"), " you"))));

        it("keeps applying a mark for the all of the node's content",
            recover("<p style=\"text-align: left;\"><strong><span>xx</span>bar</strong></p>",
                doc(p(strong("xxbar")))));

        it("doesn't ignore whitespace-only nodes in preserveWhitespace full mode",
            recover("<span> </span>x", doc(p(" x")), { preserveWhitespace: "full" }));

        it("closes block with inline content on seeing block-level children",
            recover("<div><br><div>CCC</div><div>DDD</div><br></div>",
                doc(p(br()), p("CCC"), p("DDD"), p(br()))));

        it("can move a block node out of a paragraph", () => {
            let dom = document.createElement("p");
            dom.appendChild(document.createTextNode("Hello"));
            dom.appendChild(document.createElement("hr"));
            recover(dom, doc(p("Hello"), hr()))();
        });

        function parse(html: string, options: ParseOptions, doc: PmNode) {
            return () => {
                let dom = document.createElement("div");
                dom.innerHTML = html;
                let result = parser.parse(dom, options);
                ist(result, doc, eq);
            };
        }

        it("accepts the topNode option",
            parse("<li>wow</li><li>such</li>", { topNode: schema.nodes.bullet_list.createAndFill()! },
                ul(li(p("wow")), li(p("such")))));

        let item = schema.nodes.list_item.createAndFill()!;
        it("accepts the topMatch option",
            parse("<ul><li>x</li></ul>", { topNode: item, topMatch: item.contentMatchAt(1)! },
                li(ul(li(p("x"))))));

        it("accepts from and to options",
            parse("<hr><p style=\"text-align: left;\">foo</p><p style=\"text-align: left;\">bar</p><img>", { from: 1, to: 3 },
                doc(p("foo"), p("bar"))));

        it("accepts the preserveWhitespace option",
            parse("foo   bar", { preserveWhitespace: true },
                doc(p("foo   bar"))));

        function open(html: string, nodes: (string | PmNode)[], openStart: number, openEnd: number, options?: ParseOptions) {
            return () => {
                let dom = document.createElement("div");
                dom.innerHTML = html;
                let result = parser.parseSlice(dom, options);
                ist(result, new Slice(Fragment.from(nodes.map(n => typeof n == "string" ? schema.text(n) : n)), openStart, openEnd), eq);
            };
        }

        it("can parse an open slice",
            open("foo", ["foo"], 0, 0));

        it("will accept weird siblings",
            open("foo<p style=\"text-align: left;\">bar</p>", ["foo", p("bar")], 0, 1));

        it("will open all the way to the inner nodes",
            open("<ul><li>foo</li><li>bar<br></li></ul>", [ul(li(p("foo")), li(p("bar", br())))], 3, 3));

        it("accepts content open to the left",
            open("<li><ul><li>a</li></ul></li>", [li(ul(li(p("a"))))], 4, 4));

        it("accepts content open to the right",
            open("<li>foo</li><li></li>", [li(p("foo")), li()], 2, 1));

        it("will create textblocks for block nodes",
            open("<div><div>foo</div><div>bar</div></div>", [p("foo"), p("bar")], 1, 1));

        it("can parse marks at the start of defaulted textblocks",
            open("<div>foo</div><div><em>bar</em></div>",
                [p("foo"), p(em("bar"))], 1, 1));

        it("will not apply invalid marks to nodes",
            open("<ul style='font-weight: bold'><li>foo</li></ul>", [ul(li(p(strong("foo"))))], 3, 3));

        it("will apply pending marks from parents to all children",
            open("<ul style='font-weight: bold'><li>foo</li><li>bar</li></ul>", [ul(li(p(strong("foo"))), li(p(strong("bar"))))], 3, 3));

        it("can parse nested mark with same type",
            open("<p style='font-weight: bold'>foo<strong style='font-weight: bold;'>bar</strong>baz</p>",
                [p(strong("foobarbaz"))], 1, 1));

        it("drops block-level whitespace",
            open("<div> </div>", [], 0, 0, { preserveWhitespace: true }));

        it("keeps whitespace in inline elements",
            open("<b> </b>", [p(strong(" ")).child(0)], 0, 0, { preserveWhitespace: true }));

        it("can parse nested mark with same type but different attrs", () => {
            let markSchema: Schema = new Schema({
                nodes: schema.spec.nodes,
                marks: schema.spec.marks.update("x", {
                    attrs: {
                        'data-x': { default: 'tag' }
                    },
                    excludes: '',
                    parseDOM: [{
                        tag: "x",
                    }, {
                        style: "text-decoration",
                        getAttrs() {
                            return {
                                'data-x': 'style'
                            };
                        }
                    }]
                })
            });
            let b = builders(markSchema);
            let dom = document.createElement("div");
            dom.innerHTML = "<p style='text-decoration: overline;'>o<x style='text-decoration: overline;'>o</x>o</p>";
            let result = DOMParser.fromSchema(markSchema).parseSlice(dom);

            ist(result, new Slice(Fragment.from(
                b.schema.nodes.paragraph.create(
                    undefined,
                    [
                        b.schema.text('o', [b.schema.marks.x.create({ 'data-x': 'style' })]),
                        b.schema.text('o', [b.schema.marks.x.create({ 'data-x': 'style' }), b.schema.marks.x.create({ 'data-x': 'tag' })]),
                        b.schema.text('o', [b.schema.marks.x.create({ 'data-x': 'style' })])
                    ]
                )
            ), 1, 1), eq);

            dom.innerHTML = "<p style=\"text-align: left;\"><span style='text-decoration: overline;'><x style='text-decoration: overline;'>o</x>o</span>o</p>";
            result = DOMParser.fromSchema(markSchema).parseSlice(dom);
            ist(result, new Slice(Fragment.from(
                b.schema.nodes.paragraph.create(
                    undefined,
                    [
                        b.schema.text('o', [b.schema.marks.x.create({ 'data-x': 'style' }), b.schema.marks.x.create({ 'data-x': 'tag' })]),
                        b.schema.text('o', [b.schema.marks.x.create({ 'data-x': 'style' })]),
                        b.schema.text('o')
                    ]
                )
            ), 1, 1), eq);
        });

        it("can temporary shadow a mark with another configuration of the same type", () => {
            let s: Schema = new Schema({
                nodes: schema.spec.nodes, marks: {
                    color: {
                        attrs: { color: {} },
                        toDOM: m => ["span", { style: `color: ${m.attrs.color}` }],
                        parseDOM: [{ style: "color", getAttrs: v => ({ color: v }) }]
                    }
                }
            });
            let d = DOMParser.fromSchema(s)
                .parse(domFrom('<p style=\"text-align: left;\"><span style="color: red">abc<span style="color: blue">def</span>ghi</span></p>'));
            ist(d, s.node("doc", null, [s.node("paragraph", null, [
                s.text("abc", [s.mark("color", { color: "red" })]),
                s.text("def", [s.mark("color", { color: "blue" })]),
                s.text("ghi", [s.mark("color", { color: "red" })])
            ])]), eq);
        });

        function find(html: string, doc: PmNode) {
            return () => {
                let dom = document.createElement("div");
                dom.innerHTML = html;
                let tag = dom.querySelector("var"), prev = tag.previousSibling!, next = tag.nextSibling, pos;
                if (prev && next && prev.nodeType == TEXT_NODE && next.nodeType == TEXT_NODE) {
                    pos = { node: prev, offset: prev.nodeValue.length };
                    prev.nodeValue += next.nodeValue;
                    next.parentNode.removeChild(next);
                } else {
                    pos = { node: tag.parentNode, offset: Array.prototype.indexOf.call(tag.parentNode.childNodes, tag) };
                }
                tag.parentNode.removeChild(tag);
                let result = parser.parse(dom, {
                    findPositions: [pos]
                });
                ist(result, doc, eq);
                ist((pos as any).pos, doc.tag.a);
            };
        }

        it("can find a position at the start of a paragraph",
            find("<p style=\"text-align: left;\"><var></var>hello</p>",
                doc(p("<a>hello"))));

        it("can find a position at the end of a paragraph",
            find("<p style=\"text-align: left;\">hello<var></var></p>",
                doc(p("hello<a>"))));

        it("can find a position inside text",
            find("<p style=\"text-align: left;\">hel<var></var>lo</p>",
                doc(p("hel<a>lo"))));

        it("can find a position inside an ignored node",
            find("<p style=\"text-align: left;\">hi</p><object><var></var>foo</object><p style=\"text-align: left;\">ok</p>",
                doc(p("hi"), "<a>", p("ok"))));

        it("can find a position between nodes",
            find("<ul><li>foo</li><var></var><li>bar</li></ul>",
                doc(ul(li(p("foo")), "<a>", li(p("bar"))))));

        it("can find a position at the start of the document",
            find("<var></var><p style=\"text-align: left;\">hi</p>",
                doc("<a>", p("hi"))));

        it("can find a position at the end of the document",
            find("<p style=\"text-align: left;\">hi</p><var></var>",
                doc(p("hi"), "<a>")));

        let quoteSchema: Schema = new Schema({ nodes: schema.spec.nodes, marks: schema.spec.marks, topNode: "blockquote" });

        it("uses a custom top node when parsing",
            test(quoteSchema.node("blockquote", null, quoteSchema.node("paragraph", null, quoteSchema.text("hello"))),
                "<p style=\"text-align: left;\">hello</p>"));

        function contextParser(context: string) {
            return new DOMParser(schema, [{ tag: "foo", node: "horizontal_rule", context } as ParseRule]
                .concat(DOMParser.schemaRules(schema) as ParseRule[]));
        }

        it("recognizes context restrictions", () => {
            ist(contextParser("blockquote/").parse(domFrom("<foo></foo><blockquote><foo></foo><p style=\"text-align: left;\"><foo></foo></p></blockquote>")),
                doc(blockquote(hr(), p())), eq);
        });

        it("accepts group names in contexts", () => {
            ist(contextParser("block/").parse(domFrom("<foo></foo><blockquote><foo></foo><p style=\"text-align: left;\"></p></blockquote>")),
                doc(blockquote(hr(), p())), eq);
        });

        it("understands nested context restrictions", () => {
            ist(contextParser("blockquote/ordered_list//")
                .parse(domFrom("<foo></foo><blockquote><foo></foo><ol><li><p style=\"text-align: left;\">a</p><foo></foo></li></ol></blockquote>")),
                doc(blockquote(ol(li(p("a"), hr())))), eq);
        });

        it("understands double slashes in context restrictions", () => {
            ist(contextParser("blockquote//list_item/")
                .parse(domFrom("<foo></foo><blockquote><foo></foo><ol><foo></foo><li><p style=\"text-align: left;\">a</p><foo></foo></li></ol></blockquote>")),
                doc(blockquote(ol(li(p("a"), hr())))), eq);
        });

        it("understands pipes in context restrictions", () => {
            ist(contextParser("list_item/|blockquote/")
                .parse(domFrom("<foo></foo><blockquote><p style=\"text-align: left;\"></p><foo></foo></blockquote><ol><li><p style=\"text-align: left;\">a</p><foo></foo></li></ol>")),
                doc(blockquote(p(), hr()), ol(li(p("a"), hr()))), eq);
        });

        it("uses the passed context", () => {
            let cxDoc = doc(blockquote("<a>", hr()));
            ist(contextParser("doc//blockquote/").parse(domFrom("<blockquote><foo></foo></blockquote>"), {
                topNode: blockquote(),
                context: cxDoc.resolve(cxDoc.tag.a)
            }), blockquote(blockquote(hr())), eq);
        });

        it("uses the passed context when parsing a slice", () => {
            let cxDoc = doc(blockquote("<a>", hr()));
            ist(contextParser("doc//blockquote/").parseSlice(domFrom("<foo></foo>"), {
                context: cxDoc.resolve(cxDoc.tag.a)
            }), new Slice(blockquote(hr()).content, 0, 0), eq);
        });

        it("can close parent nodes from a rule", () => {
            let closeParser = new DOMParser(schema, [{ tag: "br", closeParent: true } as ParseRule]
                .concat(DOMParser.schemaRules(schema)));
            ist(closeParser.parse(domFrom("<p style=\"text-align: left;\">one<br>two</p>")), doc(p("one"), p("two")), eq);
        });

        it("supports non-consuming node rules", () => {
            let parser = new DOMParser(schema, [{ tag: "ol", consuming: false, node: "blockquote" } as ParseRule]
                .concat(DOMParser.schemaRules(schema)));
            ist(parser.parse(domFrom("<ol><p style=\"text-align: left;\">one</p></ol>")), doc(blockquote(ol(li(p("one"))))), eq);
        });

        it("supports non-consuming style rules", () => {
            let parser = new DOMParser(schema, [{ style: "font-weight", consuming: false, mark: "em" } as ParseRule]
                .concat(DOMParser.schemaRules(schema)));
            ist(parser.parse(domFrom("<p style=\"text-align: left;\"><span style='font-weight: 800'>one</span></p>")), doc(p(em(strong("one")))), eq);
        });

        it("doesn't get confused by nested mark tags",
            recover("<div><strong><strong>A</strong></strong>B</div><span>C</span>",
                doc(p(strong("A"), "B"), p("C"))));

        it("ignores styles on skipped nodes", () => {
            let dom = document.createElement("div");
            dom.innerHTML = "<p style=\"text-align: left;\">abc <span style='font-weight: bold'>def</span></p>";
            ist(parser.parse(dom, {
                ruleFromNode: node => {
                    return node.nodeType == ELEMENT_NODE && (node as HTMLElement).tagName == "SPAN" ? { skip: node as any } : null;
                }
            }), doc(p("abc def")), eq);

        });

        it("preserves whitespace in <pre> elements", () => {
            let schema: Schema = new Schema({
                nodes: {
                    doc: { content: "block+" },
                    text: { group: "inline" },
                    p: { group: "block", content: "inline*" }
                }
            });
            ist(DOMParser.fromSchema(schema).parse(domFrom("<pre>  hello </pre>   ")),
                schema.node("doc", null, [schema.node("p", null, [schema.text("  hello ")])]), eq);
        });

        it("preserves whitespace in nodes styled with white-space", () => {
            recover("  <div style='white-space: pre'>  okay  then </div>  <p style=\"text-align: left;\"> x</p>",
                doc(p("  okay  then "), p("x")));
        });

      it("inserts line break replacements", () => {
        let s: Schema = new Schema({
          nodes: schema.spec.nodes.update("hard_break", {...schema.spec.nodes.get("hard_break"), linebreakReplacement: true})
        })
        ist(DOMParser.fromSchema(s).parse(domFrom("<p style=\"text-align: left;\"><span style='white-space: pre'>one\ntwo\n\nthree</span></p>")).toString(),
          'doc(paragraph("one", hard_break, "two", hard_break, hard_break, "three"))')
        ist(DOMParser.fromSchema(s).parse(domFrom("<p style=\"text-align: left;\"><span>one\ntwo\n\nthree</span></p>")).toString(),
          'doc(paragraph("one two three"))')
      })
    });

    describe("schemaRules", () => {
        it("defaults to schema order", () => {
            let schema: Schema = new Schema({
                marks: { em: { parseDOM: [{ tag: "i" }, { tag: "em" }] } },
                nodes: {
                    doc: { content: "inline*" },
                    text: { group: "inline" },
                    foo: { group: "inline", inline: true, parseDOM: [{ tag: "foo" }] },
                    bar: { group: "inline", inline: true, parseDOM: [{ tag: "bar" }] }
                }
            });
            ist(DOMParser.schemaRules(schema).map(r => r.tag).join(" "), "i em foo bar");
        });

        it("understands priority", () => {
            let schema: Schema = new Schema({
                marks: { em: { parseDOM: [{ tag: "i", priority: 40 }, { tag: "em", priority: 70 }] } },
                nodes: {
                    doc: { content: "inline*" },
                    text: { group: "inline" },
                    foo: { group: "inline", inline: true, parseDOM: [{ tag: "foo" }] },
                    bar: { group: "inline", inline: true, parseDOM: [{ tag: "bar", priority: 60 }] }
                }
            });
            ist(DOMParser.schemaRules(schema).map(r => r.tag).join(" "), "em bar foo i");
        });

        function nsParse(doc: Node, namespace?: string) {
            let schema: Schema = new Schema({
                nodes: {
                    doc: { content: "h*" }, text: {},
                    h: { parseDOM: [{ tag: "h", namespace }] }
                }
            });
            return DOMParser.fromSchema(schema).parse(doc);
        }

        it("includes nodes when namespace is correct", () => {
            let doc = xmlDocument.createElement("doc");
            let h = xmlDocument.createElementNS("urn:ns", "h");
            doc.appendChild(h);
            ist(nsParse(doc, "urn:ns").childCount, 1);
        });

        it("excludes nodes when namespace is wrong", () => {
            let doc = xmlDocument.createElement("doc");
            let h = xmlDocument.createElementNS("urn:nt", "h");
            doc.appendChild(h);
            ist(nsParse(doc, "urn:ns").childCount, 0);
        });

        it("excludes nodes when namespace is absent", () => {
            let doc = xmlDocument.createElement("doc");
            // in HTML documents, createElement gives namespace
            // 'http://www.w3.org/1999/xhtml' so use createElementNS
            let h = xmlDocument.createElementNS(null, "h");
            doc.appendChild(h);
            ist(nsParse(doc, "urn:ns").childCount, 0);
        });

        it("excludes nodes when namespace is wrong and xhtml", () => {
            let doc = xmlDocument.createElement("doc");
            let h = xmlDocument.createElementNS("urn:nt", "h");
            doc.appendChild(h);
            ist(nsParse(doc, "http://www.w3.org/1999/xhtml").childCount, 0);
        });

        it("excludes nodes when namespace is wrong and empty", () => {
            let doc = xmlDocument.createElement("doc");
            let h = xmlDocument.createElementNS("urn:nt", "h");
            doc.appendChild(h);
            ist(nsParse(doc, "").childCount, 0);
        });

        it("includes nodes when namespace is correct and empty", () => {
            let doc = xmlDocument.createElement("doc");
            let h = xmlDocument.createElementNS(null, "h");
            doc.appendChild(h);
            ist(nsParse(doc).childCount, 1);
        });
    });
});

describe("DOMSerializer", () => {
    let noEm = new DOMSerializer(serializer.nodes, Object.assign({}, serializer.marks, { em: null }));

    it("can omit a mark", () => {
        ist((noEm.serializeNode(p("foo", em("bar"), strong("baz")), { document }) as HTMLElement).innerHTML,
            "foobar<strong>baz</strong>");
    });

    it("doesn't split other marks for omitted marks", () => {
        ist((noEm.serializeNode(p("foo", code("bar"), em(code("baz"), "quux"), "xyz"), { document }) as HTMLElement).innerHTML,
            "foo<code>barbaz</code>quuxxyz");
    });

    it("can render marks with complex structure", () => {
        let deepEm = new DOMSerializer(serializer.nodes, Object.assign({}, serializer.marks, {
            em() { return ["em", ["i", { "data-emphasis": true }, 0]]; }
        }));
        let node = deepEm.serializeNode(p(strong("foo", code("bar"), em(code("baz"))), em("quux"), "xyz"), { document });
        ist((node as HTMLElement).innerHTML,
            "<strong>foo<code>bar</code></strong><em><i data-emphasis=\"true\"><strong><code>baz</code></strong>quux</i></em>xyz");
    });

    it("refuses to use values from attributes as DOM specs", () => {
        let weird = new DOMSerializer(Object.assign({}, serializer.nodes, {
            image: (node: PmNode) => ["span", ["img", { src: node.attrs.src }], node.attrs.alt]
        }), serializer.marks);
        // Use type assertion since we're intentionally testing runtime validation of invalid attribute types
        ist.throws(() => weird.serializeNode(img({ src: "x.png", alt: ["script", { src: "http://evil.com/inject.js" }] } as unknown as Attrs),
            { document }),
            /Using an array from an attribute object as a DOM spec/);
    });
});
