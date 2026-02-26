import type {PmEditorState, PmEditorView, PmTransaction} from '@type-editor/editor-types';


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
export type DispatchFunction = (transaction: PmTransaction) => void;
export type Command = (state: PmEditorState, dispatch?: DispatchFunction, view?: PmEditorView) => boolean;
