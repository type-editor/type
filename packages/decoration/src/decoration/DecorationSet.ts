import {isUndefinedOrNull} from '@type-editor/commons';
import type {DecorationSource, DecorationSpec, PmDecoration} from '@type-editor/editor-types';
import type {Node} from '@type-editor/model';
import {Mapping} from '@type-editor/transform';

import {AbstractDecorationSource} from './AbstractDecorationSource';
import {Decoration} from './Decoration';
import {DecorationGroup} from './DecorationGroup';
import {InlineType} from './InlineType';

/**
 * A collection of [decorations](#view.Decoration), organized in such
 * a way that the drawing algorithm can efficiently use and compare
 * them. This is a persistent data structure—it is not modified,
 * updates create a new value.
 *
 * The decoration set organizes decorations hierarchically according to
 * the document structure, allowing for efficient updates when the document
 * changes. Decorations are stored both locally (applying to the current node)
 * and in child sets (applying to child nodes).
 *
 * @example
 * ```typescript
 * // Create a decoration set from decorations
 * const decorations = [
 *   Decoration.inline(0, 5, {class: "highlight"})
 * ];
 * const decoSet = DecorationSet.create(doc, decorations);
 *
 * // Map through a document change
 * const mapped = decoSet.map(mapping, newDoc);
 *
 * // Find decorations in a range
 * const found = decoSet.find(10, 20);
 * ```
 */
export class DecorationSet extends AbstractDecorationSource implements DecorationSource {

    /** Shared empty array to avoid allocations */
    private static readonly EMPTY_DECORATION_LIST: ReadonlyArray<PmDecoration> = [];
    /** Shared empty array for children to avoid allocations */
    private static readonly EMPTY_DECORATIONSET_LIST: ReadonlyArray<DecorationSet> = [];

    /** Sentinel value indicating a child decoration set was touched by a change */
    private static readonly CHILD_TOUCHED = -1;

    /** Sentinel value indicating a child decoration set was deleted by a change */
    private static readonly CHILD_DELETED = -2;

    /** Decorations that apply directly at this node level */
    private readonly _local: ReadonlyArray<PmDecoration>;
    /** Child decoration sets in the format [startPos, endPos, DecorationSet, ...] */
    private readonly _children: ReadonlyArray<number | DecorationSet>;

    /**
     * Creates a new decoration set.
     *
     * @param local - Decorations that apply to this node level
     * @param children - Child decoration sets in the format [startPos, endPos, DecorationSet, ...]
     */
    constructor (local?: ReadonlyArray<PmDecoration>, children?: ReadonlyArray<number | DecorationSet>) {
        super();
        this._local = local?.length ? local : DecorationSet.EMPTY_DECORATION_LIST;
        this._children = children?.length ? children : DecorationSet.EMPTY_DECORATIONSET_LIST;
    }

    /**
     * Get the decorations that apply directly at this node level.
     *
     * These are decorations that don't belong to any child node, such as
     * decorations that span across multiple children or widgets placed
     * between children.
     *
     * @returns Read-only array of local decorations
     */
    get local(): ReadonlyArray<PmDecoration> {
        return this._local;
    }

    /**
     * Get child decoration sets organized as [startPos, endPos, DecorationSet, ...].
     *
     * The array contains triplets where each triplet represents a child node:
     * - Index i: start position of the child
     * - Index i+1: end position of the child (startPos + nodeSize)
     * - Index i+2: DecorationSet containing decorations for that child
     *
     * @returns Read-only array of child positions and decoration sets
     */
    get children(): ReadonlyArray<number | DecorationSet> {
        return this._children;
    }


    /**
     * Create a set of decorations, using the structure of the given
     * document. This will consume (modify) the `decorations` array, so
     * you must make a copy if you want need to preserve that.
     *
     * @param doc - The document node to organize decorations around
     * @param decorations - Array of decorations to organize (will be mutated)
     * @returns A new decoration set organized by the document structure
     */
    public static create(doc: Node, decorations: Array<PmDecoration>): DecorationSet {
        return decorations.length ? DecorationSet.buildTree(decorations, doc, 0, DecorationSet.EMPTY_DECORATION_WIDGET_OPTIONS) : DecorationSet.empty;
    }

