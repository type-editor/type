import ist from 'ist';
import { describe, it } from 'vitest';

import type { NodeType } from '@type-editor/model';
import { SelectionFactory } from '@type-editor/state';
import { blockquote, doc, li, ol, p, ul } from '@type-editor/test-builder';

import { findCommonParent, findParent, findParentByType } from '@src/find-parent';

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

describe('findParent', () => {
    describe('with cursor selection', () => {
        it('finds parent by predicate when cursor is inside a paragraph', () => {
            const docNode = doc(p('hel<a>lo'));
            const selection = selFor(docNode);
            const result = findParent(selection, node => node.type.name === 'paragraph');

            ist(result);
            ist(result!.node.type.name, 'paragraph');
        });

        it('finds parent by predicate when cursor is in nested structure', () => {
            const docNode = doc(blockquote(p('hel<a>lo')));
            const selection = selFor(docNode);
            const result = findParent(selection, node => node.type.name === 'blockquote');

            ist(result);
            ist(result!.node.type.name, 'blockquote');
        });

        it('finds nearest matching ancestor when multiple match', () => {
            const docNode = doc(blockquote(blockquote(p('hel<a>lo'))));
            const selection = selFor(docNode);
            const result = findParent(selection, node => node.type.name === 'blockquote');

            ist(result);
            ist(result!.node.type.name, 'blockquote');
            // Should find the closest blockquote (the inner one)
            ist(result!.node.childCount, 1);
            ist(result!.node.firstChild!.type.name, 'paragraph');
        });

        it('returns null when no matching parent is found', () => {
            const docNode = doc(p('hel<a>lo'));
            const selection = selFor(docNode);
            const result = findParent(selection, node => node.type.name === 'blockquote');

            ist(result, null);
        });

        it('finds parent in a list structure', () => {
            const docNode = doc(ul(li(p('item <a>one')), li(p('item two'))));
            const selection = selFor(docNode);
            const result = findParent(selection, node => node.type.name === 'list_item');

            ist(result);
            ist(result!.node.type.name, 'list_item');
        });
    });

    describe('with range selection', () => {
        it('finds parent when selection spans multiple nodes within same parent', () => {
            const docNode = doc(p('he<a>llo wo<b>rld'));
            const selection = selFor(docNode);
            const result = findParent(selection, node => node.type.name === 'paragraph');

            ist(result);
            ist(result!.node.type.name, 'paragraph');
        });
    });
});

describe('findParentByType', () => {
    it('finds parent by node type', () => {
        const docNode = doc(p('hel<a>lo'));
        const selection = selFor(docNode);
        // Use the node type from the document's schema, cast to avoid monorepo type mismatch
        const paragraphType = docNode.type.schema.nodes.paragraph as unknown as NodeType;
        const result = findParentByType(selection, paragraphType);

        ist(result);
        ist(result!.node.type.name, 'paragraph');
    });

    it('finds blockquote parent by node type', () => {
        const docNode = doc(blockquote(p('hel<a>lo')));
        const selection = selFor(docNode);
        const blockquoteType = docNode.type.schema.nodes.blockquote as unknown as NodeType;
        const result = findParentByType(selection, blockquoteType);

        ist(result);
        ist(result!.node.type.name, 'blockquote');
    });

    it('returns null when node type is not found', () => {
        const docNode = doc(p('hel<a>lo'));
        const selection = selFor(docNode);
        const blockquoteType = docNode.type.schema.nodes.blockquote as unknown as NodeType;
        const result = findParentByType(selection, blockquoteType);

        ist(result, null);
    });

    it('finds list item in ordered list', () => {
        const docNode = doc(ol(li(p('item <a>one'))));
        const selection = selFor(docNode);
        const listItemType = docNode.type.schema.nodes.list_item as unknown as NodeType;
        const result = findParentByType(selection, listItemType);

        ist(result);
        ist(result!.node.type.name, 'list_item');
    });
});

describe('findCommonParent', () => {
    describe('with collapsed selection', () => {
        it('returns immediate parent for cursor in paragraph', () => {
            const docNode = doc(p('hel<a>lo'));
            const selection = selFor(docNode);
            const result = findCommonParent(selection);

            ist(result);
            ist(result!.node.type.name, 'paragraph');
        });

        it('returns immediate parent for cursor in nested structure', () => {
            const docNode = doc(blockquote(p('hel<a>lo')));
            const selection = selFor(docNode);
            const result = findCommonParent(selection);

            ist(result);
            ist(result!.node.type.name, 'paragraph');
        });
    });

    describe('with range selection in same parent', () => {
        it('returns the common parent when selection is within one paragraph', () => {
            const docNode = doc(p('he<a>llo wo<b>rld'));
            const selection = selFor(docNode);
            const result = findCommonParent(selection);

            ist(result);
            ist(result!.node.type.name, 'paragraph');
        });
    });

    describe('with range selection spanning multiple paragraphs', () => {
        it('returns the doc as common parent when selection spans two paragraphs', () => {
            const docNode = doc(p('hel<a>lo'), p('wo<b>rld'));
            const selection = selFor(docNode);
            const result = findCommonParent(selection);

            ist(result);
            ist(result!.node.type.name, 'doc');
        });

        it('returns blockquote as common parent when selection spans paragraphs inside blockquote', () => {
            const docNode = doc(blockquote(p('hel<a>lo'), p('wo<b>rld')));
            const selection = selFor(docNode);
            const result = findCommonParent(selection);

            ist(result);
            ist(result!.node.type.name, 'blockquote');
        });

        it('returns list as common parent when selection spans multiple list items', () => {
            const docNode = doc(ul(li(p('item <a>one')), li(p('item <b>two'))));
            const selection = selFor(docNode);
            const result = findCommonParent(selection);

            ist(result);
            ist(result!.node.type.name, 'bullet_list');
        });
    });

    describe('position correctness', () => {
        it('returns correct position for paragraph', () => {
            const docNode = doc(p('hel<a>lo'));
            const selection = selFor(docNode);
            const result = findCommonParent(selection);

            ist(result);
            // Position should point to the start of the paragraph
            ist(result!.position.pos, 0);
        });

        it('returns correct position for nested paragraph', () => {
            const docNode = doc(blockquote(p('hel<a>lo')));
            const selection = selFor(docNode);
            const result = findCommonParent(selection);

            ist(result);
            // Position should point to the start of the paragraph within blockquote
            ist(result!.position.pos, 1);
        });
    });
});
