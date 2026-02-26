import type {MarkType} from '../schema/MarkType';
import type {NodeType} from '../schema/NodeType';
import type {Schema} from '../schema/Schema';
import type {MarkJSON} from '../types/elements/MarkJSON';
import type {NodeJSON} from '../types/elements/NodeJSON';
import type {SliceJSON} from '../types/elements/SliceJSON';
import type {Attrs} from '../types/schema/Attrs';
import {Fragment} from './Fragment';
import {Mark} from './Mark';
import {Node as PmNode} from './Node';
import {NodeRange} from './NodeRange';
import type {ResolvedPos} from './ResolvedPos';
import {Slice} from './Slice';
import {TextNode} from './TextNode';


export class ElementFactory {

    private static _EMPTY_FRAGMENT?: Fragment;
    public static readonly EMPTY_MARK: ReadonlyArray<Mark> = Object.freeze(new Array<Mark>());

    public static get EMPTY_SLICE(): Slice {
        return Slice.empty;
    }

    public static get EMPTY_FRAGMENT(): Fragment {
        if(!ElementFactory._EMPTY_FRAGMENT) {
            ElementFactory._EMPTY_FRAGMENT = new Fragment([], 0);
        }
        return ElementFactory._EMPTY_FRAGMENT;
    }

    public static createFragment(content: ReadonlyArray<PmNode>, size?: number): Fragment {
        return new Fragment(content, size);
    }

    public static fragmentFromJSON(schema: Schema, value?: Array<NodeJSON>): Fragment {
        return Fragment.fromJSON(schema, value);
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
        if (!nodes) {
            return Fragment.empty;
        }

        if (nodes instanceof Fragment) {
            return nodes;
        }

        if (Array.isArray(nodes)) {
            return ElementFactory.fromArray(nodes);
        }

        if (ElementFactory.isNode(nodes)) {
            return new Fragment([nodes], nodes.nodeSize);
        }

        throw new RangeError(
            `Cannot convert ${nodes.toString()} to a Fragment` +
            (ElementFactory.isNode(nodes) && (nodes as PmNode).nodesBetween
                ? ' (looks like multiple versions of prosemirror-model were loaded)'
                : '')
        );
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

    public static createSlice(content: Fragment, openStart: number, openEnd: number): Slice {
        return new Slice(content, openStart, openEnd);
    }

    public static maxOpen(fragment: Fragment, openIsolating = true): Slice {
        return Slice.maxOpen(fragment, openIsolating);
    }

    public static sliceFromJSON(schema: Schema, json: SliceJSON): Slice {
        return Slice.fromJSON(schema, json);
    }

    public static isSlice(node: PmNode | Slice): boolean {
        return node instanceof Slice;
    }

    public static createNodeRange($from: ResolvedPos, $to: ResolvedPos, depth: number): NodeRange {
        return new NodeRange($from, $to, depth);
    }

    public static createNode(type: NodeType,
                             attrs: Attrs,
                             content?: Fragment | null,
                             marks?: ReadonlyArray<Mark>,
                             text?: string): PmNode {
        return new PmNode(type, attrs, content || ElementFactory.EMPTY_FRAGMENT, marks, text);
    }

    public static createTextNode(type: NodeType,
                                 attrs: Attrs,
                                 content: string,
                                 marks?: ReadonlyArray<Mark>): TextNode {
        return new TextNode(type, attrs, content, marks);
    }

    public static nodeFromJSON(schema: Schema, json: NodeJSON): PmNode {
        return PmNode.fromJSON(schema, json);
    }

    public static textNodeFromJSON(schema: Schema, json: NodeJSON): PmNode {
        return TextNode.fromJSON(schema, json);
    }

    public static createMark(type: MarkType, attrs: Attrs): Mark {
        return new Mark(type, attrs);
    }

    public static setFrom(marks?: Mark | ReadonlyArray<Mark> | null): ReadonlyArray<Mark> {
        return Mark.setFrom(marks);
    }

    public static sameSet(a: ReadonlyArray<Mark>, b: ReadonlyArray<Mark>): boolean {
        return Mark.sameSet(a, b);
    }

    public static isMark(markOrMarkType: Mark | MarkType): boolean {
        return markOrMarkType instanceof Mark;
    }

    public static markFromJSON(schema: Schema, json: MarkJSON): Mark {
        return Mark.fromJSON(schema, json);
    }

    /**
     * Type guard to check if a value is a Node.
     *
     * This uses duck typing to check for the presence of the `attrs` property,
     * which is present on all Node instances. This is more reliable than instanceof
     * checks when multiple versions of prosemirror-model might be loaded.
     *
     * @param value The value to check for Node type.
     * @returns True if the value is a Node instance (has an attrs property).
     * @private
     */
    private static isNode(value: unknown): value is PmNode {
        return (value as PmNode).attrs !== undefined;
    }
}
