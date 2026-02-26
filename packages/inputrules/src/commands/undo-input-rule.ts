import type { Command, DispatchFunction, PmEditorState, PmPlugin, PmTransaction } from '@type-editor/editor-types';
import type {Mark} from '@type-editor/model';

import type {InputRulesPluginSpec} from '../types/InputRulesPluginSpec';
import type {PluginState} from '../types/PluginState';

/**
 * This is a command that will undo an input rule, if applying such a
 * rule was the last thing that the user did.
 *
 * @param state - The current editor state
 * @param dispatch - Function to dispatch the undo transaction
 * @returns `true` if an input rule was undone, `false` otherwise
 */
export const undoInputRule: Command = (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
    const inputRulesPlugin: PmPlugin = findInputRulesPlugin(state.plugins);
    if (!inputRulesPlugin) {
        return false;
    }

    const pluginState = inputRulesPlugin.getState(state) as PluginState;
    if (!pluginState) {
        return false;
    }

    if (dispatch) {
        const transaction: PmTransaction = state.transaction;
        const toUndo: PmTransaction = pluginState.transform;

        // Invert all steps from the original transformation
        for (let i = toUndo.steps.length - 1; i >= 0; i--) {
            transaction.step(toUndo.steps[i].invert(toUndo.docs[i]));
        }

        // Restore the original text that triggered the rule
        if (pluginState.text) {
            const marks: ReadonlyArray<Mark> = transaction.doc.resolve(pluginState.from).marks();
            transaction.replaceWith(
                pluginState.from,
                pluginState.to,
                state.schema.text(pluginState.text, marks)
            );
        } else {
            transaction.delete(pluginState.from, pluginState.to);
        }

        // Dispatching this transaction will automatically clear the plugin state
        // because the plugin's apply() function returns null when docChanged is true
        // and no new PluginState is set via transaction.setMeta().
        // The null value is stored in the fieldData Map, effectively clearing the state.
        dispatch(transaction);
    }

    return true;
};

/**
 * Finds the input rules plugin in the given array of plugins.
 *
 * @param plugins - Array of plugins to search
 * @returns The input rules plugin if found, undefined otherwise
 */
function findInputRulesPlugin(plugins: ReadonlyArray<PmPlugin>): PmPlugin | undefined {
    return plugins.find((plugin: PmPlugin): boolean => (plugin.spec as InputRulesPluginSpec).isInputRules);
}
