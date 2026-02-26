import type {EditorStateConfig} from '../editor-state/EditorStateConfig';
import type {PmEditorState} from '../editor-state/PmEditorState';
import type {PmTransaction} from '../PmTransaction';


export type StateFieldInitFunction<T> = (config: EditorStateConfig, instance: PmEditorState) => T;
export type StateFieldApplyFunction<T> = (transaction: PmTransaction, value: T, oldState: PmEditorState, newState: PmEditorState) => T;


/**
 * A plugin spec may provide a state field (under its
 * [`state`](#state.PluginSpec.state) property) of this type, which
 * describes the state it wants to keep. Functions provided here are
 * always called with the plugin instance as their `this` binding.
 */
export interface StateField<T> {

    /**
     * Initialize the value of the field. `config` will be the object
     * passed to [`EditorState.create`](#state.EditorState^create). Note
     * that `instance` is a half-initialized state instance, and will
     * not have values for plugin fields initialized after this one.
     */
    init: StateFieldInitFunction<T>;

    /**
     * Apply the given transaction to this state field, producing a new
     * field value. Note that the `newState` argument is again a partially
     * constructed state does not yet contain the state from plugins
     * coming after this one.
     */
    apply: StateFieldApplyFunction<T>;

    /**
     * Convert this field to JSON. Optional, can be left off to disable
     * JSON serialization for the field.
     */
    toJSON?: (value: T) => any;

    /**
     * Deserialize the JSON representation of this field. Note that the
     * `state` argument is again a half-initialized state.
     */
    fromJSON?: (config: EditorStateConfig, value: any, state: PmEditorState) => T;
}
