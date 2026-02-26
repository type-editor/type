import type { Command, DispatchFunction, PmEditorState } from '@type-editor/editor-types';
import type { MarkType, NodeType } from '@type-editor/model';
import { schema } from '@type-editor/schema';

import { findExtendedMarkSelection } from './util/find-extended-mark-selection';

/**
 * Type definition for the trigger key that activates auto-linking.
 */
type AutoLinkTriggerKey = 'Backspace' | 'Delete';

/**
 * Creates a command that removes link marks from the current selection or cursor position.
 *
 * If the cursor is positioned within a link (empty selection), the command will automatically
 * extend the selection to cover the entire linked text range before removing the link mark.
 * If there's an active selection, it removes the link mark from the entire selected range.
 *
 * @param keyType
 * @param linkMarkType - The mark type to remove. Defaults to the link mark from the schema.
 * @param fileLinkType - The node type for file links to remove. Defaults to the file node from the schema.
 * @returns A command function that can be executed on an editor state.
 *
 * @example
 * ```typescript
 * // Remove link at cursor position or from selection
 * const command = autoDeleteLink();
 * command(editorState, dispatch);
 *
 * // Use with custom mark type
 * const customCommand = autoDeleteLink(customLinkMarkType);
 * ```
 *
 * @public
 */
export function autoDeleteLink(keyType: AutoLinkTriggerKey,
                               linkMarkType: MarkType = schema.marks.link,
                               fileLinkType: NodeType = schema.nodes.file): Command {
    return (state: PmEditorState, dispatch?: DispatchFunction): boolean => {

        if (!linkMarkType) {
            return false;
        }

        const { selection, doc } = state;

        if(!selection.isTextSelection()) {
            return false;
        }

        let { from, to } = selection;

        // Check if the cursor is adjacent to a file link node
        const $cursor = selection.$cursor;
        if ($cursor && fileLinkType) {
            const adjacentNode = keyType === 'Backspace' ? $cursor.nodeBefore : $cursor.nodeAfter;
            if (adjacentNode?.type === fileLinkType) {
                // Delete the file link node
                if (dispatch) {
                    const transaction = state.transaction;
                    if (keyType === 'Backspace') {
                        transaction.delete($cursor.pos - adjacentNode.nodeSize, $cursor.pos);
                    } else {
                        transaction.delete($cursor.pos, $cursor.pos + adjacentNode.nodeSize);
                    }
                    dispatch(transaction);
                }
                return true;
            }
        }

        // Check if the cursor is not within a link mark
        const direction = keyType === 'Backspace' ? -1 : 1;
        if (!linkMarkType.isInSet(doc.resolve(selection.from + direction).marks())) {
            return false;
        }

        const extendedSelection = findExtendedMarkSelection(
            doc,
            selection.$cursor,
            linkMarkType,
            false,
        );

        // If a link mark was found around the cursor, use its range
        if (extendedSelection.found && extendedSelection.fromMark) {
            from = extendedSelection.from;
            to = extendedSelection.to;
        } else {
            // No link found at cursor position
            return false;
        }

        // Only dispatch if a dispatch function was provided
        if (dispatch) {
            const transaction = state.transaction.removeMark(from, to, linkMarkType);
            dispatch(transaction);
        }

        return true;
    };
}
