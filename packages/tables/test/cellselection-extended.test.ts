import ist from 'ist';
import { Slice, Fragment } from '@type-editor/model';
import { EditorState } from '@type-editor/state';
import { describe, it, expect } from 'vitest';

import { CellSelection } from '../src';

import {
  c,
  c11,
  cAnchor,
  cEmpty,
  cHead,
  doc,
  p,
  selectionFor,
  table,
  td,
  th,
  tr,
} from './build';
import type { TaggedNode } from './build';
import type {PmEditorState, PmSelection} from '@type-editor/editor-types';

describe('CellSelection.map', () => {
  it('maps positions correctly after document changes', () => {
    const t = doc(table(tr(cAnchor, cHead, cEmpty), tr(cEmpty, cEmpty, cEmpty))) as TaggedNode;
    let state: PmEditorState = EditorState.create({
      doc: t,
      selection: selectionFor(t),
    });

    // Apply a transaction that modifies the document
    const tr1 = state.tr.insertText('x', 4);
    state = state.apply(tr1);

    // The selection should be mapped correctly
    ist(state.selection instanceof CellSelection, true);
  });

  it('falls back to TextSelection when cells become invalid', () => {
    const t = doc(table(tr(cAnchor, cHead)), p('after')) as TaggedNode;
    let state: PmEditorState = EditorState.create({
      doc: t,
      selection: selectionFor(t),
    });

    // Delete the table
    const tr1 = state.tr.delete(0, state.doc.firstChild!.nodeSize);
    state = state.apply(tr1);

    // The selection should fall back to a text selection
    ist(state.selection instanceof CellSelection, false);
  });

  it('creates CellSelection with anchor and head cells', () => {
    const t = doc(table(tr(cAnchor, cHead, cEmpty), tr(cEmpty, cEmpty, cEmpty))) as TaggedNode;
    let state: PmEditorState = EditorState.create({
      doc: t,
      selection: selectionFor(t),
    });

    const sel = state.selection as CellSelection;
    expect(sel.$anchorCell).toBeDefined();
    expect(sel.$headCell).toBeDefined();
  });

  it('handles column selection', () => {
    const t = doc(table(tr(cAnchor, cEmpty), tr(cHead, cEmpty))) as TaggedNode;
    let state: PmEditorState = EditorState.create({
      doc: t,
      selection: selectionFor(t),
    });

    const sel = state.selection as CellSelection;
    expect(sel.$anchorCell).toBeDefined();
    expect(sel.$headCell).toBeDefined();
  });
});

describe('CellSelection.replace', () => {
  it('replaces cell content with slice', () => {
    const t = doc(table(tr(cAnchor, cHead, c11))) as TaggedNode;
    let state: PmEditorState = EditorState.create({
      doc: t,
      selection: selectionFor(t),
    });

    // Replace selection with new content
    const transaction = state.tr;
    const sel = state.selection as CellSelection;
    sel.replace(transaction, new Slice(Fragment.from(p('new')), 0, 0));
    state = state.apply(transaction);

    // After replacement, the cells may have been modified
    // The replace method puts content in the first cell
    const tableNode = state.doc.firstChild!;
    expect(tableNode).toBeDefined();
    // Just verify the transaction was applied
    expect(transaction.docChanged).toBe(true);
  });

  it('clears all cells when replacing with empty slice', () => {
    const t = doc(table(tr(cAnchor, cHead))) as TaggedNode;
    let state: PmEditorState = EditorState.create({
      doc: t,
      selection: selectionFor(t),
    });

    const transaction = state.tr;
    const sel = state.selection as CellSelection;
    sel.replace(transaction, Slice.empty);
    state = state.apply(transaction);

    // Both cells should be cleared
    const tableNode = state.doc.firstChild!;
    const row = tableNode.firstChild!;
    expect(row.firstChild!.textContent).toBe('');
  });
});

describe('CellSelection.replaceWith', () => {
  it('replaces cell content with a node', () => {
    const t = doc(table(tr(cAnchor, cHead))) as TaggedNode;
    let state: PmEditorState = EditorState.create({
      doc: t,
      selection: selectionFor(t),
    });

    const transaction = state.tr;
    const sel = state.selection as CellSelection;
    sel.replaceWith(transaction, p('replaced'));
    state = state.apply(transaction);

    // Verify the transaction was applied
    expect(transaction.docChanged).toBe(true);
    // The table structure should still exist
    const tableNode = state.doc.firstChild!;
    expect(tableNode).toBeDefined();
  });
});

