import {browser} from '@type-editor/commons';
import type {PmEditorView} from '@type-editor/editor-types';
import type {Node, ResolvedPos} from '@type-editor/model';
import {Selection, SelectionFactory} from '@type-editor/state';

import {forceDOMFlush} from '../util/force-dom-flush';
import {setSelectionOrigin} from '../util/set-selection-origin';
import {MouseDown} from './MouseDown';

// Max time between clicks for double/triple click detection (ms)
const DOUBLE_CLICK_TIMEOUT = 500;
// Max squared distance between clicks for multi-click detection (px²)
const CLICK_DISTANCE_THRESHOLD = 100;

/**
 * Handles mousedown events. Detects single/double/triple clicks and
 * initiates mouse selection or drag operations.
 */
export function mouseDownHandler(view: PmEditorView, event: MouseEvent): boolean {
    view.input.shiftKey = event.shiftKey;
    const flushed: boolean = forceDOMFlush(view);
    const now = Date.now();
    let type = 'singleClick';

    // Detect double and triple clicks by checking if this click is:
    // 1. Within the timeout window of the previous click
    // 2. Near the same location as the previous click
    // 3. Not using the node selection modifier key
    // 4. Using the same mouse button
    if (now - view.input.lastClick.time < DOUBLE_CLICK_TIMEOUT
        && isNear(event, view.input.lastClick)
        && !(browser.mac ? event.metaKey : event.ctrlKey)
        && view.input.lastClick.button === event.button) {

        if (view.input.lastClick.type === 'singleClick') {
            type = 'doubleClick';
        } else if (view.input.lastClick.type === 'doubleClick') {
            type = 'tripleClick';
        }
    }

    // Store this click for future double/triple click detection
    view.input.lastClick = {
        time: now,
        x: event.clientX,
        y: event.clientY,
        type,
        button: event.button
    };

    const pos: { pos: number; inside: number } = view.posAtCoords({left: event.clientX, top: event.clientY});
    if (!pos) {
        return false;
    }

    if (type === 'singleClick') {
        if (view.input.mouseDown) {
            view.input.mouseDown.done();
        }
        view.input.mouseDown = new MouseDown(view, pos, event, flushed);

    } else if (type === 'doubleClick') {
        if(handleDoubleClick(view, pos.pos, pos.inside, event)) {
            event.preventDefault();
            return true;
        }
    } else if (type === 'tripleClick') {
        if(handleTripleClick(view, pos.pos, pos.inside, event)) {
            event.preventDefault();
            return true;
        }
    } else {
        setSelectionOrigin(view, 'pointer');
    }
    return false;
}

/**
 * Determines if a mouse event is near a previous click location,
 * used for detecting double/triple clicks.
 * @param event - The current mouse event
 * @param click - The previous click location
 * @returns True if the events are within the threshold distance
 */
function isNear(event: MouseEvent, click: { x: number, y: number; }): boolean {
    const dx: number = click.x - event.clientX;
    const dy: number = click.y - event.clientY;
    // Use squared distance to avoid expensive sqrt calculation
    return dx * dx + dy * dy < CLICK_DISTANCE_THRESHOLD;
}

/**
 * Handles a double click in the editor. Delegates to custom handlers.
 * @param view - The editor view
 * @param pos - The document position where the click occurred
 * @param inside - The position inside the clicked node
 * @param event - The mouse event
 * @returns True if the double click was handled
 */
function handleDoubleClick(view: PmEditorView,
                           pos: number,
                           inside: number,
                           event: MouseEvent): boolean {
    if(MouseDown.runHandlerOnContext(view, 'handleDoubleClickOn', pos, inside, event)) {
        return true;
    }

    return view.someProp('handleDoubleClick', callbackFunc => callbackFunc(view, pos, event));
}

/**
 * Handles a triple click in the editor. Delegates to custom handlers first,
 * then falls back to default triple click behavior (selecting blocks/nodes).
 * @param view - The editor view
 * @param pos - The document position where the click occurred
 * @param inside - The position inside the clicked node
 * @param event - The mouse event
 * @returns True if the triple click was handled
 */
function handleTripleClick(view: PmEditorView,
                           pos: number,
                           inside: number,
                           event: MouseEvent): boolean {
    if(MouseDown.runHandlerOnContext(view, 'handleTripleClickOn', pos, inside, event)) {
        return true;
    }

    if(view.someProp('handleTripleClick', callbackFunc => callbackFunc(view, pos, event))) {
        return true;
    }

    return defaultTripleClick(view, inside, event);
}

/**
 * Default triple click behavior: selects the entire content of the nearest
 * inline content block, or selects a selectable node.
 * @param view - The editor view
 * @param inside - The position inside the clicked node
 * @param event - The mouse event
 * @returns True if a selection was made
 */
function defaultTripleClick(view: PmEditorView, inside: number, event: MouseEvent): boolean {
    const MOUSE_LEFT_BUTTON = 0;
    if (event.button !== MOUSE_LEFT_BUTTON) {
        return false;
    }

    const doc: Node = view.state.doc;
    if (inside === -1) {
        if (doc.inlineContent) {
            MouseDown.updateSelection(view, SelectionFactory.createTextSelection(doc, 0, doc.content.size), 'pointer');
            return true;
        }
        return false;
    }

    const $pos: ResolvedPos = doc.resolve(inside);
    for (let i = $pos.depth + 1; i > 0; i--) {
        const node: Node = i > $pos.depth ? $pos.nodeAfter : $pos.node(i);
        const nodePos: number = $pos.before(i);

        if (node.inlineContent) {
            MouseDown.updateSelection(view, SelectionFactory.createTextSelection(doc, nodePos + 1, nodePos + 1 + node.content.size), 'pointer');
        } else if (Selection.isNodeSelectable(node)) {
            MouseDown.updateSelection(view, SelectionFactory.createNodeSelection(doc, nodePos), 'pointer');
        } else {
            continue;
        }

        return true;
    }
    return false;
}
