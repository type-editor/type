import type {EditorProps, PmEditorView} from '../../view';
import type {PmEditorState} from '../editor-state/PmEditorState';
import type {PmTransaction} from '../PmTransaction';
import type {PluginView} from './PluginView';
import type {PmPlugin} from './PmPlugin';
import type {PmPluginKey} from './PmPluginKey';
import type {StateField} from './StateField';

/**
 * This is the type passed to the [`Plugin`](#state.Plugin)
 * constructor. It provides a definition for a plugin.
 */
export interface PluginSpec<PluginState> {
    /**
     * The [view props](#view.EditorProps) added by this plugin. Props
     * that are functions will be bound to have the plugin instance as
     * their `this` binding.
     */
    props?: EditorProps<PmPlugin<PluginState>>;

    /**
     * Allows a plugin to define a [state field](#state.StateField), an
     * extra slot in the state object in which it can keep its own data.
     */
    state?: StateField<PluginState>;

    /**
     * Can be used to make this a keyed plugin. You can have only one
     * plugin with a given key in a given state, but it is possible to
     * access the plugin's configuration and state through the key,
     * without having access to the plugin instance object.
     */
    key?: PmPluginKey;

    /**
     * When the plugin needs to interact with the editor view, or
     * set something up in the DOM, use this field. The function
     * will be called when the plugin's state is associated with an
     * editor view.
     */
    view?: (view: PmEditorView) => PluginView;

    /**
     * When present, this will be called before a transaction is
     * applied by the state, allowing the plugin to cancel it (by
     * returning false).
     */
    filterTransaction?: (transaction: PmTransaction, state: PmEditorState) => boolean;

    /**
     * Allows the plugin to append another transaction to be applied
     * after the given array of transactions. When another plugin
     * appends a transaction after this was called, it is called again
     * with the new state and new transactions—but only the new
     * transactions, i.e. it won't be passed transactions that it
     * already saw.
     */
    appendTransaction?: (transactions: ReadonlyArray<PmTransaction>, oldState: PmEditorState, newState: PmEditorState) => PmTransaction | null | undefined;

    /**
     * Additional properties are allowed on plugin specs, which can be
     * read via [`Plugin.spec`](#state.Plugin.spec).
     */
    // TODO: use Map instead
    [key: string]: any;
}
