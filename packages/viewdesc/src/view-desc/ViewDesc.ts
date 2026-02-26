import {browser, ELEMENT_NODE, TEXT_NODE} from '@type-editor/commons';
import {domIndex, isEquivalentPosition} from '@type-editor/dom-util';
import type {
    DecorationSource,
    DOMSelectionRange,
    PmDecoration,
    PmEditorView,
    PmViewDesc,
    ViewMutationRecord
} from '@type-editor/editor-types';
import type {Mark, PmNode, TagParseRule} from '@type-editor/model';

import {AbstractViewDesc} from './AbstractViewDesc';
import {ViewDescType} from './ViewDescType';
import {ViewDirtyState} from './ViewDirtyState';


/**
 * Superclass for the various kinds of descriptions. Defines their
 * basic structure and shared methods.
 */
export class ViewDesc extends AbstractViewDesc implements PmViewDesc {

    protected readonly _contentDOM: HTMLElement | null;
    protected _dirty: ViewDirtyState = ViewDirtyState.NOT_DIRTY;
    protected _node: PmNode | null;
    protected _parent: ViewDesc | undefined;
    protected _children: Array<ViewDesc>;
    protected _dom: Node;

    /**
     * Creates a new ViewDesc instance.
     *
     * @param parent - The parent ViewDesc in the tree hierarchy
     * @param children - Array of child ViewDesc instances
     * @param dom - The DOM node this description wraps
     * @param contentDOM - The DOM node that holds the child views. May be null for descs that don't have children.
     */
    constructor(parent: ViewDesc | undefined,
                children: Array<ViewDesc>,
                dom: Node,
                contentDOM: HTMLElement | null) {
        super();
        this._parent = parent;
        this._children = children;
        this._dom = dom;
        this._contentDOM = contentDOM;

        // An expando property on the DOM node provides a link back to its
        // description.
        if (dom) {
            dom.pmViewDesc = this;
        }
    }

    /**
     * The dirty state of this description. Can be NOT_DIRTY, CHILD_DIRTY, CONTENT_DIRTY, or NODE_DIRTY.
     */
    get dirty(): ViewDirtyState {
        return this._dirty;
    }

    set dirty(dirty: ViewDirtyState) {
        this._dirty = dirty;
    }

    /**
     * The ProseMirror node this description represents, if any.
     */
    get node(): PmNode {
        return this._node;
    }

    /**
     * The parent view description in the tree.
     */
    get parent(): ViewDesc | undefined {
        return this._parent;
    }

    set parent(parent: ViewDesc | undefined) {
        this._parent = parent;
    }

    /**
     * The child view descriptions of this view.
     */
    get children(): Array<ViewDesc> {
        return this._children;
    }

    set children(children: Array<ViewDesc>) {
        this._children = children;
    }

    /**
     * The DOM node this description represents.
     */
    get dom(): Node {
        return this._dom;
    }

    /**
     * The DOM node that contains child content, if any.
     */
    get contentDOM(): HTMLElement | null {
        return this._contentDOM;
    }

    /**
     * Whether this description represents an atomic node that should be treated as a single unit.
     */
    get domAtom(): boolean {
        return false;
    }

    /**
     * Whether this view should be ignored when determining coordinates.
     */
    get ignoreForCoords(): boolean {
        return false;
    }

    /**
     * Whether this view should be ignored for selection purposes.
     */
    get ignoreForSelection(): boolean {
        return false;
    }

    /**
     * Checks if the content DOM has been detached from the main DOM.
     */
    get contentLost(): boolean {
        return this._contentDOM && this._contentDOM !== this._dom && !this._dom.contains(this._contentDOM);
    }

    /**
     * The document position just before this view.
     */
    get posBefore(): number {
        return this._parent.posBeforeChild(this);
    }

    /**
     * The document position at the start of this view's content.
     */
    get posAtStart(): number {
        return this._parent ? this._parent.posBeforeChild(this) + this.border : 0;
    }

    /**
     * The document position just after this view.
     */
    get posAfter(): number {
        return this.posBefore + this.size;
    }

    /**
     * The document position at the end of this view's content.
     */
    get posAtEnd(): number {
        return this.posAtStart + this.size - 2 * this.border;
    }

    /**
     * The size of the content represented by this desc.
     */
    get size(): number {
        let size = 0;
        for (const item of this._children) {
            size += item.size;
        }
        return size;
    }

    /**
     * For block nodes, this represents the space taken up by their
     * start/end tokens.
     */
    get border(): number {
        return 0;
    }

    get side(): number {
        return 0;
    }

    public getType(): ViewDescType {
        return ViewDescType.VIEW;
    }

    /**
     * Checks if this description matches a given widget decoration.
     *
     * @param _widget - The widget decoration to check against
     * @returns True if this description represents the given widget
     */
    public matchesWidget(_widget: PmDecoration): boolean {
        return false;
    }

    /**
     * Used to check whether a given description corresponds to a
     * widget/mark/node.
     */

    /**
     * Checks if this description matches a given mark.
     *
     * @param _mark - The mark to check against
     * @returns True if this description represents the given mark
     */
    public matchesMark(_mark: Mark): boolean {
        return false;
    }

