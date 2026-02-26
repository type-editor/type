import type {PmSelection, SelectionBookmark} from '@type-editor/editor-types';
import type {Node} from '@type-editor/model';

import {SelectionFactory} from '../SelectionFactory';

/**
 * Bookmark implementation for all-selections.
 * Since all-selections always span the entire document, this bookmark
 * doesn't need to store any position information and mapping is a no-op.
 */
export class AllBookmark implements SelectionBookmark {

    /**
     * Map this bookmark through document changes.
     * All-selections are not affected by document changes, so this
     * simply returns the same bookmark.
     *
     * @returns This same bookmark instance
     */
    public map(): this {
        return this;
    };

    /**
     * Resolve this bookmark to an all-selection.
     *
     * @param doc The document to create the all-selection in
     * @returns An all-selection spanning the entire document
     */
    public resolve(doc: Node): PmSelection {
        return SelectionFactory.createAllSelection(doc);
    }
}
