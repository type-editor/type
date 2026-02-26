import {describe, it} from 'vitest';
import ist from 'ist';
import {doc, p, em, strong, code, schema} from '@type-editor/test-builder';
import {EditorState} from '@type-editor/state';
import {isMarkActive} from '@src/menu-items/util/is-mark-active';

describe("isMarkActive", () => {
    describe("with empty selection (cursor)", () => {
        it("should return false when no mark is active at cursor position", () => {
            const state = EditorState.create({
                doc: doc(p("hello<a> world")),
                schema
            });

            ist(isMarkActive(state, schema.marks.em), false);
            ist(isMarkActive(state, schema.marks.strong), false);
        });

        it("should return false when cursor is just after a mark", () => {
            const state = EditorState.create({
                doc: doc(p("hello ", em("world"), "<a> text")),
                schema
            });

            ist(isMarkActive(state, schema.marks.em), false);
        });

        it("should check stored marks when available", () => {
            const state = EditorState.create({
                doc: doc(p("<a>")),
                schema
            });

            // No stored marks initially
            ist(isMarkActive(state, schema.marks.em), false);

            // Add stored marks
            const stateWithStoredMarks = state.apply(
                state.tr.addStoredMark(schema.marks.em.create())
            );

            ist(isMarkActive(stateWithStoredMarks, schema.marks.em), true);
            ist(isMarkActive(stateWithStoredMarks, schema.marks.strong), false);
        });
    });

    describe("with range selection", () => {
        it("should return false when no mark covers the selection", () => {
            const state = EditorState.create({
                doc: doc(p("hel<a>lo wor<b>ld")),
                schema
            });

            ist(isMarkActive(state, schema.marks.em), false);
            ist(isMarkActive(state, schema.marks.strong), false);
        });

        it("should return true when em mark fully covers the selection", () => {
            const state = EditorState.create({
                doc: doc(p(em("hel<a>lo wor<b>ld"))),
                schema
            });

            ist(isMarkActive(state, schema.marks.em), true);
            ist(isMarkActive(state, schema.marks.strong), false);
        });

        it("should return true when strong mark fully covers the selection", () => {
            const state = EditorState.create({
                doc: doc(p(strong("hel<a>lo wor<b>ld"))),
                schema
            });

            ist(isMarkActive(state, schema.marks.strong), true);
            ist(isMarkActive(state, schema.marks.em), false);
        });

        it("should return false when mark only partially covers the selection", () => {
            const state = EditorState.create({
                doc: doc(p("<a>hello ", em("wo"), "rld<b>")),
                schema
            });

            ist(isMarkActive(state, schema.marks.em), false);
        });

        it("should return true when multiple marks cover the selection", () => {
            const state = EditorState.create({
                doc: doc(p(strong(em("hel<a>lo wor<b>ld")))),
                schema
            });

            ist(isMarkActive(state, schema.marks.em), true);
            ist(isMarkActive(state, schema.marks.strong), true);
        });

        it("should return false when selection spans both marked and unmarked text", () => {
            const state = EditorState.create({
                doc: doc(p("pla<a>in ", em("emphasis"), " pl<b>ain")),
                schema
            });

            ist(isMarkActive(state, schema.marks.em), false);
        });

        it("should return true for selection at the start of a mark", () => {
            const state = EditorState.create({
                doc: doc(p(em("<a>hel<b>lo world"))),
                schema
            });

            ist(isMarkActive(state, schema.marks.em), true);
        });

        it("should return true for selection at the end of a mark", () => {
            const state = EditorState.create({
                doc: doc(p(em("hello wor<a>ld<b>"))),
                schema
            });

            ist(isMarkActive(state, schema.marks.em), true);
        });

        it("should handle selection across multiple paragraphs", () => {
            const state = EditorState.create({
                doc: doc(p(em("para<a>graph")), p(em("two<b>"))),
                schema
            });

            ist(isMarkActive(state, schema.marks.em), true);
        });

        it("should return false when selection crosses marked and unmarked paragraphs", () => {
            const state = EditorState.create({
                doc: doc(p("pla<a>in"), p(em("ma<b>rked"))),
                schema
            });

            ist(isMarkActive(state, schema.marks.em), false);
        });
    });
});
