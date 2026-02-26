import {browser} from '@type-editor/commons';
import type {WidgetType} from '@type-editor/decoration';
import type {
    DecorationSource,
    DecorationWidgetOptions,
    PmDecoration,
    PmEditorView,
    PmViewDesc
} from '@type-editor/editor-types';
import {type Fragment, Mark, type PmNode} from '@type-editor/model';

import type {CompositionViewDesc} from './CompositionViewDesc';
import type {CustomNodeViewDesc} from './CustomNodeViewDesc';
import type {NodeViewDesc} from './NodeViewDesc';
import type {TextViewDesc} from './TextViewDesc';
import {replaceNodes} from './util/replace-nodes';
import type {ViewDesc} from './ViewDesc';
import {ViewDescFactory} from './ViewDescFactory';
import {ViewDescType} from './ViewDescType';
import {ViewDirtyState} from './ViewDirtyState';
import {ViewTreeUpdater} from './ViewTreeUpdater';


export class ViewDescUpdater {

    private readonly viewDesc: ViewDesc;
    private readonly view: PmEditorView;


    constructor(viewDesc: ViewDesc, view: PmEditorView) {
        this.viewDesc = viewDesc;
        this.view = view;
    }

    /**
     * If this desc must be updated to match the given node decoration,
     * do so and return true.
     *
     * @param viewDesc - View desc to update (changes as we enter/exit marks)
     * @param view - The editor view
     * @param node - The new node
     * @param outerDeco - New outer decorations
     * @param innerDeco - New inner decorations
     * @returns True if update succeeded
     */
    public static update(viewDesc: ViewDesc,
                         view: PmEditorView,
                         node: PmNode,
                         outerDeco: ReadonlyArray<PmDecoration>,
                         innerDeco: DecorationSource): boolean {
        const viewDescUpdater = new ViewDescUpdater(viewDesc, view);
        return viewDescUpdater.update(node, outerDeco, innerDeco);
    }

    /**
     * Syncs `this.children` to match `this.node.content` and the local
     * decorations, possibly introducing nesting for marks. Then, in a
     * separate step, syncs the DOM inside `this.contentDOM` to
     * `this.children`.
     *
     * @param viewDesc - View desc to update (changes as we enter/exit marks)
     * @param view - The editor view
     * @param pos
     */
    public static updateChildren(viewDesc: ViewDesc,
                                 view: PmEditorView,
                                 pos: number): void {
        const viewDescUpdater = new ViewDescUpdater(viewDesc, view);
        viewDescUpdater.updateChildren(pos);
    }


    /**
     * If this desc must be updated to match the given node decoration,
     * do so and return true.
     *
     * @param node - The new node
     * @param outerDeco - New outer decorations
     * @param innerDeco - New inner decorations
     * @returns True if update succeeded
     */
    private update(node: PmNode,
                   outerDeco: ReadonlyArray<PmDecoration>,
                   innerDeco: DecorationSource): boolean {
        if (this.viewDesc.getType() === ViewDescType.TEXT) {
            const textDesc = this.viewDesc as TextViewDesc;
            return textDesc.update(node, outerDeco, innerDeco, this.view);
        } else if (this.viewDesc.getType() === ViewDescType.CUSTOM) {
            const customDesc = this.viewDesc as CustomNodeViewDesc;

            if (customDesc.dirty === ViewDirtyState.NODE_DIRTY) {
                return false;
            }

            if (customDesc.spec.update && (customDesc.node.type === node.type || customDesc.spec.multiType)) {
                const result: boolean = customDesc.spec.update(node, outerDeco, innerDeco);
                if (result) {
                    this.updateInner(node, outerDeco, innerDeco);
                }
                return result;
            }

            if (!customDesc.contentDOM && !node.isLeaf) {
                return false;
            }
        }

        if (this.viewDesc.dirty === ViewDirtyState.NODE_DIRTY || !node.sameMarkup(this.viewDesc.node)) {
            return false;
        }

        this.updateInner(node, outerDeco, innerDeco);
        return true;
    }


