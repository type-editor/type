import {type Command, type DispatchFunction, type PmEditorState, type PmTransaction} from '@type-editor/editor-types';
import type {Attrs, ContentMatch, NodeType, PmNode, ResolvedPos} from '@type-editor/model';
import {canSplit} from '@type-editor/transform';

import type {SplitInfo} from './types/SplitInfo';


/**
 * Standard command to split the parent block at the selection.
 *
 * This is the default block splitting command, typically bound to the Enter key.
 * It deletes any selected content and splits the current block, creating a new
 * block of an appropriate type.
 *
 * @example
 * ```typescript
 * // Basic usage in keymap
 * const keymap = {
 *   'Enter': splitBlock
 * };
 *
 * // Use with chainCommands for special cases
 * const keymap = {
 *   'Enter': chainCommands(
 *     newlineInCode,
 *     exitCode,
 *     liftEmptyBlock,
 *     splitBlock
 *   )
 * };
 * ```
 */
export const splitBlock: Command = splitBlockAs();


/**
 * Creates a command that splits the parent block at the selection.
 *
 * This command factory creates variants of block splitting behavior, which is typically
 * bound to the Enter key. The command handles several scenarios:
 *
 * **Node Selection**: If a block node is selected, splits before it.
 *
 * **Text Selection**: Deletes the selection content and splits the block at that point,
 * creating a new block after the current one.
 *
 * The optional `splitNode` function allows customizing the type of the newly created
 * block. This is useful for:
 * - Creating different block types based on context
 * - Preserving certain attributes when splitting
 * - Implementing custom Enter key behavior
 *
 * If no custom function is provided, the command uses intelligent defaults:
 * - At the end of a block: creates a default textblock (usually paragraph)
 * - In the middle: preserves the current block type
 *
 * @param splitNode - Optional function to determine the type of the new block
 * @returns A command that performs the block split
 *
 * @example
 * ```typescript
 * // Default split behavior
 * const keymap = {
 *   'Enter': splitBlock
 * };
 *
 * // Custom split that preserves heading level
 * const splitHeading = splitBlockAs((node, atEnd) => {
 *   if (node.type.name === 'heading' && !atEnd) {
 *     return { type: node.type, attrs: node.attrs };
 *   }
 *   return null; // Use default behavior
 * });
 *
 * // Split with custom logic for list items
 * const splitListItem = splitBlockAs((node, atEnd, $from) => {
 *   if (atEnd && node.type.name === 'list_item') {
 *     return { type: schema.nodes.paragraph };
 *   }
 *   return null;
 * });
 * ```
 */
export function splitBlockAs(splitNode?: SplitNodeFunction): Command {
    return (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
        const {$from, $to} = state.selection;

        // Handle block node selection - split before the selected block
        if (state.selection.isNodeSelection() && state.selection.node.isBlock) {
            if (!$from.parentOffset || !canSplit(state.doc, $from.pos)) {
                return false;
            }
            if (dispatch) {
                dispatch(state.transaction.split($from.pos).scrollIntoView());
            }
            return true;
        }

        // Analyze where and how to split
        const splitInfo: SplitInfo = analyzeSplit($from, $to, splitNode);
        if (!splitInfo) {
            return false;
        }

        const transaction: PmTransaction = state.transaction;

        // Delete selection content if present
        if (state.selection.isTextSelection() || state.selection.isAllSelection()) {
            transaction.deleteSelection();
        }

        // Perform the split
        const splitPos: number = transaction.mapping.map($from.pos);
        if (!performSplit(transaction, splitPos, splitInfo.types, splitInfo.defaultNodeType)) {
            return false;
        }

        // Adjust the first block type if needed
        adjustFirstBlockAfterSplit(transaction, $from, splitInfo);

        if (dispatch) {
            dispatch(transaction.scrollIntoView());
        }

        return true;
    };
}


/**
 * Function type for customizing the node type of newly split blocks.
 *
 * @param node - The node being split
 * @param atEnd - Whether the split is at the end of the node
 * @param $from - The resolved position where the split occurs
 * @returns The type and optional attributes for the new block, or null to use default behavior
 */
export type SplitNodeFunction = (node: PmNode,
                                 atEnd: boolean,
                                 $from: ResolvedPos) => { type: NodeType; attrs?: Attrs } | null;

/**
 * Finds the first textblock node type that can be created without required attributes.
 *
 * @param match - The content match to search through
 * @returns The first suitable textblock node type, or null if none found
 */
