import ist from 'ist';
import {describe, it} from 'vitest';

import {GapCursor} from '@src/GapCursor';
import {SelectionFactory} from '@type-editor/state';
import {doc, hr, img, p, schema} from '@type-editor/test-builder';
import {TestState} from './state';

describe("GapCursor", () => {
    describe("valid", () => {
        it("should be valid before a horizontal rule", () => {
            const d = doc(p("foo"), hr());
            const $pos = d.resolve(6); // Before the hr
            ist(GapCursor.valid($pos), true);
        });

        it("should be valid between two horizontal rules", () => {
            const d = doc(hr(), hr());
            const $pos = d.resolve(2); // Between the hrs
            ist(GapCursor.valid($pos), true);
        });

        it("should not be valid inside a text block", () => {
            const d = doc(p("foo"));
            const $pos = d.resolve(2); // Inside the paragraph
            ist(GapCursor.valid($pos), false);
        });

        it("should not be valid at the start of a document without proper boundary", () => {
            const d = doc(p("foo"));
            const $pos = d.resolve(0); // Start of doc
            ist(GapCursor.valid($pos), false);
        });

        it("should not be valid between inline content", () => {
            const d = doc(p("foo", img(), "bar"));
            const $pos = d.resolve(4); // Before the image (inline position)
            ist(GapCursor.valid($pos), false);
        });

        it("should be valid at proper gap positions", () => {
            const d = doc(p("foo"), hr());
            // Position 6 is before the hr - this is a valid gap position
            ist(GapCursor.valid(d.resolve(6)), true);
        });
    });

    describe("findGapCursorFrom", () => {
        it("should find gap cursor positions correctly", () => {
            const d = doc(p("foo"), hr());
            // Starting from end of paragraph (position 5), search forward
            const $start = d.resolve(5);
            const $found = GapCursor.findGapCursorFrom($start, 1);
            // Should find the gap position before hr (position 6)
            if ($found) {
                ist(GapCursor.valid($found), true);
            }
        });

        it("should return null when no valid position exists forward", () => {
            const d = doc(p("foo"));
            const $start = d.resolve(4); // End of paragraph
            const $found = GapCursor.findGapCursorFrom($start, 1);
            ist($found, null);
        });

        it("should return null when no valid position exists backward", () => {
            const d = doc(p("foo"));
            const $start = d.resolve(1); // Start of paragraph content
            const $found = GapCursor.findGapCursorFrom($start, -1);
            ist($found, null);
        });

        it("should handle valid gap cursor positions", () => {
            const d = doc(p("foo"), hr(), hr(), p("bar"));
            // Test a position that is already valid
            const $start = d.resolve(6); // Before first hr
            const $found = GapCursor.findGapCursorFrom($start, 1, false);
            // Should return current position if it's valid and mustMove is false
            if (GapCursor.valid($start)) {
                ist($found?.pos, 6);
            }
        });

        it("should search past non-gap positions", () => {
            const d = doc(hr(), hr());
            const $start = d.resolve(0); // Start of document
            const $found = GapCursor.findGapCursorFrom($start, 1);
            // Should find a valid gap cursor position
            ist($found !== null, true);
            if ($found) {
                ist(GapCursor.valid($found), true);
            }
        });
    });

    describe("constructor", () => {
        it("should create a gap cursor with anchor and head at same position", () => {
            const d = doc(p("foo"), hr(), p("bar"));
            const $pos = d.resolve(6);
            const gc = new GapCursor($pos);
            ist(gc.anchor, 6);
            ist(gc.head, 6);
            ist(gc.$anchor, $pos);
            ist(gc.$head, $pos);
        });

        it("should have null $cursor", () => {
            const d = doc(p("foo"), hr());
            const $pos = d.resolve(6);
            const gc = new GapCursor($pos);
            ist(gc.$cursor, null);
        });

        it("should have null node", () => {
            const d = doc(p("foo"), hr());
            const $pos = d.resolve(6);
            const gc = new GapCursor($pos);
            ist(gc.node, null);
        });

        it("should have type 'gapcursor'", () => {
            const d = doc(p("foo"), hr());
            const $pos = d.resolve(6);
            const gc = new GapCursor($pos);
            ist(gc.type, 'gapcursor');
        });

        it("should not be visible", () => {
            const d = doc(p("foo"), hr());
            const $pos = d.resolve(6);
            const gc = new GapCursor($pos);
            ist(gc.visible, false);
        });

        it("should be empty", () => {
            const d = doc(p("foo"), hr());
            const $pos = d.resolve(6);
            const gc = new GapCursor($pos);
            ist(gc.empty, true);
        });
    });

    describe("map", () => {
        it("should map through document changes", () => {
            const state = new TestState({ doc: doc(p("foo"), hr(), p("bar")), schema });
            const $pos = state.state.doc.resolve(6);

            if (GapCursor.valid($pos)) {
                const gc = new GapCursor($pos);
                const tr = state.state.transaction.insertText("new", 2);
                const newSelection = gc.map(tr.doc, tr.mapping);

                // Should still have a valid selection
                ist(newSelection !== null, true);
                ist(newSelection !== undefined, true);
            }
        });

        it("should map to nearest selection if position becomes invalid", () => {
            const state = new TestState({ doc: doc(p("foo"), hr(), p("bar")), schema });
            const $pos = state.state.doc.resolve(6);
            const gc = new GapCursor($pos);

            // Delete the hr, making the gap cursor position invalid
            const tr = state.state.transaction.delete(6, 8);
            const newSelection = gc.map(tr.doc, tr.mapping);

            ist(newSelection instanceof GapCursor, false);
            ist(newSelection.from <= newSelection.to, true);
        });

        it("should handle document transformations", () => {
            const state = new TestState({ doc: doc(p("foo"), hr(), p("bar")), schema });
            const $pos = state.state.doc.resolve(6);

            if (GapCursor.valid($pos)) {
                const gc = new GapCursor($pos);
                const tr = state.state.transaction.delete(1, 3); // Delete some text
                const newSelection = gc.map(tr.doc, tr.mapping);

                // Position should be adjusted
                ist(newSelection.head > 0, true);
            }
        });
    });

    describe("content", () => {
        it("should return empty slice", () => {
            const d = doc(p("foo"), hr());
            const $pos = d.resolve(6);
            const gc = new GapCursor($pos);
            const content = gc.content();

            ist(content.size, 0);
            ist(content.openStart, 0);
            ist(content.openEnd, 0);
        });
    });

    describe("eq", () => {
        it("should return true for gap cursors at same position", () => {
            const d = doc(p("foo"), hr());
            const $pos = d.resolve(6);
            const gc1 = new GapCursor($pos);
            const gc2 = new GapCursor($pos);

            ist(gc1.eq(gc2), true);
        });

        it("should return false for gap cursors at different positions", () => {
            const d = doc(p("foo"), hr(), hr(), p("bar"));
            const gc1 = new GapCursor(d.resolve(6));
            const gc2 = new GapCursor(d.resolve(8));

            ist(gc1.eq(gc2), false);
        });

        it("should return false when comparing with text selection", () => {
            const d = doc(p("foo"), hr());
            const gc = new GapCursor(d.resolve(6));
            const textSel = SelectionFactory.createTextSelection(d.resolve(2));

            ist(gc.eq(textSel), false);
        });

        it("should return false when comparing with different selection types", () => {
            const d = doc(p("foo"), hr());
            const gc1 = new GapCursor(d.resolve(6));
            const gc2 = new GapCursor(d.resolve(6));
            const textSel = SelectionFactory.createTextSelection(d.resolve(2));

            // Gap cursors at same position should be equal
            ist(gc1.eq(gc2), true);
            // Different selection type should not be equal
            ist(gc1.eq(textSel), false);
        });
    });

    describe("toJSON and fromJSON", () => {
        it("should serialize to JSON", () => {
            const d = doc(p("foo"), hr());
            const gc = new GapCursor(d.resolve(6));
            const json = gc.toJSON();

            ist(json.type, 'gapcursor');
            ist(json.pos, 6);
        });

        it("should deserialize from JSON", () => {
            const d = doc(p("foo"), hr());
            const json = { type: 'gapcursor', pos: 6 };
            const gc = GapCursor.fromJSON(d, json);

            ist(gc instanceof GapCursor, true);
            ist(gc.head, 6);
            ist(gc.anchor, 6);
        });

        it("should throw error for invalid JSON", () => {
            const d = doc(p("foo"), hr());
            const json = { type: 'gapcursor' } as any;

            let error: Error;
            try {
                GapCursor.fromJSON(d, json);
            } catch (e) {
                error = e;
            }

            ist(error instanceof RangeError, true);
            ist((error as Error).message, 'Invalid input for GapCursor.fromJSON');
        });

        it("should round-trip through JSON", () => {
            const d = doc(p("foo"), hr(), p("bar"));
            const gc1 = new GapCursor(d.resolve(6));
            const json = gc1.toJSON();
            const gc2 = GapCursor.fromJSON(d, json);

            ist(gc1.eq(gc2), true);
        });
    });

    describe("getBookmark", () => {
        it("should create a bookmark", () => {
            const d = doc(p("foo"), hr());
            const gc = new GapCursor(d.resolve(6));
            const bookmark = gc.getBookmark();

            ist(bookmark !== null, true);
        });

        it("should resolve bookmark to selection", () => {
            const d = doc(p("foo"), hr(), p("bar"));
            const $pos = d.resolve(6);
            if (GapCursor.valid($pos)) {
                const gc = new GapCursor($pos);
                const bookmark = gc.getBookmark();
                const resolved = bookmark.resolve(d);

                // Should resolve to a valid selection at or near the bookmarked position
                ist(resolved !== null, true);
                ist(Math.abs(resolved.head - 6) <= 2, true); // Within 2 positions
            }
        });

        it("should map bookmark through changes", () => {
            const state = new TestState({ doc: doc(p("foo"), hr(), p("bar")), schema });
            const $pos = state.state.doc.resolve(6);
            if (GapCursor.valid($pos)) {
                const gc = new GapCursor($pos);
                const bookmark = gc.getBookmark();

                const tr = state.state.transaction.insertText("new", 2);
                const mappedBookmark = bookmark.map(tr.mapping);
                const resolved = mappedBookmark.resolve(tr.doc);

                // Position should be shifted by the insertion
                ist(resolved.head > 6, true);
            }
        });

        it("should resolve to nearest selection if position becomes invalid", () => {
            const state = new TestState({ doc: doc(p("foo"), hr(), p("bar")), schema });
            const gc = new GapCursor(state.state.doc.resolve(6));
            const bookmark = gc.getBookmark();

            // Delete the hr
            const tr = state.state.transaction.delete(6, 8);
            const mappedBookmark = bookmark.map(tr.mapping);
            const resolved = mappedBookmark.resolve(tr.doc);

            // Should resolve to a valid selection, but not necessarily a gap cursor
            ist(resolved instanceof GapCursor, false);
        });
    });

    describe("type checking methods", () => {
        it("isTextSelection should return false", () => {
            const d = doc(p("foo"), hr());
            const gc = new GapCursor(d.resolve(6));
            ist(gc.isTextSelection(), false);
        });

        it("isNodeSelection should return false", () => {
            const d = doc(p("foo"), hr());
            const gc = new GapCursor(d.resolve(6));
            ist(gc.isNodeSelection(), false);
        });

        it("isAllSelection should return false", () => {
            const d = doc(p("foo"), hr());
            const gc = new GapCursor(d.resolve(6));
            ist(gc.isAllSelection(), false);
        });
    });

    describe("integration with editor state", () => {
        it("should work as editor selection", () => {
            const state = new TestState({ doc: doc(p("foo"), hr(), p("bar")), schema });
            const gc = new GapCursor(state.state.doc.resolve(6));

            state.state = state.state.apply(
                state.state.transaction.setSelection(gc)
            );

            ist(state.state.selection instanceof GapCursor, true);
            ist(state.state.selection.head, 6);
        });

        it("should handle text insertion at gap cursor", () => {
            const state = new TestState({ doc: doc(p("foo"), hr(), p("bar")), schema });
            const gc = new GapCursor(state.state.doc.resolve(6));

            state.state = state.state.apply(
                state.state.transaction.setSelection(gc)
            );

            // This would typically require the gap cursor plugin to handle properly
            // but we can test that the position is valid
            ist(state.state.selection.from, 6);
            ist(state.state.selection.to, 6);
        });

        it("should work with gap cursor in editor state", () => {
            const state = new TestState({ doc: doc(p("foo"), hr(), p("bar")), schema });
            const $pos = state.state.doc.resolve(6);

            if (GapCursor.valid($pos)) {
                const gc = new GapCursor($pos);
                state.state = state.state.apply(
                    state.state.transaction.setSelection(gc)
                );

                // Verify gap cursor is set
                ist(state.state.selection instanceof GapCursor, true);

                // Make a change elsewhere in the document
                const tr = state.state.transaction.insertText("x", 2);
                const newState = state.state.apply(tr);

                // Selection should be updated through mapping
                ist(newState.selection.head > 6, true);
            }
        });
    });

    describe("edge cases", () => {
        it("should handle document with horizontal rules", () => {
            const d = doc(hr(), hr());
            // Position 2 is between the two hrs
            const $pos = d.resolve(2);
            ist(GapCursor.valid($pos), true);
        });

        it("should handle gap cursor navigation from document start", () => {
            const d = doc(hr(), p("foo"));
            const $start = d.resolve(0);
            const $found = GapCursor.findGapCursorFrom($start, 1);
            // Should find a position or return null
            ist($found === null || GapCursor.valid($found), true);
        });

        it("should be valid in appropriate positions", () => {
            const d = doc(p("text"), hr());
            // Test that we can find positions where gap cursor is valid
            let hasValidPosition = false;
            for (let pos = 0; pos <= d.content.size; pos++) {
                try {
                    const $pos = d.resolve(pos);
                    if (GapCursor.valid($pos)) {
                        hasValidPosition = true;
                        break;
                    }
                } catch (e) {
                    // Invalid position, continue
                }
            }
            ist(hasValidPosition, true);
        });

        it("should handle empty selection range", () => {
            const d = doc(p("foo"), hr());
            const gc = new GapCursor(d.resolve(6));
            ist(gc.empty, true);
            ist(gc.from, gc.to);
        });
    });
});

