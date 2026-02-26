/**
 * This file defines the EditorState class, which represents the entire state of a ProseMirror editor.
 * The state is a persistent data structure, meaning that it is not mutated directly. Instead,
 * transactions are applied to an existing state to produce a new state.
 *
 * The state includes the document, the selection, the set of active marks, and any plugin-specific
 * state.
 */
import type {
    EditorStateConfig,
    EditorStateDto,
    PmEditorState,
    PmPlugin,
    PmSelection,
    PmTransaction,
    SelectionJSON,
    StateJSON
} from '@type-editor/editor-types';
import type {MarkJSON, NodeJSON, Schema,} from '@type-editor/model';
import {type Mark, PmNode} from '@type-editor/model';
import { nanoid } from 'nanoid';

import {Plugin} from '../plugin/Plugin';
import {Selection} from '../selection/Selection';
import {Transaction} from '../Transaction';
import {FieldDesc} from './FieldDesc';


/**
 * Configuration object wrapping the part of a state object that stays the same
 * across transactions. Stored in the state's `config` property.
 */
export interface EditorStateConfiguration {
    /** Array of field descriptors including both built-in and plugin fields */
    fields: ReadonlyArray<FieldDesc<unknown>>;
    /** Array of active plugins */
    plugins: ReadonlyArray<Plugin>;
    /** Map of plugin keys to plugin instances for fast lookup */
    pluginsMap: ReadonlyMap<string, Plugin>;
    /** The document schema */
    schema: Schema
}

/**
 * Tracks the processing state of a plugin during transaction application.
 * Used to ensure each plugin only processes transactions it hasn't seen yet.
 */
interface PluginProcessingInfo {
    /** The current editor state after this plugin's transactions have been applied */
    state: EditorState;
    /** Number of transactions this plugin has already processed */
    processedTransactions: number;
}


/**
 * The state of a ProseMirror editor is represented by an object of
 * this type. A state is a persistent data structure—it isn't
 * updated, but rather a new state value is computed from an old one
 * using the [`apply`](#state.EditorState.apply) method.
 *
 * A state holds a number of built-in fields, and plugins can
 * [define](#state.PluginSpec.state) additional fields.
 */
export class EditorState implements PmEditorState {

    /** Configuration object containing schema, plugins, and field descriptors */
    private readonly config: EditorStateConfiguration;
    /** Map storing plugin-specific field data */
    private readonly fieldData = new Map<string, unknown>();

    /**
     * The current document.
     */
    private readonly _doc: PmNode;
    /**
     * The current selection.
     */
    private readonly _selection: PmSelection;
    /** Marks to be applied to the next input, or null if none */
    private readonly _storedMarks: ReadonlyArray<Mark> | null;
    /** Counter incremented when a transaction requests scrolling the selection into view */
    private readonly _scrollToSelection: number;

    /**
     * Constructor for EditorState. Should not be called directly - use EditorState.create() or EditorState.fromJSON() instead.
     *
     * @param config - The editor state configuration containing schema, plugins, and field descriptors
     * @param editorStateDto - The initial state data including document, selection, stored marks, and field data
     * @param isUpdate - If true, treats this as an update operation (applying a transaction); if false, treats as new state creation
     * @throws {RangeError} If editorStateDto is null/undefined or if isUpdate is true but transaction is missing
     */
    constructor(config: EditorStateConfiguration,
                editorStateDto: EditorStateDto,
                isUpdate = false) {

        this.config = config;

        if (!editorStateDto) {
            throw new RangeError('EditorState constructor requires editorStateDto');
        }

        if (editorStateDto.fieldData) {
            editorStateDto.fieldData.forEach((value: unknown, name): void => {
                this.fieldData.set(name, value);
            });
        }

        if (isUpdate) {
            if (!editorStateDto.transaction) {
                throw new RangeError('EditorState constructor with UPDATE type requires transaction in editorStateDto');
            }

            const transaction: PmTransaction = editorStateDto.transaction;
            this._doc = transaction.doc || editorStateDto.doc;
            this._selection = transaction.selection || editorStateDto.selection;
            this._storedMarks = this._selection.$cursor ? transaction.storedMarks : editorStateDto.storedMarks;
            this._scrollToSelection = transaction.scrolledIntoView ? editorStateDto.scrollToSelection + 1 : editorStateDto.scrollToSelection;

            this.updateFields(editorStateDto);
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            this._doc = editorStateDto.doc || this.config.schema.topNodeType.createAndFill({id: nanoid()});
            this._selection = editorStateDto.selection || Selection.atStart(this._doc);
            this._storedMarks = editorStateDto.storedMarks ?? null;
            this._scrollToSelection = editorStateDto.scrollToSelection ?? 0;

            this.initializeFields();
        }


    }

