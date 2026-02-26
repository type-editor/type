import ist from 'ist';
import markdownit from 'markdown-it';
import {describe, it,} from 'vitest';

import {MarkdownParser} from '@src/from-markdown/MarkdownParser';
import {schema} from '@src/schema';
import {Node} from '@type-editor/model';
import {eq} from '@type-editor/test-builder';
import {br, doc, p,} from './build.js';

const md = markdownit("commonmark", { html: false });
const ignoreBlockquoteParser = new MarkdownParser(schema, md, {
    blockquote: { ignore: true },
    paragraph: { block: "paragraph" },
    softbreak: { node: 'hard_break' }
});

function parseWith(parser: MarkdownParser) {
    return (text: string, doc: Node) => {
        ist(parser.parse(text), doc, eq);
    };
}

describe("custom markdown parser", () => {
    it("ignores a blockquote", () =>
        parseWith(ignoreBlockquoteParser)("> hello!",
            doc(p("hello!"))));

    it("converts softbreaks to hard_break nodes", () =>
        parseWith(ignoreBlockquoteParser)("hello\nworld!",
            doc(p("hello", br(), 'world!'))));
});
