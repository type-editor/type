/**
 * @type-editor-compat/dropcursor
 *
 * Compatibility layer for @type-editor/dropcursor providing ProseMirror-compatible type signatures.
 *
 * Re-exports dropcursor plugin with concrete type signatures.
 */

import { dropCursor as baseDropCursor, type DropCursorOptions } from '@type-editor/dropcursor';
import type {
    EditorState as BaseEditorState,
    Plugin as BasePlugin,
    Transaction as BaseTransaction,
} from '@type-editor-compat/state';

// Define concrete types locally
export type EditorState = BaseEditorState;
export type Transaction = BaseTransaction;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Plugin<T = any> = BasePlugin<T>;

// Re-export from base module
export type {DropCursorOptions} from '@type-editor/dropcursor';

type DropCursorFactory = (options?: DropCursorOptions) => Plugin;
export const dropCursor: DropCursorFactory = baseDropCursor as unknown as DropCursorFactory;

