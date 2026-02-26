import ist from 'ist';
import { EditorState } from '@type-editor/state';
import { DecorationSet } from '@type-editor/decoration';
import { describe, it } from 'vitest';

import { ResizeState } from '@src/columnresizing/ResizeState';
import { handleDecorations } from '@src/columnresizing/column-resizing/handle-decorations';

import { table, doc, tr, cEmpty, c, td, p } from './build';

describe('handleDecorations', () => {
  it('returns an empty DecorationSet if cell is null or undefined', () => {
    const state = EditorState.create({
      doc: doc(table(tr(/* 2*/ cEmpty, /* 6*/ cEmpty, /*10*/ cEmpty))),
    });
    ist(handleDecorations(state, null), DecorationSet.empty);
  });

  it('returns an empty DecorationSet for undefined', () => {
    const state = EditorState.create({
      doc: doc(table(tr(cEmpty, cEmpty, cEmpty))),
    });
    ist(handleDecorations(state, undefined), DecorationSet.empty);
  });

  it('returns decorations for valid cell position', () => {
    const state = EditorState.create({
      doc: doc(table(tr(cEmpty, cEmpty, cEmpty))),
    });
    // Position 2 should point to first cell
    const result = handleDecorations(state, 2);
    ist(result !== DecorationSet.empty);
  });

  it('handles cells with colspan', () => {
    const state = EditorState.create({
      doc: doc(table(tr(c(2, 1), cEmpty))),
    });
    const result = handleDecorations(state, 2);
    ist(result !== DecorationSet.empty);
  });

  it('handles multi-row tables', () => {
    const state = EditorState.create({
      doc: doc(table(
        tr(cEmpty, cEmpty),
        tr(cEmpty, cEmpty)
      )),
    });
    const result = handleDecorations(state, 2);
    ist(result !== DecorationSet.empty);
  });
});

describe('ResizeState', () => {
  it('initializes with no active handle', () => {
    const state = new ResizeState(-1, null);
    ist(state.activeHandle, -1);
    ist(state.dragging, undefined);
  });

  it('initializes with active handle', () => {
    const state = new ResizeState(5, null);
    ist(state.activeHandle, 5);
  });

  it('initializes with dragging state', () => {
    const dragging = { startX: 100, startWidth: 200 };
    const state = new ResizeState(5, dragging);
    ist(state.dragging, dragging);
  });
});