    /**
     * Find all decorations in this set which touch the given range
     * (including decorations that start or end directly at the
     * boundaries) and match the given predicate on their spec. When
     * `start` and `end` are omitted, all decorations in the set are
     * considered. When `predicate` isn't given, all decorations are
     * assumed to match.
     *
     * @param start - Starting position of the range to search (default: 0)
     * @param end - Ending position of the range to search (default: 1e9)
     * @param predicate - Optional function to filter decorations by their spec
     * @returns Array of decorations that match the criteria
     */
    public find(start?: number,
                end?: number,
                predicate?: (spec: DecorationSpec) => boolean): Array<PmDecoration> {
        const result: Array<PmDecoration> = [];
        this.findInner(isUndefinedOrNull(start) ? 0 : start, isUndefinedOrNull(end ) ? 1e9 : end, result, 0, predicate);
        return result;
    }

    /**
     * Internal recursive method to find decorations within a range.
     *
     * @param start - Starting position of the range
     * @param end - Ending position of the range
     * @param result - Accumulator array for matching decorations
     * @param offset - Current offset within the document
     * @param predicate - Optional filter function
     */
    private findInner(start: number,
                      end: number,
                      result: Array<PmDecoration>,
                      offset: number,
                      predicate?: (spec: DecorationSpec) => boolean): void {
        for (const span of this._local) {
            if (span.from <= end
                && span.to >= start
                && (!predicate || predicate(span.spec))) {

                result.push(span.copy(span.from + offset, span.to + offset));
            }
        }

        for (let i = 0; i < this._children.length; i += 3) {
            if ((this._children[i] as number) < end && (this._children[i + 1] as number) > start) {
                const childOff: number = (this._children[i] as number) + 1;
                (this._children[i + 2] as DecorationSet).findInner(start - childOff, end - childOff, result, offset + childOff, predicate);
            }
        }
    }

    /**
     * Map the set of decorations in response to a change in the
     * document.
     *
     * @param mapping - The mapping object representing document changes
     * @param doc - The updated document node
     * @param options - Optional configuration object
     * @param options.onRemove - Callback invoked for each decoration that gets dropped, passing its spec
     * @returns A new decoration set with mapped decorations
     */
    public map(mapping: Mapping,
               doc: Node,
               options?: { onRemove?: (decorationSpec: DecorationSpec) => void; }): DecorationSet {
        if (this === DecorationSet.empty || mapping.maps.length === 0) {
            return this;
        }
        return this.mapInner(mapping, doc, 0, 0, options || DecorationSet.EMPTY_DECORATION_WIDGET_OPTIONS);
    }

    /**
     * Internal recursive method to map decorations through document changes.
     *
     * @param mapping - The mapping object
     * @param node - The current node being processed
     * @param offset - Current position offset in the new document
     * @param oldOffset - Position offset in the old document
     * @param options - Configuration with optional onRemove callback
     * @returns A new mapped decoration set
     */
    public mapInner(mapping: Mapping,
                    node: Node,
                    offset: number,
                    oldOffset: number,
                    options: { onRemove?: (decorationSpec: DecorationSpec) => void; }): DecorationSet {
        let newLocal: Array<PmDecoration> | undefined;

        // Map local decorations
        for (const item of this._local) {
            const mapped: PmDecoration = item.map(mapping, offset, oldOffset);
            if (mapped?.type.valid(node, mapped)) {
                if (!newLocal) {
                    newLocal = [];
                }
                newLocal.push(mapped);
            } else if (options.onRemove) {
                options.onRemove(item.spec);
            }
        }

        // Handle children if present
        if (this._children.length) {
            return this.mapChildren(this._children, newLocal || [], mapping, node, offset, oldOffset, options);
        }

        // No children - return new set with only local decorations
        if(newLocal) {
            return new DecorationSet(DecorationSet.sortDecorations(newLocal), []);
        }

        // No children and no local decorations - return empty set
        return DecorationSet.empty;
    }

