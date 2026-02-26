import type {PmEditorView} from '../../view';
import type {PmEditorState} from '../editor-state/PmEditorState';

/**
 * A stateful object that can be installed in an editor by a
 * [plugin](#state.PluginSpec.view).
 */
export interface PluginView {
    /**
     * Called whenever the view's state is updated.
     */
    update?: (view: PmEditorView, prevState: PmEditorState) => void;

    /**
     * Called when the view is destroyed or receives a state
     * with different plugins.
     */
    destroy?: () => void;
}
