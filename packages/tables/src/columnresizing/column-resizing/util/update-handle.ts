import type {PmEditorView} from '@type-editor/editor-types';

import {columnResizingPluginKey} from '../../column-resizing-plugin-key';

/**
 * Updates the active resize handle position by dispatching a transaction.
 *
 * @param view - The editor view.
 * @param value - The new handle position, or {@link NO_ACTIVE_HANDLE} to deactivate.
 */
export function updateHandle(view: PmEditorView, value: number): void {
    // Dispatch a transaction to update which handle is active
    view.dispatch(
        view.state.transaction.setMeta(columnResizingPluginKey, {setHandle: value})
    );
}
