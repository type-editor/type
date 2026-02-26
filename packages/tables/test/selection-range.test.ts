import { describe, it, expect } from 'vitest';

import { getSelectionRangeInColumn, getSelectionRangeInRow } from '@src/utils/selection-range.js';

import { doc, table, tr, c, c11, td, p } from './build';
import { EditorState, TextSelection } from '@type-editor/state';

/**
 * Creates an EditorState with a TextSelection at the given position.
 * @param d - The document node
 * @param pos - Position for the cursor (defaults to inside first cell)
 */
function createState(d: ReturnType<typeof doc>, pos?: number) {
  const state = EditorState.create({ doc: d as any });
  const resolvedPos = pos ?? 5; // Default to inside first cell
  return state.apply(
    state.tr.setSelection(TextSelection.create(state.doc, resolvedPos))
  );
}

describe('getSelectionRangeInColumn', () => {
  describe('basic functionality', () => {
    it('selects a single column in a simple table', () => {
      const d = doc(
        table(
          tr(c11, c11, c11),
          tr(c11, c11, c11),
          tr(c11, c11, c11)
        )
      );
      const state = createState(d);
      const range = getSelectionRangeInColumn(state.tr, 1);

      expect(range).toBeDefined();
      expect(range?.indexes).toEqual([1]);
    });

    it('selects multiple columns', () => {
      const d = doc(
        table(
          tr(c11, c11, c11),
          tr(c11, c11, c11),
          tr(c11, c11, c11)
        )
      );
      const state = createState(d);
      const range = getSelectionRangeInColumn(state.tr, 0, 2);

      expect(range).toBeDefined();
      expect(range?.indexes).toEqual([0, 1, 2]);
    });

    it('returns undefined for out-of-bounds column index', () => {
      const d = doc(
        table(
          tr(c11, c11, c11),
          tr(c11, c11, c11)
        )
      );
      const state = createState(d);
      const range = getSelectionRangeInColumn(state.tr, 10);

      expect(range).toBeUndefined();
    });

    it('returns undefined for negative column index', () => {
      const d = doc(
        table(
          tr(c11, c11, c11),
          tr(c11, c11, c11)
        )
      );
      const state = createState(d);
      const range = getSelectionRangeInColumn(state.tr, -1);

      expect(range).toBeUndefined();
    });
  });

  describe('merged cells', () => {
    it('expands selection to include cells spanning multiple columns', () => {
      // Table with a cell spanning columns 1-2
      const d = doc(
        table(
          tr(c11, c(2, 1), c11),  // cell at col 1 spans cols 1-2
          tr(c11, c11, c11, c11)
        )
      );
      const state = createState(d);
      const range = getSelectionRangeInColumn(state.tr, 1);

      expect(range).toBeDefined();
      // Should include columns 1 and 2 because of the merged cell
      expect(range?.indexes).toEqual([1, 2]);
    });

    it('handles cells spanning into selection from before', () => {
      // Table with a cell at col 0 spanning into col 1
      const d = doc(
        table(
          tr(c(2, 1), c11, c11),  // cell at col 0 spans cols 0-1
          tr(c11, c11, c11, c11)
        )
      );
      const state = createState(d);
      const range = getSelectionRangeInColumn(state.tr, 1);

      expect(range).toBeDefined();
      // Should include column 0 because a cell from there spans into col 1
      expect(range?.indexes).toEqual([0, 1]);
    });
  });

  describe('edge cases', () => {
    it('handles startColIndex > endColIndex by normalizing indices', () => {
      const d = doc(
        table(
          tr(c11, c11, c11),
          tr(c11, c11, c11)
        )
      );
      const state = createState(d);
      // Reversed indices - should be normalized internally
      const range = getSelectionRangeInColumn(state.tr, 2, 0);

      expect(range).toBeDefined();
      // Should include all columns from 0 to 2
      expect(range?.indexes).toEqual([0, 1, 2]);
    });
  });
});

describe('getSelectionRangeInRow', () => {
  describe('basic functionality', () => {
    it('selects a single row in a simple table', () => {
      const d = doc(
        table(
          tr(c11, c11, c11),
          tr(c11, c11, c11),
          tr(c11, c11, c11)
        )
      );
      const state = createState(d);
      const range = getSelectionRangeInRow(state.tr, 1);

      expect(range).toBeDefined();
      expect(range?.indexes).toEqual([1]);
    });

    it('selects multiple rows', () => {
      const d = doc(
        table(
          tr(c11, c11, c11),
          tr(c11, c11, c11),
          tr(c11, c11, c11)
        )
      );
      const state = createState(d);
      const range = getSelectionRangeInRow(state.tr, 0, 2);

      expect(range).toBeDefined();
      expect(range?.indexes).toEqual([0, 1, 2]);
    });

    it('returns undefined for out-of-bounds row index', () => {
      const d = doc(
        table(
          tr(c11, c11, c11),
          tr(c11, c11, c11)
        )
      );
      const state = createState(d);
      const range = getSelectionRangeInRow(state.tr, 10);

      expect(range).toBeUndefined();
    });

    it('returns undefined for negative row index', () => {
      const d = doc(
        table(
          tr(c11, c11, c11),
          tr(c11, c11, c11)
        )
      );
      const state = createState(d);
      const range = getSelectionRangeInRow(state.tr, -1);

      expect(range).toBeUndefined();
    });
  });

  describe('merged cells', () => {
    it('expands selection to include cells spanning multiple rows', () => {
      // Table with a cell spanning rows 1-2
      const d = doc(
        table(
          tr(c11, c11, c11),
          tr(c11, c(1, 2), c11),  // cell at row 1 spans rows 1-2
          tr(c11, c11)
        )
      );
      const state = createState(d);
      const range = getSelectionRangeInRow(state.tr, 1);

      expect(range).toBeDefined();
      // Should include rows 1 and 2 because of the merged cell
      expect(range?.indexes).toEqual([1, 2]);
    });

    it('handles cells spanning into selection from before', () => {
      // Table with a cell at row 0 spanning into row 1
      const d = doc(
        table(
          tr(c11, c(1, 2), c11),  // cell at row 0 spans rows 0-1
          tr(c11, c11),
          tr(c11, c11, c11)
        )
      );
      const state = createState(d);
      const range = getSelectionRangeInRow(state.tr, 1);

      expect(range).toBeDefined();
      // Should include row 0 because a cell from there spans into row 1
      expect(range?.indexes).toEqual([0, 1]);
    });
  });

  describe('edge cases', () => {
    it('handles startRowIndex > endRowIndex by normalizing indices', () => {
      const d = doc(
        table(
          tr(c11, c11, c11),
          tr(c11, c11, c11),
          tr(c11, c11, c11)
        )
      );
      const state = createState(d);
      // Reversed indices - should be normalized internally
      const range = getSelectionRangeInRow(state.tr, 2, 0);

      expect(range).toBeDefined();
      // Should include all rows from 0 to 2
      expect(range?.indexes).toEqual([0, 1, 2]);
    });
  });
});

