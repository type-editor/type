import type { PmTransaction } from '@type-editor/editor-types';

import type { ReplacementRange } from '../../types/ReplacementRange';


/**
 * Applies all replacement ranges to a transaction in reverse order.
 *
 * @param transaction - The transaction to apply replacements to
 * @param replacements - Array of replacement ranges to apply
 */
export function applyReplacements(transaction: PmTransaction, replacements: Array<ReplacementRange>): void {
    // Apply replacements in reverse order to maintain position validity
    for (let i = replacements.length - 1; i >= 0; i--) {
        const {from, to, insert} = replacements[i];
        transaction.replace(from, to, insert);
    }
}
