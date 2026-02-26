import {isFalse, isUndefinedOrNull} from '@type-editor/commons';

import {Mark} from './Mark';
import type {Node as PmNode} from './Node';
import {NodeRange} from './NodeRange';


/**
 * You can [_resolve_](#model.Node.resolve) a position to get more
 * information about it. Objects of this class represent such a
 * resolved position, providing various pieces of context
 * information, and some helper methods.
 *
 * Throughout this interface, methods that take an optional `depth`
 * parameter will interpret undefined as `this.depth` and negative
 * numbers as `this.depth + value`.
 *
 * @remarks
 * The internal path structure stores nodes and positions in triplets:
 * [node, index, position] for each level of the document tree.
 */
export class ResolvedPos {

    /**
     * Weak map cache for resolved positions, keyed by document node.
     * Using WeakMap allows garbage collection of cached positions when documents are disposed.
     * @private
     */
    private static readonly RESOLVE_CACHE = new WeakMap<PmNode, ResolveCache>();

    /**
     * Default size for the circular buffer cache of resolved positions per document.
     * A size of 12 provides good hit rates for typical editing patterns.
     * @private
     */
    private static readonly DEFAULT_RESOLVE_CACHE_SIZE = 12;

    /**
     * Size of each path entry triplet (node, index, position).
     * @private
     */
    private static readonly PATH_ENTRY_SIZE = 3;

    /**
     * The number of levels the parent node is from the root. If this
     * position points directly into the root node, it is 0. If it
     * points into a top-level paragraph, 1, and so on.
     * @private
     */
    private readonly depthIndex: number;

    /**
     * The absolute position that was resolved.
     * @private
     */
    private readonly posIndex: number;

    /**
     * Array of alternating nodes, child indices, and positions forming the path
     * from the root to this position. Organized as triplets: [node, index, pos, node, index, pos, ...].
     * @private
     */
    private readonly path: ReadonlyArray<PmNode | number>;

    /**
     * The offset of this position into its parent node.
     * @private
     */
    private readonly parentPosOffset: number;

    /**
     * Create a resolved position. Generally, you should use the static `resolve()` or
     * `resolveCached()` methods instead of calling this constructor directly.
     *
     * @param pos The absolute position that was resolved.
     * @param path Array containing the path from root to this position, stored as triplets
     *             of [node, childIndex, position] for each depth level.
     * @param parentOffset The offset this position has into its parent node.
     */
    constructor(pos: number,
                path: ReadonlyArray<PmNode | number>,
                parentOffset: number) {
        this.posIndex = pos;
        this.path = path;
        this.parentPosOffset = parentOffset;
        this.depthIndex = path.length / ResolvedPos.PATH_ENTRY_SIZE - 1;
    }

    /**
     * The number of levels the parent node is from the root.
     * 0 means the position points directly into the root node.
     */
    get depth(): number {
        return this.depthIndex;
    }

    /**
     * The absolute position in the document that was resolved.
     */
    get pos(): number {
        return this.posIndex;
    }

    /**
     * The offset of this position into its parent node.
     */
    get parentOffset(): number {
        return this.parentPosOffset;
    }

    /**
     * The parent node that the position points into. Note that even if
     * a position points into a text node, that node is not considered
     * the parent—text nodes are ‘flat’ in this model, and have no content.
     */
    get parent(): PmNode {
        return this.node(this.depthIndex);
    }

    /**
     * The root node in which the position was resolved.
     */
    get doc(): PmNode {
        return this.node(0);
    }

    /**
     * When this position points into a text node, this returns the
     * distance between the start of the text node and the position.
     * Will be zero for positions that point between nodes.
     */
    get textOffset(): number {
        return this.posIndex - (this.path[this.path.length - 1] as number);
    }

    /**
     * Get the node directly after the position, if any. If the position
     * points into a text node, only the part of that node after the
     * position is returned.
     */
    get nodeAfter(): PmNode | null {
        const parent: PmNode = this.parent;
        const index: number = this.index(this.depthIndex);

        if (index === parent.childCount) {
            return null;
        }

        const offset: number = this.posIndex - (this.path[this.path.length - 1] as number);
        const child: PmNode = parent.child(index);
        return offset ? child.cut(offset) : child;
    }

