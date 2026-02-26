import {type ContentMatch, Fragment, type Node, type NodeType, type ResolvedPos} from '@type-editor/model';


/**
 * Try to wrap a list of top-level sibling nodes so they fit into a parent
 * in the current context. This transforms nodes where necessary to make
 * the slice coherent (so Transform.replace can insert it).
 *
 * @param fragment - Fragment containing top-level nodes
 * @param $context - Current resolved position context
 * @returns Either the original fragment or a new fragment with wrapped nodes
 */
export function normalizeSiblings(fragment: Fragment, $context: ResolvedPos): Fragment {
    if (fragment.childCount < 2) {
        return fragment;
    }

    for (let depth = $context.depth; depth >= 0; depth--) {
        const parent: Node = $context.node(depth);
        let match: ContentMatch = parent.contentMatchAt($context.index(depth));
        let lastWrap: ReadonlyArray<NodeType> | undefined;
        let grouped: Array<Node> | null = [];

        fragment.forEach((node: Node): void => {
            if (!grouped) {return;}
            const wrap: ReadonlyArray<NodeType> = match.findWrapping(node.type);
            if (!wrap) {
                grouped = null;
                return;
            }

            // Try to append node to previous grouped node when wrapping types match
            if (grouped.length > 0 && lastWrap && canAddToLast(wrap, lastWrap, node, grouped[grouped.length - 1])) {
                // addToSibling returns a new node if added, otherwise undefined
                const merged: Node = addToSibling(wrap, lastWrap, node, grouped[grouped.length - 1], 0);
                if (merged) {
                    grouped[grouped.length - 1] = merged;
                    match = match.matchType(grouped[grouped.length - 1].type);
                    return;
                }
            }

            if (grouped.length > 0) {
                grouped[grouped.length - 1] = closeRight(grouped[grouped.length - 1], lastWrap ? lastWrap.length : 0);
            }
            const wrapped: Node = withWrappers(node, wrap);
            grouped.push(wrapped);
            match = match.matchType(wrapped.type);
            lastWrap = wrap;
        });

        if (grouped) {
            return Fragment.from(grouped);
        }
    }

    return fragment;
}

/**
 * Create nested wrapper nodes around `node` according to the `wrap` array.
 * @param node - Node to wrap
 * @param wrap - List of node types representing the wrapper path (outermost last)
 * @param from - Index in wrap to start from (defaults to 0)
 */
function withWrappers(node: Node,
                      wrap: ReadonlyArray<NodeType>,
                      from = 0): Node {
    for (let i = wrap.length - 1; i >= from; i--) {
        node = wrap[i].create(null, Fragment.from(node));
    }
    return node;
}

/**
 * Small helper used by `normalizeSiblings` to quickly check whether `wrap`
 * and `lastWrap` share the same prefix so adding to the last sibling is possible.
 */
function canAddToLast(wrap: ReadonlyArray<NodeType>,
                      lastWrap: ReadonlyArray<NodeType>,
                      _node: Node,
                      _sibling: Node): boolean {
    // Quick length-and-equality checks mimic original logic
    return wrap.length > 0
        && lastWrap.length > 0
        && wrap[0] === lastWrap[0];
}

/**
 * Try to merge a node into an existing sibling that has a similar wrapper path.
 * This mirrors the original addToSibling logic but with clearer flow and types.
 *
 * @param wrap - Wrapping node types for the node to add
 * @param lastWrap - Wrapping node types for the sibling
 * @param node - The node to add
 * @param sibling - The existing sibling to attempt to merge into
 * @param depth - Current depth in recursive descent
 * @returns A new sibling node with the node merged in, or undefined
 */
function addToSibling(wrap: ReadonlyArray<NodeType>,
                      lastWrap: ReadonlyArray<NodeType>,
                      node: Node,
                      sibling: Node,
                      depth: number): Node | undefined {

    if (depth < wrap.length && depth < lastWrap.length && wrap[depth] === lastWrap[depth]) {
        // Try to recurse into the last child's subtree first
        const lastChild: Node = sibling.lastChild;
        if (lastChild) {
            const inner: Node = addToSibling(wrap, lastWrap, node, lastChild, depth + 1);
            if (inner) {
                return sibling.copy(sibling.content.replaceChild(sibling.childCount - 1, inner));
            }
        }

        const match: ContentMatch = sibling.contentMatchAt(sibling.childCount);
        const typeToMatch: NodeType = depth === wrap.length - 1 ? node.type : wrap[depth + 1];
        if (match.matchType(typeToMatch)) {
            const appended: Fragment = sibling.content.append(Fragment.from(withWrappers(node, wrap, depth + 1)));
            return sibling.copy(appended);
        }
    }
    return undefined;
}

/**
 * Close off the rightmost open positions in a node down to `depth` levels.
 * @param node - Node to close
 * @param depth - The number of wrapper levels to close
 * @returns A new node with the specified number of rightmost levels closed
 */
export function closeRight(node: Node, depth: number): Node {
    if (depth === 0) {return node;}

    const lastChild: Node = node.lastChild;
    if (!lastChild) {return node;}

    const replacedChild: Node = closeRight(lastChild, depth - 1);
    const fragment: Fragment = node.content.replaceChild(node.childCount - 1, replacedChild);
    const fill: Fragment = node.contentMatchAt(node.childCount).fillBefore(Fragment.empty, true);
    return node.copy(fragment.append(fill));
}
