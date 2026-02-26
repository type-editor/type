import {isUndefinedOrNull} from '@type-editor/commons';

import type {Schema} from '../schema/Schema';
import type {PmElement} from '../types/elements/PmElement';
import type {SliceJSON} from '../types/elements/SliceJSON';
import {ElementType} from './ElementType';
import {Fragment} from './Fragment';
import type {Node as PmNode} from './Node';


/**
 * A slice represents a piece cut out of a larger document. It
 * stores not only a fragment, but also the depth up to which nodes on
 * both side are 'open' (cut through).
 */
export class Slice implements PmElement {

    /**
     * Singleton instance of the empty slice, lazily initialized.
     * @private
     */
    private static INSTANCE: Slice | null = null;

    /**
     * The fragment containing the content of this slice.
     * @private
     */
    private readonly sliceContent: Fragment;

    /**
     * The number of parent nodes open (cut through) at the start of the slice.
     * @private
     */
    private readonly sliceOpenStart: number;

    /**
     * The number of parent nodes open (cut through) at the end of the slice.
     * @private
     */
    private readonly sliceOpenEnd: number;

    /**
     * Create a slice. When specifying a non-zero open depth, you must
     * make sure that there are nodes of at least that depth at the
     * appropriate side of the fragment—i.e. if the fragment is an
     * empty paragraph node, `openStart` and `openEnd` can't be greater
     * than 1.
     *
     * It is not necessary for the content of open nodes to conform to
     * the schema's content constraints, though it should be a valid
     * start/end/middle for such a node, depending on which sides are
     * open.
     *
     * @param content The slice's content.
     * @param openStart The open depth at the start of the fragment.
     * @param openEnd The open depth at the end.
     * @throws {RangeError} If openStart or openEnd are negative.
     */
    constructor(content: Fragment, openStart: number, openEnd: number) {
        if (openStart < 0 || openEnd < 0) {
            throw new RangeError(`Invalid open depths: openStart and openEnd must be non-negative (openStart=${openStart}, openEnd=${openEnd})`);
        }
        this.sliceContent = content;
        this.sliceOpenStart = openStart;
        this.sliceOpenEnd = openEnd;
    }

    get elementType(): ElementType {
        return ElementType.Slice;
    }

    /**
     * Type guard to check if a value is a Slice.
     *
     * @param value The value to check for Slice type.
     * @returns True if the value is a Slice instance (elementType is 'Slice').
     * @private
     */
    public static isSlice(value: unknown): value is Slice {
        return !isUndefinedOrNull(value)
            && typeof value === 'object'
            && 'elementType' in value
            && (value.elementType === ElementType.Slice);
    }

    /**
     * Returns the singleton empty slice instance.
     * An empty slice has no content and zero open depths on both sides.
     *
     * @returns A shared empty Slice instance.
     */
    public static get empty(): Slice {
        if (!Slice.INSTANCE) {
            Slice.INSTANCE = new Slice(Fragment.empty, 0, 0);
        }
        return Slice.INSTANCE;
    }

    /**
     * The fragment containing the slice's content.
     */
    get content(): Fragment {
        return this.sliceContent;
    }

    /**
     * The open depth at the start of the slice.
     * Indicates how many parent nodes are open (cut through) at the beginning.
     */
    get openStart(): number {
        return this.sliceOpenStart;
    }

    /**
     * The open depth at the end of the slice.
     * Indicates how many parent nodes are open (cut through) at the end.
     */
    get openEnd(): number {
        return this.sliceOpenEnd;
    }

    /**
     * The size this slice would add when inserted into a document.
     * This is calculated as the content size minus the open depths on both sides,
     * since open nodes don't add to the insertion size.
     *
     * @returns The effective size of the slice for insertion purposes.
     */
    get size(): number {
        return this.sliceContent.size - this.sliceOpenStart - this.sliceOpenEnd;
    }