    get type(): string {
        return 'EditorState';
    }

    /**
     * The current document.
     */
    get doc(): PmNode {
        return this._doc;
    }

    /**
     * The current selection.
     */
    get selection(): PmSelection {
        return this._selection;
    }

    /**
     * Counter that is incremented whenever a transaction with scrolledIntoView set is applied.
     * Used by the view to detect when it should scroll the selection into view.
     */
    get scrollToSelection(): number {
        return this._scrollToSelection;
    }

    /**
     * A set of marks to apply to the next input. Will be null when
     * no explicit marks have been set.
     */
    get storedMarks(): ReadonlyArray<Mark> | null {
        return this._storedMarks;
    }

    /**
     * The schema of the state's document.
     */
    get schema(): Schema {
        return this.config.schema;
    }

    /**
     * The plugins that are active in this state.
     */
    get plugins(): ReadonlyArray<Plugin> {
        return this.config.plugins;
    }

    /**
     * Accessor that constructs and returns a new [transaction](#state.Transaction) from this state.
     */
    get transaction(): Transaction {
        return new Transaction(this);
    }

    /**
     * @deprecated use transaction
     */
    get tr(): Transaction {
        return this.transaction;
    }

    /**
     * Deserialize a JSON representation of a state. The `config` parameter should
     * have at least a `schema` field, and should contain an array of
     * plugins to initialize the state with. `pluginFields` can be used
     * to deserialize the state of plugins, by associating plugin instances
     * with property names in the JSON object.
     *
     * @param config - Configuration object with at least a schema field and optionally plugins
     * @param config.schema - The schema to use for deserializing the document
     * @param config.plugins - Optional array of plugins to initialize the state with
     * @param json - The JSON representation of the state to deserialize
     * @param pluginFields - Optional mapping of property names to plugin instances for deserializing plugin state
     * @returns A new EditorState instance deserialized from the JSON
     * @throws {RangeError} If json is invalid or schema is missing
     *
     * @example
     * ```typescript
     * const state = EditorState.fromJSON(
     *   { schema: mySchema, plugins: [historyPlugin()] },
     *   { doc: {...}, selection: {...} },
     *   { history: historyPlugin() }
     * );
     * ```
     */
    public static fromJSON(config: { schema: Schema, plugins?: ReadonlyArray<PmPlugin>; },
                           json: StateJSON,
                           pluginFields?: Readonly<Record<string, Plugin>>): EditorState {
        if (!json) {
            throw new RangeError('Invalid input for EditorState.fromJSON');
        }
        if (!config.schema) {
            throw new RangeError('Required config field \'schema\' missing');
        }

        const stateConfig: EditorStateConfiguration = EditorState.createConfig(config.schema, config.plugins);
        const doc: PmNode | undefined = json.doc ? PmNode.fromJSON(config.schema, json.doc) : undefined;
        const initStateConfig: EditorStateDto = {
            doc,
            selection: json.selection && doc ? Selection.fromJSON(doc, json.selection) : undefined,
            storedMarks: json.storedMarks ? json.storedMarks.map(config.schema.markFromJSON) : undefined,
            scrollToSelection: json.scrollToSelection ?? 0,
            fieldData: new Map<string, unknown>()
        };

        const editorState = new EditorState(stateConfig, initStateConfig);

        // Initialize plugin field values from JSON
        if (pluginFields && typeof pluginFields === 'object') {
            const editorStateConfig: EditorStateConfig = {
                doc: initStateConfig.doc,
                selection: initStateConfig.selection,
                storedMarks: initStateConfig.storedMarks,
                schema: config.schema
            };

            EditorState.readFieldPluginValueFromJSON(pluginFields, json, editorState, editorStateConfig);
        }

        return editorState;
    }

