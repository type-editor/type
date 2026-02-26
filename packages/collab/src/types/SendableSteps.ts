import type {PmStep} from '@type-editor/editor-types';
import {Transform} from '@type-editor/transform';


/**
 * Data describing the editor's unconfirmed steps that need to be sent
 * to the central authority.
 */
export interface SendableSteps {
    /**
     * The current version of the collaborative editing state.
     */
    version: number;

    /**
     * The steps that need to be sent to the central authority.
     */
    steps: ReadonlyArray<PmStep>;

    /**
     * The ID of this client.
     */
    clientID: number | string;

    /**
     * The original transforms that produced each step.
     * This can be useful for looking up timestamps and other metadata for the steps.
     * Note that the steps may have been rebased, whereas the origin transforms
     * are still the old, unchanged objects.
     */
    origins: ReadonlyArray<Transform>;
}
