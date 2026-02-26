import type { PmEditorState } from '@type-editor/editor-types';
import type { PmNode } from '@type-editor/model';

/**
 * Checks if the document contains any meaningful content.
 *
 * A document is considered empty if it has exactly one child that is an empty textblock
 * (e.g., an empty paragraph).
 *
 * @param state - The current editor state
 * @returns `true` if the document has content, `false` if it's empty
 */
export function documentIsNotEmpty(state: PmEditorState): boolean {
    const doc: PmNode = state.doc;
    return !(doc.childCount === 1 && doc.firstChild?.isTextblock && doc.firstChild.content.size === 0);
}
