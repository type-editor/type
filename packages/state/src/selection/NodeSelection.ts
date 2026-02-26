import type {PmSelection, SelectionJSON} from '@type-editor/editor-types';
import {Fragment, type Node, type ResolvedPos, Slice} from '@type-editor/model';

import {NodeBookmark} from './bookmarks/NodeBookmark';
import {Selection} from './Selection';
import {SelectionTypeEnum} from './SelectionTypeEnum';

/**
 * A node selection is a selection that points at a single node. All
 * nodes marked [selectable](#model.NodeSpec.selectable) can be the
 * target of a node selection. In such a selection, `from` and `to`
 * point directly before and after the selected node, `anchor` equals
 * `from`, and `head` equals `to`.
 *
 * Node selections are typically invisible and are used to select
 * block-level elements like images, tables, or other atomic nodes
 * that cannot be part of a text selection.
 */
export class NodeSelection extends Selection implements PmSelection {

    static {
        const newNodeSelectionFunc = (nodeOrPosition: ResolvedPos | Node, position?: number): NodeSelection => {
            if(typeof position === 'number') {
                return NodeSelection.create(nodeOrPosition as Node, position);
            } else {
                return NodeSelection.create(nodeOrPosition as ResolvedPos);
            }
        };

        Selection.registerNodeSelectionHandler(newNodeSelectionFunc);
        Selection.registerJsonDeserializerClass(SelectionTypeEnum.NODE.valueOf(), NodeSelection);
    }

    private static readonly TYPE_NODE_SELECTION = 'node';

    /**
     * The node that is selected by this selection.
     * @private
     */
    private readonly selectedNode: Node;

    /**
     * Create a node selection. Does not verify the validity of its
     * argument - it's the caller's responsibility to ensure that the
     * position points to a selectable node.
     *
     * @param $pos Position immediately before the node to select. The node
     *             should be accessible via `$pos.nodeAfter`.
     * @throws {RangeError} If there is no node after the given position
     */
    constructor($pos: ResolvedPos) {
        const node: Node = $pos.nodeAfter;
        if (!node) {
            throw new RangeError('Cannot create NodeSelection: no node after the given position');
        }
        const doc: Node = $pos.node(0);
        const $end: ResolvedPos = doc.resolve($pos.pos + node.nodeSize);
        super($pos, $end);
        this.selectedNode = node;
        this.isVisible = false;
    }

    /**
     * The type identifier for this selection.
     *
     * @returns Always returns SelectionType.NODE
     */
    get type(): string {
        return SelectionTypeEnum.NODE;
    }

    /**
     * The selected node.
     * Provides direct access to the node object that is currently selected.
     *
     * @returns The selected node
     */
    get node(): Node {
        return this.selectedNode;
    }

    /**
     * Deserialize a node selection from its JSON representation.
     *
     * @param doc The document node containing the selection
     * @param json The JSON representation with an anchor position
     * @returns A new NodeSelection instance
     * @throws {RangeError} If the JSON does not contain a valid anchor position
     */
    public static fromJSON(doc: Node, json: SelectionJSON): NodeSelection {
        if (typeof json.anchor !== 'number') {
            throw new RangeError('Invalid input for NodeSelection.fromJSON');
        }
        return new NodeSelection(doc.resolve(json.anchor));
    }

    /**
     * Get the content of this selection as a slice.
     * For node selections, this returns the selected node wrapped in a slice
     * with zero open depth on both sides.
     *
     * @returns A slice containing only the selected node
     */
    public content(): Slice {
        return new Slice(Fragment.from(this.selectedNode), 0, 0);
    }

    /**
     * Test whether this selection is equal to another selection.
     * Node selections are equal if they select the same position
     * (and thus the same node).
     *
     * @param other The selection to compare with
     * @returns True if both are node selections at the same anchor position
     */
    public eq(other: PmSelection): boolean {
        return other instanceof NodeSelection && other.anchor === this.anchor;
    }

    /**
     * Convert this selection to a JSON-serializable representation.
     *
     * @returns A JSON object containing the type and anchor position
     */
    public toJSON(): SelectionJSON {
        return {type: NodeSelection.TYPE_NODE_SELECTION, anchor: this.anchor};
    }

    /**
     * Create a bookmark for this selection.
     * The bookmark can be used to restore this selection after document changes,
     * by mapping the anchor position through those changes.
     *
     * @returns A NodeBookmark instance that can recreate this selection
     */
    public getBookmark(): NodeBookmark {
        return new NodeBookmark(this.anchor);
    }

    /**
     * Create a node selection from a resolved position.
     *
     * @param position The resolved position immediately before the node to select
     * @returns A new EditorSelection wrapping a NodeSelection
     */
    public static create(position: ResolvedPos): NodeSelection;

    /**
     * Create a node selection from a document and position offset.
     *
     * @param node The document node containing the selection
     * @param position The integer position immediately before the node to select
     * @returns A new EditorSelection wrapping a NodeSelection
     */
    public static create(node: Node, position: number): NodeSelection;

    /**
     * Create a node selection. Overloaded to accept either a resolved position
     * or a document with an integer position.
     *
     * @param nodeOrPosition Either a resolved position or a document node
     * @param position Optional integer position (required if first arg is a Node)
     * @returns A new EditorSelection wrapping a NodeSelection
     */
    public static create(nodeOrPosition: ResolvedPos | Node, position?: number): NodeSelection {
        if (position === undefined) {
            return new NodeSelection(nodeOrPosition as ResolvedPos);
        }
        return new NodeSelection((nodeOrPosition as Node).resolve(position));
    }
}
