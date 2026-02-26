import type {PmEditorState} from '@type-editor/editor-types';
import type {Transaction} from '@type-editor/state';

/**
 * A function that handles the application of an input rule.
 *
 * @param state - The current editor state
 * @param match - The RegExp match array containing the matched text and capture groups
 * @param start - The starting position of the matched text in the document
 * @param end - The ending position of the matched text in the document
 * @returns A transaction describing the rule's effect, or null if the input was not handled
 */
export type InputRuleHandler = (state: PmEditorState,
                                match: RegExpMatchArray,
                                start: number,
                                end: number) => Transaction | null;
