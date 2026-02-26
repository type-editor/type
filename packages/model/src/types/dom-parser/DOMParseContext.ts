import type {Fragment} from '../../elements/Fragment';
import type {Mark} from '../../elements/Mark';
import type {Node as PmNode} from '../../elements/Node';
import type {NodeParseContext} from './NodeParseContext';


/**
 * Interface for parsing context that manages the state during DOM to ProseMirror conversion.
 *
 * @remarks
 * The parse context maintains a stack of node contexts and handles the conversion
 * of DOM nodes into ProseMirror nodes while respecting schema constraints and parse rules.
 */
export interface DOMParseContext {

    /**
     * The currently active node context at the top of the context stack.
     *
     * @remarks
     * This represents the node being currently built during parsing.
     */
    readonly top: NodeParseContext;

    /**
     * The current position in the document being constructed.
     *
     * @remarks
     * This position is calculated based on the content added so far
     * and is used for tracking DOM position mappings.
     */
    readonly currentPos: number;

    /**
     * Parses and adds all child nodes from a DOM element to the current context.
     *
     * @param parent - The DOM node whose children should be parsed
     * @param marks - The marks to apply to the parsed content
     * @param startIndex - Optional starting index of child nodes to parse (inclusive)
     * @param endIndex - Optional ending index of child nodes to parse (exclusive)
     *
     * @remarks
     * If startIndex and endIndex are not provided, all children are parsed.
     * The method handles position tracking and synchronization after block elements.
     */
    addAll(parent: Node,
           marks: ReadonlyArray<Mark>,
           startIndex?: number,
           endIndex?: number): void;

    /**
     * Completes the parsing process and returns the final result.
     *
     * @returns The parsed content as either a complete Node or a Fragment
     *
     * @remarks
     * This method closes all open node contexts and performs final validation
     * and content filling according to schema requirements.
     */
    finish(): PmNode | Fragment;

    /**
     * Checks whether a context string matches the current parsing context.
     *
     * @param context - A context string to match against, supporting pipe-separated alternatives
     * @returns True if the context matches, false otherwise
     *
     * @remarks
     * Context strings use slash-separated node type names to specify ancestor chains.
     * Empty string segments act as wildcards. Pipe characters separate alternative contexts.
     * Example: "doc/blockquote/" matches a blockquote with any descendant in a doc.
     */
    matchesContext(context: string): boolean;
}
