import {InputRule} from '../InputRule';

/**
 * “Smart” opening double quotes.
 * Examples:
 * <ul>
 * <li>`'hello world` - apostrophe at the start of the line</li>
 * <li>`hello 'world` - apostrophe after a space</li>
 * <li>`hello('world` - apostrophe after an opening parenthesis</li>
 * <li>`hello['world` - apostrophe after an opening bracket</li>
 * <li>`hello{'world` - apostrophe after an opening brace</li>
 * <li>`hello<'world` - apostrophe after a less-than sign</li>
 * <li>`hello''world` - apostrophe after another straight apostrophe</li>
 * <li>`hello''world` - apostrophe after a curly left single quote (U+2018)</li>
 * <li>`hello"'world` - apostrophe after a curly left double quote (U+201C)</li>
 * </ul>
 */

// Curly single quote `'` (U+2018 - left single quotation mark)
// Curly double quote `"` (U+201C - left double quotation mark)
const matchInput = /(?:^|[\s{[(<''\u2018\u201C])(')$/;
const convertTo = '“';
const options = {inCodeMark: false};

export const openDoubleQuote = new InputRule(matchInput, convertTo, options);
