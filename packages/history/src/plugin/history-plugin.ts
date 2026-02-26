import type { PmEditorState, PmEditorView, PmTransaction } from '@type-editor/editor-types';
import { Plugin } from '@type-editor/state';

import { HistoryState } from '../state/HistoryState';
import type { HistoryOptions } from '../types/HistoryOptions';
import { applyTransaction } from './apply-transaction';
import { handleHistoryInputEvent } from './handle-history-input-event';
import { historyKey } from './history-plugin-key';

/**
 * Default configuration values for the history plugin.
 */
const DEFAULT_HISTORY_DEPTH = 100;
const DEFAULT_NEW_GROUP_DELAY = 500;

/**
 * Returns a plugin that enables the undo history for an editor. The
 * plugin will track undo and redo stacks, which can be used with the
 * [`undo`](#history.undo) and [`redo`](#history.redo) commands.
 * <br/>
 * You can set an `'addToHistory'` [metadata
 * property](#state.Transaction.setMeta) of `false` on a transaction
 * to prevent it from being rolled back by undo.
 *
 * @param config - Configuration options for the history plugin
 * @param config.depth - The amount of history events that are collected before the oldest events are discarded (default: 100)
 * @param config.newGroupDelay - The delay in milliseconds between changes after which a new group should be started (default: 500)
 * @returns A ProseMirror plugin that manages undo/redo history
 */
export function history(config: HistoryOptions = {}): Plugin {
    const normalizedConfig: Required<HistoryOptions> = {
        depth: config.depth ?? DEFAULT_HISTORY_DEPTH,
        newGroupDelay: config.newGroupDelay ?? DEFAULT_NEW_GROUP_DELAY
    };

    return new Plugin({
        key: historyKey,

        state: {
            init(): HistoryState {
                return HistoryState.createEmpty();
            },
            apply(transaction: PmTransaction, history: HistoryState, state: PmEditorState): HistoryState {
                return applyTransaction(history, state, transaction, normalizedConfig);
            }
        },

        config: normalizedConfig,

        props: {
            handleDOMEvents: {
                beforeinput(view: PmEditorView, event: Event): boolean {
                    return handleHistoryInputEvent(view, event as InputEvent);
                }
            }
        }
    });
}