    /**
     * Create a new editor state from a configuration object.
     * This is the recommended way to create a new state.
     *
     * @param config - Configuration object containing the schema, initial document, selection, plugins, etc.
     * @returns A new EditorState instance
     *
     * @example
     * ```typescript
     * const state = EditorState.create({
     *   schema: mySchema,
     *   doc: mySchema.node('doc', null, [mySchema.node('paragraph')]),
     *   plugins: [historyPlugin(), keymap()]
     * });
     * ```
     */
    public static create(config: EditorStateConfig): EditorState {
        const schema: Schema = config.doc ? config.doc.type.schema : config.schema;
        const initStateConfig: EditorStateDto = {
            doc: config.doc,
            selection: config.selection,
            storedMarks: config.storedMarks,
            scrollToSelection: 0,
            fieldData: new Map<string, unknown>()
        };

        const plugins: ReadonlyArray<Plugin> = config.plugins as ReadonlyArray<Plugin>;
        return new EditorState(EditorState.createConfig(schema, plugins), initStateConfig);
    }

    /**
     * Creates an EditorStateConfiguration object from a schema and plugins array.
     * This method combines built-in field descriptors with plugin-provided field descriptors.
     *
     * @param schema - The schema to use for this configuration
     * @param plugins - Optional array of plugins to include in the configuration
     * @returns A new EditorStateConfiguration object
     * @throws {RangeError} If multiple instances of the same keyed plugin are provided
     */
    public static createConfig(schema: Schema, plugins?: ReadonlyArray<PmPlugin>): EditorStateConfiguration {
        const configFields: Array<FieldDesc<unknown>> = new Array<FieldDesc<unknown>>();
        const configPlugins: Array<Plugin> = [];
        const configPluginsMap = new Map<string, Plugin>();

        if (plugins) {
            plugins.forEach((plugin: Plugin): void => {
                configPlugins.push(plugin);
                configPluginsMap.set(plugin.key, plugin);

                if (plugin.spec.state) {
                    configFields.push(new FieldDesc<unknown>(plugin.key, plugin.spec.state, plugin));
                }
            });
        }

        return {
            schema,
            fields: configFields,
            plugins: configPlugins,
            pluginsMap: configPluginsMap
        };
    }

    public static isEditorState(value: unknown): value is EditorState {
        if (!value || typeof value !== 'object') {
            return false;
        }

        const obj = value as Record<string, unknown>;
        return obj.type === 'EditorState';
    }

