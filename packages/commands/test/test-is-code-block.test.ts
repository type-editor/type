import {describe, it} from 'vitest';
import ist from 'ist';
import {doc, p, pre, schema} from '@type-editor/test-builder';
import {EditorState} from '@type-editor/state';
import { isCodeBlock } from '@src/util/is-code-block';

describe("isCodeBlock", () => {
    it("should return truthy value when cursor is in a code block", () => {
        const state = EditorState.create({
            doc: doc(pre("const x = 42<a>;")),
            schema
        });

        ist(isCodeBlock(state, schema.nodes.code_block), true);
    });

    it("should return truthy value when cursor is at the start of a code block", () => {
        const state = EditorState.create({
            doc: doc(pre("<a>const x = 42;")),
            schema
        });

        ist(isCodeBlock(state, schema.nodes.code_block), true);
    });

    it("should return truthy value when cursor is at the end of a code block", () => {
        const state = EditorState.create({
            doc: doc(pre("const x = 42;<a>")),
            schema
        });

        ist(isCodeBlock(state, schema.nodes.code_block), true);
    });

    it("should return truthy value for empty code block", () => {
        const state = EditorState.create({
            doc: doc(pre("<a>")),
            schema
        });

        ist(isCodeBlock(state, schema.nodes.code_block), true);
    });

    it("should work with multiline code blocks", () => {
        const state = EditorState.create({
            doc: doc(pre("line 1\nline 2<a>\nline 3")),
            schema
        });

        ist(isCodeBlock(state, schema.nodes.code_block), true);
    });

    it("should handle cursor in a code block before a paragraph", () => {
        const state = EditorState.create({
            doc: doc(pre("const x = 42<a>;"), p("normal text")),
            schema
        });

        ist(isCodeBlock(state, schema.nodes.code_block), true);
    });
});
