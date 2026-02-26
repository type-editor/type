import {type Command, type DispatchFunction, type PmEditorState} from '@type-editor/editor-types';
import type {Attrs, NodeRange, NodeType} from '@type-editor/model';
import {findWrapping} from '@type-editor/transform';

/**
 * Creates a command that wraps the selection in a node of the given type.
 *
 * This command factory creates commands that wrap the selected blocks in a container
 * node. This is commonly used for:
 *
 * - Wrapping paragraphs in blockquotes
 * - Creating lists by wrapping items in list containers
 * - Adding other structural wrappers (like divs, sections, etc.)
 * - Increasing indentation levels
 *
 * The command determines the appropriate wrapping structure by analyzing the schema
 * and the current document structure. It will find the sequence of nodes needed to
 * legally wrap the selection in the target node type.
 *
 * The command will fail if:
 * - No valid wrapping structure can be found for the selection
 * - The schema doesn't allow the target node type to wrap the selected content
 * - The selection cannot be converted to a block range
 *
 * @param nodeType - The type of node to wrap the selection in
 * @param attrs - Optional attributes to set on the wrapper node (defaults to null)
 * @returns A command that performs the wrapping
 *
 * @example
 * ```typescript
 * // Create commands for common wrapping operations
 * const wrapInBlockquote = wrapIn(schema.nodes.blockquote);
 * const wrapInBulletList = wrapIn(schema.nodes.bullet_list);
 * const wrapInOrderedList = wrapIn(schema.nodes.ordered_list, { order: 1 });
 *
 * // Use in a keymap
 * const keymap = {
 *   'Mod->': wrapInBlockquote,
 *   'Shift-Ctrl-8': wrapInBulletList,
 *   'Shift-Ctrl-9': wrapInOrderedList
 * };
 *
 * // Use in a menu
 * const menuItem = {
 *   label: 'Wrap in blockquote',
 *   run: wrapIn(schema.nodes.blockquote),
 *   enable: (state) => wrapIn(schema.nodes.blockquote)(state),
 *   icon: quoteIcon
 * };
 * ```
 */
export function wrapIn(nodeType: NodeType, attrs: Attrs | null = null): Command {
    return (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
        const {$from, $to} = state.selection;
        const range: NodeRange = $from.blockRange($to);
        const wrapping = range && findWrapping(range, nodeType, attrs);

        if (!wrapping) {
            return false;
        }

        if (dispatch) {
            dispatch(state.transaction.wrap(range, wrapping).scrollIntoView());
        }

        return true;
    };
}

