/**
 * This file defines a plugin that handles the drawing of cell
 * selections and the basic user interactions for creating and working
 * with such selections. It also makes sure that, after each
 * transaction, the shapes of tables are normalized to be rectangular
 * and not contain overlapping cells.
 */
import {isUndefinedOrNull} from '@type-editor/commons';
import type {PmEditorState, PmEditorView, PmSelection, PmTransaction} from '@type-editor/editor-types';
import {Plugin} from '@type-editor/state';

import {drawCellSelection} from './cellselection/draw-cell-selection';
import {normalizeSelection} from './cellselection/normalize-selection';
import {fixTables} from './fixtables/fix-tables';
import {handleKeyDown} from './input/handle-key-down';
import {handleMouseDown} from './input/handle-mouse-down';
import {handlePaste} from './input/handle-paste';
import {handleTripleClick} from './input/handle-triple-click';
import {tableEditingPluginKey} from './table-editing-plugin-key';
import type {TableEditingOptions} from './types/TableEditingOptions';

/**
 * Creates a [plugin](http://prosemirror.net/docs/ref/#state.Plugin)
 * that, when added to an editor, enables cell-selection, handles
 * cell-based copy/paste, and makes sure tables stay well-formed (each
 * row has the same width, and cells don't overlap).
 *
 * You should probably put this plugin near the end of your array of
 * plugins, since it handles mouse and arrow key events in tables
 * rather broadly, and other plugins, like the gap cursor or the
 * column-width dragging plugin, might want to get a turn first to
 * perform more specific behavior.
 *
 * @param allowTableNodeSelection
 */
export function tableEditingPlugin({allowTableNodeSelection}: TableEditingOptions = {}): Plugin {
    return new Plugin({

        key: tableEditingPluginKey,

        // This piece of state is used to remember when a mouse-drag
        // cell-selection is happening, so that it can continue even as
        // transactions (which might move its anchor cell) come in.
        state: {
            init() {
                return null;
            },
            apply(transaction: PmTransaction, cur: number): number {
                const set: number = transaction.getMeta(tableEditingPluginKey) as number;
                if (!isUndefinedOrNull(set)) {
                    return set === -1 ? null : set;
                }

                if (isUndefinedOrNull(cur) || !transaction.docChanged) {
                    return cur;
                }

                const {deleted, pos} = transaction.mapping.mapResult(cur);
                return deleted ? null : pos;
            },
        },

        props: {
            decorations: drawCellSelection,

            handleDOMEvents: {
                mousedown: handleMouseDown,
            },

            createSelectionBetween(view: PmEditorView): PmSelection {
                return !isUndefinedOrNull(tableEditingPluginKey.getState(view.state))
                    ? view.state.selection
                    : null;
            },

            handleTripleClick,

            handleKeyDown,

            handlePaste,
        },

        appendTransaction(_: ReadonlyArray<PmTransaction>, oldState: PmEditorState, state: PmEditorState): PmTransaction {
            return normalizeSelection(
                state,
                fixTables(state, oldState),
                allowTableNodeSelection,
            );
        },
    });
}
