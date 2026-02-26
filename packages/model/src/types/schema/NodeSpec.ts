import {Node as PmNode} from '../../elements/Node';
import type {DOMOutputSpec} from '../dom-parser/DOMOutputSpec';
import type {TagParseRule} from '../dom-parser/TagParseRule';
import type {PmAttributeSpec} from './PmAttributeSpec';

/**
 * A description of a node type, used when defining a schema.
 */
export interface NodeSpec {

    /**
     * The content expression for this node, as described in the [schema
     * guide](/docs/guide/#schema.content_expressions). When not given,
     * the node does not allow any content.
     */
    content?: string;

    /**
     * The marks that are allowed inside of this node. May be a
     * space-separated string referring to mark names or groups, `'_'`
     * to explicitly allow all marks, or `''` to disallow marks. When
     * not given, nodes with inline content default to allowing all
     * marks, other nodes default to not allowing marks.
     */
    marks?: string;

    /**
     * The group or space-separated groups to which this node belongs,
     * which can be referred to in the content expressions for the
     * schema.
     */
    group?: string;

    /**
     * Should be set to true for inline nodes. (Implied for text nodes.)
     */
    inline?: boolean;

    /**
     * Can be set to true to indicate that, though this isn't a [leaf
     * node](#model.NodeType.isLeaf), it doesn't have directly editable
     * content and should be treated as a single unit in the view.
     */
    atom?: boolean;

    /**
     * The attributes that nodes of this type get.
     */
    attrs?: Record<string, PmAttributeSpec>;

    /**
     * Controls whether nodes of this type can be selected as a [node
     * selection](#state.NodeSelection). Defaults to true for non-text
     * nodes.
     */
    selectable?: boolean;

    /**
     * Determines whether nodes of this type can be dragged without
     * being selected. Defaults to false.
     */
    draggable?: boolean;

    /**
     * Can be used to indicate that this node contains code, which
     * causes some commands to behave differently.
     */
    code?: boolean;

    /**
     * Controls way whitespace in this a node is parsed. The default is
     * `'normal'`, which causes the [DOM parser](#model.DOMParser) to
     * collapse whitespace in normal mode, and normalize it (replacing
     * newlines and such with spaces) otherwise. `'pre'` causes the
     * parser to preserve spaces inside the node. When this option isn't
     * given, but [`code`](#model.NodeSpec.code) is true, `whitespace`
     * will default to `'pre'`. Note that this option doesn't influence
     * the way the node is rendered—that should be handled by `toDOM`
     * and/or styling.
     */
    whitespace?: 'pre' | 'normal';

    /**
     * Determines whether this node is considered an important parent
     * node during replace operations (such as paste). Non-defining (the
     * default) nodes get dropped when their entire content is replaced,
     * whereas defining nodes persist and wrap the inserted content.
     */
    definingAsContext?: boolean;

    /**
     * In inserted content the defining parents of the content are
     * preserved when possible. Typically, non-default-paragraph
     * textblock types, and possibly list items, are marked as defining.
     */
    definingForContent?: boolean;

    /**
     * When enabled, enables both
     * [`definingAsContext`](#model.NodeSpec.definingAsContext) and
     * [`definingForContent`](#model.NodeSpec.definingForContent).
     */
    defining?: boolean;

    /**
     * When enabled (default is false), the sides of nodes of this type
     * count as boundaries that regular editing operations, like
     * backspacing or lifting, won't cross. An example of a node that
     * should probably have this enabled is a table cell.
     */
    isolating?: boolean;

    /**
     * Defines the default way a node of this type should be serialized
     * to DOM/HTML (as used by
     * [`DOMSerializer.fromSchema`](#model.DOMSerializer^fromSchema)).
     * Should return a DOM node or an [array
     * structure](#model.DOMOutputSpec) that describes one, with an
     * optional number zero ("hole") in it to indicate where the node's
     * content should be inserted.
     *
     * For text nodes, the default is to create a text DOM node. Though
     * it is possible to create a serializer where text is rendered
     * differently, this is not supported inside the editor, so you
     * shouldn't override that in your text node spec.
     *
     * @param node - The node to be serialized
     * @returns A DOM output specification describing how to render the node
     */
    toDOM?: (node: PmNode) => DOMOutputSpec;

    /**
     * Associates DOM parser information with this node, which can be
     * used by [`DOMParser.fromSchema`](#model.DOMParser^fromSchema) to
     * automatically derive a parser. The `node` field in the rules is
     * implied (the name of this node will be filled in automatically).
     * If you supply your own parser, you do not need to also specify
     * parsing rules in your schema.
     */
    parseDOM?: ReadonlyArray<TagParseRule>;

    /**
     * Defines the default way a node of this type should be serialized
     * to a string representation for debugging (e.g. in error messages).
     *
     * @param node - The node to be converted to a debug string
     * @returns A string representation of the node for debugging purposes
     */
    toDebugString?: (node: PmNode) => string;

    /**
     * Defines the default way a [leaf node](#model.NodeType.isLeaf) of
     * this type should be serialized to a string (as used by
     * [`Node.textBetween`](#model.Node.textBetween) and
     * [`Node.textContent`](#model.Node.textContent)).
     *
     * @param node - The leaf node to be converted to text
     * @returns The text representation of the leaf node
     */
    leafText?: (node: PmNode) => string;

    /**
     * A single inline node in a schema can be set to be a linebreak
     * equivalent. When converting between block types that support the
     * node and block types that don't but have
     * [`whitespace`](#model.NodeSpec.whitespace) set to `'pre'`,
     * [`setBlockType`](#transform.Transform.setBlockType) will convert
     * between newline characters to or from linebreak nodes as
     * appropriate.
     */
    linebreakReplacement?: boolean;

    /**
     * Can be set to indicate that this node type should be used as the
     * top-level node of the document. Only one node type in a schema
     * should have this set to true. When not specified, the first node
     * type in the schema's node list is used as the top node.
     */
    topNode?: boolean;

    /**
     * Node specs may include arbitrary properties that can be read by
     * other code via [`NodeType.spec`](#model.NodeType.spec).
     */
    // TODO: use Map instead
    [key: string]: any;
}
