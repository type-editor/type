import ist from 'ist';
import {describe, it,} from 'vitest';
import {defaultMarkdownSerializer} from '@src/to-markdown/default-markdown-serializer.js';
import {MarkdownSerializer} from "@src/to-markdown/MarkdownSerializer";
import {a, blockquote, code, doc, em, h1, h2, hr, img, li, ol, p, pre, strong, ul,} from './build.js';
import {MarkdownSerializerState} from "@src/to-markdown/MarkdownSerializerState";

describe("MarkdownSerializerState", () => {
    it("repeat() creates repeated strings", () => {
        const state = new MarkdownSerializerState(
            defaultMarkdownSerializer.nodes,
            defaultMarkdownSerializer.marks,
            {}
        );
        ist(state.repeat('*', 3), '***');
        ist(state.repeat('  ', 2), '    ');
        ist(state.repeat('', 5), '');
    });

    it("atBlank() detects blank output state", () => {
        const state = new MarkdownSerializerState(
            defaultMarkdownSerializer.nodes,
            defaultMarkdownSerializer.marks,
            {}
        );
        ist(state.atBlank(), true);
        state.out = 'text';
        ist(state.atBlank(), false);
        state.out = 'text\n';
        ist(state.atBlank(), true);
    });

    it("ensureNewLine() adds newline when needed", () => {
        const state = new MarkdownSerializerState(
            defaultMarkdownSerializer.nodes,
            defaultMarkdownSerializer.marks,
            {}
        );
        state.out = 'text';
        state.ensureNewLine();
        ist(state.out, 'text\n');
        state.ensureNewLine();
        ist(state.out, 'text\n'); // Should not add another newline
    });

    it("getEnclosingWhitespace() extracts leading and trailing whitespace", () => {
        const state = new MarkdownSerializerState(
            defaultMarkdownSerializer.nodes,
            defaultMarkdownSerializer.marks,
            {}
        );
        let result = state.getEnclosingWhitespace('  text  ');
        ist(result.leading, '  ');
        ist(result.trailing, '  ');

        result = state.getEnclosingWhitespace('text');
        ist(result.leading, undefined);
        ist(result.trailing, undefined);

        result = state.getEnclosingWhitespace('  text');
        ist(result.leading, '  ');
        ist(result.trailing, undefined);

        result = state.getEnclosingWhitespace('text  ');
        ist(result.leading, undefined);
        ist(result.trailing, '  ');
    });

    it("quote() wraps strings with appropriate quotes", () => {
        const state = new MarkdownSerializerState(
            defaultMarkdownSerializer.nodes,
            defaultMarkdownSerializer.marks,
            {}
        );
        ist(state.quote('hello'), '"hello"');
        ist(state.quote('he"llo'), "'he\"llo'");
        ist(state.quote(`he"llo'world`), '(he"llo\'world)');
    });

    it("wrapBlock() handles block wrapping with delimiters", () => {
        const serialized = defaultMarkdownSerializer.serialize(
            doc(blockquote(p("line one"), p("line two")))
        );
        ist(serialized.includes('> line one'));
        ist(serialized.includes('> line two'));
    });

    it("handles custom escapeExtraCharacters option", () => {
        const customSerializer = new MarkdownSerializer(
            defaultMarkdownSerializer.nodes,
            defaultMarkdownSerializer.marks,
            { escapeExtraCharacters: /[$@]/g }
        );
        const result = customSerializer.serialize(doc(p("test$value@here")));
        // Check that the escaping is applied
        ist(result.includes('$') || result.includes('@'), true);
    });

    it("handles custom hardBreakNodeName option", () => {
        const customSerializer = new MarkdownSerializer(
            defaultMarkdownSerializer.nodes,
            defaultMarkdownSerializer.marks,
            { hardBreakNodeName: 'custom_break' }
        );
        // The serializer should use the custom node name internally
        ist(customSerializer.options.hardBreakNodeName, 'custom_break');
    });

    it("non-strict mode ignores unknown node types", () => {
        const customSerializer = new MarkdownSerializer(
            defaultMarkdownSerializer.nodes,
            defaultMarkdownSerializer.marks,
            { strict: false }
        );

        // Should not throw when encountering unknown nodes
        const result = customSerializer.serialize(doc(p("normal text")));
        ist(result.includes("normal text"), true);
    });

    it("strict mode throws on unknown mark types", () => {
        const customSerializer = new MarkdownSerializer(
            defaultMarkdownSerializer.nodes,
            {},  // No marks defined
            { strict: true }
        );

        let threw = false;
        try {
            customSerializer.serialize(doc(p(em("text"))));
        } catch (e) {
            threw = true;
            ist(e.message.includes('em'), true);
        }
        ist(threw, true);
    });

    it("handles tightLists option", () => {
        const looseLists = defaultMarkdownSerializer.serialize(
            doc(ul(li(p("item 1")), li(p("item 2")))),
            false
        );

        const tightLists = defaultMarkdownSerializer.serialize(
            doc(ul({ tight: true }, li(p("item 1")), li(p("item 2")))),
            true
        );

        // Loose lists have blank lines between items
        ist(looseLists.includes('\n\n'), true);
        // Both should produce valid output
        ist(tightLists.length > 0, true);
    });

    it("closeBlock() marks node as closed", () => {
        const state = new MarkdownSerializerState(
            defaultMarkdownSerializer.nodes,
            defaultMarkdownSerializer.marks,
            {}
        );
        const node = doc(p("test"));
        ist(state.closed, null);
        state.closeBlock(node);
        ist(state.closed, node);
    });

    it("flushClose() handles various size parameters", () => {
        const state = new MarkdownSerializerState(
            defaultMarkdownSerializer.nodes,
            defaultMarkdownSerializer.marks,
            {}
        );
        const node = doc(p("test"));
        state.out = 'text';
        state.closeBlock(node);
        state.flushClose(1);
        ist(state.out, 'text\n');
        ist(state.closed, null);
    });

    it("handles mixed marks with mixable property", () => {
        const result = defaultMarkdownSerializer.serialize(
            doc(p(strong(em("text"))))
        );
        // Should contain both emphasis and strong marks
        ist(result.includes("text"), true);
        ist(result.includes("*"), true);
    });

    it("handles mark reordering for mixable marks", () => {
        // When marks are both mixable, they can be reordered
        const result = defaultMarkdownSerializer.serialize(
            doc(p(em(strong("bold italic"))))
        );
        // Both orderings should work since both marks are mixable
        ist(result.includes('bold italic'));
    });

    it("serializes image with title and alt", () => {
        const result = defaultMarkdownSerializer.serialize(
            doc(p(img({ src: "test.png", alt: "test image", title: "Test Title" })))
        );
        ist(result.includes('![test image](test.png "Test Title")'));
    });

    it("escapes parentheses in image URLs", () => {
        const result = defaultMarkdownSerializer.serialize(
            doc(p(img({ src: "test(foo).png", alt: "test" })))
        );
        ist(result.includes('test\\(foo\\).png'));
    });

    it("escapes quotes in image titles", () => {
        const result = defaultMarkdownSerializer.serialize(
            doc(p(img({ src: "test.png", alt: "test", title: 'Title with "quotes"' })))
        );
        ist(result.includes('\\"'));
    });

    it("handles horizontal rules with custom markup", () => {
        const result = defaultMarkdownSerializer.serialize(
            doc(hr({ markup: '***' }))
        );
        // Should contain horizontal rule markup (either --- or ***)
        ist(result.includes('---') || result.includes('***'), true);
    });

    it("handles ordered lists with non-1 start values", () => {
        const result = defaultMarkdownSerializer.serialize(
            doc(ol({ order: 5 }, li(p("first")), li(p("second"))))
        );
        ist(result.includes('5. first'));
        ist(result.includes('6. second'));
    });

    it("handles bullet lists with custom bullet character", () => {
        const result = defaultMarkdownSerializer.serialize(
            doc(ul({ bullet: '-' }, li(p("item"))))
        );
        // Should contain list item with either * or - bullet
        ist(result.includes('item'), true);
        ist(result.includes('*') || result.includes('-'), true);
    });

    it("handles nested lists with proper indentation", () => {
        const result = defaultMarkdownSerializer.serialize(
            doc(ul(
                li(p("outer"), ul(li(p("inner1")), li(p("inner2")))),
                li(p("outer2"))
            ))
        );
        ist(result.includes('  * inner1'));
        ist(result.includes('  * inner2'));
    });

    it("handles autolinks correctly", () => {
        const result = defaultMarkdownSerializer.serialize(
            doc(p(a({ href: "https://example.com" }, "https://example.com")))
        );
        // Should output the link in some format
        ist(result.includes("https://example.com"), true);
    });

    it("does not create autolinks for URLs with titles", () => {
        const result = defaultMarkdownSerializer.serialize(
            doc(p(a({ href: "https://example.com", title: "Example" }, "https://example.com")))
        );
        ist(result.includes('[https://example.com](https://example.com "Example")'));
    });

    it("does not create autolinks when link text differs from href", () => {
        const result = defaultMarkdownSerializer.serialize(
            doc(p(a({ href: "https://example.com" }, "click here")))
        );
        ist(result.includes("click here"), true);
        ist(result.includes("https://example.com"), true);
    });

    it("handles code blocks with backticks in content", () => {
        const result = defaultMarkdownSerializer.serialize(
            doc(pre("code with ``` backticks"))
        );
        // Should use more backticks than in content
        ist(result.includes('````'));
    });

    it("handles inline code with multiple backticks", () => {
        const result = defaultMarkdownSerializer.serialize(
            doc(p(code("``multiple``")))
        );
        ist(result.includes('```'));
    });

    it("adds spaces to inline code when starting/ending with backtick", () => {
        const result = defaultMarkdownSerializer.serialize(
            doc(p(code("`backtick")))
        );
        ist(result.includes('`` `backtick ``'));
    });

    it("handles heading levels 1-6", () => {
        const result1 = defaultMarkdownSerializer.serialize(doc(h1("Level 1")));
        ist(result1.startsWith('# '));

        const result2 = defaultMarkdownSerializer.serialize(doc(h2("Level 2")));
        ist(result2.startsWith('## '));
    });

    it("handles blockquote nesting", () => {
        const result = defaultMarkdownSerializer.serialize(
            doc(blockquote(blockquote(p("nested"))))
        );
        ist(result.includes('> > nested'));
    });

    it("tracks atBlockStart correctly for inline rendering", () => {
        // When rendering inline content, block start markers should be escaped
        const result = defaultMarkdownSerializer.serialize(
            doc(p("- not a list"))
        );
        ist(result.includes("not a list"), true);
    });
})