    /**
     * Checks if this description matches a given node with decorations.
     *
     * @param _node - The node to check against
     * @param _outerDeco - The outer decorations to check
     * @param _innerDeco - The inner decoration source to check
     * @returns True if this description represents the given node with matching decorations
     */
    public matchesNode(_node: PmNode, _outerDeco: ReadonlyArray<PmDecoration>, _innerDeco: DecorationSource): boolean {
        return false;
    }

    /**
     * Checks if this description matches a hack node with a specific name.
     *
     * @param _nodeName - The node name to check against
     * @returns True if this is a hack node with the given name
     */
    public matchesHack(_nodeName: string): boolean {
        return false;
    }

    /**
     * When parsing in-editor content (in domchange.js), we allow
     * descriptions to determine the parse rules that should be used to
     * parse them.
     */
    public parseRule(): Omit<TagParseRule, 'tag'> | null {
        return null;
    }

    /**
     * Used by the editor's event handler to ignore events that come
     * from certain descs.
     *
     * @param _event - The DOM event to check
     * @returns True if the event should be stopped/ignored
     */
    public stopEvent(_event: Event): boolean {
        return false;
    }

    /**
     * Destroys this view description and all its children, cleaning up references.
     *
     * This method ensures proper cleanup even if exceptions occur during child destruction.
     */
    public destroy(): void {
        this._parent = undefined;
        if (this._dom?.pmViewDesc === this) {
            this._dom.pmViewDesc = undefined;
        }

        // Destroy children with error isolation
        const children: Array<ViewDesc> = this._children;
        this._children = []; // Clear immediately to prevent circular references

        for (const child of children) {
            try {
                child.destroy();
            } catch (e) {
                // Log error but continue destroying other children
                if (console?.error) {
                    console.error('Error destroying child view desc:', e);
                }
            }
        }
    }

    /**
     * Calculates the document position just before a given child view.
     *
     * @param child - The child view to locate
     * @returns The document position before the child
     */
    public posBeforeChild(child: PmViewDesc): number {
        for (let i = 0, pos = this.posAtStart; i < this._children.length; i++) {
            const cur: ViewDesc = this._children[i];
            if (cur === child) {
                return pos;
            }
            pos += cur.size;
        }
        throw new Error('Child not found in parent');
    }

    /**
     * Converts a DOM position within this view to a document position.
     *
     * Uses two strategies:
     * 1. If position is inside contentDOM: scans through children to find nearest view desc
     * 2. If position is outside contentDOM: uses heuristics based on DOM structure
     *
     * @param dom - The DOM node where the position is
     * @param offset - The offset within the DOM node
     * @param bias - Direction bias for ambiguous positions (-1 for before, 1 for after)
     * @returns The document position corresponding to the DOM position
     */
    public localPosFromDOM(dom: Node, offset: number, bias: number): number {
        const domNode: Node = dom.nodeType === ELEMENT_NODE ? dom : dom.parentNode;
        const isInsideContent = this._contentDOM?.contains(domNode);

        if (isInsideContent) {
            return this.findPositionInContent(dom, offset, bias);
        }

        return this.determinePositionFromHeuristics(dom, offset, bias);
    }

    /**
     * Gets a view description from a DOM node if it's a descendant of this description.
     *
     * @param dom - The DOM node to check
     * @returns The view description if it's a descendant, undefined otherwise
     */
    public getDesc(dom: Node): ViewDesc | undefined {
        const desc: PmViewDesc | undefined = dom.pmViewDesc;
        if (!desc) {
            return;
        }

        for (let cur: PmViewDesc | undefined = desc; cur; cur = cur.parent) {
            if (cur === this) {
                return desc as ViewDesc;
            }
        }
    }

    /**
     * Converts a DOM position to a document position.
     *
     * @param dom - The DOM node containing the position
     * @param offset - The offset within the DOM node
     * @param bias - Direction bias for ambiguous positions
     * @returns The document position, or -1 if not found
     */
    public posFromDOM(dom: Node, offset: number, bias: number): number {
        for (let scan: Node | null = dom; scan; scan = scan.parentNode) {
            const desc: ViewDesc = this.getDesc(scan);
            if (desc) {
                return desc.localPosFromDOM(dom, offset, bias);
            }
        }
        return -1;
    }

    /**
     * Find the desc for the node after the given pos, if any. (When a
     * parent node overrode rendering, there might not be one.)
     *
     * @param pos - The document position to search for
     * @returns The view description at that position, or undefined
     */
    public descAt(pos: number): ViewDesc | undefined {
        let offset = 0;
        for (let child of this._children) {
            const end: number = offset + child.size;

            if (offset === pos && end !== offset) {
                while (!child.border && child.children.length) {

                    for (const inner of child.children) {
                        if (inner.size) {
                            child = inner;
                            break;
                        }
                    }
                }
                return child;
            }
            if (pos < end) {
                return child.descAt(pos - offset - child.border);
            }
            offset = end;
        }
    }

