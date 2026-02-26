import {type Transaction} from '@type-editor/state';

import {closeHistoryKey} from '../plugin/history-plugin-key';

/**
 * Sets a flag on the given transaction that prevents further steps from being
 * appended to an existing history event.
 *
 * This forces subsequent changes to be recorded as a separate history event,
 * requiring a separate undo command to revert.
 *
 * @param transaction - The transaction to mark as closing the current history event
 * @returns The modified transaction with the close history flag set
 */
export function closeHistory(transaction: Transaction): Transaction {
    return transaction.setMeta(closeHistoryKey, true);
}
