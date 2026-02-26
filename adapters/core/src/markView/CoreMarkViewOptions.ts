import type {PmEditorView, ViewMutationRecord} from '@type-editor/editor-types';
import type {Mark} from '@type-editor/model';

/**
 * Describes how to create the DOM element for a mark view.
 *
 * - A `string` is used as a tag name for `document.createElement`.
 * - An `HTMLElement` is used as-is.
 * - A function receives the current mark and must return an element.
 */
export type MarkViewDOMSpec = string | HTMLElement | ((mark: Mark) => HTMLElement)

/**
 * User-facing configuration for a core mark view.
 *
 * @typeParam Component - The UI component type used by the concrete framework adapter.
 */
export interface CoreMarkViewUserOptions<Component> {
    // DOM
    /** Specification for the outer DOM element. Defaults to `<span>` (inline) or `<div>` (block). */
    as?: MarkViewDOMSpec
    /** Specification for the content DOM element. */
    contentAs?: MarkViewDOMSpec

    // Component
    /** The framework component to render inside this mark view. */
    component: Component

    // Overrides
    /**
     * Custom handler for deciding whether to ignore a DOM mutation.
     * Return `true` to ignore, `false` to let ProseMirror handle it,
     * or `undefined` to fall back to the default behaviour.
     *
     * @param mutation - The observed DOM mutation record.
     */
    ignoreMutation?: (mutation: ViewMutationRecord) => boolean | undefined
    /** Called when the mark view is destroyed. */
    destroy?: () => void
}

/**
 * Internal specification object passed to the {@link CoreMarkView} constructor.
 *
 * @typeParam Component - The UI component type used by the concrete framework adapter.
 */
export interface CoreMarkViewSpec<Component> {
    /** The ProseMirror mark. */
    mark: Mark
    /** The ProseMirror editor view. */
    view: PmEditorView
    /** Whether this mark appears in an inline context. */
    inline: boolean
    /** User-supplied configuration. */
    options: CoreMarkViewUserOptions<Component>
}