function findDefaultTextblock(match: ContentMatch): NodeType | null {
    for (let i = 0; i < match.edgeCount; i++) {
        const {type} = match.edge(i);
        if (type.isTextblock && !type.hasRequiredAttrs()) {
            return type;
        }
    }
    return null;
}

/**
 * Determines the split configuration for the current selection.
 *
 * @param $from - The start of the selection
 * @param $to - The end of the selection
 * @param splitNode - Optional custom function to determine split type
 * @returns Split information, or null if splitting is not possible
 */
function analyzeSplit($from: ResolvedPos,
                      $to: ResolvedPos,
                      splitNode?: SplitNodeFunction): SplitInfo | null {
    if ($from.depth === 0) {
        return null;
    }

    const types: Array<null | { type: NodeType; attrs?: Attrs | null }> = [];
    let splitDepth: number | undefined;
    let defaultNodeType: NodeType | null | undefined;
    let atEnd = false;
    let atStart = false;

    // Traverse up from the current position to find the block to split
    for (let depth = $from.depth; depth >= 1; depth--) {
        const node: PmNode = $from.node(depth);

        if (node.isBlock) {
            // Calculate if we're at the start or end of the block
            atEnd = $from.end(depth) === $from.pos + ($from.depth - depth);
            atStart = $from.start(depth) === $from.pos - ($from.depth - depth);

            // Determine the default block type that can follow
            // Ensure we have a valid parent depth (depth >= 1)
            if (depth < 1) {
                return null; // Can't split at document root
            }

            const parentNode: PmNode = $from.node(depth - 1);
            const indexAfter: number = $from.indexAfter(depth - 1);
            defaultNodeType = findDefaultTextblock(parentNode.contentMatchAt(indexAfter));

            // Determine the type for the new split block
            const splitType = splitNode?.($to.parent, atEnd, $from);
            const newBlockType = splitType || (atEnd && defaultNodeType ? { type: defaultNodeType } : null);
            types.push(newBlockType);

            splitDepth = depth;
            break;
        } else {
            if (depth === 1) {
                return null; // Can't split at document level
            }
            types.push(null);
        }
    }

    // Reverse the array once at the end instead of using unshift in loop
    types.reverse();

    if (splitDepth === undefined) {
        return null;
    }

    return { types, depth: splitDepth, defaultNodeType, atEnd, atStart };
}

/**
 * Attempts to perform the split operation with the given types.
 *
 * @param transaction - The transaction to modify
 * @param splitPos - The position where the split should occur
 * @param types - The types to use for the split
 * @param defaultNodeType - Fallback node type if the split with types fails
 * @returns `true` if the split was successful, `false` otherwise
 */
function performSplit(transaction: PmTransaction,
                      splitPos: number,
                      types: Array<null | { type: NodeType; attrs?: Attrs | null }>,
                      defaultNodeType: NodeType | null): boolean {
    let canPerformSplit: boolean = canSplit(transaction.doc, splitPos, types.length, types);

    // Try with default type if the original split isn't possible
    if (!canPerformSplit && defaultNodeType) {
        types[0] = { type: defaultNodeType };
        canPerformSplit = canSplit(transaction.doc, splitPos, types.length, types);
    }

    if (!canPerformSplit) {
        return false;
    }

    transaction.split(splitPos, types.length, types);
    return true;
}

/**
 * Adjusts the node type of the first block after split if needed.
 *
 * @param transaction - The transaction to modify
 * @param $from - The original from position
 * @param splitInfo - Information about the split
 */
function adjustFirstBlockAfterSplit(transaction: PmTransaction,
                                    $from: ResolvedPos,
                                    splitInfo: SplitInfo): void {
    const { depth, defaultNodeType, atEnd, atStart } = splitInfo;

    // Only adjust if we're at the start but not at the end, and the type differs
    if (atEnd || !atStart || !defaultNodeType) {
        return;
    }

    const originalNode: PmNode = $from.node(depth);
    if (originalNode.type === defaultNodeType) {
        return;
    }

    const firstBlockPos: number = transaction.mapping.map($from.before(depth));
    const $first: ResolvedPos = transaction.doc.resolve(firstBlockPos);
    const parent: PmNode = $from.node(depth - 1);
    const index: number = $first.index();

    // Check if we can replace with the default type
    if (parent.canReplaceWith(index, index + 1, defaultNodeType)) {
        transaction.setNodeMarkup(firstBlockPos, defaultNodeType);
    }
}

