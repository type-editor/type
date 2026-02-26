/**
 * See https://github.com/marijnh/rope-sequence
 */
import {isFalse} from '@type-editor/commons';

import type {RopeSequence} from '../types/RopeSequence';

/**
 * A rope sequence is a persistent sequence data structure that supports appending, prepending, and
 * slicing without doing a full copy. It is represented as a mostly-balanced tree.
 *
 * This data structure provides O(log n) time complexity for most operations while maintaining
 * immutability and structural sharing between versions.
 *
 * @typeParam T - The type of elements stored in the rope sequence
 */
abstract class AbstractRopeSequence<T> implements RopeSequence<T> {

    /**
     * The maximum size for a leaf node before it should be split into an internal node.
     * This value balances between memory efficiency and tree depth.
     */
    protected static readonly GOOD_LEAF_SIZE = 200;

    /**
     * The depth of the tree structure.
     * Leaf nodes have depth 0, internal nodes have depth max(left.depth, right.depth) + 1.
     */
    abstract get depth(): number;

    /**
     * The total number of elements in this rope sequence.
     */
    public abstract get length(): number;

    /**
     * Append an array or other rope to this one, returning a new rope.
     *
     * This operation is optimized to reuse existing structure when possible and only
     * creates new nodes as necessary. If the current rope is empty, returns the other rope.
     * Attempts to perform leaf-level merging before creating internal nodes.
     *
     * @param other - The array or rope sequence to append
     * @returns A new rope sequence containing all elements from this rope followed by elements from other
     */
    public append(other: Array<T> | RopeSequence<T>): RopeSequence<T> {
        const otherLength: number = Array.isArray(other) ? other.length : other.length;
        if (!otherLength) {
            return this;
        }

        const otherRope: RopeSequence<T> = this.from(other);

        // Try optimization strategies in order of preference:
        // 1. If this rope is empty, return the other rope
        if (!this.length) {
            return otherRope;
        }

        // 2. If other is small enough, try appending to current leaf
        if (otherLength < AbstractRopeSequence.GOOD_LEAF_SIZE) {
            const leafAppendResult: RopeSequence<T> = this.leafAppend(otherRope);
            if (leafAppendResult) {
                return leafAppendResult;
            }
        }

        // 3. If this rope is small enough, try prepending to other leaf
        if (this.length < AbstractRopeSequence.GOOD_LEAF_SIZE) {
            const leafPrependResult: RopeSequence<T> = otherRope.leafPrepend(this);
            if (leafPrependResult) {
                return leafPrependResult;
            }
        }

        // 4. Create internal node structure
        return this.appendInner(otherRope);
    }

    /**
     * Prepend an array or other rope to this one, returning a new rope.
     *
     * This is implemented by converting the input to a rope and appending the current rope to it.
     *
     * @param other - The array or rope sequence to prepend
     * @returns A new rope sequence containing all elements from other followed by elements from this rope
     */
    public prepend(other: Array<T> | RopeSequence<T>): RopeSequence<T> {
        const otherLength: number = Array.isArray(other) ? other.length : other.length;
        if (!otherLength) {
            return this;
        }
        return this.from(other).append(this);
    }

    /**
     * Internal method to create an Append node combining two ropes.
     * Can be overridden by subclasses to implement balancing strategies.
     *
     * @param other - The rope sequence to append
     * @returns A new rope sequence combining this and other
     */
    public appendInner(other: RopeSequence<T>): RopeSequence<T> {
        return new Append(this, other);
    }

    /**
     * Create a rope representing a sub-sequence of this rope.
     *
     * Returns a new rope containing only the elements between the specified indices.
     * Indices are clamped to valid bounds automatically.
     *
     * @param from - The start index (inclusive), defaults to 0
     * @param to - The end index (exclusive), defaults to the length of the rope
     * @returns A new rope sequence containing elements from [from, to)
     */
    public slice(from = 0, to: number = this.length): RopeSequence<T> {
        if (from >= to) {
            return this.getEmptySequence();
        }
        return this.sliceInner(Math.max(0, from), Math.min(this.length, to));
    }

    /**
     * Retrieve the element at the given position from this rope.
     *
     * This operation has O(log n) time complexity as it needs to traverse
     * the tree structure to find the element.
     *
     * @param i - The index of the element to retrieve (0-based)
     * @returns The element at the specified index, or undefined if the index is out of bounds
     */
    public get(i: number): T | undefined {
        if (i < 0 || i >= this.length) {
            return undefined;
        }
        return this.getInner(i);
    }

