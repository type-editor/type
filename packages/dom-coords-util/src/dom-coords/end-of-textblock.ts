import {browser, ELEMENT_NODE, TEXT_NODE} from '@type-editor/commons';
import {textRange} from '@type-editor/dom-util';
import type {PmEditorState, PmEditorView, PmSelection} from '@type-editor/editor-types';
import type {ResolvedPos} from '@type-editor/model';
import {type NodeViewDesc, ViewDescUtil} from '@type-editor/viewdesc';

import type {Rect} from '../types/dom-coords/Rect';
import type {TextblockDir} from '../types/dom-coords/TextblockDir';
import {coordsAtPos} from './coords-at-pos';

// Cache for endOfTextblock to avoid redundant calculations
let cachedState: PmEditorState | null = null;
let cachedDir: TextblockDir | null = null;
let cachedResult = false;


/**
 * Determine whether the cursor is at the edge of a text block in the given direction.
 * This function is cached for performance - repeated calls with the same state and
 * direction will return the cached result.
 *
 * @param view - The editor view
 * @param state - The editor state containing the current selection
 * @param dir - The direction to check ('up', 'down', 'left', 'right', 'forward', or 'backward')
 * @returns True if the cursor is at the edge of a text block in the given direction
 */
export function endOfTextblock(view: PmEditorView,
                               state: PmEditorState,
                               dir: TextblockDir): boolean {
    // Return cached result if checking the same state and direction
    if (cachedState === state && cachedDir === dir) {
        return cachedResult;
    }

    // Update cache and compute new result
    cachedState = state;
    cachedDir = dir;
    // Delegate to vertical or horizontal check based on direction
    return cachedResult = dir === 'up' || dir === 'down'
        ? endOfTextblockVertical(view, state, dir)
        : endOfTextblockHorizontal(view, state, dir);
}

/**
 * Determine whether vertical position motion in a given direction
 * from the current selection would leave a text block.
 *
 * @param view - The editor view
 * @param state - The editor state containing the current selection
 * @param dir - The direction of motion ('up' or 'down')
 * @returns True if motion would leave the text block
 */
function endOfTextblockVertical(view: PmEditorView,
                                state: PmEditorState,
                                dir: 'up' | 'down'): boolean {
    const selection: PmSelection = state.selection;
    const $pos: ResolvedPos = dir === 'up' ? selection.$from : selection.$to;

    return withFlushedState(view, state, (): boolean => {
        // Find the DOM node at the cursor position
        let { node: dom } = view.docView.domFromPos($pos.pos, dir === 'up' ? -1 : 1);

        // Walk up to find the containing block node
        for (; ;) {
            const nearest: NodeViewDesc = ViewDescUtil.nearestNodeViewDesc(view.docView, dom);
            if (!nearest) {
                break;
            }

            if (nearest.node.isBlock) {
                dom = nearest.contentDOM || nearest.dom; break;
            }

            dom = nearest.dom.parentNode;
        }

        // Get the coordinates of the current cursor position
        const coords: Rect = coordsAtPos(view, $pos.pos, 1);

        // Performance optimization: Cache coords properties
        const coordsTop: number = coords.top;
        const coordsBottom: number = coords.bottom;

        // Check all child nodes to see if there's content in the direction of motion
        for (let child = dom.firstChild; child; child = child.nextSibling) {
            let boxes: DOMRectList;

            if (child.nodeType === ELEMENT_NODE) {
                boxes = (child as HTMLElement).getClientRects();
            } else if (child.nodeType === TEXT_NODE) {
                // Performance optimization: Skip empty text nodes
                if (!child.nodeValue || child.nodeValue.length === 0) {
                    continue;
                }
                boxes = textRange(child as Text, 0, child.nodeValue.length).getClientRects();
            } else {
                continue;
            }

            const boxCount: number = boxes.length;
            for (let i = 0; i < boxCount; i++) {
                const box: DOMRect = boxes.item(i);
                // If there's a content box with significant height in the direction of motion,
                // we're not at the edge
                if (box.bottom > box.top + 1) {
                    if (dir === 'up') {
                        if (coordsTop - box.top > (box.bottom - coordsTop) * 2) {
                            return false;
                        }
                    } else {
                        if (box.bottom - coordsBottom > (coordsBottom - box.top) * 2) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    });
}

/**
 * Determine whether horizontal position motion in a given direction
 * from the current selection would leave a text block.
 *
 * @param view - The editor view
 * @param state - The editor state containing the current selection
 * @param dir - The direction of motion ('left', 'right', 'forward', or 'backward')
 * @returns True if motion would leave the text block
 */
function endOfTextblockHorizontal(view: PmEditorView, state: PmEditorState,
                                  dir: 'left' | 'right' | 'forward' | 'backward'): boolean {
    const { $head } = state.selection;
    if (!$head.parent.isTextblock) {
        return false;
    }

    // Check if cursor is at the start or end of the parent node's content
    const offset: number = $head.parentOffset;
    const atStart = !offset;
    const atEnd: boolean = offset === $head.parent.content.size;
    const selection: DOMSelection | null = view.domSelection();

    if (!selection) {
        return $head.pos === $head.start() || $head.pos === $head.end();
    }

    // Handle right-to-left text direction (reverses left/right meaning)
    const isRtl: boolean = browser.dir === 'rtl' || view.dom.style.direction === 'rtl' || globalThis.getComputedStyle(view.dom).direction === 'rtl';
    if (isRtl) {
        return dir === 'right' || dir === 'backward' ? atStart : atEnd;
    }

    // For left-to-right text, check if we're at the appropriate edge
    return dir === 'left' || dir === 'backward' ? atStart : atEnd;
}

/**
 * Execute a callback with a specific editor state temporarily applied,
 * then restore the original state and focus. Used for coordinate calculations
 * that need accurate DOM measurements with a specific state.
 *
 * @param view - The editor view
 * @param state - The temporary state to apply during callback execution
 * @param callbackFunc - The function to execute with the flushed state
 * @returns The result of the callback function
 */
function withFlushedState<T>(view: PmEditorView, state: PmEditorState, callbackFunc: () => T): T {
    const viewState: PmEditorState = view.state;
    const activeElement = view.root.activeElement as HTMLElement;

    if (viewState !== state) {
        view.updateState(state);
    }

    if (activeElement !== view.dom) {
        view.focus();
    }

    try {
        return callbackFunc();
    } finally {
        if (viewState !== state) {
            view.updateState(viewState);
        }

        if (activeElement !== view.dom && activeElement) {
            activeElement.focus();
        }
    }
}

