import { browser, Direction } from '@type-editor/commons';
import type {
    DispatchFunction,
    PmEditorState,
    PmEditorView,
    PmInputState,
    PmSelection,
} from '@type-editor/editor-types';
import type { ResolvedPos } from '@type-editor/model';
import { Selection } from '@type-editor/state';

import { applySelection } from './util/apply-selection';
import { moveSelectionBlock } from './util/move-selection-block';

export function selectVerticallyUp(_state: PmEditorState, _dispatch: DispatchFunction, view: PmEditorView): boolean {
    return selectVertically(view, Direction.Up, view.input);
}

export function selectVerticallyDown(_state: PmEditorState, _dispatch: DispatchFunction, view: PmEditorView): boolean {
    return selectVertically(view, Direction.Down, view.input);
}

/**
 * Handles vertical cursor movement and selection (up/down arrows).
 *
 * Only intervenes when node selections are involved; otherwise lets the browser
 * handle the movement. Manages block-level selections and respects modifier keys.
 *
 * @param view - The EditorView instance
 * @param direction - Direction to move: -1 for up, 1 for down
 * @param inputState - The input state that contains the modifier keys
 * @returns True if the selection was changed, false to let browser handle it
 */
function selectVertically(view: PmEditorView, direction: Direction, inputState: PmInputState): boolean {
    const state: PmEditorState = view.state;
    const selection: PmSelection = state.selection;

    // Let browser handle text selections and shift-selections
    if ((selection.isTextSelection() && !selection.empty) || inputState.shiftKey) {
        return false;
    }

    // Don't override Cmd+Up/Down on Mac (document start/end)
    if (browser.mac && inputState.metaKey) {
        return false;
    }

    const { $from, $to } = selection;

    // Try to move to adjacent block if at boundary or in block-level content
    if (!$from.parent.inlineContent || view.endOfTextblock(direction === Direction.Up ? 'up' : 'down')) {
        const next: PmSelection = moveSelectionBlock(state, direction);
        if (next?.isNodeSelection()) {
            return applySelection(view, next);
        }
    }

    // Handle block-level content separately
    if (!$from.parent.inlineContent) {
        const side: ResolvedPos = direction === Direction.Up ? $from : $to;
        const beyond: PmSelection = selection.isAllSelection()
            ? Selection.near(side, direction)
            : Selection.findFrom(side, direction);
        return beyond ? applySelection(view, beyond) : false;
    }

    return false;
}
