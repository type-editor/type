import type {NodeType} from '../schema/NodeType';
import type {ContentMatch} from '../types/content-parser/ContentMatch';
import type {ContentPattern} from '../types/content-parser/ContentPattern';
import type {NFATransition} from '../types/content-parser/NFATransition';
import {DocumentContentMatch} from './DocumentContentMatch';
import type {TokenStream} from './TokenStream';


/**
 * Compiles content expressions into a deterministic finite automaton (DFA).
 *
 * The compilation process follows these steps:
 * 1. Build a Non-deterministic Finite Automaton (NFA) from the expression AST
 * 2. Convert the NFA to a DFA using subset construction
 * 3. Validate the DFA for dead-end states (non-generatable required content)
 *
 * For background on NFA/DFA construction, see:
 * https://swtch.com/~rsc/regexp/regexp1.html
 */
export class ContentMatcher {
    /**
     * The Non-deterministic Finite Automaton represented as an array of states.
     * Each state is an array of edges connecting to other states.
     */
    private readonly nfaList: Array<Array<NFATransition>>;

    /** The final compiled Deterministic Finite Automaton */
    private readonly contentMatch: ContentMatch;

    /**
     * Creates a new content matcher and compiles the expression into a DFA.
     *
     * @param expression - The parsed expression AST to compile
     */
    public constructor(expression: ContentPattern) {
        this.nfaList = [[]]; // Start with an initial empty state
        this.nfa(expression);
        this.contentMatch = this.dfa();
    }

    /**
     * Gets the compiled content match automaton.
     *
     * @returns The compiled ContentMatch DFA
     */
    get match(): ContentMatch {
        return this.contentMatch;
    }

    /**
     * Gets the compiled content match after validating it for dead ends.
     *
     * @param stream - The token stream (used for error reporting)
     * @returns The compiled and validated ContentMatch DFA
     * @throws {SyntaxError} If the expression contains unreachable or non-generatable content
     */
    public getCheckedMatch(stream: TokenStream): ContentMatch {
        this.checkForDeadEnds(stream);
        return this.contentMatch;
    }

    /**
     * Constructs an NFA from a parsed expression AST.
     *
     * The NFA is represented as an array of states, where each state is an array
     * of edges ({term, to} objects). The first state (index 0) is the entry state,
     * and the last state is the accepting/success state.
     *
     * Note: Unlike typical NFAs, edge ordering is significant here as it's used
     * to construct filler content when necessary for content matching.
     *
     * @param expression - The expression AST to compile into NFA
     */
    private nfa(expression: ContentPattern): void {
        const edges: Array<NFATransition> = this.compile(expression, 0);
        const acceptState: number = this.node();
        this.connect(edges, acceptState);
    }

    /**
     * Converts the NFA into a DFA using subset construction.
     *
     * The DFA is represented as a graph of ContentMatch objects with transitions
     * between them. This allows efficient matching of node sequences against
     * the content expression.
     *
     * @returns The starting state of the DFA as a ContentMatch
     */
    private dfa(): ContentMatch {
        const stateCache = new Map<string, ContentMatch>();
        const startStates: ReadonlyArray<number> = this.nullFrom(0);
        return this.explore(startStates, stateCache);
    }

    /**
     * Connects all edges in an array to a target state.
     *
     * @param edges - The edges to connect
     * @param to - The target state index
     */
    private connect(edges: Array<NFATransition>, to: number): void {
        edges.forEach((edge: NFATransition): void => {
            edge.to = to;
        });
    }

