import type {NodeJSON} from './NodeJSON';


/**
 * JSON representation of a Slice for serialization.
 */
export interface SliceJSON {
    /**
     * The open depth at the start of the slice. Defaults to 0 if not specified.
     */
    openStart?: number;

    /**
     * The open depth at the end of the slice. Defaults to 0 if not specified.
     */
    openEnd?: number;

    /**
     * The content nodes of the slice in JSON format.
     */
    content: Array<NodeJSON>;
}