    /**
     * Call the given function for each element between the given indices.
     *
     * This is more efficient than looping over indices and calling `get`, because it doesn't
     * have to descend the tree for every element. The callback can return false to stop iteration early.
     *
     * When from > to, iterates in reverse order.
     *
     * @param callbackFunc - Callback function to execute for each element. Return false to stop iteration.
     * @param from - The start index (inclusive), defaults to 0
     * @param to - The end index (exclusive), defaults to the length of the rope
     */
    public forEach(callbackFunc: (element: T, index: number) => boolean | undefined,
                   from = 0,
                   to: number = this.length): void {
        if (from <= to) {
            this.forEachInner(callbackFunc, from, to, 0);
        } else {
            this.forEachInvertedInner(callbackFunc, from, to, 0);
        }
    }

    /**
     * Map the given function over the elements of the rope, producing a flat array.
     *
     * Creates a new array by applying the callback function to each element in the
     * specified range of the rope sequence.
     *
     * @typeParam U - The type of elements in the resulting array
     * @param callbackFunc - Function to apply to each element
     * @param from - The start index (inclusive), defaults to 0
     * @param to - The end index (exclusive), defaults to the length of the rope
     * @returns A new array containing the transformed elements
     */
    public map<U>(callbackFunc: (element: T, index: number) => U,
                  from = 0,
                  to: number = this.length): Array<U> {
        const result: Array<U> = [];
        this.forEach((elt: T, i: number): undefined => {
            result.push(callbackFunc(elt, i));
        }, from, to);
        return result;
    }

    /**
     * Return the content of this rope as an array.
     *
     * This operation creates a new array containing all elements from the rope in order.
     * Note: This has O(n) time complexity and creates a full copy of all elements.
     *
     * @returns A new array containing all elements in the rope
     */
    public abstract flatten(): Array<T>;

    /**
     * Try to append another rope to this one at the leaf level.
     *
     * This is an optimization that attempts to merge small sequences without creating
     * additional tree nodes. Returns undefined if merging is not possible.
     *
     * @param other - The rope sequence to append
     * @returns A new merged rope sequence, or undefined if leaf-level append is not possible
     */
    public abstract leafAppend(other: RopeSequence<T>): RopeSequence<T> | undefined;

    /**
     * Try to prepend another rope to this one at the leaf level.
     *
     * This is an optimization that attempts to merge small sequences without creating
     * additional tree nodes. Returns undefined if merging is not possible.
     *
     * @param other - The rope sequence to prepend
     * @returns A new merged rope sequence, or undefined if leaf-level prepend is not possible
     */
    public abstract leafPrepend(other: RopeSequence<T>): RopeSequence<T> | undefined;

    /**
     * Internal implementation of forward forEach operation.
     *
     * @param f - Callback function to execute for each element
     * @param from - The start index within this subtree (inclusive)
     * @param to - The end index within this subtree (exclusive)
     * @param start - The offset to add to indices when calling the callback
     * @returns False if iteration was stopped early, undefined otherwise
     */
    public abstract forEachInner(f: (element: T, index: number) => boolean | undefined, from: number, to: number, start: number): boolean | undefined;

    /**
     * Internal implementation of reverse forEach operation.
     *
     * @param f - Callback function to execute for each element
     * @param from - The start index within this subtree (inclusive)
     * @param to - The end index within this subtree (exclusive)
     * @param start - The offset to add to indices when calling the callback
     * @returns False if iteration was stopped early, undefined otherwise
     */
    public abstract forEachInvertedInner(f: (element: T, index: number) => boolean | undefined, from: number, to: number, start: number): boolean | undefined;

    /**
     * Internal implementation of slice operation.
     * Assumes from and to are already validated and within bounds.
     *
     * @param from - The start index (inclusive)
     * @param to - The end index (exclusive)
     * @returns A new rope sequence containing elements from [from, to)
     */
    protected abstract sliceInner(from: number, to: number): RopeSequence<T>;

    /**
     * Internal implementation of element retrieval.
     * Assumes the index is already validated and within bounds.
     *
     * @param i - The index of the element to retrieve (0-based)
     * @returns The element at the specified index
     */
    protected abstract getInner(i: number): T;

    /**
     * Get an empty rope sequence of the same type.
     *
     * @returns An empty rope sequence
     */
    protected abstract getEmptySequence(): RopeSequence<T>;

    /**
     * Create a rope sequence from an array or return the rope if already a rope.
     *
     * @param values - The array or rope sequence to convert
     * @returns A rope sequence
     */
    protected abstract from(values: Array<T> | RopeSequence<T>): RopeSequence<T>;
}