    /**
     * Converts a document position to a DOM position.
     *
     * The algorithm:
     * 1. For leaf nodes: return the DOM node itself with atom marker
     * 2. For container nodes: find which child contains the position
     * 3. If inside a child: recurse into that child
     * 4. If at boundary: adjust for zero-width widgets and find DOM position
     *
     * @param pos - The document position (relative to this view's start)
     * @param side - Direction to favor (-1 for before, 0 for neutral, 1 for after)
     * @returns Object containing the DOM node, offset, and optionally an atom marker
     */
    public domFromPos(pos: number,
                      side: number): { node: Node, offset: number, atom?: number; } {
        if (!this._contentDOM) {
            return this.getDomForLeafNode(pos);
        }

        const childInfo = this.findChildAtPosition(pos);

        if (this.isPositionInsideChild(childInfo)) {
            return this.getDomFromChild(childInfo, side);
        }

        return this.getDomAtBoundary(childInfo.index, side);
    }

    /**
     * Finds a DOM range in a single parent for a given changed range.
     *
     * This method maps document positions to DOM child indices, which is needed
     * for parsing changed content. It tries to optimize by recursing into a single
     * child when the entire range fits inside it.
     *
     * @param from - Start position of the range
     * @param to - End position of the range
     * @param base - Base offset for position calculations (default: 0)
     * @returns Object containing the DOM node and offsets for the range
     */
    public parseRange(from: number,
                      to: number,
                      base = 0): { node: Node, from: number, to: number, fromOffset: number, toOffset: number } {
        if (this._children.length === 0) {
            return this.getEmptyParseRange(from, to);
        }

        const result = this.findParseRangeBounds(from, to, base);
        return {node: this._contentDOM, ...result};
    }

    /**
     * Checks if there's an empty child at the start or end of this view.
     *
     * @param side - Direction to check (-1 for start, 1 for end)
     * @returns True if there's an empty child at the specified side
     */
    public emptyChildAt(side: number): boolean {
        if (this.border || !this._contentDOM || !this._children.length) {
            return false;
        }

        const child: ViewDesc = this._children[side < 0 ? 0 : this._children.length - 1];
        return child.size === 0 || child.emptyChildAt(side);
    }

    /**
     * Gets the DOM node immediately after a given document position.
     *
     * @param pos - The document position
     * @returns The DOM node after the position
     * @throws RangeError if there's no node after the position
     */
    public domAfterPos(pos: number): Node {
        const {node, offset} = this.domFromPos(pos, 0);
        if (node.nodeType !== ELEMENT_NODE || offset === node.childNodes.length) {
            throw new RangeError(`No node after pos ${pos}`);
        }

        return node.childNodes[offset];
    }

    /**
     * Sets a selection within this view description or delegates to a child.
     *
     * View descs are responsible for setting selections that fall entirely inside them,
     * allowing custom node views to implement specialized selection behavior.
     *
     * Strategy:
     * 1. If selection is entirely within a child → delegate to that child
     * 2. Otherwise → convert positions to DOM and apply selection
     *
     * @param anchor - The anchor position of the selection
     * @param head - The head position of the selection
     * @param view - The editor view
     * @param force - Whether to force the selection update even if it appears unchanged
     */
    public setSelection(anchor: number,
                        head: number,
                        view: PmEditorView,
                        force = false): void {
        if (this.tryDelegateToChild(anchor, head, view, force)) {
            return;
        }

        this.setSelectionInDOM(anchor, head, view, force);
    }

    /**
     * Determines if a mutation can be safely ignored.
     *
     * @param mutation - The mutation record to check
     * @returns True if the mutation can be ignored, false if it needs processing
     */
    public ignoreMutation(mutation: ViewMutationRecord): boolean {
        return !this._contentDOM && mutation.type !== 'selection';
    }

    /**
     * Marks a subtree that has been touched by a DOM change for redrawing.
     *
     * The algorithm walks through children to find which ones overlap with
     * the dirty range, then either:
     * - Recursively marks the child if range is fully contained
     * - Marks the child for full recreation if range partially overlaps
     *
     * @param from - Start position of the dirty range
     * @param to - End position of the dirty range
     */
    public markDirty(from: number, to: number): void {
        let offset = 0;

        for (const child of this._children) {
            const end: number = offset + child.size;

            if (this.rangeOverlapsChild(from, to, offset, end)) {
                if (this.tryMarkChildDirty(child, from, to, offset, end)) {
                    return;
                }
            }

            offset = end;
        }

        // No specific child found - mark entire content as dirty
        this._dirty = ViewDirtyState.CONTENT_DIRTY;
    }

    /**
     * Checks if this view represents text with a specific content.
     *
     * @param _text - The text content to check against
     * @returns True if this is a text view with the given content
     */
    public isText(_text: string): boolean {
        return false;
    }

    /**
     * Marks this description and its parents as dirty, propagating the dirty state up the tree.
     * Sets the dirty level to CONTENT_DIRTY for the immediate parent and CHILD_DIRTY for ancestors.
     */
    public markParentsDirty(): void {
        let node: ViewDesc = this._parent;
        let level = 1;
        while (node) {
            const dirty: ViewDirtyState = level === 1 ? ViewDirtyState.CONTENT_DIRTY : ViewDirtyState.CHILD_DIRTY;
            if (node.dirty < dirty) {
                node.dirty = dirty;
            }
            node = node.parent;
            level++;
        }
    }

    /**
     * Sets the DOM node for this description and establishes the bidirectional link.
     *
     * @param dom - The DOM node to associate with this description
     */
    protected setDomNode(dom: Node) {
        this._dom = dom;
        this._dom.pmViewDesc = this;
    }

