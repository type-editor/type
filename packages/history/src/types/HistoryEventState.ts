import type {SelectionBookmark} from '@type-editor/editor-types';
import type {Transaction} from '@type-editor/state';

import type {Branch} from '../state/Branch';


/**
 * Represents the state of a history event during undo/redo operations.
 */
export interface HistoryEventState {
    /** The remaining branch after popping the event */
    remaining: Branch;
    /** The transaction containing the event steps */
    transform: Transaction;
    /** The selection bookmark to restore */
    selection: SelectionBookmark;
}
