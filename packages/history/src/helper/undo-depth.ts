import type {PmEditorState} from '@type-editor/editor-types';

import {historyKey} from '../plugin/history-plugin-key';
import type {HistoryState} from '../state/HistoryState';

/**
 * Returns the number of undoable events available in the editor's history.
 *
 * This can be used to determine whether the undo command is available,
 * or to display the undo history depth in the UI.
 *
 * @param {PmEditorState} state - The current editor state
 * @returns {number} The number of undoable events, or 0 if no history is available
 *
 * @example
 * ```typescript
 * const canUndo = undoDepth(state) > 0;
 * console.log(`You can undo ${undoDepth(state)} changes`);
 * ```
 */
export function undoDepth(state: PmEditorState): number {
    const historyState = historyKey.getState(state) as HistoryState | undefined;
    return historyState ? historyState.done.eventCount : 0;
}
