import type {Mappable, PmSelection, SelectionBookmark} from '@type-editor/editor-types';
import type {Node, ResolvedPos} from '@type-editor/model';

import {Selection} from '../Selection';
import {SelectionFactory} from '../SelectionFactory';
import {TextBookmark} from './TextBookmark';

/**
 * Bookmark implementation for node selections.
 * Stores the anchor position (before the selected node) and handles
 * the case where the node is deleted by falling back to a text selection.
 */
export class NodeBookmark implements SelectionBookmark {

    /**
     * The position immediately before the selected node.
     * @private
     */
    private readonly anchor: number;

    /**
     * Create a node selection bookmark.
     *
     * @param anchor The position immediately before the node
     */
    constructor(anchor: number) {
        this.anchor = anchor;
    }

    /**
     * Map this bookmark through document changes.
     * If the node at the anchor position was deleted, this returns a
     * TextBookmark at the mapped position instead.
     *
     * @param mapping The mappable transformation
     * @returns A NodeBookmark if the node still exists, otherwise a TextBookmark
     */
    public map(mapping: Mappable): SelectionBookmark {
        const {deleted, pos} = mapping.mapResult(this.anchor);
        return deleted ? new TextBookmark(pos, pos) : new NodeBookmark(pos);
    }

    /**
     * Resolve this bookmark to a node selection if possible.
     * If there's no selectable node at the mapped position, falls back
     * to finding a nearby valid selection.
     *
     * @param doc The document to resolve the selection in
     * @returns A node selection if the node exists and is selectable, otherwise a nearby selection
     */
    public resolve(doc: Node): PmSelection {
        const $pos: ResolvedPos = doc.resolve(this.anchor);
        const node: Node | null = $pos.nodeAfter;
        if (node && Selection.isNodeSelectable(node)) {
            return SelectionFactory.createNodeSelection($pos);
        }
        return Selection.near($pos);
    }
}
