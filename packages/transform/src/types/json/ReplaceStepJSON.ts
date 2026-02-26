import type {StepJSON} from '@type-editor/editor-types';
import type {SliceJSON} from '@type-editor/model';

/**
 * JSON representation of a ReplaceStep.
 */
export interface ReplaceStepJSON extends StepJSON {
    /** The slice to insert, if any. */
    slice?: SliceJSON;
    /** Whether this is a structure-preserving replace. */
    structure?: boolean;
}
