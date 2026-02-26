import type { EditorState, Transaction } from '@type-editor-compat/state';
import type { EditorView } from '@type-editor-compat/view';

/**
 * Commands are functions that take a state and a an optional
 * transaction dispatch function and...
 *
 *  - determine whether they apply to this state
 *  - if not, return false
 *  - if `dispatch` was passed, perform their effect, possibly by
 *    passing a transaction to `dispatch`
 *  - return true
 *
 * In some cases, the editor view is passed as a third argument.
 */
export type DispatchFunction = (transaction: Transaction) => void;
export type Command = (state: EditorState, dispatch?: DispatchFunction, view?: EditorView) => boolean;
