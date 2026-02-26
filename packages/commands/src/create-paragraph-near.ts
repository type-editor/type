import type { Command, DispatchFunction, PmEditorState, PmSelection, PmTransaction } from '@type-editor/editor-types';
import type { ContentMatch, NodeType, PmNode, ResolvedPos } from '@type-editor/model';
import { TextSelection } from '@type-editor/state';


/**
 * Creates an empty paragraph before or after a selected block node.
 *
 * When a block node is selected (not inline content), this command inserts an empty
 * paragraph block adjacent to it. The paragraph is created before the selected block
 * if it's the first child of its parent, or after it otherwise. The cursor is placed
 * in the newly created paragraph.
 *
 * This command is useful for allowing users to add content around block elements that
 * would otherwise be difficult to escape from or insert content near.
 *
 * @param state - The current editor state
 * @param dispatch - Optional dispatch function to execute the transaction
 * @returns `true` if the command can be applied, `false` otherwise
 *
 * @example
 * ```typescript
 * // Use in a keymap to create paragraphs near selected blocks
 * const keymap = {
 *   'Mod-Enter': createParagraphNear
 * };
 * ```
 */
export const createParagraphNear: Command = (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
    const selection: PmSelection = state.selection;
    const {$from, $to} = selection;

    // Command only works for block selections, not inline content or full document
    if (selection.isAllSelection() || $from.parent.inlineContent || $to.parent.inlineContent) {
        return false;
    }

    // Find the default textblock type that can be inserted
    const nodeType: NodeType = findDefaultTextblock($to.parent.contentMatchAt($to.indexAfter()));
    if (!nodeType?.isTextblock) {
        return false;
    }

    if (dispatch) {
        const insertPosition: number = getInsertionPosition($from, $to);
        const newNode: PmNode = nodeType.createAndFill();
        const transaction: PmTransaction = state.transaction.insert(insertPosition, newNode);

        // Place cursor at the start of the new paragraph
        const cursorPosition: number = insertPosition + 1;
        transaction.setSelection(TextSelection.create(transaction.doc, cursorPosition));

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
 * Determines the appropriate position to insert a new paragraph relative to the selection.
 *
 * @param $from - Start position of the selection
 * @param $to - End position of the selection
 * @returns The position where the paragraph should be inserted
 */
function getInsertionPosition($from: ResolvedPos, $to: ResolvedPos): number {
    // If cursor is at the start and not at the end, insert before
    // Otherwise, insert after
    const shouldInsertBefore: boolean = !$from.parentOffset && $to.index() < $to.parent.childCount;
    return shouldInsertBefore ? $from.pos : $to.pos;
}

