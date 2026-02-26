import type {Mappable} from '@type-editor/editor-types';
import {type PmNode, type ResolvedPos} from '@type-editor/model';
import {Selection,} from '@type-editor/state';

import {inSameTable} from '../utils/in-same-table';
import {CellSelection} from './CellSelection';

/**
 * A bookmark for a CellSelection that can survive document changes.
 *
 * Bookmarks store the raw positions of the anchor and head cells and can
 * be mapped through document transformations. When resolved, they attempt
 * to recreate the original CellSelection or fall back to a nearby selection.
 *
 * @see {@link CellSelection.getBookmark}
 */
export class CellBookmark {

    /** The absolute document position of the anchor cell. */
    private readonly anchor: number;
    /** The absolute document position of the head cell. */
    private readonly head: number;

    /**
     * Creates a new CellBookmark.
     *
     * @param anchor - The absolute document position of the anchor cell.
     * @param head - The absolute document position of the head cell.
     */
    constructor(anchor: number, head: number) {
        this.anchor = anchor;
        this.head = head;
    }

    /**
     * Maps this bookmark through a document transformation.
     *
     * @param mapping - The mapping describing the document change.
     * @returns A new CellBookmark with updated positions.
     */
    public map(mapping: Mappable): CellBookmark {
        return new CellBookmark(mapping.map(this.anchor), mapping.map(this.head));
    }

    /**
     * Resolves this bookmark to a selection in the given document.
     *
     * If both positions still point to valid cells within the same table,
     * a CellSelection is returned. Otherwise, falls back to a nearby selection.
     *
     * @param doc - The document to resolve positions in.
     * @returns A CellSelection if valid, or a fallback Selection.
     */
    public resolve(doc: PmNode): CellSelection | Selection {
        const $anchorCell: ResolvedPos = doc.resolve(this.anchor);
        const $headCell: ResolvedPos = doc.resolve(this.head);

        // Validate that both positions still point to valid cells within rows and the same table
        if (this.isValidCellBookmark($anchorCell, $headCell)) {
            return new CellSelection($anchorCell, $headCell);
        }

        // Fall back to a nearby selection if the bookmark is no longer valid
        return Selection.near($headCell, 1);
    }

    /**
     * Checks if the resolved positions form a valid cell selection.
     *
     * @param $anchorCell - The resolved anchor position.
     * @param $headCell - The resolved head position.
     * @returns `true` if both positions point to valid cells in the same table.
     */
    private isValidCellBookmark($anchorCell: ResolvedPos, $headCell: ResolvedPos): boolean {
        return (
            $anchorCell.parent.type.spec.tableRole === 'row' &&
            $headCell.parent.type.spec.tableRole === 'row' &&
            $anchorCell.index() < $anchorCell.parent.childCount &&
            $headCell.index() < $headCell.parent.childCount &&
            inSameTable($anchorCell, $headCell)
        );
    }
}
