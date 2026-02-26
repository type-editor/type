import type {PmNode, ResolvedPos, Slice} from '@type-editor/model';

import type {Mappable} from '../../transform';
import type {PmTransaction} from '../PmTransaction';
import type {PmSelectionRange} from './PmSelectionRange';
import type {SelectionBookmark} from './SelectionBookmark';
import type {SelectionJSON} from './SelectionJSON';

/**
 * Public interface for editor selections.
 * This is the main interface that external code interacts with,
 * typically through the EditorSelection class which implements it.
 *
 * Selections represent the current user selection or cursor position
 * in the editor. They can be text selections (ranges of text), node
 * selections (single block nodes), or all-selections (entire document).
 */
export interface PmSelection {

    /** The ranges covered by the selection */
    readonly ranges: ReadonlyArray<PmSelectionRange>;

    /** The resolved anchor position (immobile end) */
    readonly $anchor: ResolvedPos;

    /** The resolved head position (mobile end) */
    readonly $head: ResolvedPos;

    /** The anchor position as an integer offset */
    readonly anchor: number;

    /** The head position as an integer offset */
    readonly head: number;

    /** The lower bound of the main range */
    readonly from: number;

    /** The upper bound of the main range */
    readonly to: number;

    /** The resolved lower bound of the main range */
    readonly $from: ResolvedPos;

    /** The resolved upper bound of the main range */
    readonly $to: ResolvedPos;

    /** Whether the selection is empty (contains no content) */
    readonly empty: boolean;

    /**
     * The type identifier for this selection.
     */
    readonly type: string | undefined;

    /** The cursor position if this is an empty text selection, null otherwise */
    readonly $cursor: ResolvedPos | null;

    /** The selected node if this is a node selection, null otherwise */
    readonly node: PmNode | null;

    /** Whether the selection should be visible in the browser */
    visible: boolean;

    /**
     * Check if this is a text selection.
     *
     * @returns True if this is a TextSelection
     */
    isTextSelection(): boolean;

    /**
     * Check if this is a node selection.
     *
     * @returns True if this is a NodeSelection
     */
    isNodeSelection(): boolean;

    /**
     * Check if this is an all selection.
     *
     * @returns True if this is an AllSelection
     */
    isAllSelection(): boolean;

    /**
     * Test whether this selection is equal to another selection.
     *
     * @param selection The selection to compare with
     * @returns True if the selections are equal
     */
    eq(selection: PmSelection): boolean;

    /**
     * Map this selection through a mappable transformation.
     * Updates the selection to reflect document changes.
     *
     * @param doc The new document after the transformation
     * @param mapping The mappable transformation
     * @returns A new selection mapped to the new document
     */
    map(doc: PmNode, mapping: Mappable): PmSelection;

    /**
     * Get the content of this selection as a slice.
     * Extracts the document content within the selection's range.
     *
     * @returns A slice containing the selected content
     */
    content(): Slice;

    /**
     * Convert the selection to a JSON-serializable representation.
     *
     * @returns A JSON object representing the selection
     */
    toJSON(): SelectionJSON;

    /**
     * Create a bookmark for this selection.
     * The bookmark can be used to restore the selection after document changes.
     *
     * @returns A bookmark that can recreate this selection
     */
    getBookmark(): SelectionBookmark | null;

    /**
     * Replace the selection with a slice or, if no slice is given,
     * delete the selection. Will append to the given transaction.
     *
     * @param transaction The transaction to append the replacement to
     * @param content The content to insert (optional, defaults to empty/delete)
     */
    replace(transaction: PmTransaction, content?: Slice): void;

    /**
     * Replace the selection with the given node, appending the changes
     * to the given transaction.
     *
     * @param transaction The transaction to append the replacement to
     * @param node The node to insert in place of the selection
     */
    replaceWith(transaction: PmTransaction, node: PmNode): void;
}
