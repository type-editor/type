import {browser, ELEMENT_NODE, isUndefinedOrNull, TEXT_NODE} from '@type-editor/commons';
import {nodeSize, textRange} from '@type-editor/dom-util';
import type {PmEditorView} from '@type-editor/editor-types';
import type {ResolvedPos} from '@type-editor/model';

import type {Rect} from '../types/dom-coords/Rect';
import {singleRect} from './util/single-rect';


const BIDI_REGEX = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;

/**
 * Given a position in the document model, get a bounding box of the
 * character at that position, relative to the window.
 *
 * @param view - The editor view
 * @param pos - The document position to get coordinates for
 * @param side - Direction bias: negative for before, positive for after
 * @returns A rectangle representing the character's bounding box
 */
export function coordsAtPos(view: PmEditorView, pos: number, side: number): Rect {
    const {node, offset, atom} = view.docView.domFromPos(pos, side < 0 ? -1 : 1);

    const supportEmptyRange = browser.webkit || browser.gecko;

    // Handle text nodes
    if (node.nodeType === TEXT_NODE) {
        // These browsers support querying empty text ranges. Prefer that in
        // bidi context or when at the end of a node.
        if (supportEmptyRange && (BIDI_REGEX.test(node.nodeValue) || (side < 0 ? !offset : offset === node.nodeValue.length))) {
            let rect: DOMRect = singleRect(textRange(node as Text, offset, offset), side);

            // Firefox returns bad results (the position before the space)
            // when querying a position directly after line-broken
            // whitespace. Detect this situation and and kludge around it
            if (browser.gecko && offset && /\s/.test(node.nodeValue[offset - 1]) && offset < node.nodeValue.length) {
                const rectBefore: DOMRect = singleRect(textRange(node as Text, offset - 1, offset - 1), -1);
                if (rectBefore.top === rect.top) {
                    const rectAfter: DOMRect = singleRect(textRange(node as Text, offset, offset + 1), -1);
                    if (rectAfter.top !== rect.top) {
                        return flattenV(rectAfter, rectAfter.left < rectBefore.left);
                    }
                }
            }

            // If the rect is zero-sized (can happen at end of text after newline),
            // fall back to querying a range including the previous character
            if (rect.top === 0 && rect.bottom === 0 && offset > 0) {
                rect = singleRect(textRange(node as Text, offset - 1, offset), 1);
                return flattenV(rect, false);
            }

            return rect;
        } else {
            // For browsers without empty range support, query a range including a character
            let from: number = offset;
            let to: number = offset;
            let takeSide: number = side < 0 ? 1 : -1;

            if (side < 0 && !offset) {
                to++; takeSide = -1;
            } else if (side >= 0 && offset === node.nodeValue.length) {
                from--;
                takeSide = 1;
            } else if (side < 0) {
                from--;
            } else {
                to ++;
            }
            return flattenV(singleRect(textRange(node as Text, from, to), takeSide), takeSide < 0);
        }
    }

    const $resolvedPos: ResolvedPos = view.state.doc.resolve(pos - (atom || 0));

    // Return a horizontal line in block context
    if (!$resolvedPos.parent.inlineContent) {
        if (isUndefinedOrNull(atom) && offset && (side < 0 || offset === nodeSize(node))) {
            const before: ChildNode = node.childNodes[offset - 1];

            if (before.nodeType === ELEMENT_NODE) {
                return flattenH((before as HTMLElement).getBoundingClientRect(), false);
            }
        }

        if (isUndefinedOrNull(atom) && offset < nodeSize(node)) {
            const after: ChildNode = node.childNodes[offset];
            if (after.nodeType === ELEMENT_NODE) {
                return flattenH((after as HTMLElement).getBoundingClientRect(), true);
            }
        }

        return flattenH((node as HTMLElement).getBoundingClientRect(), side >= 0);
    }

    // Inline, not in text node (this is not Bidi-safe)
    if (isUndefinedOrNull(atom) && offset && (side < 0 || offset === nodeSize(node))) {
        const before: ChildNode = node.childNodes[offset - 1];

        const target: Range | ChildNode = before.nodeType === TEXT_NODE
            ? textRange(before as Text, nodeSize(before) - (supportEmptyRange ? 0 : 1))
            // BR nodes tend to only return the rectangle before them.
            // Only use them if they are the last element in their parent
            : before.nodeType === ELEMENT_NODE && (before.nodeName !== 'BR' || !before.nextSibling) ? before : null;

        if (target) {
            let rect = singleRect(target as Range | HTMLElement, 1);
            // If we got a zero-sized rect (can happen at end of text after newline),
            // try getting coordinates from the last character and estimate next line position
            if (rect.top === 0 && rect.bottom === 0 && before.nodeType === TEXT_NODE) {
                const textNode = before as Text;
                const len = nodeSize(textNode);
                if (len > 1) {
                    // Query the previous character
                    rect = singleRect(textRange(textNode, len - 1, len), 1);
                    // If the last character is a newline, we need to estimate the next line position
                    const textValue = textNode.nodeValue || '';
                    if (textValue.endsWith('\n')) {
                        const lineHeight = rect.bottom - rect.top;
                        // Get left coordinate from start of text node (start of line)
                        const startRect = singleRect(textRange(textNode, 0, 1), -1);
                        // Return a rect for the estimated next line at the start of the line
                        return {
                            top: rect.bottom,
                            bottom: rect.bottom + lineHeight,
                            left: startRect.left,
                            right: startRect.left
                        };
                    }
                }
            }
            // If we got a zero-height rect from an element (e.g., unloaded image, trailing BR hack),
            // try using getBoundingClientRect directly which may give better results
            if (rect.top === rect.bottom && before.nodeType === ELEMENT_NODE) {
                const directRect = (before as HTMLElement).getBoundingClientRect();
                if (directRect.top < directRect.bottom) {
                    rect = directRect;
                }
            }
            return flattenV(rect, false);
        }
    }

    if (isUndefinedOrNull(atom) && offset < nodeSize(node)) {
        let after: ChildNode = node.childNodes[offset];
        // Skip nodes marked to be ignored for coordinate calculations
        // Fixed: Add null check to prevent crash when reaching end of siblings
        while (after?.pmViewDesc?.ignoreForCoords) {
            after = after.nextSibling;
        }

        const target: Range | ChildNode = !after ? null : after.nodeType === TEXT_NODE
            ? textRange(after as Text, 0, (supportEmptyRange ? 0 : 1))
            : after.nodeType === ELEMENT_NODE ? after : null;

        if (target) {
            return flattenV(singleRect(target as Range | HTMLElement, -1), true);
        }
    }
    // All else failed, just try to get a rectangle for the target node
    return flattenV(singleRect(node.nodeType === TEXT_NODE ? textRange(node as Text) : node as HTMLElement, -side), side >= 0);
}

/**
 * Flatten a rectangle to a vertical line (zero width).
 * Used for creating cursor-like rectangles at text positions.
 *
 * @param rect - The rectangle to flatten
 * @param left - If true, flatten to left edge; otherwise right edge
 * @returns A flattened rectangle (vertical line)
 */
function flattenV(rect: DOMRect, left: boolean): Rect {
    if (rect.width === 0) {
        return rect;
    }
    const x: number = left ? rect.left : rect.right;
    return {
        top: rect.top,
        bottom: rect.bottom,
        left: x,
        right: x
    };
}

/**
 * Flatten a rectangle to a horizontal line (zero height).
 * Used for creating horizontal line rectangles at block boundaries.
 *
 * @param rect - The rectangle to flatten
 * @param top - If true, flatten to top edge; otherwise bottom edge
 * @returns A flattened rectangle (horizontal line)
 */
function flattenH(rect: DOMRect, top: boolean): Rect {
    if (rect.height === 0) {
        return rect;
    }
    const y: number = top ? rect.top : rect.bottom;
    return {
        top: y,
        bottom: y,
        left: rect.left,
        right: rect.right
    };
}