/**
 * Leaf node in the rope sequence tree structure.
 * Contains an array of actual elements with no child nodes.
 *
 * @typeParam T - The type of elements stored in this leaf
 */
export class Leaf<T> extends AbstractRopeSequence<T> implements RopeSequence<T> {

    /**
     * A shared empty leaf instance for optimization purposes.
     * Used to avoid creating multiple empty leaf objects.
     */
    public static readonly EMPTY = new Leaf([]);

    public readonly depth = 0;
    /**
     * The actual array of elements stored in this leaf node.
     */
    private readonly values: Array<T> = [];

    /**
     * Create a new leaf node with the given values.
     *
     * @param values - The array of elements to store in this leaf
     */
    constructor(values: Array<T>) {
        super();
        this.values = values;
    }

    get length(): number {
        return this.values.length;
    }

    /**
     * Returns the underlying array directly since this is already a leaf node.
     *
     * @returns The array of elements in this leaf
     */
    public flatten(): Array<T> {
        return this.values;
    }

    public forEachInner(callbackFunc: (element: T, index: number) => boolean | undefined,
                        from: number,
                        to: number,
                        start: number): boolean | undefined {
        for (let i = from; i < to; i++) {
            if (isFalse(callbackFunc(this.values[i], start + i))) {
                return false;
            }
        }
        return undefined;
    }

    public forEachInvertedInner(callbackFunc: (element: T, index: number) => boolean | undefined,
                                from: number,
                                to: number,
                                start: number): boolean | undefined {
        for (let i = from - 1; i >= to; i--) {
            if (isFalse(callbackFunc(this.values[i], start + i))) {
                return false;
            }
        }
        return undefined;
    }

    public leafAppend(other: RopeSequence<T>): RopeSequence<T> | undefined {
        if (this.length + other.length <= AbstractRopeSequence.GOOD_LEAF_SIZE) {
            return new Leaf(this.values.concat(other.flatten()));
        }
        return undefined;
    }

    public leafPrepend(other: RopeSequence<T>): RopeSequence<T> | undefined {
        if (this.length + other.length <= AbstractRopeSequence.GOOD_LEAF_SIZE) {
            return new Leaf(other.flatten().concat(this.values));
        }
        return undefined;
    }

    /**
     * Creates a slice of this leaf node.
     *
     * @param from - The start index (inclusive)
     * @param to - The end index (exclusive)
     * @returns A new leaf containing the sliced elements, or this leaf if the range matches exactly
     */
    protected sliceInner(from: number, to: number): RopeSequence<T> {
        if (from === 0 && to === this.length) {
            return this;
        }
        return new Leaf(this.values.slice(from, to));
    }

    /**
     * Retrieves an element by index directly from the values array.
     *
     * @param i - The index of the element to retrieve
     * @returns The element at the specified index
     */
    protected getInner(i: number): T {
        return this.values[i];
    }

    protected getEmptySequence(): RopeSequence<T> {
        return Leaf.EMPTY;
    }

    /**
     * Create a rope representing the given array, or return the rope
     * itself if a rope was given.
     *
     * @param values - The array or rope sequence to convert
     * @returns A rope sequence
     * @protected
     */
    protected from(values: Array<T> | RopeSequence<T>): RopeSequence<T> {
        if (values instanceof AbstractRopeSequence) {
            return values;
        }
        return values?.length ? new Leaf(values as Array<T>) : Leaf.EMPTY;
    }

}


/**
 * Internal node in the rope sequence tree structure.
 * Combines two child rope sequences (left and right) without copying their elements.
 *
 * @typeParam T - The type of elements stored in this rope subtree
 */
export class Append<T> extends AbstractRopeSequence<T> implements RopeSequence<T> {

    /**
     * The depth of this subtree in the overall rope structure.
     */
    public readonly depth: number;
    /**
     * Cached length of this combined rope.
     */
    private readonly len: number;
    /**
     * The left child rope sequence.
     */
    private readonly left: RopeSequence<T>;
    /**
     * The right child rope sequence.
     */
    private readonly right: RopeSequence<T>;

    /**
     * Create an internal node combining two rope sequences.
     *
     * @param left - The left child rope sequence
     * @param right - The right child rope sequence
     */
    constructor(left: RopeSequence<T>, right: RopeSequence<T>) {
        super();
        this.left = left;
        this.right = right;
        this.len = left.length + right.length;
        this.depth = Math.max(left.depth, right.depth) + 1;
    }

    get length(): number {
        return this.len;
    }

    /**
     * Recursively flattens both child ropes and concatenates the results.
     *
     * @returns A single array containing all elements from both child ropes
     */
    public flatten(): Array<T> {
        return this.left.flatten().concat(this.right.flatten());
    }

