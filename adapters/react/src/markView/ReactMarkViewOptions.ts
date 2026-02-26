import type { CoreMarkViewSpec, CoreMarkViewUserOptions } from '@type-editor/adapter-core';
import type { ComponentType } from 'react';

/** A React component type used as the rendering target for a mark view (receives no props). */
export type ReactMarkViewComponent = ComponentType<Record<string, never>>

/** Mark view specification parameterised with a React component. */
export type ReactMarkViewSpec = CoreMarkViewSpec<ReactMarkViewComponent>

/** User options for creating a React-backed mark view. */
export type ReactMarkViewUserOptions = CoreMarkViewUserOptions<ReactMarkViewComponent>
