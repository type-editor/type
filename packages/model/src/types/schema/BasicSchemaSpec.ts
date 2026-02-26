import type {OrderedMap} from '@type-editor/commons';

/**
 * A basic schema specification with ordered maps for nodes and marks.
 * This is a simplified version of SchemaSpec that uses OrderedMap directly.
 *
 * @template NodeSpec - The type for node specifications
 * @template MarkSpec - The type for mark specifications
 */
export interface BasicSchemaSpec<NodeSpec, MarkSpec> {
    /**
     * An ordered map of node specifications. The order determines parsing
     * precedence and group membership priority.
     */
    nodes: OrderedMap<NodeSpec>,

    /**
     * An ordered map of mark specifications. The order determines mark
     * set sorting and parsing rule priority.
     */
    marks: OrderedMap<MarkSpec>,

    /**
     * The name of the default top-level node for the schema. Defaults
     * to `'doc'`.
     */
    topNode?: string;
}
