import type {ResolvedPos} from '@type-editor/model';
import type {Node} from '@type-editor/model';

import {AllSelection} from './AllSelection';
import {NodeSelection} from './NodeSelection';
import {TextSelection} from './TextSelection';


/**
 * Factory class for creating selection instances.
 * Delegates to the specific selection classes' factory methods.
 */
export class SelectionFactory {

    /**
     * Create an all-selection that spans the entire document.
     * This selection type is useful when you need to select all content,
     * including non-inline elements that cannot be part of a text selection.
     *
     * @param document The document node to select in its entirety
     * @returns A new AllSelection instance
     */
    public static createAllSelection(document: Node): AllSelection {
        return AllSelection.createAllSelection(document);
    }

    /**
     * Create a node selection from a resolved position.
     *
     * @param position The resolved position immediately before the node to select
     * @returns A new NodeSelection instance
     */
    public static createNodeSelection(position: ResolvedPos): NodeSelection;

    /**
     * Create a node selection from a document and position offset.
     *
     * @param node The document node containing the selection
     * @param position The integer position immediately before the node to select
     * @returns A new NodeSelection instance
     */
    public static createNodeSelection(node: Node, position: number): NodeSelection;

    /**
     * Create a node selection. Overloaded to accept either a resolved position
     * or a document with an integer position.
     * Delegates to NodeSelection.create().
     *
     * @param nodeOrPosition Either a resolved position or a document node
     * @param position Optional integer position (required if first arg is a Node)
     * @returns A new NodeSelection instance
     */
    public static createNodeSelection(nodeOrPosition: ResolvedPos | Node, position?: number): NodeSelection {
        if (position !== undefined) {
            return NodeSelection.create(nodeOrPosition as Node, position);
        }
        return NodeSelection.create(nodeOrPosition as ResolvedPos);
    }

    /**
     * Create a text selection from a document node and integer positions.
     *
     * @param node The document node containing the selection
     * @param anchor The anchor position as an integer offset
     * @param head The head position as an integer offset (optional, defaults to anchor)
     * @returns A new TextSelection instance
     */
    public static createTextSelection(node: Node, anchor: number, head?: number): TextSelection;

    /**
     * Create a text selection from resolved positions.
     *
     * @param anchor The resolved anchor position
     * @param head The resolved head position (optional, defaults to anchor)
     * @returns A new TextSelection instance
     */
    public static createTextSelection(anchor: ResolvedPos, head?: ResolvedPos): TextSelection;

    /**
     * Create a text selection. Overloaded to accept either resolved positions
     * or a document with integer positions.
     * Delegates to TextSelection.create().
     *
     * @param anchorOrNode Either a resolved anchor position or a document node
     * @param anchorOrHead Either a resolved head position (if first arg is ResolvedPos) or anchor position number (if first arg is Node)
     * @param head Optional head position number (only used if first arg is Node)
     * @returns A new TextSelection instance
     */
    public static createTextSelection(anchorOrNode: ResolvedPos | Node,
                                      anchorOrHead?: ResolvedPos | number,
                                      head?: number): TextSelection {
        if (typeof anchorOrHead === 'number') {
            return TextSelection.create(anchorOrNode as Node, anchorOrHead, head);
        }
        // When called with ResolvedPos arguments
        return TextSelection.create(anchorOrNode as ResolvedPos, anchorOrHead);
    }
}
