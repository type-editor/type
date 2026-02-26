import type {PmStep} from '@type-editor/editor-types';
import type {Transform} from '@type-editor/transform';


/**
 * Represents a step that can be rebased (undone and redone after applying other steps).
 * Stores the original step, its inverse, and the transform that originated it.
 */
export class Rebaseable {
    /**
     * Creates a new Rebaseable instance.
     * @param step - The original step to be applied.
     * @param inverted - The inverse of the step, used for undoing.
     * @param origin - The transform that originally produced this step.
     */
    constructor(
        readonly step: PmStep,
        readonly inverted: PmStep,
        readonly origin: Transform
    ) {
    }
}
