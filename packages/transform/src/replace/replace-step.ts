import {type Attrs, type ContentMatch, Fragment, type NodeType, type PmNode, type ResolvedPos, Slice} from '@type-editor/model';

import {ReplaceAroundStep} from '../change-steps/ReplaceAroundStep';
import {ReplaceStep} from '../change-steps/ReplaceStep';
import type {Step} from '../change-steps/Step';
import {fitsTrivially} from './util';

/**
 * Information about a position where content from the slice can be placed.
 */
interface Fittable {
    /** Depth in the slice where the content comes from */
    sliceDepth: number;
    /** Depth in the frontier where the content should be placed */
    frontierDepth: number;
    /** Parent node at the slice depth, if any */
    parent: PmNode | null;
    /** Optional fragment to inject before the content */
    inject?: Fragment | null;
    /** Optional node types to wrap the content in */
    wrap?: ReadonlyArray<NodeType>;
}

/**
 * Algorithm for 'placing' the elements of a slice into a gap:
 *
 * We consider the content of each node that is open to the left to be
 * independently placeable. I.e. in <p('foo'), p('bar')>, when the
 * paragraph on the left is open, 'foo' can be placed (somewhere on
 * the left side of the replacement gap) independently from p('bar').
 *
 * This class tracks the state of the placement progress in the
 * following properties:
 *
 *  - `frontier` holds a stack of `{type, match}` objects that
 *    represent the open side of the replacement. It starts at
 *    `$from`, then moves forward as content is placed, and is finally
 *    reconciled with `$to`.
 *
 *  - `unplacedContent` is a slice that represents the content that hasn't
 *    been placed yet.
 *
 *  - `placedContent` is a fragment of placed content. Its open-start value
 *    is implicit in `$from`, and its open-end value in `frontier`.
 */
class Fitter {

    private readonly frontier: Array<{ type: NodeType, match: ContentMatch; }> = [];
    private readonly $from: ResolvedPos;
    private readonly $to: ResolvedPos;

    private placedContent: Fragment = Fragment.empty;
    private unplacedContent: Slice;

    /**
     * Create a new Fitter to fit a slice between two positions.
     *
     * @param $from - Resolved start position
     * @param $to - Resolved end position
     * @param unplaced - The slice to fit into the gap
     */
    constructor($from: ResolvedPos, $to: ResolvedPos, unplaced: Slice) {
        this.$from = $from;
        this.$to = $to;
        this.unplacedContent = unplaced;

        for (let i = 0; i <= $from.depth; i++) {
            const node: PmNode = $from.node(i);
            this.frontier.push({
                type: node.type,
                match: node.contentMatchAt($from.indexAfter(i))
            });
        }

        for (let i = $from.depth; i > 0; i--) {
            this.placedContent = Fragment.from($from.node(i).copy(this.placedContent));
        }
    }

    /**
     * Get the current depth of the frontier.
     */
    get depth(): number {
        return this.frontier.length - 1;
    }

    /**
     * Fit the slice into the document, producing a step that performs the replacement.
     *
     * @returns A ReplaceStep or ReplaceAroundStep, or null if fitting is not possible
     */
    public fit(): ReplaceAroundStep | ReplaceStep | null {
        // As long as there's unplaced content, try to place some of it.
        // If that fails, either increase the open score of the unplaced
        // slice, or drop nodes from it, and then try again.
        while (this.unplacedContent.size) {
            const fit: Fittable = this.findFittable();
            if (fit) {
                this.placeNodes(fit);
            } else if (!this.openMore()) {
                this.dropNode();
            }
        }
        // When there's inline content directly after the frontier _and_
        // directly after `this.$to`, we must generate a `ReplaceAround`
        // step that pulls that content into the node after the frontier.
        // That means the fitting must be done to the end of the textblock
        // node after `this.$to`, not `this.$to` itself.
        const moveInline: number = this.mustMoveInline();
        const placedSize: number = this.placedContent.size - this.depth - this.$from.depth;
        const $from: ResolvedPos = this.$from;
        const $to: ResolvedPos = this.close(moveInline < 0 ? this.$to : $from.doc.resolve(moveInline));
        if (!$to) {
            return null;
        }

        // If closing to `$to` succeeded, create a step
        let content: Fragment = this.placedContent;
        let openStart: number = $from.depth;
        let openEnd: number = $to.depth;

        // Normalize by dropping open parent nodes
        while (openStart && openEnd && content.childCount === 1) {
            content = content.firstChild.content;
            openStart--;
            openEnd--;
        }

        const slice: Slice = new Slice(content, openStart, openEnd);
        if (moveInline > -1) {
            return new ReplaceAroundStep($from.pos, moveInline, this.$to.pos, this.$to.end(), slice, placedSize);
        }

        // Don't generate no-op steps
        if (slice.size || $from.pos !== this.$to.pos) {
            return new ReplaceStep($from.pos, $to.pos, slice);
        }
        return null;
    }

