import ist from 'ist';
import { describe, it } from 'vitest';

import { EditorState, SelectionFactory, type Transaction } from '@type-editor/state';
import { builders, doc, eq, p, schema } from '@type-editor/test-builder';
import { setAttribute } from '@src/set-attribute';
import type { Command } from '@type-editor/editor-types';

function t(node: any): { [name: string]: number } {
    return node.tag || {};
}

function selFor(docNode: any) {
    const a = t(docNode).a;
    if (a != null) {
        const $a = docNode.resolve(a);
        const b = t(docNode).b;
        if (b != null) {
            return SelectionFactory.createTextSelection($a, docNode.resolve(b));
        }
        return SelectionFactory.createTextSelection($a);
    }
    return SelectionFactory.createTextSelection(docNode);
}

function mkState(docNode: any) {
    return EditorState.create({ doc: docNode, selection: selFor(docNode) });
}

function apply(docNode: any, command: Command, result: any) {
    let state = mkState(docNode);
    command(state, (tr: Transaction) => {
        state = state.apply(tr);
    });
    ist(state.doc, result || docNode, eq);
}

describe('setAttribute', () => {
    describe('cursor inside paragraph', () => {
        it('sets attribute when cursor is at the beginning of a paragraph', () => {
            // Cursor at position: <p><a>hello</p>
            const input = doc(p('<a>hello'));
            const expected = doc(p({ textAlign: 'center' }, 'hello'));
            apply(input, setAttribute('textAlign', 'center'), expected);
        });

        it('sets attribute when cursor is in the middle of a paragraph', () => {
            // Cursor at position: <p>he<a>llo</p>
            const input = doc(p('he<a>llo'));
            const expected = doc(p({ textAlign: 'center' }, 'hello'));
            apply(input, setAttribute('textAlign', 'center'), expected);
        });

        it('sets attribute when cursor is at the end of a paragraph', () => {
            // Cursor at position: <p>hello<a></p>
            const input = doc(p('hello<a>'));
            const expected = doc(p({ textAlign: 'center' }, 'hello'));
            apply(input, setAttribute('textAlign', 'center'), expected);
        });
    });

    describe('text selection inside paragraph', () => {
        it('sets attribute when some text is selected', () => {
            // Selection: <p>h<a>el<b>lo</p>
            const input = doc(p('h<a>el<b>lo'));
            const expected = doc(p({ textAlign: 'center' }, 'hello'));
            apply(input, setAttribute('textAlign', 'center'), expected);
        });

        it('sets attribute when all text in paragraph is selected', () => {
            // Selection: <p><a>hello<b></p>
            const input = doc(p('<a>hello<b>'));
            const expected = doc(p({ textAlign: 'center' }, 'hello'));
            apply(input, setAttribute('textAlign', 'center'), expected);
        });
    });

    describe('selection spanning multiple paragraphs', () => {
        it('sets attribute on all selected paragraphs', () => {
            // Selection spans from first to second paragraph
            const input = doc(p('he<a>llo'), p('wo<b>rld'));
            const expected = doc(
                p({ textAlign: 'center' }, 'hello'),
                p({ textAlign: 'center' }, 'world')
            );
            apply(input, setAttribute('textAlign', 'center'), expected);
        });

        it('sets attribute when entire paragraphs are selected', () => {
            const input = doc(p('<a>hello'), p('world<b>'));
            const expected = doc(
                p({ textAlign: 'center' }, 'hello'),
                p({ textAlign: 'center' }, 'world')
            );
            apply(input, setAttribute('textAlign', 'center'), expected);
        });
    });

    describe('no-op cases', () => {
        it('returns false when attribute is already set', () => {
            const input = doc(p({ textAlign: 'center' }, '<a>hello'));
            let state = mkState(input);
            const result = setAttribute('textAlign', 'center')(state);
            ist(result, false);
        });

        it('returns false when node does not support the attribute', () => {
            // Assume we try to set an attribute that doesn't exist on paragraph
            const input = doc(p('<a>hello'));
            let state = mkState(input);
            const result = setAttribute('nonExistentAttr', 'value')(state);
            ist(result, false);
        });
    });
});