    /**
     * Deserialize a slice from its JSON representation.
     *
     * @param schema The schema to use for deserializing the content.
     * @param json The JSON representation of the slice.
     * @returns A new Slice instance or the empty slice if json is null/undefined.
     */
    public static fromJSON(schema: Schema, json: SliceJSON): Slice {
        if (!json) {
            return Slice.empty;
        }

        const openStart: number = json.openStart ?? 0;
        const openEnd: number = json.openEnd ?? 0;

        if (typeof openStart !== 'number' || typeof openEnd !== 'number') {
            throw new RangeError(`Invalid input for Slice.fromJSON: openStart and openEnd must be numbers, got ${typeof openStart} and ${typeof openEnd}`);
        }
        return new Slice(Fragment.fromJSON(schema, json.content), openStart, openEnd);
    }

    /**
     * Create a slice from a fragment by taking the maximum possible
     * open value on both sides of the fragment. This traverses down
     * the first and last children to determine how many levels can be
     * opened.
     *
     * @param fragment The fragment to create a slice from.
     * @param openIsolating Whether to open through isolating nodes. Defaults to true.
     * @returns A new Slice with maximum possible open depths.
     */
    public static maxOpen(fragment: Fragment, openIsolating = true): Slice {
        const openStart: number = this.calculateMaxOpenDepth(fragment.firstChild, openIsolating);
        const openEnd: number = this.calculateMaxOpenDepth(fragment.lastChild, openIsolating);

        return new Slice(fragment, openStart, openEnd);
    }

    /**
     * Calculate the maximum depth that can be opened from a starting node.
     *
     * @param startNode The node to start from.
     * @param openIsolating Whether to open through isolating nodes.
     * @returns The maximum open depth.
     */
    private static calculateMaxOpenDepth(startNode: PmNode | null, openIsolating: boolean): number {
        let depth = 0;
        let node: PmNode | null = startNode;

        while (node && !node.isLeaf && (openIsolating || !node.type.spec.isolating)) {
            depth++;
            node = node.firstChild;
        }

        return depth;
    }

    /**
     * Insert a fragment at a specific position within this slice.
     *
     * @param pos The position at which to insert the fragment.
     * @param fragment The fragment to insert.
     * @returns A new Slice with the fragment inserted, or null if insertion is not possible.
     * @throws {RangeError} If the position is invalid (negative).
     */
    public insertAt(pos: number, fragment: Fragment): Slice | null {
        if (pos < 0) {
            throw new RangeError(`Invalid position: must be non-negative (pos=${pos})`);
        }
        const content: Fragment | null = this.insertInto(this.sliceContent, pos + this.sliceOpenStart, fragment);
        return content ? new Slice(content, this.sliceOpenStart, this.sliceOpenEnd) : null;
    }

    /**
     * Remove content between two positions in this slice.
     *
     * @param from The starting position of the range to remove.
     * @param to The ending position of the range to remove.
     * @returns A new Slice with the specified range removed.
     * @throws {RangeError} If the range is invalid or not flat (spans multiple depth levels).
     */
    public removeBetween(from: number, to: number): Slice {
        if (from < 0 || to < 0) {
            throw new RangeError(`Invalid range: positions must be non-negative (from=${from}, to=${to})`);
        }
        if (from > to) {
            throw new RangeError(`Invalid range: from position (${from}) cannot exceed to position (${to})`);
        }
        const fragment: Fragment = this.removeRange(this.sliceContent, from + this.sliceOpenStart, to + this.sliceOpenStart);
        return new Slice(fragment, this.sliceOpenStart, this.sliceOpenEnd);
    }

    /**
     * Tests whether this slice is equal to another slice.
     * Two slices are equal if they have the same content, openStart, and openEnd values.
     *
     * @param other The slice to compare with.
     * @returns True if the slices are equal, false otherwise.
     */
    public eq(other: Slice): boolean {
        return this.sliceContent.eq(other.sliceContent)
            && this.sliceOpenStart === other.openStart
            && this.sliceOpenEnd === other.openEnd;
    }

