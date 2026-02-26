import {ELEMENT_NODE} from '@type-editor/commons';
import {parentNode} from '@type-editor/dom-util';
import type {PmEditorView} from '@type-editor/editor-types';

import type {Rect} from '../types/dom-coords/Rect';


const POSITION_FIXED_OR_STICKY_REGEX = /^(fixed|sticky)$/;


/**
 * Scroll the given rectangle into view within the editor, walking up through
 * scrollable ancestors and adjusting scroll positions as needed.
 *
 * @param view - The editor view
 * @param rect - The rectangle to scroll into view
 * @param startDOM - The starting DOM node (defaults to view.dom)
 */
export function scrollRectIntoView(view: PmEditorView, rect: Rect, startDOM: Node): void {
    const scrollThreshold = view.someProp('scrollThreshold') || 0;
    const scrollMargin = view.someProp('scrollMargin') || 5;
    const doc: Document = view.dom.ownerDocument;

    let currentRect: Rect = rect;

    // Walk up the DOM tree through all scrollable ancestors
    for (let parent: Node | null = startDOM || view.dom; parent; ) {
        // Skip text nodes and other non-element nodes
        if (parent.nodeType !== ELEMENT_NODE) {
            parent = parentNode(parent);
            continue;
        }

        const htmlElement: HTMLElement = parent as HTMLElement;
        const atTop: boolean = htmlElement === doc.body;
        const bounding: Rect = atTop ? windowRect(doc) : clientRect(htmlElement);

        // Calculate how much we need to scroll to bring rect into view
        const { moveX, moveY } = calculateScrollMovement(
            currentRect,
            bounding,
            scrollThreshold,
            scrollMargin
        );

        if (moveX || moveY) {
            if (atTop) {
                // Scroll the window itself
                // Fixed: Add null check for defaultView
                if (doc.defaultView) {
                    doc.defaultView.scrollBy(moveX, moveY);
                }
            } else {
                // Scroll the element and track actual scroll distance
                const startX: number = htmlElement.scrollLeft;
                const startY: number = htmlElement.scrollTop;

                if (moveY) {htmlElement.scrollTop += moveY;}
                if (moveX) {htmlElement.scrollLeft += moveX;}

                // Calculate actual scroll (may be less than requested if at scroll boundary)
                const deltaX: number = htmlElement.scrollLeft - startX;
                const deltaY: number = htmlElement.scrollTop - startY;

                // Adjust target rect coordinates by scroll amount for next iteration
                currentRect = adjustRectByScroll(currentRect, deltaX, deltaY);
            }
        }

        // Stop at fixed/sticky positioned elements (they don't scroll with ancestors)
        const position: string = atTop ? 'fixed' : getComputedStyle(htmlElement).position;
        if (POSITION_FIXED_OR_STICKY_REGEX.test(position)) {
            break;
        }

        // For absolutely positioned elements, jump to offset parent; otherwise continue to DOM parent
        parent = position === 'absolute' ? htmlElement.offsetParent : parentNode(parent);
    }
}

/**
 * Get the visible window rectangle, accounting for visual viewport if available.
 * The visual viewport API provides more accurate dimensions when the page is zoomed
 * or on mobile devices with on-screen keyboards.
 *
 * @param doc - The document to get the window rect for
 * @returns The rectangle representing the visible window area
 */
function windowRect(doc: Document): Rect {
    // Fixed: Add null check for defaultView (can be null in detached documents)
    const visualViewport: VisualViewport = doc.defaultView?.visualViewport;

    if (visualViewport) {
        return {
            left: 0,
            right: visualViewport.width,
            top: 0,
            bottom: visualViewport.height
        };
    }

    // Fallback to documentElement dimensions
    return {
        left: 0,
        right: doc.documentElement?.clientWidth || 0,
        top: 0,
        bottom: doc.documentElement?.clientHeight || 0
    };
}

/**
 * Get a client rectangle for an element, accounting for CSS transforms and scrollbars.
 * This adjusts for elements with 'transform: scale()' and excludes scrollbar dimensions.
 *
 * @param node - The HTML element to get the rectangle for
 * @returns A rectangle representing the element's visible bounds
 */
function clientRect(node: HTMLElement): Rect {
    const rect: DOMRect = node.getBoundingClientRect();

    // Adjust for elements with style 'transform: scale()'
    // Fixed: Add safety check for offsetWidth/Height being 0
    const scaleX: number = node.offsetWidth ? (rect.width / node.offsetWidth) : 1;
    const scaleY: number = node.offsetHeight ? (rect.height / node.offsetHeight) : 1;

    // Make sure scrollbar width isn't included in the rectangle
    return {
        left: rect.left,
        right: rect.left + node.clientWidth * scaleX,
        top: rect.top,
        bottom: rect.top + node.clientHeight * scaleY
    };
}

/**
 * Calculate the scroll movement needed to bring a rectangle into view.
 *
 * @param rect - The target rectangle to scroll into view
 * @param bounding - The bounding rectangle of the scrollable container
 * @param scrollThreshold - Distance from edge before scrolling triggers
 * @param scrollMargin - Margin to maintain around the target rect
 * @returns Object containing horizontal and vertical scroll distances
 */
function calculateScrollMovement(rect: Rect,
                                 bounding: Rect,
                                 scrollThreshold: number | Rect,
                                 scrollMargin: number | Rect): { moveX: number; moveY: number } {
    let moveX = 0;
    let moveY = 0;

    // Calculate vertical scroll
    if (rect.top < bounding.top + getSide(scrollThreshold, 'top')) {
        // Rect is above the visible area or too close to top edge - scroll up
        moveY = -(bounding.top - rect.top + getSide(scrollMargin, 'top'));
    } else if (rect.bottom > bounding.bottom - getSide(scrollThreshold, 'bottom')) {
        const rectHeight: number = rect.bottom - rect.top;
        const boundingHeight: number = bounding.bottom - bounding.top;

        // Rect is below visible area or too close to bottom edge
        // If rect is taller than viewport, align its top; otherwise align its bottom
        moveY = rectHeight > boundingHeight
            ? rect.top + getSide(scrollMargin, 'top') - bounding.top
            : rect.bottom - bounding.bottom + getSide(scrollMargin, 'bottom');
    }

    // Calculate horizontal scroll
    if (rect.left < bounding.left + getSide(scrollThreshold, 'left')) {
        // Rect is left of visible area or too close to left edge - scroll left
        moveX = -(bounding.left - rect.left + getSide(scrollMargin, 'left'));
    } else if (rect.right > bounding.right - getSide(scrollThreshold, 'right')) {
        // Rect is right of visible area or too close to right edge - scroll right
        moveX = rect.right - bounding.right + getSide(scrollMargin, 'right');
    }

    return { moveX, moveY };
}

/**
 * Get a side value from either a number (uniform value for all sides) or a Rect.
 *
 * @param value - Either a uniform number or a Rect with specific side values
 * @param side - The side to extract (left, right, top, or bottom)
 * @returns The numeric value for the specified side
 */
function getSide(value: number | Rect, side: keyof Rect): number {
    return typeof value === 'number' ? value : value[side];
}

/**
 * Adjust a rectangle by the given scroll deltas.
 *
 * @param rect - The rectangle to adjust
 * @param deltaX - Horizontal scroll delta
 * @param deltaY - Vertical scroll delta
 * @returns A new adjusted rectangle
 */
function adjustRectByScroll(rect: Rect, deltaX: number, deltaY: number): Rect {
    return {
        left: rect.left - deltaX,
        top: rect.top - deltaY,
        right: rect.right - deltaX,
        bottom: rect.bottom - deltaY
    };
}
