import type { CorePluginViewSpec, CorePluginViewUserOptions } from '@type-editor/adapter-core';
import type { ComponentType } from 'react';

/** A React component type used as the rendering target for a plugin view (receives no props). */
export type ReactPluginViewComponent = ComponentType<Record<string, never>>

/** Plugin view specification parameterised with a React component. */
export type ReactPluginViewSpec = CorePluginViewSpec<ReactPluginViewComponent>

/** User options for creating a React-backed plugin view. */
export type ReactPluginViewUserOptions = CorePluginViewUserOptions<ReactPluginViewComponent>
