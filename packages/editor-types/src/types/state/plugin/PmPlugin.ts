import type {EditorProps} from '../../view';
import type {PmEditorState} from '../editor-state/PmEditorState';
import type {PluginSpec} from './PluginSpec';


/**
 * Plugins bundle functionality that can be added to an editor.
 * They are part of the [editor state](#state.EditorState) and
 * may influence that state and the view that contains it.
 */
export interface PmPlugin<PluginState = any> {

    readonly props: EditorProps<PmPlugin<PluginState>>;
    readonly key: string;
    readonly spec: PluginSpec<PluginState>;

    /**
     * Extract the plugin's state field from an editor state.
     */
    getState(state: PmEditorState): PluginState | undefined;
}