    /**
     * Find a position on the start spine of `this.unplaced` that has
     * content that can be moved somewhere on the frontier. Returns two
     * depths, one for the slice and one for the frontier.
     *
     * @returns Fittable information or undefined if no fit is found
     */
    private findFittable(): Fittable | undefined {
        const adjustedStartDepth: number = this.findNonIsolatingDepth();

        // Try pass 1: direct matching without wrapping
        const directMatch: Fittable | undefined = this.tryDirectMatching(adjustedStartDepth);
        if (directMatch) {
            return directMatch;
        }

        // Try pass 2: matching with wrapping nodes
        return this.tryWrappedMatching();
    }

    /**
     * Find the depth up to which we can safely place content,
     * stopping at isolating nodes.
     *
     * @returns The maximum safe depth for placement
     */
    private findNonIsolatingDepth(): number {
        const startDepth: number = this.unplacedContent.openStart;
        let openEnd: number = this.unplacedContent.openEnd;
        let currentFragment: Fragment = this.unplacedContent.content;

        for (let depth = 0; depth < startDepth; depth++) {
            const node: PmNode = currentFragment.firstChild;
            if (currentFragment.childCount > 1) {
                openEnd = 0;
            }
            if (node.type.spec.isolating && openEnd <= depth) {
                return depth;
            }
            currentFragment = node.content;
        }

        return startDepth;
    }

    /**
     * Pass 1: Try to find a position where content fits directly
     * (without wrapping).
     *
     * @param startDepth - The depth to start searching from
     * @returns Fittable information or undefined if no direct fit is found
     */
    private tryDirectMatching(startDepth: number): Fittable | undefined {
        for (let sliceDepth = startDepth; sliceDepth >= 0; sliceDepth--) {
            const {fragment, parent} = this.getFragmentAtDepth(sliceDepth);
            const firstChild: PmNode | null = fragment.firstChild;

            for (let frontierDepth = this.depth; frontierDepth >= 0; frontierDepth--) {
                const {type, match} = this.frontier[frontierDepth];

                const directFit: Fittable = this.tryDirectFit(firstChild, parent, type, match, sliceDepth, frontierDepth);
                if (directFit) {
                    return directFit;
                }

                // Don't continue looking further up if the parent node would fit here
                if (parent && match.matchType(parent.type)) {
                    break;
                }
            }
        }
        return undefined;
    }

    /**
     * Pass 2: Try to find a position where content fits with wrapping nodes.
     *
     * @returns Fittable information or undefined if no wrapped fit is found
     */
    private tryWrappedMatching(): Fittable | undefined {
        for (let sliceDepth = this.unplacedContent.openStart; sliceDepth >= 0; sliceDepth--) {
            const {fragment, parent} = this.getFragmentAtDepth(sliceDepth);
            const firstChild: PmNode | null = fragment.firstChild;

            if (!firstChild) {
                continue;
            }

            for (let frontierDepth = this.depth; frontierDepth >= 0; frontierDepth--) {
                const {match} = this.frontier[frontierDepth];

                const wrap: ReadonlyArray<NodeType> = match.findWrapping(firstChild.type);
                if (wrap) {
                    return {sliceDepth, frontierDepth, parent, wrap};
                }

                // Don't continue looking further up if the parent node would fit here
                if (parent && match.matchType(parent.type)) {
                    break;
                }
            }
        }
        return undefined;
    }

