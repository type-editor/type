import {PluginKey} from '@type-editor/state';

/**
 * Plugin key used to mark transactions that have fixed table issues.
 * This allows other plugins to identify and handle table normalization transactions.
 */
export const fixTablesPluginKey = new PluginKey<{ fixTables: boolean }>('fix-tables');
