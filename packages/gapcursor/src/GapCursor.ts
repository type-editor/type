import {isTrue, isUndefinedOrNull} from '@type-editor/commons';
import type {Mappable, PmSelection, SelectionBookmark, SelectionJSON} from '@type-editor/editor-types';
import { type NodeType, type PmNode, type ResolvedPos, Slice } from '@type-editor/model';
import {Selection} from '@type-editor/state';

/**
 * Represents the direction of movement through the document tree.
 */
const enum Direction {

    /** Moving backward through the document (negative direction) */
    BACKWARD = -1,

    /** Moving forward through the document (positive direction) */
    FORWARD = 1
}

/**
 * Result type for scanning down into a node tree while searching for gap cursor positions.
 */
interface ScanDownResult {

    /** The valid gap cursor position if found, null otherwise */
    readonly validPosition: ResolvedPos | null;

    /** Whether a non-selectable atom was encountered that should be skipped */
    readonly shouldSkipAtom: boolean;

    /** The next position to continue searching from if skipping an atom */
    readonly nextPosition?: ResolvedPos;
}


/**
 * Represents a gap cursor selection - a cursor positioned between block nodes
 * where regular text selection is not possible.
 *
 * Gap cursors are used in positions where the document structure doesn't allow
 * normal text cursors, such as between two adjacent block nodes (e.g., between
 * two code blocks or between a heading and an image).
 *
 * Both `$anchor` and `$head` properties point at the same cursor position since
 * gap cursors don't represent a range but a single point between nodes.
 *
 * @example
 * // A gap cursor between two paragraphs:
 * // <p>First paragraph</p>
 * // [gap cursor here]
 * // <p>Second paragraph</p>
 */
export class GapCursor extends Selection implements PmSelection {

    private static readonly TYPE_GAP_CURSOR: string = 'gapcursor';

    /**
     * Creates a new gap cursor at the given position.
     *
     * @param $pos The resolved position where the gap cursor should be placed.
     *             Both anchor and head will be set to this position.
     */
    constructor($pos: ResolvedPos) {
        super($pos, $pos);
        super.visible = false;
    }

    get type(): string {
        return GapCursor.TYPE_GAP_CURSOR;
    }

    /**
     * Deserializes a gap cursor from its JSON representation.
     *
     * @param doc The document to resolve the position in.
     * @param json The serialized gap cursor data containing the position.
     * @returns A new GapCursor instance at the deserialized position.
     * @throws {RangeError} If the JSON doesn't contain a valid numeric position.
     */
    public static fromJSON(doc: PmNode, json: SelectionJSON): GapCursor {
        if (typeof json.pos !== 'number') {
            throw new RangeError('Invalid input for GapCursor.fromJSON');
        }
        return new GapCursor(doc.resolve(json.pos));
    }

    /**
     * Checks whether a gap cursor is valid at the given position.
     *
     * A gap cursor is valid when:
     * 1. The parent is not a text block (gap cursors can't exist within text)
     * 2. There's a "closed" node before the position (block or atom node)
     * 3. There's a "closed" node after the position (block or atom node)
     * 4. The parent allows gap cursors (via allowGapCursor spec or default content type)
     *
     * @param $pos The resolved position to check.
     * @returns True if a gap cursor can be placed at this position, false otherwise.
     */
    public static valid($pos: ResolvedPos): boolean {
        const parent: PmNode = $pos.parent;

        // Gap cursors cannot exist in text blocks or at positions that aren't
        // surrounded by "closed" (non-inline) content
        if (parent.isTextblock || !GapCursor.closedBefore($pos) || !GapCursor.closedAfter($pos)) {
            return false;
        }

        // Check if the parent node explicitly allows/disallows gap cursors
        const override: unknown = parent.type.spec.allowGapCursor;
        if (!isUndefinedOrNull(override)) {
            return isTrue(override);
        }

        // Default behavior: allow gap cursor if the default content type is a text block
        const defaultType: NodeType | null | undefined = parent.contentMatchAt($pos.index()).defaultType;
        return defaultType?.isTextblock ?? false;
    }

