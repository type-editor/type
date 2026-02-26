/**
 * A function type for generating opening or closing mark syntax.
 *
 * @param state - The current serializer state
 * @param mark - The mark to serialize
 * @param parent - The parent node containing the marked content
 * @param index - The index of the marked content within its parent
 * @returns The opening or closing markdown syntax for the mark
 */
import type {Mark, Node} from '@type-editor/model';

import type {MarkdownSerializerState} from '../to-markdown/MarkdownSerializerState';


export type MarkSerializerFunc = (state: MarkdownSerializerState, mark: Mark, parent: Node, index: number) => string;

export interface MarkSerializerSpec {
    /**
     * The string that should appear before a piece of content marked
     * by this mark, either directly or as a function that returns an
     * appropriate string.
     */
    open: string | MarkSerializerFunc,
    /**
     * The string that should appear after a piece of content marked by
     * this mark.
     */
    close: string | MarkSerializerFunc,
    /**
     * When `true`, this indicates that the order in which the mark's
     * opening and closing syntax appears relative to other mixable
     * marks can be varied. (For example, you can say `**a *b***` and
     * `*a **b***`, but not `` `a *b*` ``.)
     */
    mixable?: boolean,
    /**
     * When enabled, causes the serializer to move enclosing whitespace
     * from inside the marks to outside the marks. This is necessary
     * for emphasis marks as CommonMark does not permit enclosing
     * whitespace inside emphasis marks, see:
     * http://spec.commonmark.org/0.26/#example-330
     */
    expelEnclosingWhitespace?: boolean,
    /**
     * Can be set to `false` to disable character escaping in a mark. A
     * non-escaping mark has to have the highest precedence (must
     * always be the innermost mark).
     */
    escape?: boolean
}
