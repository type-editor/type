import type {Command, DispatchFunction, PmEditorState, PmPlugin, PmSelection, SelectionBookmark} from '@type-editor/editor-types';
import type {
    Selection,
    Transaction
} from '@type-editor/state';

import {mustPreserveItems} from '../../helper/must-preserve-items';
import {historyKey} from '../../plugin/history-plugin-key';
import type {Branch} from '../../state/Branch';
import {HistoryState} from '../../state/HistoryState';
import type {HistoryEventState} from '../../types/HistoryEventState';
import type {HistoryOptions} from '../../types/HistoryOptions';

/**
 * Builds a command that performs undo or redo operations.
 *
 * This factory function creates command functions that can be used in keymaps
 * or executed programmatically. The returned command follows the ProseMirror
 * command pattern: it returns true if the command is applicable (even if not
 * executed due to lack of dispatch), and false if it's not applicable.
 *
 * @param {boolean} redo - If true, creates a redo command; if false, creates an undo command
 * @param {boolean} scroll - If true, the command will scroll the selection into view after execution
 * @returns {Command} A command function that can be executed against an editor state
 */
export function buildCommand(redo: boolean, scroll: boolean): Command {
    return (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
        // Get history state and check if the operation is available
        const historyState = historyKey.getState(state) as HistoryState | undefined;
        if (!historyState) {
            return false;
        }

        const branch: Branch = redo ? historyState.undone : historyState.done;
        if (branch.eventCount === 0) {
            return false;
        }

        // If dispatch is provided, execute the operation
        if (dispatch) {
            const transaction: Transaction = histTransaction(historyState, state, redo);

            if (transaction) {
                dispatch(scroll ? transaction.scrollIntoView() : transaction);
            }
        }

        return true;
    };
}

/**
 * Applies the latest event from one history branch to the document and shifts
 * the event onto the opposite branch.
 *
 * This is the core logic that handles both undo and redo operations by:
 * 1. Popping an event from the appropriate branch (done for undo, undone for redo)
 * 2. Applying the transform from that event to create a transaction
 * 3. Moving the event to the opposite branch
 *
 * @param {HistoryState} history - The current history state containing done and undone branches
 * @param {PmEditorState} state - The current editor state
 * @param {boolean} redo - If true, performs a redo operation; if false, performs an undo
 * @returns {Transaction | null} A transaction containing the history changes, or null if no events are available or the history plugin is not installed
 */
function histTransaction(history: HistoryState,
                         state: PmEditorState,
                         redo: boolean): Transaction | null {
    // Get configuration and check prerequisites
    const histOptions: Required<HistoryOptions> = getHistoryOptions(state);
    if (!histOptions) {
        return null;
    }

    const preserveItems: boolean = mustPreserveItems(state);

    // Pop the event from the appropriate branch
    const poppedEvent: HistoryEventState = popHistoryEvent(history, state, redo, preserveItems);
    if (!poppedEvent) {
        return null;
    }

    // Resolve the selection from the popped event
    const selection: PmSelection = poppedEvent.selection.resolve(poppedEvent.transform.doc);

    // Create the new history state with the event moved to the opposite branch
    const newHistoryState: HistoryState = createNewHistoryState(
        history,
        poppedEvent,
        state,
        redo,
        histOptions,
        preserveItems
    );

    // Return the transaction with the selection and history metadata
    return poppedEvent.transform
        .setSelection(selection as Selection)
        .setMeta(historyKey, {redo, historyState: newHistoryState});
}

/**
 * Retrieves the history configuration options from the editor state.
 *
 * @param {PmEditorState} state - The current editor state
 * @returns {Required<HistoryOptions> | null} The history options, or null if the history plugin is not installed
 */
function getHistoryOptions(state: PmEditorState): Required<HistoryOptions> | null {
    const plugin: PmPlugin = historyKey.get(state);
    if (!plugin) {
        return null;
    }
    return (plugin.spec as { config: Required<HistoryOptions> }).config;
}

/**
 * Pops the latest event from the appropriate history branch (done or undone).
 *
 * @param {HistoryState} history - The current history state
 * @param {PmEditorState} state - The current editor state
 * @param {boolean} redo - Whether to pop from the redo (undone) branch or undo (done) branch
 * @param {boolean} preserveItems - Whether to preserve items when popping
 * @returns {HistoryEventState | null} The popped event, or null if no events are available
 */
function popHistoryEvent(history: HistoryState,
                         state: PmEditorState,
                         redo: boolean,
                         preserveItems: boolean): HistoryEventState | null {
    return redo
        ? history.undone.popEvent(state, preserveItems)
        : history.done.popEvent(state, preserveItems);
}

/**
 * Creates a new history state by adding the transform to the opposite branch.
 *
 * @param {HistoryState} history - The current history state
 * @param {HistoryEventState} poppedEvent - The event that was popped
 * @param {PmEditorState} state - The current editor state
 * @param {boolean} redo - Whether this is a redo operation
 * @param {Required<HistoryOptions>} histOptions - The history configuration options
 * @param {boolean} preserveItems - Whether to preserve items
 * @returns {HistoryState} The new history state with the transform added
 */
function createNewHistoryState(history: HistoryState,
                               poppedEvent: HistoryEventState,
                               state: PmEditorState,
                               redo: boolean,
                               histOptions: Required<HistoryOptions>,
                               preserveItems: boolean): HistoryState {
    const currentSelection: SelectionBookmark = state.selection.getBookmark();

    if (redo) {
        // For redo: move from undone to done
        const addedBranch: Branch = history.done.addTransform(
            poppedEvent.transform,
            currentSelection,
            histOptions,
            preserveItems
        );

        // Parameters: done, undone, prevRanges, prevTime, prevComposition
        // null: no previous ranges, 0: reset prev time, -1: reset composition tracking
        return new HistoryState(addedBranch, poppedEvent.remaining, null, 0, -1);
    } else {
        // For undo: move from done to undone
        const addedBranch: Branch = history.undone.addTransform(
            poppedEvent.transform,
            currentSelection,
            histOptions,
            preserveItems
        );

        // Parameters: done, undone, prevRanges, prevTime, prevComposition
        // null: no previous ranges, 0: reset prev time, -1: reset composition tracking
        return new HistoryState(poppedEvent.remaining, addedBranch, null, 0, -1);
    }
}