    /**
     * Searches for a valid gap cursor position starting from the given position.
     *
     * This method performs a depth-first search through the document tree to find
     * the nearest valid gap cursor position in the specified direction. It first
     * scans up through ancestor nodes, then down into sibling nodes, checking each
     * position for gap cursor validity.
     *
     * The algorithm works in two phases:
     * 1. **Scan up**: Traverse up the tree to find a sibling node, checking positions along the way
     * 2. **Scan down**: Traverse down into the sibling node to find valid gap positions
     *
     * @param $pos The starting resolved position for the search.
     * @param dir The search direction: positive values move forward, negative values move backward.
     * @param mustMove If true, the search will not return the starting position even if valid.
     *                 Defaults to false.
     * @returns The resolved position of a valid gap cursor, or null if none is found.
     *
     * @example
     * // Find the next gap cursor position moving forward
     * const nextGap = GapCursor.findGapCursorFrom($currentPos, 1, true);
     */
    public static findGapCursorFrom($pos: ResolvedPos, dir: number, mustMove = false): ResolvedPos | null {
        const direction: Direction = dir > 0 ? Direction.FORWARD : Direction.BACKWARD;
        let currentSearchPos: ResolvedPos = $pos;
        let skipValidityCheck: boolean = mustMove;

        // Continue searching until we find a valid position or reach a boundary
        while (true) {
            // Check if the current position is valid (unless we must move away from it)
            if (!skipValidityCheck && this.valid(currentSearchPos)) {
                return currentSearchPos;
            }

            // Try to find a valid position by scanning through the document tree
            const searchResult = this.searchForGapPosition(currentSearchPos, direction);

            if (searchResult.found) {
                return searchResult.position;
            }

            // If we found a non-selectable atom, skip over it and continue
            if (searchResult.shouldContinue && searchResult.nextSearchPos) {
                currentSearchPos = searchResult.nextSearchPos;
                skipValidityCheck = false;
                continue;
            }

            // No valid position found in any direction
            return null;
        }
    }

    /**
     * Searches for a gap cursor position in the document tree from the given position.
     *
     * This helper method encapsulates the two-phase search algorithm:
     * scanning up to find siblings and scanning down into those siblings.
     *
     * @param $pos The current resolved position to search from.
     * @param direction The direction to search in (forward or backward).
     * @returns An object describing whether a valid position was found and how to continue.
     */
    private static searchForGapPosition($pos: ResolvedPos,
                                        direction: Direction): {
        found: boolean;
        position: ResolvedPos | null;
        shouldContinue: boolean;
        nextSearchPos?: ResolvedPos
    } {
        const isForward: boolean = direction === Direction.FORWARD;

        // Phase 1: Scan up through ancestor nodes to find a sibling
        const siblingNode: PmNode = this.findSiblingNode($pos, isForward);

        if (isUndefinedOrNull(siblingNode)) {
            // Reached document boundary
            return {found: false, position: null, shouldContinue: false};
        }

        // Check positions encountered while scanning up the tree
        const validPosWhileScanningUp: ResolvedPos = this.checkPositionsWhileScanningUp($pos, isForward);

        if (validPosWhileScanningUp !== null) {
            return {found: true, position: validPosWhileScanningUp, shouldContinue: false};
        }

        // Calculate the position at the boundary of the sibling node
        const siblingBoundaryPos: number = this.calculateSiblingBoundaryPosition($pos, isForward);

        // Phase 2: Scan down into the sibling node tree
        const scanResult: ScanDownResult = this.scanDownIntoNode(siblingNode, siblingBoundaryPos, $pos.doc, isForward);

        if (scanResult.validPosition !== null) {
            return {found: true, position: scanResult.validPosition, shouldContinue: false};
        }

        // Return information about whether to continue searching (e.g., skip atoms)
        return {
            found: false,
            position: null,
            shouldContinue: scanResult.shouldSkipAtom,
            nextSearchPos: scanResult.nextPosition
        };
    }

