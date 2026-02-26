
/**
 * JSON representation of a selection for serialization.
 * Different selection types may use different properties:
 * - TEXT selections use `anchor` and `head`
 * - NODE selections use `anchor`
 * - ALL selections only need `type`
 */
export interface SelectionJSON {
    /** The type of selection (text, node, or all) */
    type: string;
    /** The anchor position (used by text and node selections) */
    anchor?: number;
    /** The head position (used by text selections) */
    head?: number;
    /** Alternative position property (legacy support) */
    pos?: number;
}
