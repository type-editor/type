/**
 * The `EditorSelection` class provides a unified interface for managing different types of selections in the editor,
 * such as text, node, and all selections. It acts as a wrapper around concrete selection implementations,
 * delegating operations to the appropriate selection handler. This class also offers static factory methods for
 * creating selection instances.
 *
 * This class implements the Facade pattern, providing a simplified interface to the various selection types
 * (TextSelection, NodeSelection, AllSelection) and their operations. It handles the complexity of selection
 * manipulation, mapping through document changes, and content replacement.
 *
 * Note: the state of the selection is set and updated as FieldDesc in EditorState (see method `setState`).
 */

import {isFalse, isUndefinedOrNull,} from '@type-editor/commons';
import type {
    Mappable, PmMapping,
    PmSelection,
    PmSelectionRange,
    PmTransaction,
    SelectionBookmark,
    SelectionJSON
} from '@type-editor/editor-types';
import {type Mark, type Node, type ResolvedPos, Slice} from '@type-editor/model';
import {ReplaceAroundStep, ReplaceStep, type Step, type StepMap} from '@type-editor/transform';

import {SelectionRange} from './SelectionRange';
import {SelectionTypeEnum} from './SelectionTypeEnum';

export interface JSONToSelectionDeserializer {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (...args: Array<any>): any
    fromJSON(doc: Node, json?: SelectionJSON): PmSelection;
}

/**
 * Superclass for editor selections. Every selection type should
 * extend this. Should not be instantiated directly.
 *
 * This abstract class provides the foundation for all selection types in the editor,
 * including text selections, node selections, and all-document selections.
 * It manages the selection's anchor, head, and ranges, along with methods to
 * query and manipulate the selection state.
 *
 * Note: made this class non-abstract due to issues with the compat module.
 */
export class Selection implements PmSelection {