    /**
     * Finds the next sibling node in the specified direction by scanning up the tree.
     *
     * @param $pos The current resolved position.
     * @param isForward Whether to search forward (true) or backward (false).
     * @returns The next sibling node, or null if at document boundary.
     */
    private static findSiblingNode($pos: ResolvedPos, isForward: boolean): PmNode | null {
        for (let depth = $pos.depth; depth >= 0; depth--) {
            const parent: PmNode = $pos.node(depth);
            const hasNextSibling: boolean = isForward
                ? $pos.indexAfter(depth) < parent.childCount
                : $pos.index(depth) > 0;

            if (hasNextSibling) {
                const childIndex: number = isForward ? $pos.indexAfter(depth) : $pos.index(depth) - 1;
                return parent.child(childIndex);
            }

            if (depth === 0) {
                return null; // Reached document root
            }
        }
        return null;
    }

    /**
     * Calculates the position at the boundary of a sibling node.
     *
     * @param $pos The current resolved position.
     * @param isForward Whether moving forward (true) or backward (false).
     * @returns The position number at the sibling boundary.
     */
    private static calculateSiblingBoundaryPosition($pos: ResolvedPos, isForward: boolean): number {
        let pos: number = $pos.pos;
        const dir: number = isForward ? 1 : -1;

        for (let depth = $pos.depth; depth >= 0; depth--) {
            const parent: PmNode = $pos.node(depth);
            const hasNextSibling = isForward
                ? $pos.indexAfter(depth) < parent.childCount
                : $pos.index(depth) > 0;

            if (hasNextSibling) {
                break;
            }

            pos += dir;
        }

        return pos;
    }

    /**
     * Checks positions while scanning up through ancestors for valid gap cursor positions.
     *
     * @param $pos The current resolved position.
     * @param isForward Whether moving forward (true) or backward (false).
     * @returns A valid resolved position, or null if none found.
     */
    private static checkPositionsWhileScanningUp($pos: ResolvedPos, isForward: boolean): ResolvedPos | null {
        let pos: number = $pos.pos;
        const dir: number = isForward ? 1 : -1;

        for (let depth = $pos.depth; depth >= 0; depth--) {
            const parent: PmNode = $pos.node(depth);
            const hasNextSibling: boolean = isForward
                ? $pos.indexAfter(depth) < parent.childCount
                : $pos.index(depth) > 0;

            // Early exit: found a sibling at this level
            if (hasNextSibling) {
                return null;
            }

            // Don't check positions at depth 0 (document root)
            if (depth === 0) {
                return null;
            }

            pos += dir;
            const $current: ResolvedPos = $pos.doc.resolve(pos);
            if (this.valid($current)) {
                return $current;
            }
        }

        return null;
    }

    /**
     * Scans down into a node tree looking for valid gap cursor positions.
     *
     * This method traverses down through the node's children in the specified direction,
     * checking each position for gap cursor validity. If a non-selectable atom is
     * encountered, it returns information to skip over it.
     *
     * @param node The node to scan into.
     * @param startPos The starting position in the document.
     * @param doc The document being searched.
     * @param isForward Whether moving forward (true) or backward (false).
     * @returns A ScanDownResult containing the valid position if found, or instructions to skip atoms.
     */
    private static scanDownIntoNode(node: PmNode,
                                    startPos: number,
                                    doc: PmNode,
                                    isForward: boolean): ScanDownResult {
        let currentNode: PmNode = node;
        let currentPos: number = startPos;
        const direction: Direction = isForward ? Direction.FORWARD : Direction.BACKWARD;

        // Traverse down through the node tree in the specified direction
        while (true) {
            const childNode: PmNode = isForward ? currentNode.firstChild : currentNode.lastChild;

            if (!childNode) {
                // Leaf node reached - check if it's a non-selectable atom that should be skipped
                if (this.isNonSelectableAtom(currentNode)) {
                    const nextPosValue: number = currentPos + currentNode.nodeSize * direction;

                    // Bounds check: ensure position is within document bounds
                    if (nextPosValue >= 0 && nextPosValue <= doc.content.size) {
                        const nextPos: ResolvedPos = doc.resolve(nextPosValue);
                        return {validPosition: null, shouldSkipAtom: true, nextPosition: nextPos};
                    }
                }
                break;
            }

            currentNode = childNode;
            currentPos += direction;
            const $current: ResolvedPos = doc.resolve(currentPos);

            if (this.valid($current)) {
                return {validPosition: $current, shouldSkipAtom: false};
            }
        }

        return {validPosition: null, shouldSkipAtom: false};
    }

