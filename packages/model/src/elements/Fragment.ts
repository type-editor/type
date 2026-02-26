import {isNotFalse, isUndefinedOrNull,} from '@type-editor/commons';

import type {Schema} from '../schema/Schema';
import type {DiffPosition} from '../types/diff/DiffPosition';
import type {FragmentPosition} from '../types/elements/FragmentPosition';
import type {NodeJSON} from '../types/elements/NodeJSON';
import type {PmElement} from '../types/elements/PmElement';
import {ElementType} from './ElementType';
import type {Node as PmNode} from './Node';
import type {TextNode} from './TextNode';

/**
 * A fragment represents a node's collection of child nodes.
 *
 * Like nodes, fragments are persistent data structures, and you
 * should not mutate them or their content. Rather, you create new
 * instances whenever needed. The API tries to make this easy.
 *
 * Fragments are used to store the content of block nodes and the entire
 * document. They provide efficient operations for accessing, comparing,
 * and manipulating sequences of nodes while maintaining immutability.
 *
 * Key characteristics:
 * - Immutable: All modification methods return new Fragment instances
 * - Efficient: Adjacent text nodes with the same marks are automatically merged
 * - Persistent: Safe to share between different parts of the application
 * - Size-aware: Tracks total size for efficient position calculations
 *
 * @example
 * ```typescript
 * // Create a fragment from an array of nodes
 * const fragment = Fragment.fromArray([node1, node2, node3]);
 *
 * // Extract a sub-fragment
 * const subFragment = fragment.cut(5, 15);
 *
 * // Iterate over children
 * fragment.forEach((node, offset, index) => {
 *   console.log(`Node ${index} at offset ${offset}`);
 * });
 * ```
 */
export class Fragment implements PmElement {

    /**
     * An empty fragment. Intended to be reused whenever a node doesn't
     * contain anything (rather than allocating a new empty fragment for
     * each leaf node).
     *
     * This singleton instance helps reduce memory allocation and improves
     * performance by avoiding the creation of multiple empty fragment instances.
     * Always use this constant instead of creating new empty fragments.
     *
     * @example
     * ```typescript
     * // Good: Use the singleton
     * const empty = Fragment.EMPTY;
     *
     * // Avoid: Creating new empty fragments
     * const empty2 = new Fragment([], 0); // Unnecessary allocation
     * ```
     */
    private static EMPTY_FRAGMENT: Fragment;

    /**
     * The internal storage for child nodes in this fragment.
     * Immutable to ensure the fragment remains a persistent data structure.
     * @private
     */
    private readonly fragmentContent: ReadonlyArray<PmNode>;

    /**
     * The cached total size of this fragment (sum of all child node sizes).
     * @private
     */
    private readonly fragmentSize: number;

    /**
     * Creates a new Fragment instance.
     *
     * @param content - The child nodes in this fragment. Must be a readonly array of PmNode instances.
     * @param size - Optional. The total size of the fragment (sum of all child node sizes).
     *               If not provided, it will be calculated automatically by summing all child node sizes.
     *               Providing this value improves performance by avoiding recalculation.
     */
    constructor(content: ReadonlyArray<PmNode>, size?: number) {
        this.fragmentContent = content;
        this.fragmentSize = this.calculateSize(content, size);
    }

    public static get empty(): Fragment {
        if (!Fragment.EMPTY_FRAGMENT) {
            Fragment.EMPTY_FRAGMENT = new Fragment([], 0);
        }
        return Fragment.EMPTY_FRAGMENT;
    }

    get elementType(): ElementType {
        return ElementType.Fragment;
    }

    /**
     * Returns the readonly array of child nodes in this fragment.
     *
     * @returns A readonly array containing all child nodes
     */
    get content(): ReadonlyArray<PmNode> {
        return this.fragmentContent;
    }

    /**
     * Returns the total size of this fragment.
     * The size is the sum of the sizes of all child nodes.
     *
     * @returns The total size of the fragment
     */
    get size(): number {
        return this.fragmentSize;
    }

    /**
     * The first child of the fragment, or `null` if it is empty.
     *
     * This is a convenience property for accessing the first child without
     * needing to check the fragment's length or use array indexing.
     *
     * @returns The first child node, or null if the fragment has no children.
     *
     * @example
     * ```typescript
     * const first = fragment.firstChild;
     * if (first && first.type.name === 'paragraph') {
     *   console.log('First child is a paragraph');
     * }
     * ```
     */
    get firstChild(): PmNode | null {
        return this.content.length ? this.content[0] : null;
    }

    /**
     * The last child of the fragment, or `null` if it is empty.
     *
     * This is a convenience property for accessing the last child without
     * needing to check the fragment's length or calculate the last index.
     *
     * @returns The last child node, or null if the fragment has no children.
     *
     * @example
     * ```typescript
     * const last = fragment.lastChild;
     * if (last && last.isText) {
     *   console.log('Last child is text:', last.text);
     * }
     * ```
     */
    get lastChild(): PmNode | null {
        return this.content.length ? this.content[this.content.length - 1] : null;
    }

