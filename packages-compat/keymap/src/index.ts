/**
 * @type-editor-compat/keymap
 *
 * Compatibility layer for @type-editor/keymap providing ProseMirror-compatible type signatures.
 *
 * Re-exports keymap plugin with concrete type signatures.
 */

import {
    baseKeymap as baseKeymapBase,
    keydownHandler as keydownHandlerBase,
    keymap as keymapBase,
    macBaseKeymap as macBaseKeymapBase,
    pcBaseKeymap as pcBaseKeymapBase,
} from '@type-editor/keymap';
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

/**
 * Keymap type mapping key names to commands
 */
export type Keymap = Record<string, Command>;

// ============================================================================
// Re-exports with proper compat types
// ============================================================================

/**
 * Creates a keymap plugin for the given set of key bindings.
 *
 * Bindings should map key names to command-style functions, which will be called
 * with `(EditorState, dispatch, EditorView)` arguments, and should return `true` when they've
 * handled the key.
 *
 * @param bindings - A record mapping key name strings to command functions that handle those keys
 * @returns A plugin instance that handles keydown events according to the provided bindings
 */
export function keymap(bindings: Keymap): Plugin {
    // The base keymap function uses Command from @type-editor/state which is compatible
    // at runtime with our compat Command type
    return keymapBase(bindings as unknown as Parameters<typeof keymapBase>[0]) as unknown as Plugin;
}

/**
 * Creates a keydown handler function from a set of key bindings.
 *
 * Given a set of bindings (using the same format as {@link keymap}), this function returns
 * a keydown handler that handles them.
 *
 * @param bindings - A record mapping key name strings to command functions
 * @returns A keydown event handler function that can be used in EditorProps
 */
export function keydownHandler(bindings: Keymap): (view: EditorView, event: KeyboardEvent) => boolean {
    return keydownHandlerBase(bindings as unknown as Parameters<typeof keydownHandlerBase>[0]) as unknown as (view: EditorView, event: KeyboardEvent) => boolean;
}

/**
 * Base keymap with platform-appropriate bindings.
 * Contains default key bindings for common editing operations.
 */
export const baseKeymap: Keymap = baseKeymapBase as unknown as Keymap;

/**
 * Base keymap for macOS.
 * Contains Mac-specific key bindings.
 */
export const macBaseKeymap: Keymap = macBaseKeymapBase as unknown as Keymap;

/**
 * Base keymap for PC (Windows/Linux).
 * Contains PC-specific key bindings.
 */
export const pcBaseKeymap: Keymap = pcBaseKeymapBase as unknown as Keymap;


