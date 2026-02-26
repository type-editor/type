import type { Command, DispatchFunction, PmEditorState } from '@type-editor/editor-types';
import {Fragment, type Node, type NodeRange, type NodeType, Slice} from '@type-editor/model';
import {ReplaceAroundStep} from '@type-editor/transform';


/**
 * Creates a command to sink (indent) the list item around the selection down
 * into an inner nested list.
 *
 * This command moves the selected list item(s) into a sublist of the preceding
 * sibling list item, effectively increasing the indentation level. The command
 * will fail if:
 * - There is no valid block range containing list items
 * - The selected item is the first item (no preceding sibling to nest under)
 * - The preceding sibling is not a list item of the same type
 *
 * @param itemType - The node type of the list item to sink (e.g., `list_item`)
 *
 * @returns A command function that takes the editor state and optional dispatch function.
 *          Returns `true` if the command can be applied, `false` otherwise.
 */
export function sinkListItem(itemType: NodeType): Command {
    return (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
        const {$from, $to} = state.selection;

        // Find the block range containing list items
        const range: NodeRange = $from.blockRange(
            $to,
            (node: Node): boolean => node.childCount > 0 && node.firstChild.type === itemType
        );

        if (!range) {
            return false;
        }

        const startIndex: number = range.startIndex;

        // Cannot sink the first item (no preceding sibling to nest under)
        if (startIndex === 0) {
            return false;
        }

        const parent: Node = range.parent;
        const nodeBefore: Node = parent.child(startIndex - 1);

        // Can only sink into a preceding list item of the same type
        if (nodeBefore.type !== itemType) {
            return false;
        }

        if (dispatch) {
            // Check if the preceding node already has a nested list
            const nestedBefore: boolean = nodeBefore.lastChild?.type === parent.type;

            // Create the inner structure: empty item if already nested, null otherwise
            const inner: Fragment = Fragment.from(nestedBefore ? itemType.create() : null);

            // Build the slice that wraps the selected items in a new list structure
            const slice: Slice = new Slice(
                Fragment.from(
                    itemType.create(null, Fragment.from(parent.type.create(null, inner)))
                ),
                nestedBefore ? 3 : 1, // Open depth depends on existing nesting
                0 // Close depth
            );

            const before: number = range.start;
            const after: number = range.end;

            // Apply the transformation to move the item into the nested list
            dispatch(
                state.transaction
                    .step(
                        new ReplaceAroundStep(
                            before - (nestedBefore ? 3 : 1), // Adjust for existing nesting depth
                            after,
                            before,
                            after,
                            slice,
                            1,
                            true
                        )
                    )
                    .scrollIntoView()
            );
        }

        return true;
    };
}
