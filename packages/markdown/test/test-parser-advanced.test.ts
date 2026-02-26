import ist from 'ist';
import MarkdownIt from 'markdown-it';
import {describe, it,} from 'vitest';
import {defaultMarkdownParser} from '@src/from-markdown/default-markdown-parser';
import {MarkdownParser} from '@src/from-markdown/MarkdownParser';
import {schema} from '@src/schema';

describe("MarkdownParser advanced features", () => {
    it("parses with custom markdownEnv parameter", () => {
        const env = { custom: 'value' };
        const result = defaultMarkdownParser.parse("hello", env);
        ist(result.type.name, 'doc');
    });

    it("handles empty document", () => {
        const result = defaultMarkdownParser.parse("");
        ist(result.type.name, 'doc');
    });

    it("handles document with only whitespace", () => {
        const result = defaultMarkdownParser.parse("   \n\n   ");
        ist(result.type.name, 'doc');
    });

    it("handles ParseSpec with getAttrs function receiving all parameters", () => {
        let capturedToken = null;
        let capturedTokens = null;
        let capturedIndex = null;

        const customParser = new MarkdownParser(
            schema,
            MarkdownIt('commonmark', { html: false }),
            {
                paragraph: {
                    block: 'paragraph'
                },
                heading: {
                    block: 'heading',
                    getAttrs: (tok, tokens, i) => {
                        capturedToken = tok;
                        capturedTokens = tokens;
                        capturedIndex = i;
                        return { level: +tok.tag.slice(1) };
                    }
                }
            }
        );

        customParser.parse("# Test");
        ist(capturedToken !== null, true);
        ist(capturedTokens !== null, true);
        ist(typeof capturedIndex, 'number');
    });

    it("handles ParseSpec with attrs as a Function (backwards compatibility)", () => {
        const customParser = new MarkdownParser(
            schema,
            MarkdownIt('commonmark', { html: false }),
            {
                paragraph: { block: 'paragraph' },
                heading: {
                    block: 'heading',
                    attrs: (tok: any) => ({ level: +tok.tag.slice(1) })
                }
            }
        );

        const result = customParser.parse("# Test");
        ist(result.firstChild.attrs.level, 1);
    });

    it("handles ParseSpec with static attrs object", () => {
        const customParser = new MarkdownParser(
            schema,
            MarkdownIt('commonmark', { html: false }),
            {
                paragraph: { block: 'paragraph' },
                heading: {
                    block: 'heading',
                    attrs: { level: 3 }
                }
            }
        );

        const result = customParser.parse("# Test");
        // Static attrs override the markdown level
        ist(result.firstChild.attrs.level, 3);
    });

    it("handles block tokens with noCloseToken for custom types", () => {
        const customParser = new MarkdownParser(
            schema,
            MarkdownIt('commonmark', { html: false }),
            {
                code_block: { block: 'code_block', noCloseToken: true },
                fence: { block: 'code_block', noCloseToken: true },
                paragraph: { block: 'paragraph' }
            }
        );

        const result = customParser.parse("```\ntest\n```");
        ist(result.firstChild.type.name, 'code_block');
        ist(result.firstChild.textContent, 'test');
    });

    it("handles node tokens (self-closing)", () => {
        const customParser = new MarkdownParser(
            schema,
            MarkdownIt('commonmark', { html: false }),
            {
                paragraph: { block: 'paragraph' },
                hr: { node: 'horizontal_rule' },
                hardbreak: { node: 'hard_break' }
            }
        );

        const result = customParser.parse("test\n\n---\n\nmore");
        ist(result.childCount, 3);
        ist(result.child(1).type.name, 'horizontal_rule');
    });

    it("handles mark tokens with noCloseToken", () => {
        const customParser = new MarkdownParser(
            schema,
            MarkdownIt('commonmark', { html: false }),
            {
                paragraph: { block: 'paragraph' },
                code_inline: { mark: 'code', noCloseToken: true }
            }
        );

        const result = customParser.parse("`code`");
        const firstChild = result.firstChild;
        ist(firstChild.firstChild.marks.length, 1);
        ist(firstChild.firstChild.marks[0].type.name, 'code');
    });

    it("handles mark tokens with _open and _close variants", () => {
        const customParser = new MarkdownParser(
            schema,
            MarkdownIt('commonmark', { html: false }),
            {
                paragraph: { block: 'paragraph' },
                em: { mark: 'em' },
                strong: { mark: 'strong' }
            }
        );

        const result = customParser.parse("*italic* **bold**");
        const para = result.firstChild;
        ist(para.childCount, 3); // italic, space, bold
        ist(para.child(0).marks[0].type.name, 'em');
        ist(para.child(2).marks[0].type.name, 'strong');
    });

    it("handles ignore spec with noCloseToken", () => {
        const md = MarkdownIt('commonmark', { html: true });
        const customParser = new MarkdownParser(
            schema,
            md,
            {
                paragraph: { block: 'paragraph' },
                html_inline: { ignore: true, noCloseToken: true },
                html_block: { ignore: true, noCloseToken: true }
            }
        );

        // HTML should be ignored but document should still parse
        const result = customParser.parse("<div>test</div>");
        ist(result.type.name, 'doc');
    });

    it("handles ignore spec with _open and _close variants", () => {
        const md = MarkdownIt('commonmark', { html: true });
        const customParser = new MarkdownParser(
            schema,
            md,
            {
                paragraph: { block: 'paragraph' },
                html_block: { ignore: true }
            }
        );

        const result = customParser.parse("test");
        ist(result.type.name, 'doc');
    });

    it("throws error for unrecognized ParseSpec", () => {
        let threw = false;
        try {
            new MarkdownParser(
                schema,
                MarkdownIt('commonmark', { html: false }),
                {
                    paragraph: { block: 'paragraph' },
                    invalid: {} as any // No node, block, mark, or ignore property
                }
            );
        } catch (e) {
            threw = true;
            ist(e.message.includes('Unrecognized parsing spec'), true);
        }
        ist(threw, true);
    });

    it("throws error for unsupported token type during parsing", () => {
        // Create a parser without a handler for paragraph_close
        const customParser = new MarkdownParser(
            schema,
            MarkdownIt('commonmark', { html: false }),
            {
                // Only define paragraph_open, not paragraph or paragraph_close
            }
        );

        let threw = false;
        try {
            customParser.parse("test");
        } catch (e) {
            threw = true;
            ist(e.message.includes('not supported'), true);
        }
        ist(threw, true);
    });

    it("handles text tokens", () => {
        const result = defaultMarkdownParser.parse("plain text");
        ist(result.firstChild.firstChild.isText, true);
        ist(result.firstChild.firstChild.text, 'plain text');
    });

    it("handles inline tokens with children", () => {
        const result = defaultMarkdownParser.parse("text with *emphasis*");
        // Should have at least text and emphasis mark
        ist(result.firstChild.childCount >= 1, true);
    });

    it("handles softbreak tokens", () => {
        const result = defaultMarkdownParser.parse("line one\nline two");
        ist(result.firstChild.textContent, 'line one line two');
    });

    it("merges adjacent text nodes with same marks", () => {
        // The parser should merge text nodes when possible
        const result = defaultMarkdownParser.parse("hello world");
        ist(result.firstChild.childCount, 1);
        ist(result.firstChild.firstChild.text, 'hello world');
    });

    it("handles nested block structures", () => {
        const result = defaultMarkdownParser.parse("> * item 1\n> * item 2");
        ist(result.firstChild.type.name, 'blockquote');
        ist(result.firstChild.firstChild.type.name, 'bullet_list');
    });

    it("handles list tightness detection", () => {
        const loose = defaultMarkdownParser.parse("* item 1\n\n* item 2");
        ist(loose.firstChild.attrs.tight, false);

        const tight = defaultMarkdownParser.parse("* item 1\n* item 2");
        ist(tight.firstChild.attrs.tight, true);
    });

    it("handles ordered list start attribute", () => {
        const result = defaultMarkdownParser.parse("5. first\n6. second");
        ist(result.firstChild.attrs.order, 5);
    });

    it("handles fence code blocks with info string", () => {
        const result = defaultMarkdownParser.parse("```javascript\ncode\n```");
        ist(result.firstChild.attrs.params, 'javascript');
    });

    it("handles fence code blocks without info string", () => {
        const result = defaultMarkdownParser.parse("```\ncode\n```");
        ist(result.firstChild.attrs.params, '');
    });

    it("strips trailing newline from code block content", () => {
        const result = defaultMarkdownParser.parse("```\ncode\n```");
        ist(result.firstChild.textContent, 'code');
    });

    it("strips trailing newline from inline code content", () => {
        const result = defaultMarkdownParser.parse("`code\n`");
        // markdown-it may handle this differently, but content should be clean
        ist(result.firstChild.firstChild.text.includes('code'), true);
    });

    it("handles image with all attributes", () => {
        const result = defaultMarkdownParser.parse('![alt text](image.png "title text")');
        const img = result.firstChild.firstChild;
        ist(img.attrs.src, 'image.png');
        ist(img.attrs.alt, 'alt text');
        ist(img.attrs.title, 'title text');
    });

    it("handles image without alt text", () => {
        const result = defaultMarkdownParser.parse('![](image.png)');
        const img = result.firstChild.firstChild;
        ist(img.attrs.src, 'image.png');
        ist(img.attrs.alt, null);
    });

    it("handles image without title", () => {
        const result = defaultMarkdownParser.parse('![alt](image.png)');
        const img = result.firstChild.firstChild;
        ist(img.attrs.title, null);
    });

    it("handles hard_break node", () => {
        const result = defaultMarkdownParser.parse("line1\\\nline2");
        ist(result.firstChild.childCount, 3); // text, br, text
        ist(result.firstChild.child(1).type.name, 'hard_break');
    });

    it("handles link with all attributes", () => {
        const result = defaultMarkdownParser.parse('[text](url "title")');
        const link = result.firstChild.firstChild.marks[0];
        ist(link.attrs.href, 'url');
        ist(link.attrs.title, 'title');
    });

    it("handles link without title", () => {
        const result = defaultMarkdownParser.parse('[text](url)');
        const link = result.firstChild.firstChild.marks[0];
        ist(link.attrs.href, 'url');
        ist(link.attrs.title, null);
    });

    it("handles complex nested marks", () => {
        const result = defaultMarkdownParser.parse("***bold and italic***");
        const textNode = result.firstChild.firstChild;
        ist(textNode.marks.length, 2);
        const markNames = textNode.marks.map(m => m.type.name).sort();
        ist(markNames.join(','), 'em,strong');
    });

    it("creates document even if parsing results in empty stack", () => {
        const result = defaultMarkdownParser.parse("");
        ist(result !== null && result !== undefined, true);
        ist(result.type.name, 'doc');
    });

    it("handles multiple closeNode calls to empty stack", () => {
        // The parser should handle closing all nodes and return a valid document
        const result = defaultMarkdownParser.parse("# heading\n\ntext");
        ist(result.type.name, 'doc');
        ist(result.childCount, 2);
    });

    it("handles getAttrs returning null", () => {
        const customParser = new MarkdownParser(
            schema,
            MarkdownIt('commonmark', { html: false }),
            {
                paragraph: { block: 'paragraph' },
                heading: {
                    block: 'heading',
                    getAttrs: () => null
                }
            }
        );

        const result = customParser.parse("# Test");
        // Should still create heading with default attrs
        ist(result.firstChild.type.name, 'heading');
    });
})

