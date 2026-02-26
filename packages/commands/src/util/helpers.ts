import { isUndefinedOrNull } from '@type-editor/commons';
import type {
    DispatchFunction,
    PmEditorState,
    PmEditorView,
    PmSelection,
    PmTransaction,
} from '@type-editor/editor-types';
import {
    type ContentMatch,
    Fragment,
    type NodeRange,
    type NodeType,
    type PmNode,
    type ResolvedPos,
    Slice,
} from '@type-editor/model';
import { Selection } from '@type-editor/state';
import { canJoin, liftTarget, ReplaceAroundStep } from '@type-editor/transform';


/**
 * Checks if the cursor is at the start of a textblock.
 *
 * This function determines whether the selection is a cursor positioned at the
 * very beginning of a textblock. It uses the view (if provided) for accurate
 * bidirectional text detection, which is important for languages with right-to-left
 * text direction.
 *
 * @param state - The current editor state
 * @param view - Optional editor view for bidirectional text detection
 * @returns The cursor position if at block start, null otherwise
 */
export function atBlockStart(state: PmEditorState, view?: PmEditorView): ResolvedPos | null {
    const {$cursor} = state.selection;

    // Only works with cursor selections
    if (!$cursor) {
        return null;
    }

    // Check if we're truly at the start of the textblock
    const isAtStart: boolean = view
        ? view.endOfTextblock('backward', state)
        : $cursor.parentOffset === 0;

    if (!isAtStart) {
        return null;
    }

    return $cursor;
}

/**
 * Checks if the cursor is at the end of a textblock.
 *
 * This function determines whether the selection is a cursor positioned at the
 * very end of a textblock. It uses the view (if provided) for accurate
 * bidirectional text detection, which is important for languages with right-to-left
 * text direction.
 *
 * @param state - The current editor state
 * @param view - Optional editor view for bidirectional text detection
 * @returns The cursor position if at block end, null otherwise
 */
export function atBlockEnd(state: PmEditorState, view?: PmEditorView): ResolvedPos | null {
    const {$cursor} = state.selection;

    // Only works with cursor selections
    if (!$cursor) {
        return null;
    }

    // Check if we're truly at the end of the textblock
    const isAtEnd: boolean = view
        ? view.endOfTextblock('forward', state)
        : $cursor.parentOffset >= $cursor.parent.content.size;

    if (!isAtEnd) {
        return null;
    }

    return $cursor;
}

/**
 * Finds the position where a backward cut/join operation should occur.
 *
 * This function traverses up the document tree from the given position to find
 * the nearest position where content can be joined or cut backward. It stops at
 * isolating nodes (nodes marked with `isolating: true` in their spec), which
 * prevent content from being joined across their boundaries.
 *
 * The function looks for the first ancestor level where there's a sibling node
 * before the current position, indicating a valid cut point.
 *
 * @param $pos - The position to start searching from
 * @returns The position where a backward cut can occur, or null if none found
 */
export function findCutBefore($pos: ResolvedPos): ResolvedPos | null {
    // Can't cut if the parent is isolating
    if ($pos.parent.type.spec.isolating) {
        return null;
    }

    // Traverse up the tree to find a cut point
    for (let depth = $pos.depth - 1; depth >= 0; depth--) {
        // Found a position with a sibling before it
        if ($pos.index(depth) > 0) {
            return $pos.doc.resolve($pos.before(depth + 1));
        }

        // Stop at isolating nodes
        if ($pos.node(depth).type.spec.isolating) {
            break;
        }
    }

    return null;
}

/**
 * Finds the position where a forward cut/join operation should occur.
 *
 * This function traverses up the document tree from the given position to find
 * the nearest position where content can be joined or cut forward. It stops at
 * isolating nodes (nodes marked with `isolating: true` in their spec), which
 * prevent content from being joined across their boundaries.
 *
 * The function looks for the first ancestor level where there's a sibling node
 * after the current position, indicating a valid cut point.
 *
 * @param $pos - The position to start searching from
 * @returns The position where a forward cut can occur, or null if none found
 */
