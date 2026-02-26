import type {Mark} from '../../elements/Mark';
import type {Attrs} from '../schema/Attrs';
import type {GenericParseRule} from './GenericParseRule';


/**
 * A parse rule targeting a style property.
 */
export interface StyleParseRule extends GenericParseRule {

    /**
     * A CSS property name to match. This rule will match inline styles
     * that list that property. May also have the form
     * `'property=value'`, in which case the rule only matches if the
     * property's value exactly matches the given value. (For more
     * complicated filters, use [`getAttrs`](#model.StyleParseRule.getAttrs)
     * and return false to indicate that the match failed.) Rules
     * matching styles may only produce [marks](#model.GenericParseRule.mark),
     * not nodes.
     */
    style: string;

    /**
     * @internal
     * Given to make TS see ParseRule as a tagged union
     */
    tag?: undefined;

    /**
     * Style rules can remove marks from the set of active marks.
     *
     * @param mark The mark to check for removal.
     * @returns `true` if the mark should be removed, `false` otherwise.
     */
    clearMark?: (mark: Mark) => boolean;

    /**
     * A function used to compute the attributes for the node or mark
     * created by this rule. Can also be used to describe further
     * conditions the style must match. When it returns `false`, the
     * rule won't match. When it returns null or undefined, that is
     * interpreted as an empty/default set of attributes.
     *
     * @param value The value of the style property.
     */
    getAttrs?: (value: string) => Attrs | false | null;
}