    /**
     * Recursively compiles an expression into NFA edges.
     *
     * Takes an expression and a starting state, and returns an array of edges
     * that need to be connected to the next state. This implements the standard
     * Thompson's construction algorithm for regex-to-NFA conversion.
     *
     * @param expr - The expression to compile
     * @param from - The starting state index
     * @returns Array of edges that exit this expression fragment
     */
    private compile(expr: ContentPattern, from: number): Array<NFATransition> {
        switch (expr.type) {
            case 'choice':
                // For "a | b | c", create parallel paths from the start state
                if (expr.exprs.length === 0) {
                    // Empty choice: epsilon transition (though this should be invalid in practice)
                    return [this.edge(from)];
                }
                return expr.exprs.reduce<Array<NFATransition>>((edges, subExpr) => {
                    return edges.concat(this.compile(subExpr, from));
                }, []);

            case 'seq': {
                // For "a b c", chain expressions together
                if (expr.exprs.length === 0) {
                    // Empty sequence: epsilon transition
                    return [this.edge(from)];
                }
                let currentState: number = from;
                for (let i = 0; i < expr.exprs.length; i++) {
                    const edges: Array<NFATransition> = this.compile(expr.exprs[i], currentState);
                    if (i === expr.exprs.length - 1) {
                        return edges; // Last expression's edges become output edges
                    }
                    // Connect current expression to a new intermediate state
                    currentState = this.node();
                    this.connect(edges, currentState);
                }
                // Should never reach here due to return in loop
                return [];
            }

            case 'star': {
                // For "a*", create loop: from -ε-> loop, loop -a-> loop, loop -ε-> out
                const starLoop: number = this.node();
                this.edge(from, starLoop); // Epsilon transition to loop
                this.connect(this.compile(expr.expr, starLoop), starLoop); // Loop back
                return [this.edge(starLoop)]; // Exit edge
            }

            case 'plus': {
                // For "a+", require at least one: from -a-> loop, loop -a-> loop, loop -ε-> out
                const plusLoop: number = this.node();
                this.connect(this.compile(expr.expr, from), plusLoop); // First iteration
                this.connect(this.compile(expr.expr, plusLoop), plusLoop); // Additional iterations
                return [this.edge(plusLoop)]; // Exit edge
            }

            case 'opt':
                // For "a?", allow bypass: from -ε-> out, from -a-> out
                return [this.edge(from)].concat(this.compile(expr.expr, from));

            case 'range': {
                // For "a{min,max}", create min required + (max-min) optional repetitions
                let currentRangeState: number = from;

                // Create required repetitions (min)
                for (let i = 0; i < expr.min; i++) {
                    const nextState: number = this.node();
                    this.connect(this.compile(expr.expr, currentRangeState), nextState);
                    currentRangeState = nextState;
                }

                // Handle unbounded or additional optional repetitions
                if (expr.max === -1) {
                    // Unbounded: loop back to self
                    this.connect(this.compile(expr.expr, currentRangeState), currentRangeState);
                } else {
                    // Create optional repetitions (max - min)
                    for (let i = expr.min; i < expr.max; i++) {
                        const nextState: number = this.node();
                        this.edge(currentRangeState, nextState); // Epsilon bypass
                        this.connect(this.compile(expr.expr, currentRangeState), nextState);
                        currentRangeState = nextState;
                    }
                }

                return [this.edge(currentRangeState)];
            }

            case 'name':
                // Terminal: create edge labeled with node type
                return [this.edge(from, undefined, expr.value)];

            default:
                // TypeScript exhaustiveness check
                throw new Error(`Unknown expression type: ${(expr as ContentPattern).type}`);
        }
    }

    /**
     * Creates a new edge from one state to another.
     *
     * @param from - The source state index
     * @param to - The target state index (optional, may be connected later)
     * @param term - The node type required to traverse this edge (undefined for epsilon)
     * @returns The created edge object
     */
    private edge(from: number, to?: number, term?: NodeType): NFATransition {
        const edge: NFATransition = {term, to};
        this.nfaList[from].push(edge);
        return edge;
    }

    /**
     * Creates a new state in the NFA.
     *
     * @returns The index of the newly created state
     */
    private node(): number {
        return this.nfaList.push([]) - 1;
    }

    /**
     * Explores NFA state sets to build the DFA using subset construction.
     *
     * Each DFA state represents a set of NFA states. This method recursively
     * explores all reachable DFA states, memoizing results to handle cycles.
     *
     * @param states - Set of NFA state indices representing a DFA state
     * @param stateCache - Cache mapping state sets to ContentMatch objects
     * @returns A ContentMatch representing this DFA state
     */
    private explore(states: ReadonlyArray<number>, stateCache: Map<string, ContentMatch>): ContentMatch {
        // Group transitions by node type
        const transitions = new Map<NodeType, Set<number>>();

        // Collect all outgoing transitions from this set of NFA states
        for (const stateIndex of states) {
            for (const {term, to} of this.nfaList[stateIndex]) {
                if (!term || to === undefined) {
                    continue; // Skip epsilon transitions and unconnected edges
                }

                // Get or create the set of target states for this node type
                let targetStates: Set<number> = transitions.get(term);
                if (!targetStates) {
                    targetStates = new Set<number>();
                    transitions.set(term, targetStates);
                }

                // Add all epsilon-reachable states from the target
                for (const reachableState of this.nullFrom(to)) {
                    targetStates.add(reachableState);
                }
            }
        }

        // Create a ContentMatch for this DFA state
        const isAccepting: boolean = states.includes(this.nfaList.length - 1);
        const dfaState = new DocumentContentMatch(isAccepting);

        // Cache this state before exploring children to handle cycles
        const stateKey: string = states.join(',');
        stateCache.set(stateKey, dfaState);

        // Create transitions to next DFA states
        for (const [nodeType, targetStateSet] of transitions) {
            const targetStates: Array<number> = Array.from(targetStateSet).sort((a, b) => b - a);
            const targetKey: string = targetStates.join(',');

            // Recursively explore or retrieve cached DFA state
            const nextMatch: ContentMatch = stateCache.get(targetKey) || this.explore(targetStates, stateCache);

            dfaState.next.push({type: nodeType, next: nextMatch});
        }

        return dfaState;
    }