export function findCutAfter($pos: ResolvedPos): ResolvedPos | null {
    // Can't cut if the parent is isolating
    if ($pos.parent.type.spec.isolating) {
        return null;
    }

    // Traverse up the tree to find a cut point
    for (let depth = $pos.depth - 1; depth >= 0; depth--) {
        const parent: PmNode = $pos.node(depth);

        // Found a position with a sibling after it
        if ($pos.index(depth) + 1 < parent.childCount) {
            return $pos.doc.resolve($pos.after(depth + 1));
        }

        // Stop at isolating nodes
        if (parent.type.spec.isolating) {
            break;
        }
    }

    return null;
}

/**
 * Checks if a node contains a textblock at its start or end.
 *
 * This function traverses down from the given node to determine if there's a
 * textblock accessible at the specified side. It navigates through the node
 * hierarchy following either first or last children depending on the side.
 *
 * @param node - The node to check
 * @param side - Which side to check: 'start' follows first children, 'end' follows last children
 * @param only - If true, only returns true if there's a single-child path to the textblock
 * @returns `true` if a textblock is found at the specified side, `false` otherwise
 *
 * @example
 * ```typescript
 * // Check if a blockquote starts with a textblock
 * const startsWithText = textblockAt(blockquoteNode, 'start');
 *
 * // Check if a list item ends with a single textblock
 * const endsWithOnlyText = textblockAt(listItemNode, 'end', true);
 * ```
 */
export function textblockAt(node: PmNode, side: 'start' | 'end', only = false): boolean {
    let current: PmNode | null = node;

    while (current) {
        // Found a textblock
        if (current.isTextblock) {
            return true;
        }

        // If we're checking for "only" path and there are multiple children, fail
        if (only && current.childCount !== 1) {
            return false;
        }

        // Move to the next child in the appropriate direction
        current = side === 'start' ? current.firstChild : current.lastChild;
    }

    return false;
}

/**
 * Attempts to join or delete nodes around a position.
 *
 * This function implements a smart joining strategy that handles two cases:
 *
 * 1. **Delete Empty Node**: If the node before is empty and can be deleted, remove it
 * 2. **Join Nodes**: If the nodes can be joined, join them
 *
 * The function only works if the nodes before and after have compatible content types,
 * ensuring that the join operation makes sense structurally.
 *
 * @param state - The current editor state
 * @param $pos - The position between the nodes to join
 * @param dispatch - Optional dispatch function to execute the transaction
 * @returns `true` if an operation was performed, `false` otherwise
 */
function joinMaybeClear(state: PmEditorState,
                        $pos: ResolvedPos,
                        dispatch?: DispatchFunction): boolean {
    const before: PmNode = $pos.nodeBefore;
    const after: PmNode = $pos.nodeAfter;
    const index: number = $pos.index();

    // Can only join if both nodes exist and have compatible content
    if (!before || !after || !before.type.compatibleContent(after.type)) {
        return false;
    }

    // Strategy 1: Delete empty node before
    if (before.content.size === 0 && $pos.parent.canReplace(index - 1, index)) {
        if (dispatch) {
            const deleteFrom: number = $pos.pos - before.nodeSize;
            const deleteTo: number = $pos.pos;
            dispatch(state.transaction.delete(deleteFrom, deleteTo).scrollIntoView());
        }
        return true;
    }

    // Strategy 2: Join the nodes
    const canPerformJoin: boolean =
        $pos.parent.canReplace(index, index + 1) &&
        (after.isTextblock || canJoin(state.doc, $pos.pos));

    if (!canPerformJoin) {
        return false;
    }

    if (dispatch) {
        dispatch(state.transaction.join($pos.pos).scrollIntoView());
    }

    return true;
}

