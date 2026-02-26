import {Fragment} from '../elements/Fragment';
import type {NodeType} from '../schema/NodeType';
import type {ContentMatch, MatchEdge} from '../types/content-parser/ContentMatch';


/**
 * Represents a node in the breadth-first search used to find wrapping node types.
 *
 * When searching for a way to wrap a node type so it fits in the current position,
 * this structure tracks the current search state including:
 * - The current content match being explored
 * - The node type being considered for wrapping
 * - The path back to the root (via chain)
 *
 * The `via` field creates a linked list structure that allows reconstructing
 * the complete wrapping sequence when a valid wrapping is found.
 */
interface ActiveNode {
    /**
     * The current content match state in the breadth-first search.
     * This represents where we are in the content expression automaton.
     */
    match: ContentMatch;

    /**
     * The node type at this position in the wrapping chain, or null for the root.
     * When non-null, this is a node type being considered as part of the wrapping.
     */
    type: NodeType | null;

    /**
     * The parent node in the wrapping chain, or null for the root.
     * Forms a linked list that can be traversed backwards to reconstruct
     * the complete wrapping sequence from outermost to innermost.
     */
    via: ActiveNode | null;
}




/**
 * Instances of this class represent a match state of a node type's
 * [content expression](#model.NodeSpec.content), and can be used to
 * find out whether further content matches here, and whether a given
 * position is a valid end of the node.
 *
 * The content match system uses a finite automaton approach where each
 * ContentMatch instance represents a state, and edges represent possible
 * node types that can be matched at that state.
 *
 * ## Finite Automaton Model
 *
 * Content expressions (like "paragraph+" or "heading | paragraph*") are compiled
 * into a finite automaton where:
 * - Each state (ContentMatch) represents a position in parsing the expression
 * - Edges represent valid node types that can appear at that position
 * - Valid end states indicate where content can legally terminate
 *
 * ## Common Operations
 *
 * - **Matching**: Check if a node type or fragment can appear at this position
 * - **Filling**: Find what nodes to insert to make invalid content valid
 * - **Wrapping**: Find how to wrap a node to make it fit at this position
 * - **Validation**: Check if content satisfies the content expression
 *
 * @example
 * ```typescript
 * // Check if a paragraph can appear at this position
 * const nextMatch = contentMatch.matchType(schema.nodes.paragraph);
 * if (nextMatch) {
 *   console.log('Paragraph is valid here');
 * }
 *
 * // Fill before a fragment to make it valid
 * const toInsert = contentMatch.fillBefore(fragment);
 * if (toInsert) {
 *   // Insert these nodes before the fragment
 * }
 *
 * // Find wrapping for a node
 * const wrapping = contentMatch.findWrapping(schema.nodes.list_item);
 * if (wrapping) {
 *   // Wrap the node in these node types (outermost first)
 * }
 * ```
 */
export class DocumentContentMatch implements ContentMatch {

    /**
     * Array of possible next match states, representing outgoing edges in the automaton.
     * Each edge maps a node type to the next state after matching that type.
     * @private
     */
    private readonly nextMatch: Array<MatchEdge> = [];

    /**
     * Cache for wrapping calculations, maps node type to wrapping result.
     * Stores computed wrappings to avoid redundant BFS traversals for the same target type.
     * Values can be:
     * - An array of NodeTypes (the wrapping sequence)
     * - An empty array (no wrapping needed)
     * - null (no valid wrapping exists)
     * @private
     */
    private readonly wrapCache = new Map<NodeType, ReadonlyArray<NodeType> | null>();

    /**
     * Whether this match state represents a valid end of content.
     * When true, content can legally terminate at this state in the content expression.
     * @private
     */
    private readonly isValidEnd: boolean;

