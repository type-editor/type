/**
 * @type-editor-compat/inputrules
 *
 * Compatibility layer for @type-editor/inputrules providing ProseMirror-compatible type signatures.
 *
 * Re-exports inputrules plugin and commands with concrete type signatures using type assertions.
 * This ensures that imported functions have type signatures using compat types
 * (EditorState, Transaction) instead of base interface types (PmEditorState, PmTransaction).
 */

import {
    InputRule as BaseInputRule,
    inputRules as baseInputRules,
    textblockTypeInputRule as baseTextblockTypeInputRule,
    undoInputRule as baseUndoInputRule,
    wrappingInputRule as baseWrappingInputRule,
} from '@type-editor/inputrules';
import type {Attrs, Node as PmNode, NodeType} from '@type-editor-compat/model';
import type {
    EditorState as BaseEditorState,
    EditorView,
    Plugin as BasePlugin,
    Transaction as BaseTransaction,
} from '@type-editor-compat/state';

// Re-export types that don't need modification
export type {InputRuleOptions, InputRulesPluginSpec, PluginState} from '@type-editor/inputrules';

// Re-export value exports that don't involve EditorState/Transaction in their signatures
export {
    closeDoubleQuote,
    closeSingleQuote,
    ellipsis,
    emDash,
    openDoubleQuote,
    openSingleQuote,
    smartQuotes,
} from '@type-editor/inputrules';

// Define concrete types locally to avoid circular dependencies
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

// ============================================================================
// InputRuleHandler Type - Concrete type signature
// ============================================================================

/**
 * A function that handles the application of an input rule.
 */
export type InputRuleHandler = (
    state: EditorState,
    match: RegExpMatchArray,
    start: number,
    end: number
) => Transaction | null;

// ============================================================================
// InputRule - Compat constructor type
// ============================================================================

/**
 * Constructor type for InputRule with compat type signatures.
 * The handler receives the compat EditorState and returns a compat Transaction.
 */
type InputRuleConstructor = new (
    match: RegExp,
    handler: string | InputRuleHandler,
    options?: import('@type-editor/inputrules').InputRuleOptions
) => import('@type-editor/inputrules').InputRule;

/**
 * InputRule re-exported with a compat constructor signature so that handler
 * functions are typed with the compat EditorState and Transaction.
 */
export const InputRule: InputRuleConstructor = BaseInputRule as unknown as InputRuleConstructor;

// ============================================================================
// Factory Types - Concrete type signatures
// ============================================================================

/**
 * Type for the inputRules plugin factory with compat types.
 */
type InputRulesFactory = (config: { rules: ReadonlyArray<import('@type-editor/inputrules').InputRule> }) => Plugin<import('@type-editor/inputrules').PluginState>;

/**
 * Type for textblockTypeInputRule factory with compat types.
 */
type TextblockTypeInputRuleFactory = (
    regexp: RegExp,
    nodeType: NodeType,
    getAttrs?: Attrs | null | ((match: RegExpMatchArray) => Attrs | null)
) => import('@type-editor/inputrules').InputRule;

/**
 * Type for wrappingInputRule factory with compat types.
 */
type WrappingInputRuleFactory = (
    regexp: RegExp,
    nodeType: NodeType,
    getAttrs?: Attrs | null | ((matches: RegExpMatchArray) => Attrs | null),
    joinPredicate?: (match: RegExpMatchArray, node: PmNode) => boolean
) => import('@type-editor/inputrules').InputRule;

// ============================================================================
// Re-exported functions with compat types
// ============================================================================

export const undoInputRule: Command = baseUndoInputRule as unknown as Command;
export const inputRules: InputRulesFactory = baseInputRules as unknown as InputRulesFactory;
export const textblockTypeInputRule: TextblockTypeInputRuleFactory = baseTextblockTypeInputRule as unknown as TextblockTypeInputRuleFactory;
export const wrappingInputRule: WrappingInputRuleFactory = baseWrappingInputRule as unknown as WrappingInputRuleFactory;
