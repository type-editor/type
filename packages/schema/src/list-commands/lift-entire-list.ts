import { isUndefinedOrNull } from '@type-editor/commons';
import type { DispatchFunction, PmEditorState, PmTransaction } from '@type-editor/editor-types';
import { Fragment, type Node, NodeRange, type NodeType, type PmNode, type ResolvedPos, Slice } from '@type-editor/model';
import { canJoin, liftTarget, ReplaceAroundStep } from '@type-editor/transform';
import type { FindParentResult } from '@type-editor/util';

// Threshold for number of list items above which we use the fast path
const FAST_PATH_THRESHOLD = 50;


/**
 * Lifts an entire list out, unwrapping all list items.
 *
 * This function creates a NodeRange covering ALL list items in the enclosing list,
 * then lifts them all out at once. If the list is nested inside another list,
 * the items become items of the outer list. If it's a top-level list, the items
 * are unwrapped back to regular blocks.
 *
 * @param state - The current editor state
 * @param dispatch - Optional dispatch function to execute the transaction
 * @param enclosingList - The result from findParentByType containing the list node and position
 * @returns True if the lift operation is possible/successful, false otherwise
 */
export function liftEntireList(state: PmEditorState,
                               dispatch: DispatchFunction,
                               enclosingList: FindParentResult): boolean {
    const listNode: Node = enclosingList.node;
    const listPos: number = enclosingList.position.pos;

    if (listNode.childCount === 0) {
        return false;
    }

    // Create positions that span the entire list content
    // $from: start of first list item (listPos + 1 is inside the list, at start of first child)
    // $to: end of last list item (listPos + nodeSize - 1 is inside the list, at end of last child)
    const doc: PmNode = state.doc;
    const $from: ResolvedPos = doc.resolve(listPos + 1);
    const $to: ResolvedPos = doc.resolve(listPos + listNode.nodeSize - 1);

    // Get the list item type from the first child
    const listItemType: NodeType = listNode.firstChild.type;

    // Create a range covering all list items
    // The predicate finds a node whose children are list items
    const range: NodeRange = $from.blockRange(
        $to,
        (node: Node): boolean => node.childCount > 0 && node.firstChild.type === listItemType
    );

    if (!range) {
        return false;
    }

    if (!dispatch) {
        return true;
    }

    // Check if the list is nested inside another list item
    // If so, lift items to the outer list instead of unwrapping completely
    if ($from.node(range.depth - 1).type === listItemType) {
        return liftToOuterList(state, dispatch, listItemType, range);
    }

    // Top-level list: unwrap all items completely
    return liftOutOfList(state, dispatch, range);
}


/**
 * Lifts list items from a nested list to the outer list.
 *
 * When a list is nested inside a parent list item, this function lifts all items
 * from the inner list to become siblings in the outer list.
 *
 * @param state - The current editor state
 * @param dispatch - Function to dispatch the transaction
 * @param itemType - The node type of the list item being lifted
 * @param range - The node range containing the list items to lift
 * @returns True if the lift operation was successful, false otherwise
 */
function liftToOuterList(state: PmEditorState,
                         dispatch: DispatchFunction,
                         itemType: NodeType,
                         range: NodeRange): boolean {
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
 * Lifts list items completely out of their containing list.
 *
 * This function merges the list items into a single item and then
 * removes it from the list structure. The items' content replaces the list
 * at that position.
 *
 * @param state - The current editor state
 * @param dispatch - Function to dispatch the transaction
 * @param range - The node range containing ALL list items to lift out
 * @returns True if the lift operation was successful, false if the content cannot be replaced
 */
function liftOutOfList(state: PmEditorState,
                       dispatch: DispatchFunction,
                       range: NodeRange): boolean {
    const transaction: PmTransaction = state.transaction;
    const list: Node = range.parent;
    const itemCount = range.endIndex - range.startIndex;

    // Use fast path for large lists
    if (itemCount >= FAST_PATH_THRESHOLD) {
        return liftOutOfListFast(state, dispatch, range);
    }

    // Merge the list items into a single big item
    mergeListItems(transaction, list, range.startIndex, range.endIndex, range.end);

    const $start: ResolvedPos = transaction.doc.resolve(range.start);
    const item: Node = $start.nodeAfter;

    if (isUndefinedOrNull(item)) {
        return false;
    }

    if (transaction.mapping.map(range.end) !== range.start + item.nodeSize) {
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
 * Fast path for lifting list items out of a list.
 * Extracts all block content from list items in a single operation.
 *
 * @param state - The current editor state
 * @param dispatch - Function to dispatch the transaction
 * @param range - The node range containing ALL list items to lift out
 * @returns True if the lift operation was successful
 */
function liftOutOfListFast(state: PmEditorState,
                           dispatch: DispatchFunction,
                           range: NodeRange): boolean {
    const transaction: PmTransaction = state.transaction;
    const list: Node = range.parent;
    const atStart: boolean = range.startIndex === 0;
    const atEnd: boolean = range.endIndex === list.childCount;

    // Check if parent can accept the unwrapped content
    const $start: ResolvedPos = state.doc.resolve(range.start);
    const parent: Node = $start.node(-1);
    const indexBefore: number = $start.index(-1);

    // Collect all blocks from all list items
    const blocks: Array<Node> = [];
    for (let i = range.startIndex; i < range.endIndex; i++) {
        const listItem: PmNode = list.child(i);
        listItem.forEach((block: Node) => {
            blocks.push(block);
        });
    }

    const blocksFragment: Fragment = Fragment.from(blocks);

    const canReplaceContent: boolean = parent.canReplace(
        indexBefore + (atStart ? 0 : 1),
        indexBefore + 1,
        blocksFragment.append(atEnd ? Fragment.empty : Fragment.from(list))
    );

    if (!canReplaceContent) {
        // Fallback to standard path
        return liftOutOfListStandard(state, dispatch, range);
    }

    // Build the replacement content
    let content: Fragment;
    if (atStart && atEnd) {
        // Replacing the entire list with just the blocks
        content = blocksFragment;
    } else if (atStart) {
        // At start: blocks + empty list to close
        content = blocksFragment.append(Fragment.from(list.copy(Fragment.empty)));
    } else if (atEnd) {
        // At end: empty list to close + blocks
        content = Fragment.from(list.copy(Fragment.empty)).append(blocksFragment);
    } else {
        // In the middle: empty list + blocks + empty list
        content = Fragment.from(list.copy(Fragment.empty))
            .append(blocksFragment)
            .append(Fragment.from(list.copy(Fragment.empty)));
    }

    // Calculate positions for replacement
    // range.start is at the beginning of the first list item
    // We need to go one level up to include the list itself
    const listStart = range.start - 1; // Position before the list
    const listEnd = range.end + 1;     // Position after the list

    const slice = new Slice(content, atStart ? 0 : 1, atEnd ? 0 : 1);
    transaction.replace(listStart, listEnd, slice);

    dispatch(transaction.scrollIntoView());
    return true;
}

/**
 * Standard path for lifting list items (used as fallback and for small lists).
 */
function liftOutOfListStandard(state: PmEditorState,
                               dispatch: DispatchFunction,
                               range: NodeRange): boolean {
    const transaction: PmTransaction = state.transaction;
    const list: Node = range.parent;

    // Merge the list items into a single big item
    mergeListItems(transaction, list, range.startIndex, range.endIndex, range.end);

    const $start: ResolvedPos = transaction.doc.resolve(range.start);
    const item: Node = $start.nodeAfter;

    if (isUndefinedOrNull(item)) {
        return false;
    }

    if (transaction.mapping.map(range.end) !== range.start + item.nodeSize) {
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
