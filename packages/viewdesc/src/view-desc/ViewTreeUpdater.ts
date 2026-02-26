import {isFalse, isUndefinedOrNull} from '@type-editor/commons';
import {ELEMENT_NODE} from '@type-editor/commons';
import type {WidgetType} from '@type-editor/decoration';
import type {DecorationSource, PmDecoration, PmEditorView, PmViewDesc} from '@type-editor/editor-types';
import type {Fragment, Mark, PmNode} from '@type-editor/model';

import type {MarkViewDesc} from './MarkViewDesc';
import type {NodeViewDesc} from './NodeViewDesc';
import {sameOuterDeco} from './util/same-outer-deco';
import type {ViewDesc} from './ViewDesc';
import {ViewDescFactory} from './ViewDescFactory';
import {ViewDescType} from './ViewDescType';
import {ViewDescUpdater} from './ViewDescUpdater';
import {ViewDirtyState} from './ViewDirtyState';
import type {WidgetViewDesc} from './WidgetViewDesc';


/**
 * Helper class for incrementally updating a tree of mark descs and
 * the widget and node descs inside of them.
 *
 * This class maintains a cursor through the existing view desc tree while
 * iterating through the new document content, trying to reuse existing
 * view descs where possible. It handles:
 * - Nested mark descs (maintains a stack as it enters/exits marks)
 * - Node and widget descs
 * - DOM composition protection (won't modify locked nodes)
 */
export class ViewTreeUpdater {

    private readonly lock: Node | null;       // DOM node to protect (during composition)
    private readonly view: PmEditorView;
    private readonly preMatch: { index: number, matched: Map<ViewDesc, number>, matches: ReadonlyArray<ViewDesc>; };
    /**
     * Stack for nested mark descs: [parent, index, parent, index, ...]
     * When entering a mark, the current top and index are pushed onto this.
     */
    private readonly stack: Array<ViewDesc | number> = [];

    /**
     * Index into `this.top`'s child array, represents the current update position.
     */
    private index = 0;

    /**
     * Current view desc being updated (changes as we enter/exit marks)
     */
    private top: ViewDesc;

    /**
     * Tracks whether anything was changed
     */
    private _changed = false;

    /**
     * Creates a new ViewTreeUpdater.
     *
     * @param top - The top-level node view description to update
     * @param lock - A DOM node that should not be modified (typically during composition)
     * @param view - The editor view
     */
    constructor(top: NodeViewDesc,
                lock: Node | null,
                view: PmEditorView) {
        this.top = top;
        this.lock = lock;
        this.view = view;
        this.preMatch = this.findPreMatch(top.node.content, top);
    }


    get changed(): boolean {
        return this._changed;
    }

    /**
     * Destroy all remaining children in `this.top` from the current index onwards.
     */
    public destroyRemaining(): void {
        this.destroyBetween(this.index, this.top.children.length);
    }

    /**
     * Syncs the current stack of mark descs with the given array of marks.
     *
     * This maintains proper mark nesting by:
     * 1. Finding how many marks from the stack can be kept
     * 2. Popping marks that don't match
     * 3. Pushing new marks or reusing existing ones
     *
     * The stack stores pairs of [ViewDesc, index], so depth = stack.length / 2
     *
     * @param marks - The marks to sync to
     * @param inline - Whether the content is inline
     * @param parentIndex
     */
    public syncToMarks(marks: ReadonlyArray<Mark>,
                       inline: boolean,
                       parentIndex: number): void {
        const depth: number = this.stack.length >> 1;
        const keep: number = this.findKeepableMarks(marks, depth);

        this.popUnmatchedMarks(keep, depth);
        this.pushNewMarks(keep, marks, inline, parentIndex);
    }

