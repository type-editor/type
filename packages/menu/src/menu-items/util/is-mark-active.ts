import type { PmEditorState } from '@type-editor/editor-types';
import type { MarkType } from '@type-editor/model';

/**
 * Checks if a specific mark type is active in the current editor selection.
 *
 * For empty selections (cursor position), checks if the mark is present in the stored marks
 * or in the marks at the cursor position. For range selections, checks if the mark
 * is present anywhere within the selected range.
 *
 * @param state - The current editor state
 * @param type - The mark type to check for
 * @returns `true` if the mark is active in the selection, `false` otherwise
 */
export function isMarkActive(state: PmEditorState, type: MarkType): boolean {
    if (state.selection.empty) {
        return !!type.isInSet(state.storedMarks || state.selection.$from.marks());
    } else {
        return state.doc.rangeHasMark(state.selection.from, state.selection.to, type);
    }
}
