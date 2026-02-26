import { describe, it, expect } from 'vitest';
import { doc, p, img, schema } from '@type-editor/test-builder';
import { EditorState, NodeSelection, TextSelection } from '@type-editor/state';
import { findExtendedMarkSelection } from '@src/util/find-extended-mark-selection';

describe('findExtendedMarkSelection', () => {
    describe('$cursor vs $from difference', () => {
        it('$cursor is null for NodeSelection, but $from is always defined', () => {
            const d = doc(p('text', img(), 'more'));
            const imagePos = 6;
            const state = EditorState.create({
                doc: d,
                selection: NodeSelection.create(d, imagePos)
            });

            // $cursor is null for NodeSelection
            expect(state.selection.$cursor).toBeNull();

            // $from is ALWAYS defined - it's the start of the selection
            expect(state.selection.$from).not.toBeNull();
            expect(state.selection.$from.pos).toBe(imagePos);
        });

        it('$cursor is null for range TextSelection, but $from is defined', () => {
            const d = doc(p('text', img(), 'more'));
            const state = EditorState.create({ doc: d });

            // Create a range selection (selecting "text")
            const tr = state.tr.setSelection(TextSelection.create(d, 2, 6));
            const newState = state.apply(tr);

            // $cursor is null because it's a range, not a cursor
            expect(newState.selection.$cursor).toBeNull();

            // $from is always defined
            expect(newState.selection.$from).not.toBeNull();
            expect(newState.selection.$from.pos).toBe(2);
        });

        it('$cursor is defined only for collapsed TextSelection (cursor)', () => {
            const d = doc(p('text'));
            const state = EditorState.create({ doc: d });

            // Create a collapsed selection (cursor at position 3)
            const tr = state.tr.setSelection(TextSelection.create(d, 3, 3));
            const newState = state.apply(tr);

            // $cursor IS defined for collapsed selection
            expect(newState.selection.$cursor).not.toBeNull();
            expect(newState.selection.$cursor!.pos).toBe(3);

            // $from is also defined and equals $cursor
            expect(newState.selection.$from.pos).toBe(3);
        });
    });

    describe('image node selection', () => {
        it('should handle when cursor is at an image node without crashing', () => {
            // Create a document with a paragraph containing text and an image
            // Structure: <doc><p>Hello <img src="img.png"/> world</p></doc>
            const d = doc(p('Hello ', img(), ' world'));

            // Position the cursor at the image (position after "Hello ")
            // The image is at position 7 (1 for doc start, 1 for p start, 6 for "Hello ")
            const imagePos = 7;

            // Create a NodeSelection for the image
            const $pos = d.resolve(imagePos);
            const nodeSelection = NodeSelection.create($pos);

            // The $cursor in this context would be the anchor position of the selection
            // When we have a NodeSelection on an image, the $cursor.parent is the paragraph
            // but when we try to use findExtendedMarkSelection, it may have issues
            const $cursor = d.resolve(nodeSelection.anchor);

            // This should not throw an error - the function should handle this gracefully
            // We expect it to either return a valid result or return { found: false, ... }
            expect(() => {
                findExtendedMarkSelection(d, $cursor, schema.marks.link, false);
            }).not.toThrow();
        });

        it('should handle image node selection when using $anchor instead of $cursor', () => {
            // Create a document with an image in a paragraph
            const d = doc(p('text', img(), 'more'));

            // Create editor state with a node selection on the image
            const imagePos = 6; // 1 (doc) + 1 (p start) + 4 ("text")
            const state = EditorState.create({
                doc: d,
                selection: NodeSelection.create(d, imagePos)
            });

            // Get the selection's $anchor instead of $cursor
            // $anchor is always defined, but it points to the position before the image
            const $anchor = state.selection.$anchor;

            // The anchor position points directly before the image node
            // When calling findExtendedMarkSelection, this should work or handle gracefully
            expect(() => {
                findExtendedMarkSelection(d, $anchor, schema.marks.link, false);
            }).not.toThrow();
        });

        it('should return found: false when cursor is at a node selection (image)', () => {
            // Create a document with just an image in a paragraph
            const d = doc(p(img()));

            // Position at the image
            const imagePos = 2; // 1 for doc start, 1 for p start
            const $cursor = d.resolve(imagePos);

            const result = findExtendedMarkSelection(d, $cursor, schema.marks.link, false);

            // When at an image, there's no text to select, so it should return found: false
            expect(result.found).toBe(false);
        });

        it('should handle cursor positioned right before an image', () => {
            const d = doc(p('text', img(), 'more'));

            // Position right before the image (after "text")
            const beforeImagePos = 6; // 1 + 1 + 4 (doc + p + "text")
            const $cursor = d.resolve(beforeImagePos);

            // Should not crash and should handle the image boundary gracefully
            expect(() => {
                findExtendedMarkSelection(d, $cursor, schema.marks.link, false);
            }).not.toThrow();
        });

        it('should handle cursor positioned right after an image', () => {
            const d = doc(p('text', img(), 'more'));

            // Position right after the image
            // "text" = 4 chars, image nodeSize = 1, so after image = 1 + 1 + 4 + 1 = 7
            const afterImagePos = 7;
            const $cursor = d.resolve(afterImagePos);

            // Should not crash and should handle the image boundary gracefully
            expect(() => {
                findExtendedMarkSelection(d, $cursor, schema.marks.link, false);
            }).not.toThrow();
        });

        it('should handle document with only an image', () => {
            // A paragraph containing only an image
            const d = doc(p(img()));

            // Try to resolve a position at the image
            const $cursor = d.resolve(2);

            expect(() => {
                findExtendedMarkSelection(d, $cursor, schema.marks.link, false);
            }).not.toThrow();
        });
    });
});

