import {type Command, type DispatchFunction, type PmEditorState, type PmTransaction} from '@type-editor/editor-types';
import type {ContentMatch, NodeType, PmNode, ResolvedPos} from '@type-editor/model';
import {Selection} from '@type-editor/state';


/**
 * Creates a default block after a code block and moves the cursor there.
 *
 * This command allows users to "exit" from a code block by creating a new default
 * block (typically a paragraph) immediately after the code block and positioning
 * the cursor at the start of it. This is particularly useful when the cursor is at
 * the end of a code block and the user wants to continue editing outside of it.
 *
 * The command only works when:
 * - The selection is within a node marked as code (via `NodeSpec.code`)
 * - The selection is not spanning multiple parents
 * - A suitable default block type can be inserted after the code block
 *
 * @param state - The current editor state
 * @param dispatch - Optional dispatch function to execute the transaction
 * @returns `true` if the command can be applied, `false` otherwise
 *
 * @example
 * ```typescript
 * // Bind to Mod-Enter to allow easy exit from code blocks
 * const keymap = {
 *   'Mod-Enter': exitCode
 * };
 *
 * // Or use with chainCommands for fallback behavior
 * const keymap = {
 *   'Enter': chainCommands(exitCode, splitBlock)
 * };
 * ```
 */
export const exitCode: Command = (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
    const {$head, $anchor} = state.selection;

    // Only works if we're in a code block with a non-spanning selection
    if (!isInCodeBlock($head, $anchor)) {
        return false;
    }

    // Get the parent node and determine what can be inserted after the current position
    const parentNode: PmNode = $head.node(-1);
    const insertionIndex: number = $head.indexAfter(-1);
    const defaultBlockType: NodeType = findDefaultTextblock(parentNode.contentMatchAt(insertionIndex));

    // Check if we can insert the default block type
    if (!defaultBlockType || !parentNode.canReplaceWith(insertionIndex, insertionIndex, defaultBlockType)) {
        return false;
    }

    if (dispatch) {
        const insertPosition: number = $head.after();
        const newBlock: PmNode = defaultBlockType.createAndFill();
        const transaction: PmTransaction = state.transaction.replaceWith(insertPosition, insertPosition, newBlock);

        // Position cursor at the start of the new block
        transaction.setSelection(Selection.near(transaction.doc.resolve(insertPosition), 1));
        dispatch(transaction.scrollIntoView());
    }

    return true;
};


/**
 * Finds the first textblock node type that can be created without required attributes
 * from the given content match.
 *
 * @param match - The content match to search through
 * @returns The first suitable textblock node type, or null if none found
 */
function findDefaultTextblock(match: ContentMatch): NodeType | null {
    for (let i = 0; i < match.edgeCount; i++) {
        const {type} = match.edge(i);
        if (type.isTextblock && !type.hasRequiredAttrs()) {
            return type;
        }
    }
    return null;
}

/**
 * Checks if the selection is within a code block.
 *
 * @param $head - The head position of the selection
 * @param $anchor - The anchor position of the selection
 * @returns `true` if the selection is within a code block, `false` otherwise
 */
function isInCodeBlock($head: ResolvedPos, $anchor: ResolvedPos): boolean {
    return !!$head.parent.type.spec.code && $head.sameParent($anchor);
}

