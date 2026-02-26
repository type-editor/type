import type {PmStep, PmTransaction} from '@type-editor/editor-types';

import {Rebaseable} from './Rebaseable';


/**
 * Rebases a set of steps over another set of steps by undoing them,
 * applying the other steps, and then reapplying the original steps
 * with proper position mapping.
 *
 * This is essential for collaborative editing when local changes need
 * to be rebased over remote changes received from other clients.
 *
 * @internal
 * @param steps - The local steps to rebase, wrapped as Rebaseable objects.
 * @param over - The remote steps to rebase over.
 * @param transform - The transform to apply all steps to.
 * @returns An array of rebased steps that could be successfully reapplied.
 */
export function rebaseSteps(steps: ReadonlyArray<Rebaseable>,
                            over: ReadonlyArray<PmStep>,
                            transform: PmTransaction): Array<Rebaseable> {
    // Step 1: Undo all local steps in reverse order
    for (let i = steps.length - 1; i >= 0; i--) {
        transform.step(steps[i].inverted);
    }

    // Step 2: Apply all remote steps
    for (const step of over) {
        transform.step(step);
    }

    // Step 3: Reapply local steps with position mapping
    const result: Array<Rebaseable> = [];
    let mapFrom: number = steps.length;

    for (const item of steps) {
        const mapped: PmStep = item.step.map(transform.mapping.slice(mapFrom));
        mapFrom--;

        if (mapped && !transform.maybeStep(mapped).failed) {
            transform.mapping.setMirror(mapFrom, transform.steps.length - 1);
            const invertedMapped = mapped.invert(transform.docs[transform.docs.length - 1]);
            result.push(new Rebaseable(mapped, invertedMapped, item.origin));
        }
    }

    return result;
}
