
/**
 * JSON-serializable representation of a Change.
 *
 * Describes a change between two document versions (A and B), including
 * the affected ranges and the deleted/inserted content spans.
 *
 * @template Data - The type of metadata associated with each span.
 */
export interface ChangeJSON<Data> {
    /** The start position in document A where the change begins. */
    fromA: number;
    /** The end position in document A where the change ends. */
    toA: number;
    /** The start position in document B where the change begins. */
    fromB: number;
    /** The end position in document B where the change ends. */
    toB: number;
    /** The spans that were deleted from document A. */
    deleted: ReadonlyArray<{length: number, data: Data}>;
    /** The spans that were inserted into document B. */
    inserted: ReadonlyArray<{length: number, data: Data}>;
}