    /**
     * Add the given array of decorations to the ones in the set,
     * producing a new set. Consumes the `decorations` array. Needs
     * access to the current document to create the appropriate tree
     * structure.
     *
     * @param doc - The document node to organize decorations around
     * @param decorations - Array of decorations to add (will be mutated)
     * @returns A new decoration set with the added decorations
     */
    public add(doc: Node, decorations: Array<PmDecoration>): DecorationSet {
        if (!decorations.length) {
            return this;
        }
        if (this === DecorationSet.empty) {
            return DecorationSet.create(doc, decorations);
        }
        return this.addInner(doc, decorations, 0);
    }

    /**
     * Internal recursive method to add decorations to the set.
     *
     * @param doc - The current node being processed
     * @param decorations - Decorations to add (will be mutated)
     * @param offset - Current position offset
     * @returns A new decoration set with added decorations
     */
    private addInner(doc: Node, decorations: Array<PmDecoration>, offset: number): DecorationSet {
        let children: Array<number | DecorationSet> | undefined;
        let childIndex = 0;

        doc.forEach((childNode: Node, childOffset: number): void => {
            const baseOffset: number = childOffset + offset;
            let found: Array<PmDecoration>;
            if (!(found = DecorationSet.takeSpansForNode(decorations, childNode, baseOffset))) {
                return;
            }

            if (!children) {
                children = this._children.slice();
            }

            while (childIndex < children.length && (children[childIndex] as number) < childOffset) {
                childIndex += 3;
            }

            if (children[childIndex] === childOffset) {
                children[childIndex + 2] = (children[childIndex + 2] as DecorationSet).addInner(childNode, found, baseOffset + 1);
            } else {
                children.splice(childIndex, 0, childOffset, childOffset + childNode.nodeSize, DecorationSet.buildTree(found, childNode, baseOffset + 1, DecorationSet.EMPTY_DECORATION_WIDGET_OPTIONS));
            }
            childIndex += 3;
        });

        const local: Array<PmDecoration> = DecorationSet.moveSpans(childIndex ? DecorationSet.withoutNulls(decorations) : decorations, -offset);
        for (let i = 0; i < local.length; i++) {
            if (!local[i].type.valid(doc, local[i])) {
                local.splice(i--, 1);
            }
        }

        if(local.length) {
            const combinedAndSorted: Array<PmDecoration> = DecorationSet.sortDecorations(this._local.concat(local));
            return new DecorationSet(combinedAndSorted, children || this._children);
        }
        return new DecorationSet(this._local, children || this._children);
    }

    /**
     * Create a new set that contains the decorations in this set, minus
     * the ones in the given array.
     *
     * @param decorations - Array of decorations to remove
     * @returns A new decoration set without the removed decorations, or this if nothing changed
     */
    public remove(decorations: Array<PmDecoration>): DecorationSet {
        if (decorations.length === 0 || this === DecorationSet.empty) {
            return this;
        }
        return this.removeInner(decorations, 0);
    }

    /**
     * Internal recursive method to remove decorations from the set.
     * Uses null values in the decorations array to mark already-processed items.
     *
     * @param decorations - Array of decorations to remove (may contain nulls)
     * @param offset - Current position offset
     * @returns A new decoration set without the removed decorations, or this if nothing changed
     */
    private removeInner(decorations: Array<PmDecoration | null>, offset: number): DecorationSet {
        let children: Array<number | DecorationSet> = this._children as Array<number | DecorationSet>;
        let local: Array<PmDecoration> = this._local as Array<PmDecoration>;

        // Process child decoration sets
        for (let i = 0; i < children.length; i += 3) {
            let childDecorations: Array<PmDecoration> | null = null;
            const childFrom: number = (children[i] as number) + offset;
            const childTo: number = (children[i + 1] as number) + offset;

            // Find decorations that belong to this child
            for (let j = 0; j < decorations.length; j++) {
                const span: PmDecoration | null = decorations[j];
                if (span && span.from > childFrom && span.to < childTo) {
                    decorations[j] = null; // Mark as processed
                    if (!childDecorations) {
                        childDecorations = [];
                    }
                    childDecorations.push(span);
                }
            }

            if (!childDecorations) {
                continue;
            }

            // Ensure we're working with a mutable copy
            if (children === this._children) {
                children = this._children.slice();
            }

            // Recursively remove from child
            const removed: DecorationSet = (children[i + 2] as DecorationSet).removeInner(childDecorations, childFrom + 1);
            if (removed !== DecorationSet.empty) {
                children[i + 2] = removed;
            } else {
                // Child is now empty, remove it
                children.splice(i, 3);
                i -= 3;
            }
        }

        // Remove decorations from local array
        if (local.length) {
            for (const span of decorations) {
                if (span) {
                    for (let j = 0; j < local.length; j++) {
                        if (local[j].eq(span, offset)) {
                            // Ensure we're working with a mutable copy
                            if (local === this._local) {
                                local = this._local.slice();
                            }
                            local.splice(j--, 1);
                        }
                    }
                }
            }
        }

        // Return unchanged if nothing was modified
        if (children === this._children && local === this._local) {
            return this;
        }

        return local.length || children.length ? new DecorationSet(local, children) : DecorationSet.empty;
    }

