import type { PmEditorState } from '@type-editor/editor-types';
import type { NodeType } from '@type-editor/model';
import { schema } from '@type-editor/schema';
import { isInNodeType } from '@type-editor/util';


/**
 * Checks if the current selection is within a code block.
 *
 * @param state - The current editor state
 * @param codeNodeType
 * @returns `true` if the selection's parent node is a code block, `false` otherwise
 */
export function isCodeBlock(state: PmEditorState,
                            codeNodeType: NodeType = schema.nodes.code_block) : boolean {
    return isInNodeType(state, codeNodeType);
}
