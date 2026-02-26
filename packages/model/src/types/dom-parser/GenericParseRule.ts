import type {Attrs} from '../schema/Attrs';

/**
 * Fields that may be present in both [tag](#model.TagParseRule) and
 * [style](#model.StyleParseRule) parse rules.
 */
export interface GenericParseRule {

    /**
     * Can be used to change the order in which the parse rules in a
     * schema are tried. Those with higher priority come first. Rules
     * without a priority are counted as having priority 50. This
     * property is only meaningful in a schema—when directly
     * constructing a parser, the order of the rule array is used.
     */
    priority?: number;

    /**
     * By default, when a rule matches an element or style, no further
     * rules get a chance to match it. By setting this to `false`, you
     * indicate that even when this rule matches, other rules that come
     * after it should also run.
     */
    consuming?: boolean;

    /**
     * When given, restricts this rule to only match when the current
     * context—the parent nodes into which the content is being
     * parsed—matches this expression. Should contain one or more node
     * names or node group names followed by single or double slashes.
     * For example `'paragraph/'` means the rule only matches when the
     * parent node is a paragraph, `'blockquote/paragraph/'` restricts
     * it to be in a paragraph that is inside a blockquote, and
     * `'section//'` matches any position inside a section—a double
     * slash matches any sequence of ancestor nodes. To allow multiple
     * different contexts, they can be separated by a pipe (`|`)
     * character, as in `'blockquote/|list_item/'`.
     */
    context?: string;

    /**
     * The name of the mark type to wrap the matched content in.
     */
    mark?: string;

    /**
     * When true, ignore content that matches this rule. Any `<head>`,
     * `<noscript>`, `<script>`, `<object>`, `<style>`, or `<title>`
     * tags encountered are automatically ignored when no rules match
     * them.
     */
    ignore?: boolean;

    /**
     * When true, finding an element that matches this rule will close
     * the current node.
     */
    closeParent?: boolean;

    /**
     * When true, ignore the node that matches this rule, but do parse
     * its content. Can also be a DOM node to use as the content source
     * instead of the matched element.
     */
    skip?: boolean | Node;

    /**
     * Attributes for the node or mark created by this rule. When
     * `getAttrs` is provided, it takes precedence. This can be used
     * to provide static attributes that should be applied to all
     * nodes or marks created by this rule. For dynamic attributes
     * based on the DOM element or style, use `getAttrs` instead.
     */
    attrs?: Attrs;
}
