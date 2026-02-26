import type { PmEditorState, PmEditorView } from '@type-editor/editor-types';
import type { Command, DispatchFunction } from '@type-editor/editor-types';


/**
 * Command to zoom in the editor view by 10%, up to a maximum of 200%.
 * @param _state - The current editor state (unused).
 * @param _dispatch - The dispatch function (unused).
 * @param view - The editor view to zoom.
 * @returns `true` if the zoom was applied successfully.
 */
export function zoomIn(_state: PmEditorState, _dispatch: DispatchFunction, view: PmEditorView): boolean {
    return zoom('in')(_state, _dispatch, view);
}

/**
 * Command to zoom out the editor view by 10%, down to a minimum of 10%.
 * @param _state - The current editor state (unused).
 * @param _dispatch - The dispatch function (unused).
 * @param view - The editor view to zoom.
 * @returns `true` if the zoom was applied successfully.
 */
export function zoomOut(_state: PmEditorState, _dispatch: DispatchFunction, view: PmEditorView): boolean {
    return zoom('out')(_state, _dispatch, view);
}

/**
 * Command to reset the editor view zoom to 100%.
 * @param _state - The current editor state (unused).
 * @param _dispatch - The dispatch function (unused).
 * @param view - The editor view to reset zoom.
 * @returns `true` if the zoom was reset successfully.
 */
export function zoomReset(_state: PmEditorState, _dispatch: DispatchFunction, view: PmEditorView): boolean {
    return zoom('reset')(_state, _dispatch, view);
}


type ZoomType = 'in' | 'out' | 'reset';

/**
 * Command to zoom in the editor view.
 */
function zoom(zoomType: ZoomType): Command {
    return (_state: PmEditorState, _dispatch: DispatchFunction, editorView: PmEditorView): boolean => {
        const currentZoom = editorView.dom.style.zoom || 1;

        if (zoomType === 'reset') {
            editorView.dom.style.zoom = '1';
            return true;
        }

        if (zoomType === 'out') {
            editorView.dom.style.zoom = String(Math.max(Number(currentZoom) - 0.1, 0.1));
            return true;
        }

        editorView.dom.style.zoom = String(Math.min(Number(currentZoom) + 0.1, 2));
        return true;
    };
}
