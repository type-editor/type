import type {Attrs, NodeType, ResolvedPos} from '@type-editor/model';
import type {EditorState, Transaction} from '@type-editor/state';

import {InputRule} from '../InputRule';

/**
 * Build an input rule that changes the type of a textblock when the
 * matched text is typed into it. You'll usually want to start your
 * regexp with `^` to that it is only matched at the start of a
 * textblock. The optional `getAttrs` parameter can be used to compute
 * the new node's attributes, and works the same as in the
 * `wrappingInputRule` function.
 *
 * @param regexp
 * @param nodeType
 * @param getAttrs
 */
export function textblockTypeInputRule(regexp: RegExp,
                                       nodeType: NodeType,
                                       getAttrs: Attrs | null | ((match: RegExpMatchArray) => Attrs | null) = null): InputRule {

    return new InputRule(regexp, (state: EditorState, match: RegExpMatchArray, start: number, end: number): Transaction => {
        const $start: ResolvedPos = state.doc.resolve(start);
        const attrs: Attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
        if (!$start.node(-1).canReplaceWith($start.index(-1), $start.indexAfter(-1), nodeType)) {
            return null;
        }

        return state.transaction.delete(start, end).setBlockType(start, start, nodeType, attrs);
    });
}