    /**
     * The number of child nodes in this fragment.
     *
     * This returns the count of direct children, not the total number of
     * descendant nodes. For example, a fragment with 3 paragraph nodes
     * (each containing text nodes) would have a childCount of 3.
     *
     * @returns The number of immediate child nodes in this fragment.
     *
     * @example
     * ```typescript
     * console.log(`Fragment has ${fragment.childCount} children`);
     * for (let i = 0; i < fragment.childCount; i++) {
     *   const child = fragment.child(i);
     * }
     * ```
     */
    get childCount(): number {
        return this.content.length;
    }

    /**
     * Deserializes a fragment from its JSON representation.
     *
     * This static method reconstructs a Fragment from JSON data, typically
     * obtained from a previous call to `toJSON()`. Each node in the JSON
     * array is deserialized using the provided schema.
     *
     * @param schema The schema to use for deserializing nodes. Must match the schema
     *               used when the fragment was serialized.
     * @param value Optional array of node JSON objects to deserialize. If not provided,
     *              null, or empty, returns Fragment.EMPTY.
     * @returns A Fragment instance created from the JSON data.
     * @throws {RangeError} If value is provided but is not an array.
     *
     * @example
     * ```typescript
     * const json = fragment.toJSON();
     * // Later, restore from JSON
     * const restored = Fragment.fromJSON(schema, json);
     * ```
     */
    public static fromJSON(schema: Schema, value?: Array<NodeJSON>): Fragment {
        if (!value) {
            return Fragment.EMPTY_FRAGMENT;
        }
        if (!Array.isArray(value)) {
            throw new RangeError(`Invalid input for Fragment.fromJSON: expected array, got ${typeof value}`);
        }
        return new Fragment(value.map(schema.nodeFromJSON));
    }

    /**
     * Creates a fragment from various input types that can be interpreted as a set of nodes.
     *
     * This is a convenience method that handles multiple input types:
     * - `null` or `undefined`: Returns Fragment.EMPTY
     * - `Fragment`: Returns the fragment itself (identity operation, no copy made)
     * - `Node`: Returns a fragment containing that single node
     * - `Array<Node>`: Returns a fragment containing those nodes (with text nodes merged)
     *
     * This method is particularly useful when you need to accept flexible input types
     * in your API, as it normalizes them all to Fragment instances.
     *
     * @param nodes The input to convert to a fragment. Can be null, undefined, a Fragment,
     *              a single Node, or an array of Nodes.
     * @returns A Fragment instance representing the input.
     * @throws {RangeError} If the input cannot be converted to a Fragment. Also provides
     *         a helpful hint if multiple versions of prosemirror-model are detected.
     *
     * @example
     * ```typescript
     * // All these are valid:
     * const frag1 = Fragment.from(null);           // Fragment.EMPTY
     * const frag2 = Fragment.from(existingFrag);   // Same fragment
     * const frag3 = Fragment.from(singleNode);     // Fragment with one node
     * const frag4 = Fragment.from([node1, node2]); // Fragment with multiple nodes
     * ```
     */
    public static from(nodes?: Fragment | PmNode | ReadonlyArray<PmNode> | null): Fragment {
        if (isUndefinedOrNull(nodes)) {
            return Fragment.empty;
        }

        if (Array.isArray(nodes)) {
            return Fragment.fromArray(nodes);
        }

        if (Fragment.isFragment(nodes as Fragment | PmNode)) {
            return nodes as Fragment;
        }

        if (Fragment.isNode(nodes)) {
            return new Fragment([nodes], nodes.nodeSize);
        }

        throw new RangeError(
            `Cannot convert ${nodes.toString()} to a Fragment` +
            (Fragment.isNode(nodes) && (nodes as PmNode).nodesBetween
                ? ' (looks like multiple versions of prosemirror-model were loaded)'
                : '')
        );
    }

    /**
     * Type guard to check if a value is a Fragment.
     *
     * @param value The value to check for Fragment type.
     * @private True if the value is a Fragment instance (elementType is 'Fragment').
     */
    public static isFragment(value: Fragment | PmNode): value is Fragment {
        return !isUndefinedOrNull(value)
            && typeof value === 'object'
            && 'elementType' in value
            && value.elementType === ElementType.Fragment;
    }

    /**
     * Builds a fragment from an array of nodes. Automatically merges adjacent
     * text nodes that have the same markup (marks) into single text nodes.
     *
     * This method is more efficient than creating a fragment and then calling
     * append() multiple times, as it performs text node merging in a single pass.
     * Empty arrays return Fragment.EMPTY for efficiency.
     *
     * @param array The array of nodes to create a fragment from. Can be empty,
     *              in which case Fragment.EMPTY is returned.
     * @returns A new Fragment instance with adjacent text nodes merged where possible.
     *
     * @example
     * ```typescript
     * // Text nodes with same marks will be merged
     * const text1 = schema.text("Hello", [boldMark]);
     * const text2 = schema.text(" world", [boldMark]);
     * const fragment = Fragment.fromArray([text1, text2]);
     * // Results in single text node: "Hello world" with bold mark
     *
     * // Different marks - no merging
     * const text3 = schema.text("!", [italicMark]);
     * const fragment2 = Fragment.fromArray([text1, text2, text3]);
     * // Results in two nodes: "Hello world" (bold) and "!" (italic)
     * ```
     */
    public static fromArray(array: ReadonlyArray<PmNode>): Fragment {
        if (!array.length) {
            return Fragment.empty;
        }

        let joined: Array<PmNode> | undefined;
        let size = 0;

        for (let i = 0; i < array.length; i++) {
            const node: PmNode = array[i];
            size += node.nodeSize;

            const previousNode: PmNode = i > 0 ? array[i - 1] : null;
            const shouldMergeWithPrevious: boolean = previousNode && node.isText && previousNode.sameMarkup(node);

            if (shouldMergeWithPrevious) {
                // Initialize joined array on first merge
                if (!joined) {
                    joined = array.slice(0, i);
                }
                // Merge current text node with previous
                const textNode = node as TextNode;
                const joinedTextNode = joined[joined.length - 1] as TextNode;
                joined[joined.length - 1] = textNode.withText(joinedTextNode.text + textNode.text);
            } else if (joined) {
                joined.push(node);
            }
        }
        return new Fragment(joined || array, size);
    }

