import { isUndefinedOrNull } from '@type-editor/commons';
import type { PmEditorState } from '@type-editor/editor-types';
import type { NodeType, PmNode } from '@type-editor/model';
import { findParent } from '@type-editor/util';


/**
 * Checks if the current selection is inside a list node.
 *
 * @param state - The current editor state
 * @param listNodeType1 - The first list node type to check for (e.g., bullet_list)
 * @param listNodeType2 - The second list node type to check for (e.g., ordered_list)
 * @returns `true` if the selection is within a list of either type, `false` otherwise
 */
export function isInList(state: PmEditorState, listNodeType1: NodeType, listNodeType2: NodeType): boolean {
    return !isUndefinedOrNull(findParent(state.selection, (node: PmNode): boolean =>  node.type === listNodeType1 || node.type === listNodeType2 ));
}
