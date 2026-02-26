/**
 * @type-editor-compat/view
 *
 * Compatibility layer for @type-editor/view providing ProseMirror-compatible type signatures.
 *
 * This module re-exports all classes from @type-editor/view with augmented TypeScript types
 * that use concrete class references instead of interface types.
 */

import { DecorationGroup as _DecorationGroup, DecorationSet as _DecorationSetClass } from '@type-editor/decoration';
import type { StateJSON } from '@type-editor/editor-types';
import { DOMObserver as BaseDOMObserver, EditorView as BaseEditorView } from '@type-editor/view';
import type { Mark, PmNode, Schema } from '@type-editor-compat/model';
import {
    type CompatDecorationGroupConstructor,
    type CompatDecorationSetConstructor,
    type CompatDecorationSetInstance,
    EditorState as BaseEditorState,
    type EditorStateConfiguration,
    Plugin as BasePlugin,
    PluginKey as BasePluginKey,
    Selection as BaseSelection,
    Transaction as BaseTransaction,
} from '@type-editor-compat/state';

// ============================================================================
// Re-export state types with concrete signatures
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Plugin<T = any> = BasePlugin<T>;
export type Transaction = BaseTransaction;
export type Selection = BaseSelection;

// ============================================================================
// PluginKey Interface - Override with concrete types
// ============================================================================

/**
 * PluginKey with concrete type references instead of Pm* interfaces.
 * This ensures getState() returns PluginState instead of unknown.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PluginKey<PluginState = any> {
    readonly key: string;

    /**
     * Get the active plugin with this key, if any, from an editor state.
     */
    get(state: BaseEditorState): Plugin<PluginState> | undefined;

    /**
     * Get the plugin's state from an editor state.
     */
    getState(state: BaseEditorState): PluginState | undefined;
}

// ============================================================================
// Re-export all shared interface types from state compat.
// These are declared once in state compat (the canonical source) and
// re-exported here so consumers can import them from either module.
// Having a single declaration eliminates structural mismatches between
// e.g. EditorProps.decorations (EditorState vs BaseEditorState) and
// ensures PluginView / EditorView are always the same type.
// ============================================================================

export type {
    DecorationSource,
    DirectEditorProps,
    EditorProps,
    MarkView,
    MarkViewConstructor,
    NodeView,
    NodeViewConstructor,
    PluginView,
} from '@type-editor-compat/state';

// ============================================================================
// Constructor Types
// ============================================================================

interface EditorViewConstructor {
    // eslint-disable-next-line @typescript-eslint/prefer-function-type
    new(
        place: null | Node | ((editor: HTMLElement) => void) | { mount: HTMLElement },
        props: import('@type-editor-compat/state').DirectEditorProps
    ): import('@type-editor-compat/state').EditorView;
}

interface EditorStateConstructor {
    new(
        config: EditorStateConfiguration,
        editorStateDto: import('@type-editor/editor-types').EditorStateDto,
        isUpdate?: boolean
    ): BaseEditorState;

    fromJSON(
        config: { schema: Schema; plugins?: ReadonlyArray<Plugin> },
        json: StateJSON,
        pluginFields?: Readonly<Record<string, Plugin>>
    ): BaseEditorState;

    create(config: {
        schema: Schema;
        doc?: PmNode;
        selection?: Selection;
        storedMarks?: ReadonlyArray<Mark>;
        plugins?: ReadonlyArray<Plugin>;
    }): BaseEditorState;

    createConfig(
        schema: Schema,
        plugins?: ReadonlyArray<Plugin>
    ): EditorStateConfiguration;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PluginKeyConstructor = new<T = any>(name?: string) => PluginKey<T>;

// ============================================================================
// Class Exports - Runtime values with augmented types
// ============================================================================

// export const EditorView: EditorViewConstructor = BaseEditorView as unknown as EditorViewConstructor;
export const EditorView: EditorViewConstructor = BaseEditorView as unknown as EditorViewConstructor;
export type EditorView = import('@type-editor-compat/state').EditorView;
export const EditorState: EditorStateConstructor = BaseEditorState as unknown as EditorStateConstructor;
export const Plugin = BasePlugin;
export const PluginKey: PluginKeyConstructor = BasePluginKey as unknown as PluginKeyConstructor;
export const Transaction = BaseTransaction;
export const Selection = BaseSelection;
export const DOMObserver = BaseDOMObserver;

// ============================================================================
// DecorationSet / DecorationGroup - compat types using PmNode from compat/model
// Interfaces are declared in state compat (canonical source) and re-exported
// here. Only the runtime values (constructors) live in view compat since the
// actual classes come from @type-editor/decoration.
// ============================================================================

export type {
    CompatDecorationGroupConstructor,
    CompatDecorationGroupInstance,
    CompatDecorationSetConstructor,
    CompatDecorationSetInstance,
} from '@type-editor-compat/state';

export const DecorationSet: CompatDecorationSetConstructor = _DecorationSetClass as unknown as CompatDecorationSetConstructor;
export type DecorationSet = CompatDecorationSetInstance;


export const DecorationGroup: CompatDecorationGroupConstructor = _DecorationGroup as unknown as CompatDecorationGroupConstructor;

// ============================================================================
// Type Re-exports from base modules
// ============================================================================

export type {
    DOMEventMap,
    DOMSelectionRange,
    NodeViewSet,
    PmDOMObserver,
    ViewMutationRecord,
} from '@type-editor/editor-types';
export type {Mark} from '@type-editor/model';

// Re-export from dom-change-util module
export {readDOMChange} from '@type-editor/dom-change-util';

// Re-export from dom-coords-util module
export type {StoredScrollPos} from '@type-editor/dom-coords-util';
export {
    coordsAtPos,
    endOfTextblock,
    focusPreventScroll,
    posAtCoords,
    resetScrollPos,
    scrollRectIntoView,
    storeScrollPos,
} from '@type-editor/dom-coords-util';

// Re-export from dom-util module
export type {
    DecorationAttrs,
    WidgetConstructor
} from '@type-editor/decoration';
export {
    Decoration,
    DecorationFactory,
    viewDecorations
} from '@type-editor/decoration';
export {
    clearReusedRange,
    deepActiveElement,
    domIndex,
    hasBlockDesc,
    isEquivalentPosition,
    isOnEdge,
    nodeSize,
    parentNode,
    textNodeAfter,
    textNodeBefore,
    textRange,
} from '@type-editor/dom-util';
export type {
    DecorationSpec,
    DecorationWidgetOptions,
    InlineDecorationOptions,
    NodeDecorationOptions,
} from '@type-editor/editor-types';
export {
    CustomNodeViewDesc,
    docViewDesc,
    MarkViewDesc,
    NodeViewDesc,
    TextViewDesc,
    ViewDesc,
    ViewDescUpdater,
    ViewDescUtil,
} from '@type-editor/viewdesc';

// Re-export from selection-util module
export {
    anchorInRightPlace,
    caretFromPoint,
    hasFocusAndSelection,
    selectionBetween,
    selectionCollapsed,
    selectionFromDOM,
    selectionToDOM,
    syncNodeSelection,
} from '@type-editor/selection-util';