    /**
     * Checks if a node is a non-selectable atom.
     *
     * Non-selectable atoms are atomic nodes that can't have text and aren't
     * selectable on their own. These need to be skipped when searching for
     * gap cursor positions.
     *
     * @param node The node to check.
     * @returns True if the node is a non-selectable atom, false otherwise.
     */
    private static isNonSelectableAtom(node: PmNode): boolean {
        return node.isAtom && !node.isText && !Selection.isNodeSelectable(node);
    }

    /**
     * Checks if there is a "closed" (block-level or atom) node before the given position.
     *
     * A position has a closed node before it if there's a non-inline node (like a paragraph,
     * heading, or atom node) immediately preceding it. This is necessary for gap cursor
     * validity because gap cursors only make sense between block-level structures.
     *
     * The method traverses up through ancestor nodes and checks the preceding sibling at
     * each level. If an isolating node is encountered, it's considered closed. Otherwise,
     * it looks for leaf block nodes or nodes that explicitly need gaps.
     *
     * @param $pos The resolved position to check.
     * @returns True if there's a closed node before the position, false otherwise.
     */
    private static closedBefore($pos: ResolvedPos): boolean {
        return this.checkClosedSide($pos, false);
    }

    /**
     * Checks if there is a "closed" (block-level or atom) node after the given position.
     *
     * A position has a closed node after it if there's a non-inline node (like a paragraph,
     * heading, or atom node) immediately following it. This is the mirror of closedBefore
     * and is necessary for gap cursor validity.
     *
     * The method traverses up through ancestor nodes and checks the following sibling at
     * each level. If an isolating node is encountered, it's considered closed. Otherwise,
     * it looks for leaf block nodes or nodes that explicitly need gaps.
     *
     * @param $pos The resolved position to check.
     * @returns True if there's a closed node after the position, false otherwise.
     */
    private static closedAfter($pos: ResolvedPos): boolean {
        return this.checkClosedSide($pos, true);
    }

    /**
     * Generic method to check if there's a closed node on a specific side of a position.
     *
     * This consolidates the logic for checking both before and after positions,
     * reducing code duplication and improving maintainability.
     *
     * @param $pos The resolved position to check.
     * @param checkAfter If true, checks the node after the position; if false, checks before.
     * @returns True if there's a closed node on the specified side, false otherwise.
     */
    private static checkClosedSide($pos: ResolvedPos, checkAfter: boolean): boolean {
        // Traverse up through the document tree
        for (let depth = $pos.depth; depth >= 0; depth--) {

            const parentNode: PmNode = $pos.node(depth);
            const siblingIndex: number = checkAfter ? $pos.indexAfter(depth) : $pos.index(depth);
            const isAtBoundary: boolean = checkAfter
                ? siblingIndex === parentNode.childCount
                : siblingIndex === 0;

            // At the boundary of this parent, check if parent is isolating
            if (isAtBoundary) {
                if (parentNode.type.spec.isolating) {
                    return true; // Isolating nodes create boundaries for gap cursors
                }
                continue; // Check parent's parent
            }

            // Examine the node on the specified side
            const siblingNode: PmNode = checkAfter
                ? parentNode.child(siblingIndex)
                : parentNode.child(siblingIndex - 1);

            // Early exit: if inline content, no valid gap cursor
            if (siblingNode.inlineContent) {
                return false;
            }

            // Check if the sibling node is closed on the appropriate side
            if (this.isNodeClosedOnSide(siblingNode, checkAfter)) {
                return true;
            }
        }

        // Reached the start/end of the document - this is considered closed
        return true;
    }

