import type {TransformDocument} from '@type-editor/editor-types';
import type {PmNode, ResolvedPos} from '@type-editor/model';

import {coveredDepths} from './util';

/**
 * Delete a range from the document, expanding to cover appropriate node boundaries.
 *
 * @param transform - The transform to apply to
 * @param from - Start position
 * @param to - End position
 * @returns The modified transform
 */
export function deleteRange(transform: TransformDocument, from: number, to: number): TransformDocument {
    const $from: ResolvedPos = transform.doc.resolve(from);
    const $to: ResolvedPos = transform.doc.resolve(to);
    const covered: Array<number> = coveredDepths($from, $to);

    const coverResult: TransformDocument = tryDeleteAtCoveredDepths(transform, $from, $to, covered);
    if (coverResult) {
        return coverResult;
    }

    const partialResult: TransformDocument = tryPartialDelete(transform, $from, $to, from, to);
    if (partialResult) {
        return partialResult;
    }

    return transform.delete(from, to);
}


/**
 * Try to delete from the start of a node to a position beyond it.
 *
 * @param transform - The transform to apply to
 * @param $from - Resolved start position
 * @param $to - Resolved end position
 * @param from - Start position number
 * @param to - End position number
 * @returns The modified transform, or null if partial deletion is not possible
 */
function tryPartialDelete(transform: TransformDocument,
                          $from: ResolvedPos,
                          $to: ResolvedPos,
                          from: number,
                          to: number): TransformDocument | null {
    for (let depth = 1; depth <= $from.depth && depth <= $to.depth; depth++) {
        if (isPartialNodeDeletion($from, $to, from, to, depth)) {
            return transform.delete($from.before(depth), to);
        }
    }

    return null;
}

/**
 * Check if this is a partial deletion from the start of a node.
 *
 * @param $from - Resolved start position
 * @param $to - Resolved end position
 * @param from - Start position number
 * @param to - End position number
 * @param depth - Depth to check
 * @returns True if this is a valid partial node deletion
 */
function isPartialNodeDeletion($from: ResolvedPos,
                               $to: ResolvedPos,
                               from: number,
                               to: number,
                               depth: number): boolean {
    const startsAtNodeBegin: boolean = from - $from.start(depth) === $from.depth - depth;
    const extendsBeforeNodeEnd: boolean = to > $from.end(depth);
    const doesNotEndAtNodeEnd: boolean = $to.end(depth) - to !== $to.depth - depth;
    const sameParentStart: boolean = $from.start(depth - 1) === $to.start(depth - 1);

    if (!startsAtNodeBegin || !extendsBeforeNodeEnd || !doesNotEndAtNodeEnd || !sameParentStart) {
        return false;
    }

    const parent: PmNode = $from.node(depth - 1);
    return parent.canReplace($from.index(depth - 1), $to.index(depth - 1));
}

/**
 * Try to delete the range at one of the covered depths.
 *
 * @param transform - The transform to apply to
 * @param $from - Resolved start position
 * @param $to - Resolved end position
 * @param covered - Array of covered depths
 * @returns The modified transform, or null if deletion at covered depths is not possible
 */
function tryDeleteAtCoveredDepths(transform: TransformDocument,
                                  $from: ResolvedPos,
                                  $to: ResolvedPos,
                                  covered: Array<number>): TransformDocument | null {
    for (let i = 0; i < covered.length; i++) {
        const depth: number = covered[i];
        const isLast: boolean = i === covered.length - 1;

        if (canDeleteEntireContent($from, depth, isLast)) {
            return transform.delete($from.start(depth), $to.end(depth));
        }

        if (canDeleteEntireNode($from, $to, depth, isLast)) {
            return transform.delete($from.before(depth), $to.after(depth));
        }
    }

    return null;
}

/**
 * Check if we can delete the entire content at a given depth.
 *
 * @param $from - Resolved start position
 * @param depth - Depth to check
 * @param isLast - Whether this is the last covered depth
 * @returns True if entire content can be deleted
 */
function canDeleteEntireContent($from: ResolvedPos, depth: number, isLast: boolean): boolean {
    return (isLast && depth === 0) || $from.node(depth).type.contentMatch.validEnd;
}

/**
 * Check if we can delete the entire node at a given depth.
 *
 * @param $from - Resolved start position
 * @param $to - Resolved end position
 * @param depth - Depth to check
 * @param isLast - Whether this is the last covered depth
 * @returns True if entire node can be deleted
 */
function canDeleteEntireNode($from: ResolvedPos, $to: ResolvedPos, depth: number, isLast: boolean): boolean {
    if (depth === 0) {
        return false;
    }

    const parent: PmNode = $from.node(depth - 1);
    const fromIndex: number = $from.index(depth - 1);
    const toIndex: number = $to.indexAfter(depth - 1);

    return isLast || parent.canReplace(fromIndex, toIndex);
}
