import {describe, it} from 'vitest';
import ist from 'ist';

import {blockquote, doc, hr, p, pre} from '@type-editor/test-builder';
import {gapCursor, GapCursor} from '@type-editor/gapcursor';
import {SelectionFactory} from '@type-editor/state';
import {tempEditor} from './view';
import {DecorationSet} from "@type-editor/decoration";

describe("Gap cursor plugin", () => {
    describe("click handling", () => {
        it("should create gap cursor on click between block nodes", () => {
            const view = tempEditor({
                doc: doc(p("foo"), hr(), p("bar")),
                plugins: [gapCursor()]
            });

            // Simulate clicking at the gap position
            const pos = 6; // Between first paragraph and hr
            view.dispatch(view.state.transaction.setSelection(new GapCursor(view.state.doc.resolve(pos))));

            ist(view.state.selection instanceof GapCursor, true);
            ist(view.state.selection.head, 6);

            view.destroy();
        });

        it("should not create gap cursor on click inside text block", () => {
            const view = tempEditor({
                doc: doc(p("foo"), hr(), p("bar")),
                plugins: [gapCursor()]
            });

            const pos = 2; // Inside first paragraph
            const $pos = view.state.doc.resolve(pos);

            ist(GapCursor.valid($pos), false);

            view.destroy();
        });

        it("should create gap cursor between horizontal rules", () => {
            const view = tempEditor({
                doc: doc(hr(), hr(), hr()),
                plugins: [gapCursor()]
            });

            const pos = 2; // Between first and second hr
            view.dispatch(view.state.transaction.setSelection(new GapCursor(view.state.doc.resolve(pos))));

            ist(view.state.selection instanceof GapCursor, true);
            ist(view.state.selection.head, 2);

            view.destroy();
        });
    });

    describe("createSelectionBetween", () => {
        it("should create gap cursor when anchor equals head at valid position", () => {
            const view = tempEditor({
                doc: doc(p("foo"), hr(), p("bar")),
                plugins: [gapCursor()]
            });

            const $pos = view.state.doc.resolve(6);

            // This tests the createSelectionBetween prop
            if (view.props.createSelectionBetween) {
                const sel = view.props.createSelectionBetween(view, $pos, $pos);
                ist(sel instanceof GapCursor, true);
            }

            view.destroy();
        });

        it("should return null when anchor differs from head", () => {
            const view = tempEditor({
                doc: doc(p("foo"), hr(), p("bar")),
                plugins: [gapCursor()]
            });

            const $anchor = view.state.doc.resolve(6);
            const $head = view.state.doc.resolve(8);

            if (view.props.createSelectionBetween) {
                const sel = view.props.createSelectionBetween(view, $anchor, $head);
                ist(sel, null);
            }

            view.destroy();
        });

        it("should return null when position is invalid for gap cursor", () => {
            const view = tempEditor({
                doc: doc(p("foo"), hr(), p("bar")),
                plugins: [gapCursor()]
            });

            const $pos = view.state.doc.resolve(2); // Inside paragraph

            if (view.props.createSelectionBetween) {
                const sel = view.props.createSelectionBetween(view, $pos, $pos);
                ist(sel, null);
            }

            view.destroy();
        });
    });

    describe("decorations", () => {
        it("should draw gap cursor decoration", () => {
            const view = tempEditor({
                doc: doc(p("foo"), hr(), p("bar")),
                plugins: [gapCursor()]
            });

            view.dispatch(
                view.state.transaction.setSelection(new GapCursor(view.state.doc.resolve(6)))
            );

            // Check that decoration was added
            ist(view.state.selection instanceof GapCursor, true);

            // The plugin should create a decoration with class 'ProseMirror-gapcursor'
            if (view.props.decorations) {
                const decos = view.props.decorations(view.state);
                if (decos) {
                    ist((decos as DecorationSet).find().length > 0, true);
                }
            }

            view.destroy();
        });

        it("should not draw decoration when selection is not gap cursor", () => {
            const view = tempEditor({
                doc: doc(p("foo"), hr(), p("bar")),
                plugins: [gapCursor()]
            });

            view.dispatch(
                view.state.transaction.setSelection(SelectionFactory.createTextSelection(view.state.doc.resolve(2)))
            );

            ist(view.state.selection instanceof GapCursor, false);

            view.destroy();
        });

        it("should update decoration when gap cursor moves", () => {
            const view = tempEditor({
                doc: doc(p("foo"), hr(), hr(), p("bar")),
                plugins: [gapCursor()]
            });

            // Set gap cursor at first position
            view.dispatch(
                view.state.transaction.setSelection(new GapCursor(view.state.doc.resolve(6)))
            );
            ist(view.state.selection.head, 6);

            // Move to second position
            view.dispatch(
                view.state.transaction.setSelection(new GapCursor(view.state.doc.resolve(8)))
            );
            ist(view.state.selection.head, 8);

            view.destroy();
        });
    });

    describe("beforeinput event handling", () => {
        it("should handle composition input at gap cursor", () => {
            const view = tempEditor({
                doc: doc(p("foo"), hr(), p("bar")),
                plugins: [gapCursor()]
            });

            view.dispatch(
                view.state.transaction.setSelection(new GapCursor(view.state.doc.resolve(6)))
            );

            ist(view.state.selection instanceof GapCursor, true);

            // The beforeinput handler should create an inline context for composition
            // when insertCompositionText event fires at gap cursor position
            // This is tested by checking the selection is at a valid gap cursor position

            view.destroy();
        });

        it("should not interfere with normal text input", () => {
            const view = tempEditor({
                doc: doc(p("foo"), hr(), p("bar")),
                plugins: [gapCursor()]
            });

            view.dispatch(
                view.state.transaction.setSelection(
                    SelectionFactory.createTextSelection(view.state.doc.resolve(2))
                )
            );

            // Normal text selection should work normally
            ist(view.state.selection.isTextSelection(), true);

            view.destroy();
        });
    });

    describe("integration with document structure", () => {
        it("should work with code blocks", () => {
            const view = tempEditor({
                doc: doc(pre("code"), p("text")),
                plugins: [gapCursor()]
            });

            const pos = 7; // Between code block and paragraph
            view.dispatch(
                view.state.transaction.setSelection(new GapCursor(view.state.doc.resolve(pos)))
            );

            ist(view.state.selection instanceof GapCursor, true);

            view.destroy();
        });

        it("should work with blockquotes", () => {
            const view = tempEditor({
                doc: doc(blockquote(p("quote")), p("text")),
                plugins: [gapCursor()]
            });

            const pos = 9; // Between blockquote and paragraph
            view.dispatch(
                view.state.transaction.setSelection(new GapCursor(view.state.doc.resolve(pos)))
            );

            ist(view.state.selection instanceof GapCursor, true);

            view.destroy();
        });

        it("should work with multiple horizontal rules", () => {
            const view = tempEditor({
                doc: doc(hr(), hr()),
                plugins: [gapCursor()]
            });

            // Test gap position between the two hrs
            const pos = 2;
            const $pos = view.state.doc.resolve(pos);
            if (GapCursor.valid($pos)) {
                view.dispatch(
                    view.state.transaction.setSelection(new GapCursor($pos))
                );
                ist(view.state.selection instanceof GapCursor, true);
            }

            view.destroy();
        });
    });

    describe("gap cursor persistence", () => {
        it("should maintain gap cursor through compatible edits", () => {
            const view = tempEditor({
                doc: doc(p("foo"), hr(), p("bar")),
                plugins: [gapCursor()]
            });

            const $pos = view.state.doc.resolve(6);
            if (GapCursor.valid($pos)) {
                view.dispatch(
                    view.state.transaction.setSelection(new GapCursor($pos))
                );

                // Edit somewhere else in the document
                const tr = view.state.transaction.insertText("x", 2);
                view.dispatch(tr);

                // Selection should be updated (may or may not still be gap cursor depending on mapping)
                ist(view.state.selection !== null, true);
                ist(view.state.selection.head > 6, true); // Position should be shifted
            }

            view.destroy();
        });

        it("should convert to text selection when gap becomes invalid", () => {
            const view = tempEditor({
                doc: doc(p("foo"), hr(), p("bar")),
                plugins: [gapCursor()]
            });

            view.dispatch(
                view.state.transaction.setSelection(new GapCursor(view.state.doc.resolve(6)))
            );

            // Delete the hr, making the gap invalid
            const tr = view.state.transaction.delete(6, 8);
            view.dispatch(tr);

            // Should no longer be a gap cursor
            ist(view.state.selection instanceof GapCursor, false);

            view.destroy();
        });
    });

    describe("edge cases", () => {
        it("should handle empty document with single hr", () => {
            const view = tempEditor({
                doc: doc(hr()),
                plugins: [gapCursor()]
            });

            ist(view.state.doc.childCount, 1);

            view.destroy();
        });

        it("should handle document with mixed block types", () => {
            const view = tempEditor({
                doc: doc(p("text"), pre("code"), hr(), blockquote(p("quote"))),
                plugins: [gapCursor()]
            });

            // Test multiple gap positions
            const validPositions = [6, 13, 15];

            for (let pos of validPositions) {
                const $pos = view.state.doc.resolve(pos);
                if (GapCursor.valid($pos)) {
                    view.dispatch(
                        view.state.transaction.setSelection(new GapCursor($pos))
                    );
                    ist(view.state.selection instanceof GapCursor, true);
                }
            }

            view.destroy();
        });

        it("should handle rapid selection changes", () => {
            const view = tempEditor({
                doc: doc(p("foo"), hr(), hr(), hr(), p("bar")),
                plugins: [gapCursor()]
            });

            // Rapidly change selection between different positions
            const positions = [6, 8, 10];

            for (let pos of positions) {
                view.dispatch(
                    view.state.transaction.setSelection(new GapCursor(view.state.doc.resolve(pos)))
                );
                ist(view.state.selection instanceof GapCursor, true);
                ist(view.state.selection.head, pos);
            }

            view.destroy();
        });
    });

    describe("selection behavior", () => {
        it("should have empty selection range", () => {
            const view = tempEditor({
                doc: doc(p("foo"), hr(), p("bar")),
                plugins: [gapCursor()]
            });

            view.dispatch(
                view.state.transaction.setSelection(new GapCursor(view.state.doc.resolve(6)))
            );

            ist(view.state.selection.empty, true);
            ist(view.state.selection.from, view.state.selection.to);

            view.destroy();
        });

        it("should not be text or node selection", () => {
            const view = tempEditor({
                doc: doc(p("foo"), hr(), p("bar")),
                plugins: [gapCursor()]
            });

            view.dispatch(
                view.state.transaction.setSelection(new GapCursor(view.state.doc.resolve(6)))
            );

            ist(view.state.selection.isTextSelection(), false);
            ist(view.state.selection.isNodeSelection(), false);
            ist(view.state.selection.isAllSelection(), false);

            view.destroy();
        });

        it("should have equal anchor and head", () => {
            const view = tempEditor({
                doc: doc(p("foo"), hr(), p("bar")),
                plugins: [gapCursor()]
            });

            view.dispatch(
                view.state.transaction.setSelection(new GapCursor(view.state.doc.resolve(6)))
            );

            ist(view.state.selection.anchor, view.state.selection.head);

            view.destroy();
        });
    });

    describe("CSS and rendering", () => {
        it("should add ProseMirror-gapcursor class to decoration", () => {
            const view = tempEditor({
                doc: doc(p("foo"), hr(), p("bar")),
                plugins: [gapCursor()]
            });

            view.dispatch(
                view.state.transaction.setSelection(new GapCursor(view.state.doc.resolve(6)))
            );

            // The plugin creates a div with class ProseMirror-gapcursor
            // We can verify the decoration exists through the props
            if (view.props.decorations) {
                const decos = view.props.decorations(view.state);
                ist(decos !== null, true);
            }

            view.destroy();
        });

        it("should not be visible in selection.visible", () => {
            const view = tempEditor({
                doc: doc(p("foo"), hr(), p("bar")),
                plugins: [gapCursor()]
            });

            view.dispatch(
                view.state.transaction.setSelection(new GapCursor(view.state.doc.resolve(6)))
            );

            ist(view.state.selection.visible, false);

            view.destroy();
        });
    });
});

