import {PluginKey} from '@type-editor/state';

import type {SearchState} from './SearchState';

/**
 * Plugin key for the search plugin state.
 */
export const searchPluginKey = new PluginKey<SearchState>('search');
