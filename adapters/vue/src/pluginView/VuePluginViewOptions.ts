import type {CorePluginViewSpec, CorePluginViewUserOptions} from '@type-editor/adapter-core';
import type {DefineComponent} from 'vue';

/** A Vue component type used as the rendering target for a plugin view. */
export type VuePluginViewComponent = DefineComponent<any, any, any>

/** Plugin view specification parameterised with a Vue component. */
export type VuePluginViewSpec = CorePluginViewSpec<VuePluginViewComponent>

/** User options for creating a Vue-backed plugin view. */
export type VuePluginViewUserOptions = CorePluginViewUserOptions<VuePluginViewComponent>
