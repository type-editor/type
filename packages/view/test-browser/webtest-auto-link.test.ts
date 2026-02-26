import { describe, it, expect } from 'vitest';
import { a, code_block, doc, p, schema } from '@type-editor/test-builder';
import { tempEditor } from './view';
import { autoLink, autoDeleteLink } from '@type-editor/commands';
import { Selection } from '@type-editor/state';

/**
 * Browser tests for autoLink and autoDeleteLink commands.
 * These tests run in a headless Chrome browser environment where a complete
 * EditorView can be used with proper schema integration.
 */
describe('autoLink browser tests', () => {
    const linkMarkType = schema.marks.link;
    const codeNodeType = schema.nodes.code_block;

    describe('with Enter key', () => {
        it('converts a URL to a link when Enter is pressed', () => {
            const view = tempEditor({ doc: doc(p('https://example.com<a>')) });
            const command = autoLink('Enter', linkMarkType);

            const result = command(view.state, view.dispatch.bind(view));

            expect(result).toBe(true);
            // Check that a link mark was added
            const linkMark = view.state.doc.nodeAt(1)?.marks.find(m => m.type === linkMarkType);
            expect(linkMark).toBeDefined();
            expect(linkMark?.attrs.href).toBe('https://example.com');
        });

        it('returns true for Enter key to prevent default', () => {
            const view = tempEditor({ doc: doc(p('https://example.com<a>')) });
            const command = autoLink('Enter', linkMarkType);

            const result = command(view.state, view.dispatch.bind(view));

            expect(result).toBe(true);
        });

        it('does not convert text without URL pattern', () => {
            const view = tempEditor({ doc: doc(p('hello world<a>')) });
            const command = autoLink('Enter', linkMarkType);

            const result = command(view.state, view.dispatch.bind(view));

            expect(result).toBe(false);
        });

        it('does not convert if cursor already has a link', () => {
            const view = tempEditor({ doc: doc(p(a('https://example<a>.com'))) });
            const command = autoLink('Enter', linkMarkType, codeNodeType);

            const result = command(view.state, view.dispatch.bind(view));

            expect(result).toBe(false);
        });

        it('does not convert URLs in code blocks', () => {
            const view = tempEditor({ doc: doc(code_block('https://example.com<a>')) });
            const command = autoLink('Enter', linkMarkType, codeNodeType);

            const result = command(view.state, view.dispatch.bind(view));

            expect(result).toBe(false);
        });

        it('handles URLs with paths', () => {
            const view = tempEditor({ doc: doc(p('https://example.com/path/to/page<a>')) });
            const command = autoLink('Enter', linkMarkType, codeNodeType);

            const result = command(view.state, view.dispatch.bind(view));

            expect(result).toBe(true);
            const linkMark = view.state.doc.nodeAt(1)?.marks.find(m => m.type === linkMarkType);
            expect(linkMark?.attrs.href).toBe('https://example.com/path/to/page');
        });

        it('handles URLs with query parameters', () => {
            const view = tempEditor({ doc: doc(p('https://example.com?foo=bar&baz=qux<a>')) });
            const command = autoLink('Enter', linkMarkType, codeNodeType);

            const result = command(view.state, view.dispatch.bind(view));

            expect(result).toBe(true);
            const linkMark = view.state.doc.nodeAt(1)?.marks.find(m => m.type === linkMarkType);
            expect(linkMark?.attrs.href).toBe('https://example.com?foo=bar&baz=qux');
        });

        it('inserts newline after creating link', () => {
            const view = tempEditor({ doc: doc(p('https://example.com<a>')) });
            const command = autoLink('Enter', linkMarkType, codeNodeType);

            command(view.state, view.dispatch.bind(view));

            expect(view.state.doc.textContent).toContain('\n');
        });
    });

    describe('with Space key', () => {
        it('converts a URL to a link when Space is pressed', () => {
            const view = tempEditor({ doc: doc(p('text https://example.com<a>')) });
            const command = autoLink('Space', linkMarkType, codeNodeType);

            command(view.state, view.dispatch.bind(view));

            // Check that a link mark was added somewhere in the document
            let hasLink = false;
            view.state.doc.descendants((node) => {
                if (node.marks.some(m => m.type === linkMarkType)) {
                    hasLink = true;
                    return false;
                }
                return true;
            });
            expect(hasLink).toBe(true);
        });

        it('returns false for Space key to allow default behavior', () => {
            const view = tempEditor({ doc: doc(p('text https://example.com<a>')) });
            const command = autoLink('Space', linkMarkType, codeNodeType);

            const result = command(view.state, view.dispatch.bind(view));

            expect(result).toBe(false);
        });

        it('converts URL at start of text with Space', () => {
            const view = tempEditor({ doc: doc(p('https://example.com<a>')) });
            const command = autoLink('Space', linkMarkType, codeNodeType);

            let dispatched = false;
            command(view.state, () => {
                dispatched = true;
            });

            expect(dispatched).toBe(true);
        });

        it('does not convert text without URL when Space is pressed', () => {
            const view = tempEditor({ doc: doc(p('just some text<a>')) });
            const command = autoLink('Space', linkMarkType, codeNodeType);

            const result = command(view.state, view.dispatch.bind(view));

            expect(result).toBe(false);
        });

        it('inserts space after creating link', () => {
            const view = tempEditor({ doc: doc(p('https://example.com<a>')) });
            const command = autoLink('Space', linkMarkType, codeNodeType);

            command(view.state, view.dispatch.bind(view));

            expect(view.state.doc.textContent).toContain(' ');
        });
    });

    describe('edge cases', () => {
        it('returns false for non-text selections', () => {
            const view = tempEditor({ doc: doc(p('https://example.com')) });
            // Select the entire paragraph as a node
            view.dispatch(view.state.tr.setSelection(Selection.near(view.state.doc.resolve(0))));
            const command = autoLink('Enter', linkMarkType, codeNodeType);

            const result = command(view.state, view.dispatch.bind(view));

            expect(result).toBe(false);
        });
    });
});

