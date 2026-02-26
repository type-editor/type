import type {Node, ResolvedPos} from '@type-editor/model';


/**
 * Determines if a change looks like a backspace operation (joining or deleting blocks).
 *
 * This function performs a sophisticated analysis to detect if a change resulted from
 * a backspace operation. Backspace can either delete an entire block or join two blocks
 * together. The detection helps determine if the change should be delegated to the
 * Backspace key handler instead of being processed as a regular DOM change.
 *
 * **Detection Logic:**
 *
 * 1. **Content must have shrunk:** The old content range must be larger than the new range
 * 2. **Valid end position:** The new end position must be at or after the block boundary
 * 3. **Block deletion:** If not in a textblock, check if an entire block was removed
 * 4. **Block join:** If in a textblock, verify:
 *    - Start is at the end of a textblock
 *    - Next textblock exists and was joined
 *    - Content after join point matches
 *
 * The function uses internal helpers to navigate block boundaries and verify
 * that the structure matches a backspace operation pattern.
 *
 * @param old - The old (before change) document
 * @param start - Start position of the change in the old document
 * @param end - End position of the change in the old document
 * @param $newStart - Resolved start position in the new (after change) document
 * @param $newEnd - Resolved end position in the new (after change) document
 * @returns True if the change pattern matches a backspace operation
 *          (either block deletion or block join), false otherwise
 */
export function looksLikeBackspace(old: Node,
                                   start: number,
                                   end: number,
                                   $newStart: ResolvedPos,
                                   $newEnd: ResolvedPos): boolean {
    // The content must have shrunk
    const contentShrunk: boolean = end - start > $newEnd.pos - $newStart.pos;

    // newEnd must point directly at or after the end of the block that newStart points into
    const validEndPosition: boolean = skipClosingAndOpening($newStart, true, false) >= $newEnd.pos;

    if (!contentShrunk || !validEndPosition) {
        return false;
    }

    const $start: ResolvedPos = old.resolve(start);

    // Handle the case where an entire block was removed (not a join)
    if (!$newStart.parent.isTextblock) {
        const after: Node = $start.nodeAfter;
        return after !== null && end === start + after.nodeSize;
    }

    // Start must be at the end of a textblock for a join operation
    const atBlockEnd: boolean = $start.parentOffset === $start.parent.content.size;
    if (!atBlockEnd || !$start.parent.isTextblock) {
        return false;
    }

    // Find the next textblock that was joined
    const $next: ResolvedPos = old.resolve(skipClosingAndOpening($start, true, true));

    // The next textblock must start before end and end near it
    const nextIsValid: boolean =
        $next.parent.isTextblock
        && $next.pos <= end
        && skipClosingAndOpening($next, true, false) >= end;

    if (!nextIsValid) {
        return false;
    }

    // The fragments after the join point must match
    return $newStart.parent.content.cut($newStart.parentOffset).eq($next.parent.content);
}


/**
 * Calculates a position by skipping closing and optionally opening nodes.
 *
 * This utility function navigates through the document tree structure to find
 * positions at block boundaries. It's used primarily in backspace detection to
 * determine where blocks start and end.
 *
 * **Closing Node Skip:**
 * Starting from a position, moves up the tree (decreasing depth) as long as we're
 * at the end of nodes. Each level up adds 1 to the position (for the closing token).
 *
 * **Opening Node Descent (optional):**
 * If mayOpen is true, descends into the next sibling node, going as deep as possible
 * through firstChild until reaching a leaf. Each level down adds 1 to the position
 * (for the opening token).
 *
 * This is particularly useful for finding where one block ends and the next begins,
 * which is essential for detecting block joins in backspace operations.
 *
 * @param $pos - The resolved position to start from
 * @param fromEnd - Whether to start from the end of the position (true) or the
 *                  current position (false). When true, uses $pos.end()
 * @param mayOpen - Whether to descend into the next opening node after skipping
 *                  closing nodes. When true, finds the start of the next block.
 * @returns The calculated position after skipping closing (and optionally opening) nodes
 *
 * @example
 * ```typescript
 * // Find the end of the current block and start of next block
 * const nextBlockStart = skipClosingAndOpening($pos, true, true);
 *
 * // Find just past the current block
 * const afterBlock = skipClosingAndOpening($pos, true, false);
 * ```
 */
function skipClosingAndOpening($pos: ResolvedPos, fromEnd: boolean, mayOpen: boolean): number {
    let depth = $pos.depth;
    let end = fromEnd ? $pos.end() : $pos.pos;

    // Skip closing nodes (move up the tree)
    while (depth > 0 && (fromEnd || $pos.indexAfter(depth) === $pos.node(depth).childCount)) {
        depth--;
        end++;
        fromEnd = false;
    }

    // Optionally descend into opening nodes
    if (mayOpen) {
        let next: Node = $pos.node(depth).maybeChild($pos.indexAfter(depth));
        while (next && !next.isLeaf) {
            next = next.firstChild;
            end++;
        }
    }

    return end;
}
