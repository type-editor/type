import type {PmEditorState, PmTransaction} from '@type-editor/editor-types';
import type {Command, DispatchFunction} from '@type-editor/editor-types';

import type {MoveTableRowOptions} from '../types/commands/MoveTableRowOptions';
import {moveRow} from '../utils/move-row';


/**
 * Creates a command that moves a table row from one index to another.
 *
 * @param options - Configuration for the row move operation
 * @returns A command that moves the specified row
 */
export function moveTableRow(options: MoveTableRowOptions): Command {
    return (state: PmEditorState, dispatch: DispatchFunction): boolean => {
        const {
            from: originIndex,
            to: targetIndex,
            select,
            pos,
        } = options;

        const transaction: PmTransaction = state.transaction;
        if (moveRow({transaction: transaction, originIndex, targetIndex, select, pos})) {
            dispatch?.(transaction);
            return true;
        }
        return false;
    };
}