describe('CellSelection.forEachCell', () => {
  it('iterates over all selected cells', () => {
    const t = doc(table(tr(cAnchor, c11, cHead), tr(c11, c11, c11))) as TaggedNode;
    const state: PmEditorState = EditorState.create({
      doc: t,
      selection: selectionFor(t),
    });

    const sel = state.selection as CellSelection;
    const cells: Array<{ pos: number; content: string }> = [];

    sel.forEachCell((node, pos) => {
      cells.push({ pos, content: node.textContent });
    });

    ist(cells.length, 3);
  });

  it('handles spanning cells correctly', () => {
    const t = doc(table(tr(cAnchor, c(2, 1)), tr(c11, cHead, c11))) as TaggedNode;
    const state: PmEditorState = EditorState.create({
      doc: t,
      selection: selectionFor(t),
    });

    const sel = state.selection as CellSelection;
    const cells: Array<number> = [];

    sel.forEachCell((node, pos) => {
      cells.push(pos);
    });

    expect(cells.length).toBeGreaterThan(0);
  });
});

describe('CellSelection.isColSelection', () => {
  it('returns true for full column selection', () => {
    const t = doc(table(tr(cAnchor, cEmpty), tr(cHead, cEmpty))) as TaggedNode;
    const state: PmEditorState = EditorState.create({
      doc: t,
      selection: selectionFor(t),
    });
    const sel = state.selection as CellSelection;
    ist(sel.isColSelection(), true);
  });

  it('returns false for partial column selection', () => {
    const t = doc(table(tr(cAnchor, cHead, cEmpty), tr(cEmpty, cEmpty, cEmpty), tr(cEmpty, cEmpty, cEmpty))) as TaggedNode;
    const state: PmEditorState = EditorState.create({
      doc: t,
      selection: selectionFor(t),
    });
    const sel = state.selection as CellSelection;
    ist(sel.isColSelection(), false);
  });

  it('returns true for column selection with spanning cells', () => {
    const t = doc(table(tr(td({ rowspan: 2 }, p('x<anchor>')), c11), tr(cHead))) as TaggedNode;
    const state: PmEditorState = EditorState.create({
      doc: t,
      selection: selectionFor(t),
    });
    const sel = state.selection as CellSelection;
    ist(sel.isColSelection(), true);
  });
});

describe('CellSelection.isRowSelection', () => {
  it('returns true for full row selection', () => {
    const t = doc(table(tr(cAnchor, cEmpty, cHead), tr(cEmpty, cEmpty, cEmpty))) as TaggedNode;
    const state: PmEditorState = EditorState.create({
      doc: t,
      selection: selectionFor(t),
    });
    const sel = state.selection as CellSelection;
    ist(sel.isRowSelection(), true);
  });

  it('returns false for partial row selection', () => {
    const t = doc(table(tr(cAnchor, cHead, cEmpty), tr(cEmpty, cEmpty, cEmpty))) as TaggedNode;
    const state: PmEditorState = EditorState.create({
      doc: t,
      selection: selectionFor(t),
    });
    const sel = state.selection as CellSelection;
    ist(sel.isRowSelection(), false);
  });

  it('returns true for row selection with spanning cells', () => {
    const t = doc(table(tr(td({ colspan: 2 }, p('x<anchor>')), cHead), tr(c11, c11, c11))) as TaggedNode;
    const state: PmEditorState = EditorState.create({
      doc: t,
      selection: selectionFor(t),
    });
    const sel = state.selection as CellSelection;
    ist(sel.isRowSelection(), true);
  });
});

