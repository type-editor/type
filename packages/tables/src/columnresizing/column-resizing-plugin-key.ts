import {PluginKey} from '@type-editor/state';

import type {ResizeState} from './ResizeState';

/**
 * Plugin key for accessing the column resizing plugin state.
 * Use this key to retrieve the current {@link ResizeState} from the editor state.
 *
 * @example
 * ```typescript
 * const resizeState = columnResizingPluginKey.getState(editorState);
 * if (resizeState?.dragging) {
 *   // Handle active drag operation
 * }
 * ```
 */
export const columnResizingPluginKey = new PluginKey<ResizeState>(
    'tableColumnResizing',
);
