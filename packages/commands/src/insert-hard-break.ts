import type { Command, DispatchFunction, PmEditorState } from '@type-editor/editor-types';
import type { NodeType } from '@type-editor/model';

/**
 * Creates a command that inserts a hard break (line break) at the current selection.
 *
 * The hard break replaces the current selection and scrolls the view to ensure
 * the inserted break is visible.
 *
 * @param schema - The node type for the hard break element to insert.
 * @returns A command function that inserts the hard break when executed.
 */
export function insertHardBreak(schema: NodeType): Command {
    return (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
        if (dispatch) {
            dispatch(state.tr.replaceSelectionWith(schema.create()).scrollIntoView());
        }
        return true;
    };
}
