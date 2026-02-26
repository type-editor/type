import type {CoreWidgetViewSpec, CoreWidgetViewUserOptions} from '@type-editor/adapter-core';
import type {DefineComponent} from 'vue';

/** A Vue component type used as the rendering target for a widget view. */
export type VueWidgetViewComponent = DefineComponent<any, any, any>

/** Widget view specification parameterised with a Vue component. */
export type VueWidgetViewSpec = CoreWidgetViewSpec<VueWidgetViewComponent>

/** User options for creating a Vue-backed widget view. */
export type VueWidgetViewUserOptions = CoreWidgetViewUserOptions<VueWidgetViewComponent>
