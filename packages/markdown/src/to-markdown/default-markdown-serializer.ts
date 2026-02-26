import {MarkdownSerializer} from './MarkdownSerializer';
import {markdownSchemaMarks} from './schema/markdown-schema-marks';
import {markdownSchemaNodes} from './schema/markdown-schema-nodes';


/**
 * A serializer for the [basic schema](#schema).
 */
export const defaultMarkdownSerializer = new MarkdownSerializer(markdownSchemaNodes, markdownSchemaMarks);
