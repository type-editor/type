import type {Rebaseable} from './Rebaseable';


/**
 * Represents the state of the collaborative editing plugin.
 *
 * This state field accumulates changes that need to be sent to the
 * central authority and makes it possible to integrate changes made
 * by peers into the local document. It tracks the current version
 * and any unconfirmed local steps.
 */
export class CollabState {
    /**
     * Creates a new CollabState instance.
     *
     * @param version - The version number of the last update received from the central
     *   authority. Starts at 0 or the value of the `version` property
     *   in the option object, for the editor's value when the option was enabled.
     * @param unconfirmed - The local steps that haven't been successfully sent to
     *   the server yet.
     */
    constructor(
        readonly version: number,
        readonly unconfirmed: ReadonlyArray<Rebaseable>
    ) {
    }
}