    /**
     * Get the fragment and parent node at a specific depth in the unplaced slice.
     *
     * @param sliceDepth - The depth to extract from
     * @returns Object containing the fragment and parent node
     */
    private getFragmentAtDepth(sliceDepth: number): { fragment: Fragment, parent: PmNode | null } {
        if (sliceDepth > 0) {
            const parent: PmNode = this.contentAt(this.unplacedContent.content, sliceDepth - 1).firstChild;
            return {fragment: parent.content, parent};
        }
        return {fragment: this.unplacedContent.content, parent: null};
    }

    /**
     * Try to fit content directly at the frontier (pass 1 logic).
     * Returns a Fittable result if successful, undefined otherwise.
     *
     * @param first - The first child node to fit
     * @param parent - The parent node
     * @param type - The node type at the frontier
     * @param match - The content match at the frontier
     * @param sliceDepth - Depth in the slice
     * @param frontierDepth - Depth in the frontier
     * @returns Fittable information or undefined
     */
    private tryDirectFit(first: PmNode | null,
                         parent: PmNode | null,
                         type: NodeType,
                         match: ContentMatch,
                         sliceDepth: number,
                         frontierDepth: number): Fittable | undefined {

        // Case 1: We have a first child and it matches the frontier
        if (first && match.matchType(first.type)) {
            return {sliceDepth, frontierDepth, parent, inject: null};
        }

        // Case 2: We have a first child and can inject filler content before it
        if (first) {
            const inject: Fragment = match.fillBefore(Fragment.from(first), false);
            if (inject) {
                return {sliceDepth, frontierDepth, parent, inject};
            }
        }

        // Case 3: No first child, but parent types are compatible
        if (!first && parent && type.compatibleContent(parent.type)) {
            return {sliceDepth, frontierDepth, parent, inject: null};
        }

        return undefined;
    }

    /**
     * Try to open the unplaced slice deeper to expose more content.
     *
     * @returns True if successfully opened deeper, false otherwise
     */
    private openMore(): boolean {
        const {content, openStart, openEnd} = this.unplacedContent;
        const inner: Fragment = this.contentAt(content, openStart);

        if (!inner.childCount || inner.firstChild.isLeaf) {
            return false;
        }

        const finalOpenEnd: number = Math.max(openEnd, inner.size + openStart >= content.size - openEnd ? openStart + 1 : 0);
        this.unplacedContent = new Slice(content, openStart + 1, finalOpenEnd);
        return true;
    }

    /**
     * Drop a node from the unplaced slice when it can't be fit.
     */
    private dropNode(): void {
        const {content, openStart, openEnd} = this.unplacedContent;
        const inner: Fragment = this.contentAt(content, openStart);

        if (inner.childCount <= 1 && openStart > 0) {
            const openAtEnd: boolean = content.size - openStart <= openStart + inner.size;
            const fragment: Fragment = this.dropFromFragment(content, openStart - 1, 1);
            this.unplacedContent = new Slice(fragment, openStart - 1, openAtEnd ? openStart - 1 : openEnd);
        } else {
            const fragment: Fragment = this.dropFromFragment(content, openStart, 1);
            this.unplacedContent = new Slice(fragment, openStart, openEnd);
        }
    }

    /**
     * Move content from the unplaced slice at `sliceDepth` to the
     * frontier node at `frontierDepth`. Close that frontier node when
     * applicable.
     *
     * @param fittable - Information about where and how to place the content
     */
    private placeNodes({sliceDepth, frontierDepth, parent, inject, wrap}: Fittable): void {
        this.prepareFrontier(frontierDepth, wrap);

        const slice: Slice = this.unplacedContent;
        const fragment: Fragment = parent ? parent.content : slice.content;
        const openStart: number = slice.openStart - sliceDepth;

        const {nodesToAdd, match, taken, openEndCount} = this.fitFragmentIntoFrontier(
            fragment,
            frontierDepth,
            sliceDepth,
            openStart,
            inject
        );

        const placedAllContent: boolean = taken === fragment.childCount;
        const finalOpenEndCount: number = placedAllContent ? openEndCount : -1;

        this.updatePlacedContent(frontierDepth, nodesToAdd, match);
        this.closeMatchingParentNode(placedAllContent, finalOpenEndCount, parent);
        this.addOpenEndNodes(fragment, finalOpenEndCount);
        this.updateUnplacedContent(slice, sliceDepth, taken, placedAllContent, finalOpenEndCount);
    }

