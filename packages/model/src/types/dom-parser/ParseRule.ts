import type {StyleParseRule} from './StyleParseRule';
import type {TagParseRule} from './TagParseRule';


/**
 * A value that describes how to parse a given DOM node or inline
 * style as a ProseMirror node or mark.
 */
export type ParseRule = TagParseRule | StyleParseRule;
