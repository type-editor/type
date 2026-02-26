import {isUndefinedOrNull} from '@type-editor/commons';
import type {PmSelection, SelectionJSON} from '@type-editor/editor-types';
import type {PmNode} from '@type-editor/model';
import {type ResolvedPos, TextNode} from '@type-editor/model';

import {TextBookmark} from './bookmarks/TextBookmark';
import {Selection} from './Selection';
import {SelectionTypeEnum} from './SelectionTypeEnum';

/**
 * A text selection represents a classical editor selection, with a
 * head (the moving side) and anchor (immobile side), both of which
 * point into textblock nodes. It can be empty (a regular cursor
 * position).
 *
 * This is the most common selection type, representing standard text
 * editing selections. When anchor equals head, it represents a cursor
 * position. When they differ, it represents a range of selected text.
 *
 * Both anchor and head must point into nodes with inline content
 * (text blocks). A warning will be logged in development mode if
 * this constraint is violated.
 */
export class TextSelection extends Selection implements PmSelection {

    static {
        const newTextSelectionFunc =
            (anchorOrNode: ResolvedPos | PmNode,
             anchorOrHead?: ResolvedPos | number,
             head?: number): TextSelection => {

            if (TextNode.isNode(anchorOrNode)) {
                // When called with Node and numeric positions
                const doc: PmNode = anchorOrNode;
                const anchorPos = typeof anchorOrHead === 'number' ? anchorOrHead : 0;
                const headPos = isUndefinedOrNull(head) ? anchorPos : head;
                return TextSelection.create(doc, anchorPos, headPos);
            } else {
                // When called with ResolvedPos arguments
                const pos: ResolvedPos = anchorOrNode;
                return TextSelection.create(pos, isUndefinedOrNull(anchorOrHead) ? pos : anchorOrHead as ResolvedPos);
            }
        };

        Selection.registerTextSelectionHandler(newTextSelectionFunc);
        Selection.registerJsonDeserializerClass(SelectionTypeEnum.TEXT.valueOf(), TextSelection);
    }

    private static readonly TYPE_TEXT_SELECTION: string = 'text';

    /**
     * Creates a text selection between the given points.
     * If only anchor is provided, creates a cursor selection at that position.
     *
     * @param $anchor The resolved anchor position (immobile end of the selection)
     * @param $head The resolved head position (mobile end), defaults to anchor for cursor selection
     */
    constructor($anchor: ResolvedPos, $head: ResolvedPos = $anchor) {
        super($anchor, $head);
        this.validateTextSelection($anchor);
        this.validateTextSelection($head);
    }

    /**
     * The type identifier for this selection.
     *
     * @returns Always returns SelectionType.TEXT
     */
    get type(): string {
        return SelectionTypeEnum.TEXT;
    }

    /**
     * Returns a resolved position if this is a cursor selection (an
     * empty text selection), and null otherwise.
     *
     * When the anchor and head are at the same position, this selection
     * represents a cursor rather than a range. This getter provides
     * convenient access to that position.
     *
     * @returns The cursor position if this is a cursor selection, null if it's a range
     */
    get $cursor(): ResolvedPos | null {
        return this.anchorPos.pos === this.headPos.pos ? this.headPos : null;
    }

    /**
     * Deserialize a text selection from its JSON representation.
     *
     * @param doc The document node containing the selection
     * @param json The JSON representation with anchor and head positions
     * @returns A new TextSelection instance
     * @throws {RangeError} If the JSON does not contain valid anchor and head positions
     */
    public static fromJSON(doc: PmNode, json: SelectionJSON): TextSelection {
        if (typeof json.anchor !== 'number' || typeof json.head !== 'number') {
            throw new RangeError('Invalid input for TextSelection.fromJSON');
        }
        return new TextSelection(doc.resolve(json.anchor), doc.resolve(json.head));
    }

