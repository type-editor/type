import type { CoreMarkViewSpec, CoreMarkViewUserOptions } from '@type-editor/adapter-core';

import type { SvelteComponentConstructor } from '../types';

/** A Svelte component constructor used as the rendering target for a mark view. */
export type SvelteMarkViewComponent = SvelteComponentConstructor

/** Mark view specification parameterised with a Svelte component. */
export type SvelteMarkViewSpec = CoreMarkViewSpec<SvelteMarkViewComponent>

/** User options for creating a Svelte-backed mark view. */
export type SvelteMarkViewUserOptions = CoreMarkViewUserOptions<SvelteMarkViewComponent>
