/**
 * @type-editor-compat/menu
 *
 * Compatibility layer for @type-editor/menu providing ProseMirror-compatible type signatures.
 *
 * Re-exports menu plugin and components with concrete type signatures.
 */

import {
    blockTypeItem as baseBlockTypeItem,
    MenuItem as BaseMenuItem,
    wrapItem as baseWrapItem,
} from '@type-editor/menu';
import type {IconSpec} from '@type-editor/menu';
import type {
    EditorState as BaseEditorState,
    EditorView,
    Plugin as BasePlugin,
    Transaction as BaseTransaction,
} from '@type-editor-compat/state';
import type {Attrs, NodeType} from '@type-editor-compat/model';

// Define concrete types locally
export type EditorState = BaseEditorState;
export type Transaction = BaseTransaction;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Plugin<T = any> = BasePlugin<T>;

// Re-export from base module
export type {IconSpec, MenuBarOptions, MenuElement} from '@type-editor/menu';
export {
    Dropdown,
    DropdownSubmenu,
    icons,
    joinUpItem,
    liftItem,
    menuBar,
    menuBarPlugin,
    redoItem,
    renderGrouped,
    selectParentNodeItem,
    undoItem,
} from '@type-editor/menu';

// ============================================================================
// MenuItemSpec - Override with concrete types
// ============================================================================

/**
 * The configuration object passed to the MenuItem constructor.
 */
export interface MenuItemSpec {
    run: (state: EditorState, dispatch: (transaction: Transaction) => void, view: EditorView, event: Event) => void;
    select?: (state: EditorState) => boolean;
    enable?: (state: EditorState) => boolean;
    active?: (state: EditorState) => boolean;
    render?: (view: EditorView) => HTMLElement;
    icon?: IconSpec;
    label?: string;
    title?: string | ((state: EditorState) => string);
    class?: string;
    css?: string;
}

// ============================================================================
// MenuItem - Override with concrete types accepting compat MenuItemSpec
// ============================================================================

/**
 * A MenuItem that accepts the compat {@link MenuItemSpec} with concrete editor types.
 */
export class MenuItem extends BaseMenuItem {
    constructor(spec: MenuItemSpec) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        super(spec as any);
    }
}

// ============================================================================
// blockTypeItem / wrapItem - Override with compat NodeType
// ============================================================================

/**
 * Build a menu item for changing the type of the textblock around the
 * selection to the given type. Accepts the compat {@link NodeType}.
 */
export function blockTypeItem(
    nodeType: NodeType,
    options: Partial<MenuItemSpec> & { attrs?: Attrs | null }
): MenuItem {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return baseBlockTypeItem(nodeType as any, options as any) as unknown as MenuItem;
}

/**
 * Build a menu item for wrapping the selection in a given node type.
 * Accepts the compat {@link NodeType}.
 */
export function wrapItem(
    nodeType: NodeType,
    options: Partial<MenuItemSpec> & { attrs?: Attrs | null }
): MenuItem {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return baseWrapItem(nodeType as any, options as any) as unknown as MenuItem;
}

