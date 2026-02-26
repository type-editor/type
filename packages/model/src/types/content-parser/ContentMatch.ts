import type {Fragment} from '../../elements/Fragment';
import type {NodeType} from '../../schema/NodeType';


/**
 * Represents an edge in the content match finite automaton.
 * Each edge connects a node type to the next match state.
 *
 * In the content matching system, edges define valid transitions between states.
 * For example, if a paragraph can contain text, there would be an edge from the
 * paragraph's content match to another state with the text node type.
 *
 * @example
 * ```typescript
 * // An edge might represent: "paragraph node" -> "next state after paragraph"
 * const edge: MatchEdge = {
 *   type: schema.nodes.paragraph,
 *   next: someContentMatch
 * };
 * ```
 */
export interface MatchEdge {
    /**
     * The node type that this edge represents.
     * This is the type of node that can be matched at this transition.
     */
    type: NodeType;

    /**
     * The next match state after matching this node type.
     * Following this edge leads to this state in the automaton.
     */
    next: ContentMatch;
}


export interface ContentMatch {

    readonly next: Array<MatchEdge>;
    readonly validEnd: boolean;
    readonly inlineContent: boolean;
    readonly defaultType: NodeType;
    readonly edgeCount: number;

    /**
     * Match a node type, returning the next match state after that node if successful.
     *
     * This is the fundamental operation in the content matching automaton. It checks
     * if the given node type is valid at the current position (i.e., if there's an
     * outgoing edge for this type) and returns the next state if so.
     *
     * @param type The node type to match. This is checked against all outgoing edges
     *             from the current state.
     * @returns The next content match state if the type is valid at this position,
     *          or null if the node type is not allowed here.
     *
     * @example
     * ```typescript
     * const match = nodeType.contentMatch;
     *
     * // Check if paragraph is valid
     * const afterPara = match.matchType(schema.nodes.paragraph);
     * if (afterPara) {
     *   console.log('Paragraph accepted');
     *
     *   // Can we add another paragraph?
     *   const afterTwo = afterPara.matchType(schema.nodes.paragraph);
     * }
     * ```
     */
    matchType(type: NodeType): ContentMatch | null;

    /**
     * Try to match a fragment. Returns the resulting match state when successful.
     *
     * Iterates through the child nodes in the fragment and attempts to match each one
     * sequentially using matchType(). If any match fails, returns null immediately.
     * This is essentially a fold operation over the fragment using matchType.
     *
     * @param fragment The fragment containing nodes to match. Each child node's type
     *                 is matched sequentially from start to end.
     * @param start The starting index in the fragment (inclusive). Defaults to 0.
     * @param end The ending index in the fragment (exclusive). Defaults to the total
     *            number of children in the fragment.
     * @returns The resulting content match state after matching all nodes in the range,
     *          or null if matching fails for any node in the sequence.
     *
     * @example
     * ```typescript
     * const fragment = Fragment.from([para1, para2, para3]);
     *
     * // Match the entire fragment
     * const result = contentMatch.matchFragment(fragment);
     * if (result) {
     *   console.log('Fragment is valid');
     *   if (result.validEnd) {
     *     console.log('And can end here');
     *   }
     * }
     *
     * // Match a sub-range
     * const partial = contentMatch.matchFragment(fragment, 1, 2);
     * // Only matches para2
     * ```
     */
    matchFragment(fragment: Fragment,
                  start?: number,
                  end?: number): ContentMatch | null;

    /**
     * Check whether this match state is compatible with another match state.
     * Two match states are compatible if they have at least one node type in common
     * among their possible next matches.
     *
     * This is useful when trying to join or merge content from different contexts.
     * If two positions have compatible content matches, they can potentially accept
     * the same type of content.
     *
     * @param other The other content match state to check compatibility with.
     * @returns True if the match states share at least one common node type in their
     *          next possible matches, false if they have no node types in common.
     *
     * @example
     * ```typescript
     * const match1 = schema.nodes.doc.contentMatch;
     * const match2 = schema.nodes.blockquote.contentMatch;
     *
     * if (match1.compatible(match2)) {
     *   console.log('Both can accept some common node type');
     *   // e.g., both might accept paragraphs
     * }
     * ```
     */
    compatible(other: ContentMatch): boolean;