    /**
     * Syncs `this.children` to match `this.node.content` and the local
     * decorations, possibly introducing nesting for marks. Then, in a
     * separate step, syncs the DOM inside `this.contentDOM` to
     * `this.children`.
     *
     * @param pos
     */
    private updateChildren(pos: number): void {
        const inline: boolean = this.viewDesc.node.inlineContent;
        let off: number = pos;

        // Check for active composition (IME input) and find its position
        const composition: { node: Text; pos: number; text: string } =
            this.view.composing
                ? this.localCompositionInfo(pos)
                : null;

        const localComposition: { node: Text; pos: number; text: string } =
            composition && composition.pos > -1
                ? composition
                : null;

        // If composition is in a child node but we couldn't pinpoint it exactly
        const compositionInChild: boolean = composition && composition.pos < 0;
        const updater = new ViewTreeUpdater(this.viewDesc as NodeViewDesc, localComposition?.node, this.view);


        // Callback for each widget decoration
        const onWidgetFunc = (widget: PmDecoration, i: number, insideNode: boolean): void => {
            const widgetSpec = widget.spec as DecorationWidgetOptions;

            // Sync mark descs for widgets with marks, or match surrounding content marks
            if (widgetSpec.marks) {
                updater.syncToMarks(widgetSpec.marks, inline, i);
            } else if ((widget.type as WidgetType).side >= 0 && !insideNode) {
                updater.syncToMarks(
                    i === this.viewDesc.node.childCount
                        ? Mark.none
                        : this.viewDesc.node.child(i).marks,
                    inline,
                    i
                );
            }

            // Place the widget, reusing existing desc if possible
            updater.placeWidget(widget, off);

        };

        // Callback for each child node
        const onNodeFunc = (child: PmNode, outerDeco: ReadonlyArray<PmDecoration>, innerDeco: DecorationSource, index: number) => {
            // Ensure mark descs wrap this node correctly
            updater.syncToMarks(child.marks, inline, index);

            // Try multiple strategies to update or create view for this node
            let compIndex: number;
            if (updater.findNodeMatch(child, outerDeco, innerDeco, index)) {
                // Strategy 1: Found exact match with existing view - reuse it
            } else if (compositionInChild && this.view.state.selection.from > off
                && this.view.state.selection.to < off + child.nodeSize
                && (compIndex = updater.findIndexWithChild(composition.node)) > -1
                && updater.updateNodeAt(child, outerDeco, innerDeco, compIndex)) {
                // Strategy 2: This node contains active composition - update carefully
            } else if (updater.updateNextNode(child, outerDeco, innerDeco, index, off)) {
                // Strategy 3: Can update next existing node to represent this node
            } else {
                // Strategy 4: No reuse possible - create new view desc
                updater.addNode(child, outerDeco, innerDeco, off);
            }
            off += child.nodeSize;
        };

        // Iterate through all children and decorations
        this.iterDeco(this.viewDesc.node, (this.viewDesc as NodeViewDesc).innerDeco, onWidgetFunc, onNodeFunc);

        // Clean up remaining mark descs
        updater.syncToMarks([], inline, 0);

        // Clean up any remaining children that weren't matched
        updater.destroyRemaining();

        // Add browser compatibility hacks for textblocks (BR elements, etc.)
        // This must be done AFTER destroyRemaining() to avoid the BR being destroyed
        if (this.viewDesc.node.isTextblock) {
            updater.addTextblockHacks();
        }

        // Step 2: Sync the actual DOM to match the updated view desc tree
        if (updater.changed || this.viewDesc.dirty === ViewDirtyState.CONTENT_DIRTY) {

            // Special handling: preserve composition DOM node if active
            if (localComposition) {
                this.protectLocalComposition(this.view, localComposition);
            }


            this.renderDescs(this.viewDesc.contentDOM, this.viewDesc.children, this.view);

            // iOS-specific hack for list markers
            if (browser.ios) {
                this.iosHacks(this.viewDesc.dom as HTMLElement);
            }
        }
    }

    /**
     * Gets a view description from a DOM node if it's a descendant of this description.
     *
     * @param dom - The DOM node to check
     * @returns The view description if it's a descendant, undefined otherwise
     */
    private getDesc(dom: Node): PmViewDesc | undefined {
        const desc: PmViewDesc = dom.pmViewDesc;
        for (let cur: PmViewDesc | undefined = desc; cur; cur = cur.parent) {
            if (cur === this.viewDesc) {
                return desc;
            }
        }
    }