    /**
     * Finds a position within the content DOM by locating adjacent view descriptions.
     *
     * @param dom - The DOM node where the position is
     * @param offset - The offset within the DOM node
     * @param bias - Direction bias (-1 for before, 1 for after)
     * @returns The document position
     */
    private findPositionInContent(dom: Node, offset: number, bias: number): number {
        if (bias < 0) {
            return this.findPositionBefore(dom, offset);
        } else {
            return this.findPositionAfter(dom, offset);
        }
    }

    /**
     * Finds the document position before a DOM location by scanning backwards through siblings.
     *
     * This method locates the previous view description and calculates the position after it.
     * If no previous view is found, returns the start position of this view.
     *
     * @param dom - The DOM node
     * @param offset - The offset within the node
     * @returns The document position
     */
    private findPositionBefore(dom: Node, offset: number): number {
        const nodeBefore: ChildNode = this.findNodeBefore(dom, offset);
        const descBefore: PmViewDesc = this.findViewDescBefore(nodeBefore);

        if (descBefore) {
            return this.posBeforeChild(descBefore) + descBefore.size;
        }

        return this.posAtStart;
    }

    /**
     * Finds the DOM node that comes before the given position.
     *
     * @param dom - The DOM node
     * @param offset - The offset within the node
     * @returns The DOM node before the position
     */
    private findNodeBefore(dom: Node, offset: number): ChildNode | null {
        if (dom === this._contentDOM) {
            return dom.childNodes[offset - 1];
        }

        // Walk up to find direct child of contentDOM
        while (dom.parentNode !== this._contentDOM) {
            dom = dom.parentNode;
        }

        return dom.previousSibling;
    }

    /**
     * Scans backwards from a node to find a view description that's a direct child of this view.
     *
     * @param startNode - The node to start scanning from
     * @returns The view description if found, undefined otherwise
     */
    private findViewDescBefore(startNode: ChildNode | null): PmViewDesc | undefined {
        let currentNode: ChildNode = startNode;

        while (currentNode) {
            const desc: PmViewDesc = currentNode.pmViewDesc;
            if (desc?.parent === this) {
                return desc;
            }
            currentNode = currentNode.previousSibling;
        }

        return undefined;
    }

    /**
     * Finds the document position after a DOM location by scanning forwards through siblings.
     *
     * This method locates the next view description and calculates the position before it.
     * If no next view is found, returns the end position of this view.
     *
     * @param dom - The DOM node
     * @param offset - The offset within the node
     * @returns The document position
     */
    private findPositionAfter(dom: Node, offset: number): number {
        const nodeAfter: ChildNode = this.findNodeAfter(dom, offset);
        const descAfter: PmViewDesc = this.findViewDescAfter(nodeAfter);

        if (descAfter) {
            return this.posBeforeChild(descAfter);
        }

        return this.posAtEnd;
    }

    /**
     * Finds the DOM node that comes after the given position.
     *
     * @param dom - The DOM node
     * @param offset - The offset within the node
     * @returns The DOM node after the position
     */
    private findNodeAfter(dom: Node, offset: number): ChildNode | null {
        if (dom === this._contentDOM) {
            return dom.childNodes[offset];
        }

        // Walk up to find direct child of contentDOM
        while (dom.parentNode !== this._contentDOM) {
            dom = dom.parentNode;
        }

        return dom.nextSibling;
    }

    /**
     * Scans forwards from a node to find a view description that's a direct child of this view.
     *
     * @param startNode - The node to start scanning from
     * @returns The view description if found, undefined otherwise
     */
    private findViewDescAfter(startNode: ChildNode | null): PmViewDesc | undefined {
        let currentNode: ChildNode = startNode;

        while (currentNode) {
            const desc: PmViewDesc = currentNode.pmViewDesc;
            if (desc?.parent === this) {
                return desc;
            }
            currentNode = currentNode.nextSibling;
        }
    }

    /**
     * Uses heuristics to determine if a position is at the start or end of this view.
     *
     * @param dom - The DOM node
     * @param offset - The offset within the node
     * @param bias - Direction bias to use as fallback
     * @returns The document position (either posAtStart or posAtEnd)
     */
    private determinePositionFromHeuristics(dom: Node,
                                            offset: number,
                                            bias: number): number {
        let atEnd: number | boolean;

        if (dom === this._dom && this._contentDOM) {
            atEnd = offset > domIndex(this._contentDOM);
        } else if (this._contentDOM
            && this._contentDOM !== this._dom
            && this._dom.contains(this._contentDOM)) {

            atEnd = dom.compareDocumentPosition(this._contentDOM) & 2;
        } else if (this._dom.firstChild) {
            atEnd = this.checkPositionAtBoundary(dom, offset);
        }

        return (atEnd ?? bias > 0) ? this.posAtEnd : this.posAtStart;
    }

