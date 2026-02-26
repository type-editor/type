import type {PmEditorState} from '@type-editor/editor-types';

import {historyKey} from '../plugin/history-plugin-key';
import type {HistoryState} from '../state/HistoryState';

/**
 * Returns the number of redoable events available in the editor's history.
 *
 * This can be used to determine whether the redo command is available,
 * or to display the redo history depth in the UI.
 *
 * @param {PmEditorState} state - The current editor state
 * @returns {number} The number of redoable events, or 0 if no redo history is available
 *
 * @example
 * ```typescript
 * const canRedo = redoDepth(state) > 0;
 * console.log(`You can redo ${redoDepth(state)} changes`);
 * ```
 */
export function redoDepth(state: PmEditorState): number {
    const historyState = historyKey.getState(state) as HistoryState | undefined;
    return historyState ? historyState.undone.eventCount : 0;
}
