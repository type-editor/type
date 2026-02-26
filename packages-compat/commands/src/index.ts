/**
 * @type-editor-compat/commands
 *
 * Compatibility layer for @type-editor/commands providing ProseMirror-compatible type signatures.
 *
 * Re-exports all commands with concrete type signatures using type assertions.
 * This ensures that imported commands have type signatures using compat types
 * (EditorState, Transaction, EditorView) instead of base interface types
 * (PmEditorState, PmTransaction, PmEditorView).
 */

import {
    autoJoin as baseAutoJoin,
    backspace as baseBackspace,
    chainCommands as baseChainCommands,
    createParagraphNear as baseCreateParagraphNear,
    DEFAULT_TOGGLE_MARK_OPTIONS,
    del as baseDel,
    deleteSelection as baseDeleteSelection,
    exitCode as baseExitCode,
    joinBackward as baseJoinBackward,
    joinDown as baseJoinDown,
    joinForward as baseJoinForward,
    joinTextblockBackward as baseJoinTextblockBackward,
    joinTextblockForward as baseJoinTextblockForward,
    joinUp as baseJoinUp,
    lift as baseLift,
    liftEmptyBlock as baseLiftEmptyBlock,
    newlineInCode as baseNewlineInCode,
    selectAll as baseSelectAll,
    selectHorizontallyBackward as baseSelectHorizontallyBackward,
    selectHorizontallyForward as baseSelectHorizontallyForward,
    selectNodeBackward as baseSelectNodeBackward,
    selectNodeForward as baseSelectNodeForward,
    selectParentNode as baseSelectParentNode,
    selectTextblockEnd as baseSelectTextblockEnd,
    selectTextblockStart as baseSelectTextblockStart,
    selectVerticallyDown as baseSelectVerticallyDown,
    selectVerticallyUp as baseSelectVerticallyUp,
    setBlockType as baseSetBlockType,
    skipIgnoredNodesAfter,
    skipIgnoredNodesBefore,
    splitBlock as baseSplitBlock,
    splitBlockAs as baseSplitBlockAs,
    splitBlockKeepMarks as baseSplitBlockKeepMarks,
    stopNativeHorizontalDeleteBackward as baseStopNativeHorizontalDeleteBackward,
    stopNativeHorizontalDeleteForward as baseStopNativeHorizontalDeleteForward,
    toggleMark as baseToggleMark,
    wrapIn as baseWrapIn,
} from '@type-editor/commands';
import type {Attrs, MarkType, Node as PmNode, NodeType} from '@type-editor-compat/model';
import type {
    EditorState as BaseEditorState,
    Plugin as BasePlugin,
    Transaction as BaseTransaction,
} from '@type-editor-compat/state';
import type { EditorView } from '@type-editor-compat/state';

// Re-export types that don't need modification
export type {SplitNodeFunction, ToggleMarkOptions} from '@type-editor/commands';
export {DEFAULT_TOGGLE_MARK_OPTIONS, skipIgnoredNodesAfter, skipIgnoredNodesBefore};
export {baseKeymap, macBaseKeymap, pcBaseKeymap} from '@type-editor/keymap';

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
// Command Factory Types - Concrete type signatures
// ============================================================================

/**
 * Type for toggleMark command factory with compat types.
 */
type ToggleMarkFactory = (
    markType: MarkType,
    attrs?: Attrs | null,
    options?: import('@type-editor/commands').ToggleMarkOptions
) => Command;

/**
 * Type for setBlockType command factory with compat types.
 */
type SetBlockTypeFactory = (
    nodeType: NodeType,
    attrs?: Attrs | null
) => Command;

/**
 * Type for wrapIn command factory with compat types.
 */
type WrapInFactory = (
    nodeType: NodeType,
    attrs?: Attrs | null
) => Command;



/**
 * Type for autoJoin command wrapper with compat types.
 * The predicate receives the actual nodes (before and after) being considered for joining.
 */
type AutoJoinFactory = (
    command: Command,
    isJoinable: ((before: PmNode, after: PmNode) => boolean) | ReadonlyArray<string>
) => Command;

/**
 * Type for chainCommands with compat types.
 */
type ChainCommandsFactory = (...commands: ReadonlyArray<Command>) => Command;

/**
 * Type for splitBlockAs factory with compat types.
 */
type SplitBlockAsFactory = (
    splitNode?: import('@type-editor/commands').SplitNodeFunction
) => Command;

// ============================================================================
// Re-exported Commands with Compat Types
// ============================================================================

// Simple commands - cast to Command type via 'unknown' to bypass structural incompatibility
export const deleteSelection: Command = baseDeleteSelection as unknown as Command;
export const joinBackward: Command = baseJoinBackward as unknown as Command;
export const joinTextblockBackward: Command = baseJoinTextblockBackward as unknown as Command;
export const joinTextblockForward: Command = baseJoinTextblockForward as unknown as Command;
export const selectNodeBackward: Command = baseSelectNodeBackward as unknown as Command;
export const joinForward: Command = baseJoinForward as unknown as Command;
export const selectNodeForward: Command = baseSelectNodeForward as unknown as Command;
export const joinUp: Command = baseJoinUp as unknown as Command;
export const joinDown: Command = baseJoinDown as unknown as Command;
export const newlineInCode: Command = baseNewlineInCode as unknown as Command;
export const exitCode: Command = baseExitCode as unknown as Command;
export const createParagraphNear: Command = baseCreateParagraphNear as unknown as Command;
export const liftEmptyBlock: Command = baseLiftEmptyBlock as unknown as Command;
export const splitBlock: Command = baseSplitBlock as unknown as Command;
export const splitBlockKeepMarks: Command = baseSplitBlockKeepMarks as unknown as Command;
export const selectParentNode: Command = baseSelectParentNode as unknown as Command;
export const selectAll: Command = baseSelectAll as unknown as Command;
export const selectTextblockStart: Command = baseSelectTextblockStart as unknown as Command;
export const selectTextblockEnd: Command = baseSelectTextblockEnd as unknown as Command;
export const backspace: Command = baseBackspace as unknown as Command;
export const del: Command = baseDel as unknown as Command;
export const selectHorizontallyBackward: Command = baseSelectHorizontallyBackward as unknown as Command;
export const selectHorizontallyForward: Command = baseSelectHorizontallyForward as unknown as Command;
export const selectVerticallyDown: Command = baseSelectVerticallyDown as unknown as Command;
export const selectVerticallyUp: Command = baseSelectVerticallyUp as unknown as Command;
export const stopNativeHorizontalDeleteBackward: Command = baseStopNativeHorizontalDeleteBackward as unknown as Command;
export const stopNativeHorizontalDeleteForward: Command = baseStopNativeHorizontalDeleteForward as unknown as Command;

// Command factories - cast to factory types
export const toggleMark: ToggleMarkFactory = baseToggleMark as unknown as ToggleMarkFactory;
export const setBlockType: SetBlockTypeFactory = baseSetBlockType as unknown as SetBlockTypeFactory;
export const wrapIn: WrapInFactory = baseWrapIn as unknown as WrapInFactory;
export const lift: Command = baseLift as unknown as Command;
export const autoJoin: AutoJoinFactory = baseAutoJoin as unknown as AutoJoinFactory;
export const chainCommands: ChainCommandsFactory = baseChainCommands as unknown as ChainCommandsFactory;
export const splitBlockAs: SplitBlockAsFactory = baseSplitBlockAs as unknown as SplitBlockAsFactory;
