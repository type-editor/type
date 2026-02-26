
export interface RopeSequence<T> {

    /**
     * The depth of the tree structure.
     * Leaf nodes have depth 0, internal nodes have depth max(left.depth, right.depth) + 1.
     */
    readonly depth: number;

    /**
     * The total number of elements in this rope sequence.
     */
    readonly length: number;

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
    append(other: Array<T> | RopeSequence<T>): RopeSequence<T>;

    /**
     * Prepend an array or other rope to this one, returning a new rope.
     *
     * This is implemented by converting the input to a rope and appending the current rope to it.
     *
     * @param other - The array or rope sequence to prepend
     * @returns A new rope sequence containing all elements from other followed by elements from this rope
     */
    prepend(other: Array<T> | RopeSequence<T>): RopeSequence<T>;

    /**
     * Internal method to create an Append node combining two ropes.
     * Can be overridden by subclasses to implement balancing strategies.
     *
     * @param other - The rope sequence to append
     * @returns A new rope sequence combining this and other
     */
    appendInner(other: RopeSequence<T>): RopeSequence<T>;

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
    slice(from?: number, to?: number): RopeSequence<T>;

    /**
     * Retrieve the element at the given position from this rope.
     *
     * This operation has O(log n) time complexity as it needs to traverse
     * the tree structure to find the element.
     *
     * @param i - The index of the element to retrieve (0-based)
     * @returns The element at the specified index, or undefined if the index is out of bounds
     */
    get(i: number): T | undefined;

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
    forEach(callbackFunc: (element: T, index: number) => boolean | undefined,
            from?: number,
            to?: number): void;

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
    map<U>(callbackFunc: (element: T, index: number) => U,
           from: number,
           to: number): Array<U>;

    flatten(): Array<T>;

    leafAppend(other: RopeSequence<T>): RopeSequence<T> | undefined;

    leafPrepend(other: RopeSequence<T>): RopeSequence<T> | undefined;

    forEachInner(f: (element: T, index: number) => boolean | undefined, from: number, to: number, start: number): boolean | undefined;

    forEachInvertedInner(f: (element: T, index: number) => boolean | undefined, from: number, to: number, start: number): boolean | undefined;
}
