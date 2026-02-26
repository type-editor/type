import { Direction } from '@type-editor/commons';
import type {
    DispatchFunction,
    PmEditorState,
    PmEditorView,
    PmSelection,
    PmTransaction,
} from '@type-editor/editor-types';
import type { PmNode } from '@type-editor/model';


// Backspace or deleteContentBackward
export function stopNativeHorizontalDeleteBackward(_state: PmEditorState, _dispatch: DispatchFunction, view: PmEditorView): boolean {
    return stopNativeHorizontalDelete(view, Direction.Backward);
}

// Delete or deleteContentForward
export function stopNativeHorizontalDeleteForward(_state: PmEditorState, _dispatch: DispatchFunction, view: PmEditorView): boolean {
    return stopNativeHorizontalDelete(view, Direction.Forward);
}

/**
 * Prevents native browser delete behavior when deleting non-text nodes.
 *
 * Handles deletion of atomic nodes (like images, widgets) by creating a proper
 * transaction instead of letting the browser handle it natively.
 *
 * @param view - The EditorView instance
 * @param direction - Direction of deletion: -1 for backward (backspace), 1 for forward (delete)
 * @returns True if deletion was handled, false to allow native behavior
 */
export function stopNativeHorizontalDelete(view: PmEditorView, direction: Direction): boolean {
    const state: PmEditorState = view.state;
    const selection: PmSelection = state.selection;

    // Always intercept non-text selections
    if (!selection.isTextSelection()) {
        return true;
    }

    const { $head, $anchor, empty } = selection;

    // Intercept cross-parent deletions
    if (!$head.sameParent($anchor)) {
        return true;
    }

    // Let browser handle range deletions
    if (!empty) {
        return false;
    }

    // Intercept at block boundaries
    if (view.endOfTextblock(direction === Direction.Forward ? 'forward' : 'backward')) {
        return true;
    }

    // Check for non-text node at cursor
    const nextNode: PmNode = !$head.textOffset && (direction === Direction.Backward ? $head.nodeBefore : $head.nodeAfter);
    if (nextNode && !nextNode.isText) {
        // Delete the node with a proper transaction
        const transaction: PmTransaction = state.transaction;
        if (direction === Direction.Backward) {
            transaction.delete($head.pos - nextNode.nodeSize, $head.pos);
        } else {
            transaction.delete($head.pos, $head.pos + nextNode.nodeSize);
        }
        view.dispatch(transaction);
        return true;
    }

    return false;
}
