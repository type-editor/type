import {isFalse, isUndefinedOrNull} from '@type-editor/commons';
import type {
    PmEditorState, PmMapping,
    PmStepMap,
    PmTransaction,
    SelectionBookmark,
    TransformDocument,
} from '@type-editor/editor-types';

import {mustPreserveItems} from '../helper/must-preserve-items';
import {Branch} from '../state/Branch';
import {HistoryState} from '../state/HistoryState';
import type {HistoryOptions} from '../types/HistoryOptions';
import {closeHistoryKey, historyKey} from './history-plugin-key';


/**
 * Metadata interface for history transactions.
 */
interface HistoryTransactionMeta {
    historyState: HistoryState;
}

/**
 * Metadata interface for appended history transactions.
 */
interface AppendedHistoryMeta {
    redo?: boolean;
}

/**
 * Applies a transaction to the history state, updating the undo/redo stacks appropriately.
 *
 * @param history - The current history state
 * @param state - The current editor state
 * @param transaction - The transaction to apply
 * @param options - History configuration options
 * @returns The updated history state
 */
export function applyTransaction(history: HistoryState,
                                 state: PmEditorState,
                                 transaction: PmTransaction,
                                 options: Required<HistoryOptions>): HistoryState {
    // Check if the transaction explicitly sets the history state
    const historyMeta = transaction.getMeta(historyKey) as HistoryTransactionMeta | null | undefined;
    if (historyMeta) {
        return historyMeta.historyState;
    }

    // Check if we should close the current history group
    if (transaction.getMeta(closeHistoryKey)) {
        history = HistoryState.createClosed(history.done, history.undone);
    }

    // Get the appended transaction if any
    const appended = transaction.getMeta('appendedTransaction') as PmTransaction | null | undefined;

    // Early return if transaction has no steps
    if (transaction.steps.length === 0) {
        return history;
    }

    // Cache preserve items check to avoid multiple iterations through plugins
    const preserveItems: boolean = mustPreserveItems(state);

    // Handle appended transaction with history metadata
    if (appended?.getMeta(historyKey)) {
        return handleAppendedHistoryTransaction(history, transaction, appended, options, preserveItems);
    }

    // Handle regular transaction that should be added to history
    if (shouldAddToHistory(transaction, appended)) {
        return handleRegularHistoryTransaction(history, state, transaction, appended, options, preserveItems);
    }

    // Handle rebased transaction (collaboration)
    const rebased = transaction.getMeta('rebased') as number | null | undefined;
    if (typeof rebased === 'number' && rebased > 0) {
        return handleRebasedTransaction(history, transaction, rebased);
    }

    // Handle transaction that only updates mappings
    return handleMappingOnlyTransaction(history, transaction);
}


/**
 * Handles an appended transaction with history metadata.
 *
 * @param history - The current history state
 * @param transaction - The transaction being applied
 * @param appended - The appended transaction
 * @param options - History configuration options
 * @param preserveItems - Whether to preserve items for rebasing
 * @returns The updated history state
 */
function handleAppendedHistoryTransaction(history: HistoryState,
                                          transaction: PmTransaction,
                                          appended: PmTransaction,
                                          options: Required<HistoryOptions>,
                                          preserveItems: boolean): HistoryState {
    const appendedHistoryMeta = appended.getMeta(historyKey) as AppendedHistoryMeta | null | undefined;

    if (appendedHistoryMeta?.redo) {
        const newDoneBranch: Branch = history.done.addTransform(
            transaction,
            undefined,
            options,
            preserveItems
        );

        return new HistoryState(
            newDoneBranch,
            history.undone,
            rangesFor(transaction.mapping.maps),
            history.prevTime,
            history.prevComposition
        );

    } else {
        const newUndoneBranch: Branch = history.undone.addTransform(
            transaction,
            undefined,
            options,
            preserveItems
        );

        return new HistoryState(
            history.done,
            newUndoneBranch,
            null,
            history.prevTime,
            history.prevComposition
        );
    }
}

/**
 * Handles a regular transaction that should be added to history.
 *
 * @param history - The current history state
 * @param state - The current editor state
 * @param transaction - The transaction being applied
 * @param appended - The appended transaction, if any
 * @param options - History configuration options
 * @param preserveItems - Whether to preserve items for rebasing
 * @returns The updated history state
 */
function handleRegularHistoryTransaction(history: HistoryState,
                                         state: PmEditorState,
                                         transaction: PmTransaction,
                                         appended: PmTransaction | null | undefined,
                                         options: Required<HistoryOptions>,
                                         preserveItems: boolean): HistoryState {
    const composition = transaction.getMeta('composition') as number | null | undefined;
    const newGroup: boolean = shouldCreateNewGroup(history, transaction, appended, options);

    const prevRanges: Array<number> = appended
        ? mapRanges(history.prevRanges, transaction.mapping)
        : rangesFor(transaction.mapping.maps);

    const bookmark: SelectionBookmark = newGroup ? state.selection.getBookmark() : undefined;
    const newDoneBranch: Branch = history.done.addTransform(
        transaction,
        bookmark,
        options,
        preserveItems
    );

    const newComposition: number = isUndefinedOrNull(composition)
        ? history.prevComposition
        : composition;

    return new HistoryState(
        newDoneBranch,
        Branch.empty,
        prevRanges,
        transaction.time,
        newComposition
    );
}

/**
 * Handles a rebased transaction (used by the collab module).
 *
 * @param history - The current history state
 * @param transaction - The transaction being applied
 * @param rebased - The number of steps that were rebased
 * @returns The updated history state
 */
