import ist from 'ist';
import type { Node } from '@type-editor/model';
import type { Command, Transaction } from '@type-editor/state';
import { EditorState, TextSelection } from '@type-editor/state';
import { describe, it } from 'vitest';

import {
  addColumnAfter,
  addColumnBefore,
  addRowAfter,
  addRowBefore,
  deleteColumn,
  deleteRow,
  deleteTable,
  deleteCellSelection,
  goToNextCell,
  mergeCells,
  splitCell,
  setCellAttr,
  toggleHeader,
  CellSelection,
  moveTableRow,
  moveTableColumn,
  rowIsHeader,
  selectedRect,
  TableMap,
} from '../src';

import type { TaggedNode } from './build';
import {
  doc,
  table,
  tr,
  p,
  td,
  th,
  c,
  h,
  c11,
  h11,
  cEmpty,
  hEmpty,
  cCursor,
  hCursor,
  cHead,
  cAnchor,
  eq,
  selectionFor,
} from './build';
import type { PmEditorState } from '@type-editor/editor-types';

function test(
  doc: TaggedNode,
  command: Command,
  result: Node | null | undefined,
) {
  let state: PmEditorState = EditorState.create({ doc, selection: selectionFor(doc) });
  const ran = command(state, (tr) => (state = state.apply(tr)));
  if (result == null) ist(ran, false);
  else ist(state.doc, result, eq);
}

describe('goToNextCell', () => {
  it('moves to the next cell when direction is 1', () => {
    let state: PmEditorState = EditorState.create({
      doc: table(tr(cCursor, c11, c11), tr(c11, c11, c11)),
      selection: selectionFor(table(tr(cCursor, c11, c11), tr(c11, c11, c11))),
    });
    const ran = goToNextCell(1)(state, (tr) => (state = state.apply(tr)));
    ist(ran, true);
  });

  it('moves to the previous cell when direction is -1', () => {
    let state: PmEditorState = EditorState.create({
      doc: table(tr(c11, cCursor, c11), tr(c11, c11, c11)),
      selection: selectionFor(table(tr(c11, cCursor, c11), tr(c11, c11, c11))),
    });
    const ran = goToNextCell(-1)(state, (tr) => (state = state.apply(tr)));
    ist(ran, true);
  });

  it('returns false when at the first cell and going backward', () => {
    let state = EditorState.create({
      doc: table(tr(cCursor, c11, c11)),
      selection: selectionFor(table(tr(cCursor, c11, c11))),
    });
    // Position at the very start of first cell
    state = EditorState.create({
      doc: state.doc,
      selection: TextSelection.create(state.doc, 3), // Position at start of first cell content
    });
    const ran = goToNextCell(-1)(state, () => {});
    ist(ran, false);
  });

  it('returns false when not in a table', () => {
    let state = EditorState.create({
      doc: doc(p('foo<cursor>')),
      selection: selectionFor(doc(p('foo<cursor>'))),
    });
    const ran = goToNextCell(1)(state, () => {});
    ist(ran, false);
  });

  it('moves to the next row when at end of row', () => {
    let state: PmEditorState = EditorState.create({
      doc: table(tr(c11, c11, cCursor), tr(c11, c11, c11)),
      selection: selectionFor(table(tr(c11, c11, cCursor), tr(c11, c11, c11))),
    });
    const ran = goToNextCell(1)(state, (tr) => (state = state.apply(tr)));
    ist(ran, true);
  });
});

describe('deleteTable', () => {
  it('deletes the table when cursor is inside', () =>
    test(
      doc(p('before'), table(tr(cCursor, c11)), p('after')),
      deleteTable,
      doc(p('before'), p('after')),
    ));

  it('deletes the table when cursor is in a cell selection', () =>
    test(
      doc(p('before'), table(tr(cAnchor, cHead)), p('after')),
      deleteTable,
      doc(p('before'), p('after')),
    ));

  it('returns false when not in a table', () =>
    test(doc(p('foo<cursor>')), deleteTable, null));

  it('deletes a nested table correctly', () =>
    test(
      doc(table(tr(cCursor, c11)), p('after')),
      deleteTable,
      doc(p('after')),
    ));
});

describe('deleteCellSelection', () => {
  it('clears the content of selected cells', () =>
    test(
      table(tr(cAnchor, cHead, c11)),
      deleteCellSelection,
      table(tr(cEmpty, cEmpty, c11)),
    ));

  it('clears multiple rows of selected cells', () =>
    test(
      table(tr(cAnchor, c11), tr(c11, cHead), tr(c11, c11)),
      deleteCellSelection,
      table(tr(cEmpty, cEmpty), tr(cEmpty, cEmpty), tr(c11, c11)),
    ));

  it('returns false when there is no cell selection', () =>
    test(table(tr(cCursor, c11)), deleteCellSelection, null));

  it('does not delete already empty cells (no docChanged)', () => {
    // Use the helper test tags instead of manual positions
    const docNode = doc(table(tr(td(p('<anchor>')), td(p('<head>')))));
    let state = EditorState.create({
      doc: docNode,
      selection: selectionFor(docNode),
    });
    let dispatched = false;
    const ran = deleteCellSelection(state, (tr) => {
      dispatched = tr.docChanged;
    });
    ist(ran, true);
    ist(dispatched, false);
  });
});