    /**
     * Type guard to check if a value is a Node.
     *
     * @param value The value to check for Node type.
     * @returns True if the value is a Node instance (elementType is 'Node' or 'TextNode').
     * @private
     */
    private static isNode(value: unknown): value is PmNode {
        return !isUndefinedOrNull(value)
            && typeof value === 'object'
            && 'elementType' in value
            && (value.elementType === ElementType.Node || value.elementType === ElementType.TextNode);
    }

    /**
     * Invokes a callback for all descendant nodes between the given two positions
     * (relative to start of this fragment). Traversal stops descending into a node
     * when the callback returns `false`.
     *
     * This method performs a depth-first traversal of the fragment's node tree,
     * visiting each node that intersects with the specified range. The callback
     * can control whether to descend into each node's children.
     *
     * @param from The starting position (inclusive) for the range to traverse. Position 0
     *             is before the first character of the fragment.
     * @param to The ending position (exclusive) for the range to traverse. Must be greater
     *           than or equal to `from`.
     * @param callbackFunc Function called for each node in the range. Receives:
     *                     - node: The current node being visited
     *                     - start: The absolute position where this node starts
     *                     - parent: The parent node (or null if at fragment level)
     *                     - index: The index of the node within its parent's children
     *                     Return `false` to prevent descending into this node's children,
     *                     or any other value to continue normal traversal.
     * @param nodeStart Optional offset to add to all position calculations. Used internally
     *                  for recursive calls. Default is 0.
     * @param parent Optional parent node context for the traversal. Used internally to track
     *               the parent hierarchy during recursive descent.
     *
     * @example
     * ```typescript
     * // Find all text nodes in a range
     * fragment.nodesBetween(5, 20, (node, pos) => {
     *   if (node.isText) {
     *     console.log(`Text at ${pos}: "${node.text}"`);
     *   }
     * });
     *
     * // Stop at block boundaries
     * fragment.nodesBetween(0, fragment.size, (node, pos) => {
     *   if (node.isBlock) {
     *     console.log(`Block at ${pos}`);
     *     return false; // Don't descend into block content
     *   }
     * });
     * ```
     */
    public nodesBetween(from: number,
                        to: number,
                        callbackFunc: (node: PmNode,
                                       start: number,
                                       parent: PmNode | null,
                                       // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
                                       index: number) => boolean | void,
                        nodeStart = 0,
                        parent?: PmNode): void {
        for (let i = 0, pos = 0; pos < to && i < this.content.length; i++) {
            const child: PmNode = this.content[i];
            const end: number = pos + child.nodeSize;

            if (end > from && isNotFalse(callbackFunc(child, nodeStart + pos, parent || null, i)) && child.content.size) {
                const start = pos + 1;
                child.nodesBetween(
                    Math.max(0, from - start),
                    Math.min(child.content.size, to - start),
                    callbackFunc,
                    nodeStart + start
                );
            }
            pos = end;
        }
    }

    /**
     * Extracts the text content between the given positions.
     *
     * This method traverses the fragment and collects text from text nodes and
     * leaf nodes, optionally inserting separators between block nodes. Useful for
     * getting a plain text representation of document content.
     *
     * @param from The starting position (inclusive) to extract text from. Position 0
     *             is before the first character.
     * @param to The ending position (exclusive) to extract text to. Should be between
     *           `from` and the fragment's size.
     * @param blockSeparator Optional string to insert between block nodes (e.g., '\n' for newlines,
     *                       '\n\n' for paragraph breaks). If null or undefined, no separator is added
     *                       and block content runs together.
     * @param leafText Optional text or function to use for leaf nodes:
     *                 - If a string: That string is used for all leaf nodes (e.g., "[image]")
     *                 - If a function: Called with each leaf node to compute its text representation
     *                 - If null/undefined: Falls back to node.type.spec.leafText, or empty string
     * @returns The extracted text content as a string with block separators inserted where specified.
     *
     * @example
     * ```typescript
     * // Get plain text with newlines between paragraphs
     * const text = fragment.textBetween(0, fragment.size, '\n');
     *
     * // Custom leaf node handling
     * const text2 = fragment.textBetween(0, fragment.size, '\n', (node) => {
     *   if (node.type.name === 'image') return '[IMAGE]';
     *   if (node.type.name === 'hard_break') return '\n';
     *   return '';
     * });
     * ```
     */
    public textBetween(from: number,
                       to: number,
                       blockSeparator?: string | null,
                       leafText?: string | null | ((leafNode: PmNode) => string)): string {
        let text = '';
        let isFirstBlock = true;

        this.nodesBetween(from, to, (node: PmNode, pos: number): undefined => {
            const nodeText: string = this.getNodeText(node, from, to, pos, leafText);

            if (this.shouldAddBlockSeparator(node, nodeText, blockSeparator)) {
                if (isFirstBlock) {
                    isFirstBlock = false;
                } else {
                    text += blockSeparator;
                }
            }

            text += nodeText;
        }, 0);

        return text;
    }