function handleRebasedTransaction(history: HistoryState,
                                  transaction: PmTransaction,
                                  rebased: number): HistoryState {
    const newDoneBranch: Branch = history.done.rebased(transaction, rebased);
    const newUndoneBranch: Branch = history.undone.rebased(transaction, rebased);

    return new HistoryState(
        newDoneBranch,
        newUndoneBranch,
        mapRanges(history.prevRanges, transaction.mapping),
        history.prevTime,
        history.prevComposition
    );
}

/**
 * Handles a transaction that should only update mappings.
 *
 * @param history - The current history state
 * @param transaction - The transaction being applied
 * @returns The updated history state
 */
function handleMappingOnlyTransaction(history: HistoryState,
                                      transaction: PmTransaction): HistoryState {
    const newDoneBranch: Branch = history.done.addMaps(transaction.mapping.maps);
    const newUndoneBranch: Branch = history.undone.addMaps(transaction.mapping.maps);

    return new HistoryState(
        newDoneBranch,
        newUndoneBranch,
        mapRanges(history.prevRanges, transaction.mapping),
        history.prevTime,
        history.prevComposition
    );
}

/**
 * Checks if a transaction should be added to history.
 *
 * @param transaction - The transaction to check
 * @param appended - The appended transaction, if any
 * @returns True if the transaction should be added to history
 */
function shouldAddToHistory(transaction: PmTransaction,
                            appended: PmTransaction | null | undefined): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const addToHistory = transaction.getMeta('addToHistory');
    if (addToHistory === false) {
        return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const appendedAddToHistory = appended?.getMeta('addToHistory');
    return !isFalse(appendedAddToHistory);
}

/**
 * Determines if a new group should be created for the transaction.
 *
 * @param history - The current history state
 * @param transaction - The transaction being applied
 * @param appended - The appended transaction, if any
 * @param options - History configuration options
 * @returns True if a new group should be created
 */
function shouldCreateNewGroup(history: HistoryState,
                              transaction: PmTransaction,
                              appended: PmTransaction | null | undefined,
                              options: Required<HistoryOptions>): boolean {
    if (history.prevTime === 0) {
        return true;
    }

    if (appended) {
        return false;
    }

    const composition = transaction.getMeta('composition') as number | null | undefined;

    if (history.prevComposition !== composition) {
        const timeDifference: number = (transaction.time || 0) - history.prevTime;
        const isTimeDelayExceeded: boolean = timeDifference >= options.newGroupDelay;
        const isNotAdjacent = !isAdjacentTo(transaction, history.prevRanges);

        if (isTimeDelayExceeded || isNotAdjacent) {
            return true;
        }
    }

    return false;
}





/**
 * Maps position ranges through a mapping, filtering out ranges that become invalid.
 * Ranges are represented as pairs of positions [from1, to1, from2, to2, ...].
 *
 * @param ranges - Array of position pairs representing ranges, or null
 * @param mapping - The mapping to apply to the ranges
 * @returns Array of mapped ranges, or null if input was null
 */
function mapRanges(ranges: ReadonlyArray<number> | null,
                   mapping: PmMapping): Array<number> | null {
    if (!ranges || ranges.length === 0) {
        return null;
    }

    const result: Array<number> = [];

    // Process ranges in pairs (from, to)
    for (let i = 0; i < ranges.length; i += 2) {
        // Safety check: ensure we have a complete pair
        if (i + 1 >= ranges.length) {
            break;
        }

        const from: number = mapping.map(ranges[i], 1);
        const to: number = mapping.map(ranges[i + 1], -1);

        // Only include ranges that remain valid after mapping
        if (from <= to) {
            result.push(from, to);
        }
    }

    return result.length > 0 ? result : null;
}

/**
 * Checks if a transform's changes are adjacent to the previous ranges.
 * Adjacent changes can be grouped together in the history.
 *
 * @param transform - The transform to check
 * @param prevRanges - The previous change ranges, or null
 * @returns True if the transform is adjacent to previous ranges
 */
function isAdjacentTo(transform: TransformDocument, prevRanges: ReadonlyArray<number> | null): boolean {
    if (!prevRanges) {
        return false;
    }

    // If the document wasn't changed, consider it adjacent
    if (!transform.docChanged) {
        return true;
    }

    // Safety check: ensure we have at least one map
    if (!transform.mapping.maps[0]) {
        return false;
    }

    let isAdjacent = false;

    // Check if any mapped position overlaps with previous ranges
    transform.mapping.maps[0].forEach((start: number, end: number) => {
        // Early exit if we already found adjacency
        if (isAdjacent) {
            return;
        }

        for (let i = 0; i < prevRanges.length; i += 2) {
            const prevFrom: number = prevRanges[i];
            const prevTo: number = prevRanges[i + 1];

            // Check for overlap: start is before or at prevTo, and end is after or at prevFrom
            if (start <= prevTo && end >= prevFrom) {
                isAdjacent = true;
                break; // Exit inner loop early
            }
        }
    });

    return isAdjacent;
}

/**
 * Extracts the position ranges affected by a set of step maps.
 * Returns ranges from the most recent map that has changes.
 *
 * @param maps - Array of step maps to extract ranges from
 * @returns Array of position pairs [from, to] representing affected ranges
 */
function rangesFor(maps: ReadonlyArray<PmStepMap>): Array<number> {
    const result: Array<number> = [];

    // Iterate backwards through maps to find the most recent changes
    for (let i = maps.length - 1; i >= 0 && result.length === 0; i--) {
        maps[i].forEach((_from: number, _to: number, from: number, to: number): void => {
            result.push(from, to);
        });
    }

    return result;
}
