import type { Command, DispatchFunction, PmEditorState, PmTransaction } from '@type-editor/editor-types';
import {type Attrs, Fragment, type Node, type NodeType, type ResolvedPos, Slice} from '@type-editor/model';
import {Selection} from '@type-editor/state';
import {canSplit} from '@type-editor/transform';

/**
 * Build a command that splits a list item at the current selection position.
 *
 * This command handles two scenarios:
 * 1. Regular list item split: Splits the list item at the cursor position,
 *    creating a new list item below with the content after the cursor.
 * 2. Empty nested list item: When pressing enter in an empty nested list item,
 *    it lifts the item out of the nested list structure.
 *
 * @param itemType - The node type of the list item to split
 * @param itemAttrs - Optional attributes to apply to the newly created list item
 * @returns A command function that can be dispatched to the editor state
 */
export function splitListItem(itemType: NodeType, itemAttrs?: Attrs): Command {
    return (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
        const {$from, $to, node} = state.selection;

        if (!canSplitListItem($from, $to, node, itemType)) {
            return false;
        }

        // Handle empty nested list item
        if (isInEmptyNestedListItem($from, itemType)) {
            if (dispatch) {
                splitNestedEmptyListItem(state, dispatch, $from, itemType);
            }
            return true;
        }

        // If we're in an empty top-level list item, return false to allow
        // liftEmptyBlock to handle it (which will lift the item out of the list)
        if (isInEmptyTopLevelListItem($from)) {
            return false;
        }

        // Handle regular list item split
        const transaction: PmTransaction = state.transaction.delete($from.pos, $to.pos);
        const types = itemAttrs
            ? [{type: itemType, attrs: itemAttrs}, null]
            : undefined;

        if (!canSplit(transaction.doc, $from.pos, 2, types)) {
            return false;
        }

        if (dispatch) {
            dispatch(transaction.split($from.pos, 2, types).scrollIntoView());
        }

        return true;
    };
}


/**
 * Determines if the selection can be split as a list item.
 *
 * Validates that the selection meets the necessary criteria for splitting a list item:
 * - The selection must not be a block node
 * - The cursor must be at least 2 levels deep in the document tree
 * - The start and end of the selection must be in the same parent
 * - The grandparent node must be of the specified list item type
 *
 * @param $from - The resolved position at the start of the selection
 * @param $to - The resolved position at the end of the selection
 * @param node - The currently selected node, if any
 * @param itemType - The node type of the list item
 * @returns True if the selection can be split as a list item, false otherwise
 */
function canSplitListItem($from: ResolvedPos,
                          $to: ResolvedPos,
                          node: Node | null,
                          itemType: NodeType): boolean {
    if (node?.isBlock || $from.depth < 2 || !$from.sameParent($to)) {
        return false;
    }

    const grandParent: Node = $from.node(-1);
    return grandParent.type === itemType;
}

/**
 * Checks if the cursor is in an empty block at the end of a nested list.
 *
 * This function determines whether we're at a position where an Enter keypress
 * should lift the item out of the nested list structure rather than creating
 * a new list item. This happens when:
 * - The current block is empty
 * - We're at the last position in the parent list item
 * - We're at least 3 levels deep (indicating nesting)
 * - The ancestor at depth -3 is a list item of the specified type
 * - We're at the last item in the parent list
 *
 * @param $from - The resolved position at the cursor location
 * @param itemType - The node type of the list item
 * @returns True if the cursor is in an empty nested list item that should be lifted, false otherwise
 */
function isInEmptyNestedListItem($from: ResolvedPos, itemType: NodeType): boolean {
    const isEmptyBlock: boolean =
        $from.parent.content.size === 0
        && $from.node(-1).childCount === $from.indexAfter(-1);

    if (!isEmptyBlock) {
        return false;
    }

    return $from.depth >= 3
        && $from.node(-3).type === itemType
        && $from.index(-2) === $from.node(-2).childCount - 1;
}

/**
 * Checks if the cursor is in an empty block in a top-level list item.
 *
 * This function determines whether we're at a position where an Enter keypress
 * should lift the empty list item out of the list entirely (converting it to
 * a paragraph). This happens when:
 * - The current block (paragraph) is empty
 * - We're at the last position in the parent list item
 *
 * @param $from - The resolved position at the cursor location
 * @returns True if the cursor is in an empty top-level list item, false otherwise
 */
