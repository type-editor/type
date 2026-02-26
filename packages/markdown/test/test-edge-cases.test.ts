import ist from 'ist';
import {describe, it,} from 'vitest';

import {defaultMarkdownParser} from '@src/from-markdown/default-markdown-parser';
import {defaultMarkdownSerializer} from '@src/to-markdown/default-markdown-serializer.js';
import {eq} from '@type-editor/test-builder';
import {a, blockquote, code, doc, em, h1, hr, li, p, pre, strong, ul,} from './build.js';

function roundtrip(markdown: string) {
    const parsed = defaultMarkdownParser.parse(markdown);
    const serialized = defaultMarkdownSerializer.serialize(parsed);
    const reparsed = defaultMarkdownParser.parse(serialized);
    ist(parsed, reparsed, eq);
    return serialized;
}

describe("markdown edge cases and roundtrip", () => {
    it("roundtrips simple paragraph", () => {
        roundtrip("Hello world");
    });

    it("roundtrips multiple paragraphs", () => {
        roundtrip("First\n\nSecond\n\nThird");
    });

    it("roundtrips headings at all levels", () => {
        roundtrip("# H1\n\n## H2\n\n### H3\n\n#### H4\n\n##### H5\n\n###### H6");
    });

    it("roundtrips nested blockquotes", () => {
        roundtrip("> level 1\n>\n> > level 2\n> >\n> > > level 3");
    });

    it("roundtrips tight lists", () => {
        roundtrip("* item1\n* item2\n* item3");
    });

    it("roundtrips loose lists", () => {
        roundtrip("* item1\n\n* item2\n\n* item3");
    });

    it("roundtrips ordered list with custom start", () => {
        roundtrip("5. first\n\n6. second");
    });

    it("roundtrips nested lists", () => {
        roundtrip("* outer1\n\n  * inner1\n\n  * inner2\n\n* outer2");
    });

    it("roundtrips code blocks", () => {
        roundtrip("```\ncode here\n```");
    });

    it("roundtrips code blocks with language", () => {
        roundtrip("```javascript\nconst x = 1;\n```");
    });

    it("roundtrips inline code", () => {
        roundtrip("text with `code` in it");
    });

    it("roundtrips emphasis", () => {
        roundtrip("text with *emphasis* here");
    });

    it("roundtrips strong", () => {
        roundtrip("text with **strong** here");
    });

    it("roundtrips combined em and strong", () => {
        roundtrip("text with ***both*** here");
    });

    it("roundtrips links", () => {
        roundtrip("[link text](https://example.com)");
    });

    it("roundtrips links with title", () => {
        roundtrip('[link](url "title")');
    });

    it("roundtrips autolinks", () => {
        roundtrip("<https://example.com>");
    });

    it("roundtrips images", () => {
        roundtrip("![alt](image.png)");
    });

    it("roundtrips images with title", () => {
        roundtrip('![alt](image.png "title")');
    });

    it("roundtrips hard breaks", () => {
        roundtrip("line1\\\nline2");
    });

    it("roundtrips horizontal rules", () => {
        roundtrip("text\n\n---\n\nmore");
    });

    it("handles very long paragraphs", () => {
        const longText = "word ".repeat(1000);
        const result = defaultMarkdownParser.parse(longText);
        ist(result.firstChild.textContent.length > 1000, true);
    });

    it("handles deeply nested structures", () => {
        const nested = "> > > > > deep quote";
        const result = defaultMarkdownParser.parse(nested);
        let depth = 0;
        let node = result.firstChild;
        while (node && node.type.name === 'blockquote') {
            depth++;
            node = node.firstChild;
        }
        ist(depth, 5);
    });

    it("handles lists with many items", () => {
        const items = Array.from({ length: 100 }, (_, i) => `${i + 1}. Item ${i + 1}`).join('\n\n');
        const result = defaultMarkdownParser.parse(items);
        ist(result.firstChild.childCount, 100);
    });

    it("handles empty list items", () => {
        const result = defaultMarkdownParser.parse("* \n* item");
        ist(result.firstChild.type.name, 'bullet_list');
    });

    it("handles code with special characters", () => {
        const specialChars = "```\n<>&\"'`*_[]()#+-!|\\{}\n```";
        const result = defaultMarkdownParser.parse(specialChars);
        ist(result.firstChild.textContent.includes('<>&'), true);
    });

    it("handles inline code with special markdown characters", () => {
        const result = defaultMarkdownParser.parse("`*_[]`");
        ist(result.firstChild.firstChild.text, '*_[]');
    });

    it("handles multiple marks on same text", () => {
        const result = defaultMarkdownParser.parse("**_both_**");
        const textNode = result.firstChild.firstChild;
        ist(textNode.marks.length >= 1, true);
    });

    it("handles mark boundaries correctly", () => {
        const result = defaultMarkdownParser.parse("*start* middle *end*");
        ist(result.firstChild.childCount, 3);
    });

    it("handles adjacent marks", () => {
        const result = defaultMarkdownParser.parse("**bold***italic*");
        ist(result.firstChild.childCount >= 2, true);
    });

    it("handles empty emphasis", () => {
        const result = defaultMarkdownParser.parse("** **");
        // Should handle gracefully
        ist(result.type.name, 'doc');
    });

    it("handles malformed markdown gracefully", () => {
        const result = defaultMarkdownParser.parse("**unclosed");
        ist(result.type.name, 'doc');
    });

    it("handles mixed list types", () => {
        const markdown = "* bullet\n\n1. ordered\n\n* bullet again";
        const result = defaultMarkdownParser.parse(markdown);
        ist(result.childCount, 3);
    });

    it("handles blockquote with mixed content", () => {
        const markdown = "> # Heading\n>\n> paragraph\n>\n> * list";
        const result = defaultMarkdownParser.parse(markdown);
        const bq = result.firstChild;
        ist(bq.type.name, 'blockquote');
        ist(bq.childCount >= 2, true);
    });

    it("handles code block immediately after list", () => {
        const markdown = "* list item\n\n```\ncode\n```";
        const result = defaultMarkdownParser.parse(markdown);
        ist(result.childCount, 2);
        ist(result.child(0).type.name, 'bullet_list');
        ist(result.child(1).type.name, 'code_block');
    });

    it("handles heading immediately after list", () => {
        const markdown = "* list\n\n# heading";
        const result = defaultMarkdownParser.parse(markdown);
        ist(result.childCount, 2);
    });

    it("handles escaped characters in text", () => {
        const result = defaultMarkdownParser.parse("\\*not emphasis\\*");
        ist(result.firstChild.firstChild.text.includes('*'), true);
    });

    it("handles backslash at end of line (not hard break)", () => {
        const result = defaultMarkdownParser.parse("text\\");
        ist(result.firstChild.textContent.includes('\\'), true);
    });

    it("handles Unicode characters", () => {
        const unicode = "日本語 テキスト 🎉";
        const result = defaultMarkdownParser.parse(unicode);
        ist(result.firstChild.textContent, unicode);
    });

    it("handles emoji in text", () => {
        const result = defaultMarkdownParser.parse("Hello 👋 World 🌍");
        ist(result.firstChild.textContent.includes('👋'), true);
    });

    it("handles RTL text", () => {
        const rtl = "مرحبا بالعالم";
        const result = defaultMarkdownParser.parse(rtl);
        ist(result.firstChild.textContent, rtl);
    });

    it("handles very long words", () => {
        const longWord = "a".repeat(10000);
        const result = defaultMarkdownParser.parse(longWord);
        ist(result.firstChild.textContent.length, 10000);
    });

    it("handles tab characters", () => {
        const result = defaultMarkdownParser.parse("text\twith\ttabs");
        ist(result.firstChild.textContent.includes('\t'), true);
    });

    it("handles multiple consecutive newlines", () => {
        const result = defaultMarkdownParser.parse("para1\n\n\n\n\npara2");
        ist(result.childCount, 2);
    });

    it("handles heading with inline code", () => {
        const result = defaultMarkdownParser.parse("# Heading with `code`");
        ist(result.firstChild.type.name, 'heading');
        ist(result.firstChild.childCount >= 2, true);
    });

    it("handles heading with emphasis", () => {
        const result = defaultMarkdownParser.parse("# Heading with *emphasis*");
        ist(result.firstChild.type.name, 'heading');
    });

    it("handles link with code in text", () => {
        const result = defaultMarkdownParser.parse("[`code` link](url)");
        ist(result.firstChild.firstChild.marks.length >= 1, true);
    });

    it("handles image in link (unusual but valid)", () => {
        const markdown = "[![alt](image.png)](link)";
        const result = defaultMarkdownParser.parse(markdown);
        // Should parse without errors
        ist(result.type.name, 'doc');
    });

    it("handles link with newline in text", () => {
        const result = defaultMarkdownParser.parse("[multi\nline](url)");
        ist(result.firstChild.firstChild.marks.length >= 1, true);
    });

    it("handles empty link text", () => {
        const result = defaultMarkdownParser.parse("[](url)");
        ist(result.type.name, 'doc');
    });

    it("handles link with special chars in URL", () => {
        const result = defaultMarkdownParser.parse("[text](http://example.com?a=1&b=2)");
        const link = result.firstChild.firstChild.marks[0];
        ist(link.attrs.href.includes('&'), true);
    });

    it("handles nested lists with different types", () => {
        const markdown = "* bullet\n\n  1. ordered\n\n  2. ordered\n\n* bullet";
        const result = defaultMarkdownParser.parse(markdown);
        ist(result.firstChild.type.name, 'bullet_list');
    });

    it("handles list item with multiple paragraphs", () => {
        const markdown = "* para 1\n\n  para 2\n\n* item 2";
        const result = defaultMarkdownParser.parse(markdown);
        const firstItem = result.firstChild.firstChild;
        ist(firstItem.childCount >= 2, true);
    });

    it("handles code fence with many backticks", () => {
        const markdown = "``````\ncode\n``````";
        const result = defaultMarkdownParser.parse(markdown);
        ist(result.firstChild.type.name, 'code_block');
    });

    it("serializes then parses complex document", () => {
        const complexDoc = doc(
            h1("Title"),
            p("Intro with ", em("emphasis"), " and ", strong("bold")),
            blockquote(p("Quote with ", a("link"))),
            ul(
                li(p("Item 1")),
                li(p("Item 2 with ", code("code")))
            ),
            pre("code block"),
            hr(),
            p("Final paragraph")
        );

        const serialized = defaultMarkdownSerializer.serialize(complexDoc);
        const reparsed = defaultMarkdownParser.parse(serialized);
        ist(complexDoc, reparsed, eq);
    });
})

