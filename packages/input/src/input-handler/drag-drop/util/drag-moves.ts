import {browser} from '@type-editor/commons';
import type {PmEditorView} from '@type-editor/editor-types';


/**
 * Determines whether a drag operation should be a move (vs. copy).
 * Checks dragCopies prop and drag modifier key state.
 * @param view - The editor view
 * @param event - The drag event
 * @returns True if the drag should move content
 */
export function dragMoves(view: PmEditorView, event: DragEvent): boolean {
    const moves: boolean = view.someProp('dragCopies', test => !test(event));
    return moves ?? !(browser.mac ? event.altKey : event.ctrlKey);
}
