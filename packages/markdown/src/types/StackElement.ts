import type {Attrs, Mark, Node, NodeType} from '@type-editor/model';


/**
 * Represents a stack element used during markdown parsing to track nested node construction.
 */
export interface StackElement {
    /** The type of the ProseMirror node being constructed. */
    type: NodeType;
    /** The attributes for the node, if any. */
    attrs: Attrs | null;
    /** The child nodes that will be contained in this node. */
    content: Array<Node>;
    /** The active marks that apply to content within this node. */
    marks: ReadonlyArray<Mark>;
}
