import type { CoreNodeViewSpec, CoreNodeViewUserOptions } from '@type-editor/adapter-core';
import type { DefineComponent } from 'vue';

/** A Vue component type used as the rendering target for a node view. */
export type VueNodeViewComponent = DefineComponent<any, any, any>

/** Node view specification parameterised with a Vue component. */
export type VueNodeViewSpec = CoreNodeViewSpec<VueNodeViewComponent>

/** User options for creating a Vue-backed node view. */
export type VueNodeViewUserOptions = CoreNodeViewUserOptions<VueNodeViewComponent>
