import {browser, isUndefinedOrNull} from '@type-editor/commons';
import {ELEMENT_NODE, TEXT_NODE} from '@type-editor/commons';
import {parentNode, textRange} from '@type-editor/dom-util';
import type {PmEditorView} from '@type-editor/editor-types';
import {caretFromPoint} from '@type-editor/selection-util';
import {type NodeViewDesc, ViewDescUtil} from '@type-editor/viewdesc';

import type {Coords} from '../types/dom-coords/Coords';
import type {Rect} from '../types/dom-coords/Rect';
import {inRect} from './util/in-rect';
import {singleRect} from './util/single-rect';

interface NodeOffset {
    node: Node;
    offset: number;
}


const LIST_ITEM_REGEX = /^li$/i;
const TABLE_ELEMENT_REGEX = /^T(R|BODY|HEAD|FOOT)$/;

const LARGE_DISTANCE = 2e8;


/**
 * Given x,y coordinates on the editor, get the corresponding position in the document.
 * This function handles various browser quirks and edge cases to accurately determine
 * the document position from screen coordinates.
 *
 * @param view - The editor view
 * @param coords - The screen coordinates to convert
 * @returns Object containing the document position and inside information, or null if outside editor
 */
export function posAtCoords(view: PmEditorView, coords: Coords): { pos: number; inside: number } | null {
    const doc: Document = view.dom.ownerDocument;
    // Try to get caret position from browser API (caretRangeFromPoint or caretPositionFromPoint)
    const caret: { node: Node; offset: number } = caretFromPoint(doc, coords.left, coords.top);
    let node: Node | undefined = caret ? caret.node : undefined;
    let offset: number = caret ? caret.offset : 0;

    // Get element at coordinates (use shadow root if available)
    const document: Document | ShadowRoot = (view.root as DocumentOrShadowRoot).elementFromPoint ? view.root : doc;
    let element: HTMLElement = document.elementFromPoint(coords.left, coords.top) as HTMLElement;
    let pos: number;

    // If element is outside editor or not found, try to find it manually
    if (!element || !view.dom.contains(element.nodeType !== ELEMENT_NODE ? element.parentNode : element)) {
        const boundingBox: DOMRect = view.dom.getBoundingClientRect();
        if (!inRect(coords, boundingBox)) {
            return null;
        }

        element = elementFromPoint(view.dom, coords, boundingBox);
        if (!element) {
            return null;
        }
    }

    // Safari's caretRangeFromPoint returns nonsense when on a draggable element
    if (browser.safari) {
        for (let ancestor: Node | null = element; node && ancestor; ancestor = parentNode(ancestor)) {
            if ((ancestor as HTMLElement).draggable) {
                node = undefined;
            }
        }
    }

    element = targetKludge(element, coords);

    // Process the caret position if we got one from the browser
    if (node) {
        // Firefox-specific fixes
        if (browser.gecko && node.nodeType === ELEMENT_NODE) {
            // Firefox will sometimes return offsets into <input> nodes, which
            // have no actual children, from caretPositionFromPoint (#953)
            offset = Math.min(offset, node.childNodes.length);
            // It'll also move the returned position before image nodes,
            // even if those are behind it.
            if (offset < node.childNodes.length) {
                const next: ChildNode = node.childNodes[offset];
                let boundingBox: DOMRect;
                if (next.nodeName === 'IMG'
                    && (boundingBox = (next as HTMLElement).getBoundingClientRect()).right <= coords.left
                    && boundingBox.bottom > coords.top) {
                    offset++;
                }
            }
        }

        // Chrome/WebKit-specific fix
        let prev: ChildNode;
        // When clicking above the right side of an uneditable node, Chrome will report a cursor position after that node.
        if (browser.webkit
            && offset && node.nodeType === ELEMENT_NODE
            && (prev = node.childNodes[offset - 1]).nodeType === ELEMENT_NODE
            && (prev as HTMLElement).contentEditable === 'false'
            && (prev as HTMLElement).getBoundingClientRect().top >= coords.top) {
            offset--;
        }

        // Suspiciously specific kludge to work around caret*FromPoint
        // never returning a position at the end of the document
        // Fixed: Add null check for node.lastChild
        if (node === view.dom
            && offset === node.childNodes.length - 1
            && node.lastChild?.nodeType === ELEMENT_NODE
            && coords.top > (node.lastChild as HTMLElement).getBoundingClientRect().bottom) {

            pos = view.state.doc.content.size;
        }

            // Ignore positions directly after a BR, since caret*FromPoint
            // 'round up' positions that would be more accurately placed
        // before the BR node.
        else if (offset === 0 || node.nodeType !== 1 || node.childNodes[offset - 1].nodeName !== 'BR') {
            pos = posFromCaret(view, node, offset, coords);
        }
    }

    // Fallback: if no position found from caret, calculate from element
    if (isUndefinedOrNull(pos)) {
        pos = posFromElement(view, element, coords);
    }

    const desc: NodeViewDesc = ViewDescUtil.nearestNodeViewDesc(view.docView, element);
    return {
        pos,
        inside: desc ? desc.posAtStart - desc.border : -1
    };
}