    /**
     * Try to find a node desc matching the given data. Skip over it and
     * return true when successful.
     *
     * @param node - The node to find a match for
     * @param outerDeco - Outer decorations for the node
     * @param innerDeco - Inner decorations for the node
     * @param index - The index in the parent's child array
     * @returns True if a match was found and used
     */
    public findNodeMatch(node: PmNode,
                         outerDeco: ReadonlyArray<PmDecoration>,
                         innerDeco: DecorationSource,
                         index: number): boolean {
        let found = -1;
        const targetDesc: ViewDesc | null = index >= this.preMatch.index ? this.preMatch.matches[index - this.preMatch.index] : null;

        if (index >= this.preMatch.index
            && targetDesc?.parent === this.top
            && targetDesc.matchesNode(node, outerDeco, innerDeco)) {
            found = this.top.children.indexOf(targetDesc, this.index);
        } else {
            for (let i = this.index, e = Math.min(this.top.children.length, i + 5); i < e; i++) {
                const child: ViewDesc = this.top.children[i];
                if (child.matchesNode(node, outerDeco, innerDeco) && !this.preMatch.matched.has(child)) {
                    found = i;
                    break;
                }
            }
        }

        if (found < 0) {
            return false;
        }

        this.destroyBetween(this.index, found);
        this.index++;
        return true;
    }

    /**
     * Try to update the node view at a specific index.
     *
     * @param node - The node to update to
     * @param outerDeco - Outer decorations for the node
     * @param innerDeco - Inner decorations for the node
     * @param index - The index in the children array
     * @returns True if the update succeeded
     */
    public updateNodeAt(node: PmNode,
                        outerDeco: ReadonlyArray<PmDecoration>,
                        innerDeco: DecorationSource,
                        index: number): boolean {
        const child: NodeViewDesc = this.top.children[index] as NodeViewDesc;
        if (child.dirty === ViewDirtyState.NODE_DIRTY && child.dom === child.contentDOM) {
            child.dirty = ViewDirtyState.CONTENT_DIRTY;
        }

        if (!ViewDescUpdater.update(child, this.view, node, outerDeco, innerDeco)) {
            return false;
        }

        this.destroyBetween(this.index, index);
        this.index++;
        return true;
    }

    /**
     * Find the index of the child that contains a given DOM node.
     *
     * @param domNode - The DOM node to search for
     * @returns The child index, or -1 if not found
     */
    public findIndexWithChild(domNode: Node): number {
        for (; ;) {
            const parent: ParentNode = domNode.parentNode;
            if (!parent) {
                return -1;
            }

            if (parent === this.top.contentDOM) {
                const desc: PmViewDesc = domNode.pmViewDesc;
                if (desc) {
                    for (let i = this.index; i < this.top.children.length; i++) {
                        if (this.top.children[i] === desc) {
                            return i;
                        }
                    }
                }
                return -1;
            }
            domNode = parent;
        }
    }

    /**
     * Try to update the next node, if any, to the given data. Checks
     * pre-matches to avoid overwriting nodes that could still be used.
     *
     * @param node - The node to update to
     * @param outerDeco - Outer decorations for the node
     * @param innerDeco - Inner decorations for the node
     * @param index - The node's index in its parent
     * @param pos - The document position of the node
     * @returns True if an update was performed
     */
    public updateNextNode(node: PmNode,
                          outerDeco: ReadonlyArray<PmDecoration>,
                          innerDeco: DecorationSource,
                          index: number,
                          pos: number): boolean {
        for (let i = this.index; i < this.top.children.length; i++) {
            const next: ViewDesc = this.top.children[i];
            // Is instanceof NodeViewDesc
            if (next?.getType() === ViewDescType.NODE || next?.getType() === ViewDescType.CUSTOM || next?.getType() === ViewDescType.TEXT) {
                const nextNodeViewDesc: NodeViewDesc = next as NodeViewDesc;
                const preMatch: number = this.preMatch.matched.get(nextNodeViewDesc);
                if (!isUndefinedOrNull(preMatch) && preMatch !== index) {
                    return false;
                }

                const nextDOM: Node = nextNodeViewDesc.dom;
                let updated: NodeViewDesc;

                // Can't update if nextDOM is or contains this.lock, except if
                // it's a text node whose content already matches the new text
                // and whose decorations match the new ones.
                const locked: boolean =
                    this.isLocked(nextDOM)
                    && !(node.isText
                        && nextNodeViewDesc.node
                        && nextNodeViewDesc.node.isText
                        && nextNodeViewDesc.nodeDOM.nodeValue === node.text
                        && nextNodeViewDesc.dirty !== ViewDirtyState.NODE_DIRTY
                        && sameOuterDeco(outerDeco, nextNodeViewDesc.outerDeco));

                if (!locked && ViewDescUpdater.update(nextNodeViewDesc, this.view, node, outerDeco, innerDeco)) {
                    // if (!locked && viewDescUpdater.update(node, outerDeco, innerDeco)) {
                    this.destroyBetween(this.index, i);

                    if (nextNodeViewDesc.dom !== nextDOM) {
                        this._changed = true;
                    }

                    this.index++;
                    return true;
                } else if (!locked && (updated = this.recreateWrapper(nextNodeViewDesc, node, outerDeco, innerDeco, pos))) {
                    this.destroyBetween(this.index, i);
                    this.top.children[this.index] = updated;

                    if (updated.contentDOM) {
                        updated.dirty = ViewDirtyState.CONTENT_DIRTY;
                        ViewDescUpdater.updateChildren(updated, this.view, pos + 1);
                        updated.dirty = ViewDirtyState.NOT_DIRTY;
                    }

                    this._changed = true;
                    this.index++;
                    return true;
                }
                break;
            }
        }
        return false;
    }

