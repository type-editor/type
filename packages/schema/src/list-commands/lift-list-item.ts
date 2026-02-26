import { isUndefinedOrNull } from '@type-editor/commons';
import type { Command, DispatchFunction, PmEditorState, PmTransaction } from '@type-editor/editor-types';
import { Fragment, type Node, NodeRange, type NodeType, type ResolvedPos, Slice } from '@type-editor/model';
import { canJoin, liftTarget, ReplaceAroundStep } from '@type-editor/transform';


/**
 * Create a command to lift the list item around the selection up into
 * a wrapping list.
 *
 * This command handles two scenarios:
 * 1. If the selection is inside a nested list item, it lifts the item to the outer list
 * 2. If the selection is in an outer list item, it lifts the item out of the list entirely
 *
 * @param itemType - The node type of the list item to lift
 * @returns A command function that can be executed with editor state and optional dispatch
 */
export function liftListItem(itemType: NodeType): Command {
    return (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
        const {$from, $to} = state.selection;
        const range: NodeRange = $from.blockRange(
            $to,
            (node: Node): boolean => node.childCount > 0 && node.firstChild.type === itemType
        );

        if (!range) {
            return false;
        }

        if (!dispatch) {
            return true;
        }

        // Inside a parent list
        if ($from.node(range.depth - 1).type === itemType) {
            return liftToOuterList(state, dispatch, itemType, range);
        }

        // Outer list node
        return liftOutOfList(state, dispatch, range);
    };
}

/**
 * Lifts a list item from a nested list to its parent list.
 *
 * When a list item has siblings after it, those siblings are wrapped
 * and become children of the last lifted item to maintain document structure.
 * After lifting, attempts to join adjacent nodes if they are of the same type.
 *
 * @param state - The current editor state
 * @param dispatch - Function to dispatch the transaction
 * @param itemType - The node type of the list item being lifted
 * @param range - The node range containing the list items to lift
 * @returns True if the lift operation was successful, false otherwise
 */
function liftToOuterList(
    state: PmEditorState,
    dispatch: DispatchFunction,
    itemType: NodeType,
    range: NodeRange
): boolean {
    const transaction: PmTransaction = state.transaction;
    const end: number = range.end;
    const endOfList: number = range.$to.end(range.depth);

    if (end < endOfList) {
        // There are siblings after the lifted items, which must become
        // children of the last item
        transaction.step(
            new ReplaceAroundStep(
                end - 1,
                endOfList,
                end,
                endOfList,
                new Slice(
                    Fragment.from(itemType.create(null, range.parent.copy())),
                    1,
                    0
                ),
                1,
                true
            )
        );

        range = new NodeRange(
            transaction.doc.resolve(range.$from.pos),
            transaction.doc.resolve(endOfList),
            range.depth
        );
    }

    const target: number = liftTarget(range);

    if (isUndefinedOrNull(target)) {
        return false;
    }

    transaction.lift(range, target);

    const $after: ResolvedPos = transaction.doc.resolve(transaction.mapping.map(end, -1) - 1);
    const canJoinNodes: boolean =
        canJoin(transaction.doc, $after.pos)
        && $after.nodeBefore.type === $after.nodeAfter.type;

    if (canJoinNodes) {
        transaction.join($after.pos);
    }

    dispatch(transaction.scrollIntoView());
    return true;
}

/**
 * Lifts a list item completely out of its containing list.
 *
 * This function merges the selected list items into a single item and then
 * removes it from the list structure. The item's content replaces the list
 * at that position. Handles edge cases for items at the start or end of the list.
 *
 * @param state - The current editor state
 * @param dispatch - Function to dispatch the transaction
 * @param range - The node range containing the list items to lift out
 * @returns True if the lift operation was successful, false if the content cannot be replaced
 */
function liftOutOfList(state: PmEditorState,
                       dispatch: DispatchFunction,
                       range: NodeRange): boolean {
    const transaction: PmTransaction = state.transaction;
    const list: Node = range.parent;

    // Merge the list items into a single big item
    mergeListItems(transaction, list, range.startIndex, range.endIndex, range.end);

    const $start: ResolvedPos = transaction.doc.resolve(range.start);
    const item: Node = $start.nodeAfter;

    if (transaction.mapping.map(range.end) !== range.start + $start.nodeAfter.nodeSize) {
        return false;
    }

    const atStart: boolean = range.startIndex === 0;
    const atEnd: boolean = range.endIndex === list.childCount;
    const parent: Node = $start.node(-1);
    const indexBefore: number = $start.index(-1);

    const canReplaceContent: boolean = parent.canReplace(
        indexBefore + (atStart ? 0 : 1),
        indexBefore + 1,
        item.content.append(atEnd ? Fragment.empty : Fragment.from(list))
    );

    if (!canReplaceContent) {
        return false;
    }

    const start: number = $start.pos;
    const end: number = start + item.nodeSize;

    // Strip off the surrounding list. At the sides where we're not at
    // the end of the list, the existing list is closed. At sides where
    // this is the end, it is overwritten to its end.
    const sliceContent: Fragment = createLiftSlice(list, atStart, atEnd);

    transaction.step(
        new ReplaceAroundStep(
            start - (atStart ? 1 : 0),
            end + (atEnd ? 1 : 0),
            start + 1,
            end - 1,
            new Slice(sliceContent, atStart ? 0 : 1, atEnd ? 0 : 1),
            atStart ? 0 : 1
        )
    );

    dispatch(transaction.scrollIntoView());
    return true;
}

/**
 * Merges list items by removing separators between them.
 *
 * Iterates backwards through the list items in the specified range and
 * deletes the separators (boundaries) between them, effectively merging
 * them into a single list item.
 *
 * @param transaction - The transaction to apply the merge operations to
 * @param list - The list node containing the items to merge
 * @param startIndex - The starting index of the range of items to merge
 * @param endIndex - The ending index (exclusive) of the range of items to merge
 * @param rangeEnd - The absolute position at the end of the range
 */
function mergeListItems(transaction: PmTransaction,
                        list: Node,
                        startIndex: number,
                        endIndex: number,
                        rangeEnd: number): void {
    let currentEnd: number = rangeEnd;
    let currentIndex: number = endIndex - 1;

    while (currentIndex > startIndex) {
        currentEnd -= list.child(currentIndex).nodeSize;
        transaction.delete(currentEnd - 1, currentEnd + 1);
        currentIndex--;
    }
}

/**
 * Creates the slice content for lifting a list item out of a list.
 *
 * Constructs a fragment to be used as the slice content when lifting an item.
 * Creates empty list nodes to close or preserve the list structure at the
 * boundaries depending on whether the lifted item is at the start or end.
 *
 * @param list - The list node being modified
 * @param atStart - True if the lifted item is at the start of the list
 * @param atEnd - True if the lifted item is at the end of the list
 * @returns A fragment containing the appropriate list structure boundaries
 */
function createLiftSlice(list: Node, atStart: boolean, atEnd: boolean): Fragment {
    const startFragment: Fragment = atStart
        ? Fragment.empty
        : Fragment.from(list.copy(Fragment.empty));

    const endFragment: Fragment = atEnd
        ? Fragment.empty
        : Fragment.from(list.copy(Fragment.empty));

    return startFragment.append(endFragment);
}
