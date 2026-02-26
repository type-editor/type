import type {OrderedMap} from '@type-editor/commons';

import type {MarkSpec} from './MarkSpec';
import type {NodeSpec} from './NodeSpec';


/**
 * An object describing a schema, as passed to the [`Schema`](#model.Schema)
 * constructor.
 *
 * @template Nodes - A string literal type representing the names of node types in the schema
 * @template Marks - A string literal type representing the names of mark types in the schema
 */
export interface SchemaSpec<Nodes extends string = string, Marks extends string = string> {

    /**
     * The node types in this schema. Maps names to
     * [`NodeSpec`](#model.NodeSpec) objects that describe the node type
     * associated with that name. Their order is significant—it
     * determines which [parse rules](#model.NodeSpec.parseDOM) take
     * precedence by default, and which nodes come first in a given
     * [group](#model.NodeSpec.group).
     */
    nodes: Record<Nodes, NodeSpec> | OrderedMap<NodeSpec>,


    /**
     * The mark types that exist in this schema. The order in which they
     * are provided determines the order in which [mark
     * sets](#model.Mark.addToSet) are sorted and in which [parse
     * rules](#model.MarkSpec.parseDOM) are tried.
     */
    marks?: Record<Marks, MarkSpec> | OrderedMap<MarkSpec>;

    /**
     * The name of the default top-level node for the schema. Defaults
     * to `'doc'`.
     */
    topNode?: string;
}