    /**
     * Prepare the frontier by closing nodes and opening wrap nodes.
     *
     * @param frontierDepth - Target frontier depth
     * @param wrap - Optional array of node types to wrap content in
     */
    private prepareFrontier(frontierDepth: number, wrap?: ReadonlyArray<NodeType>): void {
        while (this.depth > frontierDepth) {
            this.closeFrontierNode();
        }

        if (wrap) {
            for (const wrapType of wrap) {
                this.openFrontierNode(wrapType);
            }
        }
    }

    /**
     * Fit as many nodes from the fragment into the frontier as possible.
     *
     * @param fragment - The fragment containing nodes to fit
     * @param frontierDepth - Depth in the frontier
     * @param sliceDepth - Depth in the slice
     * @param openStart - How many levels the start is open
     * @param inject - Optional fragment to inject before content
     * @returns Information about the fitted nodes
     */
    private fitFragmentIntoFrontier(fragment: Fragment,
                                    frontierDepth: number,
                                    sliceDepth: number,
                                    openStart: number,
                                    inject?: Fragment | null): { nodesToAdd: Array<PmNode>, match: ContentMatch, taken: number, openEndCount: number } {
        let taken = 0;
        const nodesToAdd: Array<PmNode> = [];
        let {match} = this.frontier[frontierDepth];
        const {type} = this.frontier[frontierDepth];

        if (inject) {
            for (let i = 0; i < inject.childCount; i++) {
                nodesToAdd.push(inject.child(i));
            }
            match = match.matchFragment(inject);
        }

        // Computes the amount of (end) open nodes at the end.
        // When 0, the parent is open, but no more. When negative, nothing is open.
        const openEndCount: number = Math.max(-1,
            (fragment.size + sliceDepth) - (this.unplacedContent.content.size - this.unplacedContent.openEnd)
        );

        // Scan over the fragment, fitting as many child nodes as possible
        while (taken < fragment.childCount) {
            const nextNode: PmNode = fragment.child(taken);
            const matchResult: ContentMatch | null = match.matchType(nextNode.type);

            if (!matchResult) {
                break;
            }

            taken++;

            // Drop empty open nodes
            if (this.shouldIncludeNode(taken, openStart, nextNode)) {
                match = matchResult;
                const nodeOpenStart: number = taken === 1 ? openStart : 0;
                const nodeOpenEnd: number = taken === fragment.childCount ? openEndCount : -1;
                const markedNode: PmNode = nextNode.mark(type.allowedMarks(nextNode.marks));
                nodesToAdd.push(this.closeNodeStart(markedNode, nodeOpenStart, nodeOpenEnd));
            }
        }

        return {nodesToAdd, match, taken, openEndCount};
    }

    /**
     * Close a node at the start by filling in required content before it,
     * and optionally at the end.
     *
     * @param node - The node to close
     * @param openStart - How many levels the start is open
     * @param openEnd - How many levels the end is open
     * @returns The closed node
     */
    private closeNodeStart(node: PmNode,
                           openStart: number,
                           openEnd: number): PmNode {
        if (openStart <= 0) {
            return node;
        }

        let content: Fragment = node.content;

        // Recursively close nested open nodes
        if (openStart > 1) {
            const firstChild: PmNode = content.firstChild;
            const childOpenEnd: number = content.childCount === 1 ? openEnd - 1 : 0;
            const closedFirstChild: PmNode = this.closeNodeStart(firstChild, openStart - 1, childOpenEnd);
            content = content.replaceChild(0, closedFirstChild);
        }

        // Fill required content before the existing content
        const filledBefore: Fragment = node.type.contentMatch.fillBefore(content);
        content = filledBefore.append(content);

        // Fill required content after if the node should be closed at the end
        if (openEnd <= 0) {
            const matchedContent: ContentMatch = node.type.contentMatch.matchFragment(content);
            const filledAfter: Fragment = matchedContent.fillBefore(Fragment.empty, true);
            content = content.append(filledAfter);
        }

        return node.copy(content);
    }

