import type { Command, DispatchFunction, PmEditorState, PmSelection, PmTransaction } from '@type-editor/editor-types';
import { SelectionFactory } from '@type-editor/state';

import { searchPluginKey } from '../../search-plugin-key';
import type { SearchState } from '../../SearchState';
import type { ReplacementRange } from '../../types/ReplacementRange';
import type { SearchResult } from '../../types/SearchResult';
import { applyReplacements } from './apply-replacements';
import { nextMatch } from './next-match';


/**
 * Factory function that creates a command for replacing search matches.
 *
 * @param wrap - Whether to wrap around at document boundaries
 * @param moveForward - Whether to move to the next match after replacing
 * @returns A command that replaces the current or next match
 */
export function replaceCommand(wrap: boolean, moveForward: boolean): Command {
    return (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
        const search: SearchState = searchPluginKey.getState(state);
        if (!search?.query.valid) {
            return false;
        }

        const {from} = state.selection;
        const nextMatchResult: SearchResult = nextMatch(search, state, wrap, from, from);
        if (!nextMatchResult) {
            return false;
        }

        if (!dispatch) {
            return true;
        }

        // Case 1: Current selection is on a match - replace it
        if (isSelectionAtMatch(state.selection, nextMatchResult)) {
            const transaction: PmTransaction = state.transaction;
            const replacements: Array<ReplacementRange> = search.query.getReplacements(state, nextMatchResult);

            applyReplacements(transaction, replacements);

            // Move to next match if requested
            if (moveForward) {
                const afterMatch: SearchResult = nextMatch(search, state, wrap, nextMatchResult.from, nextMatchResult.to);
                if (afterMatch) {
                    const mappedFrom: number = transaction.mapping.map(afterMatch.from, 1);
                    const mappedTo: number = transaction.mapping.map(afterMatch.to, -1);
                    transaction.setSelection(
                        SelectionFactory.createTextSelection(transaction.doc, mappedFrom, mappedTo)
                    );
                } else {
                    // No next match, place cursor after replacement
                    const mappedFrom: number = transaction.mapping.map(nextMatchResult.from, 1);
                    const cursorPos: number = transaction.mapping.map(nextMatchResult.to, 1);
                    transaction.setSelection(
                        SelectionFactory.createTextSelection(transaction.doc, mappedFrom, cursorPos)
                    );
                }
            } else {
                // Don't move forward, place cursor after replacement
                const mappedFrom: number = transaction.mapping.map(nextMatchResult.from, 1);
                const cursorPos: number = transaction.mapping.map(nextMatchResult.to, 1);
                transaction.setSelection(
                    SelectionFactory.createTextSelection(transaction.doc, mappedFrom, cursorPos)
                );
            }

            dispatch(transaction.scrollIntoView());
            return true;
        }

        // Case 2: Not on a match - either select next match or fail
        if (!moveForward) {
            return false;
        }

        const selection = SelectionFactory.createTextSelection(
            state.doc,
            nextMatchResult.from,
            nextMatchResult.to
        );
        dispatch(state.transaction.setSelection(selection).scrollIntoView());
        return true;
    };
}

/**
 * Checks if the current selection matches the given search result.
 *
 * @param selection - The current editor selection
 * @param match - The search result to compare against
 * @returns True if the selection matches the search result
 */
function isSelectionAtMatch(selection: PmSelection, match: SearchResult): boolean {
    return selection.from === match.from && selection.to === match.to;
}