    /**
     * Creates a new fragment containing the combined content of this fragment and another.
     * If the last node of this fragment and the first node of the other fragment are
     * text nodes with the same markup, they will be merged into a single text node.
     *
     * This method efficiently handles edge cases like empty fragments and performs
     * text node merging when appropriate to maintain the fragment's normalized state.
     *
     * @param other The fragment to append to this one. Can be an empty fragment.
     * @returns A new Fragment containing the combined content. If either fragment is
     *          empty, returns the other fragment unchanged for efficiency.
     *
     * @example
     * ```typescript
     * const frag1 = Fragment.from([textNode("Hello")]);
     * const frag2 = Fragment.from([textNode(" world")]);
     * const combined = frag1.append(frag2);
     * // If text nodes have same marks, results in single text node: "Hello world"
     * ```
     */
    public append(other: Fragment): Fragment {
        if (!other.size) {
            return this;
        }
        if (!this.size) {
            return other;
        }

        const lastChild: PmNode = this.lastChild;
        const firstChild: PmNode = other.firstChild;
        const canMergeTextNodes: boolean = lastChild && firstChild && lastChild.isText && lastChild.sameMarkup(firstChild);

        if (canMergeTextNodes) {
            return this.appendWithTextMerge(other);
        }

        // No merging needed, concatenate directly
        return new Fragment([...this.content, ...other.content], this.size + other.size);
    }

    /**
     * Extracts a sub-fragment between the given positions, creating a new fragment
     * containing only the content within the specified range. Nodes that are partially
     * within the range will be cut to include only the relevant portion.
     *
     * This method intelligently handles partial node overlaps by recursively cutting
     * child nodes when necessary. Returns this fragment unchanged if the range matches
     * the entire fragment (optimization).
     *
     * @param from The starting position (inclusive) of the sub-fragment. Position 0 is
     *             before the first character.
     * @param to The ending position (exclusive) of the sub-fragment. Default is the
     *           fragment's size. If `to` equals `from`, returns an empty fragment.
     * @returns A new Fragment containing the content between from and to. Returns this
     *          fragment unchanged if from is 0 and to is the fragment size.
     *
     * @example
     * ```typescript
     * // Extract characters 5-15 from a fragment
     * const subFrag = fragment.cut(5, 15);
     *
     * // Extract from position 10 to end
     * const tailFrag = fragment.cut(10);
     * ```
     */
    public cut(from: number, to: number = this.size): Fragment {
        if (from === 0 && to === this.size) {
            return this;
        }

        const result: Array<PmNode> = [];
        let size = 0;

        if (to > from) {
            for (let i = 0, pos = 0; pos < to && i < this.content.length; i++) {
                let child: PmNode = this.content[i];
                const end: number = pos + child.nodeSize;

                if (end > from) {
                    const needsCutting: boolean = pos < from || end > to;

                    if (needsCutting) {
                        child = this.cutChild(child, from, to, pos);
                    }

                    result.push(child);
                    size += child.nodeSize;
                }
                pos = end;
            }
        }
        return new Fragment(result, size);
    }

    /**
     * Creates a sub-fragment by extracting child nodes between the given indices.
     * Unlike `cut()`, this operates on child node indices rather than positions.
     *
     * This is useful when you know the exact child indices you want to extract
     * rather than working with absolute positions. More efficient than `cut()` when
     * you already have index information.
     *
     * @param from The starting child index (inclusive). Use 0 for the first child.
     * @param to The ending child index (exclusive). If equal to `from`, returns Fragment.EMPTY.
     * @returns A new Fragment containing children from index `from` to `to`. Returns this
     *          fragment unchanged if extracting all children.
     *
     * @example
     * ```typescript
     * // Extract children 2, 3, and 4 (indices 2-5)
     * const subFrag = fragment.cutByIndex(2, 5);
     *
     * // Extract all but first and last children
     * const middle = fragment.cutByIndex(1, fragment.childCount - 1);
     * ```
     */
    public cutByIndex(from: number, to: number): Fragment {
        if (from === to) {
            return Fragment.EMPTY_FRAGMENT;
        }
        if (from === 0 && to === this.content.length) {
            return this;
        }

        const slice: Array<PmNode> = this.content.slice(from, to);
        let size = 0;
        for (const node of slice) {
            size += node.nodeSize;
        }
        return new Fragment(slice, size);
    }

