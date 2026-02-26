import MarkdownIt from 'markdown-it';

import {schema} from '../schema';
import {MarkdownParser} from './MarkdownParser';
import {markdownToPmNodesSchema} from './schema/markdown-to-pm-nodes-schema';


/**
 * A default markdown parser instance configured to parse CommonMark
 * without HTML support, using the markdown schema.
 * This parser can be used directly or as a base for custom parsers.
 */
export const defaultMarkdownParser = new MarkdownParser(schema, MarkdownIt('commonmark', {html: false}), markdownToPmNodesSchema);