    /**
     * Finds composition information within this node's content.
     * Returns null if composition is not active or not within this node.
     *
     * @param pos - The start position of this node in the document
     * @returns Composition info with text node, position, and text content, or null
     */
    private localCompositionInfo(pos: number): { node: Text, pos: number, text: string; } | null {
        // Only do something if both the selection and a focused text node
        // are inside of this node
        const {from, to} = this.view.state.selection;

        if (!(this.view.state.selection.isTextSelection())
            || from < pos
            || to > pos + this.viewDesc.node.content.size) {
            return null;
        }
        const textNode: Text = this.view.input.compositionNode;

        if (!textNode || !this.viewDesc.dom.contains(textNode.parentNode)) {
            return null;
        }

        if (this.viewDesc.node.inlineContent) {
            // Find the text in the focused node in the node, stop if it's not
            // there (may have been modified through other means, in which
            // case it should overwritten)
            const text: string = textNode.nodeValue;
            const textPos: number = this.findTextInFragment(this.viewDesc.node.content, text, from - pos, to - pos);
            return textPos < 0 ? null : {
                node: textNode,
                pos: textPos,
                text
            };
        } else {
            return {
                node: textNode,
                pos: -1,
                text: ''
            };
        }
    }

    /**
     * Find a piece of text in an inline fragment, overlapping from-to positions.
     *
     * @param frag - The fragment to search in
     * @param text - The text to search for
     * @param from - Start position of the search range
     * @param to - End position of the search range
     * @returns The position where the text was found, or -1 if not found
     */
    private findTextInFragment(frag: Fragment,
                               text: string,
                               from: number,
                               to: number): number {
        for (let i = 0, pos = 0; i < frag.childCount && pos <= to;) {
            const child: PmNode = frag.child(i++);
            const childStart: number = pos;
            pos += child.nodeSize;

            if (!child.isText) {
                continue;
            }

            let str: string = child.text;
            while (i < frag.childCount) {
                const next: PmNode = frag.child(i++);
                pos += next.nodeSize;
                if (!next.isText) {
                    break;
                }
                str += next.text;
            }

            if (pos >= from) {
                if (pos >= to && str.slice(to - text.length - childStart, to - childStart) === text) {
                    return to - text.length;
                }

                const found: number = childStart < to ? str.lastIndexOf(text, to - childStart - 1) : -1;
                if (found >= 0 && found + text.length + childStart >= from) {
                    return childStart + found;
                }

                if (from === to
                    && str.length >= (to + text.length) - childStart
                    && str.slice(to - childStart, to - childStart + text.length) === text) {
                    return to;
                }
            }
        }
        return -1;
    }

    /**
     * Iterates over nodes and decorations in a fragment, handling widgets and text splitting.
     *
     * This function coordinates the complex process of:
     * - Maintaining "active" decorations that span multiple nodes
     * - Emitting widgets at their positions
     * - Splitting text nodes at decoration boundaries
     * - Passing correct inner/outer decorations to each node
     *
     * @param parent - The parent node containing children to iterate
     * @param deco - The decoration source
     * @param onWidget - Callback for each widget decoration
     * @param onNode - Callback for each child node
     */
    private iterDeco(parent: PmNode,
                     deco: DecorationSource,
                     onWidget: (widget: PmDecoration, index: number, insideNode: boolean) => void,
                     onNode: (node: PmNode, outerDeco: ReadonlyArray<PmDecoration>, innerDeco: DecorationSource, index: number) => void): void {
        const locals: ReadonlyArray<PmDecoration> = deco.locals(parent);

        if (locals.length === 0) {
            this.iterDecoSimple(parent, deco, onNode);
            return;
        }

        this.iterDecoWithDecorations(parent, deco, locals, onWidget, onNode);
    }

    /**
     * Simple iteration path when there are no decorations.
     *
     * @param parent - The parent node
     * @param deco - The decoration source
     * @param onNode - Callback for each child node
     */
    private iterDecoSimple(parent: PmNode,
                           deco: DecorationSource,
                           onNode: (node: PmNode, outerDeco: ReadonlyArray<PmDecoration>, innerDeco: DecorationSource, index: number) => void): void {
        let offset = 0;
        for (let i = 0; i < parent.childCount; i++) {
            const child = parent.child(i);
            onNode(child, [], deco.forChild(offset, child), i);
            offset += child.nodeSize;
        }
    }

