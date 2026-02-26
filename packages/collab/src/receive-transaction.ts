import type {PmEditorState, PmStep, PmTransaction} from '@type-editor/editor-types';
import {TextSelection} from '@type-editor/state';

import {CollabState} from './CollabState';
import {collabPluginKey} from './plugin-key';
import {rebaseSteps} from './rebase-steps';
import type {Rebaseable} from './Rebaseable';
import type {ReceiveTransactionOptions} from './types/ReceiveTransactionOptions';
import {getClientID} from './util/get-client-id';


/**
 * Creates a transaction that represents a set of new steps received from
 * the central authority. Applying this transaction moves the state forward
 * to adjust to the authority's view of the document.
 *
 * This function handles three scenarios:
 * 1. Steps that originated from this client are confirmed and removed from unconfirmed.
 * 2. Steps from other clients are applied directly if there are no local changes.
 * 3. If there are local unconfirmed changes, they are rebased over the remote steps.
 *
 * @param state - The current editor state.
 * @param steps - The steps received from the central authority.
 * @param clientIDs - The client IDs corresponding to each step, used to identify
 *   which steps originated from this client.
 * @param options - Optional configuration for how to handle the transaction.
 * @returns A transaction that applies the received steps and updates the collab state.
 */
export function receiveTransaction(state: PmEditorState,
                                   steps: ReadonlyArray<PmStep>,
                                   clientIDs: ReadonlyArray<string | number>,
                                   options: ReceiveTransactionOptions = {}): PmTransaction {
    const collabState = collabPluginKey.getState(state) as CollabState | undefined;
    if (!collabState) {
        throw new Error('Collab plugin not found. Make sure to install it via EditorState.create({plugins: [collab()]})');
    }
    const version = collabState.version + steps.length;
    const ourID = getClientID(state);

    // Count how many steps at the beginning originated from this client
    const ours = countOwnSteps(clientIDs, ourID);

    // Remove confirmed steps from unconfirmed list
    let unconfirmed: ReadonlyArray<Rebaseable> = collabState.unconfirmed.slice(ours);
    // Remove our own steps from the received steps
    steps = ours ? steps.slice(ours) : steps;

    // If all steps originated with us, we're done - just update the version
    if (!steps.length) {
        return state.transaction.setMeta(collabPluginKey, new CollabState(version, unconfirmed));
    }

    const nUnconfirmed: number = unconfirmed.length;
    const transaction: PmTransaction = state.transaction;

    if (nUnconfirmed) {
        // Rebase local unconfirmed steps over the remote steps
        unconfirmed = rebaseSteps(unconfirmed, steps, transaction);
    } else {
        // No local changes - simply apply remote steps
        for (const step of steps) {
            transaction.step(step);
        }
        unconfirmed = [];
    }

    const newCollabState = new CollabState(version, unconfirmed);

    // Handle selection mapping if requested
    if (options.mapSelectionBackward && state.selection instanceof TextSelection) {
        mapSelectionBackward(transaction, state.selection);
    }

    return transaction
        .setMeta('rebased', nUnconfirmed)
        .setMeta('addToHistory', false)
        .setMeta(collabPluginKey, newCollabState);
}


/**
 * Counts how many consecutive steps at the start of the clientIDs array
 * match the given client ID.
 *
 * @param clientIDs - The array of client IDs to check.
 * @param ourID - The client ID to match against.
 * @returns The count of matching consecutive steps from the start.
 */
function countOwnSteps(clientIDs: ReadonlyArray<string | number>,
                       ourID: string | number): number {
    let count = 0;
    while (count < clientIDs.length && clientIDs[count] === ourID) {
        count++;
    }
    return count;
}

/**
 * Maps a text selection backward so that content inserted at the cursor
 * ends up after the cursor rather than before it.
 *
 * @param transaction - The transaction to update.
 * @param selection - The text selection to map.
 */
function mapSelectionBackward(transaction: PmTransaction, selection: TextSelection): void {
    const mappedAnchor = transaction.mapping.map(selection.anchor, -1);
    const mappedHead = transaction.mapping.map(selection.head, -1);

    transaction.setSelection(
        TextSelection.between(
            transaction.doc.resolve(mappedAnchor),
            transaction.doc.resolve(mappedHead),
            -1
        )
    );

    // Clear the selection update flag to prevent it from being treated as a user action
    const transactionUpdated = transaction.getUpdated() & ~1;
    transaction.setUpdated(transactionUpdated);
}
