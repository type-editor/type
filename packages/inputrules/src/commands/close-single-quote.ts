import {InputRule} from '../InputRule';

/**
 * “Smart” closing single quotes.
 */

const matchInput = /'$/;
const convertTo = '’';
const options = {inCodeMark: false};

export const closeSingleQuote = new InputRule(matchInput, convertTo, options);
