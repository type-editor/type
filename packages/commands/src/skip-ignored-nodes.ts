/**
 * Skips over ignored DOM nodes in the specified direction.
 *
 * @param view - The EditorView instance
 * @param direction - Direction to skip: -1 for backward, 1 for forward
 * @returns True if nodes were skipped and selection was updated
 */
import { browser, Direction, ELEMENT_NODE, isUndefinedOrNull, TEXT_NODE } from '@type-editor/commons';
import { domIndex, hasBlockDesc } from '@type-editor/dom-util';
import type {
    DispatchFunction,
    DOMSelectionRange,
    PmEditorState,
    PmEditorView,
    PmViewDesc,
} from '@type-editor/editor-types';
import { selectionCollapsed, selectionToDOM } from '@type-editor/selection-util';


interface SiblingResult {
    node: Node;
    offset: number;
    len?: number;
    moveTarget?: {
        node: Node; offset: number
    }
}

/**
 * Ensures the cursor isn't directly after one or more ignored nodes,
 * which would confuse the browser's cursor motion logic.
 *
 * This function traverses backward from the current cursor position to find
 * and skip over any zero-size nodes that should be invisible to the user.
 *
 * @param _state
 * @param _dispatch
 * @param view - The EditorView instance
 * @returns True if the selection was adjusted
 */
export function skipIgnoredNodesBefore(_state: PmEditorState, _dispatch: DispatchFunction, view: PmEditorView): boolean {
    const selectionRange: DOMSelectionRange = view.domSelectionRange();
    if (!selectionRange) {
        return false;
    }

    let node: Node = selectionRange.focusNode;
    let offset: number = selectionRange.focusOffset;

    if (!node) {
        return false;
    }

    let targetNode: Node | undefined;
    let targetOffset: number | undefined;
    let forceMove = false;

    // Gecko workaround: move selection when directly in front of non-editable node
    // Issue: prosemirror/prosemirror#832
    if (browser.gecko &&
        node.nodeType === ELEMENT_NODE &&
        offset < getNodeLength(node) &&
        isIgnorableNode(node.childNodes[offset], Direction.Backward)) {
        forceMove = true;
    }

    // Traverse backwards, skipping ignorable nodes
    while (true) {
        if (offset > 0) {
            // Not at the start of this node
            if (node.nodeType !== ELEMENT_NODE) {
                break;
            }

            const before: ChildNode = node.childNodes[offset - 1];
            if (isIgnorableNode(before, Direction.Backward)) {
                targetNode = node;
                targetOffset = --offset;
            } else if (before.nodeType === TEXT_NODE) {
                // Move into text node
                node = before;
                offset = node.nodeValue?.length ?? 0;
            } else {
                break;
            }
        } else if (isBlockNode(node)) {
            // Reached a block boundary
            break;
        } else {
            // At the start of current node, try to move to previous sibling
            const result: SiblingResult = findPreviousNonIgnoredSibling(node, view);
            if (!result) {
                break;
            }

            if (result.moveTarget) {
                targetNode = result.moveTarget.node;
                targetOffset = result.moveTarget.offset;
            }

            node = result.node;
            offset = result.offset;
        }
    }

    if (forceMove) {
        setSelectionFocus(view, node, offset);
        return true;
    }

    if (targetNode) {
        setSelectionFocus(view, targetNode, targetOffset);
        return true;
    }

    return false;
}

/**
 * Ensures the cursor isn't directly before one or more ignored nodes.
 *
 * This function traverses forward from the current cursor position to find
 * and skip over any zero-size nodes that should be invisible to the user.
 *
 * @param _state
 * @param _dispatch
 * @param view - The EditorView instance
 * @returns True if the selection was adjusted
 */
