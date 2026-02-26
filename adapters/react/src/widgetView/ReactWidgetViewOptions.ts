import type { CoreWidgetViewSpec, CoreWidgetViewUserOptions } from '@type-editor/adapter-core';
import type { ComponentType } from 'react';

/** A React component type used as the rendering target for a widget view (receives no props). */
export type ReactWidgetViewComponent = ComponentType<Record<string, never>>

/** Widget view specification parameterised with a React component. */
export type ReactWidgetViewSpec = CoreWidgetViewSpec<ReactWidgetViewComponent>

/** User options for creating a React-backed widget view. */
export type ReactWidgetViewUserOptions = CoreWidgetViewUserOptions<ReactWidgetViewComponent>