describe('rowIsHeader', () => {
  it('returns true when all cells in the row are header cells', () => {
    const tableNode = table(tr(h11, h11, h11), tr(c11, c11, c11));
    const map = TableMap.get(tableNode);
    ist(rowIsHeader(map, tableNode, 0), true);
    ist(rowIsHeader(map, tableNode, 1), false);
  });

  it('returns false when some cells are not header cells', () => {
    const tableNode = table(tr(h11, c11, h11), tr(c11, c11, c11));
    const map = TableMap.get(tableNode);
    ist(rowIsHeader(map, tableNode, 0), false);
  });

  it('handles tables with only header cells', () => {
    const tableNode = table(tr(h11, h11), tr(h11, h11));
    const map = TableMap.get(tableNode);
    ist(rowIsHeader(map, tableNode, 0), true);
    ist(rowIsHeader(map, tableNode, 1), true);
  });
});

describe('moveTableRow', () => {
  it('moves a row from one position to another', () => {
    let state: PmEditorState = EditorState.create({
      doc: doc(table(tr(td(p('a')), c11), tr(td(p('b')), c11), tr(td(p('c')), c11))),
      selection: TextSelection.create(
        doc(table(tr(td(p('a')), c11), tr(td(p('b')), c11), tr(td(p('c')), c11))),
        5, // Position in first cell
      ),
    });
    const ran = moveTableRow({ from: 0, to: 2, pos: 5 })(state, (tr) => (state = state.apply(tr)));
    ist(ran, true);
  });

  it('returns false when moving to the same position', () => {
    let state: PmEditorState = EditorState.create({
      doc: doc(table(tr(td(p('a')), c11), tr(td(p('b')), c11))),
      selection: TextSelection.create(
        doc(table(tr(td(p('a')), c11), tr(td(p('b')), c11))),
        5,
      ),
    });
    const ran = moveTableRow({ from: 0, to: 0, pos: 5 })(state, (tr) => (state = state.apply(tr)));
    ist(ran, false);
  });

  it('can disable selection after move', () => {
    let state: PmEditorState = EditorState.create({
      doc: doc(table(tr(td(p('a')), c11), tr(td(p('b')), c11))),
      selection: TextSelection.create(
        doc(table(tr(td(p('a')), c11), tr(td(p('b')), c11))),
        5,
      ),
    });
    const ran = moveTableRow({ from: 0, to: 1, select: false, pos: 5 })(state, (tr) => (state = state.apply(tr)));
    ist(ran, true);
  });
});

describe('moveTableColumn', () => {
  it('moves a column from one position to another', () => {
    let state: PmEditorState = EditorState.create({
      doc: doc(table(tr(td(p('a')), td(p('b')), td(p('c'))))),
      selection: TextSelection.create(
        doc(table(tr(td(p('a')), td(p('b')), td(p('c'))))),
        5,
      ),
    });
    const ran = moveTableColumn({ from: 0, to: 2, pos: 5 })(state, (tr) => (state = state.apply(tr)));
    ist(ran, true);
  });

  it('returns false when moving to the same position', () => {
    let state: PmEditorState = EditorState.create({
      doc: doc(table(tr(td(p('a')), td(p('b'))))),
      selection: TextSelection.create(
        doc(table(tr(td(p('a')), td(p('b'))))),
        5,
      ),
    });
    const ran = moveTableColumn({ from: 0, to: 0, pos: 5 })(state, (tr) => (state = state.apply(tr)));
    ist(ran, false);
  });

  it('can disable selection after move', () => {
    let state: PmEditorState = EditorState.create({
      doc: doc(table(tr(td(p('a')), td(p('b'))))),
      selection: TextSelection.create(
        doc(table(tr(td(p('a')), td(p('b'))))),
        5,
      ),
    });
    const ran = moveTableColumn({ from: 0, to: 1, select: false, pos: 5 })(state, (tr) => (state = state.apply(tr)));
    ist(ran, true);
  });
});

describe('selectedRect', () => {
  it('returns the correct rect for a single cell selection', () => {
    const docNode = doc(table(tr(cAnchor, c11, c11), tr(c11, c11, c11)));
    const state = EditorState.create({
      doc: docNode,
      selection: selectionFor(docNode),
    });
    const rect = selectedRect(state);
    ist(rect.left, 0);
    ist(rect.top, 0);
    ist(rect.right, 1);
    ist(rect.bottom, 1);
  });

  it('returns the correct rect for a cell range selection', () => {
    const docNode = doc(table(tr(cAnchor, c11, c11), tr(c11, cHead, c11)));
    const state = EditorState.create({
      doc: docNode,
      selection: selectionFor(docNode),
    });
    const rect = selectedRect(state);
    ist(rect.left, 0);
    ist(rect.top, 0);
    ist(rect.right, 2);
    ist(rect.bottom, 2);
  });
});

