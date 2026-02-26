import { type Command, type DispatchFunction, type PmEditorState } from '@type-editor/editor-types';
import type { Attrs, NodeType } from '@type-editor/model';
import { isInNodeType } from '@type-editor/util';

import { setBlockType } from './set-block-type';

/**
 * Creates a command that toggles between two block types.
 *
 * If the selection is currently inside a node of the specified `nodeType` and unwrapping
 * is allowed, it will convert the block to `unwrapNodeType`. Otherwise, it will convert
 * the block to `nodeType`.
 *
 * This is useful for implementing toggle buttons (e.g., toggling between a heading and
 * a paragraph).
 *
 * @param nodeType - The node type to toggle to when not already in this type.
 * @param unwrapNodeType - The node type to revert to when already inside `nodeType`.
 * @param attrs - Optional attributes to apply to the new block node.
 * @param allowUnwrap - Whether to allow toggling back to `unwrapNodeType`. Defaults to `true`.
 * @returns A command function that toggles the block type when executed.
 */
export function toggleBlockType(nodeType: NodeType,
                                unwrapNodeType: NodeType,
                                attrs: Attrs | null = null,
                                allowUnwrap = true): Command {
    return (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
        if (allowUnwrap && isInNodeType(state, nodeType)) {
            return setBlockType(unwrapNodeType, attrs)(state, dispatch);
        }

        return setBlockType(nodeType, attrs)(state, dispatch);
    };
}