    private static readonly JSON_DESERIALIZERS = new Map<string, JSONToSelectionDeserializer>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static TextSelectionHandler: (...param: Array<any>) => PmSelection;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static NodeSelectionHandler: (...param: Array<any>) => PmSelection;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static AllSelectionHandler: (...param: Array<any>) => PmSelection;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected static registerTextSelectionHandler(handler: (...param: Array<any>) => PmSelection): void {
        Selection.TextSelectionHandler = handler;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected static registerNodeSelectionHandler(handler: (...param: Array<any>) => PmSelection): void {
        Selection.NodeSelectionHandler = handler;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected static registerAllSelectionHandler(handler: (...param: Array<any>) => PmSelection): void {
        Selection.AllSelectionHandler = handler;
    }

    public static jsonID(jsonId: string, jsonDeserializerClass: JSONToSelectionDeserializer): void {
        Selection.registerJsonDeserializerClass(jsonId, jsonDeserializerClass);
    }

    public static registerJsonDeserializerClass(jsonId: string, jsonDeserializerClass: JSONToSelectionDeserializer): void {
        Selection.JSON_DESERIALIZERS.set(jsonId, jsonDeserializerClass);
    }


    /**
     * The array of selection ranges covered by this selection.
     * Most selections have a single range, but some may span multiple ranges.
     * @protected
     */
    protected readonly selectionRanges: ReadonlyArray<PmSelectionRange>;

    /**
     * The resolved position of the selection's anchor (the immobile end).
     * @protected
     */
    protected readonly anchorPos: ResolvedPos;

    /**
     * The resolved position of the selection's head (the mobile end).
     * @protected
     */
    protected readonly headPos: ResolvedPos;

    /**
     * Controls whether the selection should be visible in the browser.
     * Some selection types (like node selections) may be invisible.
     * @protected
     */
    protected isVisible = true;

    /**
     * Initialize a selection with the head and anchor and ranges. If no
     * ranges are given, constructs a single range across `$anchor` and
     * `$head`.
     *
     * @param $anchor The resolved anchor of the selection (the side that stays in
     * place when the selection is modified).
     * @param $head The resolved head of the selection (the side that moves when
     * the selection is modified).
     * @param ranges Optional array of selection ranges. If not provided, a single
     * range spanning from min to max of anchor and head will be created.
     * @protected
     */
    public constructor($anchor: ResolvedPos, $head: ResolvedPos, ranges?: ReadonlyArray<PmSelectionRange>) {
        this.anchorPos = $anchor;
        this.headPos = $head;
        this.selectionRanges = ranges ?? [new SelectionRange($anchor.min($head), $anchor.max($head))];
    }

    /**
     * The type identifier for this selection.
     *
     * @returns Always returns SelectionType.ALL
     */
    get type(): string {
        return SelectionTypeEnum.BASE;
    }

    /**
     * The cursor position if this is an empty text selection, null otherwise
     */
    get $cursor(): ResolvedPos | null {
        return null;
    }

    /**
     * The selected node if this is a node selection, null otherwise
     */
    get node(): Node | null {
        return null;
    }

    /**
     * The ranges covered by the selection.
     * For most selections, this will be a single range. Multiple ranges
     * are used for selections that span non-contiguous parts of the document.
     *
     * @returns A readonly array of selection ranges
     */
    get ranges(): ReadonlyArray<SelectionRange> {
        return this.selectionRanges as ReadonlyArray<SelectionRange>;
    }

    /**
     * The resolved anchor position of the selection.
     * The anchor is the immobile end of the selection - it stays in place
     * when the user extends the selection by moving the head.
     *
     * @returns The resolved anchor position
     */
    get $anchor(): ResolvedPos {
        return this.anchorPos;
    }

    /**
     * The resolved head position of the selection.
     * The head is the mobile end of the selection - it moves when
     * the user extends or modifies the selection.
     *
     * @returns The resolved head position
     */
    get $head(): ResolvedPos {
        return this.headPos;
    }

    /**
     * The selection's anchor, as an unresolved position.
     * This is the integer position in the document where the anchor is located.
     * The anchor is the immobile end of the selection.
     *
     * @returns The anchor position as a number
     */
    get anchor(): number {
        return this.anchorPos.pos;
    }

    /**
     * The selection's head, as an unresolved position.
     * This is the integer position in the document where the head is located.
     * The head is the mobile end of the selection that moves when extending it.
     *
     * @returns The head position as a number
     */
    get head(): number {
        return this.headPos.pos;
    }

    /**
     * The lower bound of the selection's main range.
     * This is always the smaller position value, regardless of which end is
     * the anchor or head. For a cursor selection, this equals `to`.
     *
     * @returns The starting position of the selection
     */
    get from(): number {
        return this.$from.pos;
    }

    /**
     * The upper bound of the selection's main range.
     * This is always the larger position value, regardless of which end is
     * the anchor or head. For a cursor selection, this equals `from`.
     *
     * @returns The ending position of the selection
     */
    get to(): number {
        return this.$to.pos;
    }

    /**
     * The resolved lower bound of the selection's main range.
     * This provides access to the document structure at the start of the selection,
     * allowing you to query the context and perform position-based operations.
     *
     * @returns The resolved starting position
     * @throws {Error} If the selection has no ranges
     */
    get $from(): ResolvedPos {
        if (this.selectionRanges.length === 0) {
            throw new Error('Selection has no ranges');
        }
        return this.selectionRanges[0].$from;
    }

    /**
     * The resolved upper bound of the selection's main range.
     * This provides access to the document structure at the end of the selection,
     * allowing you to query the context and perform position-based operations.
     *
     * @returns The resolved ending position
     * @throws {Error} If the selection has no ranges
     */
    get $to(): ResolvedPos {
        if (this.selectionRanges.length === 0) {
            throw new Error('Selection has no ranges');
        }
        return this.selectionRanges[0].$to;
    }

    /**
     * Indicates whether the selection contains any content.
     * A selection is empty when all its ranges have identical from and to positions,
     * which typically represents a cursor position rather than a content selection.
     *
     * @returns True if the selection is empty (cursor), false if it spans content
     */
    get empty(): boolean {
        return !this.selectionRanges.some(range => range.$from.pos !== range.$to.pos);
    }

    /**
     * Controls whether the selection should be visible to the user in the browser.
     * Most selections are visible (highlighted), but some selection types like
     * node selections may choose to be invisible.
     *
     * @returns True if the selection should be visible, false otherwise
     */
    get visible(): boolean {
        return this.isVisible;
    }

    /**
     * Sets whether the selection should be visible to the user in the browser.
     *
     * @param isVisible True to make the selection visible, false to hide it
     */
    set visible(isVisible: boolean) {
        this.isVisible = isVisible;
    }




    /**
     * Find a valid cursor or leaf node selection near the given position.
     * Searches in the direction specified by `bias` first, then tries the
     * opposite direction if nothing is found. Falls back to an all-selection
     * if no valid position exists.
     *
     * This is useful for finding a valid selection position after document
     * changes that may have invalidated the previous selection.
     *
     * @param $pos The resolved position to search from
     * @param bias The search direction bias: 1 for forward (default), -1 for backward
     * @returns A valid selection near the given position, or an all-selection
     */
    public static near($pos: ResolvedPos, bias = 1): Selection {
        return this.findFrom($pos, bias)
            || this.findFrom($pos, -bias)
            || Selection.AllSelectionHandler($pos.node(0)) as Selection;
    }

    /**
     * Find the cursor or leaf node selection closest to the start of
     * the given document. Will return an AllSelection if no valid
     * position exists.
     *
     * This is commonly used to position the cursor at the beginning
     * of a document.
     *
     * @param doc The document node to find a selection in
     * @returns A selection at the start of the document
     */
    public static atStart(doc: Node): Selection {
        return Selection.findSelectionIn(doc, doc, 0, 0, 1)
            || Selection.AllSelectionHandler(doc) as Selection;
    }

    /**
     * Find the cursor or leaf node selection closest to the end of the
     * given document. Will return an AllSelection if no valid position
     * exists.
     *
     * This is commonly used to position the cursor at the end of a document.
     *
     * @param doc The document node to find a selection in
     * @returns A selection at the end of the document
     */
    public static atEnd(doc: Node): Selection {
        return Selection.findSelectionIn(doc, doc, doc.content.size, doc.childCount, -1)
            || Selection.AllSelectionHandler(doc) as Selection;
    }

    /**
     * Find a valid cursor or leaf node selection starting at the given
     * position and searching in the specified direction. When `textOnly`
     * is true, only consider cursor selections (no node selections).
     * Will return null when no valid selection position is found.
     *
     * This method searches both within the current parent node and up
     * the document tree to find a valid selection position.
     *
     * @param $pos The resolved position to start searching from
     * @param dir The search direction: negative for backward, positive for forward
     * @param textOnly If true, only return text/cursor selections (default: false)
     * @returns A valid selection, or null if none found
     */
    public static findFrom($pos: ResolvedPos,
                           dir: number,
                           textOnly = false): Selection | null {
        const inner: PmSelection = Selection.findSelectionIn(
            $pos.node(0), $pos.parent, $pos.pos, $pos.index(), dir, textOnly
        );

        if (inner) {
            return inner as Selection;
        }

        for (let depth = $pos.depth - 1; depth >= 0; depth--) {
            const found: PmSelection = dir < 0
                ? Selection.findSelectionIn($pos.node(0), $pos.node(depth), $pos.before(depth + 1), $pos.index(depth), dir, textOnly)
                : Selection.findSelectionIn($pos.node(0), $pos.node(depth), $pos.after(depth + 1), $pos.index(depth) + 1, dir, textOnly);
            if (found) {
                return found as Selection;
            }
        }
        return null;
    }

    /**
     * Determines whether the given node may be selected as a node selection.
     * A node is selectable if it's not a text node and its type specification
     * has not explicitly set `selectable` to false.
     *
     * @param node The node to check for selectability
     * @returns True if the node can be selected as a node selection, false otherwise
     */
    public static isNodeSelectable(node: Node): boolean {
        return !node.isText && !isFalse(node.type.spec.selectable);
    }

    /**
     * Deserialize the JSON representation of a selection.
     * This factory method delegates to the appropriate selection type's
     * fromJSON method based on the type field in the JSON.
     *
     * @param doc The document node in which to create the selection
     * @param json The JSON representation of the selection, must include a 'type' field
     * @returns A new EditorSelection instance of the appropriate type
     * @throws {RangeError} If the JSON is invalid or contains an unknown selection type
     */
    public static fromJSON(doc: Node, json: SelectionJSON): Selection {
        if (!json?.type) {
            throw new RangeError('Invalid input for Selection.fromJSON');
        }

        const type: string = json.type;
        const jsonDeserializerClass: JSONToSelectionDeserializer = Selection.JSON_DESERIALIZERS.get(type);
        if(jsonDeserializerClass) {
            return jsonDeserializerClass.fromJSON(doc, json) as Selection;
        } else {
            throw new RangeError(`No selection type ${json.type} defined`);
        }
    }

    public static between($anchor: ResolvedPos, $head: ResolvedPos, bias?: number): Selection {
        return Selection.textSelectionBetween($anchor, $head, bias);
    }

    /**
     * Return a text selection that spans the given positions or, if
     * they aren't text positions, find a text selection near them.
     * `bias` determines whether the method searches forward (default)
     * or backwards (negative number) first. Will fall back to calling
     * `Selection.near` when the document doesn't contain a valid text position.
     *
     * This method ensures that both anchor and head are positioned in inline
     * content, adjusting them if necessary while maintaining the intended
     * selection direction.
     *
     * @param $anchor The desired anchor position (may be adjusted if not in inline content)
     * @param $head The desired head position (may be adjusted if not in inline content)
     * @param bias Optional search direction bias: positive for forward, negative for backward
     * @returns A text selection between valid positions
     */
    public static textSelectionBetween($anchor: ResolvedPos, $head: ResolvedPos, bias?: number): Selection {
        const dPos: number = $anchor.pos - $head.pos;
        if (!bias || dPos) {
            bias = dPos >= 0 ? 1 : -1;
        }

        if (!$head.parent.inlineContent) {
            const found: PmSelection = Selection.findFrom($head, bias, true) || Selection.findFrom($head, -bias, true);
            if (found) {
                $head = found.$head;
            } else {
                return Selection.near($head, bias);
            }
        }

        if (!$anchor.parent.inlineContent) {
            if (dPos === 0) {
                $anchor = $head;
            } else {
                const foundAnchor = Selection.findFrom($anchor, -bias, true) || Selection.findFrom($anchor, bias, true);
                if (foundAnchor) {
                    $anchor = foundAnchor.$anchor;
                    if (($anchor.pos < $head.pos) !== (dPos < 0)) {
                        $anchor = $head;
                    }
                } else {
                    // Fallback: if no valid position found, use head
                    $anchor = $head;
                }
            }
        }
        return Selection.TextSelectionHandler($anchor, $head) as Selection;
    }

    /**
     * Try to find a selection inside the given node. `pos` points at the
     * position where the search starts. When `text` is true, only return
     * text selections.
     *
     * This method recursively searches through the document structure to find
     * a valid selection position, handling both inline content (text) and
     * block-level selectable nodes.
     *
     * @param doc The root document node
     * @param node The node to search within
     * @param pos The position to start searching from
     * @param index The child index within the node to start from
     * @param direction The search direction: 1 for forward (LTR), -1 for backward (RTL)
     * @param text If true, only return text selections (default: false)
     * @returns A valid selection, or null if none found
     * @private
     */
    // TODO: FIXME we'll need some awareness of text direction when scanning for selections
    private static findSelectionIn(doc: Node,
                                   node: Node,
                                   pos: number,
                                   index: number,
                                   direction: number,
                                   text = false): Selection | null {
        if (node.inlineContent) {
            return Selection.TextSelectionHandler(doc, pos) as Selection;
        }

        const isRtl = direction === -1;

        if (isRtl) {
            return this.scanBackward(doc, node, pos, index, direction, text);
        }
        // Ltr
        return this.scanForward(doc, node, pos, index, direction, text);
    }

    /**
     * Scan backwards (right-to-left) through a node's children to find a valid selection.
     * This helper method searches from the given index backwards through the parent node's
     * children, recursing into non-atomic nodes and selecting atomic selectable nodes.
     *
     * @param doc The root document node
     * @param node The parent node whose children to scan
     * @param pos The current position in the document
     * @param index The child index to start scanning from
     * @param direction The search direction (should be -1 for backward)
     * @param text If true, only return text selections
     * @returns A valid selection, or null if none found
     * @private
     */
    private static scanBackward(doc: Node, node: Node, pos: number, index: number,
                                direction: number, text: boolean): Selection | null {
        for (let i = index - 1; i >= 0; i--) {
            const child: Node = node.child(i);
            if (!child.isAtom) {
                const inner: PmSelection = Selection.findSelectionIn(doc, child, pos - 1, child.childCount, direction, text);
                if (inner) {
                    return inner as Selection;
                }
            } else if (!text && Selection.isNodeSelectable(child)) {
                return Selection.NodeSelectionHandler(doc, pos - child.nodeSize) as Selection;
            }
            pos -= child.nodeSize;
        }
        return null;
    }

    /**
     * Scan forward (left-to-right) through a node's children to find a valid selection.
     * This helper method searches from the given index forward through the parent node's
     * children, recursing into non-atomic nodes and selecting atomic selectable nodes.
     *
     * @param doc The root document node
     * @param node The parent node whose children to scan
     * @param pos The current position in the document
     * @param index The child index to start scanning from
     * @param direction The search direction (should be 1 for forward)
     * @param text If true, only return text selections
     * @returns A valid selection, or null if none found
     * @private
     */
    private static scanForward(doc: Node, node: Node, pos: number, index: number,
                               direction: number, text: boolean): Selection | null {
        for (let i = index; i < node.childCount; i++) {
            const child: Node = node.child(i);
            if (!child.isAtom) {
                const inner: PmSelection = Selection.findSelectionIn(doc, child, pos + 1, 0, direction, text);
                if (inner) {
                    return inner as Selection;
                }
            } else if (!text && Selection.isNodeSelectable(child)) {
                return Selection.NodeSelectionHandler(doc, pos) as Selection;
            }
            pos += child.nodeSize;
        }

        return null;
    }

    /**
     * Check if this is a text selection.
     *
     * @returns True if this is a TextSelection instance
     */
    public isTextSelection(): boolean {
        return this.type === SelectionTypeEnum.TEXT.valueOf();
    }

    /**
     * Check if this is a node selection.
     *
     * @returns True if this is a NodeSelection instance
     */
    public isNodeSelection(): boolean {
        return this.type === SelectionTypeEnum.NODE.valueOf();
    }

    /**
     * Check if this is an all selection.
     *
     * @returns True if this is an AllSelection instance
     */
    public isAllSelection(): boolean {
        return this.type === SelectionTypeEnum.ALL.valueOf();
    }

    /**
     * Get the content of this selection as a slice.
     * This extracts the document fragment that falls within the selection's range,
     * preserving the structure and allowing it to be inserted elsewhere.
     *
     * @returns A slice containing the selected content
     */
    public content(): Slice {
        return this.$from.doc.slice(this.from, this.to, true);
    }

    /**
     * Test whether this selection is equal to another selection.
     * Selections are equal if they have the same type and positions.
     *
     * @param _selection The selection to compare with
     * @returns True if the selections are equal, false otherwise
     */
    public eq(_selection: PmSelection): boolean {
        return false;
    }

    /**
     * Create a bookmark for this selection.
     * The bookmark stores the selection's position information and can be used
     * to restore the selection after document changes by mapping through those changes.
     *
     * @returns A bookmark that can recreate this selection
     */
    public getBookmark(): SelectionBookmark | null {
        return null;
    }

    /**
     * Map this selection through a mappable transformation.
     * This updates the selection to reflect changes made to the document,
     * adjusting positions and potentially changing the selection type if
     * the mapped positions are no longer valid for the current type.
     *
     * For example, if a text selection's positions are mapped to non-inline
     * content, this will find a nearby valid selection instead.
     *
     * @param doc The new document after the transformation
     * @param mapping The mappable transformation (e.g., from a transaction)
     * @returns A new selection mapped to the new document
     */
    public map(doc: Node, mapping: Mappable): Selection {
        if (this.type === SelectionTypeEnum.TEXT.valueOf()) {
            const $head: ResolvedPos = doc.resolve(mapping.map(this.head));

            if (!$head.parent.inlineContent) {
                // text or node or all selection
                return Selection.near($head);
            }
            const $anchor: ResolvedPos = doc.resolve(mapping.map(this.anchor));
            // text selection
            return Selection.TextSelectionHandler($anchor.parent.inlineContent ? $anchor : $head, $head) as Selection;
        } else if (this.type === SelectionTypeEnum.NODE.valueOf()) {
            const {deleted, pos} = mapping.mapResult(this.anchor);
            const $pos: ResolvedPos = doc.resolve(pos);
            if (deleted) {
                // text or node or all selection
                return Selection.near($pos);
            }
            // node selection
            return Selection.NodeSelectionHandler($pos) as Selection;
        }
        // all selection
        return Selection.AllSelectionHandler(doc) as Selection;
    }

    /**
     * Replace the selection with a slice or, if no slice is given,
     * delete the selection. Will append to the given transaction.
     *
     * @param transaction
     * @param content
     */
    public replace(transaction: PmTransaction , content: Slice = Slice.empty): void {
        // All selection only
        if (this.type === SelectionTypeEnum.ALL.valueOf() && content === Slice.empty) {
            this.replaceSelectionAll(transaction);
            return;
        }

        // Default behavior for text and node selections
        const bias: number = this.getInsertionBias(content);
        this.replaceRanges(transaction, content, bias);

        // Text selection only
        if (this.type === SelectionTypeEnum.TEXT.valueOf() && content === Slice.empty) {
            this.preserveMarksTextSelection(transaction);
        }
    }

    /**
     * Determine the bias direction for positioning cursor after insertion.
     * The bias determines whether to search backwards or forwards for a valid
     * cursor position after content is inserted.
     *
     * Returns -1 for inline content (search backwards), 1 for block content (search forward).
     * This ensures the cursor ends up in an appropriate position based on what was inserted.
     *
     * @param content The slice being inserted
     * @returns -1 to search backwards, 1 to search forwards
     * @private
     */
    private getInsertionBias(content: Slice): number {
        let lastNode: Node | null = content.content.lastChild;
        if (!lastNode) {
            return 1; // Default to forward search for empty content
        }

        let lastParent: Node | null = null;
        for (let i = 0; i < content.openEnd; i++) {
            lastParent = lastNode;
            lastNode = lastNode.lastChild;
            if (!lastNode) {
                break; // Exit if we reach a node without children
            }
        }
        return (lastNode ? lastNode.isInline : lastParent?.isTextblock) ? -1 : 1;
    }

    /**
     * Replace all ranges in the selection with the given content.
     * For multi-range selections, only the first range receives the content;
     * subsequent ranges are deleted. The selection is then positioned at the
     * end of the insertion.
     *
     * @param transaction The transaction to append the replacements to
     * @param content The content to insert (or Slice.empty to delete)
     * @param bias The direction to search for the new cursor position
     * @private
     */
    private replaceRanges(transaction: PmTransaction, content: Slice, bias: number): void {
        const mapFrom: number = transaction.steps.length;
        const ranges: ReadonlyArray<PmSelectionRange> = this.ranges;

        for (let i = 0; i < ranges.length; i++) {
            const {$from, $to} = ranges[i];
            const mapping: PmMapping = transaction.mapping.slice(mapFrom);
            transaction.replaceRange(mapping.map($from.pos), mapping.map($to.pos), i ? Slice.empty : content);
            if (i === 0) {
                this.selectionToInsertionEnd(transaction, mapFrom, bias);
            }
        }
    }

    /**
     * Replace the selection with the given node, appending the changes
     * to the given transaction.
     *
     * For multi-range selections, the first range is replaced with the node,
     * and subsequent ranges are deleted. The selection is then positioned
     * after the inserted node.
     *
     * @param transaction The transaction to append the replacement to
     * @param node The node to insert in place of the selection
     */
    public replaceWith(transaction: PmTransaction, node: Node): void {
        const mapFrom: number = transaction.steps.length;
        const ranges: ReadonlyArray<PmSelectionRange> = this.ranges;

        for (let i = 0; i < ranges.length; i++) {
            const {$from, $to} = ranges[i];
            const mapping: PmMapping = transaction.mapping.slice(mapFrom);
            const from: number = mapping.map($from.pos);
            const to: number = mapping.map($to.pos);

            if (i) {
                transaction.deleteRange(from, to);
            } else {
                transaction.replaceRangeWith(from, to, node);
                this.selectionToInsertionEnd(transaction, mapFrom, node.isInline ? -1 : 1);
            }
        }
    }

    /**
     * Convert this selection to a JSON-serializable representation.
     * The JSON includes the selection type and position information.
     *
     * @returns A JSON object representing this selection
     */
    public toJSON(): SelectionJSON {
        return { type: this.type  };
    }


    /**
     * Handle deletion of an all-selection by deleting all document content
     * and positioning the selection at the start of the (now empty) document.
     *
     * @param transaction The transaction to append the deletion to
     * @private
     */
    private replaceSelectionAll(transaction: PmTransaction): void {
        transaction.delete(0, transaction.doc.content.size);
        const selection: PmSelection = Selection.atStart(transaction.doc);
        if (!selection.eq(transaction.selection)) {
            transaction.setSelection(selection);
        }
    }

    /**
     * Preserve marks from a deleted text selection by ensuring they're
     * set as stored marks on the transaction. This allows marks to persist
     * across the deletion for the next insertion.
     *
     * @param transaction The transaction to set stored marks on
     * @private
     */
    private preserveMarksTextSelection(transaction: PmTransaction): void {
        const marks: ReadonlyArray<Mark> = this.$from.marksAcross(this.$to);
        if (marks?.length) {
            transaction.ensureMarks(marks);
        }
    }

    /**
     * Position the selection at the end of the most recent insertion.
     * This is called after content is inserted to place the cursor in an
     * appropriate position based on what was inserted.
     *
     * @param transaction The transaction containing the insertion
     * @param startLen The number of steps before the insertion
     * @param bias The direction to search for a valid position: -1 for backwards, 1 for forwards
     * @private
     */
    private selectionToInsertionEnd(transaction: PmTransaction, startLen: number, bias: number): void {
        const last: number = transaction.steps.length - 1;
        if (last < startLen) {
            return;
        }

        const step: Step = transaction.steps[last] as Step;
        if (!(step instanceof ReplaceStep || step instanceof ReplaceAroundStep)) {
            return;
        }

        const map: StepMap = transaction.mapping.maps[last] as StepMap;
        let end: number | undefined;
        map.forEach((_from: number, _to: number, _newFrom: number, newTo: number): void => {
            if (isUndefinedOrNull(end)) {
                end = newTo;
            }
        });
        transaction.setSelection(Selection.near(transaction.doc.resolve(end), bias));
    }
}