    /**
     * Creates a new content match state.
     *
     * ContentMatch instances are typically created during schema compilation when
     * content expressions are parsed into finite automaton states. Direct construction
     * is rarely needed in user code.
     *
     * @param validEnd Whether this match state represents a valid end of the node.
     *                 True means content can legally terminate at this state.
     *
     * @example
     * ```typescript
     * // A valid end state (content can stop here)
     * const endState = new ContentMatch(true);
     *
     * // An intermediate state (more content required)
     * const intermediateState = new ContentMatch(false);
     * ```
     */
    constructor(validEnd: boolean) {
        this.isValidEnd = validEnd;
    }

    /**
     * Get the array of possible next match edges from this state.
     *
     * Each edge represents a valid node type that can appear at this position,
     * along with the state to transition to after matching that type.
     *
     * @returns An array of match edges representing all valid transitions from this state.
     *
     * @example
     * ```typescript
     * // Explore all possible next node types
     * for (const edge of contentMatch.next) {
     *   console.log(`Can accept: ${edge.type.name}`);
     * }
     * ```
     */
    get next(): Array<MatchEdge> {
        return this.nextMatch;
    }

    /**
     * Returns true when this match state represents a valid end of the node.
     *
     * When true, content can legally terminate at this state according to the
     * content expression. For example, in "paragraph+", after matching at least
     * one paragraph, subsequent states are valid ends. In "paragraph*", even
     * the initial state is a valid end (zero or more paragraphs).
     *
     * @returns True if content can terminate at this state, false otherwise.
     *
     * @example
     * ```typescript
     * if (contentMatch.validEnd) {
     *   console.log('Content can legally end here');
     * } else {
     *   console.log('More content required');
     * }
     * ```
     */
    get validEnd(): boolean {
        return this.isValidEnd;
    }

    /**
     * Returns true if this match state represents inline content.
     * Content is considered inline if there are possible next matches
     * and the first one is an inline node type.
     *
     * This is used to distinguish between block-level and inline content contexts.
     * For example, a paragraph's content match would have inlineContent = true,
     * while a document's content match would have inlineContent = false.
     *
     * @returns True if the next possible content is inline, false otherwise.
     *
     * @example
     * ```typescript
     * if (contentMatch.inlineContent) {
     *   console.log('Expecting inline content like text or marks');
     * } else {
     *   console.log('Expecting block-level content like paragraphs');
     * }
     * ```
     */
    get inlineContent(): boolean {
        return this.nextMatch.length > 0 && this.nextMatch[0].type.isInline;
    }

    /**
     * Get the first matching node type at this match position that can
     * be generated without additional attributes or content.
     *
     * This is useful for automatically filling content. It returns the first
     * node type that:
     * - Is not a text node (text requires actual text content)
     * - Doesn't have required attributes (would need attribute values)
     *
     * Returns null if no such "fillable" type exists at this position.
     *
     * @returns The first auto-fillable node type, or null if none exists.
     *
     * @example
     * ```typescript
     * const defaultType = contentMatch.defaultType;
     * if (defaultType) {
     *   // Can auto-fill with this type
     *   const node = defaultType.createAndFill();
     * }
     * ```
     */
    get defaultType(): NodeType | null {
        for (const edge of this.nextMatch) {
            const {type} = edge;
            if (!type.isText && !type.hasRequiredAttrs()) {
                return type;
            }
        }
        return null;
    }