    /**
     * Creates a new fragment with the child node at the given index replaced by a new node.
     * If the current node is identical to the new node, returns this fragment unchanged.
     *
     * This method maintains immutability by creating a new fragment with the updated content
     * rather than modifying the existing fragment.
     *
     * @param index The index of the child node to replace. Must be within [0, childCount).
     * @param node The new node to insert at the given index. Can be any valid Node instance.
     * @returns A new Fragment with the replaced child node. Returns this fragment unchanged
     *          if the node at the index is identical (by reference) to the new node.
     * @throws {RangeError} If the index is out of bounds (negative or >= childCount).
     *
     * @example
     * ```typescript
     * // Replace the second child (index 1)
     * const newFrag = fragment.replaceChild(1, newNode);
     *
     * // Original fragment is unchanged
     * console.log(fragment.child(1) !== newNode); // true
     * console.log(newFrag.child(1) === newNode);  // true
     * ```
     */
    public replaceChild(index: number, node: PmNode): Fragment {
        const current: PmNode = this.content[index];
        if (!current) {
            throw new RangeError(`Index ${index} out of range for ${this.toString()}`);
        }
        if (current === node) {
            return this;
        }

        const copy: Array<PmNode> = this.content.slice();
        const size: number = this.size + node.nodeSize - current.nodeSize;
        copy[index] = node;
        return new Fragment(copy, size);
    }

    /**
     * Compares this fragment to another fragment for equality.
     * Two fragments are equal if they have the same number of children
     * and all corresponding child nodes are equal.
     *
     * This performs a deep equality check by comparing each child node
     * using the node's own `eq()` method.
     *
     * @param other The fragment to compare with. Must be a Fragment instance.
     * @returns True if the fragments are equal (same number of children and all
     *          corresponding children are equal), false otherwise.
     *
     * @example
     * ```typescript
     * if (fragment1.eq(fragment2)) {
     *   console.log('Fragments are equal');
     * }
     * ```
     */
    public eq(other: Fragment): boolean {
        if (this.content.length !== other.content.length) {
            return false;
        }

        for (let i = 0; i < this.content.length; i++) {
            if (!this.content[i].eq(other.content[i])) {
                return false;
            }
        }
        return true;
    }

    /**
     * Retrieves the child node at the given index.
     *
     * This method provides array-like access to child nodes with bounds checking.
     * For unchecked access, use `maybeChild()` instead.
     *
     * @param index The zero-based index of the child node to retrieve. Must be within
     *              [0, childCount).
     * @returns The child node at the specified index.
     * @throws {RangeError} If the index is out of range (negative or >= childCount).
     *
     * @example
     * ```typescript
     * const firstChild = fragment.child(0);
     * const lastChild = fragment.child(fragment.childCount - 1);
     * ```
     */
    public child(index: number): PmNode {
        const found: PmNode = this.content[index];
        if (!found) {
            throw new RangeError(`Index ${index} out of range for ${this.toString()}`);
        }
        return found;
    }

    /**
     * Retrieves the child node at the given index, returning null if it doesn't exist.
     * This is a safe alternative to `child()` that doesn't throw errors.
     *
     * Use this method when you're not sure if the index is valid, or when you want
     * to avoid try-catch blocks for out-of-bounds access.
     *
     * @param index The zero-based index of the child node to retrieve. Can be any number.
     * @returns The child node at the specified index, or null if the index is out of
     *          range or the fragment is empty.
     *
     * @example
     * ```typescript
     * const child = fragment.maybeChild(10);
     * if (child) {
     *   console.log('Child exists:', child);
     * } else {
     *   console.log('No child at index 10');
     * }
     * ```
     */
    public maybeChild(index: number): PmNode | null {
        return this.content[index] || null;
    }

    /**
     * Iterates over every child node in the fragment, invoking a callback for each.
     *
     * This method provides an easy way to process all direct children without
     * manually managing indices or positions. The callback receives both the node
     * and its position information.
     *
     * @param callbackFunc Function to call for each child node. Receives:
     *                     - node: The current child node being visited
     *                     - offset: The position offset where this node starts within the fragment
     *                     - index: The zero-based index of this node in the children array
     *
     * @example
     * ```typescript
     * fragment.forEach((node, offset, index) => {
     *   console.log(`Child ${index} at offset ${offset}:`, node.type.name);
     * });
     * ```
     */
    public forEach(callbackFunc: (node: PmNode, offset: number, index: number) => void): void {
        for (let i = 0, offset = 0; i < this.content.length; i++) {
            const child: PmNode = this.content[i];
            callbackFunc(child, offset, i);
            offset += child.nodeSize;
        }
    }

    /**
     * Finds the first position at which this fragment and another fragment differ.
     * Searches from the beginning of both fragments.
     *
     * This method performs a recursive comparison, descending into node content
     * when nodes have the same markup. It's useful for efficiently finding where
     * two document structures diverge.
     *
     * @param other The fragment to compare with. Must be a Fragment instance.
     * @param pos Optional starting position offset for the comparison. Default is 0
     *            (start of fragment). Used to adjust returned positions.
     * @returns The position where the fragments first differ, or null if they are
     *          identical up to the end of the shorter fragment.
     *
     * @example
     * ```typescript
     * const pos = fragment1.findDiffStart(fragment2);
     * if (pos !== null) {
     *   console.log(`Fragments differ at position ${pos}`);
     * }
     * ```
     */
    public findDiffStart(other: Fragment, pos = 0): number | null {
        return this.findDiffStartPosition(this, other, pos);
    }

