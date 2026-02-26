import { describe, it, expect } from 'vitest';

import {
  addColSpan,
  removeColSpan,
  cellAround,
  cellNear,
  findCell,
  colCount,
  nextCell,
  isInTable,
  pointsAtCell,
  moveCellForward,
  columnIsHeader,
  selectionCell,
  TableMap,
} from '../src';

import { doc, table, tr, c, c11, h, h11, p, td } from './build';
import { EditorState, NodeSelection, TextSelection } from '@type-editor/state';

describe('util functions', () => {
  describe('addColSpan', () => {
    it('increases colspan by default amount', () => {
      const attrs = { colspan: 1, rowspan: 1, colwidth: null };
      const result = addColSpan(attrs, 0);
      expect(result.colspan).toBe(2);
    });

    it('increases colspan by specified amount', () => {
      const attrs = { colspan: 1, rowspan: 1, colwidth: null };
      const result = addColSpan(attrs, 0, 3);
      expect(result.colspan).toBe(4);
    });

    it('handles colwidth array correctly', () => {
      const attrs = { colspan: 2, rowspan: 1, colwidth: [100, 200] };
      const result = addColSpan(attrs, 1, 1);
      expect(result.colspan).toBe(3);
      expect(result.colwidth).toEqual([100, 0, 200]);
    });

    it('inserts zeros for new columns in colwidth', () => {
      const attrs = { colspan: 1, rowspan: 1, colwidth: [100] };
      const result = addColSpan(attrs, 1, 2);
      expect(result.colspan).toBe(3);
      expect(result.colwidth).toEqual([100, 0, 0]);
    });

    it('preserves other attributes', () => {
      const attrs = { colspan: 1, rowspan: 2, colwidth: null };
      const result = addColSpan(attrs, 0, 1);
      expect(result.rowspan).toBe(2);
    });
  });

  describe('removeColSpan', () => {
    it('decreases colspan by default amount', () => {
      const attrs = { colspan: 3, rowspan: 1, colwidth: null };
      const result = removeColSpan(attrs, 0);
      expect(result.colspan).toBe(2);
    });

    it('decreases colspan by specified amount', () => {
      const attrs = { colspan: 5, rowspan: 1, colwidth: null };
      const result = removeColSpan(attrs, 0, 3);
      expect(result.colspan).toBe(2);
    });

    it('removes entries from colwidth array', () => {
      const attrs = { colspan: 3, rowspan: 1, colwidth: [100, 200, 300] };
      const result = removeColSpan(attrs, 1, 1);
      expect(result.colspan).toBe(2);
      expect(result.colwidth).toEqual([100, 300]);
    });

    it('sets colwidth to null when all zeros', () => {
      const attrs = { colspan: 2, rowspan: 1, colwidth: [0, 0] };
      const result = removeColSpan(attrs, 0, 1);
      expect(result.colwidth).toBeNull();
    });

    it('preserves colwidth when some values remain', () => {
      const attrs = { colspan: 3, rowspan: 1, colwidth: [100, 0, 0] };
      const result = removeColSpan(attrs, 1, 1);
      expect(result.colwidth).toEqual([100, 0]);
    });

    it('preserves other attributes', () => {
      const attrs = { colspan: 2, rowspan: 3, colwidth: null };
      const result = removeColSpan(attrs, 0, 1);
      expect(result.rowspan).toBe(3);
    });
  });

  describe('cellAround', () => {
    it('finds cell containing position', () => {
      const d = doc(table(tr(td(p('hello')), c11)));
      const $pos = d.resolve(5); // Inside first cell
      const cell = cellAround($pos);
      expect(cell).not.toBeNull();
      expect(cell!.pos).toBe(2);
    });

    it('returns null when not in a table', () => {
      const d = doc(p('hello'));
      const $pos = d.resolve(3);
      const cell = cellAround($pos);
      expect(cell).toBeNull();
    });

    it('finds cell for position at cell boundary', () => {
      const d = doc(table(tr(c11, c11)));
      const $pos = d.resolve(3); // Start of first cell content
      const cell = cellAround($pos);
      expect(cell).not.toBeNull();
    });
  });

  describe('cellNear', () => {
    it('finds cell looking forward', () => {
      const d = doc(table(tr(c11, c11)));
      const $pos = d.resolve(2); // At cell position
      const cell = cellNear($pos);
      expect(cell).toBeDefined();
    });

    it('returns undefined when position is inside paragraph', () => {
      const d = doc(table(tr(c11, c11)));
      // Position 4 is inside the paragraph inside the first cell
      const $pos = d.resolve(4);
      // cellNear looks for cells in nodeAfter/nodeBefore chain
      // When inside paragraph, these are paragraph children, not cells
      const cell = cellNear($pos);
      // cellNear may not find a cell when inside paragraph content
      // This tests the actual behavior
      expect(cell).toBeUndefined();
    });

    it('returns undefined when no cell nearby', () => {
      const d = doc(p('hello'));
      const $pos = d.resolve(3);
      const cell = cellNear($pos);
      // In a paragraph, there's no cell nearby
      expect(cell).toBeUndefined();
    });
  });

  describe('findCell', () => {
    it('returns rect for cell at position', () => {
      const d = doc(table(tr(c11, c11, c11), tr(c11, c11, c11)));
      const $pos = d.resolve(3); // Inside first cell
      const cell = cellAround($pos);
      const rect = findCell(cell!);

      expect(rect.left).toBe(0);
      expect(rect.top).toBe(0);
      expect(rect.right).toBe(1);
      expect(rect.bottom).toBe(1);
    });

    it('handles spanning cells', () => {
      const d = doc(table(tr(c(2, 2), c11), tr(c11)));
      const $pos = d.resolve(3); // Inside spanning cell
      const cell = cellAround($pos);
      const rect = findCell(cell!);

      expect(rect.right - rect.left).toBe(2);
      expect(rect.bottom - rect.top).toBe(2);
    });
  });

  describe('colCount', () => {
    it('returns column index for cell', () => {
      const d = doc(table(tr(c11, c11, c11)));

      // First cell
      const $pos1 = cellAround(d.resolve(3))!;
      expect(colCount($pos1)).toBe(0);

      // Second cell
      const $pos2 = cellAround(d.resolve(8))!;
      expect(colCount($pos2)).toBe(1);
    });

    it('returns first column for spanning cell', () => {
      const d = doc(table(tr(c11, c(2, 1))));
      const $pos = cellAround(d.resolve(8))!; // Inside spanning cell
      expect(colCount($pos)).toBe(1);
    });
  });

  describe('nextCell', () => {
    it('finds next cell horizontally', () => {
      const d = doc(table(tr(c11, c11, c11)));
      const $pos = cellAround(d.resolve(3))!;

      const next = nextCell($pos, 'horiz', 1);
      expect(next).not.toBeNull();
    });

    it('finds previous cell horizontally', () => {
      const d = doc(table(tr(c11, c11, c11)));
      const $pos = cellAround(d.resolve(8))!;

      const prev = nextCell($pos, 'horiz', -1);
      expect(prev).not.toBeNull();
    });

    it('finds next cell vertically', () => {
      const d = doc(table(tr(c11, c11), tr(c11, c11)));
      const $pos = cellAround(d.resolve(3))!;

      const next = nextCell($pos, 'vert', 1);
      expect(next).not.toBeNull();
    });

    it('returns null at table boundaries', () => {
      const d = doc(table(tr(c11, c11)));
      const $pos = cellAround(d.resolve(3))!; // First cell

      // No cell to the left
      expect(nextCell($pos, 'horiz', -1)).toBeNull();
      // No cell above
      expect(nextCell($pos, 'vert', -1)).toBeNull();
    });
  });

  describe('isInTable', () => {
    it('returns true when cursor is in table', () => {
      const d = doc(table(tr(c11, c11)));
      const state = EditorState.create({
        doc: d,
        selection: TextSelection.create(d, 3),
      });

      expect(isInTable(state)).toBe(true);
    });

    it('returns false when cursor is outside table', () => {
      const d = doc(p('hello'), table(tr(c11)));
      const state = EditorState.create({
        doc: d,
        selection: TextSelection.create(d, 3),
      });

      expect(isInTable(state)).toBe(false);
    });

    it('returns true for deep nesting in table', () => {
      const d = doc(table(tr(td(p('deeply nested')))));
      const state = EditorState.create({
        doc: d,
        selection: TextSelection.create(d, 8),
      });

      expect(isInTable(state)).toBe(true);
    });
  });

  describe('pointsAtCell', () => {
    it('returns true when position points at a cell', () => {
      const d = doc(table(tr(c11, c11)));
      const $pos = d.resolve(2); // Position before first cell

      expect(pointsAtCell($pos)).toBe(true);
    });

    it('returns false when position is inside cell content', () => {
      const d = doc(table(tr(c11, c11)));
      const $pos = d.resolve(3); // Inside first cell

      expect(pointsAtCell($pos)).toBe(false);
    });

    it('returns false when not in a row', () => {
      const d = doc(p('hello'));
      const $pos = d.resolve(3);

      expect(pointsAtCell($pos)).toBe(false);
    });
  });

  describe('moveCellForward', () => {
    it('moves to position after cell', () => {
      const d = doc(table(tr(c11, c11)));
      const $pos = d.resolve(2); // Position before first cell

      const moved = moveCellForward($pos);
      // Should be after the cell node
      expect(moved.pos).toBeGreaterThan($pos.pos);
    });
  });

  describe('columnIsHeader', () => {
    it('returns true when column is all headers', () => {
      const t = table(tr(h11, c11), tr(h11, c11));
      const map = TableMap.get(t);

      expect(columnIsHeader(map, t, 0)).toBe(true);
      expect(columnIsHeader(map, t, 1)).toBe(false);
    });

    it('returns false when column has mixed cells', () => {
      const t = table(tr(h11, c11), tr(c11, c11));
      const map = TableMap.get(t);

      expect(columnIsHeader(map, t, 0)).toBe(false);
    });

    it('returns true for table with only header column', () => {
      const t = table(tr(h11), tr(h11));
      const map = TableMap.get(t);

      expect(columnIsHeader(map, t, 0)).toBe(true);
    });

    it('handles header cells with rowspan correctly', () => {
      // Header cell spans 2 rows in column 0
      const t = table(tr(h(1, 2), c11), tr(c11));
      const map = TableMap.get(t);

      expect(columnIsHeader(map, t, 0)).toBe(true);
      expect(columnIsHeader(map, t, 1)).toBe(false);
    });

    it('handles header cells with colspan correctly', () => {
      // Header cell spans 2 columns
      const t = table(tr(h(2, 1)), tr(h11, c11));
      const map = TableMap.get(t);

      expect(columnIsHeader(map, t, 0)).toBe(true);
      expect(columnIsHeader(map, t, 1)).toBe(false);
    });
  });

  describe('selectionCell', () => {
    it('handles node selection of header cell', () => {
      const d = doc(table(tr(h11, c11)));
      // Position 2 points at the first cell (header)
      const state = EditorState.create({
        doc: d,
        selection: NodeSelection.create(d, 2),
      });

      const $cell = selectionCell(state);
      expect($cell).not.toBeNull();
      expect($cell.nodeAfter?.type.name).toBe('table_header');
    });

    it('handles node selection of regular cell', () => {
      const d = doc(table(tr(h11, c11)));
      // Find position of second cell
      const state = EditorState.create({
        doc: d,
        selection: NodeSelection.create(d, 7),
      });

      const $cell = selectionCell(state);
      expect($cell).not.toBeNull();
      expect($cell.nodeAfter?.type.name).toBe('table_cell');
    });
  });
});

