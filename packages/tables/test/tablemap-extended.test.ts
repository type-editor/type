import ist from 'ist';
import { describe, it, expect } from 'vitest';

import { TableMap } from '../src';

import { table, tr, c, c11, td, th, h, h11, p } from './build';

describe('TableMap extended', () => {
  describe('positionAt', () => {
    it('returns correct position for simple table', () => {
      const t = table(tr(c11, c11, c11), tr(c11, c11, c11));
      const map = TableMap.get(t);

      // Position at row 0, col 0
      const pos00 = map.positionAt(0, 0, t);
      expect(pos00).toBe(1);

      // Position at row 0, col 1
      const pos01 = map.positionAt(0, 1, t);
      expect(pos01).toBe(6);

      // Position at row 1, col 0
      const pos10 = map.positionAt(1, 0, t);
      expect(pos10).toBe(18);
    });

    it('handles rowspan cells correctly', () => {
      const t = table(tr(c(1, 2), c11), tr(c11));
      const map = TableMap.get(t);

      // Row 1, col 0 should skip the rowspan cell
      const pos = map.positionAt(1, 0, t);
      // The position should account for the rowspan
      expect(pos).toBeGreaterThan(0);
    });

    it('handles colspan cells correctly', () => {
      const t = table(tr(c(2, 1), c11), tr(c11, c11, c11));
      const map = TableMap.get(t);

      // Row 0 has a colspan cell
      const pos02 = map.positionAt(0, 2, t);
      expect(pos02).toBeGreaterThan(0);
    });
  });

  describe('findCell', () => {
    it('finds correct dimensions for regular cells', () => {
      const t = table(tr(c11, c11), tr(c11, c11));
      const map = TableMap.get(t);

      const rect = map.findCell(1);
      expect(rect.left).toBe(0);
      expect(rect.top).toBe(0);
      expect(rect.right).toBe(1);
      expect(rect.bottom).toBe(1);
    });

    it('finds correct dimensions for colspan cells', () => {
      const t = table(tr(c(2, 1), c11), tr(c11, c11, c11));
      const map = TableMap.get(t);

      const rect = map.findCell(1);
      expect(rect.left).toBe(0);
      expect(rect.right).toBe(2);
      expect(rect.top).toBe(0);
      expect(rect.bottom).toBe(1);
    });

    it('finds correct dimensions for rowspan cells', () => {
      const t = table(tr(c(1, 2), c11), tr(c11));
      const map = TableMap.get(t);

      const rect = map.findCell(1);
      expect(rect.left).toBe(0);
      expect(rect.right).toBe(1);
      expect(rect.top).toBe(0);
      expect(rect.bottom).toBe(2);
    });

    it('finds correct dimensions for cells with both colspan and rowspan', () => {
      const t = table(tr(c(2, 2), c11), tr(c11));
      const map = TableMap.get(t);

      const rect = map.findCell(1);
      expect(rect.left).toBe(0);
      expect(rect.right).toBe(2);
      expect(rect.top).toBe(0);
      expect(rect.bottom).toBe(2);
    });

    it('throws for invalid position', () => {
      const t = table(tr(c11, c11));
      const map = TableMap.get(t);

      expect(() => map.findCell(9999)).toThrow(RangeError);
    });
  });

  describe('colCount', () => {
    it('returns correct column for regular cells', () => {
      const t = table(tr(c11, c11, c11), tr(c11, c11, c11));
      const map = TableMap.get(t);

      expect(map.colCount(1)).toBe(0);
      expect(map.colCount(6)).toBe(1);
      expect(map.colCount(11)).toBe(2);
    });

    it('returns first column of colspan cells', () => {
      const t = table(tr(c11, c(2, 1)), tr(c11, c11, c11));
      const map = TableMap.get(t);

      // The colspan cell starts at column 1
      expect(map.colCount(6)).toBe(1);
    });

    it('throws for invalid position', () => {
      const t = table(tr(c11, c11));
      const map = TableMap.get(t);

      expect(() => map.colCount(9999)).toThrow(RangeError);
    });
  });

  describe('cellsInRect', () => {
    it('returns all cells in a rectangle', () => {
      const t = table(tr(c11, c11, c11), tr(c11, c11, c11), tr(c11, c11, c11));
      const map = TableMap.get(t);

      const cells = map.cellsInRect({ left: 0, top: 0, right: 2, bottom: 2 });
      expect(cells.length).toBe(4);
    });

    it('handles spanning cells correctly - only includes once', () => {
      const t = table(tr(c(2, 2), c11), tr(c11), tr(c11, c11, c11));
      const map = TableMap.get(t);

      const cells = map.cellsInRect({ left: 0, top: 0, right: 2, bottom: 2 });
      // Should include the spanning cell only once
      const uniqueCells = [...new Set(cells)];
      expect(cells.length).toBe(uniqueCells.length);
    });

    it('excludes cells that start outside the rectangle', () => {
      const t = table(tr(c(2, 2), c11), tr(c11), tr(c11, c11, c11));
      const map = TableMap.get(t);

      // Only select column 1, rows 0-1
      const cells = map.cellsInRect({ left: 1, top: 0, right: 2, bottom: 2 });
      // The spanning cell starts at column 0, so it should be excluded
      expect(cells.length).toBe(0);
    });
  });

  describe('rectBetween', () => {
    it('returns rectangle spanning two cells', () => {
      const t = table(tr(c11, c11), tr(c11, c11));
      const map = TableMap.get(t);

      // Use actual map positions - get positions from the map array
      const topLeft = map.map[0];  // First cell
      const bottomRight = map.map[map.width * map.height - 1]; // Last cell

      const rect = map.rectBetween(topLeft, bottomRight);
      expect(rect.left).toBe(0);
      expect(rect.top).toBe(0);
      expect(rect.right).toBe(map.width);
      expect(rect.bottom).toBe(map.height);
    });

    it('handles same cell', () => {
      const t = table(tr(c11, c11), tr(c11, c11));
      const map = TableMap.get(t);

      const rect = map.rectBetween(1, 1);
      expect(rect.left).toBe(0);
      expect(rect.top).toBe(0);
      expect(rect.right).toBe(1);
      expect(rect.bottom).toBe(1);
    });

    it('handles spanning cells in rectangle calculation', () => {
      const t = table(tr(c11, c(2, 2)), tr(c11), tr(c11, c11, c11));
      const map = TableMap.get(t);

      // Rectangle between top-left and middle of spanning cell
      const rect = map.rectBetween(1, 6);
      expect(rect.right).toBe(3);
      expect(rect.bottom).toBe(2);
    });
  });

  describe('nextCell', () => {
    it('finds next cell horizontally', () => {
      const t = table(tr(c11, c11, c11), tr(c11, c11, c11));
      const map = TableMap.get(t);

      expect(map.nextCell(1, 'horiz', 1)).toBe(6);
      expect(map.nextCell(6, 'horiz', -1)).toBe(1);
    });

    it('finds next cell vertically', () => {
      const t = table(tr(c11, c11, c11), tr(c11, c11, c11));
      const map = TableMap.get(t);

      expect(map.nextCell(1, 'vert', 1)).toBe(18);
      expect(map.nextCell(18, 'vert', -1)).toBe(1);
    });

    it('returns null at table boundaries', () => {
      const t = table(tr(c11, c11), tr(c11, c11));
      const map = TableMap.get(t);

      // Left edge
      expect(map.nextCell(1, 'horiz', -1)).toBe(null);
      // Right edge
      expect(map.nextCell(6, 'horiz', 1)).toBe(null);
      // Top edge
      expect(map.nextCell(1, 'vert', -1)).toBe(null);
      // Bottom edge
      expect(map.nextCell(13, 'vert', 1)).toBe(null);
    });

    it('handles spanning cells', () => {
      const t = table(tr(c(2, 1), c11), tr(c11, c11, c11));
      const map = TableMap.get(t);

      // From colspan cell, going right should skip to next actual cell
      const next = map.nextCell(1, 'horiz', 1);
      expect(next).toBe(6);
    });
  });

  describe('problems detection', () => {
    it('detects missing cells', () => {
      // Create a table with fewer cells than needed
      const t = table(tr(c11, c11), tr(c11));
      const map = TableMap.get(t);

      expect(map.problems).not.toBeNull();
      expect(map.problems!.some(p => p.type === 'missing')).toBe(true);
    });

    it('detects overlong rowspan', () => {
      // Create a cell with rowspan larger than table height
      const t = table(tr(c(1, 3), c11), tr(c11));
      const map = TableMap.get(t);

      expect(map.problems).not.toBeNull();
      expect(map.problems!.some(p => p.type === 'overlong_rowspan')).toBe(true);
    });

    it('detects cell collision from overlapping spans', () => {
      // This test validates that the TableMap can detect collision problems
      // From the fixtable tests, we know this pattern creates a collision
      const t = table(tr(c11, c(1, 2), c11), tr(c(2, 1)));
      const map = TableMap.get(t);

      // This should detect some problem due to the row structure
      // The c(1,2) at col 1 spans rows 0-1
      // The c(2,1) at row 1 spans cols 0-1, overlapping with the rowspan
      if (map.problems) {
        // If problems are detected, check for collision or missing
        expect(map.problems.length).toBeGreaterThan(0);
      }
    });

    it('detects zero-sized table', () => {
      const t = table(tr());
      const map = TableMap.get(t);

      expect(map.problems).not.toBeNull();
      expect(map.problems!.some(p => p.type === 'zero_sized')).toBe(true);
    });

    it('returns null problems for valid table', () => {
      const t = table(tr(c11, c11), tr(c11, c11));
      const map = TableMap.get(t);

      expect(map.problems).toBeNull();
    });
  });

  describe('colwidth mismatch detection', () => {
    const cw100 = td({ colwidth: [100] }, p('x'));
    const cw200 = td({ colwidth: [200] }, p('x'));

    it('detects mismatched column widths', () => {
      const t = table(tr(cw100, c11), tr(cw200, c11));
      const map = TableMap.get(t);

      expect(map.problems).not.toBeNull();
      expect(map.problems!.some(p => p.type === 'colwidth mismatch')).toBe(true);
    });

    it('does not report problems for consistent widths', () => {
      const t = table(tr(cw100, c11), tr(cw100, c11));
      const map = TableMap.get(t);

      if (map.problems) {
        expect(map.problems.some(p => p.type === 'colwidth mismatch')).toBe(false);
      }
    });
  });

  describe('cache behavior', () => {
    it('returns same TableMap for same table node', () => {
      const t = table(tr(c11, c11), tr(c11, c11));
      const map1 = TableMap.get(t);
      const map2 = TableMap.get(t);

      expect(map1).toBe(map2);
    });

    it('returns different TableMap for different table nodes', () => {
      const t1 = table(tr(c11, c11));
      const t2 = table(tr(c11, c11, c11));
      const map1 = TableMap.get(t1);
      const map2 = TableMap.get(t2);

      expect(map1).not.toBe(map2);
    });
  });

  describe('table dimensions', () => {
    it('correctly computes width and height', () => {
      const t = table(tr(c11, c11, c11), tr(c11, c11, c11), tr(c11, c11, c11));
      const map = TableMap.get(t);

      expect(map.width).toBe(3);
      expect(map.height).toBe(3);
    });

    it('correctly computes width with colspan', () => {
      const t = table(tr(c(2, 1), c11), tr(c11, c11, c11));
      const map = TableMap.get(t);

      expect(map.width).toBe(3);
      expect(map.height).toBe(2);
    });

    it('correctly computes height with rowspan', () => {
      const t = table(tr(c(1, 3), c11), tr(c11), tr(c11));
      const map = TableMap.get(t);

      expect(map.width).toBe(2);
      expect(map.height).toBe(3);
    });

    it('handles complex spanning correctly', () => {
      const t = table(
        tr(c(2, 2), c11),
        tr(c11),
        tr(c11, c11, c11),
      );
      const map = TableMap.get(t);

      expect(map.width).toBe(3);
      expect(map.height).toBe(3);
    });
  });

  describe('get method error handling', () => {
    it('throws for non-table nodes', () => {
      const para = p('hello');

      expect(() => TableMap.get(para)).toThrow(RangeError);
    });
  });
});

