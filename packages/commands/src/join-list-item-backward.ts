import type { Command, DispatchFunction, PmEditorState, PmEditorView, PmTransaction } from '@type-editor/editor-types';
import { type PmNode, type ResolvedPos } from '@type-editor/model';
import { SelectionFactory } from '@type-editor/state';

import { atBlockStart } from './util/helpers';

/**
 * Handles backspace at the start of the first paragraph of a list item when the previous
 * sibling list item also ends with a paragraph.
 *
 * In the default `joinBackward` behaviour, pressing backspace at the start of item 2 in:
 *
 * ```
 * • Hello
 * • World   ← cursor at start
 * ```
 *
 * merges the two *list items*, producing a single list item with **two paragraphs**:
 *
 * ```
 * • Hello
 *   World
 * ```
 *
 * This command goes one step further and **also merges the two paragraphs**, inserting a
 * single space between the text content so the result is:
 *
 * ```
 * • Hello World   ← cursor placed after the inserted space
 * ```
 *
 * The command is intentionally narrow: it only fires when
 * - the cursor is at the very start of a textblock,
 * - that textblock is the **first** child of its parent node (the list item),
 * - the list item is **not** the first child of its own parent (a previous sibling exists),
 * - the previous sibling list item's **last** child is also a textblock (so the merge
 *   is content-compatible).
 *
 * All other cursor positions fall through to the normal `joinBackward` / `selectNodeBackward`
 * commands, so existing behaviour is fully preserved.
 *
 * @param state  - The current editor state.
 * @param dispatch - Optional dispatch function to execute the transaction.
 * @param view   - Optional editor view for bidirectional-text detection.
 * @returns `true` when the paragraph-merging operation was applied, `false` otherwise.
 */
export const joinListItemBackward: Command = (state: PmEditorState,
                                              dispatch?: DispatchFunction,
                                              view?: PmEditorView): boolean => {
    // 1. We must have a cursor sitting exactly at the start of a textblock.
    const $cursor: ResolvedPos | null = atBlockStart(state, view);
    if (!$cursor) {
        return false;
    }

    // 2. The cursor's direct parent must be a textblock (e.g. paragraph).
    const paragraph: PmNode = $cursor.parent;
    if (!paragraph.isTextblock) {
        return false;
    }

    // 3. That paragraph must be the *first* child of the node one level up (the list item).
    //    depth:  0 = doc,  1 = list,  2 = list_item,  3 = paragraph  ← typical nesting
    //    $cursor.depth is the depth of the *paragraph* node.
    const paragraphDepth: number = $cursor.depth;
    if (paragraphDepth < 2) {
        // Not deeply enough nested to have a list item above us.
        return false;
    }

    // Index of the paragraph inside the list item.
    const paragraphIndexInListItem: number = $cursor.index(paragraphDepth - 1);
    if (paragraphIndexInListItem !== 0) {
        // Cursor is not in the first paragraph of the list item – fall through.
        return false;
    }

    // 4. The list item itself must NOT be the first child of its parent (the list).
    const listItemIndexInList: number = $cursor.index(paragraphDepth - 2);
    if (listItemIndexInList === 0) {
        // This is the very first list item – nothing to merge backwards into.
        return false;
    }

    // 5. Retrieve the previous sibling list item.
    const listNode: PmNode = $cursor.node(paragraphDepth - 2);
    const prevListItem: PmNode = listNode.child(listItemIndexInList - 1);

    // 6. The previous list item's *last* child must be a textblock so we can merge content.
    const prevLastChild: PmNode | null = prevListItem.lastChild;
    if (!prevLastChild?.isTextblock) {
        return false;
    }

    // 7. The content of the current paragraph must be insertable into the previous textblock.
    if (!prevLastChild.canReplace(prevLastChild.childCount, prevLastChild.childCount, paragraph.content)) {
        return false;
    }

    if (!dispatch) {
        // Dry-run: we confirmed the operation is applicable.
        return true;
    }

    // -------------------------------------------------------------------------
    // Build the transaction.
    //
    // Document structure around the cut (positions are illustrative):
    //
    //   ... <prevListItem> ... <prevLastChild> {text} </prevLastChild> </prevListItem>
    //       <curListItem>  <paragraph> {cursor}{text} </paragraph>    ...
    //
    // We want to:
    //   a) Insert a space at the end of `prevLastChild` (end of previous paragraph).
    //   b) Remove the closing </prevLastChild></prevListItem><curListItem><paragraph>
    //      boundary so the two text runs become one paragraph.
    //
    // The positions we need:
    //   listStartPos  = absolute position of the start of `listNode`
    //   prevItemStart = absolute position of the start of `prevListItem` inside listNode
    //   prevTextEnd   = absolute position of the closing token of `prevLastChild`
    //   curParStart   = absolute position of the opening token of the current `paragraph`
    //                 = $cursor.start(paragraphDepth)  (first content position)
    //
    // We replace the range [prevTextEnd … curParStart] with a single space text node,
    // which effectively:
    //   – closes prevLastChild at prevTextEnd  → stays (we keep chars before it)
    //   – removes </prevLastChild></prevListItem><curListItem><paragraph>  (the boundary)
    //   – inserts the space so the merged text reads "…Hello World…"
    // -------------------------------------------------------------------------

    // Absolute start of the list node content.
    const listContentStart: number = $cursor.start(paragraphDepth - 2);

    // Walk through the list's children to find the absolute start of prevListItem.
    let prevItemAbsStart: number = listContentStart;
    for (let i = 0; i < listItemIndexInList - 1; i++) {
        prevItemAbsStart += listNode.child(i).nodeSize;
    }
    // Start of prevLastChild content:
    // prevItemAbsStart + 1 (opening tag of listItem) + offset to prevLastChild
    let prevLastChildAbsStart: number = prevItemAbsStart + 1; // skip <listItem> opening tag
    for (let i = 0; i < prevListItem.childCount - 1; i++) {
        prevLastChildAbsStart += prevListItem.child(i).nodeSize;
    }
    // End of prevLastChild content (= position of its closing token):
    const prevTextEnd: number = prevLastChildAbsStart + 1 + prevLastChild.content.size;
    //                           ↑ skip opening tag              ↑ content size

    // Start of the current paragraph's content:
    const curParContentStart: number = $cursor.start(paragraphDepth); // first position inside <paragraph>

    // The range to replace: from end-of-prev-paragraph-content to start-of-cur-paragraph-content.
    // This spans:  </prevLastChild> </prevListItem> <curListItem> <paragraph>
    // i.e. from `prevTextEnd` to `curParContentStart`.

    const spaceText: PmNode = state.schema.text(' ');
    const transaction: PmTransaction = state.transaction.replaceWith(prevTextEnd, curParContentStart, spaceText);

    // Place the cursor just after the inserted space.
    const newCursorPos: number = prevTextEnd + 1; // +1 for the space character
    transaction.setSelection(SelectionFactory.createTextSelection(transaction.doc, newCursorPos));

    dispatch(transaction.scrollIntoView());
    return true;
};
