/**
 * JSON representation of a CellSelection for serialization.
 *
 * @interface CellSelectionJSON
 */
export interface CellSelectionJSON {
    /** The type identifier for this selection (always 'cell'). */
    type: string;
    /** The document position of the anchor cell. */
    anchor: number;
    /** The document position of the head cell. */
    head: number;
}