    /**
     * Finds the first position, searching from the end, at which this fragment and
     * another fragment differ. Since the position may not be the same in both fragments,
     * returns an object with separate positions for each fragment.
     *
     * This method is useful for finding the common suffix between two fragments,
     * which is important for efficient diff algorithms and change tracking.
     *
     * @param other The fragment to compare with. Must be a Fragment instance.
     * @param pos Optional ending position in this fragment. Default is -1, which means
     *            the fragment's size. Positions are measured from the start of the fragment.
     * @param otherPos Optional ending position in the other fragment. Default is -1,
     *                 which means that fragment's size.
     * @returns An object with `selfPos` and `otherPos` properties indicating where the
     *          fragments differ when searching backwards, or null if they are identical
     *          from the end up to the start of the shorter fragment.
     *
     * @example
     * ```typescript
     * const diff = fragment1.findDiffEnd(fragment2);
     * if (diff) {
     *   console.log(`Diff in fragment1 at ${diff.selfPos}, in fragment2 at ${diff.otherPos}`);
     * }
     * ```
     */
    public findDiffEnd(other: Fragment, pos = -1, otherPos = -1): DiffPosition | null {
        const posIndex: number = pos === -1 ? this.size : pos;
        const otherPosIndex: number = otherPos === -1 ? other.size : otherPos;
        return this.findDiffEndPosition(this, other, posIndex, otherPosIndex);
    }

    /**
     * Finds the child index and offset corresponding to a given absolute position
     * in this fragment.
     *
     * This method converts an absolute position (measured from the start of the
     * fragment) into a child index and the offset where that child starts. This
     * is useful for operations that need to work with child indices rather than
     * absolute positions.
     *
     * @param pos The absolute position within the fragment. Position 0 is before
     *            the first character, and position `size` is after the last character.
     * @returns An object containing:
     *          - `index`: The index of the child node containing or following the position
     *          - `offset`: The absolute position where that child node starts
     * @throws {RangeError} If the position is outside the fragment bounds (< 0 or > size).
     *
     * @example
     * ```typescript
     * // For a fragment with children of sizes [5, 3, 7]
     * const result = fragment.findIndex(8);
     * // Returns: { index: 2, offset: 8 }
     * // Position 8 is in the third child (index 2), which starts at offset 8
     * ```
     *
     * @internal
     */
    public findIndex(pos: number): FragmentPosition {
        if (pos === 0) {
            return {index: 0, offset: pos};
        }

        if (pos === this.size) {
            return {index: this.content.length, offset: pos};
        }

        if (pos > this.size || pos < 0) {
            throw new RangeError(`Position ${pos} outside of fragment (${this.toString()})`);
        }

        for (let i = 0, curPos = 0; ; i++) {
            const cur: PmNode = this.child(i);
            const end: number = curPos + cur.nodeSize;
            if (end >= pos) {
                if (end === pos) {
                    return {index: i + 1, offset: end};
                }
                return {index: i, offset: curPos};
            }
            curPos = end;
        }
    }

    /**
     * Returns a debugging string representation of this fragment.
     * The output format is `<node1, node2, ...>` where each node's toString() is called.
     *
     * This is useful for debugging and logging, providing a readable representation
     * of the fragment's structure.
     *
     * @returns A string representation of the fragment in the format "<child1, child2, ...>",
     *          or "<>" for an empty fragment.
     *
     * @example
     * ```typescript
     * console.log(fragment.toString());
     * // Output: <paragraph("Hello"), paragraph("World")>
     * ```
     */
    public toString(): string {
        return `<${this.toStringInner()}>`;
    }

    /**
     * Returns the inner string representation without the enclosing brackets.
     *
     * This is used internally by toString() and can be useful when you want to
     * build custom string representations.
     *
     * @returns A comma-separated string of child node representations.
     * @private
     */
    public toStringInner(): string {
        return this.content.join(', ');
    }

    /**
     * Creates a JSON-serializable representation of this fragment.
     *
     * Each child node is converted to JSON by calling its toJSON() method.
     * Empty fragments return null for efficiency. The resulting JSON can be
     * deserialized using Fragment.fromJSON().
     *
     * @returns An array of node JSON objects, or null if the fragment is empty.
     *
     * @example
     * ```typescript
     * const json = fragment.toJSON();
     * // Later, restore from JSON:
     * const restored = Fragment.fromJSON(schema, json);
     * ```
     */
    public toJSON(): Array<NodeJSON> | null {
        return this.content.length ? this.content.map(n => n.toJSON()) : null;
    }

    /**
     * Creates a new fragment by prepending the given node to the beginning of this fragment.
     *
     * This maintains immutability by creating a new Fragment instance. The original
     * fragment remains unchanged.
     *
     * @param node The node to prepend. Must be a valid Node instance.
     * @returns A new Fragment with the node added at the start, followed by all
     *          the original children.
     *
     * @example
     * ```typescript
     * const newFrag = fragment.addToStart(headerNode);
     * // newFrag has headerNode as first child, followed by original children
     * ```
     */
    public addToStart(node: PmNode): Fragment {
        return new Fragment([node, ...this.content], this.size + node.nodeSize);
    }

    /**
     * Creates a new fragment by appending the given node to the end of this fragment.
     *
     * This maintains immutability by creating a new Fragment instance. The original
     * fragment remains unchanged.
     *
     * @param node The node to append. Must be a valid Node instance.
     * @returns A new Fragment with all the original children, followed by the
     *          appended node at the end.
     *
     * @example
     * ```typescript
     * const newFrag = fragment.addToEnd(footerNode);
     * // newFrag has all original children, followed by footerNode
     * ```
     */
    public addToEnd(node: PmNode): Fragment {
        return new Fragment([...this.content, node], this.size + node.nodeSize);
    }

