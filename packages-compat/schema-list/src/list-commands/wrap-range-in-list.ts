import {type Attrs, Fragment, type Node, NodeRange, type NodeType, type ResolvedPos, Slice} from '@type-editor-compat/model';
import type {Transaction} from '@type-editor-compat/state';
import {canSplit, findWrapping, ReplaceAroundStep} from '@type-editor-compat/transform';

/**
 * Attempts to wrap the given node range in a list of the specified type.
 *
 * This function handles special cases such as when the range is already at the top
 * of an existing list item, and determines whether the wrapping operation is possible.
 *
 * @param transaction - The transaction to add the wrapping operation to. If `null`,
 *                      the function only queries whether the wrapping is possible without
 *                      applying any changes.
 * @param range - The range of nodes to be wrapped in the list.
 * @param listType - The type of list node to wrap the range in (e.g., bullet_list, ordered_list).
 * @param attrs - Optional attributes to apply to the list node. Defaults to `null`.
 *
 * @returns `true` if the wrapping is possible (and applied if transaction is non-null),
 *          `false` otherwise.
 */
export function wrapRangeInList(transaction: Transaction | null,
                                range: NodeRange,
                                listType: NodeType,
                                attrs: Attrs | null = null): boolean {
    let doJoin = false;
    let outerRange: NodeRange = range;
    const doc: Node = range.$from.doc;

    // Handle case where range is at the top of an existing list item
    if (isAtTopOfListItem(range, listType)) {
        // Don't do anything if this is the top of the list
        if (range.$from.index(range.depth - 1) === 0) {
            return false;
        }

        const $insert: ResolvedPos = doc.resolve(range.start - 2);
        outerRange = new NodeRange($insert, $insert, range.depth);

        if (range.endIndex < range.parent.childCount) {
            range = new NodeRange(
                range.$from,
                doc.resolve(range.$to.end(range.depth)),
                range.depth
            );
        }

        doJoin = true;
    }

    const wrap = findWrapping(outerRange, listType, attrs, range);

    if (!wrap) {
        return false;
    }

    if (transaction) {
        doWrapInList(transaction, range, wrap, doJoin, listType);
    }

    return true;
}

/**
 * Performs the actual wrapping operation on a transaction.
 *
 * This function applies a ReplaceAroundStep to wrap the range in the specified
 * wrapper nodes, and then splits the content appropriately to create individual
 * list items for each node in the range.
 *
 * @param transaction - The transaction to apply the wrapping steps to.
 * @param range - The range of nodes to be wrapped.
 * @param wrappers - An array of wrapper specifications, each containing a node type
 *                   and optional attributes. These wrappers are nested from outermost
 *                   to innermost.
 * @param joinBefore - If `true`, the wrapping will join with a preceding list item,
 *                     adjusting the position offset accordingly.
 * @param listType - The type of list node being created (used to determine split depth).
 *
 * @returns The modified transaction with the wrapping steps applied.
 */
function doWrapInList(transaction: Transaction,
                      range: NodeRange,
                      wrappers: Array<{ type: NodeType; attrs?: Attrs | null }>,
                      joinBefore: boolean,
                      listType: NodeType): Transaction {
    const content: Fragment = buildWrapperContent(wrappers);
    const joinOffset: number = joinBefore ? 2 : 0;

    transaction.step(
        new ReplaceAroundStep(
            range.start - joinOffset,
            range.end,
            range.start,
            range.end,
            new Slice(content, 0, 0),
            wrappers.length,
            true
        )
    );

    const listTypeDepth: number = findListTypeDepth(wrappers, listType);
    const splitDepth: number = wrappers.length - listTypeDepth;
    let splitPos: number = range.start + wrappers.length - joinOffset;
    const parent: Node = range.parent;

    for (let i = range.startIndex; i < range.endIndex; i++) {
        const shouldSplit: boolean = i > range.startIndex && canSplit(transaction.doc, splitPos, splitDepth);

        if (shouldSplit) {
            transaction.split(splitPos, splitDepth);
            splitPos += 2 * splitDepth;
        }

        splitPos += parent.child(i).nodeSize;
    }

    return transaction;
}


/**
 * Checks if the range is at the top of an existing list item.
 *
 * This helper function determines whether the current range starts at the beginning
 * of a node that can contain list content, which is relevant for handling special
 * wrapping cases.
 *
 * @param range - The node range to check.
 * @param listType - The type of list node to check compatibility with.
 *
 * @returns `true` if the range is at the top of an existing list item, `false` otherwise.
 */
function isAtTopOfListItem(range: NodeRange, listType: NodeType): boolean {
    return (
        range.depth >= 2 &&
        range.$from.node(range.depth - 1).type.compatibleContent(listType) &&
        range.startIndex === 0
    );
}


/**
 * Builds nested wrapper content from a list of wrapper specifications.
 *
 * This function creates a nested structure of nodes from the wrappers array,
 * processing them in reverse order so that the innermost wrapper becomes the
 * deepest node in the hierarchy.
 *
 * @param wrappers - An array of wrapper specifications, each containing a node type
 *                   and optional attributes. The array is ordered from outermost to innermost.
 *
 * @returns A Fragment containing the nested wrapper nodes.
 */
function buildWrapperContent(wrappers: Array<{ type: NodeType; attrs?: Attrs | null }>): Fragment {
    let content: Fragment = Fragment.empty;

    for (let i = wrappers.length - 1; i >= 0; i--) {
        content = Fragment.from(wrappers[i].type.create(wrappers[i].attrs, content));
    }

    return content;
}

/**
 * Finds the depth of the list type within the wrappers array.
 *
 * This function searches through the wrappers to locate the position of the
 * specified list type, which is used to determine the correct split depth
 * when creating individual list items.
 *
 * @param wrappers - An array of wrapper specifications to search through.
 * @param listType - The type of list node to find within the wrappers.
 *
 * @returns The depth (1-indexed position) of the list type within the wrappers,
 *          or 0 if the list type is not found.
 */
function findListTypeDepth(wrappers: Array<{ type: NodeType; attrs?: Attrs | null }>,
                           listType: NodeType): number {
    let depth = 0;

    for (let i = 0; i < wrappers.length; i++) {
        if (wrappers[i].type === listType) {
            depth = i + 1;
        }
    }

    return depth;
}
