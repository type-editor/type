import type { CoreNodeViewSpec, CoreNodeViewUserOptions } from '@type-editor/adapter-core';

import type { SvelteComponentConstructor } from '../types';

/** A Svelte component constructor used as the rendering target for a node view. */
export type SvelteNodeViewComponent = SvelteComponentConstructor

/** Node view specification parameterised with a Svelte component. */
export type SvelteNodeViewSpec = CoreNodeViewSpec<SvelteNodeViewComponent>

/** User options for creating a Svelte-backed node view. */
export type SvelteNodeViewUserOptions = CoreNodeViewUserOptions<SvelteNodeViewComponent>
