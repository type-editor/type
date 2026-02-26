import {InputRule} from '../InputRule';

/**
 * Converts double dashes to an emdash.
 */

const matchInput = /--$/;
const convertTo = '—';
const options = {inCodeMark: false};

export const emDash = new InputRule(matchInput, convertTo, options);
