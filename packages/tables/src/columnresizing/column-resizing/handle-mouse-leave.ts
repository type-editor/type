import type {PmEditorView} from '@type-editor/editor-types';

import {columnResizingPluginKey} from '../column-resizing-plugin-key';
import {NO_ACTIVE_HANDLE} from '../no-active-handle';
import type {ResizeState} from '../ResizeState';
import {updateHandle} from './util/update-handle';

/**
 * Handles mouse leave events to clear the active resize handle when the mouse
 * exits the editor area.
 *
 * @param view - The editor view.
 */
export function handleMouseLeave(view: PmEditorView): void {
    if (!view.editable) {
        return;
    }

    const pluginState: ResizeState = columnResizingPluginKey.getState(view.state);
    // Clear active handle when mouse leaves, but only if not currently dragging
    if (pluginState && pluginState.activeHandle > NO_ACTIVE_HANDLE && !pluginState.dragging) {
        updateHandle(view, NO_ACTIVE_HANDLE);
    }
}
