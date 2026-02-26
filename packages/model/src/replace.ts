import {Fragment} from './elements/Fragment';
import type {Node as PmNode} from './elements/Node';
import type {ResolvedPos} from './elements/ResolvedPos';
import type {Slice} from './elements/Slice';
import type {TextNode} from './elements/TextNode';


/**
 * Error type raised by [`Node.replace`](#model.Node.replace) when
 * given an invalid replacement.
 *
 * This error is thrown when:
 * - The slice's open depth is deeper than the insertion position
 * - The open depths are inconsistent between start and end positions
 * - Attempting to join incompatible node types
 * - The range to remove or replace is not "flat" (spans incompatible node boundaries)
 *
 * @example
 * ```typescript
 * try {
 *   node.replace(from, to, slice);
 * } catch (error) {
 *   if (error instanceof ReplaceError) {
 *     console.error('Invalid replacement:', error.message);
 *   }
 * }
 * ```
 */
export class ReplaceError extends Error {
}


/**
 * Replace a range of content between two resolved positions with a slice.
 * This is the main entry point for performing document replacements.
 *
 * @param $from The resolved position where the replacement starts.
 * @param $to The resolved position where the replacement ends.
 * @param slice The slice to insert between the positions.
 * @returns The root node with the replacement applied.
 * @throws {ReplaceError} If the slice's open depth is invalid or inconsistent with the positions.
 */
export function replace($from: ResolvedPos, $to: ResolvedPos, slice: Slice): PmNode {
    if (slice.openStart > $from.depth) {
        throw new ReplaceError('Inserted content deeper than insertion position');
    }
    if ($from.depth - slice.openStart !== $to.depth - slice.openEnd) {
        throw new ReplaceError('Inconsistent open depths');
    }
    return replaceOuter($from, $to, slice, 0);
}

/**
 * Recursively replace content in a document tree, working from the outside in.
 * This function handles the outer layer of the replacement, determining which
 * replacement strategy to use based on the positions and slice properties.
 *
 * @param $from The resolved position where the replacement starts.
 * @param $to The resolved position where the replacement ends.
 * @param slice The slice to insert.
 * @param depth The current depth in the document tree.
 * @returns The node at the current depth with the replacement applied.
 */
function replaceOuter($from: ResolvedPos,
                      $to: ResolvedPos,
                      slice: Slice,
                      depth: number): PmNode {
    const index: number = $from.index(depth);
    const node: PmNode = $from.node(depth);

    // Case 1: Both positions are in the same child, recurse deeper
    if (index === $to.index(depth) && depth < $from.depth - slice.openStart) {
        const inner: PmNode = replaceOuter($from, $to, slice, depth + 1);
        return node.copy(node.content.replaceChild(index, inner));
    }

    // Case 2: Empty slice - just delete the range
    if (!slice.content.size) {
        return close(node, replaceTwoWay($from, $to, depth));
    }

    // Case 3: Simple, flat replacement at this depth level
    if (!slice.openStart && !slice.openEnd && $from.depth === depth && $to.depth === depth) {
        const parent: PmNode = $from.parent;
        const content: Fragment = parent.content;
        return close(parent, content.cut(0, $from.parentOffset).append(slice.content).append(content.cut($to.parentOffset)));
    }

    // Case 4: Complex replacement requiring three-way merge
    const {start, end} = prepareSliceForReplace(slice, $from);
    return close(node, replaceThreeWay($from, start, end, $to, depth));
}

/**
 * Verify that two nodes can be joined together.
 * Nodes can be joined if their content types are compatible.
 *
 * @param main The main node to join onto.
 * @param sub The sub node to join into the main node.
 * @throws {ReplaceError} If the nodes have incompatible content types.
 */
function checkJoin(main: PmNode, sub: PmNode): void {
    if (!sub.type.compatibleContent(main.type)) {
        throw new ReplaceError(`Cannot join ${sub.type.name} onto ${main.type.name} - incompatible content types`);
    }
}

/**
 * Check if two positions can be joined at a given depth and return the node at that depth.
 *
 * @param $before The position before the join point.
 * @param $after The position after the join point.
 * @param depth The depth at which to perform the join check.
 * @returns The node at the given depth from the before position.
 * @throws {ReplaceError} If the nodes at the positions cannot be joined.
 */
function joinable($before: ResolvedPos, $after: ResolvedPos, depth: number): PmNode {
    const node: PmNode = $before.node(depth);
    checkJoin(node, $after.node(depth));
    return node;
}

/**
 * Add a node to a target array, merging it with the last node if both are
 * text nodes with compatible markup.
 *
 * @param child The node to add.
 * @param target The array to add the node to.
 */
function addNode(child: PmNode, target: Array<PmNode>): void {
    const lastIndex: number = target.length - 1;
    const lastNode: PmNode | undefined = target[lastIndex];

    // Merge adjacent text nodes with same markup
    if (lastIndex >= 0 && child.isText && lastNode && child.sameMarkup(lastNode)) {
        target[lastIndex] = (child as TextNode).withText(lastNode.text + child.text);
    } else {
        target.push(child);
    }
}

/**
 * Add a range of nodes between two resolved positions to a target array.
 * Handles text offsets and properly extracts nodes at the given depth.
 *
 * @param $start The starting position of the range, or null to start from the beginning.
 * @param $end The ending position of the range, or null to go to the end.
 * @param depth The depth at which to extract nodes.
 * @param target The array to add nodes to.
 */
