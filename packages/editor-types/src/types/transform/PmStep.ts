import type {PmNode} from '@type-editor/model';

import type {Mappable} from './Mappable';
import type {PmStepResult} from './PmStepResult';
import type {StepJSON} from './StepJSON';


export interface PmStep {

    apply(doc: PmNode): PmStepResult;

    /**
     * Get the step map that represents the changes made by this step,
     * and which can be used to transform between positions in the old
     * and the new document.
     *
     * @returns A StepMap describing the position changes, or StepMap.empty if no changes.
     */
    getMap(): Mappable;

    invert(doc: PmNode): PmStep;

    map(mapping: Mappable): PmStep | null;

    /**
     * Try to merge this step with another one, to be applied directly
     * after it. Returns the merged step when possible, null if the
     * steps can't be merged.
     *
     * @param _other - The step to merge with.
     * @returns The merged step, or null if the steps can't be merged.
     */
    merge(_other: PmStep): PmStep | null;

    toJSON(): StepJSON;
}
