import type {Slice} from '@type-editor/model';

/**
 * Represents the result of serializing a slice for clipboard operations.
 */
export interface SerializedClipboard {
    /** The DOM element containing the serialized HTML */
    dom: HTMLDivElement;
    /** The plain text representation */
    text: string;
    /** The normalized slice that was serialized */
    slice: Slice;
}
