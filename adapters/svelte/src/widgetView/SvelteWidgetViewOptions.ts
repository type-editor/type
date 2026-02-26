import type { CoreWidgetViewSpec, CoreWidgetViewUserOptions } from '@type-editor/adapter-core';

import type { SvelteComponentConstructor } from '../types';

/** A Svelte component constructor used as the rendering target for a widget view. */
export type SvelteWidgetViewComponent = SvelteComponentConstructor

/** Widget view specification parameterised with a Svelte component. */
export type SvelteWidgetViewSpec = CoreWidgetViewSpec<SvelteWidgetViewComponent>

/** User options for creating a Svelte-backed widget view. */
export type SvelteWidgetViewUserOptions = CoreWidgetViewUserOptions<SvelteWidgetViewComponent>
