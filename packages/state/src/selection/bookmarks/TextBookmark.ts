import type {Mappable, PmSelection, SelectionBookmark} from '@type-editor/editor-types';
import type {Node} from '@type-editor/model';

import {Selection} from '../Selection';

/**
 * Bookmark implementation for text selections.
 * Stores anchor and head positions as simple numbers that can be
 * mapped through document changes.
 */
export class TextBookmark implements SelectionBookmark {

    /**
     * The anchor position of the text selection.
     * @private
     */
    private readonly anchor: number;

    /**
     * The head position of the text selection.
     * @private
     */
    private readonly head: number;

    /**
     * Create a text selection bookmark.
     *
     * @param anchor The anchor position (immobile end)
     * @param head The head position (mobile end)
     */
    constructor(anchor: number, head: number) {
        this.anchor = anchor;
        this.head = head;
    }

    /**
     * Map this bookmark through document changes.
     * Both anchor and head positions are mapped to their new locations.
     *
     * @param mapping The mappable transformation
     * @returns A new TextBookmark with mapped positions
     */
    public map(mapping: Mappable): TextBookmark {
        return new TextBookmark(mapping.map(this.anchor), mapping.map(this.head));
    }

    /**
     * Resolve this bookmark to a text selection.
     * Uses `textSelectionBetween` to ensure the resolved positions are
     * valid for a text selection, adjusting them if necessary.
     *
     * @param doc The document to resolve the selection in
     * @returns A text selection at the bookmarked positions
     */
    public resolve(doc: Node): PmSelection {
        return Selection.textSelectionBetween(doc.resolve(this.anchor), doc.resolve(this.head));
    }
}
