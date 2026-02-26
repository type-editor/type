import {type Attrs, Mark, type MarkType, type Node, type NodeType, type Schema, type TextNode} from '@type-editor/model';
import type Token from 'markdown-it/lib/token.mjs';

import type {StackElement} from '../types/StackElement';
import type {TokenHandler} from '../types/TokenHandler';


/**
 * Manages the state during markdown parsing, maintaining a stack of nodes being constructed
 * and tracking active marks. This class handles the incremental building of a ProseMirror
 * document tree from markdown-it tokens.
 */
export class MarkdownParseState {

    private readonly _stack: Array<StackElement>;
    private readonly schema: Schema;
    private readonly tokenHandlers: Record<string, TokenHandler>;

    /**
     * Creates a new markdown parse state.
     *
     * @param schema - The ProseMirror schema to use for creating nodes and marks.
     * @param tokenHandlers - A map of token types to handler functions that process those tokens.
     */
    constructor(schema: Schema,
                tokenHandlers: Record<string, TokenHandler>) {
        this.schema = schema;
        this.tokenHandlers = tokenHandlers;
        // Initialize the stack with the root document node (topNodeType)
        // This serves as the foundation for building the document tree
        this._stack = [{type: schema.topNodeType, attrs: null, content: [], marks: Mark.none}];
    }

    /**
     * Gets the current parsing stack.
     *
     * @returns The array of stack elements representing the current parsing context.
     */
    get stack(): Array<StackElement> {
        return this._stack;
    }

    /**
     * Adds the given text to the current position in the document,
     * using the current marks as styling. Attempts to merge with the
     * previous text node if they share the same marks.
     *
     * @param text - The text content to add. If empty or falsy, no action is taken.
     */
    public addText(text: string): void {
        if (!text) {
            return;
        }

        const top: StackElement = this.top();
        const nodes: Array<Node> = top.content;
        const lastNode: Node = nodes[nodes.length - 1];
        // Create a new text node with the current active marks
        const newNode: Node = this.schema.text(text, top.marks);

        if (lastNode) {
            // Try to merge with the previous node to avoid excessive text node fragmentation
            const merged: Node = this.maybeMerge(lastNode, newNode);
            if (merged) {
                // Replace the last node with the merged version
                nodes[nodes.length - 1] = merged;
                return;
            }
        }

        // No merge possible, add as a new node
        nodes.push(newNode);
    }

    /**
     * Adds the given mark to the set of active marks.
     * Active marks are applied to all text nodes added until the mark is closed.
     *
     * @param mark - The mark instance to add to the active set.
     */
    public openMark(mark: Mark): void {
        const top: StackElement = this.top();
        top.marks = mark.addToSet(top.marks);
    }

    /**
     * Removes the given mark from the set of active marks.
     *
     * @param mark - The mark type to remove from the active set.
     */
    public closeMark(mark: MarkType): void {
        const top: StackElement = this.top();
        top.marks = mark.removeFromSet(top.marks);
    }

    /**
     * Parses an array of markdown-it tokens and processes them using registered handlers.
     *
     * @param tokens - The array of tokens to parse.
     * @throws {Error} If a token type has no registered handler.
     */
    public parseTokens(tokens: Array<Token>): void {
        for (let i = 0; i < tokens.length; i++) {
            const token: Token = tokens[i];
            // Look up the handler for this token type
            const handler: (state: MarkdownParseState, token: Token, tokens: Array<Token>, i: number) => void = this.tokenHandlers[token.type];
            if (!handler) {
                // Fail fast if we encounter an unsupported token
                throw new Error(`Token type '${token.type}' not supported by Markdown parser`);
            }

            // Delegate token processing to the appropriate handler
            handler(this, token, tokens, i);
        }
    }

    /**
     * Adds a node at the current position in the document tree.
     *
     * @param type - The type of node to create.
     * @param attrs - The attributes for the node.
     * @param content - Optional child nodes for the node.
     * @returns The created node, or null if creation failed.
     */
    public addNode(type: NodeType, attrs: Attrs | null, content?: ReadonlyArray<Node>): Node | null {
        // Inherit marks from the current context (or use none if at document root)
        const marks: ReadonlyArray<Mark> = this._stack.length > 0 ? this.top().marks : Mark.none;
        // Create the node and automatically fill in any required content
        const node: Node = type.createAndFill(attrs, content, marks);
        if (!node) {
            return null;
        }

        // Add the node to the current parent's content
        this.push(node);
        return node;
    }

    /**
     * Opens a new node context on the stack. Subsequent content will be added
     * as children to this node until closeNode is called.
     *
     * @param type - The type of node to open.
     * @param attrs - The attributes for the node.
     */
    public openNode(type: NodeType, attrs: Attrs | null): void {
        this._stack.push({
            type,
            attrs,
            content: [],
            marks: Mark.none
        });
    }

    /**
     * Closes the node currently on top of the stack and adds it to its parent.
     *
     * @returns The closed node.
     */
    public closeNode(): Node | null {
        // Pop the completed node context from the stack
        const info: StackElement = this._stack.pop();
        if (!info) {
            return null;
        }
        // Create the node with its accumulated content and add it to its parent
        return this.addNode(info.type, info.attrs, info.content);
    }

    /**
     * Gets the stack element currently on top of the stack.
     *
     * @returns The topmost stack element.
     */
    private top(): StackElement {
        return this._stack[this._stack.length - 1];
    }

    /**
     * Pushes a node onto the content array of the current stack top.
     *
     * @param node - The node to push.
     */
    private push(node: Node): void {
        if (this._stack.length) {
            this.top().content.push(node);
        }
    }

    /**
     * Attempts to merge two text nodes if they are adjacent and have the same marks.
     * This optimization reduces the number of text nodes in the document tree.
     *
     * @param a - The first node to merge.
     * @param b - The second node to merge.
     * @returns A merged node if both nodes are text nodes with the same marks, undefined otherwise.
     */
    private maybeMerge(a: Node, b: Node): Node | undefined {
        // Check if both nodes are text nodes with identical mark sets
        if (a.isText && b.isText && Mark.sameSet(a.marks, b.marks)) {
            // Combine the text content into a single node to optimize the document structure
            return (a as TextNode).withText(a.text + b.text);
        }
        return undefined;
    }
}