    /**
     * Get the node directly before the position, if any. If the
     * position points into a text node, only the part of that node
     * before the position is returned.
     */
    get nodeBefore(): PmNode | null {
        const index: number = this.index(this.depthIndex);
        const dOff: number = this.posIndex - (this.path[this.path.length - 1] as number);
        if (dOff) {
            return this.parent.child(index).cut(0, dOff);
        }
        return index === 0 ? null : this.parent.child(index - 1);
    }

    /**
     * Resolve a position in a document into a ResolvedPos object.
     * This method traverses the document tree from the root to find all ancestor nodes
     * and their positions leading to the given position.
     *
     * @param doc The document node to resolve the position in.
     * @param pos The absolute position to resolve. Must be between 0 and doc.content.size.
     * @returns A new ResolvedPos instance containing the resolved position information.
     * @throws {RangeError} If the position is out of range.
     */
    public static resolve(doc: PmNode, pos: number): ResolvedPos {
        if (!(pos >= 0 && pos <= doc.content.size)) {
            throw new RangeError(`Position ${pos} out of range (valid: 0-${doc.content.size})`);
        }

        const path: Array<PmNode | number> = new Array<PmNode>();
        let start = 0;
        let parentOffset: number = pos;

        for (let node = doc; ;) {
            const {index, offset} = node.content.findIndex(parentOffset);
            const rem: number = parentOffset - offset;
            path.push(node, index, start + offset);

            if (!rem) {
                break;
            }

            node = node.child(index);
            if (node.isText) {
                break;
            }
            parentOffset = rem - 1;
            start += offset + 1;
        }
        return new ResolvedPos(pos, path, parentOffset);
    }

    /**
     * Resolve a position with caching. This method maintains a per-document cache
     * of recently resolved positions using a circular buffer with Map-based O(1) lookups.
     * If the position is already cached, it returns the cached instance; otherwise,
     * it resolves the position and adds it to the cache.
     *
     * @param doc The document node to resolve the position in.
     * @param pos The absolute position to resolve.
     * @returns A ResolvedPos instance, either from cache or newly created.
     * @throws {RangeError} If the position is out of range.
     */
    public static resolveCached(doc: PmNode, pos: number): ResolvedPos {
        let cache: ResolveCache | undefined = ResolvedPos.RESOLVE_CACHE.get(doc);

        if (!cache) {
            // Initialize cache for this document
            cache = new ResolveCache(ResolvedPos.DEFAULT_RESOLVE_CACHE_SIZE);
            ResolvedPos.RESOLVE_CACHE.set(doc, cache);
        }

        // Try to get from cache (O(1) lookup)
        const cached: ResolvedPos = cache.get(pos);
        if (cached) {
            return cached;
        }

        // Resolve and cache the position
        const result: ResolvedPos = ResolvedPos.resolve(doc, pos);
        cache.add(result);
        return result;
    }

    /**
     * The ancestor node at the given level. `p.node(p.depth)` is the
     * same as `p.parent`.
     *
     * @param depth The depth level. Defaults to `this.depth` if undefined.
     *              Negative values are interpreted as `this.depth + depth`.
     * @returns The node at the specified depth level.
     */
    public node(depth?: number): PmNode {
        return this.path[this.resolveDepth(depth) * ResolvedPos.PATH_ENTRY_SIZE] as PmNode;
    }

    /**
     * The index into the ancestor at the given level. If this points
     * at the 3rd node in the 2nd paragraph on the top level, for
     * example, `p.index(0)` is 1 and `p.index(1)` is 2.
     *
     * @param depth The depth level. Defaults to `this.depth` if undefined.
     *              Negative values are interpreted as `this.depth + depth`.
     * @returns The child index at the specified depth level.
     */
    public index(depth?: number): number {
        return this.path[this.resolveDepth(depth) * ResolvedPos.PATH_ENTRY_SIZE + 1] as number;
    }

    /**
     * The index pointing after this position into the ancestor at the
     * given level.
     *
     * @param depth The depth level. Defaults to `this.depth` if undefined.
     *              Negative values are interpreted as `this.depth + depth`.
     * @returns The child index after this position at the specified depth.
     */
    public indexAfter(depth?: number | null): number {
        depth = this.resolveDepth(depth);
        const ancestorDepth: number = depth === this.depthIndex && !this.textOffset ? 0 : 1;
        return this.index(depth) + ancestorDepth;
    }

