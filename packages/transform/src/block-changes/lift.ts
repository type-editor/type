import type {TransformDocument} from '@type-editor/editor-types';
import {Fragment, type NodeRange, type ResolvedPos, Slice} from '@type-editor/model';

import {ReplaceAroundStep} from '../change-steps/ReplaceAroundStep';

/**
 * Lift the content in the given range out of its parent nodes.
 * Attempts to move the content to a shallower depth level.
 *
 * @param transform The transform to apply the lift operation to.
 * @param range The range of content to lift.
 * @param target The target depth to lift the content to.
 */
export function lift(transform: TransformDocument, range: NodeRange, target: number): void {
    const {$from, $to, depth} = range;

    const gapStart: number = $from.before(depth + 1);
    const gapEnd: number = $to.after(depth + 1);

    // Build fragments for content before and after the lifted range
    const {fragment: beforeFragment, openLevels: openStart, adjustedStart} =
        buildLiftFragment($from, depth, target, gapStart, 'start');

    const {fragment: afterFragment, openLevels: openEnd, adjustedEnd} =
        buildLiftFragment($to, depth, target, gapEnd, 'end');

    // Create the replacement slice with proper open levels
    const liftSlice: Slice = new Slice(
        beforeFragment.append(afterFragment),
        openStart,
        openEnd
    );

    transform.step(new ReplaceAroundStep(
        adjustedStart,
        adjustedEnd,
        gapStart,
        gapEnd,
        liftSlice,
        beforeFragment.size - openStart,
        true
    ));
}

/**
 * Build a fragment for lifting, tracking how many levels need to be opened.
 * This helper function constructs the fragment structure needed for either the
 * start or end side of a lift operation.
 *
 * @param $pos The resolved position to build the fragment from.
 * @param currentDepth The current depth to start building from.
 * @param targetDepth The target depth to build down to.
 * @param initialPosition The initial position in the document.
 * @param side Whether building for 'start' or 'end' of the lifted range.
 * @returns An object containing the built fragment, number of open levels, and adjusted position.
 */
function buildLiftFragment($pos: ResolvedPos,
                           currentDepth: number,
                           targetDepth: number,
                           initialPosition: number,
                           side: 'start' | 'end'): {
    fragment: Fragment;
    openLevels: number;
    adjustedStart?: number;
    adjustedEnd?: number
} {
    let fragment: Fragment = Fragment.empty;
    let openLevels = 0;
    let needsSplitting = false;
    let position: number = initialPosition;

    for (let depth = currentDepth; depth > targetDepth; depth--) {
        const shouldSplit: boolean = side === 'start'
            ? (needsSplitting || $pos.index(depth) > 0)
            : (needsSplitting || $pos.after(depth + 1) < $pos.end(depth));

        if (shouldSplit) {
            needsSplitting = true;
            fragment = Fragment.from($pos.node(depth).copy(fragment));
            openLevels++;
        } else {
            position += side === 'start' ? -1 : 1;
        }
    }

    return side === 'start'
        ? {fragment, openLevels, adjustedStart: position}
        : {fragment, openLevels, adjustedEnd: position};
}
