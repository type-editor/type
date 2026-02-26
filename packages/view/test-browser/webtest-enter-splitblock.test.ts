import {describe, expect, it} from 'vitest';
import {userEvent as keyboardEvent} from 'vitest/browser';
import {doc, eq, h1, p} from '@type-editor/test-builder';
import ist from 'ist';
import {tempEditor} from './view';
import {keymap, baseKeymap} from '@type-editor/keymap';
import {splitBlock, chainCommands, newlineInCode, createParagraphNear, liftEmptyBlock} from '@type-editor/commands';


describe("Enter key and splitBlock", () => {
    describe("cursor position after splitBlock", () => {
        it("places cursor in new paragraph after split at end", () => {
            let view = tempEditor({
                doc: doc(p("hello<a>")),
            });

            expect(view.state.selection.from).toBe(6);
            
            splitBlock(view.state, view.dispatch, view);

            // After split: doc(p("hello"), p())
            // Cursor should be at position 8 (inside the new empty paragraph)
            expect(view.state.selection.from).toBe(8);
            expect(view.state.selection.$from.parent.content.size).toBe(0);
        });

        it("places cursor in new paragraph after split at end (with following paragraph)", () => {
            let view = tempEditor({
                doc: doc(p("first<a>"), p("second")),
            });

            expect(view.state.selection.from).toBe(6);
            
            splitBlock(view.state, view.dispatch, view);

            // After split: doc(p("first"), p(), p("second"))
            // Cursor should be at position 8 (inside the new empty paragraph)
            expect(view.state.selection.from).toBe(8);
            expect(view.state.selection.$from.parent.content.size).toBe(0);
        });

        it("DOM selection is in empty paragraph after split (not in following paragraph)", () => {
            if (!document.hasFocus()) return;
            
            let view = tempEditor({
                doc: doc(p("first<a>"), p("second")),
                plugins: [keymap(baseKeymap)],
            });

            // Simulate Enter key
            view.dom.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                bubbles: true,
                cancelable: true
            }));

            // State should have cursor at position 8
            expect(view.state.selection.from).toBe(8);
            expect(view.state.selection.$from.parent.content.size).toBe(0);
            
            // Check DOM selection - should be in the empty paragraph (index 1)
            const domSel = window.getSelection();
            const paragraphs = view.dom.querySelectorAll('p');
            expect(paragraphs.length).toBe(3);
            
            let focusInPara = -1;
            for (let i = 0; i < paragraphs.length; i++) {
                if (paragraphs[i].contains(domSel?.focusNode)) {
                    focusInPara = i;
                    break;
                }
            }
            
            // Focus should be in paragraph 1 (the empty one), not paragraph 2
            expect(focusInPara).toBe(1);
        });
    });

    describe("splitBlock command directly", () => {
        it("can split a paragraph at the end via command", () => {
            let view = tempEditor({
                doc: doc(p("hello<a>")),
            });

            // Execute splitBlock command directly
            const initialDoc = view.state.doc;
            const result = splitBlock(view.state, view.dispatch, view);

            expect(result).toBe(true);
            // The document should now have 2 paragraphs
            expect(view.state.doc.childCount).toBe(2);
            ist(view.state.doc, doc(p("hello"), p()), eq);
        });

        it("can split a paragraph in the middle via command", () => {
            let view = tempEditor({
                doc: doc(p("hel<a>lo")),
            });

            const result = splitBlock(view.state, view.dispatch, view);

            expect(result).toBe(true);
            expect(view.state.doc.childCount).toBe(2);
            ist(view.state.doc, doc(p("hel"), p("lo")), eq);
        });

        it("can split a heading at the end via command", () => {
            let view = tempEditor({
                doc: doc(h1("hello<a>")),
            });

            const result = splitBlock(view.state, view.dispatch, view);

            expect(result).toBe(true);
            // The document should now have 2 blocks: h1 and empty p
            expect(view.state.doc.childCount).toBe(2);
            ist(view.state.doc, doc(h1("hello"), p()), eq);
        });

        it("can split a heading in the middle via command", () => {
            let view = tempEditor({
                doc: doc(h1("hel<a>lo")),
            });

            const result = splitBlock(view.state, view.dispatch, view);

            expect(result).toBe(true);
            expect(view.state.doc.childCount).toBe(2);
            // Splitting in middle should preserve heading type
            ist(view.state.doc, doc(h1("hel"), h1("lo")), eq);
        });

        it("inserts new paragraph when cursor at end of first paragraph (with following paragraph)", () => {
            // This tests the specific case: cursor at end of first paragraph,
            // there's already a second paragraph. Enter should INSERT a new
            // empty paragraph between them.
            let view = tempEditor({
                doc: doc(p("first<a>"), p("second")),
            });

            const initialChildCount = view.state.doc.childCount;
            expect(initialChildCount).toBe(2);

            // Execute splitBlock command directly
            const result = splitBlock(view.state, view.dispatch, view);

            expect(result).toBe(true);
            // Expected: 3 paragraphs - "first", empty, "second"
            expect(view.state.doc.childCount).toBe(3);
            ist(view.state.doc, doc(p("first"), p(), p("second")), eq);
            
            // Verify cursor is in the new empty paragraph (position 8)
            expect(view.state.selection.from).toBe(8);
        });
    });

    describe("Enter key with keymap plugin", () => {
        it("splits paragraph when pressing Enter at end of paragraph", async () => {
            if (!document.hasFocus()) return;

            let view = tempEditor({
                doc: doc(p("first<a>"), p("second")),
                plugins: [keymap(baseKeymap)],
            });

            // Cursor is at end of first paragraph (position 6)
            ist(view.state.selection.from, 6)
            
            // Press Enter to split the paragraph
            await keyboardEvent.keyboard('{Enter}')
            await keyboardEvent.keyboard('{/Enter}')

            // After Enter, cursor should be at start of new empty paragraph (position 8)
            ist(view.state.selection.from, 8)
            expect(view.state.doc.childCount).toBe(3);

            // Type a character - it should go into the new empty paragraph
            await keyboardEvent.keyboard('{A}')
            await keyboardEvent.keyboard('{/A}')

            // The document should now have 3 paragraphs with 'a' in the middle one
            // Note: {A} produces lowercase 'a' in userEvent keyboard
            expect(view.state.doc.childCount).toBe(3);
            ist(view.state.doc, doc(p("first"), p("a<a>"), p("second")), eq);
        });

        it("splits paragraph when pressing Enter in middle of text", () => {
            if (!document.hasFocus()) return;

            let view = tempEditor({
                doc: doc(p("hel<a>lo")),
                plugins: [keymap(baseKeymap)],
            });

            // Simulate pressing Enter key
            view.dom.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                bubbles: true,
                cancelable: true
            }));

            // The document should now have 2 paragraphs
            expect(view.state.doc.childCount).toBe(2);
            ist(view.state.doc, doc(p("hel"), p("<a>lo")), eq);
        });

        it("splits paragraph when pressing Enter at beginning", async () => {
            if (!document.hasFocus()) return;

            let view = tempEditor({
                doc: doc(p("<a>hello")),
                plugins: [keymap(baseKeymap)],
            });

            // Simulate pressing Enter key
            await keyboardEvent.keyboard('{Enter}')
            await keyboardEvent.keyboard('{/Enter}')

            // The document should have 2 paragraphs: empty then "hello"
            expect(view.state.doc.childCount).toBe(2);
            ist(view.state.doc, doc(p(), p("hello")), eq);
        });

        it("splits second paragraph when pressing Enter", () => {
            if (!document.hasFocus()) return;

            let view = tempEditor({
                doc: doc(p("first"), p("sec<a>ond")),
                plugins: [keymap(baseKeymap)],
            });

            // Simulate pressing Enter key
            view.dom.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                bubbles: true,
                cancelable: true
            }));

            // The document should now have 3 paragraphs
            expect(view.state.doc.childCount).toBe(3);
            ist(view.state.doc, doc(p("first"), p("sec"), p("ond")), eq);
        });

        it("splits heading when pressing Enter at end", () => {
            if (!document.hasFocus()) return;

            let view = tempEditor({
                doc: doc(h1("hello<a>")),
                plugins: [keymap(baseKeymap)],
            });

            // Simulate pressing Enter key
            view.dom.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                bubbles: true,
                cancelable: true
            }));

            // The document should now have 2 blocks
            expect(view.state.doc.childCount).toBe(2);
            ist(view.state.doc, doc(h1("hello"), p()), eq);
        });

        it("BUG: inserts new paragraph when cursor at end of first paragraph (with following paragraph)", () => {
            if (!document.hasFocus()) return;

            // This is the specific bug case: cursor at end of first paragraph,
            // there's already a second paragraph. Enter should INSERT a new
            // empty paragraph, NOT move cursor to start of next paragraph.
            let view = tempEditor({
                doc: doc(p("first<a>"), p("second")),
                plugins: [keymap(baseKeymap)],
            });

            const initialChildCount = view.state.doc.childCount;
            expect(initialChildCount).toBe(2);

            // Simulate pressing Enter key
            view.dom.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                bubbles: true,
                cancelable: true
            }));

            // Expected: 3 paragraphs - "first", empty, "second"
            // Bug: cursor just moves to "second" without inserting new paragraph
            expect(view.state.doc.childCount).toBe(3);
            ist(view.state.doc, doc(p("first"), p(), p("second")), eq);
            
            // Verify cursor is in the new empty paragraph (position 8)
            // first paragraph: pos 1-6 ("first"), second para starts at 8
            expect(view.state.selection.from).toBe(8);
        });
    });

    describe("handleKeyDown intercepts Enter", () => {
        it("detects Enter key press via handleKeyDown", () => {
            if (!document.hasFocus()) return;

            let enterDetected = false;
            let view = tempEditor({
                doc: doc(p("hello<a>")),
                handleKeyDown: (_view, event) => {
                    if (event.key === 'Enter') {
                        enterDetected = true;
                    }
                    return false; // Don't prevent default handling
                },
                plugins: [keymap(baseKeymap)],
            });

            view.dom.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                bubbles: true,
                cancelable: true
            }));

            expect(enterDetected).toBe(true);
        });
    });

    describe("chainCommands for Enter key", () => {
        it("chainCommands executes splitBlock when others return false", () => {
            let view = tempEditor({
                doc: doc(p("hello<a>")),
            });

            // Create the same chain as in baseKeymap but without splitListItem
            const enterCommand = chainCommands(
                newlineInCode,
                createParagraphNear,
                liftEmptyBlock,
                splitBlock
            );

            const result = enterCommand(view.state, view.dispatch, view);

            expect(result).toBe(true);
            expect(view.state.doc.childCount).toBe(2);
            ist(view.state.doc, doc(p("hello"), p()), eq);
        });

        it("tests individual commands to see which one handles Enter", () => {
            let view = tempEditor({
                doc: doc(p("hello<a>")),
            });

            // Test newlineInCode - should return false (not in code block)
            const newlineResult = newlineInCode(view.state, undefined, view);
            expect(newlineResult).toBe(false);

            // Test createParagraphNear - should return false (cursor in inline content)
            const createParaResult = createParagraphNear(view.state, undefined, view);
            expect(createParaResult).toBe(false);

            // Test liftEmptyBlock - should return false (not empty)
            const liftResult = liftEmptyBlock(view.state, undefined, view);
            expect(liftResult).toBe(false);

            // Test splitBlock - should return true
            const splitResult = splitBlock(view.state, undefined, view);
            expect(splitResult).toBe(true);
        });

        it("splitBlock returns true without dispatch (dry run)", () => {
            let view = tempEditor({
                doc: doc(p("hello<a>")),
            });

            // Test splitBlock without dispatch - should return true (can apply)
            const splitResult = splitBlock(view.state, undefined, view);
            expect(splitResult).toBe(true);
            
            // Document should NOT have changed (no dispatch)
            expect(view.state.doc.childCount).toBe(1);
        });

        it("splitBlock applies correctly when dispatch is provided", () => {
            let view = tempEditor({
                doc: doc(p("hello<a>")),
            });

            // Test splitBlock with dispatch
            const splitResult = splitBlock(view.state, view.dispatch, view);
            expect(splitResult).toBe(true);
            
            // Document should have changed
            expect(view.state.doc.childCount).toBe(2);
            ist(view.state.doc, doc(p("hello"), p()), eq);
        });
    });

    describe("Debug: verify splitBlock works in various scenarios", () => {
        it("splitBlock works at end of first paragraph with following paragraph", () => {
            let view = tempEditor({
                doc: doc(p("first<a>"), p("second")),
            });

            const result = splitBlock(view.state, view.dispatch, view);

            expect(result).toBe(true);
            expect(view.state.doc.childCount).toBe(3);
            ist(view.state.doc, doc(p("first"), p(), p("second")), eq);
        });

        it("Enter key via keydown event inserts new paragraph between two paragraphs", () => {
            if (!document.hasFocus()) return;
            
            let view = tempEditor({
                doc: doc(p("first"), p("second")),
                plugins: [keymap(baseKeymap)],
            });

            // Set selection at end of first paragraph (position 6)
            const $pos = view.state.doc.resolve(6);
            view.dispatch(view.state.transaction.setSelection(
                view.state.selection.constructor.near($pos)
            ));

            // Dispatch Enter key
            view.dom.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter', 
                keyCode: 13,
                bubbles: true,
                cancelable: true
            }));

            // Should insert new paragraph
            expect(view.state.doc.childCount).toBe(3);
            ist(view.state.doc, doc(p("first"), p(), p("second")), eq);
        });
    });
});
