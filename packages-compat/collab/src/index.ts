/**
 * @type-editor-compat/collab
 *
 * Compatibility layer for @type-editor/collab providing ProseMirror-compatible type signatures.
 *
 * Re-exports collaboration plugin and utilities with concrete type signatures.
 */

import type {
    EditorState as BaseEditorState,
    Plugin as BasePlugin,
    Transaction as BaseTransaction,
} from '@type-editor-compat/state';
import type {Step as BaseStep, Transform as BaseTransform} from '@type-editor-compat/transform';

// Define concrete types locally
export type EditorState = BaseEditorState;
export type Transaction = BaseTransaction;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Plugin<T = any> = BasePlugin<T>;
export type Step = BaseStep;
export type Transform = BaseTransform;

// Re-export from base module
export {
    collab,
    getVersion,
    rebaseSteps,
    receiveTransaction,
    sendableSteps,
} from '@type-editor/collab';

// ============================================================================
// SendableSteps - Concrete type signature
// ============================================================================

export interface SendableSteps {
    version: number;
    steps: ReadonlyArray<Step>;
    clientID: string | number;
    readonly origins: ReadonlyArray<Transform>;
}

