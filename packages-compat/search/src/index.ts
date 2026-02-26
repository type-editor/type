/**
 * @type-editor-compat/search
 *
 * Compatibility layer for @type-editor/search providing ProseMirror-compatible type signatures.
 *
 * Re-exports search plugin and utilities with concrete type signatures.
 */

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

// Forward declare EditorView
export interface EditorView {
    readonly state: EditorState;
    readonly dom: HTMLElement;
    dispatch(tr: Transaction): void;
    [key: string]: unknown;
}

// Re-export from base module
export type {SearchResult} from '@type-editor/search';
export {
    findNext,
    findNextNoWrap,
    findPrev,
    findPrevNoWrap,
    replaceAll,
    replaceCurrent,
    replaceNext,
    replaceNextNoWrap,
    search,
    searchPlugin,
    SearchQuery,
} from '@type-editor/search';

// ============================================================================
// Command Type - Concrete type signature
// ============================================================================

export type Command = (
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
    view?: EditorView
) => boolean;

