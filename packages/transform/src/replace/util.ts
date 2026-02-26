import type {ResolvedPos, Slice} from '@type-editor/model';

/**
 * Returns an array of all depths for which $from - $to spans the
 * whole content of the nodes at that depth.
 *
 * @param $from - Resolved start position
 * @param $to - Resolved end position
 * @returns Array of depths that are fully covered
 */
export function coveredDepths($from: ResolvedPos, $to: ResolvedPos): Array<number> {
    const result: Array<number> = [];
    const minDepth: number = Math.min($from.depth, $to.depth);

    for (let depth = minDepth; depth >= 0; depth--) {
        // Stop if we encounter isolating nodes or incomplete coverage
        if (shouldStopAtDepth($from, $to, depth)) {
            break;
        }

        // Add depth if it's fully covered
        if (isDepthFullyCovered($from, $to, depth)) {
            result.push(depth);
        }
    }

    return result;
}

/**
 * Check if we should stop scanning at this depth.
 *
 * @param $from - Resolved start position
 * @param $to - Resolved end position
 * @param depth - Depth to check
 * @returns True if we should stop at this depth
 */
function shouldStopAtDepth($from: ResolvedPos,
                           $to: ResolvedPos,
                           depth: number): boolean {
    const start: number = $from.start(depth);

    // Check if the range doesn't fully cover this depth
    const incompleteCoverage: boolean =
        start < $from.pos - ($from.depth - depth) ||
        $to.end(depth) > $to.pos + ($to.depth - depth);

    if (incompleteCoverage) {
        return true;
    }

    // Check for isolating nodes
    return $from.node(depth).type.spec.isolating || $to.node(depth).type.spec.isolating;
}

/**
 * Check if the depth is fully covered by the range.
 *
 * @param $from - Resolved start position
 * @param $to - Resolved end position
 * @param depth - Depth to check
 * @returns True if the depth is fully covered
 */
function isDepthFullyCovered($from: ResolvedPos, $to: ResolvedPos, depth: number): boolean {
    const start: number = $from.start(depth);

    // Same start position means full coverage
    if (start === $to.start(depth)) {
        return true;
    }

    // Special case: inline content at the same depth where positions are adjacent
    return depth === $from.depth
        && depth === $to.depth
        && $from.parent.inlineContent
        && $to.parent.inlineContent
        && depth > 0
        && $to.start(depth - 1) === start - 1;
}

/**
 * Check if a slice fits trivially at the given position without needing complex fitting logic.
 *
 * @param $from - Resolved start position
 * @param $to - Resolved end position
 * @param slice - The slice to check
 * @returns True if the slice fits trivially
 */
export function fitsTrivially($from: ResolvedPos,
                              $to: ResolvedPos,
                              slice: Slice): boolean {
    return !slice.openStart
        && !slice.openEnd
        && $from.start() === $to.start()
        && $from.parent.canReplace($from.index(), $to.index(), slice.content);
}
