/**
 * @type-editor-compat/markdown
 *
 * Compatibility layer for @type-editor/markdown.
 * Re-exports markdown parser and serializer.
 */

export * from '@type-editor/markdown';

// Explicit re-exports for common ProseMirror imports
export {
    defaultMarkdownParser,
    defaultMarkdownSerializer,
    MarkdownParser,
    MarkdownSerializer,
    MarkdownSerializerState,
    markdownSchemaMarks,
    markdownSchemaNodes,
    markdownToPmNodesSchema,
    schema,
} from '@type-editor/markdown';