    /**
     * Invokes the given callback for every descendant node in the entire fragment.
     * This is equivalent to calling `nodesBetween(0, this.size, callback)`.
     *
     * This is a convenience method for traversing all nodes in the fragment without
     * specifying explicit start and end positions.
     *
     * @param callbackFunc Function called for each descendant node. Receives:
     *                     - node: The current node being visited
     *                     - pos: The position relative to the start of the fragment
     *                     - parent: The parent node (or null if at fragment level)
     *                     - index: The index of the node within its parent
     *                     Return `false` to prevent traversal of this node's children.
     *
     * @example
     * ```typescript
     * fragment.descendants((node, pos) => {
     *   console.log(`Node ${node.type.name} at position ${pos}`);
     * });
     * ```
     */
    public descendants(callbackFunc: (node: PmNode,
                                      pos: number,
                                      parent: PmNode | null,
                                      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
                                      index: number) => boolean | void): void {
        this.nodesBetween(0, this.size, callbackFunc);
    }

    /**
     * Calculates the total size of the fragment from its content.
     *
     * This is an optimization method that uses a pre-calculated size if provided,
     * avoiding the overhead of summing node sizes when the size is already known
     * (e.g., during fragment operations that track size).
     *
     * @param content The array of nodes to calculate size for.
     * @param providedSize Optional pre-calculated size to avoid computation. If provided,
     *                     this value is returned directly without any calculation.
     * @returns The total size of all nodes in the fragment (sum of all node.nodeSize values).
     * @private
     */
    private calculateSize(content: ReadonlyArray<PmNode>, providedSize?: number): number {
        if (!isUndefinedOrNull(providedSize)) {
            return providedSize;
        }

        let totalSize = 0;
        for (const node of content) {
            totalSize += node.nodeSize;
        }
        return totalSize;
    }

    /**
     * Determines whether a block separator should be added for the given node.
     *
     * Block separators are added between block-level nodes (like paragraphs) when
     * extracting text content. The separator is only added for block nodes that
     * have content (either leaf nodes with text or textblock nodes).
     *
     * @param node The node to check for separator requirement.
     * @param nodeText The text content of the node.
     * @param blockSeparator The block separator string (e.g., '\n'). If null or undefined,
     *                       no separator is added.
     * @returns True if a separator should be added before this node's text, false otherwise.
     * @private
     */
    private shouldAddBlockSeparator(node: PmNode,
                                    nodeText: string,
                                    blockSeparator: string | null | undefined): boolean {
        return node.isBlock &&
            ((node.isLeaf && !!nodeText) || node.isTextblock) &&
            !!blockSeparator;
    }

    /**
     * Appends another fragment while merging the boundary text nodes.
     * This method should only be called when both fragments have content and
     * the boundary nodes are text nodes with matching markup.
     *
     * This is an internal optimization for the append() method that efficiently
     * merges adjacent text nodes without creating intermediate fragment instances.
     *
     * @param other The fragment to append. Must have at least one child that is a
     *              text node matching the markup of this fragment's last child.
     * @returns A new Fragment with the boundary text nodes merged into a single node.
     * @private
     */
    private appendWithTextMerge(other: Fragment): Fragment {
        const content: Array<PmNode> = this.content.slice();
        // Safe to cast because this method is only called after verifying nodes exist and are text nodes
        const lastNode = this.content[this.content.length - 1] as TextNode;
        const firstNode = other.content[0] as TextNode;

        // Merge the two text nodes
        content[content.length - 1] = lastNode.withText(lastNode.text + firstNode.text);

        // Add remaining nodes from other fragment
        for (let i = 1; i < other.content.length; i++) {
            content.push(other.content[i]);
        }

        return new Fragment(content, this.size + other.size);
    }

    /**
     * Cuts a child node to fit within the specified range.
     *
     * Handles the different cutting logic for text nodes vs non-text nodes.
     * Text nodes use character offsets, while other nodes use position offsets
     * that account for the opening token.
     *
     * @param child The child node to cut. Can be a text node or any other node type.
     * @param from The start position of the range (absolute position in the fragment).
     * @param to The end position of the range (absolute position in the fragment).
     * @param pos The current position where this child node starts in the fragment.
     * @returns A new node containing only the portion within the specified range.
     * @private
     */
    private cutChild(child: PmNode, from: number, to: number, pos: number): PmNode {
        if (child.isText) {
            return child.cut(
                Math.max(0, from - pos),
                Math.min(child.text.length, to - pos)
            );
        } else {
            return child.cut(
                Math.max(0, from - pos - 1),
                Math.min(child.content.size, to - pos - 1)
            );
        }
    }