/**
 * Workaround for list items: if coordinates are to the left of a list item's
 * content, use the parent list item element instead.
 *
 * @param dom - The HTML element at the coordinates
 * @param coords - The coordinates
 * @returns The adjusted element (either the original or its parent)
 */
function targetKludge(dom: HTMLElement, coords: Coords): HTMLElement {
    const parent: ParentNode = dom.parentNode;
    if (parent && LIST_ITEM_REGEX.test(parent.nodeName) && coords.left < dom.getBoundingClientRect().left) {
        return parent as HTMLElement;
    }
    return dom;
}

/**
 * Recursively find the deepest element at the given coordinates within a parent element.
 * Uses an optimization to start searching from an estimated child index based on
 * vertical position within the parent's bounding box.
 *
 * @param element - The parent element to search within
 * @param coords - The coordinates to find the element at
 * @param box - The bounding rectangle of the parent element
 * @returns The deepest element at the coordinates, or the parent if none found
 */
function elementFromPoint(element: HTMLElement, coords: Coords, box: Rect): HTMLElement {
    const childCount: number = element.childNodes.length;
    if (childCount && box.top < box.bottom) {

        // Optimization: estimate which child to start searching from based on vertical position
        const startIndex: number = Math.max(
            0,
            Math.min(childCount - 1, Math.floor(childCount * (coords.top - box.top) / (box.bottom - box.top)) - 2));

        // Circular search through all children starting from estimated index
        for (let i = startIndex; ;) {
            const child: ChildNode = element.childNodes[i];
            if (child.nodeType === ELEMENT_NODE) {
                const rects: DOMRectList = (child as HTMLElement).getClientRects();

                for (let j = 0; j < rects.length; j++) {
                    const rect: DOMRect = rects.item(j);
                    if (inRect(coords, rect)) {
                        // Recursively search within the matching child
                        return elementFromPoint(child as HTMLElement, coords, rect);
                    }
                }
            }
            // Move to next child in circular fashion, stop when we've checked all
            if ((i = (i + 1) % childCount) === startIndex) {
                break;
            }
        }
    }
    return element;
}

/**
 * Get the document position from a caret position returned by the browser.
 *
 * Browsers aggressively normalize caret positions towards nearby inline nodes.
 * Since we're also interested in positions between block nodes, this function
 * walks up the node hierarchy to check if the coordinates fall outside any
 * block nodes. If so, it returns the position before/after that block.
 *
 * @param view - The editor view
 * @param node - The DOM node from the caret position
 * @param offset - The offset within the node
 * @param coords - The coordinates where the caret was requested
 * @returns The document position, or null if not found
 */
