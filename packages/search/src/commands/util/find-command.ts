import type { Command, DispatchFunction, PmEditorState } from '@type-editor/editor-types';
import { SelectionFactory, type TextSelection } from '@type-editor/state';

import { searchPluginKey } from '../../search-plugin-key';
import type { SearchState } from '../../SearchState';
import type { SearchResult } from '../../types/SearchResult';
import { nextMatch } from './next-match';
import { prevMatch } from './prev-match';


/**
 * Factory function that creates a command for finding the next or previous search match.
 *
 * @param wrap - Whether to wrap around at document boundaries
 * @param dir - Direction to search: 1 for forward, -1 for backward
 * @returns A command that finds and selects the next or previous match
 */
export function findCommand(wrap: boolean, dir: -1 | 1): Command {
    return (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
        const search: SearchState = searchPluginKey.getState(state);
        if (!search?.query.valid) {
            return false;
        }

        const {from, to} = state.selection;
        const match: SearchResult = dir > 0
            ? nextMatch(search, state, wrap, from, to)
            : prevMatch(search, state, wrap, from, to);

        if (!match) {
            return false;
        }

        if (dispatch) {
            const selection: TextSelection = SelectionFactory.createTextSelection(state.doc, match.from, match.to);
            dispatch(state.transaction.setSelection(selection).scrollIntoView());
        }

        return true;
    };
}
