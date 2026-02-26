import type {NodeType} from '../../schema/NodeType';

/**
 * Expression types representing different patterns in content expressions.
 * These form the abstract syntax tree of a parsed content expression.
 */
export type ContentPattern =
/** Choice between multiple expressions (e.g., "a | b") */
    { type: 'choice', exprs: Array<ContentPattern>; } |
    /** Sequence of expressions (e.g., "a b c") */
    { type: 'seq', exprs: Array<ContentPattern>; } |
    /** One or more repetitions (e.g., "a+") */
    { type: 'plus', expr: ContentPattern; } |
    /** Zero or more repetitions (e.g., "a*") */
    { type: 'star', expr: ContentPattern; } |
    /** Optional expression (e.g., "a?") */
    { type: 'opt', expr: ContentPattern; } |
    /** Ranged repetition (e.g., "a{2,5}") */
    { type: 'range', min: number, max: number, expr: ContentPattern; } |
    /** Named node type or group reference */
    { type: 'name', value: NodeType; };
