import {InputRule} from '../InputRule';

/**
 * “Smart” opening single quotes.
 * Examples:
 * <ul>
 * <li>`'hello` (quote at start)</li>
 * <li>`word 'hello` (quote after space)</li>
 * <li>`('hello` (quote after opening paren)</li>
 * <li>`{'hello` (quote after brace)</li>
 * </ul>
 */

// Curly single quote `'` (U+2018 - left single quotation mark)
// Curly double quote `"` (U+201C - left double quotation mark)
const matchInput = /(?:^|[\s{[(<''\u2018\u201C])(')$/;
const convertTo = '‘';
const options = {inCodeMark: false};

export const openSingleQuote = new InputRule(matchInput, convertTo, options);
