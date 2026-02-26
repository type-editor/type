import type {Attrs, Node, NodeRange, NodeType, ResolvedPos} from '@type-editor/model';
import type {EditorState, Transaction,} from '@type-editor/state';
import {canJoin, findWrapping,} from '@type-editor/transform';

import {InputRule} from '../InputRule';

/**
 * Build an input rule for automatically wrapping a textblock when a
 * given string is typed. The `regexp` argument is
 * directly passed through to the `InputRule` constructor. You'll
 * probably want the regexp to start with `^`, so that the pattern can
 * only occur at the start of a textblock.
 *
 * `nodeType` is the type of node to wrap in. If it needs attributes,
 * you can either pass them directly, or pass a function that will
 * compute them from the regular expression match.
 *
 * By default, if there's a node with the same type above the newly
 * wrapped node, the rule will try to [join](#transform.Transform.join) those
 * two nodes. You can pass a join predicate, which takes a regular
 * expression match and the node before the wrapped node, and can
 * return a boolean to indicate whether a join should happen.
 *
 * @param regexp
 * @param nodeType
 * @param getAttrs
 * @param joinPredicate
 */
export function wrappingInputRule(regexp: RegExp,
                                  nodeType: NodeType,
                                  getAttrs: Attrs | null | ((matches: RegExpMatchArray) => Attrs | null) = null,
                                  joinPredicate?: (match: RegExpMatchArray, node: Node) => boolean): InputRule {

    return new InputRule(regexp, (state: EditorState, match: RegExpMatchArray, start: number, end: number): Transaction => {
        const attrs: Attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
        const transaction: Transaction = state.transaction.delete(start, end);
        const $start: ResolvedPos = transaction.doc.resolve(start);
        const range: NodeRange | null = $start.blockRange();
        const wrapping: Array<{ type: NodeType; attrs: Attrs | null }> | null = range ? findWrapping(range, nodeType, attrs) : null;

        if (!wrapping) {
            return null;
        }
        transaction.wrap(range, wrapping);

        // Check if we can join with the node before, but only if start > 0 to avoid resolving position -1
        if (start > 0) {
            const before: Node = transaction.doc.resolve(start - 1).nodeBefore;
            if (before?.type === nodeType
                && canJoin(transaction.doc, start - 1)
                && (!joinPredicate || joinPredicate(match, before))) {

                transaction.join(start - 1);
            }
        }
        return transaction;
    });
}
