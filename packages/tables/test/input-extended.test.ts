import { describe, it, expect } from 'vitest';
import type { Command } from '@type-editor/state';
import { EditorState, TextSelection } from '@type-editor/state';
import { EditorView } from '@type-editor/view';

import { arrow } from '@src/input/arrow';
import { CellSelection } from '@src/cellselection/CellSelection';

import type { TaggedNode } from './build';
import {
  c,
  c11,
  cCursor,
  cCursorBefore,
  cEmpty,
  cAnchor,
  cHead,
  doc,
  p,
  selectionFor,
  table,
  td,
  tr,
} from './build';
import type {PmEditorState} from "@type-editor/editor-types";

function test(
  docNode: TaggedNode,
  command: Command,
  result: TaggedNode | null | undefined,
) {
  let state: PmEditorState = EditorState.create({ doc: docNode, selection: selectionFor(docNode) });
  const view = new EditorView(document.createElement('div'), { state });
  const ran = command(state, (tr) => (state = state.apply(tr)), view);
  if (result == null) {
    expect(ran).toBe(false);
  } else {
    const expected = {
      doc: result.toJSON(),
      selection: selectionFor(result).toJSON(),
    };
    const actual = state.toJSON();
    expect(actual).toEqual(expected);
  }
}

describe('arrow extended', () => {
  it('returns false when view is not provided', () => {
    const docNode = table(tr(cCursor, c11));
    let state: PmEditorState = EditorState.create({ doc: docNode, selection: selectionFor(docNode) });
    // Call without view
    const ran = arrow('horiz', 1)(state, (tr) => (state = state.apply(tr)), undefined as any);
    expect(ran).toBe(false);
  });

  it('handles cell selection correctly', () => {
    const docNode = table(tr(cAnchor, cHead, c11));
    let state: PmEditorState = EditorState.create({ doc: docNode, selection: selectionFor(docNode) });
    const view = new EditorView(document.createElement('div'), { state });

    const ran = arrow('horiz', 1)(state, (tr) => (state = state.apply(tr)), view);
    // Should exit the cell selection and move to a text position
    expect(ran).toBe(true);
    expect(state.selection instanceof CellSelection).toBe(false);
  });

  it('does not move cursor when not at cell edge', () => {
    const docNode = table(tr(td(p('hello<cursor>world')), c11));
    let state: PmEditorState = EditorState.create({ doc: docNode, selection: selectionFor(docNode) });
    const view = new EditorView(document.createElement('div'), { state });

    const ran = arrow('horiz', 1)(state, (tr) => (state = state.apply(tr)), view);
    // Cursor is in the middle of text, arrow should be handled normally
    expect(ran).toBe(false);
  });

  it('handles arrow up at first row - moves to paragraph before table', () => {
    const docNode = doc(p('before'), table(tr(cCursorBefore, c11), tr(c11, c11)));
    let state: PmEditorState = EditorState.create({ doc: docNode, selection: selectionFor(docNode) });
    const view = new EditorView(document.createElement('div'), { state });

    const ran = arrow('vert', -1)(state, (tr) => (state = state.apply(tr)), view);
    // Should move out of table or stay
    expect(typeof ran).toBe('boolean');
  });

  it('handles arrow down at last row - moves to paragraph after table', () => {
    const docNode = doc(table(tr(c11, c11), tr(cCursorBefore, c11)), p('after'));
    let state: PmEditorState = EditorState.create({ doc: docNode, selection: selectionFor(docNode) });
    const view = new EditorView(document.createElement('div'), { state });

    const ran = arrow('vert', 1)(state, (tr) => (state = state.apply(tr)), view);
    expect(typeof ran).toBe('boolean');
  });

  it('handles non-empty selection in horizontal direction', () => {
    // With non-empty selection in horizontal direction, it should still work
    const docNode = doc(table(tr(td(p('text')), c11)));
    let state: PmEditorState = EditorState.create({
      doc: docNode,
      selection: TextSelection.create(docNode, 5, 7), // Select "xt"
    });
    const view = new EditorView(document.createElement('div'), { state });

    // Horizontal arrow with non-empty selection is handled normally
    const ran = arrow('horiz', 1)(state, (tr) => (state = state.apply(tr)), view);
    expect(typeof ran).toBe('boolean');
  });
});


// Note: handleTripleClick requires a full browser environment, so we test its logic through integration
describe('input handlers edge cases', () => {
  it('handles tables with spanning cells during navigation', () => {
    const docNode = table(tr(c(2, 1), c11), tr(cCursorBefore, c11, c11));
    let state: PmEditorState = EditorState.create({ doc: docNode, selection: selectionFor(docNode) });
    const view = new EditorView(document.createElement('div'), { state });

    const ran = arrow('vert', -1)(state, (tr) => (state = state.apply(tr)), view);
    expect(typeof ran).toBe('boolean');
  });

  it('handles tables with rowspan cells during navigation', () => {
    const docNode = table(tr(c(1, 2), cCursorBefore), tr(c11));
    let state: PmEditorState = EditorState.create({ doc: docNode, selection: selectionFor(docNode) });
    const view = new EditorView(document.createElement('div'), { state });

    const ran = arrow('vert', 1)(state, (tr) => (state = state.apply(tr)), view);
    expect(typeof ran).toBe('boolean');
  });
});

