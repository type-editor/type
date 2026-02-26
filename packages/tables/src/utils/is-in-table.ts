import type {PmEditorState} from '@type-editor/editor-types';
import type {ResolvedPos} from '@type-editor/model';


/**
 * Checks whether the current selection is inside a table.
 *
 * This function examines the selection's head position and traverses up
 * the document tree to determine if any ancestor is a table row.
 *
 * @param state - The current editor state.
 * @returns True if the selection is inside a table, false otherwise.
 *
 * @example
 * ```typescript
 * if (isInTable(state)) {
 *     // Enable table-specific commands
 * }
 * ```
 */
export function isInTable(state: PmEditorState): boolean {
    const $head: ResolvedPos = state.selection.$head;

    for (let depth = $head.depth; depth > 0; depth--) {
        if ($head.node(depth).type.spec.tableRole === 'row') {
            return true;
        }
    }

    return false;
}