    /**
     * Complex iteration path when decorations are present.
     *
     * @param parent - The parent node
     * @param deco - The decoration source
     * @param locals - Local decorations
     * @param onWidget - Callback for widgets
     * @param onNode - Callback for nodes
     */
    private iterDecoWithDecorations(parent: PmNode,
                                    deco: DecorationSource,
                                    locals: ReadonlyArray<PmDecoration>,
                                    onWidget: (widget: PmDecoration, index: number, insideNode: boolean) => void,
                                    onNode: (node: PmNode, outerDeco: ReadonlyArray<PmDecoration>, innerDeco: DecorationSource, index: number) => void): void {
        let offset = 0;
        let decoIndex = 0;
        const active: Array<PmDecoration> = [];
        let restNode: PmNode | null = null;

        for (let parentIndex = 0; ;) {
            // Emit any widgets at current position
            const widgetsEmitted: { newDecoIndex: number } = this.emitWidgetsAtPosition(
                locals,
                offset,
                decoIndex,
                parentIndex,
                restNode,
                onWidget
            );
            decoIndex = widgetsEmitted.newDecoIndex;

            // Get next child
            const childInfo = this.getNextChild(parent, parentIndex, restNode);
            if (!childInfo) {
                break;
            }

            ({child: childInfo.child, index: childInfo.index} = childInfo);
            if (childInfo.isRest) {
                restNode = null;
            } else {
                parentIndex++;
            }

            // Update active decorations
            this.updateActiveDecorations(active, offset);
            decoIndex = this.advanceToActiveDecorations(locals, decoIndex, offset, active);

            let end = offset + childInfo.child.nodeSize;

            // Handle text node splitting at decoration boundaries
            if (childInfo.child.isText) {
                const splitResult = this.splitTextNodeIfNeeded(childInfo.child, offset, end, locals, decoIndex, active);
                childInfo.child = splitResult.child;
                end = splitResult.end;
                restNode = splitResult.restNode;
                if (splitResult.wasSplit) {
                    childInfo.index = -1;
                }
            } else {
                // Skip decorations that end inside non-text nodes
                while (decoIndex < locals.length && locals[decoIndex].to < end) {
                    decoIndex++;
                }
            }

            // Determine which decorations apply to this child
            const outerDeco: Array<PmDecoration> = this.getOuterDecorationsForChild(childInfo.child, active);
            onNode(childInfo.child, outerDeco, deco.forChild(offset, childInfo.child), childInfo.index);
            offset = end;
        }
    }

    /**
     * Emits widgets at the current position.
     *
     * @param locals - Local decorations
     * @param offset - Current offset
     * @param decoIndex - Current decoration index
     * @param parentIndex - Current parent index
     * @param restNode - Rest node from previous split
     * @param onWidget - Widget callback
     * @returns Object with new decoration index
     */
    private emitWidgetsAtPosition(locals: ReadonlyArray<PmDecoration>,
                                  offset: number,
                                  decoIndex: number,
                                  parentIndex: number,
                                  restNode: PmNode | null,
                                  onWidget: (widget: PmDecoration, index: number, insideNode: boolean) => void): {
        newDecoIndex: number
    } {
        const widgets: Array<PmDecoration> = [];

        // Collect all widgets at this position
        while (decoIndex < locals.length && locals[decoIndex].to === offset) {
            const deco = locals[decoIndex++];
            if (deco.widget) {
                widgets.push(deco);
            }
        }

        if (widgets.length === 0) {
            return {newDecoIndex: decoIndex};
        }

        // Sort multiple widgets by side property
        if (widgets.length > 1) {
            widgets.sort(
                (a: PmDecoration, b: PmDecoration): number =>
                    (a.type as WidgetType).side - (b.type as WidgetType).side
            );
        }

        // Emit widgets
        for (const widget of widgets) {
            onWidget(widget, parentIndex, !!restNode);
        }

        return {newDecoIndex: decoIndex};
    }

    /**
     * Gets the next child to process.
     *
     * @param parent - Parent node
     * @param parentIndex - Current parent index
     * @param restNode - Rest node from previous split
     * @returns Child info or null if done
     */
    private getNextChild(parent: PmNode,
                         parentIndex: number,
                         restNode: PmNode | null): { child: PmNode, index: number, isRest: boolean } | null {
        if (restNode) {
            return {child: restNode, index: -1, isRest: true};
        }

        if (parentIndex < parent.childCount) {
            return {child: parent.child(parentIndex), index: parentIndex, isRest: false};
        }

        return null;
    }

