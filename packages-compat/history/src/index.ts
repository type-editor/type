/**
 * @type-editor-compat/history
 *
 * Compatibility layer for @type-editor/history providing ProseMirror-compatible type signatures.
 *
 * Re-exports history plugin and commands with concrete type signatures.
 */

import {
    history as baseHistory,
    type HistoryOptions,
    redo as baseRedo,
    redoNoScroll as baseRedoNoScroll,
    undo as baseUndo,
    undoNoScroll as baseUndoNoScroll
} from '@type-editor/history';
import type {
    EditorState as BaseEditorState,
    EditorView,
    Plugin as BasePlugin,
    Transaction as BaseTransaction,
} from '@type-editor-compat/state';

// Define concrete types locally
export type EditorState = BaseEditorState;
export type Transaction = BaseTransaction;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Plugin<T = any> = BasePlugin<T>;

// Re-export from base module
export {
    closeHistory,
    // history,
    HistoryState,
    isHistoryTransaction,
    mustPreserveItems,
    // redo,
    redoDepth,
    // redoNoScroll,
    // undo,
    undoDepth,
    // undoNoScroll,
} from '@type-editor/history';

// ============================================================================
// Command Type - Concrete type signature
// ============================================================================

/**
 * Command function type with concrete class references.
 */
export type Command = (
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
    view?: EditorView
) => boolean;


export const redo: Command = baseRedo as unknown as Command;
export const redoNoScroll: Command = baseRedoNoScroll as unknown as Command;
export const undo: Command = baseUndo as unknown as Command;
export const undoNoScroll: Command = baseUndoNoScroll as unknown as Command;
type HistoryFactory = (config?: HistoryOptions) => Plugin;
export const history: HistoryFactory = baseHistory as unknown as HistoryFactory;