function isInEmptyTopLevelListItem($from: ResolvedPos): boolean {
    return $from.parent.content.size === 0
        && $from.node(-1).childCount === $from.indexAfter(-1);
}


/**
 * Handles splitting a nested empty list item by lifting it out of its parent list.
 *
 * This function creates a transaction that transforms an empty nested list item
 * into a new list item at the parent list level. It reconstructs the document
 * structure by:
 * 1. Building a fragment that preserves the structure up to the split point
 * 2. Creating a new empty list item at the appropriate level
 * 3. Replacing the original nested structure with the new flattened structure
 * 4. Positioning the cursor in the newly created empty list item
 *
 * @param state - The current editor state
 * @param dispatch - Function to dispatch the transaction to apply changes
 * @param $from - The resolved position at the cursor location
 * @param itemType - The node type of the list item to create
 */
function splitNestedEmptyListItem(state: PmEditorState,
                                  dispatch: DispatchFunction,
                                  $from: ResolvedPos,
                                  itemType: NodeType): void {
    let wrap: Fragment = Fragment.empty;
    const depthBefore: number = calculateDepthBefore($from);

    // Build a fragment containing empty versions of the structure
    // from the outer list item to the parent node of the cursor
    for (let depth = $from.depth - depthBefore; depth >= $from.depth - 3; depth--) {
        wrap = Fragment.from($from.node(depth).copy(wrap));
    }

    const depthAfter: number = calculateDepthAfter($from);

    // Add a second list item with an empty default start node
    wrap = wrap.append(Fragment.from(itemType.createAndFill()));
    const start: number = $from.before($from.depth - (depthBefore - 1));
    const transaction: PmTransaction = state.transaction.replace(
        start,
        $from.after(-depthAfter),
        new Slice(wrap, 4 - depthBefore, 0)
    );

    const selectionPos: number = findEmptyTextblock(transaction, start);

    if (selectionPos > -1) {
        transaction.setSelection(Selection.near(transaction.doc.resolve(selectionPos)));
    }

    dispatch(transaction.scrollIntoView());
}

/**
 * Calculates the depth offset before the split position.
 *
 * Determines how many levels deep to traverse when building the fragment
 * structure before the cursor position. The depth depends on the position
 * of the cursor within its parent nodes:
 * - Returns 1 if the cursor is not at the first position in its immediate parent
 * - Returns 2 if at first position in immediate parent but not in grandparent
 * - Returns 3 if at first position in both parent and grandparent
 *
 * @param $from - The resolved position at the cursor location
 * @returns The depth offset (1, 2, or 3) before the split position
 */
function calculateDepthBefore($from: ResolvedPos): number {
    if ($from.index(-1)) {
        return 1;
    }
    if ($from.index(-2)) {
        return 2;
    }
    return 3;
}

/**
 * Calculates the depth offset after the split position.
 *
 * Determines how many levels deep to traverse when determining the end
 * position for the replacement operation. The depth depends on whether
 * there are more siblings after the cursor:
 * - Returns 1 if there are more siblings in the immediate parent after the cursor
 * - Returns 2 if no more siblings in immediate parent but more in grandparent
 * - Returns 3 if at the last position in both parent and grandparent
 *
 * @param $from - The resolved position at the cursor location
 * @returns The depth offset (1, 2, or 3) after the split position
 */
function calculateDepthAfter($from: ResolvedPos): number {
    if ($from.indexAfter(-1) < $from.node(-2).childCount) {
        return 1;
    }
    if ($from.indexAfter(-2) < $from.node(-3).childCount) {
        return 2;
    }
    return 3;
}

/**
 * Finds the first empty textblock in the document after a given position.
 *
 * This function traverses the document tree starting from a given position
 * to locate the first textblock node that has no content. This is used to
 * position the cursor in the newly created empty list item after splitting.
 *
 * @param transaction - The transaction containing the document to search
 * @param startPos - The position in the document to start searching from
 * @returns The position (plus 1) of the first empty textblock found, or -1 if none is found
 */
function findEmptyTextblock(transaction: PmTransaction, startPos: number): number {
    let position = -1;

    transaction.doc.nodesBetween(
        startPos,
        transaction.doc.content.size,
        (node: Node, pos: number): boolean => {
            if (position > -1) {
                return false;
            }

            if (node.isTextblock && node.content.size === 0) {
                position = pos + 1;
            }

            return true;
        }
    );

    return position;
}