    /**
     * Checks if a position is at the boundary (start or end) of this view.
     *
     * @param dom - The DOM node
     * @param offset - The offset within the node
     * @returns True if at end, false if at start, undefined if neither
     */
    private checkPositionAtBoundary(dom: Node, offset: number): boolean | undefined {
        let atEnd: boolean | undefined;

        if (offset === 0) {
            for (let search: Node = dom; search; search = search.parentNode) {
                if (search === this._dom) {
                    atEnd = false;
                    break;
                }
                if (search.previousSibling) {
                    break;
                }
                // Safety check: if we reach document root without finding this._dom
                if (!search.parentNode) {
                    break;
                }
            }
        }

        if (atEnd === undefined && offset === dom.childNodes.length) {
            for (let search: Node = dom; search; search = search.parentNode) {
                if (search === this._dom) {
                    atEnd = true;
                    break;
                }
                if (search.nextSibling) {
                    break;
                }
                // Safety check: if we reach document root without finding this._dom
                if (!search.parentNode) {
                    break;
                }
            }
        }

        return atEnd;
    }

    /**
     * Returns DOM position for a leaf node (node without content).
     *
     * @param pos - The document position
     * @returns DOM position with atom marker
     */
    private getDomForLeafNode(pos: number): { node: Node, offset: number, atom: number } {
        return {node: this._dom, offset: 0, atom: pos + 1};
    }

    /**
     * Checks if a position is inside a child (not at a boundary).
     *
     * @param childInfo - Information about the child at the position
     * @returns True if position is inside the child
     */
    private isPositionInsideChild(childInfo: { index: number, offset: number }): boolean {
        return childInfo.offset > 0;
    }

    /**
     * Gets DOM position by recursing into a child view.
     *
     * @param childInfo - Information about the child containing the position
     * @param side - Direction bias
     * @returns DOM position from the child view
     */
    private getDomFromChild(childInfo: { index: number, offset: number },
                            side: number): { node: Node, offset: number, atom?: number } {
        const child: ViewDesc = this._children[childInfo.index];
        const relativePos: number = childInfo.offset - child.border;
        return child.domFromPos(relativePos, side);
    }

    /**
     * Gets DOM position at a child boundary.
     *
     * @param childIndex - The child index at the boundary
     * @param side - Direction bias
     * @returns DOM position at the boundary
     */
    private getDomAtBoundary(childIndex: number,
                             side: number): { node: Node, offset: number } {
        const adjustedIndex: number = this.skipZeroLengthWidgets(childIndex);

        return side <= 0
            ? this.findDomPositionBefore(adjustedIndex, side)
            : this.findDomPositionAfter(adjustedIndex);
    }

    /**
     * Finds the child view at a given document position.
     *
     * @param pos - The document position to search for
     * @returns Object with the child index and offset within that child
     */
    private findChildAtPosition(pos: number): { index: number, offset: number } {
        let i = 0;
        let offset = 0;

        for (let curPos = 0; i < this._children.length; i++) {
            const child: ViewDesc = this._children[i];
            const end: number = curPos + child.size;

            if (end > pos || child?.getType() === ViewDescType.TRAILING_HACK) {
                offset = pos - curPos;
                break;
            }
            curPos = end;
        }

        return {index: i, offset};
    }

    /**
     * Skips backward over zero-length widgets with non-negative side values.
     *
     * @param startIndex - The starting index
     * @returns The adjusted index after skipping widgets
     */
    private skipZeroLengthWidgets(startIndex: number): number {
        let i = startIndex;

        while (i > 0) {
            const prev: ViewDesc = this._children[i - 1];
            if (prev.size || !(prev?.getType() === ViewDescType.WIDGET) || prev.side < 0) {
                break;
            }
            i--;
        }

        return i;
    }

    /**
     * Finds a DOM position before the given child index.
     *
     * @param childIndex - The child index to search from
     * @param side - Direction bias
     * @returns Object containing the DOM node and offset
     */
    private findDomPositionBefore(childIndex: number,
                                  side: number): { node: Node, offset: number } {
        let i = childIndex;
        let prev: ViewDesc | null;
        let enter = true;

        while (true) {
            prev = i ? this._children[i - 1] : null;
            if (!prev || prev.dom.parentNode === this._contentDOM) {
                break;
            }
            i--;
            enter = false;
        }

        if (prev && side && enter && !prev.border && !prev.domAtom) {
            return prev.domFromPos(prev.size, side);
        }

        return {
            node: this._contentDOM,
            offset: prev ? domIndex(prev.dom) + 1 : 0
        };
    }

    /**
     * Finds a DOM position after the given child index.
     *
     * @param childIndex - The child index to search from
     * @returns Object containing the DOM node and offset
     */
    private findDomPositionAfter(childIndex: number): { node: Node, offset: number } {
        let i = childIndex;
        let next: ViewDesc | null;
        let enter = true;

        while (i < this._children.length) {
            next = this._children[i];
            if (next.dom.parentNode === this._contentDOM) {
                break;
            }
            i++;
            enter = false;
        }

        if (i >= this._children.length) {
            next = null;
        }

        if (next && enter && !next.border && !next.domAtom) {
            return next.domFromPos(0, 1);
        }

        return {
            node: this._contentDOM,
            offset: next ? domIndex(next.dom) : this._contentDOM.childNodes.length
        };
    }

    /**
     * Returns parse range for views with no children.
     *
     * @param from - Start position
     * @param to - End position
     * @returns Parse range covering entire content
     */
    private getEmptyParseRange(from: number,
                               to: number): { node: Node, from: number, to: number, fromOffset: number, toOffset: number } {
        return {
            node: this._contentDOM,
            from,
            to,
            fromOffset: 0,
            toOffset: this._contentDOM.childNodes.length
        };
    }

