import {hasOwnProperty} from '@type-editor/commons';

import {Fragment} from '../../elements/Fragment';
import {BLOCK_TAGS} from '../../elements/html-tags';
import type {Mark} from '../../elements/Mark';
import type {Node as PmNode} from '../../elements/Node';
import {TextNode} from '../../elements/TextNode';
import type {NodeType} from '../../schema/NodeType';
import type {ContentMatch} from '../../types/content-parser/ContentMatch';
import type {NodeParseContext} from '../../types/dom-parser/NodeParseContext';
import type {Attrs} from '../../types/schema/Attrs';
import {ContextFlags} from './ContextFlags';


/**
 * Represents a node being built during parsing.
 *
 * @remarks
 * NodeContext maintains the state for a single node in the parsing context stack,
 * including its type, attributes, content, marks, and content matching state.
 */
export class DocumentNodeParseContext implements NodeParseContext {

    /** Regular expression for matching trailing whitespace characters */
    private static readonly REGEX_WHITESPACES_AT_END = /[ \t\r\n\f]+$/;

    /** Array of child nodes that have been added to this context */
    private readonly nodeContent: Array<PmNode> = new Array<PmNode>();

    /** The type of node being built, or null if building a fragment */
    private readonly nodeType: NodeType | null;

    /** The attributes for the node, or null if none */
    private readonly attrs: Attrs | null;

    /** The marks to apply to the node's content */
    private readonly marks: ReadonlyArray<Mark>;

    /** Whether this context is "solid" (shouldn't be exited when finding a place for content) */
    private readonly isSolid: boolean;

    /** The current content match state for validating additional content */
    private matchVar: ContentMatch | null;

    /** Bitfield of parsing options (OPT_PRESERVE_WS, OPT_PRESERVE_WS_FULL, OPT_OPEN_LEFT) */
    private optionsVar: number;


    /**
     * Creates a new node context for managing node construction during parsing.
     *
     * @param type - The type of node being built, or null for fragments
     * @param attrs - The attributes for the node, or null if none
     * @param marks - The marks to apply to the node's content
     * @param solid - Whether this context is "solid" (shouldn't be left when searching for a place to insert content)
     * @param match - The current content match state, or null to use the type's default
     * @param options - Bitfield of parsing options (OPT_PRESERVE_WS, OPT_PRESERVE_WS_FULL, OPT_OPEN_LEFT)
     */
    constructor(type: NodeType | null,
                attrs: Attrs | null,
                marks: ReadonlyArray<Mark>,
                solid: boolean,
                match: ContentMatch | null,
                options: number) {

        // Fix: Add null safety check for type before accessing contentMatch
        this.matchVar = match || (options & ContextFlags.OPT_OPEN_LEFT ? null : type?.contentMatch ?? null);
        this.nodeType = type;
        this.attrs = attrs;
        this.marks = marks;
        this.isSolid = solid;
        this.optionsVar = options;
    }

    /**
     * Gets the current content match state for validating additional content.
     */
    get match(): ContentMatch {
        return this.matchVar;
    }

    /**
     * Sets the content match state.
     *
     * @param match - The new content match state, or null to reset
     */
    set match(match: ContentMatch | null) {
        this.matchVar = match;
    }

    /**
     * Gets the array of child nodes that have been added to this context.
     */
    get content(): Array<PmNode> {
        return this.nodeContent;
    }

    /**
     * Gets the type of node being built, or null if building a fragment.
     */
    get type(): NodeType | null {
        return this.nodeType;
    }

    /**
     * Gets whether this context is solid (shouldn't be exited when finding a place for content).
     */
    get solid(): boolean {
        return this.isSolid;
    }

    /**
     * Gets the parsing options bitfield for this context.
     */
    get options(): number {
        return this.optionsVar;
    }

    /**
     * Sets the parsing options bitfield.
     *
     * @param options - The new options bitfield
     */
    set options(options: number) {
        this.optionsVar = options;
    }

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
    public findWrapping(node: PmNode): ReadonlyArray<NodeType> | null {
        if (!this.match) {
            if (!this.nodeType) {
                return new Array<NodeType>();
            }
            const fill: Fragment = this.nodeType.contentMatch.fillBefore(Fragment.from(node));
            if (fill) {
                this.match = this.nodeType.contentMatch.matchFragment(fill);
            } else {
                const start: ContentMatch = this.nodeType.contentMatch;
                const wrap: ReadonlyArray<NodeType> = start.findWrapping(node.type);
                if (wrap) {
                    this.match = start;
                    return wrap;
                } else {
                    return null;
                }
            }
        }
        return this.match.findWrapping(node.type);
    }

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
    public finish(openEnd: boolean): PmNode | Fragment {
        if (!(this.options & ContextFlags.OPT_PRESERVE_WS)) {
            this.stripTrailingWhitespace();
        }

        let content: Fragment = Fragment.from(this.nodeContent);
        if (!openEnd && this.match) {
            content = content.append(this.match.fillBefore(Fragment.empty, true));
        }
        return this.nodeType ? this.nodeType.create(this.attrs, content, this.marks) : content;
    }

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
    public inlineContext(node: Node): boolean {
        if (this.nodeType) {
            return this.nodeType.inlineContent;
        }
        if (this.nodeContent.length) {
            return this.nodeContent[0].isInline;
        }
        return node.parentNode && !hasOwnProperty(BLOCK_TAGS, node.parentNode.nodeName.toLowerCase());
    }

    /**
     * Removes trailing whitespace from the last text node in the content.
     *
     * @remarks
     * If the last node is entirely whitespace, it is removed.
     * Otherwise, trailing whitespace is trimmed from the text.
     */
    private stripTrailingWhitespace(): void {
        const lastNode: PmNode = this.nodeContent[this.nodeContent.length - 1];
        if (!lastNode?.isText) {
            return;
        }

        const whitespaceMatch: RegExpExecArray = DocumentNodeParseContext.REGEX_WHITESPACES_AT_END.exec(lastNode.text);
        if (!whitespaceMatch) {
            return;
        }

        const textNode = lastNode as TextNode;
        const whitespaceLength: number = whitespaceMatch[0].length;

        if (lastNode.text.length === whitespaceLength) {
            // Remove node entirely if it's all whitespace
            this.nodeContent.pop();
        } else {
            // Trim whitespace from the end
            const trimmedText: string = textNode.text.slice(0, textNode.text.length - whitespaceLength);
            this.nodeContent[this.nodeContent.length - 1] = textNode.withText(trimmedText);
        }
    }
}