    /**
     * The (absolute) position at the start of the node at the given
     * level.
     *
     * @param depth The depth level. Defaults to `this.depth` if undefined.
     *              Negative values are interpreted as `this.depth + depth`.
     * @returns The absolute position at the start of the node at the specified depth.
     */
    public start(depth?: number | null): number {
        depth = this.resolveDepth(depth);
        const currentDepth: number = this.path[depth * ResolvedPos.PATH_ENTRY_SIZE - 1] as number;
        return depth === 0 ? 0 : currentDepth + 1;
    }

    /**
     * The (absolute) position at the end of the node at the given
     * level.
     *
     * @param depth The depth level. Defaults to `this.depth` if undefined.
     *              Negative values are interpreted as `this.depth + depth`.
     * @returns The absolute position at the end of the node at the specified depth.
     */
    public end(depth?: number | null): number {
        depth = this.resolveDepth(depth);
        return this.start(depth) + this.node(depth).content.size;
    }

    /**
     * The (absolute) position directly before the wrapping node at the
     * given level, or, when `depth` is `this.depth + 1`, the original
     * position.
     *
     * @param depth The depth level. Defaults to `this.depth` if undefined.
     *              Negative values are interpreted as `this.depth + depth`.
     * @returns The absolute position before the node at the specified depth.
     * @throws {RangeError} If depth is 0 (no position before root node).
     */
    public before(depth?: number | null): number {
        depth = this.resolveDepth(depth);

        if (!depth) {
            throw new RangeError('There is no position before the top-level node');
        }

        return depth === this.depthIndex + 1 ? this.posIndex : this.path[depth * ResolvedPos.PATH_ENTRY_SIZE - 1] as number;
    }

    /**
     * The (absolute) position directly after the wrapping node at the
     * given level, or the original position when `depth` is `this.depth + 1`.
     *
     * @param depth The depth level. Defaults to `this.depth` if undefined.
     *              Negative values are interpreted as `this.depth + depth`.
     * @returns The absolute position after the node at the specified depth.
     * @throws {RangeError} If depth is 0 (no position after root node).
     */
    public after(depth?: number | null): number {
        depth = this.resolveDepth(depth);

        if (!depth) {
            throw new RangeError('There is no position after the top-level node');
        }

        const currentDepth: number = this.path[depth * ResolvedPos.PATH_ENTRY_SIZE - 1] as number;
        const currentDepthNode: PmNode = this.path[depth * ResolvedPos.PATH_ENTRY_SIZE] as PmNode;
        return depth === this.depthIndex + 1 ? this.posIndex : currentDepth + currentDepthNode.nodeSize;
    }

    /**
     * Get the position at the given index in the parent node at the
     * given depth (which defaults to `this.depth`).
     *
     * @param index The child index to get the position for.
     * @param depth The depth level. Defaults to `this.depth` if undefined.
     *              Negative values are interpreted as `this.depth + depth`.
     * @returns The absolute position at the given child index.
     * @remarks Complexity: Time: O(index) - needs to iterate through preceding children.
     */
    public posAtIndex(index: number, depth?: number | null): number {
        depth = this.resolveDepth(depth);
        const node = this.path[depth * ResolvedPos.PATH_ENTRY_SIZE] as PmNode;

        const currentDepth: number = this.path[depth * ResolvedPos.PATH_ENTRY_SIZE - 1] as number;
        let pos: number = depth === 0 ? 0 : currentDepth + 1;
        for (let i = 0; i < index; i++) {
            pos += node.child(i).nodeSize;
        }
        return pos;
    }

