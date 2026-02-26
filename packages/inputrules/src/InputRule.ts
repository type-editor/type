import {isNotFalse} from '@type-editor/commons';
import {type EditorState, type Transaction} from '@type-editor/state';

import type {InputRuleHandler} from './types/InputRuleHandler';
import type {InputRuleOptions} from './types/InputRuleOptions';

/**
 * Input rules are regular expressions describing a piece of text
 * that, when typed, causes something to happen. This might be
 * changing two dashes into an emdash, wrapping a paragraph starting
 * with `'> '` into a blockquote, or something entirely different.
 */
export class InputRule {

    private readonly _match: RegExp;
    private readonly _handler: InputRuleHandler;
    private readonly _undoable: boolean;
    private readonly _inCode: boolean | 'only';
    private readonly _inCodeMark: boolean;

    /**
     * Create an input rule. The rule applies when the user typed
     * something and the text directly in front of the cursor matches
     * `match`, which should end with `$`.
     *
     * The `handler` can be a string, in which case the matched text, or
     * the first matched group in the regexp, is replaced by that
     * string.
     *
     * Or it can be a function, which will be called with the match
     * array produced by
     * [`RegExp.exec`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec),
     * as well as the start and end of the matched range, and which can
     * return a [transaction](#state.Transaction) that describes the
     * rule's effect, or null to indicate the input was not handled.
     *
     * @param match - The regular expression to match against typed text. Should end with `$`.
     * @param handler - Either a replacement string or a function that returns a transaction
     * @param options - Additional configuration options for the rule
     */
    constructor(match: RegExp, handler: string | InputRuleHandler, options: InputRuleOptions = {}) {
        this._match = match;
        this._handler = typeof handler === 'string' ? this.createStringHandler(handler) : handler;
        this._undoable = isNotFalse(options.undoable);
        this._inCode = options.inCode || false;
        this._inCodeMark = isNotFalse(options.inCodeMark);
    }

    /**
     * The regular expression pattern for this rule.
     */
    get match(): RegExp {
        return this._match;
    }

    /**
     * The handler function that applies the rule's transformation.
     */
    get handler(): InputRuleHandler {
        return this._handler;
    }

    /**
     * Whether this rule can be undone with the undoInputRule command.
     */
    get undoable(): boolean {
        return this._undoable;
    }

    /**
     * Whether this rule applies inside code nodes.
     */
    get inCode(): boolean | 'only' {
        return this._inCode;
    }

    /**
     * Whether this rule applies inside code marks.
     */
    get inCodeMark(): boolean {
        return this._inCodeMark;
    }

    /**
     * Creates a handler function for string-based replacements.
     *
     * @param replacementString - The string to replace the matched text with
     * @returns A handler function that performs the replacement
     */
    private createStringHandler(replacementString: string): InputRuleHandler {
        return (state: EditorState, match: RegExpMatchArray, start: number, end: number): Transaction | null => {
            let insert: string = replacementString;
            let insertStart: number = start;

            // If there's a capture group, use it to adjust the replacement
            if (match.length > 1 && match[1]) {
                const offset: number = match[0].lastIndexOf(match[1]);
                insert += match[0].slice(offset + match[1].length);
                insertStart += offset;

                // Adjust if the calculated start is beyond the end
                const cutOff: number = insertStart - end;
                if (cutOff > 0) {
                    insert = match[0].slice(offset - cutOff, offset) + insert;
                    insertStart = end;
                }
            }

            return state.transaction.insertText(insert, insertStart, end);
        };
    }

}
