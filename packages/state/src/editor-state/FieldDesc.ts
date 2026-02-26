import type {
    EditorStateConfig,
    StateField,
    StateFieldApplyFunction,
    StateFieldInitFunction
} from '@type-editor/editor-types';

import type {Transaction} from '../Transaction';
import type {EditorState} from './EditorState';

/**
 * Descriptor for a state field that can be initialized and updated.
 * Wraps the init and apply functions from a StateField specification,
 * binding them to an optional context object (typically a plugin instance).
 *
 * This class serves as an adapter that manages the lifecycle of state fields,
 * ensuring proper initialization and updates when transactions are applied.
 * It handles function binding when a context object is provided, allowing
 * StateField methods to maintain their expected `this` context.
 *
 * @template T - The type of the value stored in this state field
 *
 * @internal
 */
export class FieldDesc<T> {

    /**
     * The unique identifier for this field, used as a key in the state object.
     */
    private readonly fieldName: string;

    /**
     * The bound initialization function for this field.
     */
    private readonly initFunc: StateFieldInitFunction<T>;

    /**
     * The bound apply function for computing new field values on transactions.
     */
    private readonly applyFunc: StateFieldApplyFunction<T>;

    /**
     * Creates a new field descriptor. This class acts as a wrapper around a given StateField
     * to allow calling the init and apply functions with a given context.
     *
     * The constructor validates that the provided StateField contains the required `init` and
     * `apply` functions. If a context object is provided via the `self` parameter, the functions
     * will be bound to that context, ensuring they can access their expected `this` binding.
     *
     * @param name - The name of the field (used as a key in the state object). This should be
     *               unique across all fields in an editor state.
     * @param stateField - The StateField specification containing init and apply functions.
     *                     Both functions are required and will be validated at construction time.
     * @param self - Optional context object to bind the functions to (typically a plugin instance).
     *               When provided, both init and apply functions will be bound to this context.
     *
     * @throws {TypeError} If the stateField is null/undefined or missing required init/apply functions
     */
    constructor(name: string, stateField: StateField<T>, self?: unknown) {
        this.fieldName = name;

        if (!stateField || typeof stateField.init !== 'function' || typeof stateField.apply !== 'function') {
            throw new TypeError(`StateField for "${name}" must provide "init" and "apply" functions`);
        }

        const {initFunc, applyFunc} = this.initFieldDesc(stateField, self);
        this.initFunc = initFunc;
        this.applyFunc = applyFunc;
    }

    /**
     * Gets the unique name/identifier of this field.
     *
     * @returns The field name used as a key in the editor state object
     */
    get name(): string {
        return this.fieldName;
    }

    /**
     * Initializes the field value when creating a new editor state.
     *
     * This method is called during editor state construction to compute the initial
     * value for this field. The provided configuration and partially-constructed state
     * instance are passed to the underlying init function.
     *
     * @param config - The configuration object passed to EditorState.create, containing
     *                 settings like schema, doc, selection, plugins, etc.
     * @param instance - A partially-initialized editor state instance. Note that fields
     *                   initialized after this one will not yet have their values set.
     *
     * @returns The initial value for this state field
     */
    public init(config: EditorStateConfig, instance: EditorState): T {
        return this.initFunc(config, instance);
    }

    /**
     * Computes the new field value when a transaction is applied to the editor state.
     *
     * This method is called during transaction application to update the field's value
     * based on the changes in the transaction. The field can examine the transaction,
     * its current value, and both the old and new states to determine the updated value.
     *
     * @param transaction - The transaction being applied, containing steps, metadata, and
     *                      other changes to be processed
     * @param value - The current value of this field in the old state
     * @param oldState - The editor state before the transaction is applied
     * @param newState - A partially-constructed new editor state. Fields that come after
     *                   this one in the field list will not yet have their values computed.
     *
     * @returns The new value for this state field after applying the transaction
     */
    public apply(transaction: Transaction,
                 value: T,
                 oldState: EditorState,
                 newState: EditorState): T {
        return this.applyFunc(transaction, value, oldState, newState);
    }


    /**
     * Prepares the init and apply functions from the StateField, optionally binding them
     * to a context object.
     *
     * This method handles the function binding logic: if a context object is provided,
     * both functions are bound to it so they can access their expected `this` binding
     * when called. Otherwise, the original functions are returned as-is.
     *
     * @param stateField - The StateField specification containing init and apply functions
     * @param self - Optional context object to bind the functions to. When provided,
     *               functions will be called with this object as their `this` context.
     *
     * @returns An object containing the init and apply functions, properly typed and
     *          optionally bound to the provided context
     *
     * @private
     */
    private initFieldDesc(stateField: StateField<T>, self?: unknown): { initFunc: StateFieldInitFunction<T>; applyFunc: StateFieldApplyFunction<T>; } {
        // Call init function with `self` (e.g. myPlugin) as context like `myPlugin.init(anyParams)`
        if (self) {
            return {
                initFunc: stateField.init.bind(self) as StateFieldInitFunction<T>,
                applyFunc: stateField.apply.bind(self) as StateFieldApplyFunction<T>,
            };
        }

        // Call function directly like `init(anyParams)`
        return { initFunc: stateField.init, applyFunc: stateField.apply };
    }
}
