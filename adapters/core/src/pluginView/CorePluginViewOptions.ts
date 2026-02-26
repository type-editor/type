import type {PluginSpec, PmEditorState, PmEditorView} from '@type-editor/editor-types';

/**
 * Internal specification object passed to the {@link CorePluginView} constructor.
 *
 * @typeParam Component - The UI component type used by the concrete framework adapter.
 */
export interface CorePluginViewSpec<Component> {
    /** The ProseMirror editor view. */
    view: PmEditorView
    /** User-supplied configuration. */
    options: CorePluginViewUserOptions<Component>
}

/**
 * User-facing configuration for a core plugin view.
 *
 * @typeParam Component - The UI component type used by the concrete framework adapter.
 */
export interface CorePluginViewUserOptions<Component> {
    /** The framework component to render. */
    component: Component
    /**
     * Returns the DOM element the plugin view should be rendered into.
     *
     * @param viewDOM - The editor's root DOM element.
     * @returns The target container element.
     */
    root?: (viewDOM: HTMLElement) => HTMLElement
    /**
     * Called after every ProseMirror transaction.
     *
     * @param view - The (possibly updated) editor view.
     * @param prevState - The editor state before the transaction.
     */
    update?: (view: PmEditorView, prevState: PmEditorState) => void
    /** Called when the plugin view is destroyed. */
    destroy?: () => void
}

/** The `view` portion of a ProseMirror {@link PluginSpec}. */
export type PluginViewSpec = Required<PluginSpec<unknown>>['view']
