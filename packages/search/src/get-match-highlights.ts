import {DecorationSet} from '@type-editor/decoration';
import type { PmEditorState } from '@type-editor/editor-types';

import {searchPluginKey} from './search-plugin-key';
import type {SearchState} from './SearchState';


/**
 * Access the decoration set holding the currently highlighted search
 * matches in the document.
 *
 * @param state - The editor state to retrieve decorations from
 * @returns A decoration set containing all highlighted search matches
 */
export function getMatchHighlights(state: PmEditorState): DecorationSet {
    const search: SearchState = searchPluginKey.getState(state);
    return search?.deco ?? DecorationSet.empty;
}