    /**
     * Computes the epsilon closure of an NFA state.
     *
     * Returns the set of states reachable from the given state by following
     * only epsilon (null) transitions. States with a single outgoing epsilon
     * edge are skipped to avoid unnecessary duplication in the DFA.
     *
     * @param stateIndex - The starting state index
     * @returns Sorted array of reachable state indices (descending order)
     */
    private nullFrom(stateIndex: number): ReadonlyArray<number> {
        const reachableStates: Array<number> = [];
        const visitedSet = new Set<number>();
        this.scanEpsilonClosure(stateIndex, reachableStates, visitedSet);
        return reachableStates.sort((a, b) => b - a);
    }

    /**
     * Recursively scans epsilon transitions to build the epsilon closure.
     *
     * This method performs a depth-first traversal of epsilon transitions,
     * collecting all reachable states. States with only a single epsilon
     * transition are transparently skipped to optimize the resulting DFA.
     *
     * @param stateIndex - The current state being scanned
     * @param visited - Array collecting visited states (result)
     * @param visitedSet - Set for O(1) duplicate detection
     */
    private scanEpsilonClosure(stateIndex: number, visited: Array<number>, visitedSet: Set<number>): void {
        const edges: Array<NFATransition> = this.nfaList[stateIndex];

        // Optimize: skip states with only one epsilon edge to avoid redundancy
        if (edges.length === 1 && !edges[0].term && edges[0].to !== undefined) {
            this.scanEpsilonClosure(edges[0].to, visited, visitedSet);
            return;
        }

        // Add this state to the result
        visited.push(stateIndex);
        visitedSet.add(stateIndex);

        // Recursively follow epsilon transitions
        for (const {term, to} of edges) {
            if (!term && to !== undefined && !visitedSet.has(to)) {
                this.scanEpsilonClosure(to, visited, visitedSet);
            }
        }
    }

    /**
     * Validates the DFA for dead-end states.
     *
     * A dead-end state is one that:
     * 1. Is not a valid end state (validEnd = false)
     * 2. Only has transitions to non-generatable node types
     *
     * Non-generatable nodes are those that require user input (like text nodes)
     * or have required attributes. If such nodes are required but the state
     * is not valid as an end state, the content expression is invalid.
     *
     * @param stream - The token stream (used for error reporting)
     * @throws {SyntaxError} If a dead-end state is found
     */
    private checkForDeadEnds(stream: TokenStream): void {
        const statesToVisit: Array<ContentMatch> = [this.match];
        const visitedStates = new Set<ContentMatch>();

        for (const state of statesToVisit) {
            // Skip already visited states
            if (visitedStates.has(state)) {
                continue;
            }
            visitedStates.add(state);

            // Check if this is a potential dead-end state
            let isDeadEnd = !state.validEnd;
            const nodeNames: Array<string> = [];

            // Examine all transitions from this state
            for (const {type, next} of state.next) {
                nodeNames.push(type.name);

                // If we find at least one generatable node, this isn't a dead end
                if (isDeadEnd && !(type.isText || type.hasRequiredAttrs())) {
                    isDeadEnd = false;
                }

                // Add unvisited states to the work queue
                if (!visitedStates.has(next)) {
                    statesToVisit.push(next);
                }
            }

            // Report error if this is a dead-end state
            if (isDeadEnd) {
                stream.err(
                    `Only non-generatable nodes (${nodeNames.join(', ')}) in a required position (see https://prosemirror.net/docs/guide/#generatable)`
                );
            }
        }
    }
}