export function skipIgnoredNodesAfter(_state: PmEditorState, _dispatch: DispatchFunction, view: PmEditorView): boolean {
    const selectionRange: DOMSelectionRange = view.domSelectionRange();
    if (!selectionRange) {
        return false;
    }

    let node: Node = selectionRange.focusNode;
    let offset: number = selectionRange.focusOffset;

    if (!node) {
        return false;
    }

    let len: number = getNodeLength(node);
    let targetNode: Node | undefined;
    let targetOffset: number | undefined;

    const ELEMENT_NODE = 1;

    // Traverse forward, skipping ignorable nodes
    while (true) {
        if (offset < len) {
            // Not at the end of this node
            if (node.nodeType !== ELEMENT_NODE) {
                break;
            }

            const after: ChildNode = node.childNodes[offset];
            if (isIgnorableNode(after, Direction.Forward)) {
                targetNode = node;
                targetOffset = ++offset;
            } else {
                break;
            }
        } else if (isBlockNode(node)) {
            // Reached a block boundary
            break;
        } else {
            // At the end of current node, try to move to next sibling
            const result: SiblingResult = findNextNonIgnoredSibling(node, view);
            if (!result) {
                break;
            }

            if (result.moveTarget) {
                targetNode = result.moveTarget.node;
                targetOffset = result.moveTarget.offset;
            }

            node = result.node;
            offset = result.offset;
            len = result.len;
        }
    }

    if (targetNode) {
        setSelectionFocus(view, targetNode, targetOffset);
        return true;
    }

    return false;
}

/**
 * Returns the length of a DOM node's content.
 * For text nodes, returns the text length. For element nodes, returns the number of children.
 *
 * @param node - The DOM node to measure
 * @returns The length/count of the node's content
 */
function getNodeLength(node: Node): number {
    return node.nodeType === TEXT_NODE ? (node.nodeValue?.length ?? 0) : node.childNodes.length;
}

/**
 * Checks if a DOM node should be skipped during cursor navigation.
 * A node is ignorable if it has zero size and meets certain conditions.
 *
 * @param dom - The DOM node to check
 * @param direction - Direction of navigation: -1 for backward, 1 for forward
 * @returns True if the node should be skipped
 */
function isIgnorableNode(dom: Node, direction: Direction): boolean {
    const viewDesc: PmViewDesc = dom.pmViewDesc;
    // Only ignorable if the descriptor exists and has zero size
    if (viewDesc?.size !== 0) {
        return false;
    }

    if (!viewDesc) {
        return false;
    }

    // When moving backward, always ignorable if size is 0
    // When moving forward, ignorable unless it's a trailing BR with no next sibling
    return direction === Direction.Backward || !isUndefinedOrNull(dom.nextSibling) || dom.nodeName !== 'BR';
}

/**
 * Checks if a DOM node represents a block-level ProseMirror node.
 *
 * @param dom - The DOM node to check
 * @returns True if the node is a block node
 */
function isBlockNode(dom: Node): boolean {
    const viewDesc: PmViewDesc = dom.pmViewDesc;
    return viewDesc?.node?.isBlock ?? false;
}

/**
 * Finds the previous non-ignored sibling, skipping over ignorable nodes.
 *
 * @param node - The starting DOM node
 * @param view - The EditorView instance
 * @returns Object with the new node/offset position, or null if at document root
 */
function findPreviousNonIgnoredSibling(node: Node,
                                       view: PmEditorView): SiblingResult | null {
    let prev: ChildNode = node.previousSibling;
    let moveTarget: { node: Node; offset: number } | undefined;

    // Skip all ignorable previous siblings
    while (prev && isIgnorableNode(prev, Direction.Backward)) {
        moveTarget = { node: node.parentNode, offset: domIndex(prev) };
        prev = prev.previousSibling;
    }

    if (!prev) {
        // No previous sibling, move up to parent
        const parent: ParentNode = node.parentNode;
        if (parent === view.dom) {
            return null; // Reached document root
        }
        return { node: parent, offset: 0, moveTarget };
    }

    // Found a non-ignorable previous sibling
    return { node: prev, offset: getNodeLength(prev), moveTarget };
}

/**
 * Sets the focus point of the DOM selection to the specified position.
 * Attempts to place the cursor in a text node when possible.
 *
 * @param view - The EditorView instance
 * @param node - The target DOM node
 * @param offset - The offset within the target node
 */