    /**
     * Read and deserialize plugin field values from JSON.
     * For each plugin field, calls the plugin's fromJSON method if available, or parses the value directly.
     *
     * @param pluginFields - Mapping of JSON property names to plugin instances
     * @param json - The JSON object containing serialized state
     * @param editorState - The editor state being constructed
     * @param editorStateConfig - Configuration for initializing plugin state
     */
    private static readFieldPluginValueFromJSON(pluginFields: Readonly<Record<string, Plugin>>,
                                                json: StateJSON,
                                                editorState: EditorState,
                                                editorStateConfig: EditorStateConfig): void {
        if (pluginFields && typeof pluginFields === 'object') {
            for (const pluginFieldName in pluginFields) {
                const fieldPlugin: Plugin = pluginFields[pluginFieldName];
                const fieldName: string = fieldPlugin.key;

                // check if the field plugin exists in the list of field plugins
                // and if there is a value for the field name in json
                if (editorState.config.fields.find((fieldDescPlugin: FieldDesc<unknown>): boolean => fieldDescPlugin.name === fieldName)
                    && json[pluginFieldName] !== undefined) {

                    // read the field value from json
                    const fieldValue = json[pluginFieldName] as string | NodeJSON | SelectionJSON | Array<MarkJSON> | number | undefined;
                    let deserializedValue: unknown;

                    // Call plugin's fromJSON if it exists
                    if (fieldPlugin.spec.state?.fromJSON) {
                        deserializedValue = fieldPlugin.spec.state.fromJSON(
                            editorStateConfig,
                            fieldValue,
                            editorState
                        );
                    } else {
                        // Parse string values as JSON
                        if (typeof fieldValue === 'string') {
                            deserializedValue = JSON.parse(fieldValue);
                        } else {
                            deserializedValue = fieldValue;
                        }
                    }

                    editorState.fieldData.set(fieldName, deserializedValue);
                }
            }
        }
    }


    /**
     * Get a plugin by its key.
     *
     * @param key - The unique key identifying the plugin
     * @returns The plugin instance, or undefined if not found
     */
    public getPlugin(key: string): Plugin | undefined {
        return this.config.pluginsMap.get(key);
    }

    /**
     * Get the value of a plugin field.
     *
     * @param key - The key of the plugin field to retrieve
     * @returns The value of the field, or undefined if not found
     */
    public getFieldPluginValue(key: string): unknown {
        return this.fieldData.get(key);
    }

    /**
     * Apply the given transaction to produce a new state.
     * This is a convenience method that calls applyTransaction and returns only the state.
     *
     * @param transaction - The transaction to apply
     * @returns A new editor state with the transaction applied
     */
    public apply(transaction: Transaction): EditorState {
        return this.applyTransaction(transaction).state;
    }

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
    public applyTransaction(rootTransaction: Transaction): {
        state: EditorState,
        transactions: ReadonlyArray<Transaction>;
    } {
        if (!this.filterTransaction(rootTransaction)) {
            return {state: this, transactions: []};
        }

        const transactions: Array<Transaction> = [rootTransaction];
        let newState: EditorState = this.applyInner(rootTransaction);
        const pluginProcessingState = new Map<number, PluginProcessingInfo>();

        // This loop repeatedly gives plugins a chance to respond to
        // transactions as new transactions are added, ensure to only
        // pass the transactions the plugin did not see before.
        while (this.executePluginsAppendTransactions(transactions,
            newState, pluginProcessingState, rootTransaction)) {
            // Continue processing while plugins add new transactions
            newState = pluginProcessingState.get(this.plugins.length - 1)?.state || newState;
        }

        // After the loop exits, extract the final state from the last plugin's processing state
        // This is necessary because the last iteration (which returns false) still updates the state
        if (pluginProcessingState.size > 0) {
            newState = pluginProcessingState.get(this.plugins.length - 1)?.state || newState;
        }

        return {
            state: newState,
            transactions: transactions as unknown as ReadonlyArray<Transaction>
        };
    }

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
    public reconfigure(config: { plugins?: ReadonlyArray<Plugin>; }): EditorState {
        const editorStateDto: EditorStateDto = {
            ...this.cloneState(),
            fieldData: new Map<string, unknown>()
        };

        return new EditorState(EditorState.createConfig(this.schema, config.plugins), editorStateDto);
    }

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
    public toJSON(pluginFields?: Readonly<Record<string, PmPlugin>>, onlyDocument = false): StateJSON {
        if(onlyDocument) {
            return {doc: this._doc.toJSON()};
        } else {
            const result: StateJSON = {doc: this._doc.toJSON(), selection: this._selection.toJSON()};
            result.storedMarks = this.storedMarks?.map((mark: Mark): MarkJSON => mark.toJSON());

            if (pluginFields && typeof pluginFields === 'object') {
                for (const prop in pluginFields) {
                    const pluginKey: string = pluginFields[prop].key;
                    if (this.fieldData.has(pluginKey)) {
                        const value: unknown = this.fieldData.get(pluginKey);
                        result[prop] = typeof value === 'number' ? value : JSON.stringify(value);
                    }
                }
            }
            return result;
        }
    }