    /**
     * Get the marks at this position, factoring in the surrounding
     * marks' [`inclusive`](#model.MarkSpec.inclusive) property. If the
     * position is at the start of a non-empty node, the marks of the
     * node after it (if any) are returned.
     *
     * @returns An array of marks active at this position.
     * @remarks
     * The algorithm prioritizes the node before the position, except when there is no
     * node before (at the start). Non-inclusive marks are filtered out if they don't
     * appear in the adjacent node.
     */
    public marks(): ReadonlyArray<Mark> {
        const parent: PmNode = this.parent;
        const index: number = this.index();

        // In an empty parent, return the empty array
        if (parent.content.size === 0) {
            return Mark.none;
        }

        // When inside a text node, just return the text node's marks
        if (this.textOffset) {
            return parent.child(index).marks;
        }

        let main: PmNode | null = parent.maybeChild(index - 1);
        let other: PmNode | null = parent.maybeChild(index);

        // If there is no node before, make the node after this position the main reference.
        if (!main) {
            main = other;
            other = null;
        }

        // Use all marks in the main node, except those that have
        // `inclusive` set to false and are not present in the other node.
        let marks: ReadonlyArray<Mark> = main?.marks ?? Mark.none;
        for (let i = 0; i < marks.length; i++) {
            if (isFalse(marks[i].type.spec.inclusive) && (!other || !marks[i].isInSet(other.marks))) {
                marks = marks[i--].removeFromSet(marks);
            }
        }

        return marks;
    }

    /**
     * Get the marks after the current position, if any, except those
     * that are non-inclusive and not present at position `$end`. This
     * is mostly useful for getting the set of marks to preserve after a
     * deletion. Will return `null` if this position is at the end of
     * its parent node or its parent node isn't a textblock (in which
     * case no marks should be preserved).
     *
     * @param $end The end position to compare marks with.
     * @returns An array of marks to preserve, or null if preservation doesn't apply.
     */
    public marksAcross($end: ResolvedPos): ReadonlyArray<Mark> | null {
        const after: PmNode = this.parent.maybeChild(this.index());

        if (!after?.isInline) {
            return null;
        }

        let marks: ReadonlyArray<Mark> = after.marks;
        const next: PmNode = $end.parent.maybeChild($end.index());

        for (let i = 0; i < marks.length; i++) {
            if (isFalse(marks[i].type.spec.inclusive) && (!next || !marks[i].isInSet(next.marks))) {
                marks = marks[i--].removeFromSet(marks);
            }
        }
        return marks;
    }

    /**
     * The depth up to which this position and the given (non-resolved)
     * position share the same parent nodes.
     *
     * @param pos The absolute position to compare with (non-resolved).
     * @returns The depth level where both positions share the same parent, or 0 if only the root is shared.
     */
    public sharedDepth(pos: number): number {
        for (let depth = this.depthIndex; depth > 0; depth--) {
            if (this.start(depth) <= pos && this.end(depth) >= pos) {
                return depth;
            }
        }
        return 0;
    }

    /**
     * Returns a range based on the place where this position and the
     * given position diverge around block content. If both point into
     * the same textblock, for example, a range around that textblock
     * will be returned. If they point into different blocks, the range
     * around those blocks in their shared ancestor is returned. You can
     * pass in an optional predicate that will be called with a parent
     * node to see if a range into that parent is acceptable.
     *
     * @param other The other position to find a block range with. Defaults to this position if not provided.
     * @param pred Optional predicate function that accepts a node and returns true if a range into that node is acceptable.
     * @returns A NodeRange spanning the block content, or null if no valid range can be found.
     */
    public blockRange(other?: ResolvedPos, pred?: (node: PmNode) => boolean): NodeRange | null {
        const otherPos: ResolvedPos = other ?? this;

        if (otherPos.pos < this.posIndex) {
            return otherPos.blockRange(this);
        }

        let depth: number = this.depthIndex;
        if (this.parent.inlineContent || this.posIndex === otherPos.pos) {
            depth = this.depthIndex - 1;
        }

        while (depth >= 0) {
            if (otherPos.pos <= this.end(depth) && (!pred || pred(this.node(depth)))) {
                return new NodeRange(this, otherPos, depth);
            }
            depth--;
        }

        return null;
    }

    /**
     * Query whether the given position shares the same parent node.
     *
     * @param other The other resolved position to compare with.
     * @returns True if both positions share the same parent node, false otherwise.
     */
    public sameParent(other: ResolvedPos): boolean {
        return this.posIndex - this.parentPosOffset === other.pos - other.parentOffset;
    }

    /**
     * Return the greater of this and the given position.
     *
     * @param other The other resolved position to compare with.
     * @returns The resolved position with the greater absolute position value.
     */
    public max(other: ResolvedPos): ResolvedPos {
        return other.pos > this.posIndex ? other : this;
    }

