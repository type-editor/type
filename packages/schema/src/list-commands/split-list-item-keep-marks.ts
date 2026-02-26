import type { Command, DispatchFunction, PmEditorState, PmTransaction } from '@type-editor/editor-types';
import type {Attrs, Mark, NodeType} from '@type-editor/model';

import {splitListItem} from './split-list-item';


/**
 * Build a command that splits a list item while preserving active marks.
 *
 * Acts like [`splitListItem`](#schema-list.splitListItem), but
 * without resetting the set of active marks at the cursor. This is useful
 * when you want to maintain formatting (bold, italic, etc.) when creating
 * a new list item.
 *
 * The command preserves marks from either:
 * - The stored marks in the editor state, or
 * - The marks at the current cursor position (if the cursor has a parent offset)
 *
 * @param itemType - The node type of the list item to split
 * @param itemAttrs - Optional attributes to apply to the newly created list item
 * @returns A command function that can be dispatched to the editor state
 *
 * @example
 * ```typescript
 * // Create a command that splits list items while keeping marks
 * const command = splitListItemKeepMarks(schema.nodes.list_item);
 * command(state, dispatch);
 * ```
 */
export function splitListItemKeepMarks(itemType: NodeType, itemAttrs?: Attrs): Command {
    const split: Command = splitListItem(itemType, itemAttrs);

    /**
     * Command function that performs the split while preserving marks.
     *
     * @param state - The current editor state
     * @param dispatch - Optional transaction dispatch function
     * @returns `true` if the command was applicable, `false` otherwise
     */
    return (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
        if (!dispatch) {
            // Query mode: check if the command is applicable
            return split(state);
        }

        // Execute mode: perform the split and preserve marks
        return split(state, (transaction: PmTransaction): void => {
            // Retrieve marks to preserve: either stored marks or marks at the cursor position
            const marks: ReadonlyArray<Mark> =
                state.storedMarks
                || (state.selection.$to.parentOffset && state.selection.$from.marks());

            if (marks) {
                transaction.ensureMarks(marks);
            }

            dispatch(transaction);
        });
    };
}