    /**
     * Finds the DOM child indices for a document position range.
     *
     * @param from - Start position
     * @param to - End position
     * @param base - Base offset
     * @returns Object with adjusted positions and DOM offsets
     */
    private findParseRangeBounds(from: number,
                                 to: number,
                                 base: number): { from: number, to: number, fromOffset: number, toOffset: number } {
        let fromOffset = -1;
        let toOffset = -1;
        let offset: number = base;

        for (let i = 0; ; i++) {
            const child: ViewDesc = this._children[i];
            const end: number = offset + child.size;

            if (fromOffset === -1 && from <= end) {
                const recursiveResult = this.tryRecursiveParseRange(child, from, to, offset, end);
                if (recursiveResult) {
                    return recursiveResult;
                }

                ({from, fromOffset} = this.findStartOffset(i, offset));
            }

            if (fromOffset > -1 && (end > to || i === this._children.length - 1)) {
                ({to, toOffset} = this.findEndOffset(i, end));
                break;
            }

            offset = end;
        }

        return {from, to, fromOffset, toOffset};
    }

    /**
     * Attempts to recursively parse range if it fits entirely within a child.
     *
     * @param child - The child view
     * @param from - Start position
     * @param to - End position
     * @param offset - Current offset
     * @param end - End of child
     * @returns Recursive parse range if applicable, null otherwise
     */
    private tryRecursiveParseRange(child: ViewDesc,
                                   from: number,
                                   to: number,
                                   offset: number,
                                   end: number): { from: number, to: number, fromOffset: number, toOffset: number } | null {
        const childBase: number = offset + child.border;
        const canRecurse: boolean = from >= childBase
            && to <= end - child.border
            && child.node
            && child.contentDOM
            && this._contentDOM.contains(child.contentDOM);

        if (canRecurse) {
            return child.parseRange(from, to, childBase);
        }

        return null;
    }

    /**
     * Finds the DOM offset for the start of the range.
     *
     * @param startIndex - Starting child index
     * @param offset - Current offset
     * @returns Adjusted from position and DOM offset
     */
    private findStartOffset(startIndex: number,
                            offset: number): { from: number, fromOffset: number } {
        let adjustedFrom = offset;
        let fromOffset = -1;

        for (let j = startIndex; j > 0; j--) {
            const prev: ViewDesc = this._children[j - 1];
            if (prev.size && prev.dom.parentNode === this._contentDOM && !prev.emptyChildAt(1)) {
                fromOffset = domIndex(prev.dom) + 1;
                break;
            }
            adjustedFrom -= prev.size;
        }

        return {from: adjustedFrom, fromOffset: fromOffset === -1 ? 0 : fromOffset};
    }

    /**
     * Finds the DOM offset for the end of the range.
     *
     * @param endIndex - Ending child index
     * @param end - Current end offset
     * @returns Adjusted to position and DOM offset
     */
    private findEndOffset(endIndex: number,
                          end: number): { to: number, toOffset: number } {
        let adjustedTo: number = end;
        let toOffset = -1;

        for (let j = endIndex + 1; j < this._children.length; j++) {
            const next = this._children[j];
            if (next.size && next.dom.parentNode === this._contentDOM && !next.emptyChildAt(-1)) {
                toOffset = domIndex(next.dom);
                break;
            }
            adjustedTo += next.size;
        }

        return {to: adjustedTo, toOffset: toOffset === -1 ? this._contentDOM.childNodes.length : toOffset};
    }

    /**
     * Handles browser-specific quirks when placing the cursor around BR nodes.
     * On Firefox, using Selection.collapse after a BR node doesn't always work (#1073).
     * On Safari, the cursor sometimes lags behind its reported position (#1092).
     *
     * @param anchorDOM - The anchor DOM position
     * @param anchor - The anchor document position
     * @param head - The head document position
     * @returns Object containing brKludge flag and potentially adjusted DOM positions
     */
    private handleBRKludge(anchorDOM: { node: Node, offset: number },
                           anchor: number,
                           head: number): {
        brKludge: boolean,
        anchorDOM?: { node: Node, offset: number },
        headDOM?: { node: Node, offset: number }
    } {
        // Only apply this workaround on affected browsers and for collapsed selections
        if (!(browser.gecko || browser.safari) || anchor !== head) {
            return {brKludge: false};
        }

        const {node, offset} = anchorDOM;

        if (node.nodeType === TEXT_NODE) {
            // Text node: check if cursor is after a newline character
            const brKludge = offset && node.nodeValue[offset - 1] === '\n';

            // Special case: cursor at end of text node followed by BR
            // Issue #1128: Move selection point to after the BR instead
            if (brKludge && offset === node.nodeValue.length) {
                const adjustedDOM = this.findBRAfterTextNode(node);
                if (adjustedDOM) {
                    return {brKludge, anchorDOM: adjustedDOM, headDOM: adjustedDOM};
                }
            }

            return {brKludge};
        } else {
            // Element node: check if previous child is BR or non-editable
            const prev: ChildNode = node.childNodes[offset - 1];
            const brKludge = prev && (prev.nodeName === 'BR' || (prev as HTMLElement).contentEditable === 'false');
            return {brKludge};
        }
    }

