import {type PmNode, type ResolvedPos} from '@type-editor/model';

import {joinable} from './util';

/**
 * Find an ancestor of the given position that can be joined to the
 * block before (or after if `dir` is positive). Returns the joinable
 * point, if any.
 *
 * @param doc The document to search in.
 * @param pos The position to start searching from.
 * @param dir Direction to search: -1 for before (default), 1 for after.
 * @returns The position where a join can occur, or null if none found.
 */
export function joinPoint(doc: PmNode, pos: number, dir = -1): number | null {
    const $pos: ResolvedPos = doc.resolve(pos);
    let currentPos: number = pos;

    // Search from current depth up to root
    for (let depth = $pos.depth; depth >= 0; depth--) {
        const joinCandidate = findJoinCandidateAtDepth($pos, depth, dir);

        if (joinCandidate && canJoinNodes($pos, depth, joinCandidate)) {
            return currentPos;
        }

        // Stop at root level
        if (depth === 0) {
            break;
        }

        // Move position to next depth level
        currentPos = dir < 0 ? $pos.before(depth) : $pos.after(depth);
    }

    return null;
}

/**
 * Find nodes that are candidates for joining at a specific depth.
 * Determines which nodes should be considered for joining based on depth and direction.
 *
 * @param $pos The resolved position to search from.
 * @param depth The depth level to check.
 * @param dir Direction to search: -1 for before, 1 for after.
 * @returns An object with before/after nodes and index, or null if no candidates.
 */
function findJoinCandidateAtDepth($pos: ResolvedPos,
                                  depth: number,
                                  dir: number): { before: PmNode | null; after: PmNode | null; index: number } | null {
    let index: number = $pos.index(depth);

    // At the deepest level, use adjacent nodes
    if (depth === $pos.depth) {
        return {
            before: $pos.nodeBefore,
            after: $pos.nodeAfter,
            index
        };
    }

    // At higher levels, determine nodes based on direction
    if (dir > 0) {
        const before: PmNode = $pos.node(depth + 1);
        index++;
        const after: PmNode | null = $pos.node(depth).maybeChild(index);
        return {before, after, index};
    } else {
        const before: PmNode | null = $pos.node(depth).maybeChild(index - 1);
        const after: PmNode = $pos.node(depth + 1);
        return {before, after, index};
    }
}

/**
 * Check if two nodes can actually be joined at the given depth.
 * Validates that the nodes are joinable and the parent allows the join.
 * Note: The index in the candidate is already adjusted for direction by findJoinCandidateAtDepth.
 *
 * @param $pos The resolved position.
 * @param depth The depth level to check.
 * @param candidate Object containing the before/after nodes and index (already adjusted for direction).
 * @returns True if the nodes can be joined, false otherwise.
 */
function canJoinNodes($pos: ResolvedPos,
                      depth: number,
                      candidate: { before: PmNode | null; after: PmNode | null; index: number }): boolean {
    const {before, after, index} = candidate;

    // Before node must exist and not be a textblock
    if (!before || before.isTextblock) {
        return false;
    }

    // Nodes must be joinable
    if (!joinable(before, after)) {
        return false;
    }

    // Parent must allow replacing the join point
    // The index from findJoinCandidateAtDepth is already correctly adjusted for direction
    return $pos.node(depth).canReplace(index, index + 1);
}