    /**
     * The number of outgoing edges this node has in the finite
     * automaton that describes the content expression.
     *
     * This indicates how many different node types can validly appear
     * at this position. An edgeCount of 0 means no content can follow
     * (though this might still be a valid end state).
     *
     * @returns The number of possible next node types.
     *
     * @example
     * ```typescript
     * console.log(`${contentMatch.edgeCount} possible node types here`);
     *
     * if (contentMatch.edgeCount === 0 && !contentMatch.validEnd) {
     *   console.log('Invalid state - no content allowed but not an end');
     * }
     * ```
     */
    get edgeCount(): number {
        return this.nextMatch.length;
    }

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
    public matchType(type: NodeType): ContentMatch | null {
        for (const edge of this.nextMatch) {
            if (edge.type === type) {
                return edge.next;
            }
        }
        return null;
    }

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
    public matchFragment(fragment: Fragment,
                         start = 0,
                         end: number = fragment.childCount): ContentMatch | null {
        return this.matchFragmentInternal(fragment, start, end);
    }

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
    public compatible(other: ContentMatch): boolean {
        for (const edge of this.nextMatch) {
            for (const otherEdge of (other as DocumentContentMatch).nextMatch) {
                if (edge.type === otherEdge.type) {
                    return true;
                }
            }
        }
        return false;
    }

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
    public fillBefore(after: Fragment, toEnd = false, startIndex = 0): Fragment | null {
        const seenStates = new Set<ContentMatch>([this]);

        /**
         * Recursively search for a valid sequence of node types to insert.
         *
         * @param match - The current match state
         * @param types - The accumulated list of node types to insert
         * @returns A fragment of nodes if successful, null otherwise
         */
        const searchForValidSequence = (match: ContentMatch, types: ReadonlyArray<NodeType>): Fragment | null => {
            const matchedState: ContentMatch | null = (match as DocumentContentMatch).matchFragment(after, startIndex);
            if (matchedState && (!toEnd || matchedState.validEnd)) {
                return Fragment.from(types.map((nodeType: NodeType) => nodeType.createAndFill()));
            }

            for (const edge of (match as DocumentContentMatch).nextMatch) {
                const {type, next} = edge;
                const canInsertType: boolean = !type.isText && !type.hasRequiredAttrs();
                const notYetSeen = !seenStates.has(next);

                if (canInsertType && notYetSeen) {
                    seenStates.add(next);
                    const found: Fragment | null = searchForValidSequence(next, types.concat(type));
                    if (found) {
                        return found;
                    }
                }
            }
            return null;
        };

        return searchForValidSequence(this, []);
    }

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
    public findWrapping(target: NodeType): ReadonlyArray<NodeType> | null {
        // Check cache first for O(1) lookup
        const cached = this.wrapCache.get(target);
        if (cached !== undefined) {
            return cached;
        }

        const computed: ReadonlyArray<NodeType> | null = this.computeWrapping(target);
        this.wrapCache.set(target, computed);
        return computed;
    }

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
    public edge(number: number): MatchEdge {
        if (number < 0 || number >= this.nextMatch.length) {
            throw new RangeError(
                `Edge index ${number} is out of bounds. Valid range: 0-${this.nextMatch.length - 1}`
            );
        }
        return this.nextMatch[number];
    }

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
    public toString(): string {
        const seenStates: Array<ContentMatch> = [];
        const seenSet = new Set<ContentMatch>();
        this.scan(this, seenStates, seenSet);

        // Build index map for O(1) lookups instead of O(n) indexOf calls
        const stateIndexMap = new Map<ContentMatch, number>();
        seenStates.forEach((state: ContentMatch, index: number): void => {
            stateIndexMap.set(state, index);
        });

        return seenStates.map((contentMatch: ContentMatch, stateIndex: number): string => {
            const validEndMarker = contentMatch.validEnd ? '*' : ' ';
            let output = `${stateIndex}${validEndMarker} `;

            for (let edgeIndex = 0; edgeIndex < (contentMatch as DocumentContentMatch).nextMatch.length; edgeIndex++) {
                const edge: MatchEdge = (contentMatch as DocumentContentMatch).nextMatch[edgeIndex];
                const separator = edgeIndex > 0 ? ', ' : '';
                const targetStateIndex: number = stateIndexMap.get(edge.next) ?? -1;
                output += `${separator}${edge.type.name}->${targetStateIndex}`;
            }

            return output;
        }).join('\n');
    }

