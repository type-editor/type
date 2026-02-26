import { describe, it, expect } from 'vitest';
import type { Node } from '@type-editor/model';
import { EditorState, Selection, SelectionFactory } from '@type-editor/state';
import { a, doc, p, pre, schema } from '@type-editor/test-builder';

import { autoLink } from '@src/auto-link';
import { autoDeleteLink } from '@src/auto-delete-link';

// Helper functions adapted from test-commands.test.ts
function t(node: Node): { [name: string]: number; } {
    return (node as any).tag;
}

function selFor(docNode: Node) {
    const aPos = t(docNode).a;
    if (aPos != null) {
        const $a = docNode.resolve(aPos);
        if ($a.parent.inlineContent) {
            return SelectionFactory.createTextSelection($a, t(docNode).b != null ? docNode.resolve(t(docNode).b) : undefined);
        } else {
            return SelectionFactory.createNodeSelection($a);
        }
    }
    return Selection.atStart(docNode);
}

function mkState(docNode: Node) {
    return EditorState.create({ doc: docNode, selection: selFor(docNode) });
}


describe('autoLink', () => {
    const linkMarkType = schema.marks.link;
    const codeNodeType = schema.nodes.code_block;

    describe('with Enter key', () => {
        it('converts a URL to a link when Enter is pressed', () => {
            const command = autoLink('Enter', linkMarkType, codeNodeType);
            const initialDoc = doc(p('https://example.com<a>'));
            const state = mkState(initialDoc);

            let executed = false;
            let resultState = state;
            command(state, tr => {
                resultState = state.apply(tr);
                executed = true;
            });

            expect(executed).toBe(true);
            // Check that a link mark was added
            const linkMark = resultState.doc.nodeAt(1)?.marks.find(m => m.type === linkMarkType);
            expect(linkMark).toBeDefined();
            expect(linkMark?.attrs.href).toBe('https://example.com');
        });

        it('returns true for Enter key to prevent default', () => {
            const command = autoLink('Enter', linkMarkType, codeNodeType);
            const initialDoc = doc(p('https://example.com<a>'));
            const state = mkState(initialDoc);

            const result = command(state, () => {});
            expect(result).toBe(true);
        });

        it('does not convert text without URL pattern', () => {
            const command = autoLink('Enter', linkMarkType, codeNodeType);
            const initialDoc = doc(p('hello world<a>'));
            const state = mkState(initialDoc);

            let executed = false;
            const result = command(state, () => { executed = true; });

            expect(executed).toBe(false);
            expect(result).toBe(false);
        });

        it('does not convert if cursor already has a link', () => {
            const command = autoLink('Enter', linkMarkType, codeNodeType);
            // Text with existing link mark - cursor is inside the linked text
            const initialDoc = doc(p(a('https://example<a>.com')));
            const state = mkState(initialDoc);

            let executed = false;
            const result = command(state, () => { executed = true; });

            expect(executed).toBe(false);
            expect(result).toBe(false);
        });

        it('does not convert URLs in code blocks', () => {
            const command = autoLink('Enter', linkMarkType, codeNodeType);
            const initialDoc = doc(pre('https://example.com<a>'));
            const state = mkState(initialDoc);

            let executed = false;
            const result = command(state, () => { executed = true; });

            expect(executed).toBe(false);
            expect(result).toBe(false);
        });

        it('handles URLs with paths', () => {
            const command = autoLink('Enter', linkMarkType, codeNodeType);
            const initialDoc = doc(p('https://example.com/path/to/page<a>'));
            const state = mkState(initialDoc);

            let executed = false;
            let resultState = state;
            command(state, tr => {
                resultState = state.apply(tr);
                executed = true;
            });

            expect(executed).toBe(true);
            const linkMark = resultState.doc.nodeAt(1)?.marks.find(m => m.type === linkMarkType);
            expect(linkMark?.attrs.href).toBe('https://example.com/path/to/page');
        });

        it('handles URLs with query parameters', () => {
            const command = autoLink('Enter', linkMarkType, codeNodeType);
            const initialDoc = doc(p('https://example.com?foo=bar&baz=qux<a>'));
            const state = mkState(initialDoc);

            let executed = false;
            let resultState = state;
            command(state, tr => {
                resultState = state.apply(tr);
                executed = true;
            });

            expect(executed).toBe(true);
            const linkMark = resultState.doc.nodeAt(1)?.marks.find(m => m.type === linkMarkType);
            expect(linkMark?.attrs.href).toBe('https://example.com?foo=bar&baz=qux');
        });
    });

    describe('with Space key', () => {
        it('converts a URL to a link when Space is pressed', () => {
            const command = autoLink('Space', linkMarkType, codeNodeType);
            const initialDoc = doc(p('text https://example.com<a>'));
            const state = mkState(initialDoc);

            let executed = false;
            let resultState = state;
            command(state, tr => {
                resultState = state.apply(tr);
                executed = true;
            });

            expect(executed).toBe(true);
        });

        it('returns false for Space key to allow default behavior', () => {
            const command = autoLink('Space', linkMarkType, codeNodeType);
            const initialDoc = doc(p('text https://example.com<a>'));
            const state = mkState(initialDoc);

            const result = command(state, () => {});
            expect(result).toBe(false);
        });

        it('converts URL at start of text with Space', () => {
            const command = autoLink('Space', linkMarkType, codeNodeType);
            const initialDoc = doc(p('https://example.com<a>'));
            const state = mkState(initialDoc);

            let executed = false;
            command(state, () => { executed = true; });

            expect(executed).toBe(true);
        });

        it('does not convert text without URL when Space is pressed', () => {
            const command = autoLink('Space', linkMarkType, codeNodeType);
            const initialDoc = doc(p('just some text<a>'));
            const state = mkState(initialDoc);

            let executed = false;
            const result = command(state, () => { executed = true; });

            expect(executed).toBe(false);
            expect(result).toBe(false);
        });
    });

    describe('edge cases', () => {
        it('returns false when linkMarkType is not provided', () => {
            const command = autoLink('Enter', null as any);
            const initialDoc = doc(p('https://example.com<a>'));
            const state = mkState(initialDoc);

            const result = command(state, () => {});
            expect(result).toBe(false);
        });

        it('returns false for non-text selections', () => {
            const command = autoLink('Enter', linkMarkType, codeNodeType);
            const initialDoc = doc(p('https://example.com'));
            let state = EditorState.create({ doc: initialDoc });
            // Create a node selection instead of text selection
            state = state.apply(state.tr.setSelection(SelectionFactory.createNodeSelection(initialDoc.resolve(0))));

            const result = command(state, () => {});
            expect(result).toBe(false);
        });

        it('inserts newline after link when Enter is pressed', () => {
            const command = autoLink('Enter', linkMarkType, codeNodeType);
            const initialDoc = doc(p('https://example.com<a>'));
            const state = mkState(initialDoc);

            let resultState = state;
            command(state, tr => {
                resultState = state.apply(tr);
            });

            // Check that the document now has a newline/extra content
            expect(resultState.doc.textContent).toContain('\n');
        });

        it('inserts space after link when Space is pressed', () => {
            const command = autoLink('Space', linkMarkType, codeNodeType);
            const initialDoc = doc(p('https://example.com<a>'));
            const state = mkState(initialDoc);

            let resultState = state;
            command(state, tr => {
                resultState = state.apply(tr);
            });

            // Check that the document now has a space
            expect(resultState.doc.textContent).toContain(' ');
        });
    });
});