    /**
     * Process all plugins' appendTransaction hooks.
     * Each plugin is given the transactions it hasn't seen yet and can optionally
     * append a new transaction in response. This process continues until no more
     * transactions are added.
     *
     * @param transactions - Array of all transactions applied so far
     * @param currentState - The current editor state after applying transactions
     * @param pluginProcessingState - Map tracking which transactions each plugin has processed
     * @param rootTransaction - The original root transaction that started this application
     * @returns true if any plugin added a transaction, false otherwise
     */
    private executePluginsAppendTransactions(transactions: Array<Transaction>,
                                             currentState: EditorState,
                                             pluginProcessingState: Map<number, PluginProcessingInfo>,
                                             rootTransaction: Transaction): boolean {
        let transactionWasAdded = false;

        for (let i = 0; i < this.plugins.length; i++) {
            const plugin: PmPlugin = this.plugins[i];

            // Always update processing state for all plugins (not just those with appendTransaction)
            // This ensures we properly track state even for plugins without appendTransaction
            if (!plugin.spec.appendTransaction) {
                pluginProcessingState.set(i, {
                    state: currentState,
                    processedTransactions: transactions.length
                });
                continue;
            }

            const processingInfo: PluginProcessingInfo = pluginProcessingState.get(i);
            const processedCount: number = processingInfo?.processedTransactions ?? 0;
            const oldState: EditorState = processingInfo?.state ?? this;

            const appendedTransaction: Transaction = this.tryAppendPluginTransaction(
                plugin,
                transactions,
                processedCount,
                oldState,
                currentState,
                i,
                rootTransaction
            );

            if (appendedTransaction) {
                transactions.push(appendedTransaction);
                currentState = currentState.applyInner(appendedTransaction);
                transactionWasAdded = true;
            }

            pluginProcessingState.set(i, {
                state: currentState,
                processedTransactions: transactions.length
            });
        }

        return transactionWasAdded;
    }

    /**
     * Try to get an appended transaction from a plugin.
     * Calls the plugin's appendTransaction hook with only the transactions it hasn't
     * processed yet. The returned transaction is filtered and marked with metadata.
     *
     * @param plugin - The plugin to call appendTransaction on
     * @param allTransactions - Array of all transactions applied so far
     * @param processedCount - Number of transactions this plugin has already processed
     * @param oldState - The editor state before this plugin's new transactions
     * @param newState - The current editor state
     * @param pluginIndex - The index of this plugin in the plugins array
     * @param rootTransaction - The original root transaction
     * @returns The appended transaction if successful and passed filtering, null otherwise
     */
    private tryAppendPluginTransaction(plugin: PmPlugin,
                                       allTransactions: Array<PmTransaction>,
                                       processedCount: number,
                                       oldState: EditorState,
                                       newState: EditorState,
                                       pluginIndex: number,
                                       rootTransaction: PmTransaction): Transaction | null {
        if (processedCount >= allTransactions.length || !plugin.spec.appendTransaction) {
            return null;
        }

        const remainingTransactions: Array<PmTransaction> = processedCount > 0
            ? allTransactions.slice(processedCount)
            : allTransactions;

        const appendedTransaction = plugin.spec.appendTransaction.call(
            plugin,
            remainingTransactions,
            oldState,
            newState
        ) as Transaction | null;

        if (!appendedTransaction || !newState.filterTransaction(appendedTransaction, pluginIndex)) {
            return null;
        }

        appendedTransaction.setMeta('appendedTransaction', rootTransaction);
        return appendedTransaction;
    }

