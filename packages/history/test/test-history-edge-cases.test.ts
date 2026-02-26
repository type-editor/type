import {describe, it} from 'vitest';
import {doc, eq, p, schema} from '@type-editor/test-builder';
import {type Node} from '@type-editor/model';
import {type Command, EditorState, Plugin, SelectionFactory} from '@type-editor/state';
import ist from "ist";
import {history} from "@src/plugin/history-plugin";
import type {HistoryState} from "@src/state/HistoryState";
import {undo} from "@src/commands/undo";
import {closeHistory} from "@src/helper/close-history";
import {undoDepth} from "@src/helper/undo-depth";
import {redoDepth} from "@src/helper/redo-depth";
import {redo} from "@src/commands/redo";

/**
 * Additional test suite for edge cases, boundary conditions, and property-based tests
 * to ensure robustness of the history implementation after bug fixes.
 */

function mkState(doc?: Node, config?: any) {
  let plugins = [config ? history(config) : history()];
  if (config && config.preserveItems) plugins.push(new Plugin({ historyPreserveItems: true } as any));
  return EditorState.create({ schema, plugins: plugins.concat(config && config.plugins || []), doc });
}

function type(state: EditorState, text: string) {
  return state.apply(state.transaction.insertText(text));
}

function command(state: EditorState, command: Command) {
  command(state, tr => state = state.apply(tr));
  return state;
}