function setSelectionFocus(view: PmEditorView, node: Node, offset: number): void {
    // Prefer placing cursor in text nodes
    if (node.nodeType !== TEXT_NODE) {
        const after: Text = findTextNodeAfter(node, offset);
        if (after) {
            node = after;
            offset = 0;
        } else {
            const before: Text = findTextNodeBefore(node, offset);
            if (before) {
                node = before;
                offset = before.nodeValue?.length ?? 0;
            }
        }
    }

    const selection: DOMSelection = view.domSelection();
    if (!selection) {
        return;
    }

    // Update the DOM selection
    if (selectionCollapsed(selection)) {
        const range: Range = document.createRange();
        range.setEnd(node, offset);
        range.setStart(node, offset);
        selection.removeAllRanges();
        selection.addRange(range);
    } else if (selection.extend) {
        selection.extend(node, offset);
    }

    // Notify observer and schedule selection sync if needed
    view.domObserver.setCurSelection();
    const { state } = view;

    // If no state update occurs, reset the selection after a short delay
    const SELECTION_SYNC_DELAY = 50;
    setTimeout(() => {
        if (view.state === state) {
            selectionToDOM(view);
        }
    }, SELECTION_SYNC_DELAY);
}

/**
 * Finds the next non-ignored sibling, skipping over ignorable nodes.
 *
 * @param node - The starting DOM node
 * @param view - The EditorView instance
 * @returns Object with the new node/offset position, or null if at document root
 */
function findNextNonIgnoredSibling(node: Node,
                                   view: PmEditorView): SiblingResult | null {
    let next: ChildNode = node.nextSibling;
    let moveTarget: { node: Node; offset: number } | undefined;

    // Skip all ignorable next siblings
    while (next && isIgnorableNode(next, Direction.Forward)) {
        moveTarget = { node: next.parentNode, offset: domIndex(next) + 1 };
        next = next.nextSibling;
    }

    if (!next) {
        // No next sibling, move up to parent
        const parent: ParentNode = node.parentNode;
        if (parent === view.dom) {
            return null; // Reached document root
        }
        return { node: parent, offset: 0, len: 0, moveTarget };
    }

    // Found a non-ignorable next sibling
    return { node: next, offset: 0, len: getNodeLength(next), moveTarget };
}

/**
 * Finds the next text node after the given position in the DOM tree.
 * Stops at block boundaries or non-editable content.
 *
 * @param node - The starting DOM node (can be null)
 * @param offset - The offset within the starting node
 * @returns The text node found, or undefined if none exists
 */
function findTextNodeAfter(node: Node | null, offset: number): Text | undefined {
    // Move up the tree while at the end of nodes
    while (offset === node?.childNodes.length && !hasBlockDesc(node)) {
        offset = domIndex(node) + 1;
        node = node.parentNode;
    }

    // Descend into children to find a text node
    while (node && offset < node.childNodes.length) {
        const next: ChildNode = node.childNodes[offset];

        if (next.nodeType === TEXT_NODE) {
            return next as Text;
        }

        // Stop at non-editable content
        if (next.nodeType === ELEMENT_NODE && (next as HTMLElement).contentEditable === 'false') {
            break;
        }

        node = next;
        offset = 0;
    }

    return undefined;
}

/**
 * Finds the previous text node before the given position in the DOM tree.
 * Stops at block boundaries or non-editable content.
 *
 * @param node - The starting DOM node (can be null)
 * @param offset - The offset within the starting node
 * @returns The text node found, or undefined if none exists
 */
function findTextNodeBefore(node: Node | null, offset: number): Text | undefined {
    // Move up the tree while at the start of nodes
    while (node && !offset && !hasBlockDesc(node)) {
        offset = domIndex(node);
        node = node.parentNode;
    }

    // Descend into previous children to find a text node
    while (node && offset) {
        const next: ChildNode = node.childNodes[offset - 1];

        if (next.nodeType === TEXT_NODE) {
            return next as Text;
        }

        // Stop at non-editable content
        if (next.nodeType === ELEMENT_NODE && (next as HTMLElement).contentEditable === 'false') {
            break;
        }

        node = next;
        offset = node.childNodes.length;
    }

    return undefined;
}