    /**
     * Checks if a node is "closed" on a specific side, meaning it starts/ends with block content.
     *
     * This unified method replaces the separate isNodeClosedOnLeft and isNodeClosedOnRight methods,
     * reducing code duplication.
     *
     * @param node The node to check.
     * @param checkLeftSide If true, checks if the node is closed on the left (starts with block content);
     *                      if false, checks if it's closed on the right (ends with block content).
     * @returns True if the node is closed on the specified side, false otherwise.
     */
    private static isNodeClosedOnSide(node: PmNode, checkLeftSide: boolean): boolean {
        let currentNode: PmNode = node;

        // Traverse down to the appropriate leaf (leftmost or rightmost)
        while (currentNode) {
            // Check if this is a leaf block node or a node that needs a gap
            const isLeafBlock = currentNode.childCount === 0 && !currentNode.inlineContent;

            if (isLeafBlock || this.needsGap(currentNode.type)) {
                return true;
            }

            if (currentNode.inlineContent) {
                return false;
            }

            // Move to the appropriate child
            const nextChild: PmNode = checkLeftSide ? currentNode.firstChild : currentNode.lastChild;
            if (!nextChild) {
                break; // Safety check: no more children
            }

            currentNode = nextChild;
        }

        return false;
    }

    /**
     * Determines if a node type requires a gap cursor boundary.
     *
     * Node types that need gaps include:
     * - **Atom nodes**: Indivisible nodes like images, horizontal rules, or custom widgets
     * - **Isolating nodes**: Nodes that create content boundaries and don't allow content to flow through
     * - **Explicit gap nodes**: Nodes with the `createGapCursor` spec property set to true
     *
     * @param type The node type to check.
     * @returns True if the node type requires a gap cursor boundary, false otherwise.
     *
     * @example
     * // Check if a horizontal rule needs a gap cursor
     * const needsGap = GapCursor.needsGap(schema.nodes.horizontal_rule);
     */
    private static needsGap(type: NodeType): boolean {
        return type.isAtom || type.spec.isolating || isTrue(type.spec.createGapCursor);
    }

    /**
     * Maps this gap cursor through a document transformation.
     *
     * When the document is transformed (e.g., by insertions or deletions), this method
     * updates the gap cursor position to reflect the changes. If the mapped position is
     * no longer valid for a gap cursor, it returns the nearest valid selection instead.
     *
     * @param doc The document after the transformation.
     * @param mapping The mapping object describing the transformation.
     * @returns A new selection at the mapped position (gap cursor if valid, or nearest selection).
     */
    public map(doc: PmNode, mapping: Mappable): Selection {
        const $pos: ResolvedPos = doc.resolve(mapping.map(this.head));
        return GapCursor.valid($pos) ? new GapCursor($pos) : Selection.near($pos);
    }

    /**
     * Returns the content covered by this selection.
     *
     * Gap cursors don't contain any content since they represent a position
     * between nodes rather than a selection of content.
     *
     * @returns An empty slice.
     */
    public content(): Slice {
        return Slice.empty;
    }

    /**
     * Tests whether this gap cursor is equal to another selection.
     *
     * Two gap cursors are equal if they're both gap cursors at the same position.
     *
     * @param other The selection to compare with.
     * @returns True if both selections are gap cursors at the same position, false otherwise.
     */
    public eq(other: PmSelection): boolean {
        return other instanceof GapCursor && other.head === this.head;
    }

    /**
     * Serializes this gap cursor to a JSON representation.
     *
     * The JSON format includes the type identifier and the cursor position,
     * which can be used to recreate the gap cursor later via fromJSON.
     *
     * @returns A JSON object representing this gap cursor.
     */
    public toJSON(): SelectionJSON {
        return {type: 'gapcursor', pos: this.head};
    }

