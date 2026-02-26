import type {PmSelection, SelectionBookmark, SelectionJSON} from '@type-editor/editor-types';
import type {Node} from '@type-editor/model';

import {AllBookmark} from './bookmarks/AllBookmark';
import {Selection} from './Selection';
import {SelectionTypeEnum} from './SelectionTypeEnum';

/**
 * A selection type that represents selecting the whole document
 * (which can not necessarily be expressed with a text selection, when
 * there are for example leaf block nodes at the start or end of the
 * document).
 *
 * This selection type is useful when you need to select all content,
 * including non-inline elements that cannot be part of a text selection.
 */
export class AllSelection extends Selection implements PmSelection {

    static {
        const newAllSelectionFunc = (doc: Node): AllSelection => {
            return new AllSelection(doc);
        };

        Selection.registerAllSelectionHandler(newAllSelectionFunc);
        Selection.registerJsonDeserializerClass(SelectionTypeEnum.ALL.valueOf(), AllSelection);
    }

    private static readonly TYPE_ALL_SELECTION = 'all';

    /**
     * Create an all-selection over the given document.
     * The selection spans from position 0 to the end of the document content.
     *
     * @param doc The document node to select in its entirety
     */
    constructor(doc: Node) {
        super(doc.resolve(0), doc.resolve(doc.content.size));
    }

    /**
     * The type identifier for this selection.
     *
     * @returns Always returns SelectionType.ALL
     */
    get type(): string {
        return SelectionTypeEnum.ALL;
    }

    /**
     * Deserialize an all-selection from its JSON representation.
     *
     * @param doc The document node in which to create the selection
     * @returns A new AllSelection instance spanning the entire document
     */
    public static fromJSON(doc: Node): AllSelection {
        return new AllSelection(doc);
    }

    /**
     * Convert this selection to a JSON-serializable representation.
     *
     * @returns A JSON object with the selection type
     */
    public toJSON(): SelectionJSON {
        return {type: AllSelection.TYPE_ALL_SELECTION};
    }

    /**
     * Test whether this selection is equal to another selection.
     * AllSelections are considered equal if the other is also an AllSelection,
     * regardless of document content.
     *
     * @param other The selection to compare with
     * @returns True if the other selection is also an AllSelection
     */
    public eq(other: PmSelection): boolean {
        return other instanceof AllSelection;
    }

    /**
     * Create a bookmark for this selection.
     * The bookmark can be used to restore this selection after document changes.
     *
     * @returns An AllBookmark instance
     */
    public getBookmark(): SelectionBookmark {
        return new AllBookmark();
    }

    /**
     * Create an all-selection that spans the entire document.
     * This selection type is useful when you need to select all content,
     * including non-inline elements that cannot be part of a text selection.
     *
     * @param document The document node to select in its entirety
     * @returns A new EditorSelection wrapping an AllSelection
     */
    public static createAllSelection(document: Node): AllSelection {
        return new AllSelection(document);
    }

}
