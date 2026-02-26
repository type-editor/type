import type {Fragment} from '../../elements/Fragment';
import type {Node as PmNode} from '../../elements/Node';
import type {NodeType} from '../../schema/NodeType';
import type {ContentMatch} from '../content-parser/ContentMatch';

/**
 * Represents a node being built during parsing.
 *
 * @remarks
 * NodeContext maintains the state for a single node in the parsing context stack,
 * including its type, attributes, content, marks, and content matching state.
 */
export interface NodeParseContext {
    
    match: ContentMatch;
    readonly content: Array<PmNode>;
    readonly type: NodeType;
    readonly solid: boolean;
    options: number;

    /**
     * Finds a sequence of wrapper node types needed to make the given node fit in this context.
     *
     * @param node - The node to find wrapping for
     * @returns An array of node types to wrap with, an empty array if no wrapping needed, or null if impossible
     *
     * @remarks
     * This method attempts to:
     * 1. Fill any required content before the node
     * 2. Find wrapper nodes that make the node valid according to content match rules
     * 3. Update the match state if successful
     */
    findWrapping(node: PmNode): ReadonlyArray<NodeType> | null;

    /**
     * Finishes building this node context and returns the resulting node or fragment.
     *
     * @param openEnd - Whether to leave the node open (not filling required trailing content)
     * @returns The completed node (if this context has a type) or fragment (if null type)
     *
     * @remarks
     * This method:
     * 1. Strips trailing whitespace if whitespace preservation is not enabled
     * 2. Fills any required trailing content if not leaving the node open
     * 3. Creates the final node with the accumulated content and marks
     */
    finish(openEnd: boolean): PmNode | Fragment;

    /**
     * Determines whether this context represents inline content.
     *
     * @param node - The DOM node being considered
     * @returns True if the context is inline, false if it's block-level
     *
     * @remarks
     * The determination is made by checking:
     * 1. If the node type is defined, use its inlineContent property
     * 2. If content exists, check if the first content node is inline
     * 3. Otherwise, check if the DOM parent is not a block-level element
     */
    inlineContext(node: Node): boolean;
}
