import type {PmEditorState} from '../editor-state/PmEditorState';
import type {PmPlugin} from './PmPlugin';


export interface PmPluginKey<PluginState = any> {
    readonly key: string;

    /**
     * Get the active plugin with this key, if any, from an editor
     * state.
     */
    get(state: PmEditorState): PmPlugin<PluginState> | undefined;

    /**
     * Get the plugin's state from an editor state.
     */
    getState(state: PmEditorState): PluginState | undefined;
}