    /**
     * Finds a BR node after a text node by scanning up the tree.
     *
     * @param node - The text node to start from
     * @returns Adjusted DOM position if BR found, undefined otherwise
     */
    private findBRAfterTextNode(node: Node): { node: Node, offset: number } | undefined {
        for (let scan: Node | null = node; scan; scan = scan.parentNode) {
            const after: ChildNode = scan.nextSibling;
            if (after) {
                if (after.nodeName === 'BR') {
                    return {node: after.parentNode, offset: domIndex(after) + 1};
                }
                break;
            }

            const desc: PmViewDesc = scan.pmViewDesc;
            if (desc?.node?.isBlock) {
                break;
            }
        }
        return undefined;
    }

    /**
     * Attempts to delegate selection to a child that fully contains it.
     *
     * @param anchor - The anchor position
     * @param head - The head position
     * @param view - The editor view
     * @param force - Whether to force update
     * @returns True if selection was delegated to a child
     */
    private tryDelegateToChild(anchor: number,
                               head: number,
                               view: PmEditorView,
                               force: boolean): boolean {
        const from: number = Math.min(anchor, head);
        const to: number = Math.max(anchor, head);
        let offset = 0;

        for (const child of this._children) {
            const end = offset + child.size;

            if (from > offset && to < end) {
                const relativeAnchor: number = anchor - offset - child.border;
                const relativeHead: number = head - offset - child.border;
                child.setSelection(relativeAnchor, relativeHead, view, force);
                return true;
            }

            offset = end;
        }

        return false;
    }

    /**
     * Sets selection directly in the DOM after converting document positions.
     *
     * @param anchor - The anchor position
     * @param head - The head position
     * @param view - The editor view
     * @param force - Whether to force update
     */
    private setSelectionInDOM(anchor: number,
                              head: number,
                              view: PmEditorView,
                              force: boolean): void {
        let anchorDOM = this.domFromPos(anchor, anchor ? -1 : 1);
        let headDOM = head === anchor ? anchorDOM : this.domFromPos(head, head ? -1 : 1);

        const domSelection: Selection = (view.root as Document).getSelection();
        const domSelectionRange: DOMSelectionRange = view.domSelectionRange();

        // Apply browser-specific workarounds
        const kludgeResult = this.handleBRKludge(anchorDOM, anchor, head);
        if (kludgeResult.anchorDOM) {
            anchorDOM = kludgeResult.anchorDOM;
            headDOM = kludgeResult.headDOM;
        }

        force = this.checkFirefoxUneditableQuirk(force, headDOM, domSelectionRange);

        if (!this.shouldUpdateSelection(force, kludgeResult.brKludge, anchorDOM, headDOM, domSelectionRange)) {
            return;
        }

        this.applyDOMSelection(domSelection, anchorDOM, headDOM, anchor, head, kludgeResult.brKludge);
    }

    /**
     * Checks for Firefox quirk with uneditable nodes and adjusts force flag if needed.
     * See: #1163 and https://bugzilla.mozilla.org/show_bug.cgi?id=1709536
     *
     * @param force - Current force flag value
     * @param headDOM - The head DOM position
     * @param domSelectionRange - Current DOM selection range
     * @returns Updated force flag
     */
    private checkFirefoxUneditableQuirk(force: boolean,
                                        headDOM: { node: Node, offset: number },
                                        domSelectionRange: DOMSelectionRange): boolean {
        if (!browser.gecko || !domSelectionRange.focusNode) {
            return force;
        }

        if (domSelectionRange.focusNode === headDOM.node || domSelectionRange.focusNode.nodeType !== ELEMENT_NODE) {
            return force;
        }

        const after: ChildNode = domSelectionRange.focusNode.childNodes[domSelectionRange.focusOffset];
        if (after && (after as HTMLElement).contentEditable === 'false') {
            return true;
        }

        return force;
    }

    /**
     * Checks if the DOM selection needs to be updated.
     *
     * @param force - Whether to force the update
     * @param brKludge - Whether BR kludge is active
     * @param anchorDOM - Anchor DOM position
     * @param headDOM - Head DOM position
     * @param domSelectionRange - Current DOM selection range
     * @returns True if selection should be updated
     */
    private shouldUpdateSelection(force: boolean,
                                  brKludge: boolean,
                                  anchorDOM: { node: Node, offset: number },
                                  headDOM: { node: Node, offset: number },
                                  domSelectionRange: DOMSelectionRange): boolean {
        if (force || (brKludge && browser.safari)) {
            return true;
        }

        return !(
            isEquivalentPosition(anchorDOM.node, anchorDOM.offset, domSelectionRange.anchorNode, domSelectionRange.anchorOffset)
            && isEquivalentPosition(headDOM.node, headDOM.offset, domSelectionRange.focusNode, domSelectionRange.focusOffset)
        );
    }