function posFromCaret(view: PmEditorView,
                      node: Node,
                      offset: number,
                      coords: Coords): number | null {
    let outsideBlock = -1;

    // Walk up the DOM hierarchy to check if coords fall outside any block nodes
    for (let currentNode = node, sawBlock = false; ;) {
        if (currentNode === view.dom) {
            break;
        }

        const viewDesc: NodeViewDesc = ViewDescUtil.nearestNodeViewDesc(view.docView, currentNode);
        let rect: DOMRect;
        if (!viewDesc) {
            return null;
        }

        if (viewDesc.dom.nodeType === ELEMENT_NODE
            && (viewDesc.node.isBlock && viewDesc.parent || !viewDesc.contentDOM)
            // Ignore elements with zero-size bounding rectangles
            && ((rect = (viewDesc.dom as HTMLElement).getBoundingClientRect()).width || rect.height)) {

            if (viewDesc.node.isBlock
                && viewDesc.parent
                && !TABLE_ELEMENT_REGEX.test(viewDesc.dom.nodeName)) {

                // Check if coords are outside the block's boundaries
                // Only apply the horizontal test to the innermost block. Vertical for any parent.
                if (!sawBlock && rect.left > coords.left || rect.top > coords.top) {
                    outsideBlock = viewDesc.posBefore;
                } else if (!sawBlock && rect.right < coords.left || rect.bottom < coords.top) {
                    outsideBlock = viewDesc.posAfter;
                }

                sawBlock = true;
            }

            if (!viewDesc.contentDOM && outsideBlock < 0 && !viewDesc.node.isText) {
                // If we are inside a leaf, return the side of the leaf closer to the coords
                const before: boolean = viewDesc.node.isBlock
                    ? coords.top < (rect.top + rect.bottom) / 2
                    : coords.left < (rect.left + rect.right) / 2;

                return before ? viewDesc.posBefore : viewDesc.posAfter;
            }
        }
        currentNode = viewDesc.dom.parentNode;
    }

    // Return position outside block if found, otherwise use standard DOM position
    return outsideBlock > -1 ? outsideBlock : view.docView.posFromDOM(node, offset, -1);
}

/**
 * Get the document position from an element at the given coordinates.
 *
 * @param view - The editor view
 * @param element - The HTML element at the coordinates
 * @param coords - The coordinates
 * @returns The document position
 */
function posFromElement(view: PmEditorView, element: HTMLElement, coords: Coords): number {
    const { node, offset } = findOffsetInNode(element, coords);
    let bias = -1;
    if (node.nodeType === ELEMENT_NODE && !node.firstChild) {
        const rect: DOMRect = (node as HTMLElement).getBoundingClientRect();
        bias = rect.left !== rect.right && coords.left > (rect.left + rect.right) / 2 ? 1 : -1;
    }
    return view.docView.posFromDOM(node, offset, bias);
}

/**
 * Find the offset within a node at the given coordinates by examining
 * the positions of its child nodes.
 *
 * @param node - The HTML element to search within
 * @param coords - The coordinates to find the offset at
 * @returns Object containing the node and offset at the coordinates
 */
function findOffsetInNode(node: HTMLElement, coords: Coords): NodeOffset {
    let closest: Node;
    let closestHorizontalDistance = LARGE_DISTANCE;
    let coordsClosest: Coords | undefined;
    let offset = 0;
    // Track the vertical bounds of the current "row" of content
    let rowBottom: number = coords.top;
    let rowTop: number = coords.top;
    // Track first element below the coords (as fallback if nothing on the same row)
    let firstBelow: Node | undefined;
    let coordsBelow: Coords | undefined;

    // Iterate through all child nodes to find the one closest to the coordinates
    let child: ChildNode = node.firstChild;
    for (let childIndex = 0; child; child = child.nextSibling, childIndex++) {
        const rects: DOMRectList | null = getChildRects(child);
        if (!rects) {
            continue;
        }

        for (let i = 0; i < rects.length; i++) {
            const rect: DOMRect = rects.item(i);

            // Check if this rect is on the same row (vertically overlapping)
            if (rect.top <= rowBottom && rect.bottom >= rowTop) {
                // Expand row bounds to include this rect
                rowBottom = Math.max(rect.bottom, rowBottom);
                rowTop = Math.min(rect.top, rowTop);

                const horizontalDistance = calculateHorizontalDistance(coords, rect);

                // Update closest if this is horizontally nearer
                if (horizontalDistance < closestHorizontalDistance) {
                    closest = child;
                    closestHorizontalDistance = horizontalDistance;

                    coordsClosest = coords;
                    // For text nodes not containing the point, snap to nearest edge
                    if (horizontalDistance && closest.nodeType === TEXT_NODE) {
                        coordsClosest = {
                            left: rect.right < coords.left ? rect.right : rect.left,
                            top: coords.top
                        };
                    }

                    // For element nodes, determine if we're before or after based on midpoint
                    if (child.nodeType === ELEMENT_NODE && horizontalDistance) {
                        offset = childIndex + (coords.left >= (rect.left + rect.right) / 2 ? 1 : 0);
                    }

                    continue;
                }
            } else if (
                // Track the first element below the coords as a fallback
                rect.top > coords.top
                && !firstBelow
                && rect.left <= coords.left
                && rect.right >= coords.left
            ) {
                firstBelow = child;
                coordsBelow = {
                    left: Math.max(rect.left, Math.min(rect.right, coords.left)),
                    top: rect.top
                };
            }

            // If coords are past this rect (down and to the right), position after this child
            if (
                !closest
                && (
                    (coords.left >= rect.right && coords.top >= rect.top)
                    || (coords.left >= rect.left && coords.top >= rect.bottom)
                )
            ) {
                offset = childIndex + 1;
            }
        }
    }

    // If no element on the same row, use the first element below
    if (!closest && firstBelow) {
        closest = firstBelow;
        coordsClosest = coordsBelow;
        closestHorizontalDistance = 0;
    }

    // For text nodes, find the exact character offset
    if (closest?.nodeType === TEXT_NODE) {
        return findOffsetInText(closest as Text, coordsClosest);
    }

    // If no close match or horizontally distant element, return position in parent
    if (!closest || (closestHorizontalDistance && closest.nodeType === ELEMENT_NODE)) {
        return { node, offset };
    }

    // Recursively search within the closest child element
    return findOffsetInNode(closest as HTMLElement, coordsClosest);
}

