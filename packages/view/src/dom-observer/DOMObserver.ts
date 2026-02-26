import {browser, ELEMENT_NODE, TEXT_NODE} from '@type-editor/commons';
import {domIndex, isEquivalentPosition, parentNode} from '@type-editor/dom-util';
import type {DOMSelectionRange, PmDOMObserver, PmSelection} from '@type-editor/editor-types';
import {hasFocusAndSelection, selectionCollapsed, selectionFromDOM, selectionToDOM} from '@type-editor/selection-util';
import {Selection} from '@type-editor/state';
import {type NodeViewDesc, type ViewDesc, ViewDescUtil} from '@type-editor/viewdesc';

import {EditorView} from '../EditorView';
import {SelectionState} from './SelectionState';

const KEY_BACKSPACE = 'Backspace';
const KEY_DELETE = 'Delete';

/**
 * Observes DOM changes and selection changes in a ProseMirror editor view.
 * This class bridges between native browser events and ProseMirror's state management,
 * ensuring that external DOM modifications are properly synchronized with the editor state.
 */
export class DOMObserver implements PmDOMObserver {

    private readonly observer: MutationObserver | null = null;
    private readonly _currentSelection: SelectionState = new SelectionState();
    private readonly onCharData: ((e: Event) => void) | null = null;
    private readonly view: EditorView;
    private readonly handleDOMChange: (from: number, to: number, typeOver: boolean, added: Array<Node>) => void;

    private queue: Array<MutationRecord> = [];
    private _stopFlushTimeout = -1;
    private suppressingSelectionUpdates = false;
    private suppressionTimeout = -1;
    private _flushingSoon = -1;
    private _lastChangedTextNode: Text | null = null;
    /**
     * Tracks which views have been checked for CSS configuration to avoid repeated warnings.
     */
    private cssChecked = new WeakMap<EditorView, null>();
    /**
     * Flag to ensure CSS warning is only shown once.
     */
    private cssCheckWarned = false;

    /**
     * Holds `true` when a hack node is needed in Firefox to prevent the
     * [space is eaten issue](https://github.com/ProseMirror/prosemirror/issues/651)
     */
    private isGeckoHackNodeRequired = false;

