import type { CorePluginViewSpec, CorePluginViewUserOptions } from '@type-editor/adapter-core';

import type { SvelteComponentConstructor } from '../types';

/** A Svelte component constructor used as the rendering target for a plugin view. */
export type SveltePluginViewComponent = SvelteComponentConstructor

/** Plugin view specification parameterised with a Svelte component. */
export type SveltePluginViewSpec = CorePluginViewSpec<SveltePluginViewComponent>

/** User options for creating a Svelte-backed plugin view. */
export type SveltePluginViewUserOptions = CorePluginViewUserOptions<SveltePluginViewComponent>