describe('autoDeleteLink browser tests', () => {
    const linkMarkType = schema.marks.link;

    describe('with Backspace key', () => {
        it('removes link mark when cursor is at end of link', () => {
            const view = tempEditor({ doc: doc(p(a('example'), '<a>')) });
            const command = autoDeleteLink('Backspace', linkMarkType);

            const result = command(view.state, view.dispatch.bind(view));

            expect(result).toBe(true);
            // Check that link mark was removed
            const textNode = view.state.doc.nodeAt(1);
            const hasLinkMark = textNode?.marks.some(m => m.type === linkMarkType);
            expect(hasLinkMark).toBe(false);
        });

        it('returns false when cursor is not in a link', () => {
            const view = tempEditor({ doc: doc(p('plain text<a>')) });
            const command = autoDeleteLink('Backspace', linkMarkType);

            const result = command(view.state, view.dispatch.bind(view));

            expect(result).toBe(false);
        });

        it('removes entire link mark range', () => {
            const view = tempEditor({ doc: doc(p('before ', a('linked text'), '<a> after')) });
            const command = autoDeleteLink('Backspace', linkMarkType);

            command(view.state, view.dispatch.bind(view));

            // Check that "linked text" no longer has link mark
            const node = view.state.doc.nodeAt(8);
            const hasLink = node?.marks.some(m => m.type === linkMarkType);
            expect(hasLink).toBe(false);
        });
    });

    describe('with Delete key', () => {
        it('removes link mark when cursor is at start of link', () => {
            const view = tempEditor({ doc: doc(p('text<a>', a('link'))) });
            const command = autoDeleteLink('Delete', linkMarkType);

            const result = command(view.state, view.dispatch.bind(view));

            expect(result).toBe(true);
        });

        it('returns false when nothing to delete forward', () => {
            const view = tempEditor({ doc: doc(p('plain text<a>')) });
            const command = autoDeleteLink('Delete', linkMarkType);

            const result = command(view.state, view.dispatch.bind(view));

            expect(result).toBe(false);
        });
    });

    describe('edge cases', () => {
        it('returns false for non-text selections', () => {
            const view = tempEditor({ doc: doc(p(a('link'))) });
            // Select the entire paragraph as a node
            view.dispatch(view.state.tr.setSelection(Selection.near(view.state.doc.resolve(0))));
            const command = autoDeleteLink('Backspace', linkMarkType);

            const result = command(view.state, view.dispatch.bind(view));

            expect(result).toBe(false);
        });

        it('handles cursor inside link (not at boundary)', () => {
            const view = tempEditor({ doc: doc(p(a('lin<a>ked'))) });
            const command = autoDeleteLink('Backspace', linkMarkType);

            const result = command(view.state, view.dispatch.bind(view));

            expect(result).toBe(true);
        });

        it('handles multiple links in same paragraph', () => {
            const view = tempEditor({ doc: doc(p(a('first'), ' text ', a('second'), '<a>')) });
            const command = autoDeleteLink('Backspace', linkMarkType);

            command(view.state, view.dispatch.bind(view));

            // Only the second link should be removed
            // First link should still be intact
            const firstNode = view.state.doc.nodeAt(1);
            expect(firstNode?.marks.some(m => m.type === linkMarkType)).toBe(true);
        });

        it('preserves text content when removing link', () => {
            const view = tempEditor({ doc: doc(p(a('keep this text'), '<a>')) });
            const command = autoDeleteLink('Backspace', linkMarkType);

            command(view.state, view.dispatch.bind(view));

            // Text should still exist
            expect(view.state.doc.textContent).toContain('keep this text');
        });
    });
});