    /**
     * Get the decorations relevant for a child node.
     *
     * @param offset - The offset position of the child node
     * @param node - The child node
     * @returns A decoration set or group for the child node
     */
    public forChild(offset: number, node: Node): DecorationSet | DecorationGroup {
        if (this === DecorationSet.empty) {
            return this;
        }
        if (node.isLeaf) {
            return DecorationSet.empty;
        }

        let child: DecorationSet | undefined;
        let local: Array<PmDecoration> | undefined;

        // Find the child decoration set at this offset
        for (let i = 0; i < this._children.length; i += 3) {
            if ((this._children[i] as number) >= offset) {
                if (this._children[i] === offset) {
                    child = this._children[i + 2] as DecorationSet;
                }
                break;
            }
        }

        // Calculate the range within the parent that this child occupies
        const start: number = offset + 1;
        const end: number = start + node.content.size;

        // Collect inline decorations that overlap with this child
        for (const dec of this._local) {
            if (dec.from < end && dec.to > start && (dec.type instanceof InlineType)) {
                const from: number = Math.max(start, dec.from) - start;
                const to: number = Math.min(end, dec.to) - start;
                if (from < to) {
                    (local || (local = [])).push(dec.copy(from, to));
                }
            }
        }

        // Combine local and child decorations if both exist
        if (local) {
            const sorted: Array<PmDecoration> = DecorationSet.sortDecorations(local);
            const localSet = new DecorationSet(sorted, []);
            return child ? new DecorationGroup([localSet, child]) : localSet;
        }
        return child || DecorationSet.empty;
    }

