/**
 * @type-editor-compat/changeset
 *
 * Compatibility layer for @type-editor/changeset.
 * Re-exports changeset utilities.
 */

export * from '@type-editor/changeset';

// Explicit re-exports for common ProseMirror imports
export {
    Change,
    ChangeSet,
    computeDiff,
    DefaultEncoder,
    simplifyChanges,
    Span,
} from '@type-editor/changeset';