function addRange($start: ResolvedPos | null,
                  $end: ResolvedPos | null,
                  depth: number,
                  target: Array<PmNode>): void {
    // At least one of $start or $end must be non-null
    const referencePos: ResolvedPos = $end || $start;
    if (!referencePos) {
        return;
    }

    const node: PmNode = referencePos.node(depth);
    let startIndex = 0;
    const endIndex: number = $end ? $end.index(depth) : node.childCount;

    if ($start) {
        startIndex = $start.index(depth);

        // If start position is deeper, skip the first child (we're inside it)
        if ($start.depth > depth) {
            startIndex++;
        } else if ($start.textOffset) {
            // If we're in the middle of a text node, add the part after the offset
            const nodeAfter = $start.nodeAfter;
            if (nodeAfter) {
                addNode(nodeAfter, target);
            }
            startIndex++;
        }
    }

    // Add all complete nodes in the range
    for (let i = startIndex; i < endIndex; i++) {
        addNode(node.child(i), target);
    }

    // If end position has a text offset, add the part before it
    if ($end?.depth === depth && $end.textOffset) {
        const nodeBefore: PmNode = $end.nodeBefore;
        if (nodeBefore) {
            addNode(nodeBefore, target);
        }
    }
}

/**
 * Create a copy of a node with new content, verifying that the content is valid.
 *
 * @param node The node to copy.
 * @param content The new content for the node.
 * @returns A new node with the given content.
 * @throws {Error} If the content doesn't match the node's content constraints.
 */
function close(node: PmNode, content: Fragment): PmNode {
    node.type.checkContent(content);
    return node.copy(content);
}

/**
 * Perform a three-way replacement, merging content from before, within, and after
 * the replacement range. This handles cases where the slice has open nodes on both sides.
 *
 * @param $from The start position of the original range.
 * @param $start The start position of the slice content.
 * @param $end The end position of the slice content.
 * @param $to The end position of the original range.
 * @param depth The current depth in the document tree.
 * @returns A fragment with the three-way replacement applied.
 */
function replaceThreeWay($from: ResolvedPos,
                         $start: ResolvedPos,
                         $end: ResolvedPos,
                         $to: ResolvedPos,
                         depth: number): Fragment {
    // Check if we need to join open nodes at start and end
    const openStartNode: PmNode | false = $from.depth > depth && joinable($from, $start, depth + 1);
    const openEndNode: PmNode | false = $to.depth > depth && joinable($end, $to, depth + 1);

    const content: Array<PmNode> = new Array<PmNode>();

    // Add nodes before the replacement
    addRange(null, $from, depth, content);

    // Handle the middle section
    if (openStartNode && openEndNode && $start.index(depth) === $end.index(depth)) {
        // Start and end are in the same position - merge everything in one recursive call
        checkJoin(openStartNode, openEndNode);
        addNode(close(openStartNode, replaceThreeWay($from, $start, $end, $to, depth + 1)), content);
    } else {
        // Start and end are in different positions - handle separately
        if (openStartNode) {
            addNode(close(openStartNode, replaceTwoWay($from, $start, depth + 1)), content);
        }

        addRange($start, $end, depth, content);

        if (openEndNode) {
            addNode(close(openEndNode, replaceTwoWay($end, $to, depth + 1)), content);
        }
    }

    // Add nodes after the replacement
    addRange($to, null, depth, content);
    return new Fragment(content);
}

/**
 * Perform a two-way replacement, merging content from before and after a range.
 * This handles cases where we're deleting content or where the slice doesn't
 * introduce new structure at this depth.
 *
 * @param $from The start position of the range.
 * @param $to The end position of the range.
 * @param depth The current depth in the document tree.
 * @returns A fragment with the two-way replacement applied.
 */
function replaceTwoWay($from: ResolvedPos, $to: ResolvedPos, depth: number): Fragment {
    const content: Array<PmNode> = new Array<PmNode>();

    // Add nodes before the range
    addRange(null, $from, depth, content);

    // If positions go deeper, recursively merge at the next level
    if ($from.depth > depth) {
        const joinNode: PmNode = joinable($from, $to, depth + 1);
        addNode(close(joinNode, replaceTwoWay($from, $to, depth + 1)), content);
    }

    // Add nodes after the range
    addRange($to, null, depth, content);
    return new Fragment(content);
}

/**
 * Prepare a slice for replacement by wrapping it in the appropriate parent nodes
 * and resolving positions within the wrapped structure.
 *
 * @param slice The slice to prepare.
 * @param $along A resolved position that provides the parent context.
 * @returns An object containing the start and end resolved positions within the prepared structure.
 */
function prepareSliceForReplace(slice: Slice, $along: ResolvedPos): { start: ResolvedPos; end: ResolvedPos } {
    const extra: number = $along.depth - slice.openStart;
    const parent: PmNode = $along.node(extra);
    let node: PmNode = parent.copy(slice.content);

    // Wrap the slice content in the necessary parent nodes
    for (let i = extra - 1; i >= 0; i--) {
        node = $along.node(i).copy(Fragment.from(node));
    }

    // Resolve positions within the wrapped structure
    return {
        start: node.resolveNoCache(slice.openStart + extra),
        end: node.resolveNoCache(node.content.size - slice.openEnd - extra)
    };
}
