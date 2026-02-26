import type {PmSelection} from '@type-editor/editor-types';
import type {PmEditorView} from '@type-editor/editor-types';

import type {ParseBetweenResult} from '../types/dom-change/ParseBetweenResult';

/**
 * Checks if a change should be created for typing over a selection.
 *
 * When typing with a selection active, the editor should replace the selected
 * content. However, sometimes no DOM change is detected (perhaps because the
 * browser hasn't yet processed the change). This function detects if we're in
 * that situation and should create a synthetic change.
 *
 * The conditions checked are:
 * - typeOver flag is set (indicates user is typing to replace selection)
 * - Selection is a text selection (not a node selection)
 * - Selection is not empty (something is selected)
 * - Selection is within a single parent node
 * - Editor is not in composition mode (not using IME)
 * - Parsed selection is collapsed or undefined (no range in parsed content)
 *
 * @param typeOver - Whether typing over mode is active (user started typing with selection)
 * @param selection - Current editor selection state
 * @param view - The editor view containing composition state
 * @param parse - Parsed document information from the DOM
 * @returns True if a synthetic change should be created to replace the selection,
 *          false if the change should be processed normally
 */
export function shouldCreateTypeOverChange(typeOver: boolean,
                                           selection: PmSelection,
                                           view: PmEditorView,
                                           parse: ParseBetweenResult): boolean {
    return typeOver
        && selection.isTextSelection()
        && !selection.empty
        && selection.$head.sameParent(selection.$anchor)
        && !view.composing
        && !(parse.sel && parse.sel.anchor !== parse.sel.head);
}