    /**
     * Insert the node as a newly created node desc.
     *
     * @param node - The node to add
     * @param outerDeco - Outer decorations for the node
     * @param innerDeco - Inner decorations for the node
     * @param pos - Document position of the node
     */
    public addNode(node: PmNode,
                   outerDeco: ReadonlyArray<PmDecoration>,
                   innerDeco: DecorationSource,
                   pos: number): void {
        const desc: NodeViewDesc = ViewDescFactory.createNodeViewDesc(this.top, node, outerDeco, innerDeco, this.view, pos);
        if (desc.contentDOM) {
            ViewDescUpdater.updateChildren(desc, this.view, pos + 1);
        }
        this.top.children.splice(this.index++, 0, desc);
        this._changed = true;
    }

    /**
     * Place a widget decoration at the current position.
     * Reuses existing widget if it matches, otherwise creates a new one.
     *
     * @param widget - The widget decoration to place
     * @param pos - Document position for the widget
     */
    public placeWidget(widget: PmDecoration, pos: number): void {
        const next: ViewDesc = this.index < this.top.children.length ? this.top.children[this.index] : null;
        const matches: boolean = next?.matchesWidget(widget);
        let nextIsSameOrTop = false;

        if (matches) {
            const nextWidget = next as WidgetViewDesc;
            nextIsSameOrTop = widget === nextWidget.widget || !(this.getWidgetParent(nextWidget));
        }

        if (nextIsSameOrTop) {
            this.index++;
        } else {
            const desc: WidgetViewDesc = ViewDescFactory.createWidgetViewDesc(this.top, widget, this.view, pos);
            this.top.children.splice(this.index++, 0, desc);
            this._changed = true;
        }
    }

    /**
     * Make sure a textblock looks and behaves correctly in contentEditable.
     *
     * Adds BR elements to empty blocks or blocks that don't end with newlines,
     * ensuring they display correctly and can accept cursor placement.
     * On some browsers, also adds IMG separators to work around cursor bugs.
     */
    public addTextblockHacks(): void {
        let lastChild: ViewDesc = this.top.children[this.index - 1];
        let parent: ViewDesc = this.top;

        while (lastChild?.getType() === ViewDescType.MARK) {
            parent = lastChild;
            lastChild = parent.children[parent.children.length - 1];
        }

        // Check if we need to add a BR hack node
        // BR is needed if the textblock is empty (no children)
        // This ensures the browser can place a cursor inside empty paragraphs
        if (!lastChild) {
            const br = document.createElement('br');
            const brDesc = ViewDescFactory.createTrailingHackViewDesc(parent, [], br, null);
            parent.children.push(brDesc);
            this._changed = true;
        }
    }

    /**
     * Destroy and remove the children between the given indices in `this.top`.
     *
     * @param start - The start index (inclusive)
     * @param end - The end index (exclusive)
     */
    private destroyBetween(start: number, end: number): void {
        if (start === end) {
            return;
        }

        for (let i = start; i < end; i++) {
            this.top.children[i].destroy();
        }

        this.top.children.splice(start, end - start);
        this._changed = true;
    }

