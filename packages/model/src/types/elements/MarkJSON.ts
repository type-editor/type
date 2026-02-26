import type {Attrs} from '../schema/Attrs';

/**
 * A JSON representation of a mark, used for serialization and deserialization.
 */
export interface MarkJSON {
    /**
     * The name of the mark type.
     */
    type: string;

    /**
     * The attributes associated with this mark, if any.
     */
    attrs?: Attrs;
}
