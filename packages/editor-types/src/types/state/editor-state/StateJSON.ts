import type {MarkJSON, NodeJSON} from '@type-editor/model';

import type {SelectionJSON} from '../selection/SelectionJSON';


/**
 * JSON representation of an editor state.
 * Used for serialization/deserialization of state.
 */
export interface StateJSON {
    /** The document in JSON format */
    doc: NodeJSON;
    /** Optional selection in JSON format */
    selection?: SelectionJSON;
    /** Optional array of stored marks in JSON format */
    storedMarks?: Array<MarkJSON>;
    /** Optional scroll-to-selection counter */
    scrollToSelection?: number;

    /** Additional plugin-specific fields */
    [prop: string]: unknown;
}
