import type {PmEditorState, PmPlugin, PmTransaction} from '../../state';
import type {EditorProps} from './EditorProps';

/**
 * The props object given directly to the editor view supports some
 * fields that can't be used in plugins:
 */
export interface DirectEditorProps extends EditorProps {
    /**
     * The current state of the editor.
     */
    state: PmEditorState;

    /**
     * A set of plugins to use in the view, applying their [plugin
     * view](#state.PluginSpec.view) and
     * [props](#state.PluginSpec.props). Passing plugins with a state
     * component (a [state field](#state.PluginSpec.state) field or a
     * [transaction](#state.PluginSpec.filterTransaction) filter or
     * appender) will result in an error, since such plugins must be
     * present in the state to work.
     */
    plugins?: ReadonlyArray<PmPlugin>;

    /**
     * The callback over which to send transactions (state updates)
     * produced by the view. If you specify this, you probably want to
     * make sure this ends up calling the view's
     * [`updateState`](#view.EditorView.updateState) method with a new
     * state that has the transaction
     * [applied](#state.EditorState.apply). The callback will be bound to have
     * the view instance as its `this` binding.
     */
    dispatchTransaction?: (transaction: PmTransaction) => void;
}