    /**
     * Return the smaller of this and the given position.
     *
     * @param other The other resolved position to compare with.
     * @returns The resolved position with the smaller absolute position value.
     */
    public min(other: ResolvedPos): ResolvedPos {
        return other.pos < this.posIndex ? other : this;
    }

    /**
     * Return a string representation of this position for debugging purposes.
     * Format: "nodetype_index/nodetype_index:offset"
     *
     * @returns A human-readable string describing this position's path through the document tree.
     * @example
     * Returns something like "doc_0/paragraph_1:5" for a position 5 chars into the second paragraph.
     */
    public toString(): string {
        let str = '';
        for (let i = 1; i <= this.depthIndex; i++) {
            str += `${str ? '/' : ''}${this.node(i).type.name}_${this.index(i - 1).toString()}`;
        }
        return `${str}:${this.parentPosOffset.toString()}`;
    }

    /**
     * Resolve a depth parameter to an absolute depth value.
     * Handles undefined (defaults to this.depth), null, and negative values (relative to this.depth).
     * Allows depth = this.depth + 1 as a special case used by before() and after() methods.
     *
     * @param val The depth value to resolve. Undefined/null defaults to this.depth.
     *            Negative values are relative to this.depth.
     * @returns The resolved absolute depth value.
     * @throws {RangeError} If the resolved depth is negative.
     * @private
     */
    private resolveDepth(val: number | undefined | null): number {
        if (isUndefinedOrNull(val)) {
            return this.depthIndex;
        }

        if (val < 0) {
            const resolved: number = this.depthIndex + val;
            if (resolved < 0) {
                throw new RangeError(`Resolved depth ${resolved} is negative (depth=${this.depthIndex}, offset=${val})`);
            }
            return resolved;
        }

        // Note: We allow val > this.depthIndex because before() and after()
        // methods use depth = this.depth + 1 as a special case
        return val;
    }
}


/**
 * Internal cache structure for storing recently resolved positions.
 * Uses a circular buffer with a Map for O(1) lookups.
 * @internal
 */
class ResolveCache {
    /**
     * Circular buffer array storing cached ResolvedPos instances.
     */
    public elements: Array<ResolvedPos | undefined>;

    /**
     * Map for O(1) position lookups. Maps position to ResolvedPos.
     * @private
     */
    private positionMap = new Map<number, ResolvedPos>();
    /**
     * Maximum size of the cache.
     * @private
     */
    private readonly size: number;

    /**
     * Current write position in the circular buffer.
     */
    private _currentPos = 0;

    /**
     * Create a new resolve cache with the specified size.
     *
     * @param size The maximum number of resolved positions to cache.
     */
    constructor(size: number) {
        this.size = size;
        this.elements = new Array<ResolvedPos | undefined>(size);
    }

    /**
     * Get the current write position in the circular buffer.
     * This indicates where the next cached position will be stored,
     * and which existing entry will be evicted if the cache is full.
     *
     * @returns The current index in the circular buffer (0 to size-1).
     */
    get currentPos(): number {
        return this._currentPos;
    }

    /**
     * Set the current write position in the circular buffer.
     * This is used internally to track where to store the next cached position.
     *
     * @param newPos
     */
    set currentPos(newPos: number) {
        this._currentPos = newPos;
    }

    /**
     * Get a cached resolved position by its position value.
     *
     * @param pos The position to look up.
     * @returns The cached ResolvedPos or undefined if not cached.
     */
    public get(pos: number): ResolvedPos | undefined {
        return this.positionMap.get(pos);
    }

    /**
     * Add a resolved position to the cache, evicting the oldest entry if necessary.
     *
     * @param resolved The ResolvedPos instance to cache.
     */
    public add(resolved: ResolvedPos): void {
        // Remove old entry from map if it exists
        const oldEntry = this.elements[this.currentPos];
        if (oldEntry) {
            this.positionMap.delete(oldEntry.pos);
        }

        // Add new entry
        this.elements[this.currentPos] = resolved;
        this.positionMap.set(resolved.pos, resolved);

        // Move to next position in circular buffer
        this.currentPos = (this.currentPos + 1) % this.size;
    }
}