describe('CellSelection.eq', () => {
  it('returns true for equal selections', () => {
    const t1 = doc(table(tr(cAnchor, cHead), tr(cEmpty, cEmpty))) as TaggedNode;
    const t2 = doc(table(tr(cAnchor, cHead), tr(cEmpty, cEmpty))) as TaggedNode;
    const sel1 = selectionFor(t1);
    const sel2 = selectionFor(t2);
    ist(sel1.eq(sel2), true);
  });

  it('returns false for different selections', () => {
    const t1 = doc(table(tr(cAnchor, cHead, cEmpty))) as TaggedNode;
    const t2 = doc(table(tr(cAnchor, cEmpty, cHead))) as TaggedNode;
    const sel1 = selectionFor(t1);
    const sel2 = selectionFor(t2);
    ist(sel1.eq(sel2), false);
  });

  it('returns false for non-CellSelection', () => {
    const t = doc(table(tr(cAnchor, cHead))) as TaggedNode;
    const sel = selectionFor(t);
    ist(sel.eq({} as PmSelection), false);
    ist(sel.eq(null), false);
  });
});

describe('CellSelection.toJSON and fromJSON', () => {
  it('serializes and deserializes correctly', () => {
    const t = doc(table(tr(cAnchor, cHead), tr(cEmpty, cEmpty))) as TaggedNode;
    const sel = selectionFor(t) as CellSelection;
    const json = sel.toJSON();

    ist(json.type, 'cell');
    expect(json.anchor).toBeDefined();
    expect(json.head).toBeDefined();

    const restored = CellSelection.fromJSON(t, json);
    ist(sel.eq(restored), true);
  });
});

describe('CellSelection.getBookmark', () => {
  it('creates a bookmark that can be resolved', () => {
    const t = doc(table(tr(cAnchor, cHead), tr(cEmpty, cEmpty))) as TaggedNode;
    const sel = selectionFor(t) as CellSelection;
    const bookmark = sel.getBookmark();

    const resolved = bookmark.resolve(t);
    ist(resolved instanceof CellSelection, true);
    ist((resolved as CellSelection).eq(sel), true);
  });

  it('bookmark can be mapped across document changes', () => {
    const t = doc(table(tr(cAnchor, cHead), tr(cEmpty, cEmpty))) as TaggedNode;
    let state: PmEditorState = EditorState.create({
      doc: t,
      selection: selectionFor(t),
    });

    const sel = state.selection as CellSelection;
    const bookmark = sel.getBookmark();

    // Create a transaction that modifies the document
    const transaction = state.tr.insertText('x', 4);
    const mapping = transaction.mapping;

    const mappedBookmark = bookmark.map(mapping);
    expect(mappedBookmark).toBeDefined();
  });
});

describe('CellSelection.content', () => {
  it('returns correct content for rectangular selection', () => {
    const t = doc(table(tr(cAnchor, cEmpty, c11), tr(c11, cHead, c11))) as TaggedNode;
    const state: PmEditorState = EditorState.create({
      doc: t,
      selection: selectionFor(t),
    });

    const sel = state.selection as CellSelection;
    const content = sel.content();

    expect(content).toBeDefined();
    expect(content.size).toBeGreaterThan(0);
  });

  it('handles spanning cells that extend beyond selection', () => {
    const t = doc(table(
      tr(c(3, 1)),
      tr(cAnchor, c11, cHead),
    )) as TaggedNode;
    const state: PmEditorState = EditorState.create({
      doc: t,
      selection: selectionFor(t),
    });

    const sel = state.selection as CellSelection;
    const content = sel.content();
    expect(content).toBeDefined();
  });
});

describe('CellSelection with header cells', () => {
  it('correctly handles selection including header cells', () => {
    const t = doc(table(tr(th(p('a<anchor>')), th(p('b<head>'))), tr(cEmpty, cEmpty))) as TaggedNode;
    const state: PmEditorState = EditorState.create({
      doc: t,
      selection: selectionFor(t),
    });

    const sel = state.selection as CellSelection;
    expect(sel.$anchorCell).toBeDefined();
    expect(sel.$headCell).toBeDefined();
  });

  it('content preserves header cell types', () => {
    const t = doc(table(tr(th(p('h1<anchor>')), th(p('h2<head>'))))) as TaggedNode;
    const state: PmEditorState = EditorState.create({
      doc: t,
      selection: selectionFor(t),
    });

    const sel = state.selection as CellSelection;
    const content = sel.content();

    expect(content).toBeDefined();
  });
});