/**
 * Find the character offset within a text node at the given coordinates.
 *
 * @param node - The text node to search within
 * @param coords - The coordinates to find the offset at
 * @returns Object containing the text node and character offset
 */
function findOffsetInText(node: Text, coords: Coords): NodeOffset {
    const textLength: number = node.nodeValue.length;
    const range: Range = document.createRange();
    let result: NodeOffset | undefined;

    // Performance optimization: Use binary search for long text nodes
    if (textLength > 20) {
        let low = 0;
        let high = textLength;
        let closestOffset = 0;
        let closestDistance = Infinity;

        // Binary search to find approximate position
        while (low < high) {
            const mid = Math.floor((low + high) / 2);
            range.setStart(node, mid);
            range.setEnd(node, Math.min(mid + 1, textLength));
            const rect: DOMRect = singleRect(range, 1);

            if (rect.top === rect.bottom && mid < textLength - 1) {
                low = mid + 1;
                continue;
            }

            if (inRect(coords, rect)) {
                result = {
                    node,
                    offset: mid + (coords.left >= (rect.left + rect.right) / 2 ? 1 : 0)
                };
                break;
            }

            const distance: number = Math.abs(coords.left - rect.left);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestOffset = mid;
            }

            if (coords.left < rect.left) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }

        if (!result && closestOffset < textLength) {
            range.setStart(node, closestOffset);
            range.setEnd(node, closestOffset + 1);
            const rect: DOMRect = singleRect(range, 1);
            result = {
                node,
                offset: closestOffset + (coords.left >= (rect.left + rect.right) / 2 ? 1 : 0)
            };
        }
    } else {
        // Linear search for short text nodes
        for (let i = 0; i < textLength; i++) {
            range.setEnd(node, i + 1);
            range.setStart(node, i);
            const rect: DOMRect = singleRect(range, 1);

            // Skip collapsed rectangles (e.g., zero-width characters)
            if (rect.top === rect.bottom) {
                continue;
            }

            if (inRect(coords, rect)) {
                // Position before or after the character based on which half of it was clicked
                result = {
                    node,
                    offset: i + (coords.left >= (rect.left + rect.right) / 2 ? 1 : 0)
                };
                break;
            }
        }
    }

    range.detach();

    return result || { node, offset: 0 };
}

/**
 * Get client rectangles for a child node (element or text node).
 *
 * @param child - The child node to get rectangles for
 * @returns The list of client rectangles, or null if node type is not supported
 */
function getChildRects(child: ChildNode): DOMRectList | null {
    if (child.nodeType === ELEMENT_NODE) {
        return (child as HTMLElement).getClientRects();
    }
    if (child.nodeType === TEXT_NODE) {
        return textRange(child as Text).getClientRects();
    }
    return null;
}

/**
 * Calculate horizontal distance from coordinates to a rectangle.
 *
 * @param coords - The target coordinates
 * @param rect - The rectangle to measure distance from
 * @returns The horizontal distance (0 if coordinates are within rectangle)
 */
function calculateHorizontalDistance(coords: Coords, rect: DOMRect): number {
    if (rect.left > coords.left) {
        return rect.left - coords.left;
    }
    if (rect.right < coords.left) {
        return coords.left - rect.right;
    }
    return 0;
}
