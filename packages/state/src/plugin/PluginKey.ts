import type {PmEditorState, PmPlugin, PmPluginKey} from '@type-editor/editor-types';

import {EditorState} from '../editor-state/EditorState';
import {PluginBase} from './PluginBase';


/**
 * A key is used to [tag](#state.PluginSpec.key) plugins in a way
 * that makes it possible to find them, given an editor state.
 * Assigning a key does mean only one plugin of that type can be
 * active in a state.
 */
export class PluginKey<PluginState = any> extends PluginBase implements PmPluginKey<PluginState> {

    private readonly pluginKey: string;

    /**
     * Create a plugin key.
     */
    constructor(name = 'key') {
        super();
        this.pluginKey = this.createKey(name);
    }

    get key(): string {
        return this.pluginKey;
    }

    /**
     * Get the active plugin with this key, if any, from an editor
     * state.
     */
    public get(state: PmEditorState): PmPlugin<PluginState> | undefined {
        // Type guard to ensure state is an type-editor EditorState for backward compatibility
        if(EditorState.isEditorState(state)) {
            return state.getPlugin(this.pluginKey);
        }

        // Backward compatibility fallback for non-type-editor EditorState instances
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const obj = state as unknown as Record<string, any>;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (obj.config && obj.config.pluginsMap instanceof Map) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
            return obj.config.pluginsMap.get(this.pluginKey) as PmPlugin<PluginState> | undefined;
        }
        return undefined;
    }

    /**
     * Get the plugin's state from an editor state.
     */
    public getState(state: PmEditorState): PluginState | undefined {
        // Type guard to ensure state is an type-editor EditorState for backward compatibility
        if(EditorState.isEditorState(state)) {
            return state.getFieldPluginValue(this.pluginKey) as PluginState | undefined;
        }

        // Backward compatibility fallback for non-type-editor EditorState instances
        const obj = state as unknown as Record<string, unknown>;
        if (obj.fieldData) {
            if(obj.fieldData instanceof Map) {
                return obj.fieldData.get(this.pluginKey) as PluginState | undefined;
            }
            return obj.fieldData[this.pluginKey] as PluginState | undefined;
        }
        return state as PluginState | undefined;

    }
}
