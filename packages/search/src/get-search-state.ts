import type { PmEditorState } from '@type-editor/editor-types';

import {searchPluginKey} from './search-plugin-key';
import type {SearchState} from './SearchState';

/**
 * Get the current active search query and searched range.
 *
 * @param state - The editor state to retrieve search state from
 * @returns The current search state, or `undefined` if the search plugin isn't active
 */
export function getSearchState(state: PmEditorState): SearchState | undefined {
    return searchPluginKey.getState(state);
}
