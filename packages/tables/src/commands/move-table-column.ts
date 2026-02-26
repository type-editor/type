import type {PmEditorState, PmTransaction} from '@type-editor/editor-types';
import type {Command, DispatchFunction} from '@type-editor/editor-types';

import type {MoveTableColumnOptions} from '../types/commands/MoveTableColumnOptions';
import {moveColumn} from '../utils/move-column';


/**
 * Creates a command that moves a table column from one index to another.
 *
 * @param options - Configuration for the column move operation
 * @returns A command that moves the specified column
 */
export function moveTableColumn(options: MoveTableColumnOptions): Command {
    return (state: PmEditorState, dispatch: DispatchFunction): boolean => {
        const {
            from: originIndex,
            to: targetIndex,
            select,
            pos,
        } = options;

        const transaction: PmTransaction = state.transaction;
        if (moveColumn({tr: transaction, originIndex, targetIndex, select, pos})) {
            dispatch?.(transaction);
            return true;
        }
        return false;
    };
}
