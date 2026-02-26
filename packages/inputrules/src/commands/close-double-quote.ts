import {InputRule} from '../InputRule';

/**
 * “Smart” closing double quotes.
 */

const matchInput = /'$/;
const convertTo = '”';
const options = {inCodeMark: false};

export const closeDoubleQuote = new InputRule(matchInput, convertTo, options);