describe('autoDeleteLink', () => {
    const linkMarkType = schema.marks.link;

    describe('with Backspace key', () => {
        it('removes link mark when cursor is at end of link', () => {
            const command = autoDeleteLink('Backspace', linkMarkType);
            // Create a document with a link
            const initialDoc = doc(p(a('example'), '<a>'));
            const state = mkState(initialDoc);

            let executed = false;
            let resultState = state;
            const result = command(state, tr => {
                resultState = state.apply(tr);
                executed = true;
            });

            expect(result).toBe(true);
            expect(executed).toBe(true);
            // Check that link mark was removed
            const textNode = resultState.doc.nodeAt(1);
            const hasLinkMark = textNode?.marks.some(m => m.type === linkMarkType);
            expect(hasLinkMark).toBe(false);
        });

        it('returns false when cursor is not in a link', () => {
            const command = autoDeleteLink('Backspace', linkMarkType);
            const initialDoc = doc(p('plain text<a>'));
            const state = mkState(initialDoc);

            let executed = false;
            const result = command(state, () => { executed = true; });

            expect(result).toBe(false);
            expect(executed).toBe(false);
        });

        it('removes entire link mark range', () => {
            const command = autoDeleteLink('Backspace', linkMarkType);
            const initialDoc = doc(p('before ', a('linked text'), '<a> after'));
            const state = mkState(initialDoc);

            let resultState = state;
            command(state, tr => {
                resultState = state.apply(tr);
            });

            // Check that "linked text" no longer has link mark
            // Position starts at 8 (after "before ")
            const node = resultState.doc.nodeAt(8);
            const hasLink = node?.marks.some(m => m.type === linkMarkType);
            expect(hasLink).toBe(false);
        });
    });

    describe('with Delete key', () => {
        it('removes link mark when cursor is at start of link', () => {
            const command = autoDeleteLink('Delete', linkMarkType);
            // Cursor just before the link
            const initialDoc = doc(p('text<a>', a('link')));
            const state = mkState(initialDoc);

            let executed = false;
            let resultState = state;
            const result = command(state, tr => {
                resultState = state.apply(tr);
                executed = true;
            });

            expect(result).toBe(true);
            expect(executed).toBe(true);
        });

        it('returns false when nothing to delete forward', () => {
            const command = autoDeleteLink('Delete', linkMarkType);
            const initialDoc = doc(p('plain text<a>'));
            const state = mkState(initialDoc);

            let executed = false;
            const result = command(state, () => { executed = true; });

            expect(result).toBe(false);
            expect(executed).toBe(false);
        });
    });

    describe('edge cases', () => {
        it('returns false when linkMarkType is not provided', () => {
            const command = autoDeleteLink('Backspace', null as any);
            const initialDoc = doc(p(a('link'), '<a>'));
            const state = mkState(initialDoc);

            const result = command(state, () => {});
            expect(result).toBe(false);
        });

        it('returns false for non-text selections', () => {
            const command = autoDeleteLink('Backspace', linkMarkType);
            const initialDoc = doc(p(a('link')));
            let state = EditorState.create({ doc: initialDoc });
            state = state.apply(state.tr.setSelection(SelectionFactory.createNodeSelection(initialDoc.resolve(0))));

            const result = command(state, () => {});
            expect(result).toBe(false);
        });

        it('handles cursor inside link (not at boundary)', () => {
            const command = autoDeleteLink('Backspace', linkMarkType);
            // Cursor in the middle of the link text
            const initialDoc = doc(p(a('lin<a>ked')));
            const state = mkState(initialDoc);

            // Should find and remove the entire link
            let executed = false;
            const result = command(state, () => { executed = true; });

            expect(result).toBe(true);
        });

        it('handles multiple links in same paragraph', () => {
            const command = autoDeleteLink('Backspace', linkMarkType);
            const initialDoc = doc(p(a('first'), ' text ', a('second'), '<a>'));
            const state = mkState(initialDoc);

            let resultState = state;
            command(state, tr => {
                resultState = state.apply(tr);
            });

            // Only the second link should be removed
            // First link should still be intact
            const firstNode = resultState.doc.nodeAt(1);
            expect(firstNode?.marks.some(m => m.type === linkMarkType)).toBe(true);
        });

        it('preserves text content when removing link', () => {
            const command = autoDeleteLink('Backspace', linkMarkType);
            const initialDoc = doc(p(a('keep this text'), '<a>'));
            const state = mkState(initialDoc);

            let resultState = state;
            command(state, tr => {
                resultState = state.apply(tr);
            });

            // Text should still exist
            expect(resultState.doc.textContent).toContain('keep this text');
        });
    });
});