    /**
     * Return a string representation of the slice for debugging purposes.
     *
     * @returns A string representation showing the content and open depths.
     */
    public toString(): string {
        return `${this.sliceContent.toString()}(${this.sliceOpenStart},${this.sliceOpenEnd})`;
    }

    /**
     * Convert a slice to a JSON-serializable representation.
     *
     * @returns A JSON representation of the slice, or null if the slice is empty.
     */
    public toJSON(): SliceJSON | null {
        if (!this.sliceContent.size) {
            return null;
        }
        const json: SliceJSON = {content: this.sliceContent.toJSON()};

        if (this.sliceOpenStart > 0) {
            json.openStart = this.sliceOpenStart;
        }

        if (this.sliceOpenEnd > 0) {
            json.openEnd = this.sliceOpenEnd;
        }
        return json;
    }

    /**
     * Recursively remove a range from a fragment.
     * The range must be "flat" - meaning it doesn't span across different node boundaries
     * in a way that would require restructuring the document tree.
     *
     * @param content The fragment to remove content from.
     * @param from The starting position of the range to remove.
     * @param to The ending position of the range to remove.
     * @returns A new fragment with the specified range removed.
     * @throws {RangeError} If the range is not flat.
     */
    private removeRange(content: Fragment, from: number, to: number): Fragment {
        const {index: fromIndex, offset: fromOffset} = content.findIndex(from);
        const {index: toIndex, offset: toOffset} = content.findIndex(to);
        const fromChild: PmNode | null = content.maybeChild(fromIndex);

        // Handle flat range: either at node boundary or within text nodes
        const isAtFromBoundary = fromOffset === from;
        const isFromTextNode = fromChild?.isText ?? false;

        if (isAtFromBoundary || isFromTextNode) {
            const toChild: PmNode | null = content.maybeChild(toIndex);
            const isAtToBoundary = toOffset === to;
            const isToTextNode = toChild?.isText ?? false;

            if (!isAtToBoundary && !isToTextNode) {
                throw new RangeError('Removing non-flat range');
            }
            return content.cut(0, from).append(content.cut(to));
        }

        // Range must be within a single child node
        if (fromIndex !== toIndex) {
            throw new RangeError('Removing non-flat range');
        }

        // Recursively remove range within the child
        if (!fromChild) {
            throw new RangeError('Invalid range: child not found');
        }

        const childContent: Fragment = fromChild.content;
        const adjustedFrom: number = from - fromOffset - 1;
        const adjustedTo: number = to - fromOffset - 1;
        const newChildContent: Fragment = this.removeRange(childContent, adjustedFrom, adjustedTo);

        return content.replaceChild(fromIndex, fromChild.copy(newChildContent));
    }

    /**
     * Recursively insert a fragment at a specific position within a fragment.
     *
     * @param content The fragment to insert into.
     * @param position The position at which to insert.
     * @param insert The fragment to insert.
     * @param parent The parent node, used to check if the insertion is valid.
     * @returns A new fragment with the insertion applied, or null if insertion is not possible.
     * @remarks Complexity: Time: O(d) where d is the depth of nested nodes. Space: O(d) for the call stack.
     */
    private insertInto(content: Fragment,
                       position: number,
                       insert: Fragment,
                       parent?: PmNode | null): Fragment | null {
        const {index, offset} = content.findIndex(position);
        const child: PmNode | null = content.maybeChild(index);

        // Insert at a boundary position or within a text node
        const isAtBoundary = offset === position;
        const isTextNode = child?.isText ?? false;

        if (isAtBoundary || isTextNode) {
            if (parent && !parent.canReplace(index, index, insert)) {
                return null;
            }
            return content.cut(0, position).append(insert).append(content.cut(position));
        }

        // Recursively insert within the child node
        if (!child) {
            return null;
        }

        const adjustedPosition: number = position - offset - 1;
        const newChildContent: Fragment | null = this.insertInto(child.content, adjustedPosition, insert, child);

        return newChildContent ? content.replaceChild(index, child.copy(newChildContent)) : null;
    }
}