    public forEachInner(callbackFunc: (element: T, index: number) => boolean | undefined,
                        from: number,
                        to: number,
                        start: number): boolean | undefined {
        const leftLen: number = this.left.length;
        if (from < leftLen
            && isFalse(this.left.forEachInner(callbackFunc, from, Math.min(to, leftLen), start))) {
            return false;
        }
        if (to > leftLen
            && isFalse(this.right.forEachInner(callbackFunc, Math.max(from - leftLen, 0), Math.min(this.length, to) - leftLen, start + leftLen))) {
            return false;
        }
        return undefined;
    }

    public forEachInvertedInner(callbackFunc: (element: T, index: number) => boolean | undefined,
                                from: number,
                                to: number,
                                start: number): boolean | undefined {
        const leftLen: number = this.left.length;
        if (from > leftLen
            && isFalse(this.right.forEachInvertedInner(callbackFunc, from - leftLen, Math.max(to, leftLen) - leftLen, start + leftLen))) {
            return false;
        }
        if (to < leftLen
            && isFalse(this.left.forEachInvertedInner(callbackFunc, Math.min(from, leftLen), to, start))) {
            return false;
        }
        return undefined;
    }

    public leafAppend(other: RopeSequence<T>): RopeSequence<T> | undefined {
        const inner: RopeSequence<T> = this.right.leafAppend(other);
        if (inner) {
            return new Append(this.left, inner);
        }
        return undefined;
    }

    public leafPrepend(other: RopeSequence<T>): RopeSequence<T> | undefined {
        const inner: RopeSequence<T> = this.left.leafPrepend(other);
        if (inner) {
            return new Append(inner, this.right);
        }
        return undefined;
    }

    public appendInner(other: RopeSequence<T>): RopeSequence<T> {
        if (this.left.depth >= Math.max(this.right.depth, other.depth) + 1) {
            return new Append(this.left, new Append(this.right, other));
        }
        return new Append(this, other);
    }

    /**
     * Retrieves an element by determining which child rope contains it.
     *
     * @param elementIndex - The index of the element to retrieve
     * @returns The element at the specified index
     */
    protected getInner(elementIndex: number): T {
        // getInner is only called from get() which already validates the index is within bounds,
        // so the result should never be undefined
        const result: T = elementIndex < this.left.length ? this.left.get(elementIndex) : this.right.get(elementIndex - this.left.length);
        if (result === undefined) {
            throw new Error(`Index ${elementIndex} out of bounds in rope of length ${this.length}`);
        }
        return result;
    }

    protected sliceInner(from: number, to: number): RopeSequence<T> {
        if (from === 0 && to === this.length) {
            return this;
        }
        const leftLen: number = this.left.length;
        if (to <= leftLen) {
            return this.left.slice(from, to);
        }
        if (from >= leftLen) {
            return this.right.slice(from - leftLen, to - leftLen);
        }
        return this.left.slice(from, leftLen).append(this.right.slice(0, to - leftLen));
    }

    protected getEmptySequence(): RopeSequence<T> {
        return Leaf.EMPTY;
    }

    protected from(values: Array<T> | RopeSequence<T>): RopeSequence<T> {
        if (values instanceof AbstractRopeSequence) {
            return values;
        }
        return values?.length ? new Leaf(values as Array<T>) : Leaf.EMPTY;
    }
}


/**
 * A shared empty rope sequence instance for optimization purposes.
 * Use this instead of creating new empty rope sequences.
 */
export const EMPTY_ROPESEQUENCE = new Leaf([]);

/**
 * Create a rope sequence from an array or return the rope if already a rope sequence.
 *
 * This is a factory function that efficiently handles both array and rope sequence inputs.
 * If the input is already a rope sequence, it returns it unchanged. If it's an array,
 * it creates a new Leaf node, or returns an empty rope if the array is empty.
 *
 * @typeParam T - The type of elements in the rope sequence
 * @param values - The array or rope sequence to convert
 * @returns A rope sequence containing the provided elements
 *
 * @example
 * ```typescript
 * const rope1 = createRopeSequence([1, 2, 3]);
 * const rope2 = createRopeSequence(rope1); // Returns rope1
 * const empty = createRopeSequence([]); // Returns Leaf.EMPTY
 * ```
 */
export function createRopeSequence<T>(values: Array<T> | RopeSequence<T>): RopeSequence<T> {
    if (values instanceof AbstractRopeSequence) {
        return values;
    }
    return values?.length ? new Leaf(values as Array<T>) : Leaf.EMPTY;
}
