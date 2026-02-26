import {isUndefinedOrNull} from '@type-editor/commons';
import {type Command, type DispatchFunction, type PmEditorState} from '@type-editor/editor-types';
import type {NodeRange} from '@type-editor/model';
import {liftTarget} from '@type-editor/transform';

/**
 * Lifts the selected block out of its parent node.
 *
 * This command takes the selected block (or the closest ancestor block containing
 * the selection) and moves it one level up in the document hierarchy by removing
 * its parent wrapper. This is commonly used to:
 *
 * - Remove items from lists
 * - Unwrap content from blockquotes
 * - Decrease indentation levels
 * - Remove other wrapping structures
 *
 * The command will only succeed if the lift operation is structurally valid
 * according to the schema (i.e., the parent node can be removed without
 * violating content constraints).
 *
 * @param state - The current editor state
 * @param dispatch - Optional dispatch function to execute the transaction
 * @returns `true` if the lift can be performed, `false` otherwise
 *
 * @example
 * ```typescript
 * // Use in a keymap to lift blocks (e.g., outdent list items)
 * const keymap = {
 *   'Mod-[': lift,
 *   'Shift-Tab': lift
 * };
 *
 * // Use in a menu
 * const menuItem = {
 *   label: 'Lift out of parent',
 *   run: lift,
 *   enable: (state) => lift(state),
 *   icon: outdentIcon
 * };
 * ```
 */
export const lift: Command = (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
    const {$from, $to} = state.selection;
    const range: NodeRange = $from.blockRange($to);
    const target: number = range && liftTarget(range);

    if (isUndefinedOrNull(target)) {
        return false;
    }

    if (dispatch) {
        dispatch(state.transaction.lift(range, target).scrollIntoView());
    }

    return true;
};