    /**
     * Create a text selection from non-resolved positions.
     * This is a convenience method that resolves the positions for you.
     *
     * @param doc The document node in which to create the selection
     * @param anchor The anchor position as an integer offset
     * @param head The head position as an integer offset (defaults to anchor for cursor)
     * @returns A new TextSelection instance
     */
    public static from(doc: PmNode, anchor: number, head = anchor): TextSelection {
        const $anchor: ResolvedPos = doc.resolve(anchor);
        const $head: ResolvedPos = head === anchor ? $anchor : doc.resolve(head);
        return new this($anchor, $head);
    }

    /**
     * Validates that a position points into inline content.
     * Text selections must have both endpoints in nodes with inline content.
     * Logs a warning in development mode if validation fails.
     *
     * This validation only runs in development mode to avoid performance
     * overhead in production.
     *
     * @param $pos The resolved position to validate
     * @private
     */
    private validateTextSelection($pos: ResolvedPos): void {
        if (!$pos.parent.inlineContent &&
            typeof process !== 'undefined' &&
            process.env?.NODE_ENV !== 'production') {
            console.warn(
                `TextSelection endpoint not pointing into a node with inline content (${$pos.parent.type.name})`
            );
        }
    }

    /**
     * Test whether this selection is equal to another selection.
     * Text selections are equal if they have the same anchor and head positions.
     *
     * @param other The selection to compare with
     * @returns True if both are text selections with matching anchor and head
     */
    public eq(other: PmSelection): boolean {
        return other instanceof TextSelection
            && other.anchor === this.anchor
            && other.head === this.head;
    }

    /**
     * Create a bookmark for this selection.
     * The bookmark stores the anchor and head positions and can be used
     * to restore this selection after document changes by mapping the
     * positions through those changes.
     *
     * @returns A TextBookmark instance that can recreate this selection
     */
    public getBookmark(): TextBookmark {
        return new TextBookmark(this.anchor, this.head);
    }

    /**
     * Convert this selection to a JSON-serializable representation.
     *
     * @returns A JSON object containing the type, anchor, and head positions
     */
    public toJSON(): SelectionJSON {
        return {type: TextSelection.TYPE_TEXT_SELECTION, anchor: this.anchor, head: this.head};
    }

    /**
     * Create a text selection from a document node and integer positions.
     *
     * @param node The document node containing the selection
     * @param anchor The anchor position as an integer offset
     * @param head The head position as an integer offset (optional, defaults to anchor)
     * @returns A new EditorSelection wrapping a TextSelection
     */
    public static create(node: PmNode, anchor: number, head?: number): TextSelection;

    /**
     * Create a text selection from resolved positions.
     *
     * @param anchor The resolved anchor position
     * @param head The resolved head position (optional, defaults to anchor)
     * @returns A new EditorSelection wrapping a TextSelection
     */
    public static create(anchor: ResolvedPos, head?: ResolvedPos): TextSelection;

    /**
     * Create a text selection. Overloaded to accept either resolved positions
     * or a document with integer positions.
     *
     * @param anchorOrNode Either a resolved anchor position or a document node
     * @param anchorOrHead Either a resolved head position (if first arg is ResolvedPos) or anchor position number (if first arg is Node)
     * @param head Optional head position number (only used if first arg is Node)
     * @returns A new EditorSelection wrapping a TextSelection
     */
    public static create(anchorOrNode: ResolvedPos | PmNode,
                         anchorOrHead?: ResolvedPos | number,
                         head?: number): TextSelection {

        if (TextNode.isNode(anchorOrNode)) {
            // When called with Node and numeric positions
            const doc: PmNode = anchorOrNode;
            const anchorPos = typeof anchorOrHead === 'number' ? anchorOrHead : 0;
            const headPos = isUndefinedOrNull(head) ? anchorPos : head;
            const $anchor: ResolvedPos = doc.resolve(anchorPos);
            const $head: ResolvedPos = doc.resolve(headPos);
            return new TextSelection($anchor, $head);
        }
        // When called with ResolvedPos arguments
        const $anchor: ResolvedPos = anchorOrNode;
        const $head: ResolvedPos = anchorOrHead as ResolvedPos ?? $anchor;
        return new TextSelection($anchor, $head);
    }
}