/**
 * Attempts to wrap the after node and move it into the before node.
 *
 * This strategy finds a wrapping structure that makes the after node compatible
 * with the before node's content, then wraps and moves it.
 *
 * @param state - The current editor state
 * @param $cut - The position between the nodes
 * @param before - The node before the cut
 * @param after - The node after the cut
 * @param dispatch - Optional dispatch function
 * @returns `true` if the operation succeeded, `false` otherwise
 */
function tryWrapAndMerge(state: PmEditorState,
                         $cut: ResolvedPos,
                         before: PmNode,
                         after: PmNode,
                         dispatch?: DispatchFunction): boolean {
    const match: ContentMatch = before.contentMatchAt(before.childCount);
    const nodeTypes: ReadonlyArray<NodeType> = match?.findWrapping(after.type);

    // Check if we found a valid wrapping and it results in a valid end state
    if (!nodeTypes || !match?.matchType(nodeTypes[0] || after.type)?.validEnd) {
        return false;
    }

    if (dispatch) {
        const end: number = $cut.pos + after.nodeSize;

        // Build the wrapping structure
        let wrap: Fragment = Fragment.empty;
        for (let i = nodeTypes.length - 1; i >= 0; i--) {
            wrap = Fragment.from(nodeTypes[i].create(null, wrap));
        }
        wrap = Fragment.from(before.copy(wrap));

        // Create the replace step
        const replaceStep = new ReplaceAroundStep(
            $cut.pos - 1,
            end,
            $cut.pos,
            end,
            new Slice(wrap, 1, 0),
            nodeTypes.length,
            true
        );

        const transaction: PmTransaction = state.transaction.step(replaceStep);

        // Try to join the result if possible
        const $joinAt: ResolvedPos = transaction.doc.resolve(end + 2 * nodeTypes.length);
        if ($joinAt.nodeAfter?.type === before.type
            && canJoin(transaction.doc, $joinAt.pos)) {

            transaction.join($joinAt.pos);
        }

        dispatch(transaction.scrollIntoView());
    }

    return true;
}

/**
 * Attempts to lift the content after the cut position.
 *
 * This strategy tries to reduce nesting by lifting the content that comes after
 * the cut position up in the document hierarchy.
 *
 * @param state - The current editor state
 * @param $cut - The position where the cut occurs
 * @param after - The node after the cut
 * @param direction - Direction of operation (-1 for backward, 1 for forward)
 * @param isolated - Whether nodes are isolated
 * @param dispatch - Optional dispatch function
 * @returns `true` if lifting succeeded, `false` otherwise
 */
function tryLiftAfter(state: PmEditorState,
                      $cut: ResolvedPos,
                      after: PmNode,
                      direction: number,
                      isolated: boolean,
                      dispatch?: DispatchFunction): boolean {
    // Can't lift if after is isolating, or if we're going forward and either node is isolating
    if (after.type.spec.isolating || (direction > 0 && isolated)) {
        return false;
    }

    const selAfter: PmSelection = Selection.findFrom($cut, 1);
    if (!selAfter) {
        return false;
    }

    const range: NodeRange = selAfter.$from.blockRange(selAfter.$to);
    const target: number = range && liftTarget(range);

    // Check if we can lift at this position
    if (isUndefinedOrNull(target) || target < $cut.depth) {
        return false;
    }

    if (dispatch) {
        dispatch(state.transaction.lift(range, target).scrollIntoView());
    }

    return true;
}

/**
 * Attempts to join textblocks by traversing down to find them.
 *
 * This strategy finds the innermost textblocks before and after the cut position
 * and attempts to join them, even if they're nested in different structures.
 *
 * @param state - The current editor state
 * @param $cut - The position where the cut occurs
 * @param before - The node before the cut
 * @param after - The node after the cut
 * @param dispatch - Optional dispatch function
 * @returns `true` if textblocks were joined, `false` otherwise
 */