    /**
     * Check if this decoration set is equal to another decoration set.
     *
     * @param other - The decoration set to compare with
     * @returns True if the decoration sets are equal
     */
    public eq(other: DecorationSet): boolean {
        if (this === other) {
            return true;
        }

        if (!(other instanceof DecorationSet)
            || this._local.length !== other._local.length
            || this._children.length !== other._children.length) {
            return false;
        }

        // Compare local decorations
        for (let i = 0; i < this._local.length; i++) {
            if (!this._local[i].eq(other.local[i])) {
                return false;
            }
        }

        // Compare children (positions and decoration sets)
        for (let i = 0; i < this._children.length; i += 3) {
            if (this._children[i] !== other.children[i]
                || this._children[i + 1] !== other.children[i + 1]
                || !(this._children[i + 2] as DecorationSet).eq(other.children[i + 2] as DecorationSet)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get the local decorations for a node, with overlaps removed.
     *
     * @param node - The node to get decorations for
     * @returns Array of decorations with overlaps removed
     */
    public locals(node: Node): Array<PmDecoration> {
        return this.removeOverlap(this.localsInner(node));
    }

    /**
     * Get the local decorations for a node, filtering out inline decorations
     * if the node contains block content.
     *
     * @param node - The node to get decorations for
     * @returns Array of local decorations appropriate for the node
     */
    public localsInner(node: Node): ReadonlyArray<PmDecoration> {
        if (this === DecorationSet.empty) {
            return [];
        }

        // If node has inline content or there are no inline decorations, return all
        if (node.inlineContent || !this._local.some((span) => InlineType.is(span))) {
            return this._local;
        }

        // Filter out inline decorations for block content
        const result: Array<PmDecoration> = [];
        for (const item of this._local) {
            if (!(item.type instanceof InlineType)) {
                result.push(item);
            }
        }
        return result;
    }

    /**
     * The empty set of decorations. Use this constant instead of creating
     * new empty decoration sets.
     */
    public static empty: DecorationSet = new DecorationSet([], []);

    /**
     * Iterate over all decoration sets, calling the callback for each one.
     * For a single DecorationSet, this just calls the callback once with itself.
     *
     * @param callbackFunc - Function to call with this decoration set
     */
    public forEachSet(callbackFunc: (set: DecorationSet) => void): void {
        callbackFunc(this);
    }

    /**
     * Map child decoration sets through document changes. This is a complex
     * operation that tracks which children are affected by changes and rebuilds
     * the tree structure as needed.
     *
     * @param oldChildren - Original child decoration sets
     * @param newLocal - Array to collect newly mapped local decorations
     * @param mapping - The mapping representing document changes
     * @param node - The current node
     * @param offset - Current position offset in new document
     * @param oldOffset - Position offset in old document
     * @param options - Configuration with optional onRemove callback
     * @returns A new decoration set with mapped children
     */
    private mapChildren(oldChildren: ReadonlyArray<number | DecorationSet>,
                        newLocal: Array<PmDecoration>,
                        mapping: Mapping,
                        node: Node,
                        offset: number,
                        oldOffset: number,
                        options: { onRemove?: (decorationSpec: DecorationSpec) => void; }): DecorationSet {
        let children: Array<number | DecorationSet> = oldChildren as Array<number | DecorationSet>;
        let childrenCopied = false;

        // Mark the children that are directly touched by changes, and
        // move those that are after the changes.
        let baseOffset: number = oldOffset;
        for (const item of mapping.maps) {
            let moved = 0;
            item.forEach((oldStart: number, oldEnd: number, newStart: number, newEnd: number): void => {
                const dSize: number = (newEnd - newStart) - (oldEnd - oldStart);
                for (let i = 0; i < children.length; i += 3) {
                    const end = children[i + 1] as number;
                    if (end < 0 || oldStart > end + baseOffset - moved) {
                        continue;
                    }

                    const start: number = (children[i] as number) + baseOffset - moved;
                    if (oldEnd >= start) {
                        // Child is touched by this change
                        if (!childrenCopied) {
                            children = oldChildren.slice();
                            childrenCopied = true;
                        }
                        children[i + 1] = oldStart <= start ? DecorationSet.CHILD_DELETED : DecorationSet.CHILD_TOUCHED;
                    } else if (oldStart >= baseOffset && dSize) {
                        // Child is after the change, adjust positions
                        if (!childrenCopied) {
                            children = oldChildren.slice();
                            childrenCopied = true;
                        }
                        (children[i] as number) += dSize;
                        (children[i + 1] as number) += dSize;
                    }
                }
                moved += dSize;
            });

            baseOffset = item.map(baseOffset, -1);
        }

        // Find the child nodes that still correspond to a single node,
        // recursively call mapInner on them and update their positions.
        let mustRebuild = false;

        for (let i = 0; i < children.length; i += 3) {
            const childEnd = children[i + 1] as number;

            // Skip untouched children
            if (childEnd >= 0) {
                continue;
            }

            // Ensure we have a mutable copy before making changes
            if (!childrenCopied) {
                children = oldChildren.slice();
                childrenCopied = true;
            }

            // Touched nodes need special handling
            if (childEnd === DecorationSet.CHILD_DELETED) {
                mustRebuild = true;
                children[i + 1] = DecorationSet.CHILD_TOUCHED;
                continue;
            }

            const from: number = mapping.map((oldChildren[i] as number) + oldOffset);
            const fromLocal: number = from - offset;

            // Check if mapped position is still within node bounds
            if (fromLocal < 0 || fromLocal >= node.content.size) {
                mustRebuild = true;
                continue;
            }

            // Must read oldChildren because children was tagged with -1
            const to: number = mapping.map((oldChildren[i + 1] as number) + oldOffset, -1);
            const toLocal: number = to - offset;
            const { index, offset: childOffset } = node.content.findIndex(fromLocal);
            const childNode: Node = node.maybeChild(index);

            // Check if the child still corresponds to exactly one node
            if (childNode && childOffset === fromLocal && childOffset + childNode.nodeSize === toLocal) {
                const mapped: DecorationSet = (children[i + 2] as DecorationSet).mapInner(
                    mapping,
                    childNode,
                    from + 1,
                    (oldChildren[i] as number) + oldOffset + 1,
                    options);

                if (mapped !== DecorationSet.empty) {
                    children[i] = fromLocal;
                    children[i + 1] = toLocal;
                    children[i + 2] = mapped;
                } else {
                    children[i + 1] = DecorationSet.CHILD_DELETED;
                    mustRebuild = true;
                }
            } else {
                // Child was split or otherwise invalidated
                mustRebuild = true;
            }
        }

        // Remaining children must be collected and rebuilt into the appropriate structure
        if (mustRebuild) {
            // Gather all decorations from invalidated children
            const decorations: Array<PmDecoration> = this.mapAndGatherRemainingDecorations(
                children, oldChildren, newLocal, mapping, offset, oldOffset, options
            );
            const built: DecorationSet = DecorationSet.buildTree(decorations, node, 0, options);
            newLocal = built.local as Array<PmDecoration>;

            // Remove invalidated children (marked with negative values)
            for (let i = 0; i < children.length; i += 3) {
                if ((children[i + 1] as number) < 0) {
                    children.splice(i, 3);
                    i -= 3;
                }
            }

            // Merge in the newly built children at appropriate positions
            for (let i = 0, j = 0; i < built.children.length; i += 3) {
                const from = built.children[i] as number;
                // Find the insertion point
                while (j < children.length && (children[j] as number) < from) {
                    j += 3;
                }
                children.splice(j, 0, built.children[i] as number, built.children[i + 1] as number, built.children[i + 2] as DecorationSet);
            }
        }

        return new DecorationSet(DecorationSet.sortDecorations(newLocal), children);
    }

    /**
     * Build up a tree structure that corresponds to a set of decorations.
     * The offset is a base offset that should be subtracted from the `from`
     * and `to` positions in the spans (so that we don't have to allocate
     * new spans for recursive calls).
     *
     * @param spans - Array of decorations to organize (will be mutated)
     * @param node - The node to organize decorations around
     * @param offset - Base offset to subtract from decoration positions
     * @param options - Configuration with optional onRemove callback
     * @returns A new decoration set organized by the node structure
     */
    private static buildTree(spans: Array<PmDecoration>,
                             node: Node,
                             offset: number,
                             options: { onRemove?: (decorationSpec: DecorationSpec) => void; }): DecorationSet {
        const children: Array<DecorationSet | number> = [];
        let hasNulls = false;
        node.forEach((childNode: Node, localStart: number): void => {
            const found: Array<PmDecoration> = DecorationSet.takeSpansForNode(spans, childNode, localStart + offset);
            if (found) {
                hasNulls = true;
                const subtree: DecorationSet = this.buildTree(found, childNode, offset + localStart + 1, options);
                if (subtree !== DecorationSet.empty) {
                    children.push(localStart, localStart + childNode.nodeSize, subtree);
                }
            }
        });

        if(hasNulls) {
            spans = DecorationSet.withoutNulls(spans);
        }

        const locals: Array<PmDecoration> = DecorationSet.sortDecorations(DecorationSet.moveSpans(spans, -offset));
        for (let i = 0; i < locals.length; i++) {
            if (!locals[i].type.valid(node, locals[i])) {
                if (options.onRemove) {
                    options.onRemove(locals[i].spec);
                }
                locals.splice(i--, 1);
            }
        }
        return locals.length || children.length ? new DecorationSet(locals, children) : DecorationSet.empty;
    }

    /**
     * Adjust all decoration positions by the given offset.
     *
     * @param spans - Array of decorations to adjust
     * @param offset - Offset to add to positions
     * @returns New array with adjusted decorations, or original if offset is 0
     */
    private static moveSpans(spans: Array<PmDecoration>, offset: number): Array<PmDecoration> {
        if (!offset || !spans.length) {
            return spans;
        }

        const result: Array<PmDecoration> = [];
        for (const span of spans) {
            result.push(new Decoration(span.from + offset, span.to + offset, span.type));
        }
        return result;
    }

    /**
     * Recursively gather all decorations from a decoration set and its children,
     * mapping them through document changes.
     *
     * @param set - The decoration set to gather from
     * @param oldOffset - Offset in the old document
     * @param decorations - Accumulator array for decorations
     * @param mapping - The mapping representing document changes
     * @param offset - Offset in the new document
     * @param options - Configuration with optional onRemove callback
     */
    private gatherDecorationsFromSet(set: DecorationSet,
                                     oldOffset: number,
                                     decorations: Array<PmDecoration>,
                                     mapping: Mapping,
                                     offset: number,
                                     options: { onRemove?: (decorationSpec: DecorationSpec) => void; }): void {
        // Map and collect local decorations
        for (const item of set.local) {
            const mapped: PmDecoration = item.map(mapping, offset, oldOffset);
            if (mapped) {
                decorations.push(mapped);
            } else if (options.onRemove) {
                options.onRemove(item.spec);
            }
        }

        // Recursively process children
        for (let i = 0; i < set.children.length; i += 3) {
            this.gatherDecorationsFromSet(
                set.children[i + 2] as DecorationSet,
                set.children[i] as number + oldOffset + 1,
                decorations,
                mapping,
                offset,
                options
            );
        }
    }

    /**
     * Collect decorations from children that were invalidated during mapping.
     * These decorations will be reorganized into a new tree structure.
     *
     * @param children - Current child array (with marked invalid children)
     * @param oldChildren - Original child array
     * @param decorations - Accumulator array for decorations
     * @param mapping - The mapping representing document changes
     * @param offset - Offset in the new document
     * @param oldOffset - Offset in the old document
     * @param options - Configuration with optional onRemove callback
     * @returns The decorations array (same as input, for chaining)
     */
    private mapAndGatherRemainingDecorations(children: Array<number | DecorationSet>,
                                             oldChildren: ReadonlyArray<number | DecorationSet>,
                                             decorations: Array<PmDecoration>,
                                             mapping: Mapping,
                                             offset: number,
                                             oldOffset: number,
                                             options: { onRemove?: (decorationSpec: DecorationSpec) => void; }): Array<PmDecoration> {
        // Gather all decorations from the remaining marked children
        for (let i = 0; i < children.length; i += 3) {
            if (children[i + 1] === DecorationSet.CHILD_TOUCHED) {
                this.gatherDecorationsFromSet(
                    children[i + 2] as DecorationSet,
                    oldChildren[i] as number + oldOffset + 1,
                    decorations,
                    mapping,
                    offset,
                    options
                );
            }
        }

        return decorations;
    }

    /**
     * Extract decorations that belong to a specific node from an array,
     * marking extracted decorations as null in the original array.
     *
     * @param spans - Array of decorations (will be mutated)
     * @param node - The node to extract decorations for
     * @param offset - The offset of the node
     * @returns Array of decorations for this node, or null if none found
     */
    private static takeSpansForNode(spans: Array<PmDecoration | null>, node: Node, offset: number): Array<PmDecoration> | null {
        if (node.isLeaf) {
            return null;
        }

        const end: number = offset + node.nodeSize;
        let found: Array<PmDecoration> | null = null;

        for (let i = 0; i < spans.length; i++) {
            const span: PmDecoration | null = spans[i];
            if (span && span.from > offset && span.to < end) {
                found ??= [];
                found.push(span);
                spans[i] = null; // Mark as processed
            }
        }
        return found;
    }

    /**
     * Filter null values from an array.
     *
     * @param array - Array that may contain null values
     * @returns New array with null values removed
     */
    private static withoutNulls<T>(array: ReadonlyArray<T | null>): Array<T> {
        const result: Array<T> = [];
        for (const item of array) {
            if (item !== null) {
                result.push(item);
            }
        }
        return result;
    }
}
