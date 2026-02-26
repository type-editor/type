import type {ReplaceStepJSON} from './ReplaceStepJSON';

/**
 * JSON representation of a ReplaceAroundStep.
 */
export interface ReplaceAroundStepJSON extends ReplaceStepJSON {
    /** The start position of the preserved range. */
    gapFrom: number;
    /** The end position of the preserved range. */
    gapTo: number;
    /** The position in the slice where the preserved content should be inserted. */
    insert: number;
}
