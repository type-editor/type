import type { CoreNodeViewSpec, CoreNodeViewUserOptions } from '@type-editor/adapter-core';
import type { ComponentType } from 'react';

/** A React component type used as the rendering target for a node view (receives no props). */
export type ReactNodeViewComponent = ComponentType<Record<string, never>>

/** Node view specification parameterised with a React component. */
export type ReactNodeViewSpec = CoreNodeViewSpec<ReactNodeViewComponent>

/** User options for creating a React-backed node view. */
export type ReactNodeViewUserOptions = CoreNodeViewUserOptions<ReactNodeViewComponent>
