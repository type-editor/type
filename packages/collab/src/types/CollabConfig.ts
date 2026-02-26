
/**
 * Configuration options for the collaborative editing plugin.
 */
export interface CollabConfig {
    /**
     * The starting version number of the collaborative editing.
     * Defaults to 0.
     */
    version?: number;

    /**
     * This client's ID, used to distinguish its changes from those of
     * other clients. Defaults to a random 32-bit number.
     */
    clientID?: number | string;
}
