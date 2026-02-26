import type { CoreMarkViewSpec, CoreMarkViewUserOptions } from '@type-editor/adapter-core';
import type { DefineComponent } from 'vue';

/** A Vue component type used as the rendering target for a mark view. */
export type VueMarkViewComponent = DefineComponent<any, any, any>

/** Mark view specification parameterised with a Vue component. */
export type VueMarkViewSpec = CoreMarkViewSpec<VueMarkViewComponent>

/** User options for creating a Vue-backed mark view. */
export type VueMarkViewUserOptions = CoreMarkViewUserOptions<VueMarkViewComponent>
