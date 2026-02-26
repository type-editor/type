import {PluginKey} from '@type-editor/state';

/**
 * Plugin key for the table editing plugin.
 * Used to track when cells are being selected in the editor.
 */
export const tableEditingPluginKey = new PluginKey<number>('selectingCells');
