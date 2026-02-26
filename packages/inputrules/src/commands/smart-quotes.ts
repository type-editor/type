import type {InputRule} from '../InputRule';
import {closeDoubleQuote} from './close-double-quote';
import {closeSingleQuote} from './close-single-quote';
import {openDoubleQuote} from './open-double-quote';
import {openSingleQuote} from './open-single-quote';

/**
 * Smart-quote related input rules.
 */
export const smartQuotes: ReadonlyArray<InputRule> = [openDoubleQuote, closeDoubleQuote, openSingleQuote, closeSingleQuote];
