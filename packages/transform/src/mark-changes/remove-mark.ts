import type {TransformDocument} from '@type-editor/editor-types';
import {isMarkType, Mark, type MarkType, type PmNode} from '@type-editor/model';

import {RemoveMarkStep} from '../change-steps/RemoveMarkStep';


/**
 * Tracks a mark that should be removed across consecutive inline nodes.
 *
 * Used by {@link removeMark} to accumulate mark removal operations and merge
 * consecutive removals into single steps for efficiency. The step counter
 * helps identify when nodes are adjacent in the document traversal.
 */
interface MatchedMark {
    /** The mark to remove from the range. */
    style: Mark;
    /** The start position of the mark removal range. */
    from: number;
    /** The end position of the mark removal range. */
    to: number;
    /** The step counter used to detect consecutive nodes during traversal. */
    step: number;
}


/**
 * Remove marks from inline nodes between two positions.
 *
 * This function can remove specific marks, all marks of a certain type, or all marks
 * from the range. It optimizes by merging consecutive removal operations on adjacent nodes.
 *
 * @param transform - The transform to add steps to.
 * @param from - The start position of the range.
 * @param to - The end position of the range.
 * @param mark - The mark to remove. Can be:
 *   - A Mark instance to remove that specific mark
 *   - A MarkType to remove all marks of that type
 *   - null/undefined to remove all marks
 * @throws {RangeError} When from is greater than to.
 */
export function removeMark(transform: TransformDocument,
                           from: number,
                           to: number,
                           mark?: Mark | MarkType | null): void {
    if (from > to) {
        throw new RangeError(`Invalid range: from (${from}) cannot be greater than to (${to})`);
    }

    if (from === to) {
        // Empty range, nothing to do
        return;
    }

    const matchedMarks: Array<MatchedMark> = [];
    let nodeCounter = 0;

    transform.doc.nodesBetween(from, to, (node: PmNode, pos: number): undefined => {
        if (!node.isInline) {
            return;
        }

        nodeCounter++;
        const marksToRemove: Array<Mark> = determineMarksToRemove(node, mark);

        if (marksToRemove.length > 0) {
            const rangeEnd: number = Math.min(pos + node.nodeSize, to);
            const rangeStart: number = Math.max(pos, from);

            processMarkRemovals(marksToRemove, rangeStart, rangeEnd, nodeCounter, matchedMarks);
        }
    });

    // Apply all removal steps
    matchedMarks.forEach((matched: MatchedMark): void => {
        transform.step(new RemoveMarkStep(matched.from, matched.to, matched.style));
    });
}


/**
 * Determine which marks should be removed from a node based on the mark parameter.
 *
 * This function handles three cases:
 * - If mark is a MarkType, removes all marks of that type
 * - If mark is a specific Mark instance, removes only that exact mark
 * - If mark is null/undefined, removes all marks
 *
 * @param node - The node to check for marks.
 * @param mark - The mark specification:
 *   - MarkType: removes all marks of that type
 *   - Mark: removes that specific mark instance
 *   - null/undefined: removes all marks
 * @returns Array of marks that should be removed from the node.
 */
function determineMarksToRemove(node: PmNode,
                                mark?: Mark | MarkType | null): Array<Mark> {
    if (isMarkType(mark)) {
        return getAllMarksOfType(node.marks, mark as MarkType);
    } else if (Mark.isMark(mark)) {
        return mark.isInSet(node.marks) ? [mark] : [];
    } else {
        // Remove all marks when mark is null/undefined
        return Array.from(node.marks);
    }
}

/**
 * Get all marks of a specific type from a mark set.
 *
 * Iteratively searches for marks of the specified type, removing each found mark
 * from the remaining set to find all instances. This handles cases where multiple
 * marks of the same type exist on a node (though typically rare).
 *
 * @param marks - The set of marks to search through.
 * @param markType - The type of marks to find.
 * @returns Array of all marks matching the specified type, or empty array if none found.
 */
function getAllMarksOfType(marks: ReadonlyArray<Mark>,
                           markType: MarkType): Array<Mark> {
    const result: Array<Mark> = [];
    let remainingMarks: ReadonlyArray<Mark> = marks;

    let found: Mark | undefined = markType.isInSet(remainingMarks);
    while (found) {
        result.push(found);
        remainingMarks = found.removeFromSet(remainingMarks);
        found = markType.isInSet(remainingMarks);
    }

    return result;
}

/**
 * Process marks to be removed, merging consecutive operations where possible.
 *
 * For each mark to remove, this function either extends an existing matched mark
 * (if it's adjacent to the previous range) or creates a new matched mark entry.
 * This optimization reduces the number of RemoveMarkStep operations needed.
 *
 * @param marksToRemove - Array of marks that need to be removed from the current range.
 * @param rangeStart - Start position of the range being processed.
 * @param rangeEnd - End position of the range being processed.
 * @param currentStep - Current step counter for detecting consecutive nodes in traversal.
 * @param matchedMarks - Array to accumulate matched mark removals (modified in place).
 */
function processMarkRemovals(marksToRemove: Array<Mark>,
                             rangeStart: number,
                             rangeEnd: number,
                             currentStep: number,
                             matchedMarks: Array<MatchedMark>): void {
    for (const mark of marksToRemove) {
        const existingMatch: MatchedMark = findConsecutiveMatch(matchedMarks, mark, currentStep);

        if (existingMatch) {
            // Extend existing matched mark range
            existingMatch.to = rangeEnd;
            existingMatch.step = currentStep;
        } else {
            // Create new matched mark entry
            matchedMarks.push({
                style: mark,
                from: rangeStart,
                to: rangeEnd,
                step: currentStep
            });
        }
    }
}

/**
 * Find a matched mark that can be extended (is consecutive and has the same mark).
 *
 * Searches for an existing MatchedMark entry that was processed in the immediately
 * previous step and has the same mark. This allows consecutive removals to be merged
 * into a single step, improving efficiency.
 *
 * @param matchedMarks - Array of matched marks to search through.
 * @param mark - The mark to find a consecutive match for.
 * @param currentStep - Current step counter (nodes are consecutive if steps differ by 1).
 * @returns The matched mark entry if found and consecutive, undefined otherwise.
 */
function findConsecutiveMatch(matchedMarks: Array<MatchedMark>,
                              mark: Mark,
                              currentStep: number): MatchedMark | undefined {
    return matchedMarks.find((matched: MatchedMark): boolean =>
        matched.step === currentStep - 1 && mark.eq(matched.style)
    );
}
