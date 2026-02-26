import type {PmSelectionState} from './PmSelectionState';

export interface PmDOMObserver {
    readonly flushingSoon: number;
    readonly lastChangedTextNode: Text;
    readonly currentSelection: PmSelectionState;
    readonly requiresGeckoHackNode: boolean;

    /**
     * Schedules a flush operation to process pending mutations after a short delay.
     * This helps batch multiple rapid changes together for better performance.
     */
    flushSoon(): void;

    /**
     * Cancels any pending flush and immediately processes all mutations.
     */
    forceFlush(): void;

    /**
     * Starts observing DOM and selection changes.
     * This should be called when the editor becomes active.
     */
    start(): void;

    /**
     * Stops observing DOM and selection changes.
     * Any pending mutations are flushed asynchronously.
     */
    stop(): void;

    /**
     * Starts listening to selection change events.
     */
    connectSelection(): void;

    /**
     * Stops listening to selection change events.
     */
    disconnectSelection(): void;

    /**
     * Temporarily suppresses selection updates for 50ms.
     * This is useful when programmatically changing the selection.
     */
    suppressSelectionUpdates(): void;

    /**
     * Updates the cached current selection from the DOM.
     */
    setCurSelection(): void;

    /**
     * Retrieves all pending mutation records and returns the current queue.
     * @returns Array of pending mutation records
     */
    pendingRecords(): Array<MutationRecord>;

    /**
     * Processes all pending mutations and synchronizes the editor state.
     * This is the main entry point for DOM change handling.
     */
    flush(): void;
}