    /**
     * Finds how many marks at the start of the stack can be kept.
     *
     * @param marks - The target marks
     * @param depth - Current stack depth
     * @returns Number of marks to keep
     */
    private findKeepableMarks(marks: ReadonlyArray<Mark>, depth: number): number {
        const maxKeep: number = Math.min(depth, marks.length);
        let keep = 0;

        while (keep < maxKeep) {
            const markMatches = this.doesMarkMatch(marks[keep], keep, depth);
            const canSpan = !(isFalse(marks[keep].type.spec.spanning));

            if (!markMatches || !canSpan) {
                break;
            }

            keep++;
        }

        return keep;
    }

    /**
     * Checks if a mark at a given level matches the mark in the stack.
     *
     * @param mark - The mark to check
     * @param level - The level in the stack
     * @param depth - Current stack depth
     * @returns True if the mark matches
     */
    private doesMarkMatch(mark: Mark, level: number, depth: number): boolean {
        if (level === depth - 1) {
            // Top of stack - check this.top
            return this.top.matchesMark(mark);
        } else {
            // Earlier in stack - look it up in stack array
            const stackDesc = this.stack[(level + 1) << 1] as ViewDesc;
            return stackDesc.matchesMark(mark);
        }
    }

    /**
     * Pops marks from the stack that don't match the target.
     *
     * @param keep - Number of marks to keep
     * @param depth - Current stack depth
     */
    private popUnmatchedMarks(keep: number, depth: number): void {
        while (keep < depth) {
            this.destroyRemaining();
            this.top.dirty = ViewDirtyState.NOT_DIRTY;
            this.index = this.stack.pop() as number;
            this.top = this.stack.pop() as ViewDesc;
            depth--;
        }
    }

    /**
     * Pushes new marks onto the stack, reusing existing mark descs when possible.
     *
     * @param startDepth - Depth to start from
     * @param marks - Target marks
     * @param inline - Whether content is inline
     * @param parentIndex
     */
    private pushNewMarks(startDepth: number,
                         marks: ReadonlyArray<Mark>,
                         inline: boolean,
                         parentIndex: number): void {
        let depth: number = startDepth;

        while (depth < marks.length) {
            this.stack.push(this.top, this.index + 1);

            const existingMarkIndex: number = this.findReusableMarkDesc(marks[depth], parentIndex);

            if (existingMarkIndex >= 0) {
                this.reuseMarkDesc(existingMarkIndex);
            } else {
                this.createNewMarkDesc(marks[depth], inline);
            }

            this.index = 0;
            depth++;
        }
    }