    /**
     * Applies a selection to the DOM, using extend() when possible or falling back to Range.
     *
     * @param domSelection - The DOM Selection object
     * @param anchorDOM - Anchor DOM position
     * @param headDOM - Head DOM position
     * @param anchor - Anchor document position
     * @param head - Head document position
     * @param brKludge - Whether BR kludge is active
     */
    private applyDOMSelection(domSelection: Selection,
                              anchorDOM: { node: Node, offset: number },
                              headDOM: { node: Node, offset: number },
                              anchor: number,
                              head: number,
                              brKludge: boolean): void {
        // Try to use Selection.extend for inverted selections
        if (this.tryExtendSelection(domSelection, anchorDOM, headDOM, anchor, head, brKludge)) {
            return;
        }

        // Fallback: use Range API
        this.applyRangeSelection(domSelection, anchorDOM, headDOM, anchor, head);
    }

    /**
     * Attempts to set selection using Selection.extend() for better support of inverted selections.
     *
     * @returns True if extend was successful, false if fallback needed
     */
    private tryExtendSelection(domSelection: Selection,
                               anchorDOM: { node: Node, offset: number },
                               headDOM: { node: Node, offset: number },
                               anchor: number,
                               head: number,
                               brKludge: boolean): boolean {
        if (!(domSelection.extend || anchor === head) || (brKludge && browser.gecko)) {
            return false;
        }

        domSelection.collapse(anchorDOM.node, anchorDOM.offset);

        try {
            if (anchor !== head) {
                domSelection.extend(headDOM.node, headDOM.offset);
            }
            return true;
        } catch (_) {
            // In some cases with Chrome the selection is empty after calling
            // collapse, even when it should be valid. This appears to be a bug, but
            // it is difficult to isolate. If this happens fallback to the old path
            // without using extend.
            // Similarly, this could crash on Safari if the editor is hidden.
            return false;
        }
    }

    /**
     * Sets selection using the Range API (fallback when extend() isn't available or fails).
     */
    private applyRangeSelection(domSelection: Selection,
                                anchorDOM: { node: Node, offset: number },
                                headDOM: { node: Node, offset: number },
                                anchor: number,
                                head: number): void {
        // Swap positions if selection is inverted
        if (anchor > head) {
            const tmp = anchorDOM;
            anchorDOM = headDOM;
            headDOM = tmp;
        }

        const range: Range = document.createRange();
        range.setEnd(headDOM.node, headDOM.offset);
        range.setStart(anchorDOM.node, anchorDOM.offset);
        domSelection.removeAllRanges();
        domSelection.addRange(range);
    }

    /**
     * Checks if a dirty range overlaps with a child's range.
     *
     * @param from - Start of dirty range
     * @param to - End of dirty range
     * @param childStart - Start of child range
     * @param childEnd - End of child range
     * @returns True if ranges overlap
     */
    private rangeOverlapsChild(from: number,
                               to: number,
                               childStart: number,
                               childEnd: number): boolean {
        // Special handling for zero-size nodes
        if (childStart === childEnd) {
            return from <= childEnd && to >= childStart;
        }
        return from < childEnd && to > childStart;
    }

    /**
     * Attempts to mark a child dirty if the range is contained within it.
     *
     * @param child - The child to mark
     * @param from - Start of dirty range
     * @param to - End of dirty range
     * @param childStart - Start of child
     * @param childEnd - End of child
     * @returns True if child was marked and we can stop processing
     */
    private tryMarkChildDirty(child: ViewDesc,
                              from: number,
                              to: number,
                              childStart: number,
                              childEnd: number): boolean {
        const contentStart: number = childStart + child.border;
        const contentEnd: number = childEnd - child.border;

        if (from >= contentStart && to <= contentEnd) {
            // Range fully contained in child
            this.markChildAndParent(child, from, to, childStart, childEnd, contentStart, contentEnd);
            return true;
        } else {
            // Range partially overlaps - mark for full recreation
            this.markChildForRecreation(child);
            return false;
        }
    }

    /**
     * Marks a child and its parent with appropriate dirty states.
     *
     * @param child - The child to mark
     * @param from - Start of dirty range
     * @param to - End of dirty range
     * @param childStart - Start of child
     * @param childEnd - End of child
     * @param contentStart - Start of child's content
     * @param contentEnd - End of child's content
     */
    private markChildAndParent(child: ViewDesc,
                               from: number,
                               to: number,
                               childStart: number,
                               childEnd: number,
                               contentStart: number,
                               contentEnd: number): void {
        const touchesBoundary = from === childStart || to === childEnd;
        this._dirty = touchesBoundary ? ViewDirtyState.CONTENT_DIRTY : ViewDirtyState.CHILD_DIRTY;

        const coversEntireChild: boolean = from === contentStart && to === contentEnd;
        const isContentLost: boolean = child.contentLost || child.dom.parentNode !== this._contentDOM;

        if (coversEntireChild && isContentLost) {
            child.dirty = ViewDirtyState.NODE_DIRTY;
        } else {
            child.markDirty(from - contentStart, to - contentStart);
        }
    }

    /**
     * Marks a child for full recreation (NODE_DIRTY or CONTENT_DIRTY).
     *
     * @param child - The child to mark
     */
    private markChildForRecreation(child: ViewDesc): void {
        const canUseContentDirty: boolean = child.dom === child.contentDOM
            && child.dom.parentNode === this._contentDOM
            && !child.children.length;

        child.dirty = canUseContentDirty ? ViewDirtyState.CONTENT_DIRTY : ViewDirtyState.NODE_DIRTY;
    }
}