    /**
     * Creates a new DOM observer.
     * @param view - The editor view to observe
     * @param handleDOMChange - Callback invoked when DOM changes are detected
     */
    constructor(view: EditorView,
                handleDOMChange: (from: number, to: number, typeOver: boolean, added: Array<Node>) => void) {
        this.view = view;
        this.handleDOMChange = handleDOMChange;

        this.observer = this.createMutationObserver();

        /**
         * IE11 has very broken mutation observers, so we also listen to DOMCharacterDataModified.
         * TODO: Remove IE11 support in future versions.
         */
        if (browser.ie && browser.ie_version <= 11) {
            this.onCharData = this.createCharDataHandler();
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.onSelectionChange = this.onSelectionChange.bind(this);
    }

    /**
     * Gets the timeout ID for pending flush operation.
     * @returns The timeout ID, or -1 if no flush is scheduled
     */
    get flushingSoon(): number {
        return this._flushingSoon;
    }

    /**
     * Gets the last text node that was modified.
     * @returns The last changed text node or null
     */
    get lastChangedTextNode(): Text | null {
        return this._lastChangedTextNode;
    }

    /**
     * Gets the current cached selection state.
     * @returns The current selection state
     */
    get currentSelection(): SelectionState {
        return this._currentSelection;
    }

    get requiresGeckoHackNode(): boolean {
        return this.isGeckoHackNodeRequired;
    }

    /**
     * Schedules a flush operation to process pending mutations after a short delay.
     * This helps batch multiple rapid changes together for better performance.
     */
    public flushSoon(): void {
        // Only schedule if no flush is already pending (-1 means no timeout set)
        if (this._flushingSoon < 0) {
            // Wait 20ms to batch rapid changes together
            this._flushingSoon = window.setTimeout(() => {
                this._flushingSoon = -1;
                this.flush();
            }, 20);
        }
    }

    /**
     * Cancels any pending flush and immediately processes all mutations.
     */
    public forceFlush(): void {
        if (this._flushingSoon > -1) {
            window.clearTimeout(this._flushingSoon);
            this._flushingSoon = -1;
            this.flush();
        }
    }

    /**
     * Starts observing DOM and selection changes.
     * This should be called when the editor becomes active.
     */
    public start(): void {
        // Clear any pending stop flush timeout to prevent race conditions
        if (this._stopFlushTimeout > -1) {
            window.clearTimeout(this._stopFlushTimeout);
            this._stopFlushTimeout = -1;
        }

        /**
         * Configuration for MutationObserver to track all relevant DOM changes.
         */
        const observeOptions: MutationObserverInit = {
            childList: true,
            characterData: true,
            characterDataOldValue: true,
            attributes: true,
            attributeOldValue: true,
            subtree: true
        };

        if (this.observer) {
            this.observer.takeRecords();
            this.observer.observe(this.view.dom, observeOptions);
        }

        if (this.onCharData) {
            this.view.dom.addEventListener('DOMCharacterDataModified', this.onCharData);
        }

        this.connectSelection();
    }

    /**
     * Stops observing DOM and selection changes.
     * Any pending mutations are flushed asynchronously.
     */
    public stop(): void {
        // Clear any pending stop flush timeout
        if (this._stopFlushTimeout > -1) {
            window.clearTimeout(this._stopFlushTimeout);
            this._stopFlushTimeout = -1;
        }

        if (this.observer) {
            const take: Array<MutationRecord> = this.observer.takeRecords();

            if (take.length) {
                this.queue.push(...take);
                this._stopFlushTimeout = window.setTimeout(() => {
                    this._stopFlushTimeout = -1;
                    this.flush();
                }, 20);
            }

            this.observer.disconnect();
        }

        if (this.onCharData) {
            this.view.dom.removeEventListener('DOMCharacterDataModified', this.onCharData);
        }

        this.disconnectSelection();

        // Clear suppression timeout on stop
        if (this.suppressionTimeout > -1) {
            window.clearTimeout(this.suppressionTimeout);
            this.suppressionTimeout = -1;
            this.suppressingSelectionUpdates = false;
        }
    }

    /**
     * Starts listening to selection change events.
     */
    public connectSelection(): void {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.view.dom.ownerDocument.addEventListener('selectionchange', this.onSelectionChange);
    }

    /**
     * Stops listening to selection change events.
     */
    public disconnectSelection(): void {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.view.dom.ownerDocument.removeEventListener('selectionchange', this.onSelectionChange);
    }

    /**
     * Temporarily suppresses selection updates for 50ms.
     * This is useful when programmatically changing the selection.
     */
    public suppressSelectionUpdates(): void {
        // Clear any existing suppression timeout to prevent memory leak
        if (this.suppressionTimeout > -1) {
            window.clearTimeout(this.suppressionTimeout);
        }

        this.suppressingSelectionUpdates = true;
        this.suppressionTimeout = window.setTimeout(() => {
            this.suppressingSelectionUpdates = false;
            this.suppressionTimeout = -1;
        }, 50);
    }

    /**
     * Updates the cached current selection from the DOM.
     */
    public setCurSelection(): void {
        this._currentSelection.set(this.view.domSelectionRange());
    }

    /**
     * Retrieves all pending mutation records and returns the current queue.
     * @returns Array of pending mutation records
     */
    public pendingRecords(): Array<MutationRecord> {
        if (this.observer) {
            const records: Array<MutationRecord> = this.observer.takeRecords();
            this.queue.push(...records);
        }
        return this.queue;
    }

    /**
     * Processes all pending mutations and synchronizes the editor state.
     * This is the main entry point for DOM change handling.
     */
    public flush(): void {
        const {view} = this;
        // Don't flush if view isn't ready or if a flush is already scheduled
        if (!view.docView || this._flushingSoon > -1) {
            return;
        }

        // Collect all pending mutation records and clear the queue
        const mutations: Array<MutationRecord> = this.pendingRecords();
        if (mutations.length) {
            this.queue = [];
        }

        // Check if the DOM selection has changed
        const selectionRange: DOMSelectionRange = view.domSelectionRange();
        const hasNewSelection: boolean = this.hasNewSelection(selectionRange);

        // Process mutations to determine affected document range
        const {from, to, typeOver, addedNodes} = this.processMutations(mutations);

        // Remove bogus nodes inserted by browser quirks
        this.applyBrowserSpecificWorkarounds(addedNodes);

        // Handle special case: browser reset selection to document start after focus
        if (this.shouldRestoreSelectionAfterFocus(from, hasNewSelection, selectionRange)) {
            this.restoreSelectionAfterFocus(selectionRange);
        } else if (from > -1 || hasNewSelection) {
            // Apply the DOM changes to the editor state
            this.applyChanges(from, to, typeOver, addedNodes, hasNewSelection, selectionRange);
        }
    }

    /**
     * Creates and configures a MutationObserver for tracking DOM changes.
     * @returns A configured MutationObserver or null if not supported
     */
    private createMutationObserver(): MutationObserver | null {
        if (!window.MutationObserver) {
            return null;
        }

        return new window.MutationObserver(mutations => {
            this.queue.push(...mutations);

            if (this.shouldFlushSoonForIE11(mutations)) {
                this.flushSoon();
            } else {
                this.flush();
            }
        });
    }

    /**
     * Checks if IE11-specific flush delay is needed.
     * IE11 sometimes calls the observer callback before actually updating the DOM.
     * @param mutations - The mutation records to check
     * @returns true if immediate flush should be delayed
     */
    private shouldFlushSoonForIE11(mutations: Array<MutationRecord>): boolean {
        // Only apply this workaround for IE11 and below
        if (!browser.ie || browser.ie_version > 11) {
            return false;
        }

        return mutations.some((mutationRecord: MutationRecord): boolean => {
            // Delay if nodes were removed (backspace/delete operations)
            if (mutationRecord.type === 'childList' && mutationRecord.removedNodes.length) {
                return true;
            }
            // Delay if text was shortened (indicates DOM hasn't caught up yet)
            if (mutationRecord.type === 'characterData' && mutationRecord.oldValue) {
                return mutationRecord.oldValue.length > (mutationRecord.target.nodeValue?.length ?? 0);
            }
            return false;
        });
    }

    /**
     * Creates a handler for legacy DOMCharacterDataModified events (IE11).
     * @returns Event handler function
     */
    private createCharDataHandler(): (e: Event) => void {
        return (e: Event) => {
            // TypeScript doesn't have a type for the legacy DOMCharacterDataModified event
            interface LegacyCharDataEvent extends Event {
                prevValue?: string;
            }

            this.queue.push({
                target: e.target as Node,
                type: 'characterData',
                oldValue: (e as LegacyCharDataEvent).prevValue
            } as MutationRecord);

            this.flushSoon();
        };
    }

    /**
     * Handles native DOM selection change events.
     * Coordinates between browser selection and ProseMirror state.
     */
    private onSelectionChange(): void {
        // Ignore selection changes when editor doesn't have focus
        if (!hasFocusAndSelection(this.view)) {
            return;
        }

        // During programmatic selection changes, restore the intended selection
        if (this.suppressingSelectionUpdates) {
            selectionToDOM(this.view);
            return;
        }

        // IE11 fires events in wrong order, so delay processing
        if (this.shouldDelayForIE11Selection()) {
            this.flushSoon();
            return;
        }

        // Process the selection change immediately
        this.flush();
    }

    /**
     * Checks if the selection change should be delayed for IE11 compatibility.
     * IE11 fires deletion events in the wrong order.
     * @returns true if the flush should be delayed
     */
    private shouldDelayForIE11Selection(): boolean {
        // TODO: remove IE 11 support?
        if (!browser.ie || browser.ie_version > 11 || this.view.state.selection.empty) {
            return false;
        }

        const selectionRange: DOMSelectionRange = this.view.domSelectionRange();

        // Selection.isCollapsed isn't reliable on IE
        return selectionRange.focusNode
            && isEquivalentPosition(
                selectionRange.focusNode,
                selectionRange.focusOffset,
                selectionRange.anchorNode,
                selectionRange.anchorOffset
            );
    }

    /**
     * Determines if a selection change should be ignored based on view descriptors.
     * @param selectionRange - The DOM selection range to check
     * @returns true if the selection change should be ignored
     */
    private ignoreSelectionChange(selectionRange: DOMSelectionRange): boolean {
        if (!selectionRange.focusNode) {
            return true;
        }

        const container: Node = this.findCommonAncestor(selectionRange);
        if (!container) {
            return false;
        }

        const viewDesc: ViewDesc = ViewDescUtil.nearestViewDesc(this.view.docView, container);

        // Get the target, handling text nodes with potentially null parentNode
        const target: Node = container.nodeType === TEXT_NODE ? container.parentNode : container;
        if (!target) {
            return false; // Can't determine if should ignore without a target
        }

        const shouldIgnore: boolean = viewDesc?.ignoreMutation({
            type: 'selection',
            target
        });

        if (shouldIgnore) {
            this.setCurSelection();
            return true;
        }

        return false;
    }

    /**
     * Finds the common ancestor of the selection anchor and focus nodes.
     * @param selectionRange - The DOM selection range
     * @returns The common ancestor node or undefined
     */
    private findCommonAncestor(selectionRange: DOMSelectionRange): Node | undefined {
        // Early exit if anchor and focus are the same node
        if (selectionRange.anchorNode === selectionRange.focusNode) {
            return selectionRange.anchorNode;
        }

        const ancestors = new Set<Node>();

        // Build a set of all ancestors of the focus node
        for (let scan: Node | null = selectionRange.focusNode; scan; scan = parentNode(scan)) {
            ancestors.add(scan);
        }

        // Walk up from anchor node until we find a node that's also an ancestor of focus
        for (let scan = selectionRange.anchorNode; scan; scan = parentNode(scan)) {
            if (ancestors.has(scan)) {
                return scan;
            }
        }

        return undefined;
    }

    /**
     * Checks if there's a new selection that needs to be processed.
     * @param selectionRange - The current DOM selection range
     * @returns true if the selection has changed and should be processed
     */
    private hasNewSelection(selectionRange: DOMSelectionRange): boolean {
        return !this.suppressingSelectionUpdates
            && !this._currentSelection.eq(selectionRange)
            && hasFocusAndSelection(this.view)
            && !this.ignoreSelectionChange(selectionRange);
    }

    /**
     * Processes all mutations and computes the affected range.
     * @param mutations - Array of mutation records to process
     * @returns Object containing the affected range and added nodes
     */
    private processMutations(mutations: Array<MutationRecord>): {
        from: number;
        to: number;
        typeOver: boolean;
        addedNodes: Array<Node>;
    } {
        let from = -1;
        let to = -1;
        let typeOver = false;
        const addedNodes: Array<Node> = [];

        // Only process mutations if the editor is editable
        if (this.view.editable) {
            for (const mutation of mutations) {
                const result = this.registerMutation(mutation, addedNodes);
                if (result) {
                    // Expand the affected range to include this mutation
                    from = from < 0 ? result.from : Math.min(result.from, from);
                    to = to < 0 ? result.to : Math.max(result.to, to);

                    // Track if any mutation was a type-over (text replaced with identical text)
                    if (result.typeOver) {
                        typeOver = true;
                    }
                }
            }
        }

        return {from, to, typeOver, addedNodes};
    }

    /**
     * Applies browser-specific workarounds to handle quirks in different browsers.
     * @param addedNodes - Nodes that were added in this flush cycle
     */
    private applyBrowserSpecificWorkarounds(addedNodes: Array<Node>): void {
        if (browser.gecko && addedNodes.length) {
            this.handleGeckoBRWorkaround(addedNodes);
        } else if ((browser.chrome || browser.safari) && this.shouldRemoveBogusBRNodes(addedNodes)) {
            this.removeBogusBRNodes(addedNodes);
        }
    }

    /**
     * Handles Firefox's BR node quirks.
     * @param addedNodes - Nodes that were added
     */
    private handleGeckoBRWorkaround(addedNodes: Array<Node>): void {
        const brTags = addedNodes.filter((node: Node): boolean => node.nodeName === 'BR') as Array<HTMLElement>;

        // Firefox sometimes inserts duplicate BR nodes
        if (brTags.length === 2) {
            const [a, b] = brTags;
            // Remove one of the duplicate BRs based on their parent hierarchy
            if (a.parentNode?.parentNode === b.parentNode) {
                b.remove();
            } else {
                a.remove();
            }
        } else {
            // Clean up unwanted BRs in list items
            this.removeUnwantedBRsInListItems(brTags);
        }
    }

    /**
     * Removes unwanted BR nodes from list items in Firefox.
     * @param brs - Array of BR elements to check
     */
    private removeUnwantedBRsInListItems(brs: Array<HTMLElement>): void {
        const {focusNode} = this._currentSelection;

        for (const br of brs) {
            const parent: ParentNode = br.parentNode;
            if (parent?.nodeName === 'LI' && (!focusNode || this.blockParent(this.view, focusNode) !== parent)) {
                br.remove();
            }
        }
    }

    /**
     * Checks if bogus BR nodes should be removed (Chrome/Safari workaround).
     * @param addedNodes - Nodes that were added
     * @returns true if BR nodes should be checked and removed
     */
    private shouldRemoveBogusBRNodes(addedNodes: Array<Node>): boolean {
        return addedNodes.some((node: Node): boolean => node.nodeName === 'BR')
            && (this.view.input.lastKey === KEY_BACKSPACE
                || this.view.input.lastKey === KEY_DELETE);
    }

    /**
     * Removes bogus BR nodes that Chrome/Safari insert before non-editable inline elements.
     * @param addedNodes - Nodes that were added
     */
    private removeBogusBRNodes(addedNodes: Array<Node>): void {
        for (const node of addedNodes) {
            if (node.nodeName === 'BR' && node.parentNode) {
                const after: ChildNode = node.nextSibling;
                // Remove BR if it's immediately before a non-editable element (contentEditable="false")
                if (after?.nodeType === ELEMENT_NODE && (after as HTMLElement).contentEditable === 'false') {
                    node.parentNode.removeChild(node);
                }
            }
        }
    }

    /**
     * Checks if the selection should be restored after focus.
     * @param from - Start position of changes
     * @param hasNewSelection - Whether there's a new selection
     * @param selectionRange - Current DOM selection range
     * @returns true if selection should be restored
     */
    private shouldRestoreSelectionAfterFocus(from: number,
                                             hasNewSelection: boolean,
                                             selectionRange: DOMSelectionRange): boolean {
        if (from >= 0 || !hasNewSelection) {
            return false;
        }

        const {view} = this;
        const recentFocus: boolean = view.input.lastFocus > Date.now() - 200;
        const noRecentInteraction: boolean = Math.max(view.input.lastTouch, view.input.lastClick.time) < Date.now() - 300;

        if (!recentFocus || !noRecentInteraction || !selectionCollapsed(selectionRange)) {
            return false;
        }

        const readSel: PmSelection | null = selectionFromDOM(view);
        return readSel?.eq(Selection.near(view.state.doc.resolve(0), 1)) ?? false;
    }

    /**
     * Restores the selection after the browser incorrectly resets it to the start.
     * @param selectionRange - Current DOM selection range
     */
    private restoreSelectionAfterFocus(selectionRange: DOMSelectionRange): void {
        this.view.input.lastFocus = 0;
        selectionToDOM(this.view);
        this._currentSelection.set(selectionRange);
        this.view.scrollToSelection();
    }

    /**
     * Applies DOM changes to the editor state.
     * @param from - Start position of changes
     * @param to - End position of changes
     * @param typeOver - Whether the change was a type-over
     * @param addedNodes - Nodes that were added
     * @param _hasNewSelection - Whether there's a new selection
     * @param selectionRange - Current DOM selection range
     */
    private applyChanges(from: number,
                         to: number,
                         typeOver: boolean,
                         addedNodes: Array<Node>,
                         _hasNewSelection: boolean,
                         selectionRange: DOMSelectionRange): void {
        const {view} = this;

        if (from > -1) {
            view.docView.markDirty(from, to);
            this.checkCSS(view);
        }

        this.handleDOMChange(from, to, typeOver, addedNodes);

        if (view.docView?.dirty) {
            view.updateState(view.state);
        } else if (!this._currentSelection.eq(selectionRange)) {
            selectionToDOM(view);
        }

        this._currentSelection.set(selectionRange);
    }

    /**
     * Processes a single mutation record and computes the affected document range.
     * @param mutationRecord - The mutation record to process
     * @param addedNodes - Array to track nodes that were added
     * @returns Object with from/to positions and typeOver flag, or null if mutation should be ignored
     */
    private registerMutation(mutationRecord: MutationRecord,
                             addedNodes: Array<Node>): { from: number; to: number; typeOver?: boolean } | null {
        if (this.shouldIgnoreMutation(mutationRecord, addedNodes)) {
            return null;
        }

        const viewDesc: ViewDesc = ViewDescUtil.nearestViewDesc(this.view.docView, mutationRecord.target);
        if (!viewDesc || viewDesc.ignoreMutation(mutationRecord)) {
            return null;
        }

        switch (mutationRecord.type) {
            case 'childList':
                return this.handleChildListMutation(mutationRecord, viewDesc, addedNodes);
            case 'attributes':
                return this.handleAttributeMutation(viewDesc);
            case 'characterData':
                return this.handleCharacterDataMutation(mutationRecord, viewDesc);
            default:
                return null;
        }
    }

    /**
     * Checks if a mutation should be ignored.
     * @param mutationRecord - The mutation record to check
     * @param addedNodes - Array of nodes that were already added
     * @returns true if the mutation should be ignored
     */
    private shouldIgnoreMutation(mutationRecord: MutationRecord, addedNodes: Array<Node>): boolean {
        // Ignore mutations inside nodes that were already noted as inserted
        if (addedNodes.includes(mutationRecord.target)) {
            return true;
        }

        const viewDesc: ViewDesc = ViewDescUtil.nearestViewDesc(this.view.docView, mutationRecord.target);

        // Ignore certain attribute mutations
        if (mutationRecord.type === 'attributes') {
            return viewDesc === this.view.docView
                || mutationRecord.attributeName === 'contenteditable'
                || this.isSpuriousStyleMutation(mutationRecord);
        }

        return false;
    }

    /**
     * Checks if this is a spurious style mutation (Firefox quirk).
     * @param mutationRecord - The mutation record to check
     * @returns true if this is a spurious style mutation
     */
    private isSpuriousStyleMutation(mutationRecord: MutationRecord): boolean {
        return mutationRecord.attributeName === 'style'
            && !mutationRecord.oldValue
            && !(mutationRecord.target as HTMLElement).getAttribute('style');
    }

    /**
     * Handles a childList mutation record.
     * @param mutationRecord - The mutation record
     * @param viewDesc - The view descriptor for the target
     * @param addedNodes - Array to track added nodes
     * @returns Object with affected range
     */
    private handleChildListMutation(mutationRecord: MutationRecord,
                                    viewDesc: ViewDesc,
                                    addedNodes: Array<Node>): { from: number; to: number } {
        this.trackAddedNodes(mutationRecord, addedNodes);

        if (this.isContentDOMMutation(mutationRecord, viewDesc)) {
            return {from: viewDesc.posBefore, to: viewDesc.posAfter};
        }

        const {prev, next} = this.getSiblingNodes(mutationRecord);
        const from: number = this.computeFromPosition(mutationRecord, viewDesc, prev);
        const to: number = this.computeToPosition(mutationRecord, viewDesc, next);

        return {from, to};
    }

    /**
     * Tracks nodes that were added in this mutation.
     * @param mutationRecord - The mutation record
     * @param addedNodes - Array to add nodes to
     */
    private trackAddedNodes(mutationRecord: MutationRecord, addedNodes: Array<Node>): void {
        for (let i = 0; i < mutationRecord.addedNodes.length; i++) {
            const node: Node = mutationRecord.addedNodes.item(i);
            addedNodes.push(node);

            if (node.nodeType === TEXT_NODE) {
                this._lastChangedTextNode = node as Text;
            }
        }
    }

    /**
     * Checks if a mutation occurred outside the contentDOM.
     * @param mutationRecord - The mutation record
     * @param viewDesc - The view descriptor
     * @returns true if the mutation is outside contentDOM
     */
    private isContentDOMMutation(mutationRecord: MutationRecord, viewDesc: ViewDesc): boolean {
        return viewDesc.contentDOM
            && viewDesc.contentDOM !== viewDesc.dom
            && !viewDesc.contentDOM.contains(mutationRecord.target);
    }

    /**
     * Gets the correct previous and next sibling nodes, with IE11 workaround.
     * @param mutationRecord - The mutation record
     * @returns Object with prev and next sibling nodes (may be null)
     */
    private getSiblingNodes(mutationRecord: MutationRecord): { prev: Node | null; next: Node | null } {
        let prev: Node = mutationRecord.previousSibling;
        let next: Node = mutationRecord.nextSibling;

        // TODO: remove IE 11 support?
        if (browser.ie && browser.ie_version <= 11 && mutationRecord.addedNodes.length) {
            // IE11 gives us incorrect next/prev siblings for some insertions
            // Recompute siblings by checking each added node
            for (let i = 0; i < mutationRecord.addedNodes.length; i++) {
                const {previousSibling, nextSibling} = mutationRecord.addedNodes.item(i);

                // Update prev if this sibling isn't part of the added nodes
                if (!previousSibling || Array.prototype.indexOf.call(mutationRecord.addedNodes, previousSibling) < 0) {
                    prev = previousSibling;
                }

                // Update next if this sibling isn't part of the added nodes
                if (!nextSibling || Array.prototype.indexOf.call(mutationRecord.addedNodes, nextSibling) < 0) {
                    next = nextSibling;
                }
            }
        }

        return {prev, next};
    }

    /**
     * Computes the 'from' position for a childList mutation.
     * @param mutationRecord - The mutation record
     * @param viewDesc - The view descriptor
     * @param prev - The previous sibling node
     * @returns The from position
     */
    private computeFromPosition(mutationRecord: MutationRecord, viewDesc: ViewDesc, prev: Node): number {
        const fromOffset: number = prev?.parentNode === mutationRecord.target ? domIndex(prev) + 1 : 0;
        return viewDesc.localPosFromDOM(mutationRecord.target, fromOffset, -1);
    }

    /**
     * Computes the 'to' position for a childList mutation.
     * @param mutationRecord - The mutation record
     * @param viewDesc - The view descriptor
     * @param next - The next sibling node
     * @returns The to position
     */
    private computeToPosition(mutationRecord: MutationRecord, viewDesc: ViewDesc, next: Node): number {
        const toOffset: number = next?.parentNode === mutationRecord.target
            ? domIndex(next)
            : mutationRecord.target.childNodes.length;
        return viewDesc.localPosFromDOM(mutationRecord.target, toOffset, 1);
    }

    /**
     * Handles an attributes mutation record.
     * @param viewDesc - The view descriptor for the target
     * @returns Object with affected range
     */
    private handleAttributeMutation(viewDesc: ViewDesc): { from: number; to: number } {
        return {
            from: viewDesc.posAtStart - viewDesc.border,
            to: viewDesc.posAtEnd + viewDesc.border
        };
    }

    /**
     * Handles a characterData mutation record.
     * @param mutationRecord - The mutation record
     * @param viewDesc - The view descriptor for the target
     * @returns Object with affected range and typeOver flag
     */
    private handleCharacterDataMutation(mutationRecord: MutationRecord,
                                        viewDesc: ViewDesc): { from: number; to: number; typeOver: boolean } {
        this._lastChangedTextNode = mutationRecord.target as Text;

        return {
            from: viewDesc.posAtStart,
            to: viewDesc.posAtEnd,
            // An event was generated for a text change that didn't change any text.
            // Mark the dom change to fall back to assuming the selection was typed over
            // with an identical value if it can't find another change.
            typeOver: mutationRecord.target.nodeValue === mutationRecord.oldValue
        };
    }

    /**
     * Finds the nearest block-level parent node in the editor view.
     * @param view - The editor view
     * @param node - The starting DOM node
     * @returns The block parent node or null if none found
     */
    private blockParent(view: EditorView, node: Node): Node | null {
        for (let current = node.parentNode; current && current !== view.dom; current = current.parentNode) {
            const viewDesc: NodeViewDesc = ViewDescUtil.nearestNodeViewDesc(view.docView, current);
            if (viewDesc?.node.isBlock) {
                return current;
            }
        }
        return null;
    }

    /**
     * Checks if the editor view has proper CSS white-space configuration.
     * Issues a warning if the CSS is not properly configured.
     * @param view - The editor view to check
     */
    private checkCSS(view: EditorView): void {
        if (this.cssChecked.has(view)) {
            return;
        }

        this.cssChecked.set(view, null);

        const whiteSpace: string = getComputedStyle(view.dom).whiteSpace;
        const invalidWhiteSpace: boolean = ['normal', 'nowrap', 'pre-line'].includes(whiteSpace);

        if (invalidWhiteSpace) {
            this.isGeckoHackNodeRequired = browser.gecko;

            if (!this.cssCheckWarned) {
                // console.warn(
                //     'ProseMirror expects the CSS white-space property to be set, preferably to \'pre-wrap\'. ' +
                //     'It is recommended to load style/prosemirror.css from the prosemirror-view package.'
                // );
                this.cssCheckWarned = true;
            }
        }
    }
}
