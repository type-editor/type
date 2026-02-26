import { type Command, type DispatchFunction, type PmEditorState } from '@type-editor/editor-types';
import type { Attrs, NodeRange, NodeType } from '@type-editor/model';
import { findWrapping } from '@type-editor/transform';
import { isInNodeType } from '@type-editor/util';

import { lift } from './lift';

/**
 * Creates a command that toggles wrapping of the selected content in the given node type.
 *
 * If the selection is already inside a node of the specified type and `allowUnwrap` is true,
 * the command will lift (unwrap) the content. Otherwise, it will wrap the selected block range
 * in a node of the given type.
 *
 * @param nodeType - The node type to wrap the selection in (e.g., blockquote, list).
 * @param attrs - Optional attributes to apply to the wrapping node.
 * @param allowUnwrap - Whether to allow unwrapping when already inside the node type. Defaults to `true`.
 * @returns A command that toggles the wrapping and returns `true` if the command was applicable.
 */
export function toggleWrapIn(nodeType: NodeType,
                             attrs: Attrs | null = null,
                             allowUnwrap = true): Command {
    return (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
        if (allowUnwrap && isInNodeType(state, nodeType)) {
            return lift(state, dispatch);
        }
        const {$from, $to} = state.selection;
        const range: NodeRange = $from.blockRange($to);
        const wrapping = range && findWrapping(range, nodeType, attrs);

        if (!wrapping) {
            return false;
        }

        if (dispatch) {
            dispatch(state.transaction.wrap(range, wrapping).scrollIntoView());
        }

        return true;
    };
}

