import type {Attrs, NodeRange, NodeType} from '@type-editor-compat/model';
import type {EditorState, Transaction} from '@type-editor-compat/state';

import type { Command } from './Command';
import {wrapRangeInList} from './wrap-range-in-list';


/**
 * Returns a command function that wraps the selection in a list with
 * the given type and attributes. If `dispatch` is null, only return a
 * value to indicate whether this is possible, but don't actually
 * perform the change.
 *
 * This command will attempt to wrap the currently selected block range
 * in a list of the specified type. The command returns `false` if the
 * selection cannot be wrapped (e.g., if there's no valid block range),
 * and `true` if the wrapping is possible or has been performed.
 *
 * @param listType - The node type to use for the list wrapper (e.g., bullet_list or ordered_list)
 * @param attrs - Optional attributes to apply to the list node. Defaults to null.
 *
 * @returns A command function that takes an editor state and optional dispatch function.
 *          Returns `true` if the wrap operation is possible/successful, `false` otherwise.
 *
 * @example
 * ```typescript
 * // Wrap selection in a bullet list
 * const command = wrapInList(schema.nodes.bullet_list);
 * command(state, dispatch);
 *
 * // Wrap selection in an ordered list with custom attributes
 * const orderedCommand = wrapInList(schema.nodes.ordered_list, { start: 1 });
 * orderedCommand(state, dispatch);
 * ```
 */
export function wrapInList(listType: NodeType, attrs: Attrs | null = null): Command {
    return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
        const {$from, $to} = state.selection;
        const range: NodeRange = $from.blockRange($to);

        if (!range) {
            return false;
        }

        const transaction: Transaction = dispatch ? state.transaction : null;

        if (!wrapRangeInList(transaction, range, listType, attrs)) {
            return false;
        }

        if (dispatch) {
            dispatch(transaction.scrollIntoView());
        }

        return true;
    };
}
