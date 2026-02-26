import {type Mark, PmNode, type Schema} from '@type-editor/model';

import type {PmPlugin} from '../plugin/PmPlugin';
import type {PmTransaction} from '../PmTransaction';
import type {PmSelection} from '../selection/PmSelection';
import type {StateJSON} from './StateJSON';


export interface PmEditorState {

    readonly doc: PmNode;
    readonly selection: PmSelection;
    readonly scrollToSelection: number;
    readonly storedMarks: ReadonlyArray<Mark> | null;
    readonly schema: Schema;
    readonly plugins: ReadonlyArray<PmPlugin>;
    readonly transaction: PmTransaction;
    readonly tr: PmTransaction;

    /**
     * Get a plugin by its key.
     *
     * @param key - The unique key identifying the plugin
     * @returns The plugin instance, or undefined if not found
     */
    getPlugin(key: string): PmPlugin | undefined;

    /**
     * Get the value of a plugin field.
     *
     * @param key - The key of the plugin field to retrieve
     * @returns The value of the field, or undefined if not found
     */
    getFieldPluginValue(key: string): unknown;

    /**
     * Apply the given transaction to produce a new state.
     * This is a convenience method that calls applyTransaction and returns only the state.
     *
     * @param transaction - The transaction to apply
     * @returns A new editor state with the transaction applied
     */
    apply(transaction: PmTransaction): PmEditorState;

    /**
     * Verbose variant of [`apply`](#state.EditorState.apply) that
     * returns the precise transactions that were applied (which might
     * be influenced by the transaction hooks (filterTransaction, appendTransaction)
     * of plugins) along with the new state.
     *
     * The returned transactions array may contain additional transactions beyond the
     * root transaction if plugins' appendTransaction hooks added new transactions.
     *
     * @param rootTransaction - The initial transaction to apply
     * @returns An object containing the new state and array of all applied transactions
     */
    applyTransaction(rootTransaction: PmTransaction): {
        state: PmEditorState,
        transactions: ReadonlyArray<PmTransaction>;
    };

    /**
     * Create a new state based on this one, but with an adjusted set
     * of active plugins. State fields that exist in both sets of
     * plugins are kept unchanged. Those that no longer exist are
     * dropped, and those that are new are initialized using their
     * init method, passing in the new configuration object.
     *
     * The document, selection, and stored marks are preserved in the new state.
     *
     * @param config - Configuration object containing the new set of plugins
     * @param config.plugins - Optional array of plugins for the new state
     * @returns A new editor state with the reconfigured plugins
     */
    reconfigure(config: { plugins?: ReadonlyArray<PmPlugin>; }): PmEditorState;

    /**
     * Serialize this state to JSON. If you want to serialize the state
     * of plugins, pass an object mapping property names to use in the
     * resulting JSON object to plugin objects.
     *
     * Plugin field values are serialized using JSON.stringify unless they're numbers.
     * Built-in fields (doc, selection, storedMarks) are always serialized.
     *
     * @param pluginFields - Optional mapping of JSON property names to plugin instances for serializing plugin state
     * @returns A JSON representation of the state
     *
     * @example
     * ```typescript
     * const json = state.toJSON({ history: historyPlugin() });
     * ```
     */
    toJSON(pluginFields?: Readonly<Record<string, PmPlugin>>): StateJSON;
}
