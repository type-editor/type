import type {PmEditorState} from '@type-editor/editor-types';
import type {PmNode, ResolvedPos} from '@type-editor/model';
import type {DispatchFunction} from '@type-editor/editor-types';


/**
 * Deletes the table containing the current selection.
 *
 * Traverses up the document structure to find and delete the enclosing table.
 *
 * @param state - The current editor state
 * @param dispatch - Optional dispatch function to execute the command
 * @returns True if a table was found and deleted, false otherwise
 */
export function deleteTable(state: PmEditorState, dispatch?: DispatchFunction): boolean {
    const $pos: ResolvedPos = state.selection.$anchor;
    for (let d = $pos.depth; d > 0; d--) {
        const node: PmNode = $pos.node(d);
        if (node.type.spec.tableRole === 'table') {
            if (dispatch)
                {dispatch(
                    state.transaction.delete($pos.before(d), $pos.after(d)).scrollIntoView(),
                );}
            return true;
        }
    }
    return false;
}