    /**
     * Finds an existing mark desc that can be reused.
     * Limited search to avoid excessive scanning.
     *
     * @param mark - The mark to find
     * @param parentIndex
     * @returns Index of reusable mark desc, or -1 if none found
     */
    private findReusableMarkDesc(mark: Mark, parentIndex: number): number {
        let scanTo = this.top.children.length;
        if (parentIndex < this.preMatch.index) {
            scanTo = Math.min(this.index + 3, scanTo);
        }

        for (let i = this.index; i < scanTo; i++) {
            const child: ViewDesc = this.top.children[i];
            if (child.matchesMark(mark) && !this.isLocked(child.dom)) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Reuses an existing mark desc.
     *
     * @param index - Index of the mark desc to reuse
     */
    private reuseMarkDesc(index: number): void {
        if (index > this.index) {
            this._changed = true;
            this.destroyBetween(this.index, index);
        }
        this.top = this.top.children[this.index];
    }

    /**
     * Creates a new mark desc.
     *
     * @param mark - The mark to create a desc for
     * @param inline - Whether content is inline
     */
    private createNewMarkDesc(mark: Mark, inline: boolean): void {
        const markDesc: MarkViewDesc = ViewDescFactory.createMarkViewDesc(this.top, mark, inline, this.view);
        this.top.children.splice(this.index, 0, markDesc);
        this.top = markDesc;
        this._changed = true;
    }

    /**
     * When a node with content is replaced by a different node with
     * identical content, move over its children.
     *
     * @param next - The existing node view
     * @param node - The new node
     * @param outerDeco - Outer decorations
     * @param innerDeco - Inner decorations
     * @param pos - Document position
     * @returns A new wrapper node view, or null if recreation isn't possible
     */
    private recreateWrapper(next: NodeViewDesc,
                            node: PmNode,
                            outerDeco: ReadonlyArray<PmDecoration>,
                            innerDeco: DecorationSource,
                            pos: number): NodeViewDesc {
        if (next.dirty
            || node.isAtom
            || !next.children.length
            || !next.node.content.eq(node.content)
            || !sameOuterDeco(outerDeco, next.outerDeco)
            || !innerDeco.eq(next.innerDeco)) {
            return null;
        }

        const wrapper: NodeViewDesc = ViewDescFactory.createNodeViewDesc(this.top, node, outerDeco, innerDeco, this.view, pos);
        if (wrapper.contentDOM) {
            wrapper.children = next.children;
            next.children = [];

            for (const childViewDesc of wrapper.children) {
                childViewDesc.parent = wrapper;
            }
        }

        next.destroy();
        return wrapper;
    }

    /**
     * Gets the parent DOM node of a widget's DOM element.
     * Handles both function and pre-rendered widget DOMs.
     *
     * @param widgetViewDesc - The widget view description
     * @returns The parent node if it exists
     */
    private getWidgetParent(widgetViewDesc: WidgetViewDesc): Node | null | undefined {
        const widgetType = widgetViewDesc.widget.type as WidgetType;
        if (typeof widgetType.toDOM === 'function') {
            return widgetType.toDOM()?.parentNode;
        } else {
            return widgetType.toDOM?.parentNode;
        }
    }



    /**
     * Checks if a DOM node is locked (protected from modification).
     * Locked nodes are typically composition text nodes that shouldn't be
     * modified while the user is still composing input.
     *
     * @param node - The DOM node to check
     * @returns True if the node is locked or contains the locked node
     */
    private isLocked(node: Node): boolean {
        return this.lock && (node === this.lock || node.nodeType === ELEMENT_NODE && node.contains(this.lock.parentNode));
    }

    /**
     * Iterate from the end of the fragment and array of descs to find
     * directly matching ones, in order to avoid overeagerly reusing those
     * for other nodes. Returns the fragment index of the first node that
     * is part of the sequence of matched nodes at the end of the fragment.
     *
     * This optimization helps updateChildren avoid destroying and recreating
     * nodes at the end of the content that haven't changed. By matching from
     * the end, we can preserve stable nodes and only update the changed prefix.
     *
     * @param fragment - The document fragment to match against
     * @param parentDesc - The parent view description
     * @returns Object containing the start index, matched map, and array of matches
     */
    private findPreMatch(fragment: Fragment,
                         parentDesc: ViewDesc): { index: number, matched: Map<ViewDesc, number>, matches: ReadonlyArray<ViewDesc>; } {
        let curDesc: ViewDesc = parentDesc;
        let descI: number = curDesc.children.length;
        let fI: number = fragment.childCount;
        const matched = new Map<ViewDesc, number>();
        const matches: Array<ViewDesc> = [];

        // Scan backwards through both fragment and desc tree
        outer: while (fI > 0) {
            let desc: ViewDesc;

            // Navigate backwards through desc tree, skipping into mark descs
            for (; ;) {
                if (descI) {
                    const next: ViewDesc = curDesc.children[descI - 1];
                    if (next?.getType() === ViewDescType.MARK) {
                        // Descend into mark desc to find actual node desc
                        curDesc = next;
                        descI = next.children.length;
                    } else {
                        desc = next;
                        descI--;
                        break;
                    }
                } else if (curDesc === parentDesc) {
                    // Reached top without finding desc
                    break outer;
                } else {
                    // Pop back up to parent
                    // FIXME: This could be more efficient
                    descI = curDesc.parent.children.indexOf(curDesc);
                    curDesc = curDesc.parent;
                }
            }

            const node: PmNode = desc.node;
            if (!node) {
                continue;
            }

            // Check if this desc's node matches the fragment node
            if (node !== fragment.child(fI - 1)) {
                break;
            }

            // Match found - record it
            --fI;
            matched.set(desc, fI);
            matches.push(desc);
        }
        return {index: fI, matched, matches: matches.reverse()};
    }
}
