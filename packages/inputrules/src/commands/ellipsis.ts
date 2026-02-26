import {InputRule} from '../InputRule';

/**
 * Converts three dots to an ellipsis character.
 */

const matchInput = /\.\.\.$/;
const convertTo = '…';
const options = {inCodeMark: false};

export const ellipsis = new InputRule(matchInput, convertTo, options);
