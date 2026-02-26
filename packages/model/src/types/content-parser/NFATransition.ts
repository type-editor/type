import type {NodeType} from '../../schema/NodeType';

/**
 * Represents an edge in the Non-deterministic Finite Automaton (NFA).
 * An edge connects one state to another, optionally labeled with a node type.
 */
export interface NFATransition {

    /** The node type required to traverse this edge, or undefined for epsilon transitions */
    term: NodeType | undefined;

    /** The target state index, or undefined if not yet connected */
    to: number | undefined;
}
