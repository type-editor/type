import type {TransformDocument} from '@type-editor/editor-types';
import type {Mark, PmNode} from '@type-editor/model';

import {AddMarkStep} from '../change-steps/AddMarkStep';
import {RemoveMarkStep} from '../change-steps/RemoveMarkStep';
import type {Step} from '../change-steps/Step';

/**
 * Add a mark to all inline content between two positions.
 *
 * When a mark is added, any marks that are incompatible with the new mark
 * will be removed from the affected range. The function optimizes by merging
 * consecutive steps that operate on adjacent ranges.
 *
 * @param transform - The transform to add steps to.
 * @param from - The start position of the range.
 * @param to - The end position of the range.
 * @param mark - The mark to add to inline content.
 * @throws {RangeError} When from is greater than to.
 */
export function addMark(transform: TransformDocument,
                        from: number,
                        to: number,
                        mark: Mark): void {
    if (from > to) {
        throw new RangeError(`Invalid range: from (${from}) cannot be greater than to (${to})`);
    }

    if (from === to) {
        // Empty range, nothing to do
        return;
    }

    const stepsToRemove: Array<Step> = [];
    const stepsToAdd: Array<Step> = [];
    let currentRemoveStep: RemoveMarkStep | undefined;
    let currentAddStep: AddMarkStep | undefined;

    transform.doc.nodesBetween(
        from,
        to,
        (node: PmNode, pos: number, parent: PmNode): undefined => {

            if (!node.isInline) {
                return;
            }

            const nodeMarks: ReadonlyArray<Mark> = node.marks;
            const canAddMark: boolean = !mark.isInSet(nodeMarks) && parent.type.allowsMarkType(mark.type);

            if (!canAddMark) {
                return;
            }

            const rangeStart: number = Math.max(pos, from);
            const rangeEnd: number = Math.min(pos + node.nodeSize, to);
            const marksWithNew: ReadonlyArray<Mark> = mark.addToSet(nodeMarks);

            // Remove incompatible marks
            currentRemoveStep = processIncompatibleMarks(
                nodeMarks,
                marksWithNew,
                rangeStart,
                rangeEnd,
                currentRemoveStep,
                stepsToRemove
            );

            // Add the new mark
            currentAddStep = processAddMark(
                mark,
                rangeStart,
                rangeEnd,
                currentAddStep,
                stepsToAdd
            );
        }
    );

    // Apply all steps (removals first, then additions)
    stepsToRemove.forEach(step => transform.step(step));
    stepsToAdd.forEach(step => transform.step(step));
}

/**
 * Process marks that need to be removed because they're incompatible with the new mark.
 *
 * When a new mark is added to a node, some existing marks may need to be removed because
 * they are incompatible with the new mark (e.g., conflicting styles). This function
 * identifies such marks and creates removal steps, merging consecutive operations when possible.
 *
 * @param originalMarks - The original set of marks on the node before adding the new mark.
 * @param newMarkSet - The new set of marks after adding the new mark (may exclude incompatible marks).
 * @param rangeStart - The start position of the range being processed.
 * @param rangeEnd - The end position of the range being processed.
 * @param currentStep - The current RemoveMarkStep being built (for merging consecutive operations).
 * @param steps - The array of steps to accumulate removal operations.
 * @returns The last RemoveMarkStep created or extended, or undefined if no marks were removed.
 */
function processIncompatibleMarks(originalMarks: ReadonlyArray<Mark>,
                                  newMarkSet: ReadonlyArray<Mark>,
                                  rangeStart: number,
                                  rangeEnd: number,
                                  currentStep: RemoveMarkStep | undefined,
                                  steps: Array<Step>): RemoveMarkStep | undefined {
    let lastStep: RemoveMarkStep = currentStep;

    for (const mark of originalMarks) {
        if (!mark.isInSet(newMarkSet)) {
            // Check if we can extend the current step
            if (lastStep?.to === rangeStart && lastStep.mark.eq(mark)) {
                lastStep.to = rangeEnd;
            } else {
                lastStep = new RemoveMarkStep(rangeStart, rangeEnd, mark);
                steps.push(lastStep);
            }
        }
    }

    return lastStep;
}

/**
 * Process adding a mark to a range.
 *
 * Creates an AddMarkStep for the given range, or extends an existing step if the
 * range is adjacent to the previous one. This optimization reduces the total number
 * of steps needed when marking consecutive inline nodes.
 *
 * @param mark - The mark to add to the range.
 * @param rangeStart - The start position of the range.
 * @param rangeEnd - The end position of the range.
 * @param currentStep - The current AddMarkStep being built (for merging consecutive operations).
 * @param steps - The array of steps to accumulate addition operations.
 * @returns The AddMarkStep that was created or extended.
 */
function processAddMark(mark: Mark,
                        rangeStart: number,
                        rangeEnd: number,
                        currentStep: AddMarkStep | undefined,
                        steps: Array<Step>): AddMarkStep | undefined {
    // Check if we can extend the current step
    if (currentStep?.to === rangeStart) {
        currentStep.to = rangeEnd;
        return currentStep;
    } else {
        const newStep = new AddMarkStep(rangeStart, rangeEnd, mark);
        steps.push(newStep);
        return newStep;
    }
}
