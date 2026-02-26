import {DecorationSet} from '@type-editor/decoration';
import type {
    DecorationSource,
    EditorStateConfig,
    NodeView,
    PmDecoration,
    PmEditorState,
    PmEditorView,
    PmTransaction
} from '@type-editor/editor-types';
import type {PmNode} from '@type-editor/model';
import {Plugin} from '@type-editor/state';

import {tableNodeTypes} from '../schema';
import {TableView} from '../tableview/TableView';
import type {ColumnResizingOptions} from '../types/columnresizing/ColumnResizingOptions';
import {handleDecorations} from './column-resizing/handle-decorations';
import {handleMouseDown} from './column-resizing/handle-mouse-down';
import {handleMouseLeave} from './column-resizing/handle-mouse-leave';
import {handleMouseMove} from './column-resizing/handle-mouse-move';
import {columnResizingPluginKey} from './column-resizing-plugin-key';
import {NO_ACTIVE_HANDLE} from './no-active-handle';
import {ResizeState} from './ResizeState';


const defaultColumnResizingOptions: ColumnResizingOptions = {
    handleWidth: 5,
    cellMinWidth: 25,
    defaultCellMinWidth: 100,
    View: TableView,
    lastColumnResizable: true,
};


/**
 * Creates a plugin that allows users to resize table columns by dragging the edges
 * of column cells. The plugin provides visual feedback via decorations and updates
 * the column width attributes in the document.
 *
 * @param columnResizingOptions - Configuration options for the column resizing behavior.
 * @returns A ProseMirror plugin that handles column resizing.
 *
 * @example
 * ```typescript
 * const plugins = [
 *   columnResizing({
 *     handleWidth: 5,
 *     cellMinWidth: 25,
 *     lastColumnResizable: true,
 *   }),
 *   // ... other plugins
 * ];
 * ```
 */
export function columnResizing(columnResizingOptions: ColumnResizingOptions = {}): Plugin {
    // Merge user options with defaults
    const options = {...defaultColumnResizingOptions, ...columnResizingOptions};

    const plugin = new Plugin<ResizeState>({
        key: columnResizingPluginKey,
        state: {

            init(_: EditorStateConfig, state: PmEditorState): ResizeState {
                // Get the nodeViews record from the plugin spec
                const nodeViews: Record<string, (node: PmNode,
                                                 view: PmEditorView,
                                                 getPos: () => (number | undefined),
                                                 decorations: ReadonlyArray<PmDecoration>,
                                                 innerDecorations: DecorationSource) => NodeView> = plugin.spec?.props?.nodeViews;

                const tableName: string = tableNodeTypes(state.schema).table.name;
                // Register custom table node view if provided
                if (options.View && nodeViews) {
                    nodeViews[tableName] = (node: PmNode, view: PmEditorView): NodeView => {
                        return new options.View(node, options.defaultCellMinWidth, view);
                    };
                }
                // Initialize with no active handle and no dragging
                return new ResizeState(NO_ACTIVE_HANDLE, null);
            },

            apply(transaction: PmTransaction, prev: ResizeState): ResizeState {
                return prev.apply(transaction);
            },
        },
        props: {
            // Add resize-cursor class when a handle is active
            attributes: (state: PmEditorState): Record<string, string> => {
                const pluginState: ResizeState = columnResizingPluginKey.getState(state);
                return pluginState && pluginState.activeHandle > NO_ACTIVE_HANDLE
                    ? {class: 'resize-cursor'}
                    : {};
            },

            handleDOMEvents: {
                mousemove: (view: PmEditorView, event: MouseEvent): void => {
                    handleMouseMove(view, event, options.handleWidth, options.lastColumnResizable);
                },
                mouseleave: (view: PmEditorView) => {
                    handleMouseLeave(view);
                },
                mousedown: (view: PmEditorView, event: MouseEvent): void => {
                    handleMouseDown(view, event, options.cellMinWidth, options.defaultCellMinWidth);
                },
            },

            decorations: (state: PmEditorState): DecorationSet => {
                const pluginState: ResizeState = columnResizingPluginKey.getState(state);
                if (pluginState && pluginState.activeHandle > NO_ACTIVE_HANDLE) {
                    return handleDecorations(state, pluginState.activeHandle);
                }
                return DecorationSet.empty;
            },

            nodeViews: {},
        },
    });
    return plugin;
}














