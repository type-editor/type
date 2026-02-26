import type {Fragment} from '../../elements/Fragment';
import type {Attrs} from '../schema/Attrs';
import type {GenericParseRule} from './GenericParseRule';


/**
 * Parse rule targeting a DOM element.
 */
export interface TagParseRule extends GenericParseRule {

    /**
     * A CSS selector describing the kind of DOM elements to match.
     */
    tag: string;

    /**
     * The namespace to match. This can be used to match elements in
     * specific XML namespaces (e.g., SVG or MathML). Nodes are only
     * matched when the namespace matches. When this property is null
     * or undefined, the rule will match elements regardless of their
     * namespace.
     */
    namespace?: string;

    /**
     * The name of the node type to create when this rule matches. Each
     * rule should have either a `node`, `mark`, or `ignore` property
     * (except when it appears in a [node](#model.NodeSpec.parseDOM) or
     * [mark spec](#model.MarkSpec.parseDOM), in which case the `node`
     * or `mark` property will be derived from its position).
     */
    node?: string;

    /**
     * A function used to compute the attributes for the node or mark
     * created by this rule. Can also be used to describe further
     * conditions the DOM element or style must match. When it returns
     * `false`, the rule won't match. When it returns null or undefined,
     * that is interpreted as an empty/default set of attributes.
     *
     * @param node The DOM element that matched this rule.
     */
    getAttrs?: (node: HTMLElement) => Attrs | false | null;

    /**
     * For rules that produce non-leaf nodes, by default the content of
     * the DOM element is parsed as content of the node. If the child
     * nodes are in a descendent node, this may be a CSS selector
     * string that the parser must use to find the actual content
     * element, or a function that returns the actual content element
     * to the parser.
     *
     * When a function, it receives the matched DOM element as a parameter
     * and should return the element whose children should be parsed as
     * content.
     */
    contentElement?: string | HTMLElement | ((node: HTMLElement) => HTMLElement);

    /**
     * Can be used to override the content of a matched node. When
     * present, instead of parsing the node's child nodes, the result of
     * this function is used.
     *
     * @param node The DOM node that matched this rule.
     * @param schema The schema that is being used for parsing.
     */
    getContent?: (node: Node, schema: any) => Fragment;

    /**
     * Controls whether whitespace should be preserved when parsing the
     * content inside the matched element. `false` means whitespace may
     * be collapsed, `true` means that whitespace should be preserved
     * but newlines normalized to spaces, and `'full'` means that
     * newlines should also be preserved.
     */
    preserveWhitespace?: boolean | 'full';
}
