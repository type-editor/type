import {Branch} from './Branch';

/**
 * ProseMirror's history isn't simply a way to roll back to a previous
 * state, because ProseMirror supports applying changes without adding
 * them to the history (for example during collaboration).
 *
 * To this end, each 'Branch' (one for the undo history and one for
 * the redo history) keeps an array of 'Items', which can optionally
 * hold a step (an actual undoable change), and always hold a position
 * map (which is needed to move changes below them to apply to the
 * current document).
 *
 * An item that has both a step and a selection bookmark is the start
 * of an 'event' — a group of changes that will be undone or redone at
 * once. (It stores only the bookmark, since that way we don't have to
 * provide a document until the selection is actually applied, which
 * is useful when compressing.)
 */

/**
 * Represents the complete undo/redo history state for an editor.
 *
 * This tracks both the undo (done) and redo (undone) branches, as well as
 * metadata about the previous transaction for determining event grouping.
 * Will be stored in the plugin state when the history plugin is active.
 */
export class HistoryState {

    private _done: Branch;
    private readonly _undone: Branch;
    private readonly _prevRanges: ReadonlyArray<number> | null;
    private readonly _prevTime: number;
    private readonly _prevComposition: number;

    /**
     * Creates a new history state.
     * @param done - The undo history branch
     * @param undone - The redo history branch
     * @param prevRanges - The position ranges of the previous transaction
     * @param prevTime - The timestamp of the previous transaction
     * @param prevComposition - The composition ID of the previous transaction
     */
    constructor(done: Branch,
                undone: Branch,
                prevRanges: ReadonlyArray<number> | null,
                prevTime: number,
                prevComposition: number) {
        this._done = done;
        this._undone = undone;
        this._prevRanges = prevRanges;
        this._prevTime = prevTime;
        this._prevComposition = prevComposition;
    }

    /**
     * Gets the undo history branch.
     */
    get done(): Branch {
        return this._done;
    }

    /**
     * Sets the undo history branch.
     */
    set done(branch: Branch) {
        this._done = branch;
    }

    /**
     * Gets the redo history branch.
     */
    get undone(): Branch {
        return this._undone;
    }

    /**
     * Gets the position ranges from the previous transaction.
     */
    get prevRanges(): ReadonlyArray<number> | null {
        return this._prevRanges;
    }

    /**
     * Gets the timestamp of the previous transaction.
     */
    get prevTime(): number {
        return this._prevTime;
    }

    /**
     * Gets the composition ID of the previous transaction.
     */
    get prevComposition(): number {
        return this._prevComposition;
    }

    /**
     * Creates an empty history state with no undo or redo history.
     *
     * @returns A new HistoryState with empty branches and initial metadata
     */
    static createEmpty(): HistoryState {
        return new HistoryState(Branch.empty, Branch.empty, null, 0, -1);
    }

    /**
     * Creates a closed history state, which prevents grouping with previous changes.
     * This is used when the history should start a new group for the next transaction.
     *
     * @param done - The undo history branch to preserve
     * @param undone - The redo history branch to preserve
     * @returns A new HistoryState with reset metadata to prevent grouping
     */
    static createClosed(done: Branch, undone: Branch): HistoryState {
        return new HistoryState(done, undone, null, 0, -1);
    }
}
