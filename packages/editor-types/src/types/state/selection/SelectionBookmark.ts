import type {PmNode} from '@type-editor/model';

import type {Mappable} from '../../transform';
import type {PmSelection} from './PmSelection';


/**
 * A lightweight, document-independent representation of a selection.
 * You can define a custom bookmark type for a custom selection class
 * to make the history handle it well.
 *
 * Bookmarks store selection positions as simple numbers rather than
 * resolved positions, making them suitable for persistence across
 * document changes. They can be mapped through document transformations
 * and then resolved back into full selections.
 */
export interface SelectionBookmark {

    /**
     * Map the bookmark through a set of changes.
     * This updates the stored positions to reflect document transformations.
     *
     * @param mapping The mappable transformation (e.g., from a transaction)
     * @returns A new bookmark with mapped positions
     */
    map: (mapping: Mappable) => SelectionBookmark;


    /**
     * Resolve the bookmark to a real selection again. This may need to
     * do some error checking and may fall back to a default (usually
     * `EditorSelection.textSelectionBetween`) if mapping made the
     * bookmark invalid.
     *
     * @param doc The document in which to resolve the selection
     * @returns A valid selection in the given document
     */
    resolve: (doc: PmNode) => PmSelection;
}