describe('addColumn edge cases', () => {
  it('correctly handles adding column to single-cell table', () =>
    test(
      table(tr(cCursor)),
      addColumnBefore,
      table(tr(cEmpty, c11)),
    ));

  it('preserves row spans when adding a column', () =>
    test(
      table(tr(c(1, 2), cCursor), tr(c11)),
      addColumnAfter,
      table(tr(c(1, 2), c11, cEmpty), tr(c11, cEmpty)),
    ));

  it('handles tables with complex rowspan and colspan', () =>
    test(
      table(tr(c(2, 2), cCursor), tr(c11)),
      addColumnAfter,
      table(tr(c(2, 2), c11, cEmpty), tr(c11, cEmpty)),
    ));
});

describe('deleteColumn edge cases', () => {
  it('cannot delete all columns', () =>
    test(
      table(tr(cAnchor, cHead)),
      deleteColumn,
      null,
    ));

  it('handles deleting column with cells that span', () =>
    test(
      table(tr(c(2, 1), cCursor), tr(c11, c11, c11)),
      deleteColumn,
      table(tr(c(2, 1)), tr(c11, c11)),
    ));
});

describe('addRow edge cases', () => {
  it('correctly handles adding row to single-cell table', () =>
    test(
      table(tr(cCursor)),
      addRowBefore,
      table(tr(cEmpty), tr(c11)),
    ));

  it('handles adding row after with colspan', () =>
    test(
      table(tr(c(2, 1)), tr(cCursor, c11)),
      addRowAfter,
      table(tr(c(2, 1)), tr(c11, c11), tr(cEmpty, cEmpty)),
    ));
});

describe('deleteRow edge cases', () => {
  it('cannot delete all rows', () =>
    test(
      table(tr(cAnchor, cHead)),
      deleteRow,
      null,
    ));

  it('handles deleting a row that is spanned by cells from above', () =>
    test(
      table(tr(c11, c(1, 2)), tr(cCursor), tr(c11, c11)),
      deleteRow,
      table(tr(c11, c11), tr(c11, c11)),
    ));
});

describe('mergeCells edge cases', () => {
  it('merges cells with content, concatenating content', () =>
    test(
      table(tr(td(p('hello<anchor>')), td(p('world<head>'))), tr(c11, c11)),
      mergeCells,
      table(tr(td({ colspan: 2 }, p('hello'), p('world')), ), tr(c11, c11)),
    ));

  it('merges 2x2 cells correctly', () =>
    test(
      table(
        tr(cAnchor, c11),
        tr(c11, cHead),
      ),
      mergeCells,
      table(
        tr(td({ rowspan: 2, colspan: 2 }, p('x'), p('x'), p('x'), p('x'))),
        tr(),
      ),
    ));
});

describe('splitCell edge cases', () => {
  it('does not split a cell that does not span', () =>
    test(
      table(tr(cAnchor, c11)),
      splitCell,
      null,
    ));

  it('can split row-spanning header cells', () =>
    test(
      table(tr(th({ rowspan: 2 }, p('foo<anchor>')), c11), tr(c11)),
      splitCell,
      table(tr(th(p('foo')), c11), tr(hEmpty, c11)),
    ));
});

describe('toggleHeader edge cases', () => {
  it('preserves cell attributes when toggling header', () =>
    test(
      doc(table(tr(td({ test: 'custom' }, p('<cursor>x')), c11), tr(c11, c11))),
      toggleHeader('row'),
      doc(table(tr(th({ test: 'custom' }, p('x')), h11), tr(c11, c11))),
    ));

  it('toggles column header on tables with one column', () =>
    test(
      doc(table(tr(cCursor), tr(c11))),
      toggleHeader('column'),
      doc(table(tr(h11), tr(h11))),
    ));

  it('toggles row header on tables with one row', () =>
    test(
      doc(table(tr(cCursor, c11))),
      toggleHeader('row'),
      doc(table(tr(h11, h11))),
    ));
});

describe('setCellAttr edge cases', () => {
  it('sets attribute on all selected cells in cell selection', () => {
    const cAttr = td({ test: 'value' }, p('x'));
    // Note: The selection is from anchor to head, not including middle cells
    test(
      table(tr(cAnchor, cHead, c11), tr(c11, c11, c11)),
      setCellAttr('test', 'value'),
      table(tr(cAttr, cAttr, c11), tr(c11, c11, c11)),
    );
  });

  it('does nothing if attribute already set on all cells', () => {
    test(
      table(tr(td({ test: 'value' }, p('x<anchor>')), td({ test: 'value' }, p('x<head>')))),
      setCellAttr('test', 'value'),
      null,
    );
  });
});