function tryJoinTextblocks(state: PmEditorState,
                           $cut: ResolvedPos,
                           before: PmNode,
                           after: PmNode,
                           dispatch?: DispatchFunction): boolean {
    // Only works if both sides have textblocks in specific positions
    if (!textblockAt(after, 'start', true) || !textblockAt(before, 'end')) {
        return false;
    }

    // Build the path to the textblock before
    const wrapPath: Array<PmNode> = [];
    let current: PmNode | null = before;

    while (current) {
        wrapPath.push(current);
        if (current.isTextblock) {
            break;
        }

        const next: PmNode = current.lastChild;
        if (!next) {
            // Can't find a textblock, path is invalid
            return false;
        }
        current = next;
    }

    // Find the textblock after and its depth
    let afterText: PmNode | null = after;
    let afterDepth = 1;

    while (afterText && !afterText.isTextblock) {
        const next = afterText.firstChild;
        if (!next) {
            // Can't find a textblock
            return false;
        }
        afterText = next;
        afterDepth++;
    }

    // Check if we can merge the textblock content
    const lastTextblock: PmNode = wrapPath[wrapPath.length - 1];
    if (!lastTextblock.canReplace(lastTextblock.childCount, lastTextblock.childCount, afterText.content)) {
        return false;
    }

    if (dispatch) {
        // Build the wrapping structure
        let endFragment: Fragment = Fragment.empty;
        for (let i = wrapPath.length - 1; i >= 0; i--) {
            endFragment = Fragment.from(wrapPath[i].copy(endFragment));
        }

        // Create the replace step
        const replaceStep = new ReplaceAroundStep(
            $cut.pos - wrapPath.length,
            $cut.pos + after.nodeSize,
            $cut.pos + afterDepth,
            $cut.pos + after.nodeSize - afterDepth,
            new Slice(endFragment, wrapPath.length, 0),
            0,
            true
        );

        const transaction: PmTransaction = state.transaction.step(replaceStep);
        dispatch(transaction.scrollIntoView());
    }

    return true;
}

/**
 * Attempts to delete or join nodes separated by a structural barrier.
 *
 * This is a complex function that implements multiple strategies for handling
 * deletion or joining when there's a structural barrier (like different node types
 * or isolating nodes) between content. It tries several approaches in order:
 *
 * 1. **Simple Join**: Try basic joining if nodes are compatible
 * 2. **Wrap and Merge**: Wrap the after node to make it compatible, then merge
 * 3. **Lift**: Lift the after content up in the hierarchy
 * 4. **Join Textblocks**: Find and join inner textblocks across the barrier
 *
 * This function is used by backward and forward joining commands to handle
 * complex structural scenarios that simple joining can't handle.
 *
 * @param state - The current editor state
 * @param $cut - The position where the barrier exists
 * @param dispatch - Optional dispatch function to execute the transaction
 * @param direction - Direction of operation (-1 for backward, 1 for forward)
 * @returns `true` if any strategy succeeded, `false` otherwise
 */
export function deleteBarrier(state: PmEditorState,
                              $cut: ResolvedPos,
                              dispatch: DispatchFunction | undefined,
                              direction: number): boolean {
    const before: PmNode = $cut.nodeBefore;
    const after: PmNode = $cut.nodeAfter;

    if (!before || !after) {
        return false;
    }

    const isolated: boolean = before.type.spec.isolating || after.type.spec.isolating;

    // Strategy 1: Try simple joining if not isolated
    if (!isolated && joinMaybeClear(state, $cut, dispatch)) {
        return true;
    }

    // Check if we can delete/replace the after node
    const canDeleteAfter: boolean = !isolated && $cut.parent.canReplace($cut.index(), $cut.index() + 1);

    // Strategy 2: Try wrapping and merging
    if (canDeleteAfter && tryWrapAndMerge(state, $cut, before, after, dispatch)) {
        return true;
    }

    // Strategy 3: Try lifting the after content
    if (tryLiftAfter(state, $cut, after, direction, isolated, dispatch)) {
        return true;
    }

    // Strategy 4: Try joining inner textblocks
    if (canDeleteAfter && tryJoinTextblocks(state, $cut, before, after, dispatch)) {
        return true;
    }

    return false;
}

