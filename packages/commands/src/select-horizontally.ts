import {browser, Direction} from '@type-editor/commons';
import type {
    DispatchFunction,
    PmEditorState,
    PmEditorView,
    PmInputState,
    PmSelection,
    PmViewDesc,
} from '@type-editor/editor-types';
import type {PmNode, ResolvedPos} from '@type-editor/model';
import {Selection, SelectionFactory} from '@type-editor/state';

import {applySelection} from './util/apply-selection';
import {moveSelectionBlock} from './util/move-selection-block';


// ArrowLeft
export function selectHorizontallyBackward(_state: PmEditorState, _dispatch: DispatchFunction, view: PmEditorView): boolean {
    return selectHorizontally(view, Direction.Backward, view.input);
}

// ArrowRight
export function selectHorizontallyForward(_state: PmEditorState, _dispatch: DispatchFunction, view: PmEditorView): boolean {
    return selectHorizontally(view, Direction.Forward, view.input);
}


/**
 * Handles horizontal cursor movement and selection.
 *
 * This function manages complex behavior for left/right arrow keys, including:
 * - Text selection with shift key
 * - Node selection at text block boundaries
 * - Special handling for inline uneditable nodes
 * - RTL text support
 *
 * @param view - The EditorView instance
 * @param direction - Direction to move: -1 for backward, 1 for forward
 * @param inputState - The input state that contains the modifier keys
 * @returns True if the selection was changed, false otherwise
 */
function selectHorizontally(view: PmEditorView, direction: Direction, inputState: PmInputState): boolean {
    const state: PmEditorState = view.state;
    const selection: PmSelection = state.selection;

    if (selection.isTextSelection()) {
        return handleTextSelectionHorizontal(view, selection, direction, inputState);
    }

    if (selection.isNodeSelection() && selection.node.isInline) {
        // Convert node selection to text selection at the appropriate edge
        const $pos: ResolvedPos = direction === Direction.Forward ? selection.$to : selection.$from;
        return applySelection(view, SelectionFactory.createTextSelection($pos));
    }

    // Try to move to adjacent block
    const next: PmSelection = moveSelectionBlock(state, direction);
    return next ? applySelection(view, next) : false;
}

/**
 * Handles horizontal movement within text selections.
 *
 * @param view - The EditorView instance
 * @param selection - The current text selection
 * @param direction - Direction to move: -1 for backward, 1 for forward
 * @param inputState - The input state that contains the modifier keys
 * @returns True if the selection was changed, false otherwise
 */
function handleTextSelectionHorizontal(view: PmEditorView,
                                       selection: PmSelection,
                                       direction: Direction,
                                       inputState: PmInputState): boolean {
    // Handle shift+arrow for text selection extension
    if (inputState.shiftKey) {
        return handleShiftSelection(view, selection, direction);
    }

    // If there's a non-empty selection, let browser handle it
    if (!selection.empty) {
        return false;
    }

    // At text block boundary, try to select adjacent node
    if (view.endOfTextblock(direction === Direction.Forward ? 'forward' : 'backward')) {
        const next: PmSelection = moveSelectionBlock(view.state, direction);
        if (next?.isNodeSelection()) {
            return applySelection(view, next);
        }
        return false;
    }

    // Don't override Cmd+Arrow on Mac (jump to line start/end)
    if (browser.mac && inputState.metaKey) {
        return false;
    }

    return handleNodeAtCursor(view, selection.$head, direction);
}

/**
 * Handles shift+arrow key selection extension to include adjacent leaf nodes.
 *
 * @param view - The EditorView instance
 * @param selection - The current selection
 * @param direction - Direction to extend: -1 for backward, 1 for forward
 * @returns True if the selection was extended, false otherwise
 */
function handleShiftSelection(view: PmEditorView, selection: PmSelection, direction: Direction): boolean {
    const { $head } = selection;

    // Can only extend to leaf nodes when not in the middle of text
    if ($head.textOffset) {
        return false;
    }

    const node: PmNode = direction === Direction.Backward ? $head.nodeBefore : $head.nodeAfter;
    if (!node || node.isText || !node.isLeaf) {
        return false;
    }

    const newPos: number = $head.pos + node.nodeSize * (direction === Direction.Backward ? -1 : 1);
    const $newHead: ResolvedPos = view.state.doc.resolve(newPos);

    return applySelection(view, SelectionFactory.createTextSelection(selection.$anchor, $newHead));
}

/**
 * Handles node selection when cursor is adjacent to a non-text node.
 *
 * @param view - The EditorView instance
 * @param $head - The current head position
 * @param direction - Direction to move: -1 for backward, 1 for forward
 * @returns True if a node was selected, false otherwise
 */
function handleNodeAtCursor(view: PmEditorView, $head: ResolvedPos, direction: Direction): boolean {
    // Only handle nodes when cursor is at the edge (not mid-text)
    if ($head.textOffset) {
        return false;
    }

    const node: PmNode = direction === Direction.Backward ? $head.nodeBefore : $head.nodeAfter;
    if (!node || node.isText) {
        return false;
    }

    const nodePos: number = direction === Direction.Backward ? $head.pos - node.nodeSize : $head.pos;

    // Check if node is atomic or non-editable
    const viewDesc: PmViewDesc = view.docView.descAt(nodePos);
    const isNonEditable: boolean = node.isAtom || (viewDesc && !viewDesc.contentDOM);

    if (!isNonEditable) {
        return false;
    }

    // If node is selectable, create node selection
    if (Selection.isNodeSelectable(node)) {
        const $pos: ResolvedPos = direction === Direction.Backward
            ? view.state.doc.resolve($head.pos - node.nodeSize)
            : $head;
        return applySelection(view, SelectionFactory.createNodeSelection($pos));
    }

    // Webkit workaround: move cursor past inline uneditable nodes (#937)
    // TODO: is this still needed?
    if (browser.webkit) {
        const pos: number = direction === Direction.Backward ? nodePos : nodePos + node.nodeSize;
        return applySelection(view, SelectionFactory.createTextSelection(view.state.doc.resolve(pos)));
    }

    return false;
}