    /**
     * Recursively finds the first position where two fragments differ, starting from the beginning.
     * Compares nodes child by child and descends into their content when necessary.
     *
     * This method optimizes by skipping identical nodes (by reference) and handles
     * different node types: text nodes (character-by-character comparison) and
     * container nodes (recursive descent).
     *
     * @param self The first fragment to compare.
     * @param other The second fragment to compare.
     * @param pos The current position offset, used to track the absolute position
     *            where differences are found.
     * @returns The absolute position where fragments differ, or null if they are
     *          identical (or identical up to the end of the shorter fragment).
     * @private
     */
    private findDiffStartPosition(self: Fragment, other: Fragment, pos: number): number | null {
        for (let i = 0; ; i++) {

            // Check if we've reached the end of either fragment
            if (i === self.childCount || i === other.childCount) {
                return self.childCount === other.childCount ? null : pos;
            }

            const childSelf: PmNode = self.child(i);
            const childOther: PmNode = other.child(i);

            // Identical nodes (by reference) - skip ahead
            if (childSelf === childOther) {
                pos += childSelf.nodeSize;
                continue;
            }

            // Different node types or marks - difference found
            if (!childSelf.sameMarkup(childOther)) {
                return pos;
            }

            // For text nodes, find the exact character position where they differ
            if (childSelf.isText && childSelf.text !== childOther.text) {
                for (let j = 0; j < childSelf.text.length && j < childOther.text.length && childSelf.text[j] === childOther.text[j]; j++) {
                    pos++;
                }
                return pos;
            }

            // Recursively check node content if nodes have children
            if (childSelf.content.size || childOther.content.size) {
                const inner = this.findDiffStartPosition(childSelf.content, childOther.content, pos + 1);
                if (inner !== null) {
                    return inner;
                }
            }
            pos += childSelf.nodeSize;
        }
    }

    /**
     * Recursively finds the first position where two fragments differ, starting from the end.
     * Compares nodes child by child in reverse order and descends into their content when necessary.
     *
     * This method is more complex than findDiffStartPosition because the two fragments
     * may have different sizes, requiring separate position tracking for each fragment.
     *
     * @param self The first fragment to compare.
     * @param other The second fragment to compare.
     * @param posSelf The current position in the first fragment, counting backwards from the end.
     * @param posOther The current position in the second fragment, counting backwards from the end.
     * @returns An object with `selfPos` and `otherPos` properties indicating where the fragments
     *          differ when searching backwards, or null if they are identical from the end.
     * @private
     */
    private findDiffEndPosition(self: Fragment, other: Fragment, posSelf: number, posOther: number): DiffPosition | null {
        for (let childsSelf = self.childCount, childsOther = other.childCount; ;) {

            // Check if we've reached the beginning of either fragment
            if (childsSelf === 0 || childsOther === 0) {
                return childsSelf === childsOther ? null : {selfPos: posSelf, otherPos: posOther, a: posSelf, b: posOther};
            }

            const childSelf: PmNode = self.child(--childsSelf);
            const childOther: PmNode = other.child(--childsOther);
            const size: number = childSelf.nodeSize;

            // Identical nodes (by reference) - skip backwards
            if (childSelf === childOther) {
                posSelf -= size;
                posOther -= size;
                continue;
            }

            // Different node types or marks - difference found
            if (!childSelf.sameMarkup(childOther)) {
                return {selfPos: posSelf, otherPos: posOther, a: posSelf, b: posOther};
            }

            // For text nodes, find the exact character position where they differ (from the end)
            if (childSelf.isText && childSelf.text !== childOther.text) {
                const minSize: number = Math.min(childSelf.text.length, childOther.text.length);

                let same = 0;
                while (same < minSize && childSelf.text[childSelf.text.length - same - 1] === childOther.text[childOther.text.length - same - 1]) {
                    same++;
                    posSelf--;
                    posOther--;
                }
                return {selfPos: posSelf, otherPos: posOther, a: posSelf, b: posOther};
            }

            // Recursively check node content if nodes have children
            if (childSelf.content.size || childOther.content.size) {
                const inner: DiffPosition = this.findDiffEndPosition(childSelf.content, childOther.content, posSelf - 1, posOther - 1);
                if (inner) {
                    return inner;
                }
            }
            posSelf -= size;
            posOther -= size;
        }
    }

    /**
     * Extracts text content from a node based on its type and the provided options.
     *
     * This method handles three types of nodes:
     * - Text nodes: Extract the actual text content within the range
     * - Non-leaf nodes: Return empty string (content is handled by traversal)
     * - Leaf nodes: Use leafText parameter, function, or node spec's leafText
     *
     * @param node The node to extract text from.
     * @param from The starting position of the text range in the fragment.
     * @param to The ending position of the text range in the fragment.
     * @param pos The current position where this node starts in the fragment.
     * @param leafText Optional text or function for leaf nodes:
     *                 - If a function: Called with the node to get its text representation
     *                 - If a string: Used as text for all leaf nodes
     *                 - If null/undefined: Falls back to node.type.spec.leafText
     * @returns The extracted text content, or empty string if not applicable.
     * @private
     */
    private getNodeText(node: PmNode,
                        from: number,
                        to: number,
                        pos: number,
                        leafText?: string | null | ((leafNode: PmNode) => string)): string {
        if (node.isText) {
            return node.text.slice(Math.max(from, pos) - pos, to - pos);
        } else if (!node.isLeaf) {
            return '';
        } else if (typeof leafText === 'function') {
            return leafText(node);
        } else if (leafText) {
            return leafText;
        } else if (node.type.spec.leafText) {
            return node.type.spec.leafText(node);
        }
        return '';
    }
}