    /**
     * Check if a node should be included (not an empty open node).
     *
     * @param nodeIndex - Index of the node (1-based)
     * @param openStart - How many levels the start is open
     * @param node - The node to check
     * @returns True if the node should be included
     */
    private shouldIncludeNode(nodeIndex: number,
                              openStart: number,
                              node: PmNode): boolean {
        return nodeIndex > 1 || openStart === 0 || node.content.size > 0;
    }

    /**
     * Update the placed content with the newly added nodes.
     *
     * @param frontierDepth - Depth in the frontier
     * @param nodesToAdd - Array of nodes to add
     * @param match - Updated content match
     */
    private updatePlacedContent(frontierDepth: number,
                                nodesToAdd: Array<PmNode>,
                                match: ContentMatch): void {
        this.placedContent = this.addToFragment(this.placedContent, frontierDepth, Fragment.from(nodesToAdd));
        this.frontier[frontierDepth].match = match;
    }

    /**
     * Close the frontier node if parent types match and all content was placed.
     *
     * @param placedAllContent - Whether all content was placed
     * @param openEndCount - Number of open nodes at the end
     * @param parent - The parent node
     */
    private closeMatchingParentNode(placedAllContent: boolean,
                                    openEndCount: number,
                                    parent: PmNode | null): void {
        if (placedAllContent
            && openEndCount < 0
            && parent?.type === this.frontier[this.depth].type
            && this.frontier.length > 1) {
            this.closeFrontierNode();
        }
    }

    /**
     * Add new frontier nodes for any open nodes at the end.
     *
     * @param fragment - The fragment containing open end nodes
     * @param openEndCount - Number of open nodes at the end
     */
    private addOpenEndNodes(fragment: Fragment, openEndCount: number): void {
        let currentFragment: Fragment = fragment;
        for (let i = 0; i < openEndCount; i++) {
            const lastChild: PmNode = currentFragment.lastChild;
            this.frontier.push({
                type: lastChild.type,
                match: lastChild.contentMatchAt(lastChild.childCount)
            });
            currentFragment = lastChild.content;
        }
    }

    /**
     * Update the unplaced slice after placing nodes.
     *
     * @param slice - The current unplaced slice
     * @param sliceDepth - Depth in the slice
     * @param taken - Number of nodes taken
     * @param placedAllContent - Whether all content was placed
     * @param openEndCount - Number of open nodes at the end
     */
    private updateUnplacedContent(slice: Slice,
                                  sliceDepth: number,
                                  taken: number,
                                  placedAllContent: boolean,
                                  openEndCount: number): void {
        if (!placedAllContent) {
            // Not all content was placed - drop only the nodes that were placed
            this.unplacedContent = new Slice(
                this.dropFromFragment(slice.content, sliceDepth, taken),
                slice.openStart,
                slice.openEnd
            );
        } else if (sliceDepth === 0) {
            // All content at top level was placed - we're done
            this.unplacedContent = Slice.empty;
        } else {
            // All content at this depth was placed - drop the parent node
            const newOpenEnd = openEndCount < 0 ? slice.openEnd : sliceDepth - 1;
            this.unplacedContent = new Slice(
                this.dropFromFragment(slice.content, sliceDepth - 1, 1),
                sliceDepth - 1,
                newOpenEnd
            );
        }
    }

    /**
     * Determine if inline content must be moved and where to move it to.
     * Returns -1 if inline content doesn't need to be moved, otherwise
     * returns the position to move to.
     *
     * @returns Position to move inline content to, or -1 if no move needed
     */
    private mustMoveInline(): number {
        if (!this.$to.parent.isTextblock) {
            return -1;
        }

        if (!this.canMoveInline()) {
            return -1;
        }

        return this.findInlineMovePosition();
    }