    /**
     * Try to match the given fragment, and if that fails, see if it can
     * be made to match by inserting nodes in front of it. When
     * successful, return a fragment of inserted nodes (which may be
     * empty if nothing had to be inserted). When `toEnd` is true, only
     * return a fragment if the resulting match goes to the end of the
     * content expression.
     *
     * This method performs a depth-first search through possible node insertions
     * to find a valid sequence that would allow the given fragment to match.
     * It automatically creates and fills nodes using their default content.
     *
     * The search avoids cycles by tracking visited states and only considers
     * node types that don't require attributes or content (non-text, no required attrs).
     *
     * @param after The fragment that should match after inserting nodes. The method
     *              tries to find nodes to insert before this fragment to make the
     *              entire sequence valid.
     * @param toEnd Whether the match must reach a valid end state. When true, only
     *              returns a result if content can legally end after the fragment.
     *              Default is false, allowing intermediate (non-terminal) states.
     * @param startIndex The index in the fragment to start matching from. Allows
     *                   matching a suffix of the fragment. Default is 0.
     * @returns A fragment of nodes to insert before `after`, which may be empty if
     *          `after` already matches without insertions, or null if no valid
     *          insertion sequence exists.
     *
     * @example
     * ```typescript
     * // Try to make a fragment valid by inserting nodes before it
     * const fragment = Fragment.from([textNode]);
     * const toInsert = contentMatch.fillBefore(fragment);
     *
     * if (toInsert) {
     *   // Combine: toInsert + fragment
     *   const validContent = toInsert.append(fragment);
     * }
     *
     * // Require reaching a valid end
     * const toEnd = contentMatch.fillBefore(fragment, true);
     * if (toEnd && contentMatch.matchFragment(toEnd.append(fragment))?.validEnd) {
     *   console.log('Content is now complete');
     * }
     * ```
     */
    fillBefore(after: Fragment, toEnd?: boolean, startIndex?: number): Fragment | null;

    /**
     * Find a set of wrapping node types that would allow a node of the
     * given type to appear at this position. The result may be empty
     * (when it fits directly) and will be null when no such wrapping
     * exists.
     *
     * This method uses breadth-first search to find the shortest wrapping sequence.
     * For example, if a list_item can't appear directly in a doc, this might return
     * [bullet_list] to indicate the list_item should be wrapped in a bullet_list.
     *
     * The result is cached to avoid recomputing wrappings for the same target type,
     * providing O(1) lookups after the first computation.
     *
     * @param target The node type to find wrapping for. This is the innermost node
     *               type that needs to fit at the current position.
     * @returns An array of node types to wrap with (from outermost to innermost),
     *          an empty array if the target fits directly without wrapping,
     *          or null if no valid wrapping exists.
     *
     * @example
     * ```typescript
     * // Find how to wrap a list_item to fit in a doc
     * const wrapping = docContentMatch.findWrapping(schema.nodes.list_item);
     * if (wrapping) {
     *   // wrapping might be [bullet_list]
     *   // So we'd wrap: bullet_list(list_item(...))
     *   console.log('Wrap in:', wrapping.map(t => t.name));
     * }
     *
     * // Empty array means no wrapping needed
     * const direct = match.findWrapping(schema.nodes.paragraph);
     * if (direct && direct.length === 0) {
     *   console.log('Paragraph fits directly');
     * }
     * ```
     */
    findWrapping(target: NodeType): ReadonlyArray<NodeType> | null;

    /**
     * Get the _n_'th outgoing edge from this node in the finite
     * automaton that describes the content expression.
     *
     * This provides indexed access to the edges, which can be useful when
     * iterating through possible transitions numerically rather than using
     * the `next` array directly.
     *
     * @param number The index of the edge to retrieve (0-based). Must be within
     *               the range [0, edgeCount).
     * @returns The match edge at the specified index, containing the node type
     *          and next state.
     * @throws {RangeError} If the index is out of bounds (negative or >= edgeCount).
     *
     * @example
     * ```typescript
     * for (let i = 0; i < contentMatch.edgeCount; i++) {
     *   const edge = contentMatch.edge(i);
     *   console.log(`Edge ${i}: ${edge.type.name}`);
     * }
     * ```
     */
    edge(number: number): MatchEdge;

    /**
     * Generate a string representation of this content match and all reachable states.
     * Useful for debugging and visualizing the finite automaton structure.
     *
     * The output format shows each state on a line with:
     * - State index (numbered from 0)
     * - '*' marker if the state is a valid end
     * - List of transitions: "type->targetState" pairs
     *
     * This performs a depth-first scan to discover all reachable states.
     *
     * @returns A multi-line string showing all states and their transitions.
     *
     * @example
     * ```typescript
     * console.log(contentMatch.toString());
     * // Output might be:
     * // 0  paragraph->1, heading->1
     * // 1* paragraph->1
     * //
     * // State 0 can accept paragraph or heading, both go to state 1
     * // State 1 is a valid end (*) and can accept more paragraphs
     * ```
     */
    toString(): string;
}