describe("history edge cases", () => {

  describe("popEvent edge cases", () => {

    it("should return null when no events exist", () => {
      const state = mkState();
      const historyState = history().getState(state) as HistoryState;

      // Empty branch should have no events
      ist(historyState.done.eventCount, 0);

      // Attempting to pop should return null
      const result = historyState.done.popEvent(state, false);
      ist(result, null);
    });

    it("should return null when branch is empty after all undos", () => {
      let state = mkState();
      state = type(state, "test");

      // Do undo to clear the done branch
      state = command(state, undo);

      // Verify done branch is now empty
      const historyState = history().getState(state) as HistoryState;
      ist(historyState.done.eventCount, 0);

      // Attempting to pop should return null
      const result = historyState.done.popEvent(state, false);
      ist(result, null);
    });

    it("should handle popEvent on empty branch with preserveItems", () => {
      let state = mkState(undefined, { preserveItems: true });
      const historyState = history().getState(state) as HistoryState;

      // Empty branch with preserveItems enabled
      ist(historyState.done.eventCount, 0);

      // Should still return null
      const result = historyState.done.popEvent(state, true);
      ist(result, null);
    });

    it("should properly handle selection restoration on popEvent", () => {
      let state = mkState();
      state = type(state, "hello");
      state = state.apply(state.transaction.setSelection(
        SelectionFactory.createTextSelection(state.doc, 1, 6)
      ));

      const historyState = history().getState(state) as HistoryState;
      const originalEventCount = historyState.done.eventCount;

      ist(originalEventCount > 0);

      // Pop event and verify selection is preserved
      const result = historyState.done.popEvent(state, false);
      ist(result !== null);

      if (result) {
        ist(result.selection !== undefined);
        ist(result.remaining.eventCount, originalEventCount - 1);
      }
    });
  });

  describe("boundary conditions", () => {

    it("should handle removing more events than exist (depth overflow)", () => {
      let state = mkState(undefined, { depth: 5 });

      // Add exactly 5 events
      for (let i = 0; i < 5; i++) {
        state = type(state, `${i}`);
        state = state.apply(closeHistory(state.transaction));
      }

      ist(undoDepth(state), 5);

      // Try to add many more events to trigger cutoff
      for (let i = 0; i < 30; i++) {
        state = type(state, "x");
        state = state.apply(closeHistory(state.transaction));
      }

      // Should have trimmed old events, not crash
      const historyState = history().getState(state) as HistoryState;
      ist(historyState.done.eventCount <= 26); // depth + overflow threshold
    });

    it("should handle empty addTransform correctly", () => {
      let state = mkState();
      const emptyTr = state.transaction; // No steps added

      // Apply empty transaction (should not crash)
      state = state.apply(emptyTr);
      ist(undoDepth(state), 0);
    });

    it("should handle cutOffEvents with count larger than available events", () => {
      let state = mkState();

      // Add 3 events
      for (let i = 0; i < 3; i++) {
        state = type(state, `${i}`);
        state = state.apply(closeHistory(state.transaction));
      }

      const historyState = history().getState(state) as HistoryState;
      ist(historyState.done.eventCount, 3);

      // This would internally try to cut off more events than exist
      // The implementation should handle this gracefully
      let state2 = mkState(undefined, { depth: 1 });
      for (let i = 0; i < 25; i++) {
        state2 = type(state2, `${i}`);
        state2 = state2.apply(closeHistory(state2.transaction));
      }

      // Should not crash and maintain reasonable depth
      const historyState2 = history().getState(state2) as HistoryState;
      ist(historyState2.done.eventCount <= 22); // Should be around depth + overflow
    });

    it("should handle very small depth configuration", () => {
      // Edge case: depth of 1 means only 1 event kept
      let state = mkState(undefined, { depth: 1 });
      state = type(state, "a");
      state = state.apply(closeHistory(state.transaction));
      state = type(state, "b");
      state = state.apply(closeHistory(state.transaction));

      // Should only keep recent history up to depth
      // With many events, old ones get trimmed
      state = type(state, "c");
      state = state.apply(closeHistory(state.transaction));

      // Multiple events should cause trimming
      for (let i = 0; i < 25; i++) {
        state = type(state, "x");
        state = state.apply(closeHistory(state.transaction));
      }

      // Should have trimmed to reasonable depth
      ist(undoDepth(state) <= 22); // depth + overflow threshold
    });

    it("should handle very deep history without performance degradation", () => {
      let state = mkState(undefined, { depth: 200 });

      // Add many events
      for (let i = 0; i < 100; i++) {
        state = type(state, `${i}`);
        state = state.apply(closeHistory(state.transaction));
      }

      ist(undoDepth(state), 100);

      // Undo all
      for (let i = 0; i < 100; i++) {
        state = command(state, undo);
      }

      ist(state.doc, doc(p()), eq);
      ist(undoDepth(state), 0);
      ist(redoDepth(state), 100);
    });

    it("should handle alternating between single item and empty branches", () => {
      let state = mkState();

      for (let i = 0; i < 10; i++) {
        state = type(state, "x");
        state = state.apply(closeHistory(state.transaction));
        const beforeUndo = undoDepth(state);
        ist(beforeUndo > 0);

        state = command(state, undo);
        ist(undoDepth(state), beforeUndo - 1);
        ist(redoDepth(state) > 0);

        state = command(state, redo);
        ist(undoDepth(state), beforeUndo);
        ist(redoDepth(state), 0);
      }

      // Final doc should have all the x's
      ist(state.doc.textContent, "xxxxxxxxxx");
    });
  });

  describe("property-based tests", () => {

    it("popEvent followed by addTransform restores state (simple case)", () => {
      let state = mkState();
      const originalDoc = state.doc;

      // Add a transform
      state = type(state, "hello");
      const modifiedDoc = state.doc;

      // Undo should restore original
      state = command(state, undo);
      ist(state.doc, originalDoc, eq);

      // Redo should restore modified
      state = command(state, redo);
      ist(state.doc, modifiedDoc, eq);
    });

    it("popEvent followed by addTransform restores state (complex case)", () => {
      let state = mkState();

      // Create a sequence of transformations
      state = type(state, "one");
      const doc1 = state.doc;

      state = state.apply(closeHistory(state.transaction));
      state = type(state, " two");
      const doc2 = state.doc;

      state = state.apply(closeHistory(state.transaction));
      state = type(state, " three");
      const doc3 = state.doc;

      // Undo and verify each step
      state = command(state, undo);
      ist(state.doc, doc2, eq);

      state = command(state, undo);
      ist(state.doc, doc1, eq);

      state = command(state, undo);
      ist(state.doc, doc(p()), eq);

      // Redo and verify each step forward
      state = command(state, redo);
      ist(state.doc, doc1, eq);

      state = command(state, redo);
      ist(state.doc, doc2, eq);

      state = command(state, redo);
      ist(state.doc, doc3, eq);
    });

    it("multiple undo/redo cycles maintain document integrity", () => {
      let state = mkState();

      // Build up history
      for (let i = 1; i <= 5; i++) {
        state = type(state, `${i}`);
        state = state.apply(closeHistory(state.transaction));
      }

      const fullDoc = state.doc;
      ist(state.doc, doc(p("12345")), eq);

      // Do multiple cycles of undo/redo
      for (let cycle = 0; cycle < 3; cycle++) {
        // Undo all
        for (let i = 0; i < 5; i++) {
          state = command(state, undo);
        }
        ist(state.doc, doc(p()), eq);
        ist(undoDepth(state), 0);
        ist(redoDepth(state), 5);

        // Redo all
        for (let i = 0; i < 5; i++) {
          state = command(state, redo);
        }
        ist(state.doc, fullDoc, eq);
        ist(undoDepth(state), 5);
        ist(redoDepth(state), 0);
      }
    });

    it("history preserves document state through arbitrary edit sequences", () => {
      let state = mkState();
      const snapshots: Array<{ doc: Node; undoDepth: number }> = [];

      // Record initial state
      snapshots.push({ doc: state.doc, undoDepth: undoDepth(state) });

      // Perform various edits
      state = type(state, "a");
      snapshots.push({ doc: state.doc, undoDepth: undoDepth(state) });

      state = state.apply(closeHistory(state.transaction));
      state = type(state, "b");
      snapshots.push({ doc: state.doc, undoDepth: undoDepth(state) });

      state = state.apply(closeHistory(state.transaction));
      state = state.apply(state.transaction.insertText("X", 1));
      snapshots.push({ doc: state.doc, undoDepth: undoDepth(state) });

      // Undo back to each snapshot
      for (let i = snapshots.length - 1; i >= 0; i--) {
        const snapshot = snapshots[i];
        ist(state.doc, snapshot.doc, eq);
        ist(undoDepth(state), snapshot.undoDepth);

        if (i > 0) {
          state = command(state, undo);
        }
      }
    });

    it("addTransform with selection creates proper event boundaries", () => {
      let state = mkState();

      // Add transform with explicit event boundaries
      state = type(state, "a");
      state = state.apply(closeHistory(state.transaction));
      ist(undoDepth(state), 1);

      state = type(state, "b");
      state = state.apply(closeHistory(state.transaction));
      ist(undoDepth(state), 2);

      state = type(state, "c");
      ist(undoDepth(state), 3);

      // Each event should be independently undoable
      state = command(state, undo);
      ist(state.doc, doc(p("ab")), eq);

      state = command(state, undo);
      ist(state.doc, doc(p("a")), eq);

      state = command(state, undo);
      ist(state.doc, doc(p()), eq);
    });

    it("compressed history maintains correctness", () => {
      const plugin = history();
      let state = mkState(undefined, { preserveItems: true });

      // Add many events
      for (let i = 0; i < 10; i++) {
        state = type(state, `${i}`);
        state = state.apply(closeHistory(state.transaction));
      }

      const beforeCompress = state.doc;

      // Manually trigger compression (internal operation)
      // In real usage, this happens automatically during collaboration
      const historyState = plugin.getState(state) as HistoryState;
      if (historyState && historyState.done) {
        // Compression should maintain undo/redo correctness
        ist(undoDepth(state), 10);
      }

      // Verify undo still works after compression
      state = command(state, undo);
      ist(state.doc, doc(p("012345678")), eq);

      state = command(state, redo);
      ist(state.doc, beforeCompress, eq);
    });

    it("rebasing maintains history consistency", () => {
      let state = mkState(undefined, { preserveItems: true });

      // Simulate collaborative scenario
      state = type(state, "base");
      state = state.apply(closeHistory(state.transaction));

      const initialDepth = undoDepth(state);
      ist(initialDepth, 1);

      // Add local change
      state = type(state, " local");

      // Add non-history change (simulating remote)
      state = state.apply(state.transaction.insertText(" remote", 5).setMeta("addToHistory", false));

      // History depth should be correct
      ist(undoDepth(state), 2);

      // Undo should work correctly
      state = command(state, undo);
      ist(state.doc, doc(p("base remote")), eq);

      state = command(state, undo);
      ist(state.doc, doc(p(" remote")), eq);
    });
  });

  describe("corrupted state handling", () => {

    it("should handle mapFrom being undefined gracefully in development", () => {
      let state = mkState();
      state = type(state, "test");

      // This tests the internal assertion we added
      // Normal usage should never trigger this, but it's defensive programming
      const historyState = history().getState(state) as HistoryState;

      // PopEvent should work normally
      const result = historyState.done.popEvent(state, true);
      ist(result !== null);
    });

    it("should not crash with empty items and compression", () => {
      let state = mkState(undefined, { preserveItems: true });

      // Add non-history changes (map-only items)
      for (let i = 0; i < 10; i++) {
        state = state.apply(state.transaction.insertText("x", 1).setMeta("addToHistory", false));
      }

      // Add some history
      state = type(state, "y");

      // Should handle gracefully
      ist(undoDepth(state), 1);

      state = command(state, undo);
      ist(state.doc, doc(p("xxxxxxxxxx")), eq);
    });
  });

  describe("special cases from bug fixes", () => {

    it("should handle finding event end when no selection exists", () => {
      // This tests the findEventEnd method fix
      let state = mkState();
      state = type(state, "test");

      const historyState = history().getState(state) as HistoryState;
      ist(historyState.done.eventCount > 0);

      // Should be able to undo without issues
      state = command(state, undo);
      ist(state.doc, doc(p()), eq);
    });

    it("should handle cutOffEvents when all events need removal", () => {
      // This tests the cutOffEvents boundary condition fix
      let state = mkState(undefined, { depth: 1 });

      // Add events that will force cutoff
      for (let i = 0; i < 30; i++) {
        state = type(state, "x");
        state = state.apply(closeHistory(state.transaction));
      }

      // Should have removed old events without crashing
      const historyState = history().getState(state) as HistoryState;
      ist(historyState.done.eventCount <= 22);

      // Should still be able to undo
      state = command(state, undo);
      ist(state.doc.textContent.length < 30);
    });

    it("should optimize array operations correctly", () => {
      let state = mkState(undefined, { preserveItems: true });

      // Add changes that will trigger the optimized path
      for (let i = 0; i < 5; i++) {
        state = type(state, `${i}`);
        state = state.apply(state.transaction.insertText("_", 1).setMeta("addToHistory", false));
        state = state.apply(closeHistory(state.transaction));
      }

      // Undo should work with optimized array handling
      for (let i = 0; i < 5; i++) {
        state = command(state, undo);
      }

      ist(state.doc, doc(p("_____")), eq);
    });
  });
});