    /**
     * Filters a transaction through all plugins to determine if it should be applied.
     * Each plugin's filterTransaction hook is called. If any returns false, the
     * transaction is rejected.
     *
     * @param transaction - The transaction to filter
     * @param ignore - Plugin index to skip (used to avoid recursive filtering when a plugin appends a transaction)
     * @returns true if the transaction should be applied, false if any plugin rejected it
     */
    private filterTransaction(transaction: Transaction, ignore = -1): boolean {
        for (let i = 0; i < this.config.plugins.length; i++) {
            if (i !== ignore) {
                const plugin: PmPlugin = this.config.plugins[i];
                if (plugin.spec.filterTransaction && !plugin.spec.filterTransaction.call(plugin, transaction, this)) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Apply a transaction to produce a new state without running plugin hooks.
     * This is the core method that actually creates the new state by updating all field values.
     *
     * @param transaction - The transaction to apply
     * @returns A new editor state with the transaction applied
     * @throws {RangeError} If the transaction's before document doesn't match this state's document
     */
    private applyInner(transaction: Transaction): EditorState {
        if (!transaction.before.eq(this._doc)) {
            throw new RangeError('Applying a mismatched transaction');
        }

        const updateStateConfig: EditorStateDto = {
            ...this.cloneState(),
            transaction,
            oldState: this,
        };

        return new EditorState(this.config, updateStateConfig, true);
    }

    private cloneState(): EditorStateDto {
        return {
            doc: this._doc,
            selection: this._selection,
            storedMarks: this._storedMarks,
            scrollToSelection: this._scrollToSelection,
            fieldData: new Map(this.fieldData)
        };
    }

    /**
     * Initialize all field values using their init functions.
     * Calls init() on each field descriptor and stores the result.
     */
    private initializeFields(): void {
        if (!this.config.fields?.length) {
            return;
        }

        const editorStateConfig: EditorStateConfig = {
            ...this.cloneState(),
            schema: this.config.schema
        };

        for (const field of this.config.fields) {
            const value = field.init(editorStateConfig, this) as PmNode | PmSelection | ReadonlyArray<Mark> | number | null;
            this.setFieldValue(value, field.name);
        }
    }

    /**
     * Update all field values using their apply functions.
     * Calls apply() on each field descriptor with the transaction and previous value,
     * then stores the new value.
     *
     * @param editorStateDto - The state DTO containing the transaction and old state for updating fields
     */
    private updateFields(editorStateDto: EditorStateDto): void {
        if (!this.config.fields?.length) {
            return;
        }

        for (const field of this.config.fields) {
            const currentValue = editorStateDto.fieldData.get(field.name);
            const newValue = field.apply(editorStateDto.transaction as Transaction, currentValue, editorStateDto.oldState as EditorState || this, this) as PmNode | PmSelection | ReadonlyArray<Mark> | number | null;
            this.setFieldValue(newValue, field.name);
        }
    }

    /**
     * Set a field value based on the field name.
     * The Plugin fields are stored in the fieldData map anc can be accessed externally using getFieldPluginValue().
     *
     * Note: storedMarks can be null (indicating no stored marks), so null is a valid value
     * for that field. Plugin state can also be null to indicate cleared state.
     * Only undefined values are skipped for all fields.
     *
     * @param value - The value to set (type depends on the field)
     * @param fieldName - The name of the field to set
     */
    private setFieldValue(value: PmNode | PmSelection | ReadonlyArray<Mark> | number | null, fieldName: string): void {
        // Plugin-specific fields - allow null values but skip undefined
        if (value === undefined) {
            return;
        }
        this.fieldData.set(fieldName, value);
    }
}