    /**
     * Check if inline content can be moved into the frontier.
     *
     * @returns True if inline content can be moved
     */
    private canMoveInline(): boolean {
        const top = this.frontier[this.depth];

        if (!top.type.isTextblock) {
            return false;
        }

        if (!this.contentAfterFits(this.$to, this.$to.depth, top.type, top.match, false)) {
            return false;
        }

        // Check if we would close at the same depth (which means no move needed)
        if (this.$to.depth === this.depth) {
            const closeLevel = this.findCloseLevel(this.$to);
            if (closeLevel?.depth === this.depth) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check if content after a position fits at a given depth.
     *
     * @param $to - Resolved position
     * @param depth - Depth to check at
     * @param type - Node type to match against
     * @param match - Content match to use
     * @param open - Whether to use the position after the current index
     * @returns The filled fragment if it fits, null otherwise
     */
    private contentAfterFits($to: ResolvedPos,
                             depth: number,
                             type: NodeType,
                             match: ContentMatch,
                             open: boolean): Fragment | null {
        const node: PmNode = $to.node(depth);
        const index: number = open ? $to.indexAfter(depth) : $to.index(depth);

        if (index === node.childCount && !type.compatibleContent(node.type)) {
            return null;
        }

        const fit: Fragment = match.fillBefore(node.content, true, index);
        return fit && !this.invalidMarks(type, node.content, index) ? fit : null;
    }

    /**
     * Check if any marks in a fragment are invalid for the given node type.
     *
     * @param type - The node type to check against
     * @param fragment - The fragment containing marked nodes
     * @param start - Start index to check from
     * @returns True if any invalid marks are found
     */
    private invalidMarks(type: NodeType, fragment: Fragment, start: number): boolean {
        for (let i = start; i < fragment.childCount; i++) {
            if (!type.allowsMarks(fragment.child(i).marks)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Find the position to move inline content to.
     *
     * @returns The position to move content to
     */
    private findInlineMovePosition(): number {
        let depth = this.$to.depth;
        let after: number = this.$to.after(depth);

        // Move up through depths that end at the same position
        while (depth > 1 && after === this.$to.end(--depth)) {
            ++after;
        }

        return after;
    }

    /**
     * Find a level at which the frontier can be closed to match $to.
     *
     * @param $to - The resolved position to close to
     * @returns Information about where to close, or undefined if not possible
     */
    private findCloseLevel($to: ResolvedPos): { depth: number, fit: Fragment, move: ResolvedPos } | undefined {
        for (let i = Math.min(this.depth, $to.depth); i >= 0; i--) {
            const {match, type} = this.frontier[i];
            const dropInner: boolean = i < $to.depth && $to.end(i + 1) === $to.pos + ($to.depth - (i + 1));
            const fit: Fragment = this.contentAfterFits($to, i, type, match, dropInner);

            if (!fit) {
                continue;
            }

            // Check if all frontier levels below this one are valid
            if (!this.canCloseAtDepth($to, i)) {
                continue;
            }

            return {depth: i, fit, move: dropInner ? $to.doc.resolve($to.after(i + 1)) : $to};
        }
    }

    /**
     * Check if we can close the frontier at the given depth by validating
     * all frontier levels below it.
     *
     * @param $to - The resolved position to close to
     * @param depth - The depth to check
     * @returns True if we can close at this depth
     */
    private canCloseAtDepth($to: ResolvedPos, depth: number): boolean {
        for (let d = depth - 1; d >= 0; d--) {
            const {match, type} = this.frontier[d];
            const matches: Fragment = this.contentAfterFits($to, d, type, match, true);
            if (!matches || matches.childCount) {
                return false;
            }
        }
        return true;
    }

    /**
     * Close the frontier to match the target position.
     *
     * @param $to - The resolved position to close to
     * @returns The final resolved position after closing, or null if closing failed
     */
    private close($to: ResolvedPos): ResolvedPos | null {
        const close = this.findCloseLevel($to);
        if (!close) {
            return null;
        }

        while (this.depth > close.depth) {
            this.closeFrontierNode();
        }

        if (close.fit.childCount) {
            this.placedContent = this.addToFragment(this.placedContent, close.depth, close.fit);
        }

        $to = close.move;
        for (let depth = close.depth + 1; depth <= $to.depth; depth++) {
            const node: PmNode = $to.node(depth);
            const add: Fragment = node.type.contentMatch.fillBefore(node.content, true, $to.index(depth));
            this.openFrontierNode(node.type, node.attrs, add);
        }
        return $to;
    }

    /**
     * Open a new node at the frontier.
     *
     * @param type - The node type to open
     * @param attrs - Optional attributes for the node
     * @param content - Optional content for the node
     */
    private openFrontierNode(type: NodeType,
                             attrs: Attrs | null = null,
                             content?: Fragment): void {
        const frontierTop = this.frontier[this.depth];
        frontierTop.match = frontierTop.match.matchType(type);
        this.placedContent = this.addToFragment(this.placedContent, this.depth, Fragment.from(type.create(attrs, content)));
        this.frontier.push({type, match: type.contentMatch});
    }

    /**
     * Close the topmost frontier node.
     */
    private closeFrontierNode(): void {
        const closeNode = this.frontier.pop();
        const add: Fragment = closeNode.match.fillBefore(Fragment.empty, true);
        if (add.childCount) {
            this.placedContent = this.addToFragment(this.placedContent, this.frontier.length, add);
        }
    }

    /**
     * Navigate to content at a specific depth within a fragment.
     *
     * @param fragment - The starting fragment
     * @param depth - The depth to navigate to
     * @returns The fragment at the specified depth
     */
    private contentAt(fragment: Fragment, depth: number): Fragment {
        for (let i = 0; i < depth; i++) {
            const firstChild: PmNode = fragment.firstChild;
            if (!firstChild) {
                throw new RangeError(`Cannot access depth ${depth}, fragment only has depth ${i}`);
            }
            fragment = firstChild.content;
        }
        return fragment;
    }

    /**
     * Drop nodes from a fragment at a specific depth.
     *
     * @param fragment - The fragment to modify
     * @param depth - The depth to drop from
     * @param count - Number of nodes to drop
     * @returns The modified fragment
     */
    private dropFromFragment(fragment: Fragment,
                             depth: number,
                             count: number): Fragment {
        if (depth === 0) {
            return fragment.cutByIndex(count, fragment.childCount);
        }
        const droppedFragment: Fragment = this.dropFromFragment(fragment.firstChild.content, depth - 1, count);
        const fragmentChild: PmNode = fragment.firstChild.copy(droppedFragment);
        return fragment.replaceChild(0, fragmentChild);
    }

    /**
     * Add content to a fragment at a specific depth.
     *
     * @param fragment - The fragment to modify
     * @param depth - The depth to add at
     * @param content - The content to add
     * @returns The modified fragment
     */
    private addToFragment(fragment: Fragment,
                          depth: number,
                          content: Fragment): Fragment {
        if (depth === 0) {
            return fragment.append(content);
        }
        const addedFragment: Fragment = this.addToFragment(fragment.lastChild.content, depth - 1, content);
        const lastChildFragment: PmNode = fragment.lastChild.copy(addedFragment);
        return fragment.replaceChild(fragment.childCount - 1, lastChildFragment);
    }
}

/**
 * 'Fit' a slice into a given position in the document, producing a
 * [step](#transform.Step) that inserts it. Will return null if
 * there's no meaningful way to insert the slice here, or inserting it
 * would be a no-op (an empty slice over an empty range).
 *
 * @param doc - The document to insert into
 * @param from - The start position
 * @param to - The end position (defaults to from)
 * @param slice - The slice to insert (defaults to empty slice)
 * @returns A step that performs the insertion, or null if not possible
 */
export function replaceStep(doc: PmNode,
                            from: number,
                            to = from,
                            slice = Slice.empty): Step | null {
    if (from === to && !slice.size) {
        return null;
    }

    const $from: ResolvedPos = doc.resolve(from);
    const $to: ResolvedPos = doc.resolve(to);

    if (fitsTrivially($from, $to, slice)) {
        return new ReplaceStep(from, to, slice);
    }
    return new Fitter($from, $to, slice).fit();
}
