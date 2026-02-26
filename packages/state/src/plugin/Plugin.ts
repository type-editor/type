import type {EditorProps, PluginSpec, PmPlugin} from '@type-editor/editor-types';

import {EditorState} from '../editor-state/EditorState';
import {PluginBase} from './PluginBase';




/**
 * Plugins bundle functionality that can be added to an editor.
 * They are part of the [editor state](#state.EditorState) and
 * may influence that state and the view that contains it.
 */
export class Plugin<PluginState = any> extends PluginBase implements PmPlugin<PluginState> {

    private readonly pluginKey: string;
    private readonly pluginProps: EditorProps<Plugin<PluginState>> = {};
    private readonly pluginSpec: PluginSpec<PluginState>;

    /**
     * Create a plugin.
     * @param spec - The plugin's [spec object](#state.PluginSpec).
     */
    constructor(spec: PluginSpec<PluginState>) {
        super();
        this.pluginSpec = spec;
        if (spec.props) {
            this.bindProps(spec.props, this, this.pluginProps);
        }
        this.pluginKey = spec.key ? spec.key.key : this.createKey('plugin');
    }

    /**
     * The [props](#view.EditorProps) exported by this plugin.
     */
    get props(): EditorProps<Plugin<PluginState>> {
        return this.pluginProps;
    }

    get key(): string {
        return this.pluginKey;
    }

    get spec(): PluginSpec<PluginState> {
        return this.pluginSpec;
    }

    /**
     * Extract the plugin's state field from an editor state.
     */
    public getState(state: EditorState): PluginState | undefined {
        // Type guard to ensure state is an type-editor EditorState for backward compatibility
        if(EditorState.isEditorState(state)) {
            return state.getFieldPluginValue(this.pluginKey) as PluginState | undefined;
        }

        // Backward compatibility fallback for non-type-editor EditorState instances
        const obj = state as Record<string, unknown>;
        if (obj.fieldData) {
            if(obj.fieldData instanceof Map) {
                return obj.fieldData.get(this.pluginKey) as PluginState | undefined;
            }
            return obj.fieldData[this.pluginKey] as PluginState | undefined;
        }
        return state;
    }

    /**
     * Binds all functions in the props object to the plugin instance.
     * Handles nested objects recursively (e.g., handleDOMEvents).
     */
    private bindProps(obj: Record<string, any>,
                      self: any,
                      target: Record<string, any>): Record<string, any> {
        for (const prop in obj) {
            const value = obj[prop];
            target[prop] = this.bindPropValue(prop, value, self);
        }
        return target;
    }

    /**
     * Binds a single prop value, handling functions and nested objects.
     */
    private bindPropValue(propName: string, value: any, context: any): any {
        if (typeof value === 'function') {
            return value.bind(context);
        }

        if (propName === 'handleDOMEvents' && this.isPlainObject(value)) {
            return this.bindProps(value, context, {});
        }

        return value;
    }

    /**
     * Checks if a value is a plain object (not null, not an array).
     */
    private isPlainObject(value: any): boolean {
        return typeof value === 'object' && value !== null && !Array.isArray(value);
    }
}