    /**
     * Updates active decorations by removing those that have ended.
     *
     * Note: Modifies the active array by filtering in place to maintain reference.
     * Using splice in reverse to avoid index shifting issues.
     *
     * @param active - Array of active decorations (modified in place)
     * @param offset - Current offset
     */
    private updateActiveDecorations(active: Array<PmDecoration>, offset: number): void {
        // Iterate backwards to safely remove elements during iteration
        // This approach is necessary because we need to maintain the array reference
        for (let i = active.length - 1; i >= 0; i--) {
            if (active[i].to <= offset) {
                active.splice(i, 1);
            }
        }
    }

    /**
     * Advances decoration index and adds new active decorations.
     *
     * @param locals - Local decorations
     * @param decoIndex - Current decoration index
     * @param offset - Current offset
     * @param active - Array of active decorations
     * @returns New decoration index
     */
    private advanceToActiveDecorations(locals: ReadonlyArray<PmDecoration>,
                                       decoIndex: number,
                                       offset: number,
                                       active: Array<PmDecoration>): number {
        while (decoIndex < locals.length && locals[decoIndex].from <= offset && locals[decoIndex].to > offset) {
            active.push(locals[decoIndex++]);
        }
        return decoIndex;
    }

    /**
     * Splits a text node at decoration boundaries if needed.
     *
     * @param child - The text node to potentially split
     * @param offset - Current offset
     * @param end - End offset
     * @param locals - Local decorations
     * @param decoIndex - Current decoration index
     * @param active - Active decorations
     * @returns Split result with potentially modified child
     */
    private splitTextNodeIfNeeded(child: PmNode,
                                  offset: number,
                                  end: number,
                                  locals: ReadonlyArray<PmDecoration>,
                                  decoIndex: number,
                                  active: Array<PmDecoration>): {
        child: PmNode,
        end: number,
        restNode: PmNode | null,
        wasSplit: boolean
    } {
        let cutAt: number = end;

        // Find earliest point where we need to cut
        if (decoIndex < locals.length && locals[decoIndex].from < cutAt) {
            cutAt = locals[decoIndex].from;
        }

        for (const deco of active) {
            if (deco.to < cutAt) {
                cutAt = deco.to;
            }
        }

        // Split if needed
        if (cutAt < end) {
            return {
                child: child.cut(0, cutAt - offset),
                end: cutAt,
                restNode: child.cut(cutAt - offset),
                wasSplit: true
            };
        }

        return {child, end, restNode: null, wasSplit: false};
    }

    /**
     * Gets outer decorations that should apply to a child node.
     *
     * @param child - The child node
     * @param active - Active decorations
     * @returns Array of applicable decorations
     */
    private getOuterDecorationsForChild(child: PmNode,
                                        active: Array<PmDecoration>): Array<PmDecoration> {
        // Inline leaves get all active decorations
        // Inline non-leaves only get non-inline decorations
        if (child.isInline && !child.isLeaf) {
            return active.filter(d => !d.inline);
        }
        return active.slice();
    }

    /**
     * Sync the content of the given DOM node with the nodes associated
     * with the given array of view descs, recursing into mark descs
     * because this should sync the subtree for a whole node at a time.
     *
     * Algorithm:
     * 1. Iterate through view descs in order
     * 2. For each desc, ensure its DOM is in the correct position
     *    - If already in place, skip to next
     *    - If not, remove intervening nodes and insert it
     * 3. For mark descs, recursively sync their children
     * 4. Remove any remaining DOM nodes after last desc
     *
     * @param parentDOM - The parent DOM element to sync
     * @param viewDescList - The list of view descriptions to render
     * @param view - The editor view
     */
    private renderDescs(parentDOM: HTMLElement,
                        viewDescList: ReadonlyArray<ViewDesc>,
                        view: PmEditorView): void {
        let dom: ChildNode = parentDOM.firstChild;
        let written = false;

        for (const item of viewDescList) {
            const viewDesc: ViewDesc = item;
            const childDOM: Node = viewDesc.dom;

            if (childDOM.parentNode === parentDOM) {
                // childDOM is already in parentDOM, remove any nodes before it
                while (childDOM !== dom) {
                    dom = this.removeDOMNode(dom);
                    written = true;
                }
                dom = dom.nextSibling;
            } else {
                // childDOM is not yet in parentDOM, insert it
                written = true;
                parentDOM.insertBefore(childDOM, dom);
            }

            // Recursively sync mark desc children
            if (viewDesc?.getType() === ViewDescType.MARK) {
                const pos: ChildNode = dom ? dom.previousSibling : parentDOM.lastChild;
                this.renderDescs(viewDesc.contentDOM, viewDesc.children, view);
                // After recursion, restore position (children might have been added/removed)
                dom = pos ? pos.nextSibling : parentDOM.firstChild;
            }
        }

        // Remove any remaining DOM nodes
        while (dom) {
            dom = this.removeDOMNode(dom);
            written = true;
        }

        // Clear trackWrites if we modified the tracked node
        if (written && view.trackWrites === parentDOM) {
            view.clearTrackWrites();
        }
    }

