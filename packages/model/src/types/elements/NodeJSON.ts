import type {Attrs} from '../schema/Attrs';
import type {MarkJSON} from './MarkJSON';


/**
 * JSON representation of a node, used for serialization and deserialization.
 */
export interface NodeJSON {
    /**
     * The name of the node type.
     */
    type?: string

    /**
     * The node's attributes, if any.
     */
    attrs?: Attrs;

    /**
     * The node's child nodes, if any.
     */
    content?: Array<NodeJSON>;

    /**
     * The marks applied to this node, if any.
     */
    marks?: Array<MarkJSON>;

    /**
     * For text nodes, the text content.
     */
    text?: string;
}