    /**
     * Internal implementation of matchFragment.
     *
     * Performs sequential matching by folding over the fragment's children,
     * transitioning through states using matchType() for each child node.
     * Short-circuits and returns null if any match fails.
     *
     * @param fragment The fragment to match. Children are accessed by index.
     * @param start The starting index in the fragment (inclusive).
     * @param end The ending index in the fragment (exclusive).
     * @returns The resulting content match state after matching all nodes in range,
     *          or null if any node in the sequence fails to match.
     * @private
     */
    private matchFragmentInternal(fragment: Fragment, start: number, end: number): ContentMatch | null {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let currentMatch: ContentMatch | null = this;

        for (let i = start; i < end && currentMatch; i++) {
            currentMatch = currentMatch.matchType(fragment.child(i).type);
        }

        return currentMatch;
    }

    /**
     * Recursively scan all reachable content match states starting from the given state.
     * Uses depth-first search to build a list of all reachable states.
     *
     * The seenSet provides O(1) membership checking to avoid revisiting states,
     * while seenStates maintains the ordered list of discovered states for output.
     *
     * @param contentMatch The current content match state to scan from.
     * @param seenStates Array to accumulate all visited states in discovery order.
     * @param seenSet Set for O(1) membership checking to avoid cycles.
     * @private
     */
    private scan(contentMatch: ContentMatch, seenStates: Array<ContentMatch>, seenSet: Set<ContentMatch>): void {
        seenStates.push(contentMatch);
        seenSet.add(contentMatch);

        for (const edge of (contentMatch as DocumentContentMatch).nextMatch) {
            if (!seenSet.has(edge.next)) {
                this.scan(edge.next, seenStates, seenSet);
            }
        }
    }

    /**
     * Compute a set of wrapping node types that would allow a node of the
     * given type to appear at this position. Uses breadth-first search to find
     * the shortest wrapping sequence.
     *
     * The algorithm explores possible wrapping types level by level:
     * 1. Start from the current match state
     * 2. For each outgoing edge, consider the node type as a potential wrapper
     * 3. Check if the target can be placed inside that wrapper
     * 4. If not, recursively explore that wrapper's content
     * 5. Track visited types to avoid cycles
     *
     * BFS ensures we find the shortest wrapping sequence (fewest nesting levels).
     * The via chain allows reconstructing the full wrapping path when found.
     *
     * @param target The node type to find wrapping for. This is what we want to fit.
     * @returns An array of node types to wrap with (from outermost to innermost),
     *          empty array if the target fits directly at this position,
     *          or null if no valid wrapping sequence exists.
     * @private
     */
    private computeWrapping(target: NodeType): ReadonlyArray<NodeType> | null {
        const seenTypeNames: Record<string, boolean> = {};
        const queue: Array<ActiveNode> = [{match: this, type: null, via: null}];

        while (queue.length > 0) {
            const currentNode: ActiveNode = queue.shift();
            if (!currentNode) {continue;}

            const currentMatch: ContentMatch = currentNode.match;

            // Check if we can directly match the target type
            if (currentMatch.matchType(target)) {
                const wrappingChain: Array<NodeType> = [];

                // Build the wrapping chain by traversing back through the via links
                // We know node.via is not null when node.type is truthy due to BFS construction
                let node: ActiveNode | null = currentNode;
                while (node?.type) {
                    wrappingChain.push(node.type);
                    node = node.via;
                }

                return wrappingChain.reverse();
            }

            // Explore possible wrapping types
            for (const edge of (currentMatch as DocumentContentMatch).nextMatch) {
                const {type, next} = edge;
                const canWrapWithType: boolean =
                    !type.isLeaf
                    && !type.hasRequiredAttrs()
                    && !seenTypeNames[type.name]
                    && (!currentNode.type || next.validEnd);

                if (canWrapWithType) {
                    queue.push({match: type.contentMatch, type, via: currentNode});
                    seenTypeNames[type.name] = true;
                }
            }
        }

        return null;
    }
}