    /**
     * Remove a DOM node and return its next sibling.
     *
     * @param dom - The DOM node to remove
     * @returns The next sibling of the removed node
     */
    private removeDOMNode(dom: Node): ChildNode {
        const next: ChildNode = dom.nextSibling;
        dom.parentNode.removeChild(dom);
        return next;
    }

    /**
     * List markers in Mobile Safari will mysteriously disappear
     * sometimes. This works around that by temporarily changing the list style.
     *
     * The workaround works by:
     * 1. Changing list-style to force a style recalculation
     * 2. Reading a computed style to ensure the browser processes the change
     * 3. Restoring the original style
     *
     * This appears to reset some internal state in WebKit that causes the bug.
     *
     * @param dom - The list element (UL or OL) to apply the hack to
     */
    private iosHacks(dom: HTMLElement): void {
        if (dom.nodeName === 'UL' || dom.nodeName === 'OL') {
            const oldCSS: string = dom.style.cssText;
            // Temporarily change list style
            dom.style.cssText = oldCSS + '; list-style: square !important';
            // Force style recalculation by reading computed style
            void window.getComputedStyle(dom).listStyle;
            // Restore original style
            dom.style.cssText = oldCSS;
        }
    }

    /**
     * Protects a composition node from being removed during updates.
     * Creates a CompositionViewDesc to wrap orphaned composition nodes.
     *
     * @param view - The editor view
     * @param compositionData - Information about the active composition
     */
    private protectLocalComposition(view: PmEditorView,
                                    compositionData: { node: Text, pos: number, text: string; }): void {
        // The node is already part of a local view desc, leave it there
        if (this.getDesc(compositionData.node)) {
            return;
        }

        // Create a composition view for the orphaned nodes
        let topNode: Node = compositionData.node;

        for (; ; topNode = topNode.parentNode) {
            if (topNode.parentNode === this.viewDesc.contentDOM) {
                break;
            }

            while (topNode.previousSibling) {
                topNode.parentNode.removeChild(topNode.previousSibling);
            }

            while (topNode.nextSibling) {
                topNode.parentNode.removeChild(topNode.nextSibling);
            }

            if (topNode.pmViewDesc) {
                topNode.pmViewDesc = undefined;
            }
        }

        const desc: CompositionViewDesc = ViewDescFactory.createCompositionViewDesc(this.viewDesc, topNode, compositionData.node, compositionData.text);
        view.input.compositionNodes.push(desc);

        // Patch up this.children to contain the composition view
        this.viewDesc.children = replaceNodes(
            this.viewDesc.children,
            compositionData.pos,
            compositionData.pos + compositionData.text.length,
            view,
            desc);
    }


    /**
     * Updates the internal state of this node view with new node and decorations.
     * Also updates children if this node has a content DOM.
     *
     * @param node - The new node
     * @param outerDeco - New outer decorations
     * @param innerDeco - New inner decorations
     */
    private updateInner(node: PmNode,
                        outerDeco: ReadonlyArray<PmDecoration>,
                        innerDeco: DecorationSource): void {
        if (this.viewDesc?.getType() === ViewDescType.NODE
            || this.viewDesc?.getType() === ViewDescType.CUSTOM
            || this.viewDesc?.getType() === ViewDescType.TEXT) {

            const nodeViewDesc = this.viewDesc as NodeViewDesc;
            nodeViewDesc.updateInner(node, outerDeco, innerDeco);
            if (nodeViewDesc.contentDOM) {
                this.updateChildren(nodeViewDesc.posAtStart);
            }
            nodeViewDesc.dirty = ViewDirtyState.NOT_DIRTY;
        }
    }

}
