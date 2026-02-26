import type { Command, DispatchFunction, PmEditorState, PmEditorView, PmTransaction } from '@type-editor/editor-types';
import type {PmNode, ResolvedPos} from '@type-editor/model';
import {canJoin} from '@type-editor/transform';


/**
 * Wraps a command to automatically join adjacent nodes when they become joinable
 * after the command executes.
 *
 * This higher-order function takes a command and a joinability criterion, and returns
 * a new command that will automatically join adjacent nodes that meet the criterion
 * after the original command's transformation is applied.
 *
 * Nodes are considered joinable when they are of the same type and when the
 * `isJoinable` predicate returns true for them. If an array of strings is passed
 * instead, nodes are joinable if their type name is in the array.
 *
 * @param command - The command to wrap with auto-joining behavior
 * @param isJoinable - Either a predicate function that determines if two nodes can be joined,
 *                     or an array of node type names that should be auto-joined
 * @returns A new command with auto-joining behavior
 *
 * @example
 * ```typescript
 * // Join nodes of specific types
 * const wrappedCommand = autoJoin(myCommand, ['paragraph', 'heading']);
 *
 * // Join nodes based on custom logic
 * const wrappedCommand = autoJoin(myCommand, (before, after) => {
 *   return before.attrs.level === after.attrs.level;
 * });
 * ```
 */
export function autoJoin(command: Command,
                         isJoinable: ((before: PmNode, after: PmNode) => boolean) | ReadonlyArray<string>): Command {
    // Convert array of type names to a predicate function
    const joinPredicate: (before: PmNode, after: PmNode) => boolean = Array.isArray(isJoinable)
        ? (node: PmNode): boolean => (isJoinable as ReadonlyArray<string>).includes(node.type.name)
        : isJoinable as (before: PmNode, after: PmNode) => boolean;

    return (state: PmEditorState, dispatch?: DispatchFunction, view?: PmEditorView): boolean => {
        const wrappedDispatch: (transaction: PmTransaction) => void = dispatch ? wrapDispatchForJoin(dispatch, joinPredicate) : undefined;
        return command(state, wrappedDispatch, view);
    };
}


/**
 * Wraps a dispatch function to automatically join adjacent nodes that meet the joinable criteria.
 *
 * @param dispatch - The dispatch function to wrap
 * @param isJoinable - Predicate function to determine if two nodes can be joined
 * @returns A wrapped dispatch function that performs auto-joining
 */
function wrapDispatchForJoin(dispatch: DispatchFunction,
                             isJoinable: (before: PmNode, after: PmNode) => boolean): (transaction: PmTransaction) => void {
    return (transaction: PmTransaction): void => {
        if (!transaction.isGeneric) {
            dispatch(transaction);
            return;
        }

        // Collect all affected ranges from the transaction's mapping
        const ranges: Array<number> = collectAffectedRanges(transaction);

        // Find all joinable positions within the affected ranges
        const joinablePositions: Array<number> = findJoinablePositions(transaction, ranges, isJoinable);

        // Apply joins in reverse order to maintain position validity
        applyJoins(transaction, joinablePositions);

        dispatch(transaction);
    };
}

/**
 * Collects all ranges affected by the transaction's mapping.
 *
 * @param transaction - The transaction to analyze
 * @returns Array of position pairs representing affected ranges
 */
function collectAffectedRanges(transaction: PmTransaction): Array<number> {
    const ranges: Array<number> = [];

    for (const map of transaction.mapping.maps) {
        // Update existing ranges with the current map
        for (let j = 0; j < ranges.length; j++) {
            ranges[j] = map.map(ranges[j]);
        }

        // Add new ranges from the current map
        map.forEach((_s: number, _e: number, from: number, to: number): void => {
            ranges.push(from, to);
        });
    }

    return ranges;
}

/**
 * Finds all positions where nodes can be joined within the given ranges.
 *
 * @param transaction - The transaction containing the document
 * @param ranges - Array of position pairs to check
 * @param isJoinable - Predicate to determine if two nodes can be joined
 * @returns Array of positions where joins can occur
 */
function findJoinablePositions(transaction: PmTransaction,
                               ranges: ReadonlyArray<number>,
                               isJoinable: (before: PmNode, after: PmNode) => boolean): Array<number> {
    const joinableSet = new Set<number>();

    // Process ranges in pairs (from, to)
    // Ensure we have complete pairs by checking length - 1
    for (let i = 0; i < ranges.length - 1; i += 2) {

        const from: number = ranges[i];
        const to: number = ranges[i + 1];
        const $from: ResolvedPos = transaction.doc.resolve(from);
        const depth: number = $from.sharedDepth(to);
        const parent: PmNode = $from.node(depth);

        // Check all node boundaries within the range
        let pos: number = $from.after(depth + 1);
        for (let index = $from.indexAfter(depth); pos <= to; index++) {
            const after: PmNode = parent.maybeChild(index);
            if (!after) {
                break;
            }

            // Check if this position can be joined with the previous node
            if (index > 0 && !joinableSet.has(pos)) {
                const before: PmNode = parent.child(index - 1);
                if (before.type === after.type && isJoinable(before, after)) {
                    joinableSet.add(pos);
                }
            }

            pos += after.nodeSize;
        }
    }

    return Array.from(joinableSet);
}

/**
 * Applies join operations at the specified positions.
 *
 * @param transaction - The transaction to modify
 * @param positions - Positions where joins should occur
 */
function applyJoins(transaction: PmTransaction, positions: Array<number>): void {
    // Sort positions and apply joins in reverse order to maintain validity
    positions.sort((a, b) => a - b);

    for (let i = positions.length - 1; i >= 0; i--) {
        if (canJoin(transaction.doc, positions[i])) {
            transaction.join(positions[i]);
        }
    }
}