    /**
     * Creates a bookmark for this gap cursor.
     *
     * Bookmarks can be used to preserve cursor positions across document transformations.
     * They're more lightweight than selections and can be efficiently mapped through changes.
     *
     * @returns A GapBookmark that can recreate this gap cursor after document changes.
     */
    public getBookmark(): SelectionBookmark {
        return new GapBookmark(this.anchor);
    }

    /**
     * Replaces the content covered by this selection.
     *
     * Gap cursors represent a position between nodes rather than a content selection,
     * so this method is a no-op. To insert content at a gap cursor position, use
     * the transaction's `insert` method at the cursor's position instead.
     *
     * @example
     * // To insert content at a gap cursor:
     * // tr.insert(gapCursor.from, newNode);
     */
    public replace(): void {
        // No-op: Gap cursors don't select content
    }

    /**
     * Replaces the selection with a node.
     *
     * Gap cursors represent a position between nodes rather than a content selection,
     * so this method is a no-op. To insert a node at a gap cursor position, use
     * the transaction's `insert` method at the cursor's position instead.
     *
     * @example
     * // To insert a node at a gap cursor:
     * // tr.insert(gapCursor.from, nodeToInsert);
     */
    public replaceWith(): void {
        // No-op: Gap cursors don't select content
    }
}

/**
 * A bookmark for gap cursor positions.
 *
 * Bookmarks are lightweight representations of selection positions that can be
 * efficiently stored and mapped through document transformations. They're more
 * efficient than full selection objects for preserving positions across changes.
 *
 * This class stores a numeric position and can recreate a gap cursor (or the
 * nearest valid selection) when resolved against a document.
 *
 * **Use cases:**
 * - Preserving cursor positions during asynchronous operations
 * - Implementing undo/redo with cursor position restoration
 * - Storing cursor positions in serialized state
 *
 * @internal This class is typically not used directly but through the GapCursor.getBookmark method.
 *
 * @example
 * // Create and use a bookmark
 * const bookmark = gapCursor.getBookmark();
 * // ... perform transformations on the document ...
 * const mappedBookmark = bookmark.map(mapping);
 * const newSelection = mappedBookmark.resolve(newDoc);
 */
class GapBookmark implements SelectionBookmark {

    private readonly pos: number;

    /**
     * Creates a new gap cursor bookmark.
     *
     * Typically, you should use `GapCursor.getBookmark()` instead of constructing
     * this class directly.
     *
     * @param pos The numeric position in the document where the gap cursor is located.
     *            This is a raw document position, not a resolved position.
     */
    constructor(pos: number) {
        this.pos = pos;
    }

    /**
     * Maps this bookmark through a document transformation.
     *
     * When the document changes, this method updates the bookmark's position
     * to reflect insertions, deletions, or other structural changes. The mapping
     * is performed using the standard ProseMirror mapping algorithm.
     *
     * @param mapping The mapping object describing the document transformation.
     *                This typically comes from a transaction's mapping property.
     * @returns A new GapBookmark instance at the mapped position.
     *
     * @example
     * // Map a bookmark through a transaction
     * const newBookmark = bookmark.map(transaction.mapping);
     */
    public map(mapping: Mappable): SelectionBookmark {
        return new GapBookmark(mapping.map(this.pos));
    }

    /**
     * Resolves this bookmark to a selection in the given document.
     *
     * This method attempts to create a gap cursor at the bookmarked position.
     * If that position is no longer valid for a gap cursor (due to document
     * changes that altered the structure), it returns the nearest valid selection
     * instead, ensuring that a valid selection is always returned.
     *
     * @param doc The document to resolve the bookmark in. This should be the
     *            current state of the document after any transformations.
     * @returns A GapCursor at the bookmarked position if valid, or the nearest
     *          valid selection (text selection or node selection) otherwise.
     *
     * @example
     * // Resolve a bookmark to a selection
     * const selection = bookmark.resolve(editorState.doc);
     */
    public resolve(doc: PmNode): PmSelection {
        const $pos: ResolvedPos = doc.resolve(this.pos);
        return GapCursor.valid($pos) ? new GapCursor($pos) : Selection.near($pos);
    }
}




