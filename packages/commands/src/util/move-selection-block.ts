import type {PmEditorState} from '@type-editor/editor-types';
import type {ResolvedPos} from '@type-editor/model';
import {Selection} from '@type-editor/state';


/**
 * Moves the selection to the next or previous block-level position.
 *
 * @param state - The current editor state
 * @param dir - Direction to move: -1 for backward, 1 for forward
 * @returns A new selection at the block boundary, or null if not possible
 */
export function moveSelectionBlock(state: PmEditorState, dir: number): Selection | null {
    const { $anchor, $head } = state.selection;
    const $side: ResolvedPos = dir > 0 ? $anchor.max($head) : $anchor.min($head);

    // If already at a block node, use it directly
    if (!$side.parent.inlineContent) {
        return Selection.findFrom($side, dir);
    }

    // Try to move to the adjacent block
    if ($side.depth) {
        const pos: number = dir > 0 ? $side.after() : $side.before();
        const $start: ResolvedPos = state.doc.resolve(pos);
        return Selection.findFrom($start, dir);
    }

    return null;
}
